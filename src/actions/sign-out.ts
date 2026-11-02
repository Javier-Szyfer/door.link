"use server";

import { redirect } from "next/navigation";
import { endAdminSession } from "@/utils/session";

export const signOut = async () => {
  await endAdminSession();
  redirect("/admin");
};
