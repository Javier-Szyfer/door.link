import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Cookie-free client for public reads. The cookie-bound client calls cookies(),
// which opts the route out of static rendering and therefore out of its cache.
export const createPublicClient = () =>
  createSupabaseClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: required env, validated by the deploy environment
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: required env, validated by the deploy environment
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
