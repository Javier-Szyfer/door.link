// Formats a byte count as MB below a gigabyte and GB with one decimal above.
export function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1).replace(/\.0$/, "")} GB`;
  return `${Math.round(bytes / 1e6)} MB`;
}
