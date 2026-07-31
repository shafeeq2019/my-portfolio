"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { experienceSchema } from "@/lib/validations";

export type FormState = { status: "idle" | "error"; message?: string; errors?: Record<string, string[]> };

function parse(formData: FormData) {
  const highlights = String(formData.get("highlights") ?? "")
    .split("\n")
    .map((h) => h.trim())
    .filter(Boolean);

  return experienceSchema.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    location: formData.get("location") ?? "",
    employmentType: formData.get("employmentType") ?? "",
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") ?? "",
    current: formData.get("current") === "true",
    description: formData.get("description"),
    highlights,
    companyUrl: formData.get("companyUrl") ?? "",
    logoUrl: formData.get("logoUrl") ?? "",
    order: formData.get("order") ?? 0,
    published: formData.get("published") === "true",
  });
}

function toData(d: NonNullable<ReturnType<typeof parse>["data"]>) {
  return {
    company: d.company,
    role: d.role,
    location: d.location || null,
    employmentType: d.employmentType || null,
    startDate: new Date(d.startDate),
    endDate: d.current || !d.endDate ? null : new Date(d.endDate),
    current: d.current,
    description: d.description,
    highlights: d.highlights ?? "[]",
    companyUrl: d.companyUrl || null,
    logoUrl: d.logoUrl || null,
    order: d.order,
    published: d.published,
  };
}

export async function createExperience(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { status: "error", message: "Please fix the errors.", errors: parsed.error.flatten().fieldErrors };
  await prisma.experience.create({ data: toData(parsed.data) });
  revalidatePath("/admin/experience");
  revalidatePath("/experience");
  redirect("/admin/experience");
}

export async function updateExperience(id: string, _p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { status: "error", message: "Please fix the errors.", errors: parsed.error.flatten().fieldErrors };
  await prisma.experience.update({ where: { id }, data: toData(parsed.data) });
  revalidatePath("/admin/experience");
  revalidatePath("/experience");
  redirect("/admin/experience");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/admin/experience");
  revalidatePath("/experience");
}
