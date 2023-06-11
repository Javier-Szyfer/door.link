// sanity.js
import { createClient } from "@sanity/client";
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

export const client = createClient({
  projectId: "vt674w1r",
  dataset: "production",
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: "2021-06-07", // use current date (YYYY-MM-DD) to target the latest API version
});
