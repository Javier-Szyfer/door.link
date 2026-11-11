import type { Mix } from "./mix.ts";
import type { Progress } from "./storage.ts";

const FINISHED_REMAINING_S = 60;
const STARTED_S = 30;
const CONTINUE_LIMIT = 10;

// Whether a position is close enough to the end to count the mix as listened.
export const isFinished = (position: number, duration: number | null) =>
  duration != null && duration - position <= FINISHED_REMAINING_S;

// Whole minutes left in a mix, or null when its duration is unknown.
export const minutesLeft = ({ position, duration }: Progress) =>
  duration == null ? null : Math.max(0, Math.ceil((duration - position) / 60));

// Whether a mix was left partway through.
const isResumable = (entry: Progress) => !entry.finished && entry.position >= STARTED_S;

// Mixes started and not finished, most recently played first.
export function continueListening(mixes: Mix[], progress: Record<string, Progress>): Mix[] {
  return mixes
    .filter((mix) => {
      const entry = progress[mix.number];
      return entry && isResumable(entry);
    })
    .sort((a, b) => progress[b.number].updatedAt - progress[a.number].updatedAt)
    .slice(0, CONTINUE_LIMIT);
}
