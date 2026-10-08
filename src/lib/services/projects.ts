import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";
import { invalid, type ServiceResult } from "./result";
import { revalidateSite } from "./revalidate";

/**
 * Project business logic, shared by the admin server actions and the MCP route.
 * Callers are responsible for authorization.
 */

/** Raw project input before validation. `slug` falls back to a slug of `title`. */
export type ProjectInput = {
  title?: unknown;
  slug?: unknown;
  summary?: unknown;
  description?: unknown;
  category?: unknown;
  technologies?: unknown;
  liveUrl?: unknown;
  repoUrl?: unknown;
  outcome?: unknown;
  coverImage?: unknown;
  featured?: unknown;
  published?: unknown;
  order?: unknown;
};

function validate(input: ProjectInput) {
  return projectSchema.safeParse({
    ...input,
    slug: input.slug || toSlug(String(input.title ?? "")),
    liveUrl: input.liveUrl ?? "",
    repoUrl: input.repoUrl ?? "",
    outcome: input.outcome ?? "",
    coverImage: input.coverImage ?? "",
    order: input.order ?? 0,
  });
}

export function listProjects() {
  return prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
}

export function getProject(idOrSlug: string) {
  return prisma.project.findFirst({ where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] } });
}

export async function createProject(input: ProjectInput): Promise<ServiceResult<{ id: string; slug: string }>> {
  const parsed = validate(input);
  if (!parsed.success) return invalid(parsed.error);

  const exists = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (exists) {
    return { ok: false, message: "A project with this slug already exists.", errors: { slug: ["Slug must be unique."] } };
  }

  const project = await prisma.project.create({ data: parsed.data });
  revalidateSite();
  return { ok: true, data: { id: project.id, slug: project.slug } };
}

export async function updateProject(id: string, input: ProjectInput): Promise<ServiceResult<{ id: string; slug: string }>> {
  const parsed = validate(input);
  if (!parsed.success) return invalid(parsed.error);

  const clash = await prisma.project.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (clash) {
    return { ok: false, message: "Slug already in use.", errors: { slug: ["Slug must be unique."] } };
  }

  const project = await prisma.project.update({ where: { id }, data: parsed.data });
  revalidateSite();
  return { ok: true, data: { id: project.id, slug: project.slug } };
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidateSite();
}

export async function setProjectPublished(id: string, published: boolean) {
  await prisma.project.update({ where: { id }, data: { published } });
  revalidateSite();
}

/**
 * Moves a project one position up or down. Projects often share an order value
 * (the default is 0), so swapping two values would be a no-op; instead the list
 * is renumbered 0..n-1 in its new order. Returns false if nothing moved.
 */
export async function moveProject(id: string, direction: "up" | "down"): Promise<boolean> {
  const all = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: { id: true, order: true },
  });
  const idx = all.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swapWith < 0 || swapWith >= all.length) return false;

  [all[idx], all[swapWith]] = [all[swapWith], all[idx]];
  await prisma.$transaction(
    all
      .map((p, order) => ({ ...p, newOrder: order }))
      .filter((p) => p.order !== p.newOrder)
      .map((p) => prisma.project.update({ where: { id: p.id }, data: { order: p.newOrder } })),
  );
  revalidateSite();
  return true;
}
