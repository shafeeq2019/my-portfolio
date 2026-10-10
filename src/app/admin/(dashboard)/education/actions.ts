"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import * as education from "@/lib/services/education";

export type FormState = { status: "idle" | "error"; message?: string; errors?: Record<string, string[]> };

// --- Education ---
function readEducation(fd: FormData): education.EducationInput {
  return {
    institution: fd.get("institution"),
    degree: fd.get("degree"),
    field: fd.get("field"),
    startDate: fd.get("startDate"),
    endDate: fd.get("endDate"),
    description: fd.get("description"),
    order: fd.get("order"),
    published: fd.get("published") === "true",
  };
}

export async function createEducation(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await education.createEducation(readEducation(fd));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/education");
}

export async function updateEducation(id: string, _p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await education.updateEducation(id, readEducation(fd));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/education");
}

export async function deleteEducation(id: string) {
  await requireAdmin();
  await education.deleteEducation(id);
}

// --- Certifications ---
function readCertification(fd: FormData): education.CertificationInput {
  return {
    name: fd.get("name"),
    issuer: fd.get("issuer"),
    issueDate: fd.get("issueDate"),
    expiryDate: fd.get("expiryDate"),
    credentialId: fd.get("credentialId"),
    credentialUrl: fd.get("credentialUrl"),
    order: fd.get("order"),
    published: fd.get("published") === "true",
  };
}

export async function createCertification(_p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await education.createCertification(readCertification(fd));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/education");
}

export async function updateCertification(id: string, _p: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await education.updateCertification(id, readCertification(fd));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/education");
}

export async function deleteCertification(id: string) {
  await requireAdmin();
  await education.deleteCertification(id);
}
