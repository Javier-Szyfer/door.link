"use server";

// UTILS
import { encodedRedirect } from "@/utils/redirect";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/auth";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	const user = await supabase.auth.getUser();

	if (error) return encodedRedirect("error", "/admin", error.message);

	if (isAdmin(user.data.user?.id ?? "")) return redirect("/admin/dashboard");

	return encodedRedirect(
		"error",
		"/admin",
		"You are not authorized to access this page",
	);
};
