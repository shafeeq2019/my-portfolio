"use client";

import * as React from "react";
import { Mail, Archive, CornerUpLeft, Inbox, MailOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/section";
import { DeleteButton } from "@/components/admin/delete-button";
import { cn, formatDate } from "@/lib/utils";
import type { ContactMessage } from "@prisma/client";
import { setMessageStatus, deleteMessage } from "@/app/admin/(dashboard)/messages/actions";

export function MessagesClient({ messages }: { messages: ContactMessage[] }) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"ALL" | "UNREAD" | "READ" | "ARCHIVED">("ALL");
  const [selected, setSelected] = React.useState<ContactMessage | null>(messages[0] ?? null);
  const [pending, start] = React.useTransition();

  const filtered = messages.filter((m) => {
    const matchesFilter = filter === "ALL" || m.status === filter;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  function open(m: ContactMessage) {
    setSelected(m);
    if (m.status === "UNREAD") {
      start(() => setMessageStatus(m.id, "READ"));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div>
        <div className="mb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search messages…" className="pl-9" />
          </div>
          <Select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="w-32">
            <option value="ALL">All</option>
            <option value="UNREAD">Unread</option>
            <option value="READ">Read</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Inbox className="size-6" />} title="No messages" description="Nothing matches your filter." />
        ) : (
          <Card className="max-h-[70vh] divide-y divide-border overflow-y-auto">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => open(m)}
                className={cn(
                  "flex w-full flex-col gap-0.5 p-4 text-left transition-colors hover:bg-muted/50",
                  selected?.id === m.id && "bg-muted",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("truncate", m.status === "UNREAD" ? "font-semibold" : "font-medium")}>{m.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
                </div>
                <span className="flex items-center gap-2 truncate text-sm text-muted-foreground">
                  {m.status === "UNREAD" && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                  {m.subject}
                </span>
              </button>
            ))}
          </Card>
        )}
      </div>

      <div>
        {selected ? (
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-semibold">{selected.subject}</h2>
                <p className="text-sm text-muted-foreground">
                  {selected.name} · <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(selected.createdAt)}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <p className="whitespace-pre-wrap py-6 text-sm leading-relaxed">{selected.message}</p>

            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <Button asChild size="sm">
                <a href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: " + selected.subject)}`}>
                  <CornerUpLeft /> Reply
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => start(() => setMessageStatus(selected.id, selected.status === "ARCHIVED" ? "READ" : "ARCHIVED"))}
              >
                {selected.status === "ARCHIVED" ? <><MailOpen /> Unarchive</> : <><Archive /> Archive</>}
              </Button>
              {selected.status !== "UNREAD" ? (
                <Button size="sm" variant="ghost" disabled={pending} onClick={() => start(() => setMessageStatus(selected.id, "UNREAD"))}>
                  <Mail /> Mark unread
                </Button>
              ) : (
                <Button size="sm" variant="ghost" disabled={pending} onClick={() => start(() => setMessageStatus(selected.id, "READ"))}>
                  <MailOpen /> Mark read
                </Button>
              )}
              <div className="ml-auto">
                <DeleteButton action={deleteMessage.bind(null, selected.id)} size="sm" label="Delete" confirmText="Delete this message permanently?" />
              </div>
            </div>
          </Card>
        ) : (
          <EmptyState icon={<MailOpen className="size-6" />} title="Select a message" description="Choose a message from the list to read it." />
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "UNREAD") return <Badge>Unread</Badge>;
  if (status === "ARCHIVED") return <Badge variant="muted">Archived</Badge>;
  return <Badge variant="outline">Read</Badge>;
}
