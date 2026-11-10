// Converts a CMS duration ("45:12", "1:02:03", "45 min", "45") to seconds, or null.
export function parseDurationSeconds(value: string): number | null {
  const text = value.trim().toLowerCase();
  const minutes = text.match(/^(\d+(?:\.\d+)?)\s*(?:m|min|mins|minutes)?$/);
  if (minutes) return Math.round(Number(minutes[1]) * 60);

  if (!/^\d+(?::\d{1,2}){1,2}$/.test(text)) return null;
  return text.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}
