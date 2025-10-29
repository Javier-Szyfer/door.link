
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// COMPONENTS
import { UploadForm } from "@/components/dashboard/upload-form";


export default async function UploadMixtape() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return redirect("/admin");
  }
  return <UploadForm />;
}
