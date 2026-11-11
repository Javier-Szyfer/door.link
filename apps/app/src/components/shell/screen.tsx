"use client";

import { type ReactNode, type UIEvent, useRef, useState } from "react";
import { nextMinimized } from "@/lib/chrome-scroll";
import { pullProgress } from "@/lib/pull";
import { ActivityIndicator } from "./activity-indicator";
import { useChrome } from "./use-chrome";

type ScreenProps = {
  title: string;
  actions?: ReactNode;
  onRefresh?: () => Promise<void>;
  children: ReactNode;
};

const MIN_SPIN_MS = 600;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A scrollable screen whose large title and actions scroll away with the content.
export function Screen({ title, actions, onRefresh, children }: ScreenProps) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touching = useRef(false);
  const armed = useRef(false);
  const lastScrollTop = useRef(0);
  const { minimized, setMinimized } = useChrome();

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    const compact = nextMinimized(minimized, lastScrollTop.current, scrollTop);
    lastScrollTop.current = scrollTop;
    if (compact !== minimized) setMinimized(compact);
    if (!onRefresh || refreshing) return;
    const progress = pullProgress(scrollTop);
    setPull(progress.fraction);
    if (touching.current && progress.armed) armed.current = true;
  };

  const onTouchEnd = async () => {
    touching.current = false;
    if (!onRefresh || !armed.current || refreshing) return;
    armed.current = false;
    setRefreshing(true);
    await Promise.all([onRefresh().catch(() => {}), wait(MIN_SPIN_MS)]);
    setRefreshing(false);
    setPull(0);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-bg">
      <div
        className="scroll-area no-scrollbar flex-1 pt-[calc(var(--safe-top)+12px)] pb-[calc(var(--safe-bottom)+160px)]"
        onScroll={onScroll}
        onTouchStart={() => {
          touching.current = true;
        }}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {onRefresh && (
          <div
            className="relative transition-[height] duration-300 ease-out"
            style={{ height: refreshing ? 48 : 0 }}
            aria-hidden={!refreshing}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2 transition-[top] duration-300 ease-out"
              style={{ top: refreshing ? 10 : -34, opacity: refreshing ? 1 : pull }}
            >
              <ActivityIndicator progress={pull} spinning={refreshing} />
            </div>
          </div>
        )}
        <div className="flex min-h-14 items-center gap-3 px-4 pb-2">
          <h1 className="min-w-0 flex-1 truncate text-[24px] leading-[30px] font-bold tracking-tight">
            {title}
          </h1>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
