import { NextApiRequest, NextApiResponse } from "next";

export const getPlaylist = async (): Promise<any[]> => {
  try {
    const API_URL = process.env.API_URL;
    let start = 0;
    const limit = 100;
    let playlists: any[] = [];

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

      // Check if the response status is not OK
      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (data.length > 0) {
        playlists = [...playlists, ...data];
        start += limit;
      } else {
        break;
      }
    }

    return playlists;
  } catch (error) {
    console.error(`Error fetching playlists: ${error}`);
    throw error;
  }
};
const AllPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await getPlaylist();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the playlist" });
  }
};

export default AllPlaylist;
