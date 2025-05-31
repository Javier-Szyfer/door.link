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
	env: {
		VERCEL_ENV: process.env.VERCEL_ENV, // do not remove
		VERCEL_URL: process.env.VERCEL_URL, // do not remove
	},
};

export default nextConfig;
