"use client";

import * as React from "react";
import { ProjectCard } from "@/components/project-card";
import { EmptyState } from "@/components/section";
import { cn, parseList } from "@/lib/utils";
import { FolderGit2 } from "lucide-react";
import type { Project, ProjectImage } from "@prisma/client";

type ProjectWithImages = Project & { images: ProjectImage[] };

export function ProjectsGallery({ projects }: { projects: ProjectWithImages[] }) {
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set).sort()];
  }, [projects]);

  const technologies = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => parseList(p.technologies).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const [category, setCategory] = React.useState("All");
  const [tech, setTech] = React.useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const catOk = category === "All" || p.category === category;
    const techOk = !tech || parseList(p.technologies).includes(tech);
    return catOk && techOk;
  });

  return (
    <div>
      {/* Category filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              category === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Technology filter */}
      {technologies.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tech:
          </span>
          {technologies.map((t) => (
            <button
              key={t}
              onClick={() => setTech(tech === t ? null : t)}
              className={cn(
                "rounded-md px-2 py-1 text-xs transition-colors",
                tech === t
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t}
            </button>
          ))}
          {tech && (
            <button onClick={() => setTech(null)} className="text-xs text-primary underline">
              clear
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="size-6" />}
          title="No projects match your filter"
          description="Try a different category or technology."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
