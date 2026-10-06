"use server";

import { requireAdmin } from "@/lib/require-admin";
import * as profile from "@/lib/services/profile";

export type FormState = { status: "idle" | "error" | "success"; message?: string; errors?: Record<string, string[]> };

export async function saveProfile(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await profile.saveProfile({
    fullName: fd.get("fullName"),
    headline: fd.get("headline"),
    tagline: fd.get("tagline"),
    bio: fd.get("bio"),
    location: fd.get("location"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    avatarUrl: fd.get("avatarUrl"),
    resumeUrl: fd.get("resumeUrl"),
    availableForWork: fd.get("availableForWork") === "true",
  });
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  return { status: "success", message: "Profile saved." };
}

export async function addSocialLink(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await profile.addSocialLink({
    label: fd.get("label"),
    url: fd.get("url"),
    icon: fd.get("icon"),
    order: fd.get("order"),
  });
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  return { status: "success", message: "Link added." };
}

export async function deleteSocialLink(id: string) {
  await requireAdmin();
  await profile.deleteSocialLink(id);
}
