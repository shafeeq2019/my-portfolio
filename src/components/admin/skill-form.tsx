"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FormField, Toggle } from "@/components/admin/form-ui";
import type { Skill } from "@prisma/client";
import type { FormState } from "@/app/admin/(dashboard)/skills/actions";

const CATEGORIES = ["Languages", "Frameworks", "Databases", "Cloud & DevOps", "Tools", "Other"];

function Save({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving…" : label}</Button>;
}

export function SkillForm({
  action,
  item,
  submitLabel = "Save",
}: {
  action: (p: FormState, fd: FormData) => Promise<FormState>;
  item?: Skill;
  submitLabel?: string;
}) {
  const [state, formAction] = React.useActionState(action, { status: "idle" } as FormState);
  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && (
        <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700">{state.message}</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name">
          <Input id="name" name="name" defaultValue={item?.name} required />
        </FormField>
        <FormField label="Category" htmlFor="category">
          <Select id="category" name="category" defaultValue={item?.category ?? "Languages"}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormField>
        <FormField label="Proficiency (1–5)" htmlFor="level">
          <Input id="level" name="level" type="number" min={1} max={5} defaultValue={item?.level ?? 3} />
        </FormField>
        <FormField label="Order" htmlFor="order">
          <Input id="order" name="order" type="number" defaultValue={item?.order ?? 0} />
        </FormField>
      </div>
      <Toggle name="published" label="Published" defaultChecked={item?.published ?? true} />
      <div><Save label={submitLabel} /></div>
    </form>
  );
}
