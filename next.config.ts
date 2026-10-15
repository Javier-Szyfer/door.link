import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        hostname: "hrlcunrezfuvhxbrihtf.supabase.co",
      },
    ],
  },
};

export default nextConfig;
