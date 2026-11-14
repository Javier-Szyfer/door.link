"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadMixes } from "./load-mixes";
import type { Mix } from "./mix";
import { shouldRefresh } from "./refresh";
import { retryWithDelays } from "./retry";
import { getCachedMixes, setCachedMixes } from "./storage";

const fetchMixes = async (): Promise<Mix[]> => {
  const response = await fetch("/api/mixes", { cache: "no-store" });
  if (!response.ok) throw new Error(`Mixes responded ${response.status}`);
  return (await response.json()).mixes;
};

const RECONNECT_RETRY_MS = [2000, 5000, 10000];

type MixesState = { mixes: Mix[]; stale: boolean; loading: boolean };

// Loads the mix list, refreshes it when the app comes back, and falls back to the device offline.
export function useMixes() {
  const [state, setState] = useState<MixesState>({ mixes: [], stale: false, loading: true });
  const lastLoadedAt = useRef<number | null>(null);
  const inFlight = useRef<Promise<void> | null>(null);
  const reconnecting = useRef(false);

  const refresh = useCallback(() => {
    if (inFlight.current) return inFlight.current;
    inFlight.current = loadMixes(fetchMixes, { get: getCachedMixes, set: setCachedMixes })
      .then((result) => {
        if (!result.stale) lastLoadedAt.current = Date.now();
        setState((current) =>
          result.stale && current.mixes.length && !result.mixes.length
            ? { ...current, stale: true, loading: false }
            : { ...result, loading: false },
        );
      })
      .finally(() => {
        inFlight.current = null;
      });
    return inFlight.current;
  }, []);

  useEffect(() => {
    getCachedMixes()
      .then((cached) => {
        if (cached) setState((s) => (s.loading ? { ...s, mixes: cached } : s));
      })
      .catch(() => {});
    refresh();

    const onVisible = () => {
      if (
        document.visibilityState === "visible" &&
        shouldRefresh(lastLoadedAt.current, Date.now())
      ) {
        refresh();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    // The network can take a moment to work after the browser reports it, so this tries again.
    const onOnline = () => {
      if (reconnecting.current) return;
      reconnecting.current = true;
      retryWithDelays(async () => {
        if (!navigator.onLine) return true;
        const before = lastLoadedAt.current;
        await refresh();
        return lastLoadedAt.current !== before;
      }, RECONNECT_RETRY_MS).finally(() => {
        reconnecting.current = false;
      });
    };
    window.addEventListener("online", onOnline);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
    };
  }, [refresh]);

  return { ...state, refresh };
}
