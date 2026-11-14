"use client";

import { ArrowDown, Search, Star } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { Keyhole } from "@/components/icons/keyhole";
import { usePlayer } from "@/components/player/audio-engine";
import { MiniPlayer } from "@/components/player/mini-player";
import type { Tab } from "./nav";
import { useChrome } from "./use-chrome";
import { useNav } from "./use-nav";

const SPRING = { type: "spring", stiffness: 500, damping: 40 } as const;

const TABS: { tab: Exclude<Tab, "search">; label: string; icon: ReactNode }[] = [
  { tab: "home", label: "Home", icon: <Keyhole size={22} /> },
  { tab: "saved", label: "Saved", icon: <Star size={24} fill="currentColor" strokeWidth={1.5} /> },
  {
    tab: "downloads",
    label: "Downloads",
    icon: <ArrowDown size={26} strokeWidth={3} />,
  },
];

const circle =
  "glass flex size-[56px] shrink-0 items-center justify-center rounded-full shadow-glass active:scale-95";

// The search button, shared by both bar layouts so it can glide between them.
function SearchButton({ onSelect }: { onSelect: () => void }) {
  const { tab } = useNav();
  return (
    <motion.button
      layoutId="search"
      transition={SPRING}
      type="button"
      aria-label="Search"
      aria-current={tab === "search" ? "page" : undefined}
      onClick={onSelect}
      className={`${circle} ${tab === "search" ? "bg-glass-strong" : ""}`}
    >
      <Search size={24} strokeWidth={2.2} />
    </motion.button>
  );
}

// The floating bottom bar: tabs with the player above, or, once a mix is loaded, compacted into one
// row while scrolling.
export function TabBar() {
  const { tab: selected, selectTab } = useNav();
  const { minimized, setMinimized } = useChrome();
  const { current } = usePlayer();
  const playerShown = useRef(false);
  const fadeIn = !playerShown.current;

  useEffect(() => {
    if (current) playerShown.current = true;
  }, [current]);

  const openSearch = () => {
    setMinimized(false);
    selectTab("search");
  };

  return (
    <LayoutGroup>
      {minimized && current ? (
        <nav className="flex items-center gap-2 px-4" aria-label="Tabs">
          <motion.button
            layoutId="keyhole"
            transition={SPRING}
            type="button"
            aria-label="Show tabs"
            onClick={() => setMinimized(false)}
            className={circle}
          >
            <Keyhole size={22} />
          </motion.button>
          <div className="flex min-w-0 flex-1">
            <MiniPlayer compact fadeIn={fadeIn} />
          </div>
          <SearchButton onSelect={openSearch} />
        </nav>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex px-4">
            <MiniPlayer fadeIn={fadeIn} />
          </div>
          <nav className="flex items-center gap-3 px-4" aria-label="Tabs">
            <motion.div
              layoutId="keyhole"
              transition={SPRING}
              className="glass flex h-[56px] flex-1 items-center rounded-full p-1 shadow-glass"
            >
              {TABS.map(({ tab, label, icon }) => {
                const active = selected === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    onClick={() => selectTab(tab)}
                    className={`flex h-full flex-1 items-center justify-center rounded-full transition-colors duration-200 active:scale-95 ${
                      active ? "bg-glass-strong" : ""
                    }`}
                  >
                    {icon}
                  </button>
                );
              })}
            </motion.div>
            <SearchButton onSelect={openSearch} />
          </nav>
        </div>
      )}
    </LayoutGroup>
  );
}
