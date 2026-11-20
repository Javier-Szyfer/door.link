"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_INSTALL_URL, IOS_APP_URL } from "@/lib/qr";

// A computer is told apart by its mouse/trackpad, not by the window's width: a
// narrowed desktop window must still get the QR panel, not leave the page (and
// stop the mix that's playing).
const DESKTOP = "(hover: hover) and (pointer: fine)";

type Device = "desktop" | "iphone" | "other";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getDevice = (): Device => {
  if (window.matchMedia(DESKTOP).matches) return "desktop";
  const touchMac = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || touchMac ? "iphone" : "other";
};
const getServerDevice = (): Device => "other";

const Or = () => (
  <div className="flex items-center gap-3 text-xs text-[#84858C]">
    <span className="h-px flex-1 bg-stone-300 dark:bg-[#333]" />
    or
    <span className="h-px flex-1 bg-stone-300 dark:bg-[#333]" />
  </div>
);

const panelStyle =
  "fixed z-50 flex w-[280px] flex-col gap-3 border border-stone-300 bg-white p-6 text-[#414141] duration-150 focus:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-[#121212] dark:text-[#f1f1f1]";

// The "Download" link in the nav. On desktop it opens a non-modal bottom-right
// panel with the iOS app and the PWA's QR; on iPhone a modal with the iOS app
// and the PWA; on other phones it goes straight to the PWA's install guide.
export const AppDialog = ({ qr }: { qr: string }) => {
  const device = useSyncExternalStore(subscribe, getDevice, getServerDevice);

  // New tab, so a mix playing here keeps playing.
  if (device === "other")
    return (
      <a href={APP_INSTALL_URL} target="_blank" rel="noopener noreferrer">
        Download
      </a>
    );

  const iosApp = (
    <a
      href={IOS_APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-1 border border-stone-300 py-3 font-medium dark:border-[#333]"
    >
      iOS
      <ArrowUpRight size={14} />
    </a>
  );

  return (
    <Dialog modal={device === "iphone"}>
      <DialogTrigger className="cursor-pointer">Download</DialogTrigger>
      <DialogPortal>
        {device === "iphone" ? (
          <>
            <DialogOverlay />
            {/* Centered with inset + auto margins, not translate: the fade animation sets
                `transform`, which would override a translate and slide the panel in. */}
            <DialogPrimitive.Content
              className={`${panelStyle} inset-0 m-auto h-fit max-w-[calc(100%-2rem)]`}
            >
              <DialogTitle className="font-medium">Get the app</DialogTitle>
              <DialogDescription className="sr-only">
                Download the iOS app or add door.link to your home screen.
              </DialogDescription>
              {iosApp}
              <Or />
              <a
                href={APP_INSTALL_URL}
                className="text-center text-sm underline underline-offset-4"
              >
                Add to home screen
              </a>
            </DialogPrimitive.Content>
          </>
        ) : (
          <DialogPrimitive.Content className={`${panelStyle} right-4 bottom-4`}>
            <DialogTitle className="font-medium">Get the app</DialogTitle>
            {iosApp}
            <Or />
            <p className="font-medium">PWA</p>
            <DialogDescription className="-mt-2 text-sm text-[#414141] dark:text-[#84858C]">
              Scan with your phone's camera, then add door.link to your home screen.
            </DialogDescription>
            <div
              className="mt-1 aspect-square w-full bg-white dark:bg-[#f1f1f1] [&>svg]:size-full"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: an SVG generated at build time from a fixed URL
              dangerouslySetInnerHTML={{ __html: qr }}
            />
          </DialogPrimitive.Content>
        )}
      </DialogPortal>
    </Dialog>
  );
};
