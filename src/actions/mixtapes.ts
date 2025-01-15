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
		.order("created_at", { ascending: false });

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

		if (!isAdmin(user.data.user?.id ?? "")) {
			return { error: "Not authorized to delete mixtapes" };
		}

		const { error } = await supabase.from("mixtapes").delete().eq("id", id);

		if (error) {
			console.error("Supabase error:", error);
			return { error: "Failed to delete mixtape" };
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

		const { data: mixtape, error } = await supabase
			.from("mixtapes")
			.update(mixtapeData)
			.eq("id", id);

		if (error) {
			console.error("Supabase error:", error);
			return { error: "Failed to update mixtape" };
		}

		return { mixtape, success: true };
	} catch (error) {
		console.error("Error updating mixtape:", error);
		return { error: "Failed to update mixtape" };
	}
};
