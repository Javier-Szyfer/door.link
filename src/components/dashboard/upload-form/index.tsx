"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createMixtape, type MixtapeInput, updateMixtape } from "@/actions/mixtapes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { ArtworkInput } from "./artwork-input";
import { AudioInput } from "./audio-input";

type Mixtape = Database["public"]["Tables"]["mixtapes"]["Row"];

const toFormData = (mixtape?: Mixtape): MixtapeInput => ({
  number: mixtape?.number ?? "",
  created_at: mixtape?.created_at ?? "",
  title: mixtape?.title ?? "",
  description: mixtape?.description ?? "",
  duration: mixtape?.duration ?? "",
  status: mixtape?.status ?? "draft",
  audio_uri: mixtape?.audio_uri ?? "",
  artwork_uri: mixtape?.artwork_uri ?? "",
});

export const UploadForm = ({ mixtape }: { mixtape?: Mixtape }) => {
  const isEditing = mixtape !== undefined;
  const [formData, setFormData] = useState(() => toFormData(mixtape));
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingMixtape, setIsSavingMixtape] = useState(false);
  const [artworkPreview, setArtworkPreview] = useState(mixtape?.artwork_uri ?? null);
  const isSubmittingRef = useRef(false);

  const router = useRouter();

  useEffect(() => {
    if (!artworkPreview?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(artworkPreview);
  }, [artworkPreview]);

  const isFormValid = Object.entries(formData).every(
    ([field, value]) => field === "status" || value !== "",
  );

  const handleFileUpload = async (file: File, type: "audio" | "artwork") => {
    if (type === "artwork") setArtworkPreview(URL.createObjectURL(file));

    setIsUploading(true);
    const folder = type === "audio" ? "audio" : "images";
    const filePath = `${folder}/${Date.now()}-${file.name}`;
    const toastId = toast.loading(`Uploading ${file.name}...`);
    const supabase = createClient();

    try {
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { cacheControl: "3600" });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        [`${type}_uri`]: publicUrl,
      }));

      toast.success(`${type} file uploaded successfully`, {
        id: toastId,
      });
    } catch (error) {
      console.error(`Error uploading ${type} file:`, error);
      if (type === "artwork") setArtworkPreview(null);

      toast.error(
        `Failed to upload ${type} file: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          id: toastId,
        },
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSavingMixtape(true);

    const action = isEditing ? "update" : "create";
    const toastId = toast.loading(isEditing ? "Updating mixtape..." : "Creating mixtape...");

    try {
      const response = isEditing
        ? await updateMixtape(mixtape.id, formData)
        : await createMixtape(formData);

      if (response.error) throw new Error(response.error);

      toast.success(isEditing ? "Mixtape updated successfully" : "Mixtape created successfully", {
        id: toastId,
      });
      router.push("/admin/dashboard");
    } catch (error) {
      console.error(`Error trying to ${action} mixtape:`, error);
      toast.error(
        `Failed to ${action} mixtape: ${error instanceof Error ? error.message : "Unknown error"}`,
        { id: toastId },
      );
    } finally {
      setIsSavingMixtape(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-[1000px] flex-col gap-12 py-12">
      <h1 className="text-2xl font-medium">{isEditing ? "Edit Mixtape" : "Upload Mixtape"}</h1>
      <div className="flex gap-24">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="number">Number</Label>
            <Input
              id="number"
              name="number"
              required
              value={formData.number}
              onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              value={formData.created_at}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  created_at: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              required
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <AudioInput
            audioUri={formData.audio_uri}
            onFileSelect={(file) => handleFileUpload(file, "audio")}
          />

          <ArtworkInput
            artworkPreview={artworkPreview}
            onFileSelect={(file) => handleFileUpload(file, "artwork")}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              defaultValue={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as MixtapeInput["status"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={!isFormValid || isUploading || isSavingMixtape}
            className="h-12 w-min px-4"
          >
            {isSavingMixtape ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};
