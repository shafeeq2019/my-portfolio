"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { rateLimit, hashIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendContactNotification } from "@/lib/email";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    company: String(formData.get("company") ?? ""), // honeypot
    token: String(formData.get("cf-turnstile-response") ?? ""),
  };

  // 1) Validate
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // 2) Honeypot — silently accept to not tip off bots.
  if (parsed.data.company) {
    return { status: "success", message: "Thanks! Your message has been sent." };
  }

  // 3) Rate limit by hashed IP (5 messages / 10 min)
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!limit.success) {
    return {
      status: "error",
      message: "Too many messages. Please try again in a little while.",
    };
  }

  // 4) CAPTCHA (Turnstile) — no-op if not configured
  const captchaOk = await verifyTurnstile(parsed.data.token, ip === "unknown" ? undefined : ip);
  if (!captchaOk) {
    return { status: "error", message: "CAPTCHA verification failed. Please retry." };
  }

  // 5) Persist
  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        ipHash: ip === "unknown" ? null : hashIp(ip),
        userAgent: hdrs.get("user-agent")?.slice(0, 300) ?? null,
      },
    });

    // 6) Notify (best-effort — don't fail the request on email errors)
    await sendContactNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    }).catch((e) => console.error("[contact] email failed:", e));

    return {
      status: "success",
      message: "Thanks! Your message has been sent — I'll get back to you soon.",
    };
  } catch (e) {
    console.error("[contact] persist failed:", e);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again later.",
    };
  }
}
