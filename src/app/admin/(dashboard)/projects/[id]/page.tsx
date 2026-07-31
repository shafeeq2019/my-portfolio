import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader, BackLink } from "@/components/admin/form-ui";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProject } from "../actions";

export const metadata = { title: "Edit Project · Admin", robots: { index: false } };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { images: true } });
  if (!project) notFound();

  const action = updateProject.bind(null, id);

  return (
    <div className="max-w-3xl">
      <BackLink href="/admin/projects">Back to projects</BackLink>
      <AdminHeader title="Edit project" description={project.title} />
      <ProjectForm action={action} project={project} submitLabel="Save changes" />
    </div>
  );
}
