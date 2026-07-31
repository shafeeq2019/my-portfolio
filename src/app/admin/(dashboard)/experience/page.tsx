import Link from "next/link";
import { Plus, Pencil, Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/form-ui";
import { EmptyState } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDateRange } from "@/lib/utils";
import { deleteExperience } from "./actions";

export const metadata = { title: "Experience · Admin", robots: { index: false } };

export default async function AdminExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: [{ current: "desc" }, { startDate: "desc" }] });

  return (
    <div>
      <AdminHeader
        title="Experience"
        description="Manage your roles, companies and dates."
        action={<Button asChild><Link href="/admin/experience/new"><Plus /> New entry</Link></Button>}
      />
      {items.length === 0 ? (
        <EmptyState icon={<Briefcase className="size-6" />} title="No experience entries" description="Add your first role." />
      ) : (
        <Card className="divide-y divide-border">
          {items.map((e) => (
            <div key={e.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{e.role}</p>
                  {!e.published && <Badge variant="muted" className="text-[10px]">Hidden</Badge>}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {e.company} · {formatDateRange(e.startDate, e.endDate, e.current)}
                </p>
              </div>
              <Button asChild variant="ghost" size="icon" aria-label="Edit">
                <Link href={`/admin/experience/${e.id}`}><Pencil /></Link>
              </Button>
              <DeleteButton action={deleteExperience.bind(null, e.id)} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
