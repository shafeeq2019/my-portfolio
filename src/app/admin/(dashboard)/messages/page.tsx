import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/form-ui";
import { EmptyState } from "@/components/section";
import { Inbox } from "lucide-react";
import { MessagesClient } from "@/components/admin/messages-client";

export const metadata = { title: "Messages · Admin", robots: { index: false } };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const unread = messages.filter((m) => m.status === "UNREAD").length;

  return (
    <div>
      <AdminHeader
        title="Messages"
        description={`${messages.length} total · ${unread} unread`}
      />
      {messages.length === 0 ? (
        <EmptyState icon={<Inbox className="size-6" />} title="No messages yet" description="Contact-form submissions will appear here." />
      ) : (
        <MessagesClient messages={messages} />
      )}
    </div>
  );
}
