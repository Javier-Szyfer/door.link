"use client";

import { useSyncExternalStore } from "react";
import { Keyhole } from "@/components/icons/keyhole";
import { qrSvg } from "@/lib/qr";

const subscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

// Shown instead of the app on a computer: a QR that opens it on the phone.
// Which screens are "a computer" is decided in CSS (the `desktop` variant).
export function DesktopGate() {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);

  return (
    <div className="fixed inset-0 z-50 hidden flex-col items-center justify-center bg-bg px-10 text-center text-muted desktop:flex">
      <Keyhole size={44} outline />
      <p className="pt-3 text-[15px] font-semibold text-fg">Download</p>
      <p className="max-w-xs pt-1 text-[13px]">Scan this QR and download the app on your phone</p>
      <div className="mt-6 size-[240px] bg-fg">
        {origin && (
          <div
            className="size-full [&>svg]:size-full"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: an SVG generated locally from the page's own origin
            dangerouslySetInnerHTML={{ __html: qrSvg(origin) }}
          />
        )}
      </div>
    </div>
  );
}
