import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { ExperienceForm } from "@/components/admin/experience-form";
import { updateExperience } from "../actions";

export const metadata = { title: "Edit Experience · Admin", robots: { index: false } };

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="max-w-3xl">
      <BackLink href="/admin/experience">Back</BackLink>
      <AdminHeader title="Edit experience" description={`${item.role} · ${item.company}`} />
      <ExperienceForm action={updateExperience.bind(null, id)} item={item} submitLabel="Save changes" />
    </div>
  );
}
