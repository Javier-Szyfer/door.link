"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import type { Tab } from "./nav";

type Nav = { tab: Tab; selectTab: (tab: Tab) => void };

const NavContext = createContext<Nav | null>(null);

// Holds the selected tab.
export function NavProvider({ children }: { children: ReactNode }) {
  const [tab, selectTab] = useState<Tab>("home");
  const value = useMemo(() => ({ tab, selectTab }), [tab]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const nav = useContext(NavContext);
  if (!nav) throw new Error("useNav must be used inside NavProvider");
  return nav;
}
