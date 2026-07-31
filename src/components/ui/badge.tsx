import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "muted";
}) {
  const variants = {
    default: "bg-primary/10 text-primary border-primary/20",
    outline: "border-border text-foreground",
    muted: "bg-muted text-muted-foreground border-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
