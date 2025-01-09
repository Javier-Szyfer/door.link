// SUPABASE
import { createBrowserClient } from "@supabase/ssr";

// TYPES
import type { Database } from "@/types/database.types";

export const createClient = () =>
	createBrowserClient<Database>(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
