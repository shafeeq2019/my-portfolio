import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { Section, SectionHeader, EmptyState } from "@/components/section";
import { getSkills } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical skills, tools and areas of expertise.",
};

export default async function SkillsPage() {
  const skills = await getSkills();

  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <Section>
      <SectionHeader
        eyebrow="Expertise"
        title="Skills & tools"
        description="Technologies and tools I use to design, build and ship software."
      />

      {skills.length === 0 ? (
        <EmptyState
          icon={<Wrench className="size-6" />}
          title="No skills added yet"
          description="Add skills from the admin dashboard."
        />
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">{category}</h3>
              <ul className="space-y-3">
                {items.map((s) => (
                  <li key={s.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>{s.name}</span>
                      <span className="text-xs text-muted-foreground">{levelLabel(s.level)}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(s.level / 5) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function levelLabel(level: number): string {
  return ["", "Beginner", "Familiar", "Proficient", "Advanced", "Expert"][level] ?? "";
}
