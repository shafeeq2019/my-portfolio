import type { z } from "zod";

/** Outcome of a service call that validates input. */
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; errors?: Record<string, string[]> };

export function invalid(error: z.ZodError, message = "Please fix the errors below."): ServiceResult<never> {
  return { ok: false, message, errors: error.flatten().fieldErrors as Record<string, string[]> };
}

/** Empty strings from optional form fields are stored as NULL. */
export function orNull(value: string | undefined | null) {
  return value || null;
}
