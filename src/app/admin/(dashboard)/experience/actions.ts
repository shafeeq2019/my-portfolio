"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import * as experience from "@/lib/services/experience";

export type FormState = { status: "idle" | "error"; message?: string; errors?: Record<string, string[]> };

function readForm(formData: FormData): experience.ExperienceInput {
  const highlights = String(formData.get("highlights") ?? "")
    .split("\n")
    .map((h) => h.trim())
    .filter(Boolean);

  return {
    company: formData.get("company"),
    role: formData.get("role"),
    location: formData.get("location"),
    employmentType: formData.get("employmentType"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    current: formData.get("current") === "true",
    description: formData.get("description"),
    highlights,
    companyUrl: formData.get("companyUrl"),
    logoUrl: formData.get("logoUrl"),
    order: formData.get("order"),
    published: formData.get("published") === "true",
  };
}

export async function createExperience(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await experience.createExperience(readForm(formData));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/experience");
}

export async function updateExperience(id: string, _p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await experience.updateExperience(id, readForm(formData));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/experience");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await experience.deleteExperience(id);
}
