import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import * as skills from "@/lib/services/skills";
import { UPDATE_HINT, fromResult, id, json, notFound, order, published, toInput } from "./helpers";

const fields = z.object({
  name: z.string().describe('Skill name, e.g. "TypeScript"'),
  category: z.string().describe('Group on the skills page, e.g. "Languages", "Frameworks", "Tools", "Cloud"'),
  level: z.number().int().min(1).max(5).describe("Proficiency 1-5 (default 3)"),
  icon: z.string().describe("Optional icon key"),
  order,
  published,
});

export function registerSkillTools(server: McpServer) {
  server.registerTool(
    "list_skills",
    {
      title: "List skills",
      description: "List all skills, grouped by category and sorted by order.",
      inputSchema: z.object({}),
    },
    async () => json(await skills.listSkills()),
  );

  server.registerTool(
    "create_skill",
    {
      title: "Create skill",
      description: "Add a skill. Skills are published by default.",
      inputSchema: fields.partial().required({ name: true, category: true }),
    },
    async (input) => fromResult(await skills.createSkill({ published: true, ...input })),
  );

  server.registerTool(
    "update_skill",
    {
      title: "Update skill",
      description: `Update an existing skill. ${UPDATE_HINT}`,
      inputSchema: fields.partial().extend({ id }),
    },
    async ({ id, ...changes }) => {
      const existing = await skills.getSkill(id);
      if (!existing) return notFound("Skill", id);
      return fromResult(await skills.updateSkill(id, { ...toInput(existing), ...changes }));
    },
  );

  server.registerTool(
    "delete_skill",
    {
      title: "Delete skill",
      description: "Permanently delete a skill.",
      inputSchema: z.object({ id }),
      annotations: { destructiveHint: true },
    },
    async ({ id }) => {
      if (!(await skills.getSkill(id))) return notFound("Skill", id);
      await skills.deleteSkill(id);
      return json({ deleted: id });
    },
  );
}
