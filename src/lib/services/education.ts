import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { prisma } from "@/lib/prisma";
import { certificationSchema, educationSchema } from "@/lib/validations";
import { invalid, orNull, type ServiceResult } from "./result";

/** Education and certifications share the admin page and the public /about page. */
function revalidateEducation() {
  revalidatePath("/admin/education");
  revalidatePath("/about");
}

// --- Education ---

export type EducationInput = Partial<Record<keyof z.input<typeof educationSchema>, unknown>>;

function validateEducation(input: EducationInput) {
  return educationSchema.safeParse({
    ...input,
    field: input.field ?? "",
    endDate: input.endDate ?? "",
    description: input.description ?? "",
    order: input.order ?? 0,
  });
}

function educationData(d: z.output<typeof educationSchema>) {
  return {
    institution: d.institution,
    degree: d.degree,
    field: orNull(d.field),
    startDate: new Date(d.startDate),
    endDate: d.endDate ? new Date(d.endDate) : null,
    description: orNull(d.description),
    order: d.order,
    published: d.published,
  };
}

export function listEducation() {
  return prisma.education.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
}

export function getEducation(id: string) {
  return prisma.education.findUnique({ where: { id } });
}

export async function createEducation(input: EducationInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = validateEducation(input);
  if (!parsed.success) return invalid(parsed.error);
  const education = await prisma.education.create({ data: educationData(parsed.data) });
  revalidateEducation();
  return { ok: true, data: { id: education.id } };
}

export async function updateEducation(id: string, input: EducationInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = validateEducation(input);
  if (!parsed.success) return invalid(parsed.error);
  await prisma.education.update({ where: { id }, data: educationData(parsed.data) });
  revalidateEducation();
  return { ok: true, data: { id } };
}

export async function deleteEducation(id: string) {
  await prisma.education.delete({ where: { id } });
  revalidateEducation();
}

// --- Certifications ---

export type CertificationInput = Partial<Record<keyof z.input<typeof certificationSchema>, unknown>>;

function validateCertification(input: CertificationInput) {
  return certificationSchema.safeParse({
    ...input,
    expiryDate: input.expiryDate ?? "",
    credentialId: input.credentialId ?? "",
    credentialUrl: input.credentialUrl ?? "",
    order: input.order ?? 0,
  });
}

function certificationData(d: z.output<typeof certificationSchema>) {
  return {
    name: d.name,
    issuer: d.issuer,
    issueDate: new Date(d.issueDate),
    expiryDate: d.expiryDate ? new Date(d.expiryDate) : null,
    credentialId: orNull(d.credentialId),
    credentialUrl: orNull(d.credentialUrl),
    order: d.order,
    published: d.published,
  };
}

export function listCertifications() {
  return prisma.certification.findMany({ orderBy: [{ order: "asc" }, { issueDate: "desc" }] });
}

export function getCertification(id: string) {
  return prisma.certification.findUnique({ where: { id } });
}

export async function createCertification(input: CertificationInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = validateCertification(input);
  if (!parsed.success) return invalid(parsed.error);
  const certification = await prisma.certification.create({ data: certificationData(parsed.data) });
  revalidateEducation();
  return { ok: true, data: { id: certification.id } };
}

export async function updateCertification(id: string, input: CertificationInput): Promise<ServiceResult<{ id: string }>> {
  const parsed = validateCertification(input);
  if (!parsed.success) return invalid(parsed.error);
  await prisma.certification.update({ where: { id }, data: certificationData(parsed.data) });
  revalidateEducation();
  return { ok: true, data: { id } };
}

export async function deleteCertification(id: string) {
  await prisma.certification.delete({ where: { id } });
  revalidateEducation();
}
