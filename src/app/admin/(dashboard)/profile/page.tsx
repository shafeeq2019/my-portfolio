import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/form-ui";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/admin/profile-form";
import { AddSocialLink } from "@/components/admin/add-social-link";
import { DeleteButton } from "@/components/admin/delete-button";
import { SocialIcon } from "@/components/social-icon";
import { deleteSocialLink } from "./actions";

export const metadata = { title: "Profile · Admin", robots: { index: false } };

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst({
    include: { socialLinks: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="max-w-3xl space-y-8">
      <AdminHeader title="Profile" description="Your personal brand, bio, photo and résumé." />

      <Card className="p-6">
        <ProfileForm profile={profile} />
      </Card>

      <Card className="p-6">
        <h2 className="mb-1 font-semibold">Social links</h2>
        <p className="mb-4 text-sm text-muted-foreground">Links shown in the header, footer and contact page.</p>

        {profile?.socialLinks && profile.socialLinks.length > 0 && (
          <ul className="mb-4 divide-y divide-border rounded-md border border-border">
            {profile.socialLinks.map((s) => (
              <li key={s.id} className="flex items-center gap-3 p-3">
                <SocialIcon name={s.icon} className="size-4 text-muted-foreground" />
                <span className="font-medium">{s.label}</span>
                <span className="flex-1 truncate text-sm text-muted-foreground">{s.url}</span>
                <DeleteButton action={deleteSocialLink.bind(null, s.id)} />
              </li>
            ))}
          </ul>
        )}

        <AddSocialLink />
      </Card>
    </div>
  );
}
