import type { z } from "zod";
import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";
import { invalid, orNull, type ServiceResult } from "./result";
import { revalidateSite } from "./revalidate";

export type SkillInput = Partial<Record<keyof z.input<typeof skillSchema>, unknown>>;

function validate(input: SkillInput) {
  return skillSchema.safeParse({ ...input, level: input.level ?? 3, icon: input.icon ?? "", order: input.order ?? 0 });
}

export function listSkills() {
  return prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
}

export function getSkill(id: string) {
  return prisma.skill.findUnique({ where: { id } });
}

export async function createSkill(input: SkillInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = validate(input);
  if (!parsed.success) return invalid(parsed.error);
  const skill = await prisma.skill.create({ data: { ...parsed.data, icon: orNull(parsed.data.icon) } });
  revalidateSite();
  return { ok: true, data: { id: skill.id } };
}

export async function updateSkill(id: string, input: SkillInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = validate(input);
  if (!parsed.success) return invalid(parsed.error);
  await prisma.skill.update({ where: { id }, data: { ...parsed.data, icon: orNull(parsed.data.icon) } });
  revalidateSite();
  return { ok: true, data: { id } };
}

export async function deleteSkill(id: string) {
  await prisma.skill.delete({ where: { id } });
  revalidateSite();
}
