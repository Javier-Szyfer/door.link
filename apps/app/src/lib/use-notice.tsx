"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOnline } from "./use-online";

type Notices = { notice: string | null; notify: (message: string) => void };

const NoticeContext = createContext<Notices | null>(null);

const VISIBLE_MS = 4000;

// Holds the short message on screen, which leaves on its own or when the connection returns.
export function NoticeProvider({ children }: { children: ReactNode }) {
  const online = useOnline();
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setNotice(message);
    timer.current = window.setTimeout(() => setNotice(null), VISIBLE_MS);
  }, []);

  useEffect(() => {
    if (!online) return;
    window.clearTimeout(timer.current);
    setNotice(null);
  }, [online]);

  const value = useMemo(() => ({ notice, notify }), [notice, notify]);
  return <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>;
}

export function useNotice() {
  const notices = useContext(NoticeContext);
  if (!notices) throw new Error("useNotice must be used inside NoticeProvider");
  return notices;
}
