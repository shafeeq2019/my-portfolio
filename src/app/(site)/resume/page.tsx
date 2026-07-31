import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { Section, SectionHeader, EmptyState } from "@/components/section";
import { Button } from "@/components/ui/button";
import { getProfile, getExperience, getEducation, getSkills } from "@/lib/queries";
import { formatDateRange } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Résumé",
  description: "View and download my résumé / CV.",
};

export default async function ResumePage() {
  const [profile, experience, education, skills] = await Promise.all([
    getProfile(),
    getExperience(),
    getEducation(),
    getSkills(),
  ]);

  return (
    <Section className="max-w-4xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <SectionHeader eyebrow="CV" title="Résumé" className="mb-0" />
        {profile?.resumeUrl && (
          <Button asChild>
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Download /> Download PDF
            </a>
          </Button>
        )}
      </div>

      {!profile?.resumeUrl && (
        <div className="mt-6">
          <EmptyState
            icon={<FileText className="size-6" />}
            title="No résumé uploaded"
            description="Upload a résumé file from the admin dashboard to enable the download button."
          />
        </div>
      )}

      {/* Inline résumé rendered from structured data */}
      <div className="mt-10 rounded-lg border border-border bg-card p-8">
        <header className="border-b border-border pb-6">
          <h2 className="text-2xl font-bold">{profile?.fullName ?? "Your Name"}</h2>
          <p className="text-primary">{profile?.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {[profile?.email, profile?.location].filter(Boolean).join(" · ")}
          </p>
        </header>

        {experience.length > 0 && (
          <section className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Experience</h3>
            <ul className="space-y-4">
              {experience.map((e) => (
                <li key={e.id}>
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-medium">{e.role} · {e.company}</p>
                    <span className="text-sm text-muted-foreground">{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{e.description}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {education.length > 0 && (
          <section className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Education</h3>
            <ul className="space-y-2">
              {education.map((e) => (
                <li key={e.id} className="flex flex-wrap justify-between gap-2">
                  <span>{e.degree}{e.field ? `, ${e.field}` : ""} · {e.institution}</span>
                  <span className="text-sm text-muted-foreground">{formatDateRange(e.startDate, e.endDate)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Skills</h3>
            <p className="text-sm text-muted-foreground">{skills.map((s) => s.name).join(" · ")}</p>
          </section>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Prefer a conversation?{" "}
        <Link href="/contact" className="text-primary hover:underline">Get in touch</Link>.
      </p>
    </Section>
  );
}
