// COMPONENTS
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { FormMessage, type Message } from "@/components/dashboard/form-message";

// ACTIONS
import { signIn } from "@/actions/sign-in";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <form className="flex flex-col">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input type="password" name="password" placeholder="Your password" required />
        <SubmitButton pendingText="Signing In..." formAction={signIn}>
          Login
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
