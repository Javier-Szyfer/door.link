export const getMixtapes = async () => {
  try {
    const API_URL = process.env.API_URL;
    let start = 0;
    const limit = 100;
    let mixtapes: any[] = [];

    while (true) {
      const response = await fetch(
        `${API_URL}/playlists?_sort=created_at:desc&_start=${start}&_limit=${limit}`,
        { next: { revalidate: 10 } }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (data.length > 0) {
        mixtapes = [...mixtapes, ...data];
        start += limit;
      } else {
        break;
      }
    }

    return mixtapes;
  } catch (error) {
    console.error(`Error fetching mixtapes: ${error}`);
    throw error;
  }
};
