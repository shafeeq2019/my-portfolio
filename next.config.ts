import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    // Allow larger payloads for image uploads in server actions.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
