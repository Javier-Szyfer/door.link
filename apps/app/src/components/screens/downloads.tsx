"use client";

import { CircleArrowDown } from "lucide-react";
import { DownloadButton } from "@/components/mix/download-button";
import { MixActions } from "@/components/mix/mix-actions";
import { MixRow } from "@/components/mix/mix-row";
import { SortMenu } from "@/components/mix/sort-menu";
import { EmptyState } from "@/components/shell/empty-state";
import { Screen } from "@/components/shell/screen";
import { formatBytes } from "@/lib/format-bytes";
import { parseSortOrder, sortMixes } from "@/lib/sort";
import { useDownloads } from "@/lib/use-downloads";
import { useLibrary } from "@/lib/use-library";
import { useStoredChoice } from "@/lib/use-stored-choice";

// Downloads in progress and on the device, with their count and total size.
export function DownloadsScreen() {
  const { mixes, downloads, progress } = useLibrary();
  const { active } = useDownloads();
  const inProgress = mixes.filter((mix) => active[mix.number] !== undefined);
  const [order, setOrder] = useStoredChoice("door:downloads-sort", parseSortOrder);
  const stored = sortMixes(
    mixes.filter((mix) => downloads[mix.number] && active[mix.number] === undefined),
    order,
    progress,
  );
  const storedBytes = stored.reduce((total, mix) => total + downloads[mix.number].bytes, 0);

  return (
    <Screen
      title="Downloads"
      actions={stored.length > 1 && <SortMenu order={order} onChoose={setOrder} />}
    >
      {inProgress.length === 0 && stored.length === 0 ? (
        <EmptyState
          icon={CircleArrowDown}
          title="No downloads"
          hint="Download mixes to listen without a connection."
        />
      ) : (
        <>
          {inProgress.map((mix) => (
            <MixRow
              key={mix.number}
              mix={mix}
              showDownload={false}
              trailing={<DownloadButton mix={mix} />}
            />
          ))}
          {stored.map((mix, index) => (
            <MixRow
              key={mix.number}
              mix={mix}
              divider={index < stored.length - 1}
              trailing={<MixActions mix={mix} />}
            />
          ))}
          {stored.length > 0 && (
            <p className="px-4 pt-3 text-[12px] text-muted">
              {stored.length} · {formatBytes(storedBytes)}
            </p>
          )}
        </>
      )}
    </Screen>
  );
}
