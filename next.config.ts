import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "hrlcunrezfuvhxbrihtf.supabase.co",
			},
		],
	},
};

export default nextConfig;
