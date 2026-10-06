import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import * as education from "@/lib/services/education";
import { UPDATE_HINT, date, fromResult, id, json, notFound, order, published, toInput } from "./helpers";

const educationFields = z.object({
  institution: z.string().describe("School or university"),
  degree: z.string().describe('e.g. "B.Sc."'),
  field: z.string().describe('Field of study, e.g. "Computer Science"'),
  startDate: date,
  endDate: date.or(z.literal("")).describe("End date as YYYY-MM-DD; omit or empty if ongoing"),
  description: z.string().describe("Optional details"),
  order,
  published,
});

const certificationFields = z.object({
  name: z.string().describe("Certificate name"),
  issuer: z.string().describe('Issuing organisation, e.g. "AWS"'),
  issueDate: date,
  expiryDate: date.or(z.literal("")).describe("Expiry date as YYYY-MM-DD; omit or empty if it does not expire"),
  credentialId: z.string().describe("Credential id"),
  credentialUrl: z.string().describe("Verification URL"),
  order,
  published,
});

export function registerEducationTools(server: McpServer) {
  server.registerTool(
    "list_education",
    {
      title: "List education",
      description: "List all education entries.",
      inputSchema: z.object({}),
    },
    async () => json(await education.listEducation()),
  );

  server.registerTool(
    "create_education",
    {
      title: "Create education",
      description: "Add an education entry. Entries are published by default.",
      inputSchema: educationFields.partial().required({ institution: true, degree: true, startDate: true }),
    },
    async (input) => fromResult(await education.createEducation({ published: true, ...input })),
  );

  server.registerTool(
    "update_education",
    {
      title: "Update education",
      description: `Update an education entry. ${UPDATE_HINT}`,
      inputSchema: educationFields.partial().extend({ id }),
    },
    async ({ id, ...changes }) => {
      const existing = await education.getEducation(id);
      if (!existing) return notFound("Education", id);
      return fromResult(await education.updateEducation(id, { ...toInput(existing), ...changes }));
    },
  );

  server.registerTool(
    "delete_education",
    {
      title: "Delete education",
      description: "Permanently delete an education entry.",
      inputSchema: z.object({ id }),
      annotations: { destructiveHint: true },
    },
    async ({ id }) => {
      if (!(await education.getEducation(id))) return notFound("Education", id);
      await education.deleteEducation(id);
      return json({ deleted: id });
    },
  );

  server.registerTool(
    "list_certifications",
    {
      title: "List certifications",
      description: "List all certifications.",
      inputSchema: z.object({}),
    },
    async () => json(await education.listCertifications()),
  );

  server.registerTool(
    "create_certification",
    {
      title: "Create certification",
      description: "Add a certification. Certifications are published by default.",
      inputSchema: certificationFields.partial().required({ name: true, issuer: true, issueDate: true }),
    },
    async (input) => fromResult(await education.createCertification({ published: true, ...input })),
  );

  server.registerTool(
    "update_certification",
    {
      title: "Update certification",
      description: `Update a certification. ${UPDATE_HINT}`,
      inputSchema: certificationFields.partial().extend({ id }),
    },
    async ({ id, ...changes }) => {
      const existing = await education.getCertification(id);
      if (!existing) return notFound("Certification", id);
      return fromResult(await education.updateCertification(id, { ...toInput(existing), ...changes }));
    },
  );

  server.registerTool(
    "delete_certification",
    {
      title: "Delete certification",
      description: "Permanently delete a certification.",
      inputSchema: z.object({ id }),
      annotations: { destructiveHint: true },
    },
    async ({ id }) => {
      if (!(await education.getCertification(id))) return notFound("Certification", id);
      await education.deleteCertification(id);
      return json({ deleted: id });
    },
  );
}
