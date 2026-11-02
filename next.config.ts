import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Allow next/image to optimize the static media domain and backend-served
    // media (R2 public bucket on r2.dev).
    remotePatterns: [
      { protocol: "https", hostname: "asset.adpicturesethio.com" },
      { protocol: "https", hostname: "**.r2.dev" },
    ],
  },
};

export default nextConfig;
