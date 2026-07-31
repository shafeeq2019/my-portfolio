import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { EducationForm } from "@/components/admin/education-forms";
import { createEducation } from "../../actions";

export const metadata = { title: "New Education · Admin", robots: { index: false } };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/education">Back</BackLink>
      <AdminHeader title="Add education" />
      <EducationForm action={createEducation} submitLabel="Create" />
    </div>
  );
}
