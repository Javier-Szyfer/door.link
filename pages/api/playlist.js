export const getPlaylist = async () => {
  const { API_URL } = process.env;
  let start = 0;
  const limit = 100;
  let playlists = [];

  while (true) {
    const response = await fetch(
      `${API_URL}/playlists?_sort=created_at:desc&_start=${start}&_limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.length > 0) {
      playlists = [...playlists, ...data];
      start += limit;
    } else {
      break;
    }
  }

  return playlists;
};

const Playlist = async (req, res) => res.status(200).json(await getPlaylist());

export default Playlist;
