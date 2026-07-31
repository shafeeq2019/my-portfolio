"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Are you sure? This cannot be undone.",
  size = "icon",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
  size?: "icon" | "sm" | "default";
}) {
  const [pending, start] = React.useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      disabled={pending}
      aria-label={label}
      className="text-muted-foreground hover:text-red-600"
      onClick={() => {
        if (confirm(confirmText)) start(() => action());
      }}
    >
      <Trash2 />
      {size !== "icon" && <span>{label}</span>}
    </Button>
  );
}
