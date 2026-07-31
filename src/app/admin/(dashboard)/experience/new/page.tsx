import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { ExperienceForm } from "@/components/admin/experience-form";
import { createExperience } from "../actions";

export const metadata = { title: "New Experience · Admin", robots: { index: false } };

export default function NewExperiencePage() {
  return (
    <div className="max-w-3xl">
      <BackLink href="/admin/experience">Back</BackLink>
      <AdminHeader title="New experience" />
      <ExperienceForm action={createExperience} submitLabel="Create" />
    </div>
  );
}
