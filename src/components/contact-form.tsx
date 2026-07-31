"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import Script from "next/script";
import { submitContact, type ContactState } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Sending…" : <>Send message <Send /></>}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = React.useActionState(submitContact, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  React.useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      {/* Live status region */}
      {state.status === "success" && (
        <div role="status" className="flex items-start gap-3 rounded-md border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}
      {state.status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" errors={state.errors?.name}>
          <Input id="name" name="name" required autoComplete="name" placeholder="Ada Lovelace" />
        </Field>
        <Field label="Email" name="email" errors={state.errors?.email}>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="ada@example.com" />
        </Field>
      </div>

      <Field label="Subject" name="subject" errors={state.errors?.subject}>
        <Input id="subject" name="subject" required placeholder="Let's work together" />
      </Field>

      <Field label="Message" name="message" errors={state.errors?.message}>
        <Textarea id="message" name="message" required rows={6} placeholder="Tell me about your project or opportunity…" />
      </Field>

      {/* Honeypot — hidden from humans */}
      <div aria-hidden className="absolute left-[-9999px]" tabIndex={-1}>
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {siteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={siteKey} />
        </>
      )}

      <SubmitButton />
      <p className="text-xs text-muted-foreground">
        Protected by spam filtering and rate limiting. Your details are only used to reply to you.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  errors,
  children,
}: {
  label: string;
  name: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {errors?.[0] && <p className="text-xs text-red-600 dark:text-red-400">{errors[0]}</p>}
    </div>
  );
}
