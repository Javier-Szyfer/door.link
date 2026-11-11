"use client";

import type { ComponentType } from "react";
import { PlayerProvider } from "@/components/player/audio-engine";
import { FullPlayer } from "@/components/player/full-player";
import { DownloadsScreen } from "@/components/screens/downloads";
import { HomeScreen } from "@/components/screens/home";
import { SavedScreen } from "@/components/screens/saved";
import { SearchScreen } from "@/components/screens/search";
import { DownloadsProvider } from "@/lib/use-downloads";
import { LibraryProvider } from "@/lib/use-library";
import { NoticeProvider } from "@/lib/use-notice";
import type { Tab } from "./nav";
import { Notice } from "./notice";
import { TabBar } from "./tab-bar";
import { ChromeProvider } from "./use-chrome";
import { NavProvider, useNav } from "./use-nav";

const ROOTS: Record<Tab, ComponentType> = {
  home: HomeScreen,
  saved: SavedScreen,
  downloads: DownloadsScreen,
  search: SearchScreen,
};

// Keeps every tab mounted so its scroll position survives switching.
function Tabs() {
  const { tab: selected } = useNav();
  return (
    <>
      {(Object.keys(ROOTS) as Tab[]).map((tab) => {
        const Root = ROOTS[tab];
        return (
          <section key={tab} className="absolute inset-0" hidden={selected !== tab}>
            <Root />
          </section>
        );
      })}
    </>
  );
}

// The whole app: providers, tab content, the floating bottom bar and the player sheet.
export function AppShell() {
  return (
    <NoticeProvider>
      <LibraryProvider>
        <DownloadsProvider>
          <PlayerProvider>
            <NavProvider>
              <ChromeProvider>
                <div className="fixed inset-x-0 top-0 h-lvh overflow-hidden">
                  <Tabs />
                  <div
                    aria-hidden="true"
                    className="scroll-edge-bottom pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[calc(var(--safe-bottom)+110px)]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 pb-[max(var(--safe-bottom),12px)]">
                    <div className="pointer-events-auto flex flex-col gap-2">
                      <Notice />
                      <TabBar />
                    </div>
                  </div>
                </div>
                <FullPlayer />
              </ChromeProvider>
            </NavProvider>
          </PlayerProvider>
        </DownloadsProvider>
      </LibraryProvider>
    </NoticeProvider>
  );
}
