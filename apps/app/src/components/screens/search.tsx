"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { MixRow } from "@/components/mix/mix-row";
import { SearchShortcuts } from "@/components/mix/search-shortcuts";
import { Screen } from "@/components/shell/screen";
import { useNav } from "@/components/shell/use-nav";
import { searchMixes } from "@/lib/search";
import { filterByShortcut, type ShortcutFilter } from "@/lib/shortcuts";
import { useLibrary } from "@/lib/use-library";

// Search across numbers, titles and descriptions, with year and artist shortcuts as filters.
export function SearchScreen() {
  const { mixes } = useLibrary();
  const { tab } = useNav();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ShortcutFilter | null>(null);
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = deferred.trim().length > 0;
  const filtered = useMemo(
    () => (filter ? filterByShortcut(mixes, filter) : mixes),
    [mixes, filter],
  );
  const results = hasQuery ? searchMixes(filtered, deferred) : filter ? filtered : [];
  const active = tab === "search";

  useEffect(() => {
    if (active && !query && !filter) inputRef.current?.focus();
  }, [active, query, filter]);

  const chooseFilter = (value: ShortcutFilter) => {
    setFilter(value);
    inputRef.current?.blur();
  };

  return (
    <Screen title="Search">
      <div className="px-4 pt-1 pb-3">
        <label className="glass flex h-11 items-center gap-2 rounded-full px-4 text-muted shadow-glass">
          <Search size={18} />
          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Mixes, artists, numbers"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[16px] text-fg outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" aria-label="Clear" onClick={() => setQuery("")}>
              <X size={16} className="rounded-full bg-muted p-0.5 text-bg" />
            </button>
          )}
        </label>
      </div>
      {filter && (
        <div className="flex items-center gap-2 px-4 pb-2">
          <button
            type="button"
            aria-label={`Remove filter ${filter.kind === "year" ? filter.year : filter.name}`}
            onClick={() => setFilter(null)}
            className="flex min-w-0 items-center gap-1.5 rounded-full bg-fill py-1.5 pr-2 pl-3 text-[13px] active:scale-95"
          >
            <span className="truncate">{filter.kind === "year" ? filter.year : filter.name}</span>
            <X size={14} className="shrink-0 text-muted" />
          </button>
          <span className="shrink-0 text-[12px] text-muted">
            {results.length} {results.length === 1 ? "mix" : "mixes"}
          </span>
        </div>
      )}
      {!filter && !hasQuery && <SearchShortcuts mixes={mixes} onSelect={chooseFilter} />}
      {hasQuery && results.length === 0 && (
        <p className="px-4 pt-10 text-center text-muted">No results for “{deferred.trim()}”</p>
      )}
      {results.map((mix) => (
        <MixRow key={mix.number} mix={mix} />
      ))}
    </Screen>
  );
}
