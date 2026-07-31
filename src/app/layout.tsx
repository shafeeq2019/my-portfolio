import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getProfile } from "@/lib/queries";
import { siteUrl } from "@/lib/utils";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const name = profile?.fullName ?? "Software Engineer Portfolio";
  const headline = profile?.headline ?? "Software Engineer";
  const description =
    profile?.tagline ??
    profile?.bio?.slice(0, 155) ??
    "Portfolio of a software engineer — projects, experience and skills.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${name} — ${headline}`,
      template: `%s — ${name}`,
    },
    description,
    keywords: ["software engineer", "portfolio", "developer", name],
    authors: [{ name }],
    creator: name,
    openGraph: {
      type: "website",
      url: siteUrl,
      title: `${name} — ${headline}`,
      description,
      siteName: name,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${headline}`,
      description,
      images: ["/opengraph-image"],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
