import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SocialIcon } from "@/components/social-icon";
import { parseList } from "@/lib/utils";
import type { Project, ProjectImage } from "@prisma/client";

type ProjectWithImages = Project & { images: ProjectImage[] };

export function ProjectCard({ project }: { project: ProjectWithImages }) {
  const tech = parseList(project.technologies);
  const cover = project.coverImage || project.images[0]?.url;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-16/9 overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 text-2xl font-bold text-primary/40">
            {project.title.slice(0, 2).toUpperCase()}
          </div>
        )}
        {project.featured && (
          <Badge className="absolute left-3 top-3 backdrop-blur">Featured</Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="font-semibold leading-tight transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </Link>
          <Badge variant="muted" className="shrink-0">{project.category}</Badge>
        </div>

        <p className="mb-4 flex-1 text-sm text-muted-foreground">{project.summary}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {tech.slice(0, 4).map((t) => (
            <Badge key={t} variant="outline" className="text-[11px]">{t}</Badge>
          ))}
          {tech.length > 4 && (
            <Badge variant="outline" className="text-[11px]">+{tech.length - 4}</Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Details <ArrowUpRight className="size-3.5" />
          </Link>
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label="Source code" className="text-muted-foreground hover:text-foreground">
              <SocialIcon name="github" className="size-4" />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live demo" className="text-muted-foreground hover:text-foreground">
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
