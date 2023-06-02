export const getMixtapeById = async (mixN: string) => {
  const API_URL = process.env.API_URL;

  try {
    const response = await fetch(`${API_URL}/playlists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    //filter the response
    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching mixtape ${mixN}: ${error}`);
    throw error;
  }
};
