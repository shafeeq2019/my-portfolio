"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormField, Toggle } from "@/components/admin/form-ui";
import { parseList } from "@/lib/utils";
import type { Experience } from "@prisma/client";
import type { FormState } from "@/app/admin/(dashboard)/experience/actions";

function iso(d?: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function Save({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving…" : label}</Button>;
}

export function ExperienceForm({
  action,
  item,
  submitLabel = "Save",
}: {
  action: (p: FormState, fd: FormData) => Promise<FormState>;
  item?: Experience;
  submitLabel?: string;
}) {
  const [state, formAction] = React.useActionState(action, { status: "idle" } as FormState);
  const highlights = item ? parseList(item.highlights).join("\n") : "";

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && (
        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700">
          <AlertCircle className="size-4" /> {state.message}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Company" htmlFor="company">
          <Input id="company" name="company" defaultValue={item?.company} required />
        </FormField>
        <FormField label="Role" htmlFor="role">
          <Input id="role" name="role" defaultValue={item?.role} required />
        </FormField>
        <FormField label="Location" htmlFor="location">
          <Input id="location" name="location" defaultValue={item?.location ?? ""} />
        </FormField>
        <FormField label="Employment type" htmlFor="employmentType" hint="e.g. Full-time, Contract">
          <Input id="employmentType" name="employmentType" defaultValue={item?.employmentType ?? ""} />
        </FormField>
        <FormField label="Start date" htmlFor="startDate">
          <Input id="startDate" name="startDate" type="date" defaultValue={iso(item?.startDate)} required />
        </FormField>
        <FormField label="End date" htmlFor="endDate" hint="Leave blank if current.">
          <Input id="endDate" name="endDate" type="date" defaultValue={iso(item?.endDate)} />
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description">
        <Textarea id="description" name="description" rows={3} defaultValue={item?.description} required />
      </FormField>

      <FormField label="Highlights" htmlFor="highlights" hint="One bullet point per line.">
        <Textarea id="highlights" name="highlights" rows={4} defaultValue={highlights} placeholder={"Led migration to…\nReduced latency by…"} />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Company URL" htmlFor="companyUrl">
          <Input id="companyUrl" name="companyUrl" type="url" defaultValue={item?.companyUrl ?? ""} />
        </FormField>
        <FormField label="Order" htmlFor="order">
          <Input id="order" name="order" type="number" defaultValue={item?.order ?? 0} />
        </FormField>
      </div>

      <div className="flex gap-6 border-t border-border pt-4">
        <Toggle name="current" label="Current role" defaultChecked={item?.current} />
        <Toggle name="published" label="Published" defaultChecked={item?.published ?? true} />
      </div>

      <Save label={submitLabel} />
    </form>
  );
}
