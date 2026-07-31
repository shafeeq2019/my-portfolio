"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { FormField, Toggle } from "@/components/admin/form-ui";
import { FileUpload } from "@/components/admin/file-upload";
import { parseList } from "@/lib/utils";
import type { Project, ProjectImage } from "@prisma/client";
import type { FormState } from "@/app/admin/(dashboard)/projects/actions";

const CATEGORIES = ["Web", "Mobile", "DevOps", "AI", "Open Source", "Other"];

function Save({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving…" : label}</Button>;
}

export function ProjectForm({
  action,
  project,
  submitLabel = "Save project",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  project?: Project & { images: ProjectImage[] };
  submitLabel?: string;
}) {
  const [state, formAction] = React.useActionState(action, { status: "idle" } as FormState);
  const tech = project ? parseList(project.technologies).join(", ") : "";

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && (
        <div role="alert" className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="size-4" /> {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title">
          <Input id="title" name="title" defaultValue={project?.title} required />
          {state.errors?.title && <p className="text-xs text-red-600">{state.errors.title[0]}</p>}
        </FormField>
        <FormField label="Slug" htmlFor="slug" hint="URL path. Leave blank to auto-generate from title.">
          <Input id="slug" name="slug" defaultValue={project?.slug} placeholder="my-project" />
          {state.errors?.slug && <p className="text-xs text-red-600">{state.errors.slug[0]}</p>}
        </FormField>
      </div>

      <FormField label="Summary" htmlFor="summary" hint="One-line description shown on cards.">
        <Input id="summary" name="summary" defaultValue={project?.summary} required />
        {state.errors?.summary && <p className="text-xs text-red-600">{state.errors.summary[0]}</p>}
      </FormField>

      <FormField label="Description" htmlFor="description" hint="Supports multiple paragraphs (use blank lines).">
        <Textarea id="description" name="description" rows={6} defaultValue={project?.description} required />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category">
          <Select id="category" name="category" defaultValue={project?.category ?? "Web"}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormField>
        <FormField label="Technologies" htmlFor="technologies" hint="Comma-separated, e.g. React, TypeScript, Node.js">
          <Input id="technologies" name="technologies" defaultValue={tech} placeholder="React, TypeScript" />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Live URL" htmlFor="liveUrl">
          <Input id="liveUrl" name="liveUrl" type="url" defaultValue={project?.liveUrl ?? ""} placeholder="https://…" />
        </FormField>
        <FormField label="Repository URL" htmlFor="repoUrl">
          <Input id="repoUrl" name="repoUrl" type="url" defaultValue={project?.repoUrl ?? ""} placeholder="https://github.com/…" />
        </FormField>
      </div>

      <FormField label="Outcome / impact" htmlFor="outcome" hint="Optional. Results, metrics, or impact.">
        <Textarea id="outcome" name="outcome" rows={3} defaultValue={project?.outcome ?? ""} />
      </FormField>

      <FormField label="Cover image">
        <FileUpload name="coverImage" defaultValue={project?.coverImage} label="Upload cover image" />
      </FormField>

      <div className="flex flex-wrap items-center gap-6 border-t border-border pt-4">
        <FormField label="Order" htmlFor="order" className="w-24">
          <Input id="order" name="order" type="number" defaultValue={project?.order ?? 0} />
        </FormField>
        <div className="flex gap-6 pt-6">
          <Toggle name="featured" label="Featured" defaultChecked={project?.featured} />
          <Toggle name="published" label="Published" defaultChecked={project?.published} />
        </div>
      </div>

      <div className="flex gap-3">
        <Save label={submitLabel} />
      </div>
    </form>
  );
}
