import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_DOC = ["application/pdf"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export class UploadError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}

/**
 * Saves to Vercel Blob when configured, otherwise uses local disk for development.
 */
export async function saveUpload(
  file: File,
  kind: "image" | "document" = "image",
): Promise<string> {
  if (!file || file.size === 0) throw new UploadError("No file provided.", 400);
  if (file.size > MAX_BYTES) {
    throw new UploadError("File is too large (max 8 MB).", 400);
  }

  const allowed = kind === "document" ? ALLOWED_DOC : ALLOWED_IMAGE;
  if (!allowed.includes(file.type)) {
    throw new UploadError(`Unsupported file type: ${file.type}`, 400);
  }

  const ext = extForType(file.type);
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (hasBlobConfiguration()) {
    const blob = await put(`uploads/${name}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new UploadError(
      "Vercel Blob is not configured. Connect a Blob store to this Vercel project.",
      503,
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), buffer);

  return `/uploads/${name}`;
}

function hasBlobConfiguration(): boolean {
  // Vercel can provide the OIDC token through request context instead of env.
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
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
