"use client";

import { Ellipsis, EllipsisVertical, Share, SquarePlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useState, useSyncExternalStore } from "react";
import { Keyhole } from "@/components/icons/keyhole";
import { chromeIntent, type InstallGuide as Guide, installGuide } from "@/lib/install";

const DISMISSED_KEY = "door:install-dismissed";

type InstallPrompt = Event & { prompt: () => Promise<{ outcome: "accepted" | "dismissed" }> };

let installPrompt: InstallPrompt | null = null;
const listeners = new Set<() => void>();
const notify = () => {
  for (const listener of listeners) listener();
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event as InstallPrompt;
    notify();
  });
}

// The browser's deferred install prompt, once Chrome has offered one.
function useInstallPrompt() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => installPrompt,
    () => null,
  );
}

const isInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

function Step({ n, icon, children }: { n: number; icon?: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 border-separator border-t py-3 first:border-t-0">
      <span className="w-4 shrink-0 text-muted">{n}</span>
      <span className="flex-1">{children}</span>
      {icon && <span className="text-muted">{icon}</span>}
    </li>
  );
}

const ICON = { size: 18, strokeWidth: 1.75 };

function Steps({ guide }: { guide: Guide }) {
  const steps: [string, ReactNode?][] =
    guide.kind === "ios-safari" && guide.modern
      ? [
          ["Tap ··· next to the address bar", <Ellipsis key="i" {...ICON} />],
          ["Tap Share", <Share key="i" {...ICON} />],
          ["Tap Add to Home Screen", <SquarePlus key="i" {...ICON} />],
          ["Tap Add"],
        ]
      : guide.kind === "ios-safari"
        ? [
            ["Tap Share at the bottom of the screen", <Share key="i" {...ICON} />],
            ["Tap Add to Home Screen", <SquarePlus key="i" {...ICON} />],
            ["Tap Add"],
          ]
        : guide.kind === "ios-other"
          ? [
              ["Tap Share in the menu or the address bar", <Share key="i" {...ICON} />],
              ["Tap Add to Home Screen", <SquarePlus key="i" {...ICON} />],
              ["Tap Add"],
            ]
          : [
              ["Tap ⋮ in the top corner", <EllipsisVertical key="i" {...ICON} />],
              ["Tap Add to home screen", <SquarePlus key="i" {...ICON} />],
              ["Tap Install"],
            ];

  return (
    <ol className="w-full max-w-xs text-left text-[13px] text-fg">
      {steps.map(([text, icon], i) => (
        <Step key={text} n={i + 1} icon={icon}>
          {text}
        </Step>
      ))}
    </ol>
  );
}

const buttonStyle =
  "flex h-11 w-full max-w-xs items-center justify-center rounded-full bg-fg text-[14px] font-semibold text-bg";

// Shown over the app when it's open in a phone's browser instead of from the home screen.
export function InstallGuide() {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [shown, setShown] = useState(false);
  const prompt = useInstallPrompt();

  useEffect(() => {
    if (isInstalled()) return;
    const url = new URL(window.location.href);
    const asked = url.searchParams.has("install");
    if (asked) {
      url.searchParams.delete("install");
      history.replaceState(history.state, "", url);
    }
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {}
    if (!asked && dismissed) return;

    const touchMac = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
    setGuide(installGuide(navigator.userAgent, touchMac));
    setShown(true);

    const onInstalled = () => setShown(false);
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  const dismiss = () => {
    setShown(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
  };

  const install = async () => {
    if (!prompt) return;
    const { outcome } = await prompt.prompt();
    installPrompt = null;
    notify();
    if (outcome === "accepted") setShown(false);
  };

  const inApp = guide?.kind === "in-app" ? guide : null;

  return (
    <AnimatePresence>
      {shown && guide && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-y-auto bg-bg px-8 pt-[max(var(--safe-top),24px)] pb-[max(var(--safe-bottom),24px)] text-center text-muted desktop:hidden"
        >
          <div className="flex flex-col items-center">
            <Keyhole size={44} outline />
            <h2 id="install-title" className="pt-3 text-[15px] font-semibold text-fg">
              {inApp ? "Open in your browser" : "Add door.link to your home screen"}
            </h2>
            {inApp && (
              <p className="max-w-xs pt-1 text-[13px]">
                {`Apps can't be installed from inside ${inApp.app}. Tap ${inApp.os === "ios" ? "···" : "⋮"} and choose Open in browser.`}
              </p>
            )}
          </div>

          {inApp ? (
            inApp.os === "android" && (
              <a href={chromeIntent(`${window.location.origin}/?install`)} className={buttonStyle}>
                Open in Chrome
              </a>
            )
          ) : guide.kind === "android" && prompt ? (
            <button type="button" onClick={install} className={buttonStyle}>
              Install
            </button>
          ) : (
            <Steps guide={guide} />
          )}

          <button
            type="button"
            onClick={dismiss}
            className="text-[13px] underline underline-offset-4"
          >
            Continue in browser
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
