"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { deleteDownload, downloadMix } from "./downloads";
import type { Mix } from "./mix";
import { useLibrary } from "./use-library";
import { useNotice } from "./use-notice";

type Downloads = {
  active: Record<string, number>;
  start: (mix: Mix) => void;
  cancel: (number: string) => void;
  remove: (mix: Mix) => Promise<void>;
};

const DownloadsContext = createContext<Downloads | null>(null);

// Tells the service worker which files are now on the device.
const notifyWorker = () =>
  navigator.serviceWorker?.controller?.postMessage({ type: "downloads-changed" });

const describeError = (error: unknown) => {
  if (error instanceof DOMException && error.name === "QuotaExceededError") {
    return "Not enough space on this device";
  }
  return "Download failed — check your connection";
};

// Runs downloads in the background of the app and tracks their progress.
export function DownloadsProvider({ children }: { children: ReactNode }) {
  const { refreshDownloads } = useLibrary();
  const { notify } = useNotice();
  const [active, setActive] = useState<Record<string, number>>({});
  const controllers = useRef(new Map<string, AbortController>());

  const start = useCallback(
    (mix: Mix) => {
      if (controllers.current.has(mix.number)) return;
      const controller = new AbortController();
      controllers.current.set(mix.number, controller);
      navigator.storage?.persist?.().catch(() => {});
      setActive((current) => ({ ...current, [mix.number]: 0 }));

      downloadMix(
        mix,
        (fraction) => setActive((current) => ({ ...current, [mix.number]: fraction })),
        controller.signal,
      )
        .then(() => notify(`${mix.title} downloaded`))
        .catch((error) => {
          if (!controller.signal.aborted) notify(describeError(error));
        })
        .finally(() => {
          controllers.current.delete(mix.number);
          setActive(({ [mix.number]: _done, ...rest }) => rest);
          notifyWorker();
          refreshDownloads();
        });
    },
    [refreshDownloads, notify],
  );

  const cancel = useCallback((number: string) => controllers.current.get(number)?.abort(), []);

  const remove = useCallback(
    async (mix: Mix) => {
      await deleteDownload(mix).catch((error) => console.error(error));
      notifyWorker();
      await refreshDownloads();
    },
    [refreshDownloads],
  );

  const value = useMemo(() => ({ active, start, cancel, remove }), [active, start, cancel, remove]);

  return <DownloadsContext.Provider value={value}>{children}</DownloadsContext.Provider>;
}

export function useDownloads() {
  const downloads = useContext(DownloadsContext);
  if (!downloads) throw new Error("useDownloads must be used inside DownloadsProvider");
  return downloads;
}
