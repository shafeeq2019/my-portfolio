"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import * as projects from "@/lib/services/projects";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Record<string, string[]>;
};

function readForm(formData: FormData): projects.ProjectInput {
  const technologies = String(formData.get("technologies") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    technologies,
    liveUrl: formData.get("liveUrl"),
    repoUrl: formData.get("repoUrl"),
    outcome: formData.get("outcome"),
    coverImage: formData.get("coverImage"),
    featured: formData.get("featured") === "true",
    published: formData.get("published") === "true",
    order: formData.get("order"),
  };
}

export async function createProject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await projects.createProject(readForm(formData));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/projects");
}

export async function updateProject(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = await projects.updateProject(id, readForm(formData));
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await projects.deleteProject(id);
}

export async function togglePublish(id: string, published: boolean) {
  await requireAdmin();
  await projects.setProjectPublished(id, published);
}

export async function reorderProject(id: string, direction: "up" | "down") {
  await requireAdmin();
  await projects.moveProject(id, direction);
}
