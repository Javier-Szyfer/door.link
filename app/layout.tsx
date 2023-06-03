import type { Metadata } from "next";
import { SHARED_METADATA } from "./const/metadata";
// PROVIDERS
import { Providers } from "./Providers";
import Script from "next/script";

export const metadata: Metadata = {
  ...SHARED_METADATA,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7E2SWW6YEG"
        />

        <Script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7E2SWW6YEG');
        `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
