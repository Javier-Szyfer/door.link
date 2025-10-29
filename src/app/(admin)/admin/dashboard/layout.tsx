import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/sign-out";
import { SubmitButton } from "@/components/dashboard/submit-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-end px-4 py-2">
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
