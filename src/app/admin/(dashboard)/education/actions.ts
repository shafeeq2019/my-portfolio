"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { educationSchema, certificationSchema } from "@/lib/validations";

export type FormState = { status: "idle" | "error"; message?: string; errors?: Record<string, string[]> };

// --- Education ---
function parseEdu(fd: FormData) {
  return educationSchema.safeParse({
    institution: fd.get("institution"),
    degree: fd.get("degree"),
    field: fd.get("field") ?? "",
    startDate: fd.get("startDate"),
    endDate: fd.get("endDate") ?? "",
    description: fd.get("description") ?? "",
    order: fd.get("order") ?? 0,
    published: fd.get("published") === "true",
  });
}

function eduData(d: NonNullable<ReturnType<typeof parseEdu>["data"]>) {
  return {
    institution: d.institution,
    degree: d.degree,
    field: d.field || null,
    startDate: new Date(d.startDate),
    endDate: d.endDate ? new Date(d.endDate) : null,
    description: d.description || null,
    order: d.order,
    published: d.published,
  };
}

export async function createEducation(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseEdu(fd);
  if (!parsed.success) return { status: "error", message: "Fix errors.", errors: parsed.error.flatten().fieldErrors };
  await prisma.education.create({ data: eduData(parsed.data) });
  revalidatePath("/admin/education");
  revalidatePath("/about");
  redirect("/admin/education");
}

export async function updateEducation(id: string, _p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseEdu(fd);
  if (!parsed.success) return { status: "error", message: "Fix errors.", errors: parsed.error.flatten().fieldErrors };
  await prisma.education.update({ where: { id }, data: eduData(parsed.data) });
  revalidatePath("/admin/education");
  revalidatePath("/about");
  redirect("/admin/education");
}

export async function deleteEducation(id: string) {
  await requireAdmin();
  await prisma.education.delete({ where: { id } });
  revalidatePath("/admin/education");
  revalidatePath("/about");
}

// --- Certifications ---
function parseCert(fd: FormData) {
  return certificationSchema.safeParse({
    name: fd.get("name"),
    issuer: fd.get("issuer"),
    issueDate: fd.get("issueDate"),
    expiryDate: fd.get("expiryDate") ?? "",
    credentialId: fd.get("credentialId") ?? "",
    credentialUrl: fd.get("credentialUrl") ?? "",
    order: fd.get("order") ?? 0,
    published: fd.get("published") === "true",
  });
}

function certData(d: NonNullable<ReturnType<typeof parseCert>["data"]>) {
  return {
    name: d.name,
    issuer: d.issuer,
    issueDate: new Date(d.issueDate),
    expiryDate: d.expiryDate ? new Date(d.expiryDate) : null,
    credentialId: d.credentialId || null,
    credentialUrl: d.credentialUrl || null,
    order: d.order,
    published: d.published,
  };
}

export async function createCertification(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseCert(fd);
  if (!parsed.success) return { status: "error", message: "Fix errors.", errors: parsed.error.flatten().fieldErrors };
  await prisma.certification.create({ data: certData(parsed.data) });
  revalidatePath("/admin/education");
  revalidatePath("/about");
  redirect("/admin/education");
}

export async function updateCertification(id: string, _p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseCert(fd);
  if (!parsed.success) return { status: "error", message: "Fix errors.", errors: parsed.error.flatten().fieldErrors };
  await prisma.certification.update({ where: { id }, data: certData(parsed.data) });
  revalidatePath("/admin/education");
  revalidatePath("/about");
  redirect("/admin/education");
}

export async function deleteCertification(id: string) {
  await requireAdmin();
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/admin/education");
  revalidatePath("/about");
}
