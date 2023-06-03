import type { Metadata } from "next";
import { GENERAL_METADATA } from "const/metadata";
// PROVIDERS
import { Providers } from "Providers";

export const metadata: Metadata = {
  ...GENERAL_METADATA,
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
