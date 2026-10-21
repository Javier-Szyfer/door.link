import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { BlueHeartIcon } from "@/components/blue-heart-icon";
import { Player } from "@/components/player/player";
import { Toaster } from "@/components/ui/sonner";
import {
  OG_IMAGE,
  OG_VIDEO,
  SITE_DESCRIPTION,
  SITE_ICONS,
  SITE_NAME,
  TWITTER_PLAYER,
} from "@/constants/metadata";
import { SITE_URL } from "@/constants/urls";
import { AudioProvider } from "@/contexts/audio-context";

export const metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  icons: SITE_ICONS,
  openGraph: {
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: OG_IMAGE,
    videos: OG_VIDEO,
  },
  twitter: TWITTER_PLAYER,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-T9SNDX3F" />
      <body>
        <Analytics />
        <div className="mx-auto max-w-7xl pb-10 text-sm">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AudioProvider>
              {children}
              <Player />
              <Toaster
                icons={{
                  loading: <BlueHeartIcon />,
                }}
              />
            </AudioProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
