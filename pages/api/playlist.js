export const getPlaylist = async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const playlist = await fetch(`${API_URL}/playlists?_sort=created_at:desc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await playlist.json();
  return data;
};

const Playlist = async (req, res) => res.status(200).json(await getPlaylist());

export default Playlist;
