import type { Metadata, Viewport } from "next";
import { Anonymous_Pro } from "next/font/google";
import { RegisterSW } from "@/components/register-sw";
import { splashImages } from "@/lib/splash";
import { startupLayoutScript } from "@/lib/startup-layout";
import { THEME_BG } from "@/lib/theme";
import "./globals.css";

const monoFont = Anonymous_Pro({
  subsets: ["latin", "latin-ext", "greek"],
  weight: ["400", "700"],
  variable: "--font-mono-app",
});

export const metadata: Metadata = {
  title: "door.link",
  description: "door.link mixtapes, online and offline",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "door.link",
    startupImage: splashImages(),
  },
  other: { "apple-mobile-web-app-capable": "yes" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: THEME_BG,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={monoFont.variable}
      style={{ backgroundColor: THEME_BG }}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed string that must run before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: startupLayoutScript }} />
      </head>
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
