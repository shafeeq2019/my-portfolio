"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { skillSchema } from "@/lib/validations";

export type FormState = { status: "idle" | "error"; message?: string; errors?: Record<string, string[]> };

function parse(formData: FormData) {
  return skillSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    level: formData.get("level") ?? 3,
    icon: formData.get("icon") ?? "",
    order: formData.get("order") ?? 0,
    published: formData.get("published") === "true",
  });
}

export async function createSkill(_p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { status: "error", message: "Please fix the errors.", errors: parsed.error.flatten().fieldErrors };
  await prisma.skill.create({ data: { ...parsed.data, icon: parsed.data.icon || null } });
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
  redirect("/admin/skills");
}

export async function updateSkill(id: string, _p: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { status: "error", message: "Please fix the errors.", errors: parsed.error.flatten().fieldErrors };
  await prisma.skill.update({ where: { id }, data: { ...parsed.data, icon: parsed.data.icon || null } });
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
}
