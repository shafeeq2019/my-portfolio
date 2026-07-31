"use client";

import * as React from "react";
import { Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublishToggle({
  published,
  action,
}: {
  published: boolean;
  action: (next: boolean) => Promise<void>;
}) {
  const [pending, start] = React.useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={pending}
      aria-label={published ? "Unpublish" : "Publish"}
      title={published ? "Published — click to hide" : "Draft — click to publish"}
      className={published ? "text-green-600" : "text-muted-foreground"}
      onClick={() => start(() => action(!published))}
    >
      {published ? <Eye /> : <EyeOff />}
    </Button>
  );
}

export function ReorderButtons({
  onUp,
  onDown,
}: {
  onUp: () => Promise<void>;
  onDown: () => Promise<void>;
}) {
  const [pending, start] = React.useTransition();
  return (
    <div className="flex flex-col">
      <button type="button" disabled={pending} onClick={() => start(() => onUp())} aria-label="Move up" className="text-muted-foreground hover:text-foreground disabled:opacity-40">
        <ChevronUp className="size-4" />
      </button>
      <button type="button" disabled={pending} onClick={() => start(() => onDown())} aria-label="Move down" className="text-muted-foreground hover:text-foreground disabled:opacity-40">
        <ChevronDown className="size-4" />
      </button>
    </div>
  );
}
