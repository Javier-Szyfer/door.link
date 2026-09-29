import { signOut } from "@/actions/sign-out";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-between px-4 py-6">
        <div className="flex gap-2">
          <Link href="/">Home</Link>
          <Link href="/admin/dashboard">Dashboard</Link>
        </div>
        <form action={signOut}>
          <SubmitButton variant="outline" pendingText="Signing Out...">
            Log out
          </SubmitButton>
        </form>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
