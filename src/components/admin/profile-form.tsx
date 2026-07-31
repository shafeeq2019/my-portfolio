"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormField, Toggle } from "@/components/admin/form-ui";
import { FileUpload } from "@/components/admin/file-upload";
import type { Profile } from "@prisma/client";
import { saveProfile, type FormState } from "@/app/admin/(dashboard)/profile/actions";

function Save() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save profile"}</Button>;
}

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action] = React.useActionState(saveProfile, { status: "idle" } as FormState);

  return (
    <form action={action} className="space-y-6">
      {state.status === "success" && (
        <div className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-4" /> {state.message}
        </div>
      )}
      {state.status === "error" && (
        <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700">
          <AlertCircle className="size-4" /> {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="fullName"><Input id="fullName" name="fullName" defaultValue={profile?.fullName} required /></FormField>
        <FormField label="Headline" htmlFor="headline" hint="e.g. Senior Software Engineer"><Input id="headline" name="headline" defaultValue={profile?.headline} required /></FormField>
      </div>

      <FormField label="Tagline" htmlFor="tagline" hint="Short intro shown on the hero.">
        <Input id="tagline" name="tagline" defaultValue={profile?.tagline ?? ""} />
      </FormField>

      <FormField label="Bio" htmlFor="bio" hint="Longer about-me text. Separate paragraphs with blank lines.">
        <Textarea id="bio" name="bio" rows={6} defaultValue={profile?.bio} required />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Email" htmlFor="email"><Input id="email" name="email" type="email" defaultValue={profile?.email} required /></FormField>
        <FormField label="Location" htmlFor="location"><Input id="location" name="location" defaultValue={profile?.location ?? ""} /></FormField>
        <FormField label="Phone" htmlFor="phone"><Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} /></FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Profile photo"><FileUpload name="avatarUrl" defaultValue={profile?.avatarUrl} label="Upload photo" /></FormField>
        <FormField label="Résumé (PDF)"><FileUpload name="resumeUrl" defaultValue={profile?.resumeUrl} kind="document" label="Upload résumé" /></FormField>
      </div>

      <div className="border-t border-border pt-4">
        <Toggle name="availableForWork" label="Available for work (shows badge on hero)" defaultChecked={profile?.availableForWork ?? true} />
      </div>

      <Save />
    </form>
  );
}
