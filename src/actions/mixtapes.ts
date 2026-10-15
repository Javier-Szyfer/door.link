"use server";

import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database.types";
import { isAdmin } from "@/utils/auth";
import { createClient } from "@/utils/supabase/server";

export type MixtapeInput = Omit<Database["public"]["Tables"]["mixtapes"]["Insert"], "id">;

// Returns null for anyone but an admin, so a missing check fails closed.
const getAdminClient = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return isAdmin(data.user?.id) ? supabase : null;
};

// The public pages are cached; publish changes without waiting for them to expire.
const revalidatePublicPages = () => revalidatePath("/", "layout");

// The input comes from the client, so an `id` in it is dropped rather than
// trusted: the row to write is chosen by the `id` argument alone.
const withoutId = ({ id: _id, ...fields }: MixtapeInput & { id?: unknown }) => fields;

export const getAllMixtapes = async () => {
  const supabase = await getAdminClient();
  if (!supabase) return { mixtapes: null, error: new Error("Not authorized to list mixtapes") };

  const { data: mixtapes, error } = await supabase
    .from("mixtapes")
    .select("*")
    .order("number", { ascending: false });

  return { mixtapes, error };
};

export const getMixtapeById = async (id: number) => {
  const supabase = await getAdminClient();
  if (!supabase) return { mixtape: null, error: new Error("Not authorized to read this mixtape") };

  const { data: mixtape, error } = await supabase
    .from("mixtapes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return { mixtape, error };
};

export const deleteMixtape = async (id: number) => {
  const supabase = await getAdminClient();
  if (!supabase) return { error: "Not authorized to delete mixtapes" };

  const { data, error } = await supabase.from("mixtapes").delete().eq("id", id).select("id");

  if (error) {
    console.error("Error deleting mixtape:", error);
    return { error: "Failed to delete mixtape" };
  }
  // RLS filters rows out silently, so a refused delete also matches zero rows.
  if (data.length === 0) return { error: "Mixtape not found or cannot be deleted" };

  revalidatePublicPages();
  return { success: true };
};

export const createMixtape = async (input: MixtapeInput) => {
  const supabase = await getAdminClient();
  if (!supabase) return { error: "Not authorized to create mixtapes" };

  const { data: mixtape, error } = await supabase
    .from("mixtapes")
    .insert(withoutId(input))
    .select()
    .single();

  if (error) {
    console.error("Error creating mixtape:", error);
    return { error: "Failed to create mixtape" };
  }

  revalidatePublicPages();
  return { mixtape, success: true };
};

export const updateMixtape = async (id: number, input: MixtapeInput) => {
  const supabase = await getAdminClient();
  if (!supabase) return { error: "Not authorized to update mixtapes" };

  const { data, error } = await supabase
    .from("mixtapes")
    .update(withoutId(input))
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating mixtape:", error);
    return { error: "Failed to update mixtape" };
  }
  // RLS filters rows out silently, so a refused update also matches zero rows.
  if (data.length === 0) {
    return {
      error: `No mixtape was updated (id ${id}). It may not exist or you may not have permission.`,
    };
  }

  revalidatePublicPages();
  return { mixtape: data[0], success: true };
};
