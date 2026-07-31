import Link from "next/link";
import { Plus, Pencil, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/form-ui";
import { EmptyState } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSkill } from "./actions";

export const metadata = { title: "Skills · Admin", robots: { index: false } };

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <AdminHeader
        title="Skills"
        description="Manage technical skills grouped by category."
        action={<Button asChild><Link href="/admin/skills/new"><Plus /> New skill</Link></Button>}
      />
      {skills.length === 0 ? (
        <EmptyState icon={<Wrench className="size-6" />} title="No skills yet" description="Add your first skill." />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <Card key={category}>
              <div className="border-b border-border px-4 py-3 font-medium">{category}</div>
              <div className="divide-y divide-border">
                {items.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex-1 truncate">{s.name}</span>
                    <Badge variant="muted">Lv {s.level}</Badge>
                    {!s.published && <Badge variant="outline" className="text-[10px]">Hidden</Badge>}
                    <Button asChild variant="ghost" size="icon" aria-label="Edit">
                      <Link href={`/admin/skills/${s.id}`}><Pencil /></Link>
                    </Button>
                    <DeleteButton action={deleteSkill.bind(null, s.id)} />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
