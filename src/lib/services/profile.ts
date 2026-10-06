import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { prisma } from "@/lib/prisma";
import { profileSchema, socialLinkSchema } from "@/lib/validations";
import { invalid, orNull, type ServiceResult } from "./result";

/** The site has a single profile row; it is created on first save. */

export type ProfileInput = Partial<Record<keyof z.input<typeof profileSchema>, unknown>>;
export type SocialLinkInput = Partial<Record<keyof z.input<typeof socialLinkSchema>, unknown>>;

function revalidateProfile() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/profile");
}

export function getProfile() {
  return prisma.profile.findFirst({ include: { socialLinks: { orderBy: { order: "asc" } } } });
}

export async function saveProfile(input: ProfileInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = profileSchema.safeParse({
    ...input,
    tagline: input.tagline ?? "",
    location: input.location ?? "",
    phone: input.phone ?? "",
    avatarUrl: input.avatarUrl ?? "",
    resumeUrl: input.resumeUrl ?? "",
  });
  if (!parsed.success) return invalid(parsed.error);

  const data = {
    ...parsed.data,
    tagline: orNull(parsed.data.tagline),
    location: orNull(parsed.data.location),
    phone: orNull(parsed.data.phone),
    avatarUrl: orNull(parsed.data.avatarUrl),
    resumeUrl: orNull(parsed.data.resumeUrl),
  };

  const existing = await prisma.profile.findFirst({ select: { id: true } });
  const profile = existing
    ? await prisma.profile.update({ where: { id: existing.id }, data })
    : await prisma.profile.create({ data });

  revalidateProfile();
  return { ok: true, data: { id: profile.id } };
}

export async function addSocialLink(input: SocialLinkInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = socialLinkSchema.safeParse({ ...input, order: input.order ?? 0 });
  if (!parsed.success) return invalid(parsed.error, "Invalid link.");

  const profile = await prisma.profile.findFirst({ select: { id: true } });
  if (!profile) return { ok: false, message: "Save your profile first before adding links." };

  const link = await prisma.socialLink.create({ data: { ...parsed.data, profileId: profile.id } });
  revalidateProfile();
  return { ok: true, data: { id: link.id } };
}

export function getSocialLink(id: string) {
  return prisma.socialLink.findUnique({ where: { id } });
}

export async function deleteSocialLink(id: string) {
  await prisma.socialLink.delete({ where: { id } });
  revalidateProfile();
}
