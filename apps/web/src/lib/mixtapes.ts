import type { Mixtape } from "../types/mixtape.ts";
import { isPublished, sortMixtapes } from "./mixtape-data.ts";
import { getDataBucket, r2Fetch } from "./r2.ts";

const DATA_KEY = "mixtapes.json";
const MAX_WRITE_ATTEMPTS = 3;

class WriteConflictError extends Error {}

const readSnapshot = async (): Promise<{ mixtapes: Mixtape[]; etag: string | null }> => {
  const response = await r2Fetch(getDataBucket(), DATA_KEY);
  if (response.status === 404) return { mixtapes: [], etag: null };
  if (!response.ok) throw new Error(`Failed to read mixtapes: ${response.status}`);

  const etag = response.headers.get("etag")?.replace(/^W\//, "") ?? null;
  return { mixtapes: await response.json(), etag };
};

const putJson = (key: string, body: string, headers: Record<string, string> = {}) =>
  r2Fetch(getDataBucket(), key, {
    method: "PUT",
    body,
    headers: { "content-type": "application/json", ...headers },
  });

// Writes the list only if nobody changed it since `etag` was read, and keeps a dated copy.
const writeSnapshot = async (mixtapes: Mixtape[], etag: string | null) => {
  const body = `${JSON.stringify(sortMixtapes(mixtapes), null, 2)}\n`;
  const condition: Record<string, string> = etag ? { "if-match": etag } : { "if-none-match": "*" };

  const response = await putJson(DATA_KEY, body, condition);
  if (response.status === 412) throw new WriteConflictError();
  if (!response.ok) throw new Error(`Failed to save mixtapes: ${response.status}`);

  const history = await putJson(`history/${new Date().toISOString()}.json`, body);
  if (!history.ok) console.error(`Failed to save mixtapes history: ${history.status}`);
};

// Applies `change` to the latest list and saves it, retrying when another save got there first.
export const updateMixtapes = async <T>(change: (mixtapes: Mixtape[]) => [Mixtape[], T]) => {
  for (let attempt = 1; ; attempt++) {
    const { mixtapes, etag } = await readSnapshot();
    const [next, result] = change(mixtapes);

    try {
      await writeSnapshot(next, etag);
      return result;
    } catch (error) {
      if (!(error instanceof WriteConflictError) || attempt >= MAX_WRITE_ATTEMPTS) throw error;
    }
  }
};

export const getAllMixtapesFromStore = async () => sortMixtapes((await readSnapshot()).mixtapes);

export const getPublishedMixtapes = async () => {
  try {
    const mixtapes = (await getAllMixtapesFromStore()).filter(isPublished);
    return { mixtapes, error: null };
  } catch (error) {
    console.error(error);
    return { mixtapes: null, error: error as Error };
  }
};

export const getMixtapeByMixNumber = async (mixNumber: string) => {
  const { mixtapes, error } = await getPublishedMixtapes();
  const mixtape = mixtapes?.find(({ number }) => number === mixNumber) ?? null;
  return { mixtape, error };
};
