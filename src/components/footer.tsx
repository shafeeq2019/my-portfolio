import Link from "next/link";
import { getProfile } from "@/lib/queries";
import { SocialIcon } from "@/components/social-icon";

export async function Footer() {
  const profile = await getProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <div className="text-center sm:text-left">
          <p className="font-semibold">{profile?.fullName ?? "Your Name"}</p>
          <p className="text-sm text-muted-foreground">
            {profile?.headline ?? "Software Engineer"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {profile?.socialLinks.map((s) => (
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
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {year} {profile?.fullName ?? "Your Name"}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/projects" className="hover:text-foreground">Projects</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
