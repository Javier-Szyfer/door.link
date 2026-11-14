import { redirect } from "next/navigation";

// Redirects to `path` with `message` in a `type` query parameter.
export function encodedRedirect(type: "error" | "success", path: string, message: string) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
