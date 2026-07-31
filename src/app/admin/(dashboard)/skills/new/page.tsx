import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { SkillForm } from "@/components/admin/skill-form";
import { createSkill } from "../actions";

export const metadata = { title: "New Skill · Admin", robots: { index: false } };

export default function NewSkillPage() {
  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/skills">Back</BackLink>
      <AdminHeader title="New skill" />
      <SkillForm action={createSkill} submitLabel="Create" />
    </div>
  );
}
