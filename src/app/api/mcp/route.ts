import { timingSafeEqual } from "node:crypto";
import { createMcpHandler } from "mcp-handler";
import { registerEducationTools } from "@/lib/mcp/education";
import { registerExperienceTools } from "@/lib/mcp/experience";
import { registerMessageTools } from "@/lib/mcp/messages";
import { registerProfileTools } from "@/lib/mcp/profile";
import { registerProjectTools } from "@/lib/mcp/projects";
import { registerSkillTools } from "@/lib/mcp/skills";

/**
 * MCP endpoint that lets AI agents read and edit portfolio content.
 * Protected by a static bearer token: `Authorization: Bearer <MCP_API_KEY>`.
 */

const handler = createMcpHandler(
  (server) => {
    registerProfileTools(server);
    registerProjectTools(server);
    registerExperienceTools(server);
    registerSkillTools(server);
    registerEducationTools(server);
    registerMessageTools(server);
  },
  { serverInfo: { name: "portfolio", version: "1.0.0" } },
);

function isAuthorized(req: Request) {
  const expected = process.env.MCP_API_KEY;
  const provided = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function authorizedHandler(req: Request) {
  if (!isAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  return handler(req);
}

export { authorizedHandler as GET, authorizedHandler as POST, authorizedHandler as DELETE };
