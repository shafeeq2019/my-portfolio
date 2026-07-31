import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/queries";

export const runtime = "nodejs";
export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const profile = await getProfile().catch(() => null);
  const name = profile?.fullName ?? "Software Engineer";
  const headline = profile?.headline ?? "Portfolio";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0b 0%, #1e1b4b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, color: "#a5b4fc", marginBottom: 12 }}>{headline}</div>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.1 }}>{name}</div>
        <div style={{ display: "flex", marginTop: 40, alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 6, background: "#818cf8", borderRadius: 4 }} />
          <div style={{ fontSize: 28, color: "#a1a1aa" }}>
            {(profile?.tagline ?? "Projects · Experience · Skills").slice(0, 60)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
