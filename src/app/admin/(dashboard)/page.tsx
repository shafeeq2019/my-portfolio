import Link from "next/link";
import {
  FolderGit2,
  Briefcase,
  Wrench,
  Mail,
  MailOpen,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Dashboard", robots: { index: false } };

export default async function AdminDashboard() {
  const [projects, publishedProjects, experience, skills, unread, recentMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.experience.count(),
      prisma.skill.count(),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const stats = [
    { label: "Projects", value: `${publishedProjects}/${projects}`, hint: "published", icon: FolderGit2, href: "/admin/projects" },
    { label: "Experience", value: experience, hint: "entries", icon: Briefcase, href: "/admin/experience" },
    { label: "Skills", value: skills, hint: "listed", icon: Wrench, href: "/admin/skills" },
    { label: "Unread messages", value: unread, hint: "new", icon: Mail, href: "/admin/messages" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your portfolio content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="p-5 transition-colors hover:border-primary/40">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.hint}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold">Recent messages</h2>
          <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center text-sm text-muted-foreground">
            <MailOpen className="size-6" />
            No messages yet.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentMessages.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/messages?id=${m.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-medium">
                      {m.name}
                      {m.status === "UNREAD" && <Badge className="text-[10px]">New</Badge>}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">{m.subject}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
