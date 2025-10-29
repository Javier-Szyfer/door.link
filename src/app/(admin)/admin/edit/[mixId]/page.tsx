// COMPONENTS
import { UploadForm } from "@/components/dashboard/upload-form";

// UTILS
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// ACTIONS
import { getMixtapeById } from "@/actions/mixtapes";

type ParamsType = Promise<{ mixId: number }>;

export default async function EditPage({ params }: { params: ParamsType }) {

  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return redirect("/admin");
  }
  const { mixId } = await params;
  const { mixtape, error } = await getMixtapeById(mixId);

  if (error)
    return (
      <p>
        Error fetching mixtape {mixId}, error: {error.message}
      </p>
    );
  if (!mixtape) return <p>Mixtape not found</p>;

  return <UploadForm mixtape={mixtape} isEditing={true} />;
}
