export const MIXTAPE_STATUSES = ["published", "draft"] as const;

export type MixtapeStatus = (typeof MIXTAPE_STATUSES)[number];

export type Mixtape = {
  id: number;
  number: string;
  title: string;
  description: string;
  duration: string;
  created_at: string;
  audio_uri: string;
  artwork_uri: string;
  status: MixtapeStatus;
};

export type MixtapeInput = Omit<Mixtape, "id">;
