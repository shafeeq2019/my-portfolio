import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, Mail, MapPin } from "lucide-react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "@/components/social-icon";
import { getProfile, getEducation, getCertifications } from "@/lib/queries";
import { formatDateRange, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [profile, education, certifications] = await Promise.all([
    getProfile(),
    getEducation(),
    getCertifications(),
  ]);

  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
        <aside className="space-y-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted">
            {profile?.avatarUrl ? (
              <Image src={profile.avatarUrl} alt={profile.fullName} fill sizes="320px" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-5xl font-bold text-primary/40">
                {(profile?.fullName ?? "You").slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {profile?.location && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" /> {profile.location}
              </p>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Mail className="size-4" /> {profile.email}
              </a>
            )}
          </div>

          {profile?.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {profile.socialLinks.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-muted-foreground hover:text-foreground">
                  <SocialIcon name={s.icon} className="size-5" />
                </a>
              ))}
            </div>
          )}

          {profile?.resumeUrl && (
            <Button asChild variant="outline" className="w-full">
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Download /> Download Résumé
              </a>
            </Button>
          )}
        </aside>

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About me</h1>
          {profile?.headline && <p className="mt-2 text-lg text-primary">{profile.headline}</p>}
          <div className="prose-content mt-6 text-muted-foreground">
            {(profile?.bio ?? "Add your bio from the admin dashboard.")
              .split("\n")
              .filter(Boolean)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold tracking-tight">Education</h2>
              <ul className="space-y-6">
                {education.map((e) => (
                  <li key={e.id} className="border-l-2 border-border pl-5">
                    <p className="font-semibold">{e.degree}{e.field ? `, ${e.field}` : ""}</p>
                    <p className="text-sm text-muted-foreground">{e.institution}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateRange(e.startDate, e.endDate)}
                    </p>
                    {e.description && <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold tracking-tight">Certifications & awards</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {certifications.map((c) => (
                  <li key={c.id} className="rounded-lg border border-border p-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.issuer}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(c.issueDate)}</p>
                    {c.credentialUrl && (
                      <Link href={c.credentialUrl} target="_blank" className="mt-2 inline-block text-xs text-primary hover:underline">
                        View credential →
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
