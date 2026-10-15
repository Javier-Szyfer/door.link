import { createPublicClient } from "@/utils/supabase/public";

export const getPublishedMixtapes = async () => {
  const supabase = createPublicClient();
  const { data: mixtapes, error } = await supabase
    .from("mixtapes")
    .select("*")
    .eq("status", "published")
    .order("number", { ascending: false });

  return { mixtapes, error };
};

export const getMixtapeByMixNumber = async (mixNumber: string) => {
  const supabase = createPublicClient();
  const { data: mixtape, error } = await supabase
    .from("mixtapes")
    .select("*")
    .eq("number", mixNumber)
    .eq("status", "published")
    .maybeSingle();

  return { mixtape, error };
};
