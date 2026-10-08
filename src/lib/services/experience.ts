import type { z } from "zod";
import { prisma } from "@/lib/prisma";
import { experienceSchema } from "@/lib/validations";
import { invalid, orNull, type ServiceResult } from "./result";
import { revalidateSite } from "./revalidate";

export type ExperienceInput = Partial<Record<keyof z.input<typeof experienceSchema>, unknown>>;

function validate(input: ExperienceInput) {
  return experienceSchema.safeParse({
    ...input,
    location: input.location ?? "",
    employmentType: input.employmentType ?? "",
    endDate: input.endDate ?? "",
    companyUrl: input.companyUrl ?? "",
    logoUrl: input.logoUrl ?? "",
    order: input.order ?? 0,
  });
}

function toData(d: z.output<typeof experienceSchema>) {
  return {
    company: d.company,
    role: d.role,
    location: orNull(d.location),
    employmentType: orNull(d.employmentType),
    startDate: new Date(d.startDate),
    endDate: d.current || !d.endDate ? null : new Date(d.endDate),
    current: d.current,
    description: d.description,
    highlights: d.highlights ?? "[]",
    companyUrl: orNull(d.companyUrl),
    logoUrl: orNull(d.logoUrl),
    order: d.order,
    published: d.published,
  };
}

export function listExperience() {
  return prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
}

export function getExperience(id: string) {
  return prisma.experience.findUnique({ where: { id } });
}

export async function createExperience(input: ExperienceInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = validate(input);
  if (!parsed.success) return invalid(parsed.error);
  const experience = await prisma.experience.create({ data: toData(parsed.data) });
  revalidateSite();
  return { ok: true, data: { id: experience.id } };
}

export async function updateExperience(id: string, input: ExperienceInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = validate(input);
  if (!parsed.success) return invalid(parsed.error);
  await prisma.experience.update({ where: { id }, data: toData(parsed.data) });
  revalidateSite();
  return { ok: true, data: { id } };
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({ where: { id } });
  revalidateSite();
}
