import { cookies } from "next/headers";
import { createSessionToken, SESSION_MAX_AGE_SECONDS, verifySessionToken } from "./auth";

const SESSION_COOKIE = "door_admin_session";

export const isAdminSession = async () => {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value, process.env.SESSION_SECRET);
};

export const startAdminSession = async () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing environment variable SESSION_SECRET");

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
};

export const endAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
};
