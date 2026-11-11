export const PULL_THRESHOLD_PX = 70;

// How far a pull-to-refresh has gone, from the scroll container's (negative) overscroll.
export function pullProgress(scrollTop: number) {
  const pulled = Math.max(-scrollTop, 0);
  return {
    fraction: Math.min(pulled / PULL_THRESHOLD_PX, 1),
    armed: pulled >= PULL_THRESHOLD_PX,
  };
}
