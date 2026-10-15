import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Cookie-free client for public reads.
export const createPublicClient = () =>
  createSupabaseClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: required env, validated by the deploy environment
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: required env, validated by the deploy environment
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
