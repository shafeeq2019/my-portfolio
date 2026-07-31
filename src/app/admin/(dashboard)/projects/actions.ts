"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { projectSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Record<string, string[]>;
};

function parseForm(formData: FormData) {
  const technologies = String(formData.get("technologies") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return projectSchema.safeParse({
    title: formData.get("title"),
    slug: String(formData.get("slug") || toSlug(String(formData.get("title") ?? ""))),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    technologies,
    liveUrl: formData.get("liveUrl") ?? "",
    repoUrl: formData.get("repoUrl") ?? "",
    outcome: formData.get("outcome") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    featured: formData.get("featured") === "true",
    published: formData.get("published") === "true",
    order: formData.get("order") ?? 0,
  });
}

export async function createProject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", errors: parsed.error.flatten().fieldErrors };
  }

  const exists = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (exists) {
    return { status: "error", message: "A project with this slug already exists.", errors: { slug: ["Slug must be unique."] } };
  }

  await prisma.project.create({ data: parsed.data });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", errors: parsed.error.flatten().fieldErrors };
  }

  const clash = await prisma.project.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (clash) {
    return { status: "error", message: "Slug already in use.", errors: { slug: ["Slug must be unique."] } };
  }

  await prisma.project.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${parsed.data.slug}`);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function togglePublish(id: string, published: boolean) {
  await requireAdmin();
  await prisma.project.update({ where: { id }, data: { published } });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function reorderProject(id: string, direction: "up" | "down") {
  await requireAdmin();
  const all = await prisma.project.findMany({ orderBy: { order: "asc" } });
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= all.length) return;

  await prisma.$transaction([
    prisma.project.update({ where: { id: all[idx].id }, data: { order: all[swapWith].order } }),
    prisma.project.update({ where: { id: all[swapWith].id }, data: { order: all[idx].order } }),
  ]);
  revalidatePath("/admin/projects");
}
