"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { MessageStatus } from "@prisma/client";

export async function setMessageStatus(id: string, status: MessageStatus) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function markRead(id: string) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { status: "READ" } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
