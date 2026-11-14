"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSyncExternalStore } from "react";
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_URL } from "@/lib/qr";

// Tailwind's `lg`, where the panel floats bottom-right instead of centered.
const DESKTOP = "(min-width: 1024px)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isDesktop = () => window.matchMedia(DESKTOP).matches;
const isDesktopOnServer = () => false;

// The "PWA" link in the nav and the panel it opens, with a QR that opens the
// app on a phone. On phones the panel is a centered modal and the QR itself is
// the link. On desktop it floats bottom-right and isn't modal: a modal locks the
// page scroll, and hiding the scrollbar would shift the whole site sideways.
export const AppDialog = ({ qr }: { qr: string }) => {
  const desktop = useSyncExternalStore(subscribe, isDesktop, isDesktopOnServer);

  return (
    <Dialog modal={!desktop}>
      <DialogTrigger className="cursor-pointer">PWA</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        {/* Centered with inset + auto margins, not translate: the fade animation sets
            `transform`, which would override a translate and slide the panel in. */}
        <DialogPrimitive.Content className="fixed inset-0 z-50 m-auto flex h-fit w-[calc(100%-2rem)] max-w-[280px] flex-col gap-3 border border-stone-300 bg-white p-6 text-[#414141] duration-150 focus:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-[#121212] dark:text-[#f1f1f1] lg:inset-auto lg:bottom-4 lg:right-4 lg:m-0">
          <DialogTitle className="font-medium">Download</DialogTitle>
          <DialogDescription className="text-sm text-[#414141] dark:text-[#84858C]">
            Scan this QR and download the app on your phone
          </DialogDescription>
          <a
            href={APP_URL}
            aria-label="Open the door app"
            className="mt-2 block aspect-square w-full bg-white focus:outline-none dark:bg-[#f1f1f1] [&>svg]:size-full"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: an SVG generated at build time from a fixed URL
            dangerouslySetInnerHTML={{ __html: qr }}
          />
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
