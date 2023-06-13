import { createClient } from "@sanity/client";

export const publicClient = createClient({
  projectId: "vt674w1r",
  dataset: "production",
  useCdn: true,
  apiVersion: "2021-06-07",
});

export const privateClient = createClient({
  projectId: "vt674w1r",
  dataset: "subscribers",
  useCdn: false,
  apiVersion: "2021-06-07",
  token: process.env.SANITY_TOKEN,
});
