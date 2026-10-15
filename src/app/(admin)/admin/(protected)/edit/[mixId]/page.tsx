import { notFound } from "next/navigation";
import { getMixtapeById } from "@/actions/mixtapes";
import { UploadForm } from "@/components/dashboard/upload-form";

export default async function EditPage({ params }: { params: Promise<{ mixId: string }> }) {
  const { mixId } = await params;
  const id = Number(mixId);
  if (!Number.isInteger(id)) notFound();

  const { mixtape, error } = await getMixtapeById(id);

  if (error)
    return (
      <p>
        Error fetching mixtape {mixId}: {error.message}
      </p>
    );
  if (!mixtape) notFound();

  return <UploadForm mixtape={mixtape} />;
}
