export const RESUME_WINDOW_MS = 10 * 60 * 1000;

type PauseContext = { byListener: boolean; ended: boolean; hidden: boolean };

// Whether a pause came from another app taking the audio while this one was away.
export const isInterruption = ({ byListener, ended, hidden }: PauseContext) =>
  !byListener && !ended && hidden;

// Whether coming back to the app should pick an interrupted mix back up.
export const shouldResume = (interruptedAt: number | null, now: number) =>
  interruptedAt !== null && now - interruptedAt <= RESUME_WINDOW_MS;
