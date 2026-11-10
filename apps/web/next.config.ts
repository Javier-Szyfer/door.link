import type { NextConfig } from "next";

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_URL
  ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2678400,
    remotePatterns: mediaHost ? [{ protocol: "https", hostname: mediaHost }] : [],
  },
};

export default nextConfig;
