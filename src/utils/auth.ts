// An empty uuid — or an empty ADMIN_UUIDS, which would parse to `[""]` — must
// never match.
export const isAdmin = (uuid: string | undefined) => {
  if (!uuid) return false;

  const adminUuids = (process.env.ADMIN_UUIDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return adminUuids.includes(uuid);
};
