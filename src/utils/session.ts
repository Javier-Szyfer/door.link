import { cookies } from "next/headers";
import {
  createSessionToken,
  getSessionSigningKey,
  SESSION_MAX_AGE_SECONDS,
  verifySessionToken,
} from "./auth";

const SESSION_COOKIE = "door_admin_session";

const getSigningKey = () =>
  getSessionSigningKey(process.env.SESSION_SECRET, process.env.ADMIN_PASSWORD_HASH);

export const isAdminSession = async () => {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value, getSigningKey());
};

export const startAdminSession = async () => {
  const key = getSigningKey();
  if (!key) throw new Error("Missing SESSION_SECRET or ADMIN_PASSWORD_HASH");

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(key), {
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
