import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Parse a JSON-encoded string[] column, returning [] on failure. */
export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDateRange(
  start: Date | string,
  end?: Date | string | null,
  current?: boolean,
): string {
  const fmt = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const startStr = fmt(start);
  if (current) return `${startStr} – Present`;
  if (!end) return startStr;
  return `${startStr} – ${fmt(end)}`;
}

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";
