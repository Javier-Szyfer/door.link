import type { Metadata } from "next";
// PROVIDERS
import { Providers } from "Providers";

export const metadata: Metadata = {
  title: "door.link",
  description:
    "A curated selection of music for listening and dancing in closed spaces.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
