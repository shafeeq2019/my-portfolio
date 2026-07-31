import type { Metadata } from "next";
import { FolderGit2 } from "lucide-react";
import { Section, SectionHeader, EmptyState } from "@/components/section";
import { ProjectsGallery } from "@/components/projects-gallery";
import { getPublishedProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected software projects with technologies, links and outcomes.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <Section>
      <SectionHeader
        eyebrow="Portfolio"
        title="Projects"
        description="A selection of things I've designed and built. Filter by category or technology."
      />
      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="size-6" />}
          title="No published projects yet"
          description="Add and publish projects from the admin dashboard."
        />
      ) : (
        <ProjectsGallery projects={projects} />
      )}
    </Section>
  );
}
