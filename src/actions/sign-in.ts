"use server";

import { redirect } from "next/navigation";
import { verifyPassword } from "@/utils/auth";
import { encodedRedirect } from "@/utils/redirect";
import { startAdminSession } from "@/utils/session";

export const signIn = async (formData: FormData) => {
  const password = formData.get("password");
  const isValid =
    typeof password === "string" &&
    (await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH));

  if (!isValid) return encodedRedirect("error", "/admin", "Invalid password");

  await startAdminSession();
  redirect("/admin/dashboard");
};
