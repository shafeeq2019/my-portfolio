import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader, EmptyState } from "@/components/section";
import { ProjectCard } from "@/components/project-card";
import { SocialIcon } from "@/components/social-icon";
import {
  getProfile,
  getFeaturedProjects,
  getSkills,
  getExperience,
  getTestimonials,
} from "@/lib/queries";

export default async function HomePage() {
  const [profile, featured, skills, experience, testimonials] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getSkills(),
    getExperience(),
    getTestimonials(),
  ]);

  const topSkills = skills.slice(0, 12);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[1.4fr_1fr]">
            <div className="animate-fade-up">
              {profile?.availableForWork && (
                <Badge className="mb-5 gap-1.5">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                  </span>
                  Available for work
                </Badge>
              )}
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                {profile?.fullName ?? "Your Name"}
              </h1>
              <p className="mt-3 text-xl font-medium text-primary sm:text-2xl">
                {profile?.headline ?? "Software Engineer"}
              </p>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                {profile?.tagline ??
                  "I build reliable, well-crafted software. This is a starter portfolio — sign in to the admin dashboard to add your content."}
              </p>

              {profile?.location && (
                <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" /> {profile.location}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/projects">
                    View my work <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get in touch</Link>
                </Button>
                {profile?.resumeUrl && (
                  <Button asChild variant="ghost" size="lg">
                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Download /> Résumé
                    </a>
                  </Button>
                )}
              </div>

              {profile?.socialLinks && profile.socialLinks.length > 0 && (
                <div className="mt-8 flex items-center gap-4">
                  {profile.socialLinks.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <SocialIcon name={s.icon} className="size-5" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="relative mx-auto hidden md:block">
              <div className="relative aspect-square w-72 overflow-hidden rounded-2xl border border-border bg-muted shadow-xl">
                {profile?.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    fill
                    priority
                    sizes="288px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-6xl font-bold text-primary/40">
                    {(profile?.fullName ?? "You").slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <Section className="py-16">
        <SectionHeader
          eyebrow="Selected work"
          title="Featured projects"
          description="A few things I've built recently."
        />
        {featured.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="size-6" />}
            title="No featured projects yet"
            description="Add projects in the admin dashboard and mark them as featured."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link href="/projects">
              All projects <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Skills preview */}
      {topSkills.length > 0 && (
        <Section className="py-16">
          <SectionHeader eyebrow="Toolbox" title="Technologies I work with" />
          <div className="flex flex-wrap gap-2.5">
            {topSkills.map((s) => (
              <Badge key={s.id} variant="outline" className="px-3 py-1.5 text-sm">
                {s.name}
              </Badge>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="ghost">
              <Link href="/skills">
                All skills <ArrowRight />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {/* Experience preview */}
      {experience.length > 0 && (
        <Section className="py-16">
          <SectionHeader eyebrow="Career" title="Where I've worked" />
          <ul className="space-y-4">
            {experience.slice(0, 3).map((e) => (
              <li
                key={e.id}
                className="flex flex-col justify-between gap-1 rounded-lg border border-border p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold">{e.role}</p>
                  <p className="text-sm text-muted-foreground">{e.company}</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(e.startDate).getFullYear()} –{" "}
                  {e.current ? "Present" : e.endDate ? new Date(e.endDate).getFullYear() : ""}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button asChild variant="ghost">
              <Link href="/experience">
                Full timeline <ArrowRight />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section className="py-16">
          <SectionHeader eyebrow="Kind words" title="Testimonials" />
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-lg border border-border bg-card p-6">
                <blockquote className="text-muted-foreground">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm font-medium">
                  {t.author}
                  {t.role && <span className="text-muted-foreground"> · {t.role}</span>}
                  {t.company && <span className="text-muted-foreground"> @ {t.company}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section className="py-16">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-10 text-center sm:p-16">
          <h2 className="text-3xl font-bold tracking-tight">Let&apos;s build something together</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Have a project in mind or a role to fill? I&apos;d love to hear about it.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">
              Start a conversation <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
