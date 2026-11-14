const TOP_PX = 24;
const COMPACT_AFTER_PX = 80;
const MIN_DELTA_PX = 6;

// Whether the bottom bar should be compact after a scroll from `previous` to `scrollTop`.
export function nextMinimized(minimized: boolean, previous: number, scrollTop: number): boolean {
  if (scrollTop <= TOP_PX) return false;
  if (scrollTop - previous >= MIN_DELTA_PX && scrollTop > COMPACT_AFTER_PX) return true;
  return minimized;
}
