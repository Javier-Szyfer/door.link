import type { Mix } from "./mix.ts";
import type { Progress } from "./storage.ts";

export type SortOrder = "newest" | "oldest" | "unplayed";

export const SORT_ORDERS: SortOrder[] = ["newest", "oldest", "unplayed"];

export const SORT_LABELS: Record<SortOrder, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  unplayed: "Not played yet",
};

// Reads a stored sort order, falling back to newest.
export function parseSortOrder(value: string | null): SortOrder {
  return value === "oldest" || value === "unplayed" ? value : "newest";
}

const byNumber = (a: Mix, b: Mix) => b.number.localeCompare(a.number, undefined, { numeric: true });

// Returns a sorted copy of the mixes.
export function sortMixes(mixes: Mix[], order: SortOrder, progress: Record<string, Progress>) {
  const sorted = [...mixes].sort(byNumber);
  if (order === "oldest") return sorted.reverse();
  if (order === "unplayed") {
    return [
      ...sorted.filter((mix) => !progress[mix.number]),
      ...sorted.filter((mix) => progress[mix.number]),
    ];
  }
  return sorted;
}
