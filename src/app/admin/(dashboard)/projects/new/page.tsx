import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "../actions";

export const metadata = { title: "New Project · Admin", robots: { index: false } };

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <BackLink href="/admin/projects">Back to projects</BackLink>
      <AdminHeader title="New project" />
      <ProjectForm action={createProject} submitLabel="Create project" />
    </div>
  );
}
