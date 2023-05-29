import { NextApiRequest, NextApiResponse } from "next";

export const getPlaylist = async (): Promise<any[]> => {
  try {
    const API_URL = process.env.API_URL;
    const response = await fetch(`${API_URL}/playlists?_sort=created_at:desc`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response status is not OK
    if (!response.ok) {
      throw new Error("Server error");
    }

    const data: any[] = await response.json();
    return data;
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
