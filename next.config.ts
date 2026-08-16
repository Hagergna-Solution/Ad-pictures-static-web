import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Allow next/image to optimize backend-served media (R2 public bucket).
    remotePatterns: [{ protocol: "https", hostname: "**.r2.dev" }],
  },
};

export default nextConfig;
