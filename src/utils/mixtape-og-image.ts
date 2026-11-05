import { OG_IMAGE } from "../constants/metadata.ts";

// The link-preview image for a mixtape: its cover, or the keyhole when it has none.
export const mixtapeOgImage = (artworkUri?: string | null) =>
  artworkUri && /^https?:\/\//.test(artworkUri) ? { url: artworkUri } : OG_IMAGE;
