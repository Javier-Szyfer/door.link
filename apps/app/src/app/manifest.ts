import type { MetadataRoute } from "next";
import { THEME_BG } from "../lib/theme.ts";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "door.link",
    short_name: "door.link",
    description: "door.link mixtapes, online and offline",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: THEME_BG,
    theme_color: THEME_BG,
    icons: [
      { src: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/android-chrome-256x256.png", sizes: "256x256", type: "image/png" },
      { src: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
