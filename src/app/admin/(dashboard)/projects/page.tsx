import Link from "next/link";
import { Plus, Pencil, FolderGit2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/form-ui";
import { EmptyState } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { PublishToggle, ReorderButtons } from "@/components/admin/row-actions";
import { deleteProject, togglePublish, reorderProject } from "./actions";

export const metadata = { title: "Projects · Admin", robots: { index: false } };

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

  return (
    <div>
      <AdminHeader
        title="Projects"
        description="Add, edit, publish and reorder your projects."
        action={
          <Button asChild>
            <Link href="/admin/projects/new"><Plus /> New project</Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState icon={<FolderGit2 className="size-6" />} title="No projects yet" description="Create your first project to get started." />
      ) : (
        <Card className="divide-y divide-border">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-4">
              <ReorderButtons
                onUp={reorderProject.bind(null, p.id, "up")}
                onDown={reorderProject.bind(null, p.id, "down")}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{p.title}</p>
                  {p.featured && <Badge className="text-[10px]">Featured</Badge>}
                  {!p.published && <Badge variant="muted" className="text-[10px]">Draft</Badge>}
                </div>
                <p className="truncate text-sm text-muted-foreground">{p.summary}</p>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">{p.category}</Badge>
              <div className="flex items-center gap-1">
                <PublishToggle published={p.published} action={togglePublish.bind(null, p.id)} />
                <Button asChild variant="ghost" size="icon" aria-label="Edit">
                  <Link href={`/admin/projects/${p.id}`}><Pencil /></Link>
                </Button>
                <DeleteButton action={deleteProject.bind(null, p.id)} />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
