"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { profileSchema, socialLinkSchema } from "@/lib/validations";

export type FormState = { status: "idle" | "error" | "success"; message?: string; errors?: Record<string, string[]> };

async function getProfileId() {
  const existing = await prisma.profile.findFirst();
  return existing?.id ?? null;
}

export async function saveProfile(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = profileSchema.safeParse({
    fullName: fd.get("fullName"),
    headline: fd.get("headline"),
    tagline: fd.get("tagline") ?? "",
    bio: fd.get("bio"),
    location: fd.get("location") ?? "",
    email: fd.get("email"),
    phone: fd.get("phone") ?? "",
    avatarUrl: fd.get("avatarUrl") ?? "",
    resumeUrl: fd.get("resumeUrl") ?? "",
    availableForWork: fd.get("availableForWork") === "true",
  });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", errors: parsed.error.flatten().fieldErrors };
  }

  const data = {
    ...parsed.data,
    tagline: parsed.data.tagline || null,
    location: parsed.data.location || null,
    phone: parsed.data.phone || null,
    avatarUrl: parsed.data.avatarUrl || null,
    resumeUrl: parsed.data.resumeUrl || null,
  };

  const id = await getProfileId();
  if (id) {
    await prisma.profile.update({ where: { id }, data });
  } else {
    await prisma.profile.create({ data });
  }

  revalidatePath("/", "layout");
  return { status: "success", message: "Profile saved." };
}

export async function addSocialLink(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = socialLinkSchema.safeParse({
    label: fd.get("label"),
    url: fd.get("url"),
    icon: fd.get("icon"),
    order: fd.get("order") ?? 0,
  });
  if (!parsed.success) return { status: "error", message: "Invalid link.", errors: parsed.error.flatten().fieldErrors };

  const id = await getProfileId();
  if (!id) {
    return { status: "error", message: "Save your profile first before adding links." };
  }
  await prisma.socialLink.create({ data: { ...parsed.data, profileId: id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/profile");
  return { status: "success", message: "Link added." };
}

export async function deleteSocialLink(id: string) {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/profile");
}
