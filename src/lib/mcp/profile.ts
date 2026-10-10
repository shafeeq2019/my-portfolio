import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import * as profile from "@/lib/services/profile";
import { UPDATE_HINT, fromResult, id, json, notFound, order, toInput } from "./helpers";

const fields = z.object({
  fullName: z.string().describe("Full name"),
  headline: z.string().describe('Short headline, e.g. "Full-Stack Developer"'),
  tagline: z.string().describe("One-line tagline under the headline"),
  bio: z.string().describe("About text, at least 10 characters"),
  location: z.string().describe("City / country"),
  email: z.string().describe("Public contact email"),
  phone: z.string().describe("Phone number"),
  avatarUrl: z.string().describe("Avatar image URL"),
  resumeUrl: z.string().describe("Resume / CV file URL"),
  availableForWork: z.boolean().describe("Show the 'available for work' badge"),
});

export function registerProfileTools(server: McpServer) {
  server.registerTool(
    "get_profile",
    {
      title: "Get profile",
      description: "Get the site owner's profile, including social links.",
      inputSchema: z.object({}),
    },
    async () => json(await profile.getProfile()),
  );

  server.registerTool(
    "update_profile",
    {
      title: "Update profile",
      description: `Update the site owner's profile (creates it if missing; then fullName, headline, bio and email are required). ${UPDATE_HINT}`,
      inputSchema: fields.partial(),
    },
    async (changes) => {
      const existing = await profile.getProfile();
      const current = existing ? toInput({ ...existing, socialLinks: null }) : {};
      return fromResult(await profile.saveProfile({ ...current, ...changes }));
    },
  );

  server.registerTool(
    "add_social_link",
    {
      title: "Add social link",
      description: "Add a social link to the profile.",
      inputSchema: z.object({
        label: z.string().describe('Display label, e.g. "GitHub"'),
        url: z.string().describe("Link URL"),
        icon: z.string().describe("Icon key: github, linkedin, twitter, email, website, ..."),
        order: order.optional(),
      }),
    },
    async (input) => fromResult(await profile.addSocialLink(input)),
  );

  server.registerTool(
    "delete_social_link",
    {
      title: "Delete social link",
      description: "Remove a social link from the profile.",
      inputSchema: z.object({ id }),
      annotations: { destructiveHint: true },
    },
    async ({ id }) => {
      if (!(await profile.getSocialLink(id))) return notFound("Social link", id);
      await profile.deleteSocialLink(id);
      return json({ deleted: id });
    },
  );
}
