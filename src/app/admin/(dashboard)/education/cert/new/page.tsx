import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { CertificationForm } from "@/components/admin/education-forms";
import { createCertification } from "../../actions";

export const metadata = { title: "New Certification · Admin", robots: { index: false } };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/education">Back</BackLink>
      <AdminHeader title="Add certification" />
      <CertificationForm action={createCertification} submitLabel="Create" />
    </div>
  );
}
