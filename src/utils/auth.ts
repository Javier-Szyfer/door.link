export const isAdmin = (uuid: string | undefined) => {
  if (!uuid) return false;

  const adminUuids = (process.env.ADMIN_UUIDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return adminUuids.includes(uuid);
};
