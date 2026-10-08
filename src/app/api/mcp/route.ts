import { timingSafeEqual } from "node:crypto";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
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

/** Accepts the request only when the bearer token matches MCP_API_KEY. */
function verifyToken(_req: Request, token?: string) {
  const expected = process.env.MCP_API_KEY;
  if (!expected || !token) return undefined;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return undefined;
  return { token, clientId: "mcp-api-key", scopes: [] };
}

const authorizedHandler = withMcpAuth(handler, verifyToken, { required: true });

export { authorizedHandler as GET, authorizedHandler as POST, authorizedHandler as DELETE };
