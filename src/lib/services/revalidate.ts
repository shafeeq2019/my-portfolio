import { revalidatePath } from "next/cache";

/**
 * Content changes show up on many public pages (home, resume, /projects/[slug]
 * under old and new slugs, ...), so refresh the whole site instead of tracking
 * every page that reads a given model. Admin pages are covered too.
 */
export function revalidateSite() {
  revalidatePath("/", "layout");
}
