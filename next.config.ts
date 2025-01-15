import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "hrlcunrezfuvhxbrihtf.supabase.co",
			},
		],
	},
	env: {
		VERCEL_URL: process.env.VERCEL_URL,
	},
};

export default nextConfig;
