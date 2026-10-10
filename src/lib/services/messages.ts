import { revalidatePath } from "next/cache";
import type { MessageStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function revalidateMessages() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

/** Sender IP hash and user agent are spam-protection data and stay internal. */
const internalFields = { ipHash: true, userAgent: true } as const;

export function listMessages(status?: MessageStatus) {
  return prisma.contactMessage.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    omit: internalFields,
  });
}

export function getMessage(id: string) {
  return prisma.contactMessage.findUnique({ where: { id }, omit: internalFields });
}

export async function setMessageStatus(id: string, status: MessageStatus) {
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidateMessages();
}

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({ where: { id } });
  revalidateMessages();
}
