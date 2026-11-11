"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

type Chrome = {
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
  playerOpen: boolean;
  setPlayerOpen: (open: boolean) => void;
};

const ChromeContext = createContext<Chrome | null>(null);

// Whether the bottom bar is compacted and whether the full player sheet is open.
export function ChromeProvider({ children }: { children: ReactNode }) {
  const [minimized, setMinimized] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const value = useMemo(
    () => ({ minimized, setMinimized, playerOpen, setPlayerOpen }),
    [minimized, playerOpen],
  );
  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function useChrome() {
  const chrome = useContext(ChromeContext);
  if (!chrome) throw new Error("useChrome must be used inside ChromeProvider");
  return chrome;
}
