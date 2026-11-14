"use server";

import { revalidatePath } from "next/cache";
import {
  buildDownloadDisposition,
  buildMediaKey,
  findUnusedMediaUrls,
  IMMUTABLE_CACHE_CONTROL,
  isAllowedContentType,
  type MediaKind,
  mediaKeyFromUrl,
} from "@/lib/media-upload";
import { nextMixtapeId, parseMixtapeInput } from "@/lib/mixtape-data";
import { getAllMixtapesFromStore, updateMixtapes } from "@/lib/mixtapes";
import { getMediaBucket, getPublicMediaUrl, presignPut, r2Fetch } from "@/lib/r2";
import type { Mixtape } from "@/types/mixtape";
import { isAdminSession } from "@/utils/session";

const revalidatePublicPages = () => revalidatePath("/", "layout");

// Deletes the R2 files in `urls` that no mixtape in `mixtapes` still uses.
const deleteUnusedMedia = async (urls: string[], mixtapes: Mixtape[]) => {
  const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? "";
  for (const url of findUnusedMediaUrls(urls, mixtapes)) {
    const key = mediaKeyFromUrl(url, mediaBaseUrl);
    if (!key) continue;
    try {
      const response = await r2Fetch(getMediaBucket(), key, { method: "DELETE" });
      if (!response.ok && response.status !== 404) {
        console.error(`Failed to delete ${key}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to delete ${key}:`, error);
    }
  }
};

export const getAllMixtapes = async () => {
  if (!(await isAdminSession())) {
    return { mixtapes: null, error: new Error("Not authorized to list mixtapes") };
  }

  try {
    return { mixtapes: await getAllMixtapesFromStore(), error: null };
  } catch (error) {
    console.error("Error listing mixtapes:", error);
    return { mixtapes: null, error: new Error("Failed to list mixtapes") };
  }
};

export const getMixtapeById = async (id: number) => {
  if (!(await isAdminSession())) {
    return { mixtape: null, error: new Error("Not authorized to read this mixtape") };
  }

  try {
    const mixtape = (await getAllMixtapesFromStore()).find((m) => m.id === id) ?? null;
    return { mixtape, error: null };
  } catch (error) {
    console.error("Error reading mixtape:", error);
    return { mixtape: null, error: new Error("Failed to read mixtape") };
  }
};

export const deleteMixtape = async (id: number) => {
  if (!(await isAdminSession())) return { error: "Not authorized to delete mixtapes" };

  let result: { deleted: Mixtape; remaining: Mixtape[] } | null;
  try {
    result = await updateMixtapes((mixtapes) => {
      const deleted = mixtapes.find((mixtape) => mixtape.id === id);
      if (!deleted) return [mixtapes, null];
      const remaining = mixtapes.filter((mixtape) => mixtape.id !== id);
      return [remaining, { deleted, remaining }];
    });
  } catch (error) {
    console.error("Error deleting mixtape:", error);
    return { error: "Failed to delete mixtape" };
  }
  if (!result) return { error: "Mixtape not found" };

  revalidatePublicPages();
  const { deleted, remaining } = result;
  await deleteUnusedMedia([deleted.audio_uri, deleted.artwork_uri], remaining);
  return { success: true };
};

export const createMixtape = async (data: unknown) => {
  if (!(await isAdminSession())) return { error: "Not authorized to create mixtapes" };

  const parsed = parseMixtapeInput(data);
  if (parsed.error !== undefined) return { error: parsed.error };
  const { input } = parsed;

  let mixtape: Mixtape;
  try {
    mixtape = await updateMixtapes((mixtapes) => {
      const created = { id: nextMixtapeId(mixtapes), ...input };
      return [[...mixtapes, created], created];
    });
  } catch (error) {
    console.error("Error creating mixtape:", error);
    return { error: "Failed to create mixtape" };
  }

  revalidatePublicPages();
  return { mixtape, success: true };
};

export const updateMixtape = async (id: number, data: unknown) => {
  if (!(await isAdminSession())) return { error: "Not authorized to update mixtapes" };

  const parsed = parseMixtapeInput(data);
  if (parsed.error !== undefined) return { error: parsed.error };
  const { input } = parsed;

  let result: { previous: Mixtape; mixtape: Mixtape; mixtapes: Mixtape[] } | null;
  try {
    result = await updateMixtapes((mixtapes) => {
      const previous = mixtapes.find((m) => m.id === id);
      if (!previous) return [mixtapes, null];
      const mixtape = { ...previous, ...input };
      const next = mixtapes.map((m) => (m.id === id ? mixtape : m));
      return [next, { previous, mixtape, mixtapes: next }];
    });
  } catch (error) {
    console.error("Error updating mixtape:", error);
    return { error: "Failed to update mixtape" };
  }
  if (!result) return { error: `No mixtape was updated (id ${id}). It may not exist.` };

  revalidatePublicPages();
  const { previous, mixtape, mixtapes } = result;
  await deleteUnusedMedia([previous.audio_uri, previous.artwork_uri], mixtapes);
  return { mixtape, success: true };
};

type UploadRequest = {
  kind: MediaKind;
  fileName: string;
  contentType: string;
  number: string;
  title: string;
};

// Returns a short-lived URL the browser can PUT one media file to, plus the headers to send.
export const getUploadUrl = async ({
  kind,
  fileName,
  contentType,
  number,
  title,
}: UploadRequest) => {
  if (!(await isAdminSession())) return { error: "Not authorized to upload files" };
  if (kind !== "audio" && kind !== "artwork") return { error: "Invalid upload type" };
  if ([fileName, contentType, number, title].some((value) => typeof value !== "string")) {
    return { error: "Invalid upload request" };
  }
  if (!isAllowedContentType(kind, contentType))
    return { error: `Invalid file type ${contentType}` };
  if (kind === "audio" && (!number.trim() || !title.trim())) {
    return { error: "Fill in the number and title before uploading the audio" };
  }

  const key = buildMediaKey(kind, fileName);
  const headers: Record<string, string> = {
    "content-type": contentType,
    "cache-control": IMMUTABLE_CACHE_CONTROL,
  };
  if (kind === "audio") {
    headers["content-disposition"] = buildDownloadDisposition(number, title, fileName);
  }

  try {
    const url = await presignPut(getMediaBucket(), key, headers);
    return { url, headers, publicUrl: getPublicMediaUrl(key) };
  } catch (error) {
    console.error("Error signing upload:", error);
    return { error: "Failed to prepare upload" };
  }
};
