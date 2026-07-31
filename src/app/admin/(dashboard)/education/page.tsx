import Link from "next/link";
import { Plus, Pencil, GraduationCap, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/form-ui";
import { EmptyState } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDateRange, formatDate } from "@/lib/utils";
import { deleteEducation, deleteCertification } from "./actions";

export const metadata = { title: "Education · Admin", robots: { index: false } };

export default async function AdminEducationPage() {
  const [education, certifications] = await Promise.all([
    prisma.education.findMany({ orderBy: { startDate: "desc" } }),
    prisma.certification.findMany({ orderBy: { issueDate: "desc" } }),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <AdminHeader
          title="Education"
          description="Degrees and academic background."
          action={<Button asChild><Link href="/admin/education/edu/new"><Plus /> Add education</Link></Button>}
        />
        {education.length === 0 ? (
          <EmptyState icon={<GraduationCap className="size-6" />} title="No education entries" />
        ) : (
          <Card className="divide-y divide-border">
            {education.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{e.degree}{e.field ? `, ${e.field}` : ""}</p>
                  <p className="truncate text-sm text-muted-foreground">{e.institution} · {formatDateRange(e.startDate, e.endDate)}</p>
                </div>
                {!e.published && <Badge variant="muted" className="text-[10px]">Hidden</Badge>}
                <Button asChild variant="ghost" size="icon" aria-label="Edit"><Link href={`/admin/education/edu/${e.id}`}><Pencil /></Link></Button>
                <DeleteButton action={deleteEducation.bind(null, e.id)} />
              </div>
            ))}
          </Card>
        )}
      </section>

      <section>
        <AdminHeader
          title="Certifications & awards"
          description="Professional certifications and notable awards."
          action={<Button asChild><Link href="/admin/education/cert/new"><Plus /> Add certification</Link></Button>}
        />
        {certifications.length === 0 ? (
          <EmptyState icon={<Award className="size-6" />} title="No certifications" />
        ) : (
          <Card className="divide-y divide-border">
            {certifications.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{c.issuer} · {formatDate(c.issueDate)}</p>
                </div>
                {!c.published && <Badge variant="muted" className="text-[10px]">Hidden</Badge>}
                <Button asChild variant="ghost" size="icon" aria-label="Edit"><Link href={`/admin/education/cert/${c.id}`}><Pencil /></Link></Button>
                <DeleteButton action={deleteCertification.bind(null, c.id)} />
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
