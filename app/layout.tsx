import type { Metadata } from "next";
// COMPONENTS
import { Nav } from "./components/ui/Header/Nav";
import { Header } from "./components/ui/Header/Header";
// PROVIDERS
import { Providers } from "Providers";

export const metadata: Metadata = {
  title: "door.link",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Providers>
          <main className="max-w-7xl mx-auto  pb-10 text-sm">
            <Header />
            <Nav />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
