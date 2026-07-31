"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormField, Toggle } from "@/components/admin/form-ui";
import type { Education, Certification } from "@prisma/client";

type FormState = { status: "idle" | "error"; message?: string; errors?: Record<string, string[]> };
const iso = (d?: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : "");

function Save({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving…" : label}</Button>;
}

export function EducationForm({
  action,
  item,
  submitLabel = "Save",
}: {
  action: (p: FormState, fd: FormData) => Promise<FormState>;
  item?: Education;
  submitLabel?: string;
}) {
  const [state, formAction] = React.useActionState(action, { status: "idle" } as FormState);
  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700">{state.message}</p>}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Institution" htmlFor="institution"><Input id="institution" name="institution" defaultValue={item?.institution} required /></FormField>
        <FormField label="Degree" htmlFor="degree"><Input id="degree" name="degree" defaultValue={item?.degree} required /></FormField>
        <FormField label="Field of study" htmlFor="field"><Input id="field" name="field" defaultValue={item?.field ?? ""} /></FormField>
        <FormField label="Order" htmlFor="order"><Input id="order" name="order" type="number" defaultValue={item?.order ?? 0} /></FormField>
        <FormField label="Start date" htmlFor="startDate"><Input id="startDate" name="startDate" type="date" defaultValue={iso(item?.startDate)} required /></FormField>
        <FormField label="End date" htmlFor="endDate"><Input id="endDate" name="endDate" type="date" defaultValue={iso(item?.endDate)} /></FormField>
      </div>
      <FormField label="Description" htmlFor="description"><Textarea id="description" name="description" rows={3} defaultValue={item?.description ?? ""} /></FormField>
      <Toggle name="published" label="Published" defaultChecked={item?.published ?? true} />
      <div><Save label={submitLabel} /></div>
    </form>
  );
}

export function CertificationForm({
  action,
  item,
  submitLabel = "Save",
}: {
  action: (p: FormState, fd: FormData) => Promise<FormState>;
  item?: Certification;
  submitLabel?: string;
}) {
  const [state, formAction] = React.useActionState(action, { status: "idle" } as FormState);
  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700">{state.message}</p>}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name"><Input id="name" name="name" defaultValue={item?.name} required /></FormField>
        <FormField label="Issuer" htmlFor="issuer"><Input id="issuer" name="issuer" defaultValue={item?.issuer} required /></FormField>
        <FormField label="Issue date" htmlFor="issueDate"><Input id="issueDate" name="issueDate" type="date" defaultValue={iso(item?.issueDate)} required /></FormField>
        <FormField label="Expiry date" htmlFor="expiryDate"><Input id="expiryDate" name="expiryDate" type="date" defaultValue={iso(item?.expiryDate)} /></FormField>
        <FormField label="Credential ID" htmlFor="credentialId"><Input id="credentialId" name="credentialId" defaultValue={item?.credentialId ?? ""} /></FormField>
        <FormField label="Credential URL" htmlFor="credentialUrl"><Input id="credentialUrl" name="credentialUrl" type="url" defaultValue={item?.credentialUrl ?? ""} /></FormField>
        <FormField label="Order" htmlFor="order"><Input id="order" name="order" type="number" defaultValue={item?.order ?? 0} /></FormField>
      </div>
      <Toggle name="published" label="Published" defaultChecked={item?.published ?? true} />
      <div><Save label={submitLabel} /></div>
    </form>
  );
}
