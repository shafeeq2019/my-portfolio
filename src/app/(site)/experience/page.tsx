import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { Section, SectionHeader, EmptyState } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { getExperience } from "@/lib/queries";
import { formatDateRange, parseList } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Experience",
  description: "My professional work experience and career timeline.",
};

export default async function ExperiencePage() {
  const experience = await getExperience();

  return (
    <Section>
      <SectionHeader
        eyebrow="Career"
        title="Experience"
        description="A timeline of the companies and teams I've worked with."
      />

      {experience.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="size-6" />}
          title="No experience entries yet"
          description="Add roles from the admin dashboard."
        />
      ) : (
        <ol className="relative border-l-2 border-border">
          {experience.map((e) => {
            const highlights = parseList(e.highlights);
            return (
              <li key={e.id} className="mb-10 ml-6">
                <span className="absolute -left-[9px] flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background" />
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{e.role}</h3>
                      <p className="text-primary">
                        {e.companyUrl ? (
                          <a href={e.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {e.company}
                          </a>
                        ) : (
                          e.company
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-1 sm:items-end">
                      <span className="text-sm text-muted-foreground">
                        {formatDateRange(e.startDate, e.endDate, e.current)}
                      </span>
                      <div className="flex gap-1.5">
                        {e.employmentType && <Badge variant="muted">{e.employmentType}</Badge>}
                        {e.location && <Badge variant="outline">{e.location}</Badge>}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>

                  {highlights.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Section>
  );
}
