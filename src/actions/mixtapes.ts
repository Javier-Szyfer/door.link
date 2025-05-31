"use server";

// UTILS
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/auth";

export const getPublishedMixtapes = async () => {
  const supabase = await createClient();
  const { data: mixtapes, error } = await supabase
    .from("mixtapes")
    .select("*")
    .filter("status", "eq", "published")
    .order("number", { ascending: false });

  return { mixtapes, error };
};

export const getAllMixtapes = async () => {
  const supabase = await createClient();
  const { data: mixtapes, error } = await supabase
    .from("mixtapes")
    .select("*")
    .order("number", { ascending: false });

  return { mixtapes, error };
};

export const getMixtapeByMixNumber = async (mixNumber: string) => {
  const supabase = await createClient();

  const { data: mixtape, error } = await supabase
    .from("mixtapes")
    .select("*")
    .eq("number", mixNumber)
    .single();

  return { mixtape, error };
};

export const getMixtapeById = async (id: number) => {
  const supabase = await createClient();

  const { data: mixtape, error } = await supabase
    .from("mixtapes")
    .select("*")
    .eq("id", id)
    .single();

  return { mixtape, error };
};

export const deleteMixtape = async (id: number) => {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    // Convert to number if it's a string
    const numericId = Number(id);

    if (!isAdmin(user.data.user?.id ?? "")) {
      return { error: "Not authorized to delete mixtapes" };
    }

    // First try to find the mixtape
    const { data: mixtape, error: findError } = await supabase
      .from("mixtapes")
      .select("id")
      .eq("id", numericId)
      .single();

    if (findError || !mixtape) {
      return { error: "Mixtape not found or cannot be accessed" };
    }

    // Then delete it without trying to return data
    const { error } = await supabase.from("mixtapes").delete().eq("id", numericId);

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message || "Failed to delete mixtape" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting mixtape:", error);
    return { error: "Failed to delete mixtape" };
  }
};

type MixtapeData = {
  number: string;
  title: string;
  created_at: string;
  description: string;
  duration: string;
  status: "draft" | "published";
  audio_uri: string;
  artwork_uri: string;
};

export const createMixtape = async (mixtapeData: MixtapeData) => {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!isAdmin(user.data.user?.id ?? "")) {
      return { error: "Not authorized to create mixtapes" };
    }

    const { data: mixtape, error } = await supabase
      .from("mixtapes")
      .insert(mixtapeData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { error: "Failed to create mixtape" };
    }

    return { mixtape, success: true };
  } catch (error) {
    console.error("Error creating mixtape:", error);
    return { error: "Failed to create mixtape" };
  }
};

export const updateMixtape = async (id: number, mixtapeData: MixtapeData) => {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!isAdmin(user.data.user?.id ?? "")) {
      return { error: "Not authorized to update mixtapes" };
    }

    // console.log("updating mixtape", id);
    const { data: mixtape, error } = await supabase
      .from("mixtapes")
      .update(mixtapeData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return { error: "Failed to update mixtape" };
    }
    console.log("updated mixtape", mixtape);
    return { mixtape, success: true };
  } catch (error) {
    console.error("Error updating mixtape:", error);
    return { error: "Failed to update mixtape" };
  }
};
