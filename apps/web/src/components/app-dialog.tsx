"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSyncExternalStore } from "react";
import {
  Dialog,
  DialogDescription,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_INSTALL_URL } from "@/lib/qr";

// Tailwind's `lg`, where the PWA link opens a QR panel instead of the app.
const DESKTOP = "(min-width: 1024px)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isDesktop = () => window.matchMedia(DESKTOP).matches;
const isDesktopOnServer = () => false;

// The "PWA" link in the nav: on phones it opens the app's install guide, on
// desktop a non-modal bottom-right panel with a QR to scan.
export const AppDialog = ({ qr }: { qr: string }) => {
  const desktop = useSyncExternalStore(subscribe, isDesktop, isDesktopOnServer);

  if (!desktop) return <a href={APP_INSTALL_URL}>PWA</a>;

  return (
    <Dialog modal={false}>
      <DialogTrigger className="cursor-pointer">PWA</DialogTrigger>
      <DialogPortal>
        <DialogPrimitive.Content className="fixed right-4 bottom-4 z-50 flex w-[280px] flex-col gap-3 border border-stone-300 bg-white p-6 text-[#414141] duration-150 focus:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-[#121212] dark:text-[#f1f1f1]">
          <DialogTitle className="font-medium">Get the app</DialogTitle>
          <DialogDescription className="text-sm text-[#414141] dark:text-[#84858C]">
            Scan with your phone's camera, then add door.link to your home screen.
          </DialogDescription>
          <div
            className="mt-2 aspect-square w-full bg-white dark:bg-[#f1f1f1] [&>svg]:size-full"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: an SVG generated at build time from a fixed URL
            dangerouslySetInnerHTML={{ __html: qr }}
          />
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
