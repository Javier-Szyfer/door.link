"use client";

import { useEffect } from "react";

// Registers the service worker in production and hands it the assets already loaded.
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        const urls = performance.getEntriesByType("resource").map((entry) => entry.name);
        registration.active?.postMessage({ type: "cache-assets", urls });
      })
      .catch((error) => console.error("Service worker registration failed:", error));
  }, []);
  return null;
}
