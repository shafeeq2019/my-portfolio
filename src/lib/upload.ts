import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_DOC = ["application/pdf"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

/**
 * Saves an uploaded file to /public/uploads and returns its public URL.
 *
 * NOTE: local disk storage works for a single-instance / VPS deployment.
 * For serverless (e.g. Vercel) swap this for S3, UploadThing, or Vercel Blob —
 * the function signature can stay the same.
 */
export async function saveUpload(
  file: File,
  kind: "image" | "document" = "image",
): Promise<string> {
  if (!file || file.size === 0) throw new Error("No file provided.");
  if (file.size > MAX_BYTES) throw new Error("File is too large (max 8 MB).");

  const allowed = kind === "document" ? ALLOWED_DOC : ALLOWED_IMAGE;
  if (!allowed.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = extForType(file.type);
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, name), buffer);

  return `/uploads/${name}`;
}

function extForType(type: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "application/pdf": ".pdf",
  };
  return map[type] ?? "";
}
