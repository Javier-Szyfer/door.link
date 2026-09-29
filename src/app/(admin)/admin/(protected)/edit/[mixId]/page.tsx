import { getMixtapeById } from "@/actions/mixtapes";
import { UploadForm } from "@/components/dashboard/upload-form";

type ParamsType = Promise<{ mixId: number }>;

export default async function EditPage({ params }: { params: ParamsType }) {
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
