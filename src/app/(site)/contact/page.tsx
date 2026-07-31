import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { ContactForm } from "@/components/contact-form";
import { SocialIcon } from "@/components/social-icon";
import { getProfile } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send me a message — I'd love to hear about your project or opportunity.",
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <Section>
      <SectionHeader
        eyebrow="Get in touch"
        title="Contact"
        description="Have a project, role or question? Send a message and I'll reply as soon as I can."
      />

      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-6">
          <div className="space-y-4">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-sm hover:text-primary">
                <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-card">
                  <Mail className="size-4" />
                </span>
                {profile.email}
              </a>
            )}
            {profile?.location && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-card">
                  <MapPin className="size-4" />
                </span>
                {profile.location}
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-card">
                <Clock className="size-4" />
              </span>
              Usually replies within 1–2 days
            </div>
          </div>

          {profile?.socialLinks && profile.socialLinks.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium">Elsewhere</p>
              <div className="flex flex-wrap gap-3">
                {profile.socialLinks.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground">
                    <SocialIcon name={s.icon} className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
