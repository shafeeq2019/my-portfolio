import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import * as messages from "@/lib/services/messages";
import { id, json, notFound } from "./helpers";

const status = z.enum(["UNREAD", "READ", "ARCHIVED"]);

export function registerMessageTools(server: McpServer) {
  server.registerTool(
    "list_messages",
    {
      title: "List contact messages",
      description: "List messages sent through the contact form, newest first.",
      inputSchema: z.object({ status: status.optional().describe("Only messages with this status") }),
      annotations: { readOnlyHint: true },
    },
    async ({ status }) => json(await messages.listMessages(status)),
  );

  server.registerTool(
    "set_message_status",
    {
      title: "Set message status",
      description: "Mark a contact message as UNREAD, READ or ARCHIVED.",
      inputSchema: z.object({ id, status }),
    },
    async ({ id, status }) => {
      if (!(await messages.getMessage(id))) return notFound("Message", id);
      await messages.setMessageStatus(id, status);
      return json({ id, status });
    },
  );

  server.registerTool(
    "delete_message",
    {
      title: "Delete message",
      description: "Permanently delete a contact message.",
      inputSchema: z.object({ id }),
      annotations: { destructiveHint: true },
    },
    async ({ id }) => {
      if (!(await messages.getMessage(id))) return notFound("Message", id);
      await messages.deleteMessage(id);
      return json({ deleted: id });
    },
  );
}
