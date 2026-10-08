import { z } from "zod";
import type { ServiceResult } from "@/lib/services/result";

export function json(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function fail(message: string, errors?: Record<string, string[]>) {
  return { ...json({ message, errors }), isError: true };
}

export function fromResult<T>(result: ServiceResult<T>) {
  return result.ok ? json(result.data) : fail(result.message, result.errors);
}

export function notFound(kind: string, id: string) {
  return fail(`${kind} "${id}" not found.`);
}

/**
 * Turns a stored record back into service input so partial updates can be
 * merged onto it: dates become YYYY-MM-DD, NULLs become absent.
 */
export function toInput(record: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([, value]) => value !== null)
      .map(([key, value]) => [key, value instanceof Date ? value.toISOString().slice(0, 10) : value]),
  );
}

export const id = z.string().describe("Record id");
export const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.")
  .refine((value) => {
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Not a valid calendar date.")
  .describe("Date as YYYY-MM-DD");
export const order = z.number().int().describe("Sort position (ascending)");
export const published = z.boolean().describe("Visible on the public site");

export const UPDATE_HINT = 'Only the given fields are changed. Pass "" to clear an optional field.';
