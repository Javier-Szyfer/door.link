const OG_BASE_URL =
  process.env.VERCEL_ENV === "preview"
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : "https://www.door.link";

export const SITE_NAME = "door.link";
export const SITE_DESCRIPTION =
  "A handpicked music selection, grown over time, algorithm-free, made for listening and dancing.";
export const OG_IMAGE = {
  url: `${OG_BASE_URL}/og/keyhole-tunnel.jpg`,
  width: 1200,
  height: 630,
};
export const OG_VIDEO = {
  url: `${OG_BASE_URL}/og/keyhole-tunnel.mp4`,
  secureUrl: `${OG_BASE_URL}/og/keyhole-tunnel.mp4`,
  type: "video/mp4",
  width: 1200,
  height: 630,
};
export const TWITTER_PLAYER = {
  card: "player" as const,
  images: OG_IMAGE,
  players: {
    playerUrl: `${OG_BASE_URL}/og/player`,
    streamUrl: OG_VIDEO.url,
    width: OG_VIDEO.width,
    height: OG_VIDEO.height,
  },
};
export const SITE_ICONS = [
  {
    rel: "icon",
    url: "/favicon.ico",
    sizes: "32x32",
  },
  {
    rel: "icon",
    url: "/favicon-32x32.png",
    sizes: "32x32",
    type: "image/png",
  },
  {
    rel: "icon",
    url: "/favicon-16x16.png",
    sizes: "16x16",
    type: "image/png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    url: "/apple-touch-icon.png",
  },
];
