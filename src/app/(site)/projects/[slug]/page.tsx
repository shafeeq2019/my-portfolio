import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Target } from "lucide-react";
import { Section } from "@/components/section";
import { SocialIcon } from "@/components/social-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, getPublishedProjects } from "@/lib/queries";
import { formatDateRange, parseList } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.published) notFound();

  const tech = parseList(project.technologies);
  const gallery = project.coverImage
    ? [{ id: "cover", url: project.coverImage, alt: project.title, order: -1, projectId: project.id }, ...project.images]
    : project.images;

  return (
    <Section className="max-w-4xl">
      <Link href="/projects" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to projects
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="muted">{project.category}</Badge>
        {project.featured && <Badge>Featured</Badge>}
        {(project.startDate || project.endDate) && (
          <span className="text-sm text-muted-foreground">
            {formatDateRange(project.startDate ?? new Date(), project.endDate)}
          </span>
        )}
      </div>

      <h1 className="mt-4 text-4xl font-bold tracking-tight">{project.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{project.summary}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl && (
          <Button asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink /> Live demo
            </a>
          </Button>
        )}
        {project.repoUrl && (
          <Button asChild variant="outline">
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <SocialIcon name="github" className="size-4" /> Source code
            </a>
          </Button>
        )}
      </div>

      {gallery.length > 0 && (
        <div className="mt-10 space-y-4">
          {gallery.map((img) => (
            <div key={img.id} className="relative aspect-16/9 overflow-hidden rounded-lg border border-border bg-muted">
              <Image src={img.url} alt={img.alt ?? project.title} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-xl font-semibold">About this project</h2>
          <div className="prose-content mt-4 text-muted-foreground">
            {project.description.split("\n").filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {project.outcome && (
            <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5">
              <h3 className="flex items-center gap-2 font-semibold text-primary">
                <Target className="size-4" /> Outcome & impact
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{project.outcome}</p>
            </div>
          )}
        </div>

        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Built with
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tech.map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
        </aside>
      </div>
    </Section>
  );
}
