import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export const createClient = () =>
  createBrowserClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: required env, validated by the deploy environment
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: required env, validated by the deploy environment
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
