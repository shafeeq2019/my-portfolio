import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import * as projects from "@/lib/services/projects";
import { parseList } from "@/lib/utils";
import { UPDATE_HINT, fail, fromResult, json, notFound, order, published, toInput } from "./helpers";

/** Prisma stores technologies as a JSON string; expose it as an array. */
function serialize(project: NonNullable<Awaited<ReturnType<typeof projects.getProject>>>) {
  return { ...project, technologies: parseList(project.technologies) };
}

const projectId = z.string().describe("Project id or slug");

const fields = z.object({
  title: z.string().describe("Project title"),
  slug: z.string().describe("URL slug (lowercase, numbers, dashes). Defaults to a slug of the title."),
  summary: z.string().describe("Short summary, 5-300 characters"),
  description: z.string().describe("Full description, at least 10 characters"),
  category: z.string().describe('Category, e.g. "Web", "Mobile", "AI"'),
  technologies: z.array(z.string()).describe("Technologies used"),
  liveUrl: z.string().describe("Live site URL"),
  repoUrl: z.string().describe("Repository URL"),
  outcome: z.string().describe("Result or impact of the project"),
  coverImage: z.string().describe("Cover image URL"),
  featured: z.boolean().describe("Show on the home page"),
  published,
  order,
});

export function registerProjectTools(server: McpServer) {
  server.registerTool(
    "list_projects",
    {
      title: "List projects",
      description: "List all portfolio projects (published and drafts), sorted by order.",
      inputSchema: z.object({}),
    },
    async () => json((await projects.listProjects()).map(serialize)),
  );

  server.registerTool(
    "get_project",
    {
      title: "Get project",
      description: "Get a single project by id or slug.",
      inputSchema: z.object({ idOrSlug: z.string() }),
    },
    async ({ idOrSlug }) => {
      const project = await projects.getProject(idOrSlug);
      return project ? json(serialize(project)) : notFound("Project", idOrSlug);
    },
  );

  server.registerTool(
    "create_project",
    {
      title: "Create project",
      description: "Create a new portfolio project. New projects are drafts unless published is true.",
      inputSchema: fields.partial().required({
        title: true,
        summary: true,
        description: true,
        category: true,
        technologies: true,
      }),
    },
    async (input) => fromResult(await projects.createProject(input)),
  );

  server.registerTool(
    "update_project",
    {
      title: "Update project",
      description: `Update an existing project. ${UPDATE_HINT}`,
      inputSchema: fields.partial().extend({ id: projectId }),
    },
    async ({ id, ...changes }) => {
      const existing = await projects.getProject(id);
      if (!existing) return notFound("Project", id);
      return fromResult(await projects.updateProject(existing.id, { ...toInput(serialize(existing)), ...changes }));
    },
  );

  server.registerTool(
    "delete_project",
    {
      title: "Delete project",
      description: "Permanently delete a project.",
      inputSchema: z.object({ id: projectId }),
      annotations: { destructiveHint: true },
    },
    async ({ id }) => {
      const existing = await projects.getProject(id);
      if (!existing) return notFound("Project", id);
      await projects.deleteProject(existing.id);
      return json({ deleted: existing.id });
    },
  );

  server.registerTool(
    "set_project_published",
    {
      title: "Publish / unpublish project",
      description: "Show or hide a project on the public site.",
      inputSchema: z.object({ id: projectId, published: z.boolean() }),
    },
    async ({ id, published }) => {
      const existing = await projects.getProject(id);
      if (!existing) return notFound("Project", id);
      await projects.setProjectPublished(existing.id, published);
      return json({ id: existing.id, published });
    },
  );

  server.registerTool(
    "move_project",
    {
      title: "Move project",
      description: "Move a project one position up or down in the sort order.",
      inputSchema: z.object({ id: projectId, direction: z.enum(["up", "down"]) }),
    },
    async ({ id, direction }) => {
      const existing = await projects.getProject(id);
      if (!existing) return notFound("Project", id);
      const moved = await projects.moveProject(existing.id, direction);
      return moved
        ? json({ id: existing.id, moved: direction })
        : fail(`Project is already at the ${direction === "up" ? "top" : "bottom"}.`);
    },
  );
}
