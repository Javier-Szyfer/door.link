"use client";

import { LayoutGrid, List, Shuffle } from "lucide-react";
import { useEffect } from "react";
import { ContinueCard } from "@/components/mix/continue-card";
import { HomeSkeleton } from "@/components/mix/home-skeleton";
import { MixActions } from "@/components/mix/mix-actions";
import { MixCard } from "@/components/mix/mix-card";
import { MixRow } from "@/components/mix/mix-row";
import { SortMenu } from "@/components/mix/sort-menu";
import { usePlayer } from "@/components/player/audio-engine";
import { CircleButton } from "@/components/shell/circle-button";
import { MenuOption } from "@/components/shell/menu-option";
import { noticeStyle } from "@/components/shell/notice";
import { Screen } from "@/components/shell/screen";
import { SectionTitle } from "@/components/shell/section-title";
import { type HomeView, homeReady, parseHomeView } from "@/lib/home-view";
import { continueListening } from "@/lib/progress";
import { isPlayable } from "@/lib/queue";
import { parseSortOrder, sortMixes } from "@/lib/sort";
import { rememberResume } from "@/lib/startup-layout";
import { useLibrary } from "@/lib/use-library";
import { useOnline } from "@/lib/use-online";
import { useStoredChoice } from "@/lib/use-stored-choice";

const VIEW_OPTIONS: { view: HomeView; label: string; icon: typeof List }[] = [
  { view: "grid", label: "Grid", icon: LayoutGrid },
  { view: "list", label: "List", icon: List },
];

// Home: continue listening, the newest mix large, then the catalog as a grid or a list.
export function HomeScreen() {
  const { mixes, progress, downloads, loading, libraryLoaded, stale, refresh } = useLibrary();
  const { play } = usePlayer();
  const online = useOnline();
  const [order, setOrder] = useStoredChoice("door:sort", parseSortOrder);
  const [view, setView] = useStoredChoice("door:view", parseHomeView);

  const shuffle = () => {
    const pool = mixes.filter((mix) => isPlayable(mix.number, online, downloads));
    if (pool.length) play(pool[Math.floor(Math.random() * pool.length)]);
  };

  const sorted = sortMixes(mixes, order, progress);
  const [featured, ...rest] = sorted;
  const resume = continueListening(mixes, progress);
  const ready = homeReady({ libraryLoaded, loading, mixCount: mixes.length });
  const hasResume = resume.length > 0;

  useEffect(() => {
    if (ready) rememberResume(hasResume);
  }, [ready, hasResume]);

  return (
    <Screen
      title="door.link"
      onRefresh={refresh}
      actions={
        <>
          <SortMenu
            order={order}
            onChoose={setOrder}
            extra={(close) => (
              <>
                <div className="h-2 bg-separator/60" />
                {VIEW_OPTIONS.map(({ view: value, label, icon: Icon }) => (
                  <MenuOption
                    key={value}
                    selected={view === value}
                    onSelect={() => {
                      setView(value);
                      close();
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} />
                      {label}
                    </span>
                  </MenuOption>
                ))}
              </>
            )}
          />
          <CircleButton aria-label="Shuffle" onClick={shuffle}>
            <Shuffle size={20} strokeWidth={2.2} />
          </CircleButton>
        </>
      }
    >
      {!ready && <HomeSkeleton />}

      {ready && (stale || !online) && !loading && (
        <p className={`${noticeStyle} mb-3 text-muted`}>
          {mixes.length
            ? "Offline — showing the last list you loaded."
            : "Offline — connect once to load the mixes."}
        </p>
      )}

      {ready && resume.length > 0 && (
        <section className="pb-5">
          <SectionTitle>Continue listening</SectionTitle>
          <div className="no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-4 [scroll-padding-inline:16px]">
            {resume.map((mix) => (
              <ContinueCard key={mix.number} mix={mix} progress={progress[mix.number]} />
            ))}
          </div>
        </section>
      )}

      {ready && featured && (
        <div className="px-4 pb-6">
          <MixCard mix={featured} large />
        </div>
      )}
      {ready &&
        (view === "list" ? (
          <div>
            {rest.map((mix) => (
              <MixRow key={mix.number} mix={mix} divider trailing={<MixActions mix={mix} />} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-4">
            {rest.map((mix) => (
              <MixCard key={mix.number} mix={mix} />
            ))}
          </div>
        ))}
    </Screen>
  );
}
