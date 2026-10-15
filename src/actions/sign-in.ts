"use server";

import { redirect } from "next/navigation";
import { isAdmin } from "@/utils/auth";
import { encodedRedirect } from "@/utils/redirect";
import { createClient } from "@/utils/supabase/server";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return encodedRedirect("error", "/admin", "Invalid email or password");

  if (!isAdmin(data.user?.id)) {
    // signInWithPassword has already set the session cookie. Without this, a
    // refused user stays signed in and can reach /admin by navigating to it.
    await supabase.auth.signOut();
    return encodedRedirect("error", "/admin", "You are not authorized to access this page");
  }

  redirect("/admin/dashboard");
};
