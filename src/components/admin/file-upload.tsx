"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileUpload({
  name,
  defaultValue,
  kind = "image",
  label = "Upload",
}: {
  name: string;
  defaultValue?: string | null;
  kind?: "image" | "document";
  label?: string;
}) {
  const [url, setUrl] = React.useState(defaultValue ?? "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept={kind === "document" ? "application/pdf" : "image/*"}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {url ? (
        <div className="flex items-center gap-3 rounded-md border border-border p-3">
          {kind === "image" ? (
            <div className="relative size-16 overflow-hidden rounded bg-muted">
              <Image src={url} alt="Preview" fill sizes="64px" className="object-cover" />
            </div>
          ) : (
            <FileText className="size-8 text-muted-foreground" />
          )}
          <span className="flex-1 truncate text-sm text-muted-foreground">{url}</span>
          <Button type="button" variant="ghost" size="icon" onClick={() => setUrl("")} aria-label="Remove">
            <X />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Upload />}
          {loading ? "Uploading…" : label}
        </Button>
      )}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
