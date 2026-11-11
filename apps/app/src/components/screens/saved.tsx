"use client";

import { Star } from "lucide-react";
import { MixActions } from "@/components/mix/mix-actions";
import { MixRow } from "@/components/mix/mix-row";
import { SortMenu } from "@/components/mix/sort-menu";
import { EmptyState } from "@/components/shell/empty-state";
import { Screen } from "@/components/shell/screen";
import { parseSortOrder, sortMixes } from "@/lib/sort";
import { useLibrary } from "@/lib/use-library";
import { useStoredChoice } from "@/lib/use-stored-choice";

// Saved mixes in the chosen order, each with the star and "…" menu.
export function SavedScreen() {
  const { mixes, saved, progress } = useLibrary();
  const [order, setOrder] = useStoredChoice("door:saved-sort", parseSortOrder);
  const list = sortMixes(
    mixes.filter((mix) => saved.has(mix.number)),
    order,
    progress,
  );

  return (
    <Screen
      title="Saved"
      actions={list.length > 1 && <SortMenu order={order} onChoose={setOrder} />}
    >
      {list.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No saved mixes"
          hint="Tap the star on a mix to keep it here."
        />
      ) : (
        list.map((mix, index) => (
          <MixRow
            key={mix.number}
            mix={mix}
            divider={index < list.length - 1}
            trailing={<MixActions mix={mix} />}
          />
        ))
      )}
    </Screen>
  );
}
