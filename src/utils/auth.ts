export const isAdmin = (uuid: string) => {
	const adminUuids = process.env.ADMIN_UUIDS?.split(",") || [];
	return adminUuids.includes(uuid);
};
