import { redirect } from "next/navigation";
import { signIn } from "@/actions/sign-in";
import { FormMessage, type Message } from "@/components/dashboard/form-message";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAdminSession } from "@/utils/session";

export default async function Login(props: { searchParams: Promise<Message> }) {
  if (await isAdminSession()) redirect("/admin/dashboard");

  const searchParams = await props.searchParams;

  return (
    <form className="flex flex-col">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText="Signing In..." formAction={signIn}>
          Login
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
