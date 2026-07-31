import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { EducationForm } from "@/components/admin/education-forms";
import { updateEducation } from "../../actions";

export const metadata = { title: "Edit Education · Admin", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.education.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/education">Back</BackLink>
      <AdminHeader title="Edit education" description={item.institution} />
      <EducationForm action={updateEducation.bind(null, id)} item={item} submitLabel="Save changes" />
    </div>
  );
}
