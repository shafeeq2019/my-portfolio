import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload, UploadError } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const kind = (form.get("kind") as string) === "document" ? "document" : "image";
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    const url = await saveUpload(file, kind);
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    const status = e instanceof UploadError ? e.statusCode : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
