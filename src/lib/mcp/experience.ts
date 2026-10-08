import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import * as experience from "@/lib/services/experience";
import { parseList } from "@/lib/utils";
import { UPDATE_HINT, date, fail, fromResult, id, json, notFound, published, toInput } from "./helpers";

/** Prisma stores highlights as a JSON string; expose it as an array. */
function serialize(entry: NonNullable<Awaited<ReturnType<typeof experience.getExperience>>>) {
  return { ...entry, highlights: parseList(entry.highlights) };
}

/** No `order` field: the site sorts experience by current first, then start date. */
const fields = z.object({
  company: z.string().describe("Company name"),
  role: z.string().describe("Job title"),
  location: z.string().describe('e.g. "Berlin" or "Remote"'),
  employmentType: z.string().describe('e.g. "Full-time", "Freelance"'),
  startDate: date,
  endDate: date.or(z.literal("")).describe("End date as YYYY-MM-DD; omit or empty when current"),
  current: z.boolean().describe("Still working here. Setting an endDate without this marks the job as ended."),
  description: z.string().describe("Role description, at least 5 characters"),
  highlights: z.array(z.string()).describe("Bullet points of achievements"),
  companyUrl: z.string().describe("Company website URL"),
  logoUrl: z.string().describe("Company logo URL"),
  published,
});

const CONFLICT = "Pass either current: true or an endDate, not both.";

export function registerExperienceTools(server: McpServer) {
  server.registerTool(
    "list_experience",
    {
      title: "List experience",
      description: "List all work experience entries.",
      inputSchema: z.object({}),
    },
    async () => json((await experience.listExperience()).map(serialize)),
  );

  server.registerTool(
    "create_experience",
    {
      title: "Create experience",
      description: "Add a work experience entry. Entries are published by default.",
      inputSchema: fields.partial().required({ company: true, role: true, startDate: true, description: true }),
    },
    async (input) => {
      if (input.current && input.endDate) return fail(CONFLICT);
      return fromResult(await experience.createExperience({ published: true, ...input }));
    },
  );

  server.registerTool(
    "update_experience",
    {
      title: "Update experience",
      description: `Update a work experience entry. ${UPDATE_HINT}`,
      inputSchema: fields.partial().extend({ id }),
    },
    async ({ id, ...changes }) => {
      const existing = await experience.getExperience(id);
      if (!existing) return notFound("Experience", id);
      if (changes.current && changes.endDate) return fail(CONFLICT);
      // The stored record may say current: true, which would drop the new end
      // date; an end date on its own means the job has ended.
      const implied = changes.endDate && changes.current === undefined ? { current: false } : {};
      return fromResult(
        await experience.updateExperience(id, { ...toInput(serialize(existing)), ...changes, ...implied }),
      );
    },
  );

  server.registerTool(
    "delete_experience",
    {
      title: "Delete experience",
      description: "Permanently delete a work experience entry.",
      inputSchema: z.object({ id }),
      annotations: { destructiveHint: true },
    },
    async ({ id }) => {
      if (!(await experience.getExperience(id))) return notFound("Experience", id);
      await experience.deleteExperience(id);
      return json({ deleted: id });
    },
  );
}
