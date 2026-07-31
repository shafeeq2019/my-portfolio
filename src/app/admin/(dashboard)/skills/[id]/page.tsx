import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { SkillForm } from "@/components/admin/skill-form";
import { updateSkill } from "../actions";

export const metadata = { title: "Edit Skill · Admin", robots: { index: false } };

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.skill.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/skills">Back</BackLink>
      <AdminHeader title="Edit skill" description={item.name} />
      <SkillForm action={updateSkill.bind(null, id)} item={item} submitLabel="Save changes" />
    </div>
  );
}
