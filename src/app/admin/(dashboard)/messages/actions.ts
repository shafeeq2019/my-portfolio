"use server";

import type { MessageStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/require-admin";
import * as messages from "@/lib/services/messages";

export async function setMessageStatus(id: string, status: MessageStatus) {
  await requireAdmin();
  await messages.setMessageStatus(id, status);
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await messages.deleteMessage(id);
}

export async function markRead(id: string) {
  await requireAdmin();
  await messages.setMessageStatus(id, "READ");
}
