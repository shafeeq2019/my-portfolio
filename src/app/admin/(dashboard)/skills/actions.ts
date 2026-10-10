"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import * as skills from "@/lib/services/skills";

export type FormState = { status: "idle" | "error"; message?: string; errors?: Record<string, string[]> };

function readForm(formData: FormData): skills.SkillInput {
  return {
    name: formData.get("name"),
    category: formData.get("category"),
    level: formData.get("level"),
    icon: formData.get("icon"),
    order: formData.get("order"),
    published: formData.get("published") === "true",
  };
}

export async function createSkill(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await skills.createSkill(readForm(formData));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/skills");
}

export async function updateSkill(id: string, _p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await skills.updateSkill(id, readForm(formData));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await skills.deleteSkill(id);
}
