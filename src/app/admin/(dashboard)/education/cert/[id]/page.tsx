import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { CertificationForm } from "@/components/admin/education-forms";
import { updateCertification } from "../../actions";

export const metadata = { title: "Edit Certification · Admin", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.certification.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/education">Back</BackLink>
      <AdminHeader title="Edit certification" description={item.name} />
      <CertificationForm action={updateCertification.bind(null, id)} item={item} submitLabel="Save changes" />
    </div>
  );
}
