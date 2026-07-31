"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { addSocialLink, type FormState } from "@/app/admin/(dashboard)/profile/actions";

const ICONS = ["github", "linkedin", "twitter", "email", "website", "youtube", "instagram", "rss"];

function Add() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending} size="sm">{pending ? "Adding…" : "Add link"}</Button>;
}

export function AddSocialLink() {
  const [state, action] = React.useActionState(addSocialLink, { status: "idle" } as FormState);
  const ref = React.useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    if (state.status === "success") ref.current?.reset();
  }, [state.status]);

  return (
    <form ref={ref} action={action} className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Label</label>
        <Input name="label" placeholder="GitHub" required className="h-9 w-32" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">URL</label>
        <Input name="url" type="url" placeholder="https://…" required className="h-9 w-56" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Icon</label>
        <Select name="icon" className="h-9 w-32" defaultValue="github">
          {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
        </Select>
      </div>
      <Add />
      {state.status === "error" && <p className="w-full text-xs text-red-600">{state.message}</p>}
    </form>
  );
}
