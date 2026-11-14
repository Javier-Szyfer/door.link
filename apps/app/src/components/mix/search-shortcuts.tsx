"use client";

import { useMemo } from "react";
import { SectionTitle } from "@/components/shell/section-title";
import type { Mix } from "@/lib/mix";
import { artistShortcuts, type ShortcutFilter, yearShortcuts } from "@/lib/shortcuts";
import { Artwork } from "./artwork";

// Year cards and artist chips that filter the catalog on tap.
export function SearchShortcuts({
  mixes,
  onSelect,
}: {
  mixes: Mix[];
  onSelect: (filter: ShortcutFilter) => void;
}) {
  const years = useMemo(() => yearShortcuts(mixes), [mixes]);
  const artists = useMemo(() => artistShortcuts(mixes), [mixes]);

  return (
    <>
      {years.length > 0 && (
        <section className="pb-6">
          <SectionTitle>Years</SectionTitle>
          <div className="no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-4 [scroll-padding-inline:16px]">
            {years.map(({ year, count, cover }) => (
              <button
                key={year}
                type="button"
                aria-label={`${year}, ${count} ${count === 1 ? "mix" : "mixes"}`}
                onClick={() => onSelect({ kind: "year", year })}
                className="relative size-[108px] shrink-0 snap-start overflow-hidden text-left text-white transition-transform duration-150 active:scale-[0.97]"
              >
                <Artwork mix={cover} className="absolute inset-0 size-full text-[0px]" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="absolute inset-x-2.5 bottom-2 block">
                  <span className="block text-[17px] leading-tight font-bold">{year}</span>
                  <span className="block text-[12px] leading-tight">{count}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      {artists.length > 0 && (
        <section>
          <SectionTitle>Artists</SectionTitle>
          <div className="flex flex-wrap gap-2 px-4">
            {artists.map(({ key, name }) => (
              <button
                key={key}
                type="button"
                onClick={() => onSelect({ kind: "artist", key, name })}
                className="rounded-full bg-fill px-3 py-1.5 text-[13px] transition-transform duration-150 active:scale-95"
              >
                {name}
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
