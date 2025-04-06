"use client";

// COMPONENTS
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AudioInput } from "./audio-input";
import { ArtworkInput } from "./artwork-input";
import { toast } from "sonner";

// HOOKS
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// SUPABASE
import { createClient } from "@/utils/supabase/client";

// ACTIONS
import { createMixtape, updateMixtape } from "@/actions/mixtapes";

// TYPES
import type { Database } from "@/types/database.types";

type FormData = {
	id?: number;
	number: string;
	created_at: string;
	title: string;
	description: string;
	duration: string;
	status: "draft" | "published";
	audio_uri: string;
	artwork_uri: string;
};

const defaultFormData = (
	mixtape?: Database["public"]["Tables"]["mixtapes"]["Row"],
) => {
	return {
		id: mixtape?.id,
		number: mixtape?.number || "",
		created_at: mixtape?.created_at || "",
		title: mixtape?.title || "",
		description: mixtape?.description || "",
		duration: mixtape?.duration || "",
		status: mixtape?.status || "draft",
		audio_uri: mixtape?.audio_uri || "",
		artwork_uri: mixtape?.artwork_uri || "",
	};
};

export const UploadForm = ({
	mixtape,
	isEditing,
}: {
	mixtape?: Database["public"]["Tables"]["mixtapes"]["Row"];
	isEditing?: boolean;
}) => {
	const [formData, setFormData] = useState<FormData>(defaultFormData(mixtape));
	const [isUploading, setIsUploading] = useState(false);
	const [isSavingMixtape, setIsSavingMixtape] = useState(false);
	const [artworkPreview, setArtworkPreview] = useState<string | null>(null);

	const supabase = createClient();
	const router = useRouter();

	// Initialize artwork preview if mixtape is provided
	useEffect(() => {
		if (mixtape?.artwork_uri) {
			setArtworkPreview(mixtape.artwork_uri);
		}
	}, [mixtape]);

	const isFormValid = () => {
		return (
			formData.number !== "" &&
			formData.title !== "" &&
			formData.description !== "" &&
			formData.duration !== "" &&
			formData.audio_uri !== "" &&
			formData.artwork_uri !== ""
		);
	};

	const handleFileUpload = async (file: File, type: "audio" | "artwork") => {
		if (!file) return;

		if (type === "artwork") {
			const previewUrl = URL.createObjectURL(file);
			setArtworkPreview(previewUrl);
		}

		setIsUploading(true);
		const folder = type === "audio" ? "audio" : "images";
		const filePath = `${folder}/${file.name}`;
		const toastId = toast.loading(`Uploading ${file.name}...`);

		try {
			const { error: uploadError } = await supabase.storage
				.from("media")
				.upload(filePath, file, {
					cacheControl: "3600",
					upsert: true,
				});

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

	const handleCreateMixtape = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSavingMixtape(true);

		const toastId = toast.loading("Creating mixtape...");

		try {
			const response = await createMixtape(formData);

			if (response.error) {
				throw new Error(response.error);
			}

			toast.success("Mixtape created successfully", { id: toastId });
			router.push("/admin/dashboard");
			router.refresh();
		} catch (error) {
			console.error("Error creating mixtape:", error);
			toast.error(
				`Failed to create mixtape: ${error instanceof Error ? error.message : "Unknown error"}`,
				{ id: toastId },
			);
		} finally {
			setIsSavingMixtape(false);
		}
	};

	const handleUpdateMixtape = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSavingMixtape(true);
		const toastId = toast.loading("Updating mixtape...");

		if (!mixtape?.id) {
			toast.error("Mixtape ID is required", { id: toastId });
			return;
		}

		try {
			const response = await updateMixtape(mixtape?.id, formData);

			if (response.error) {
				throw new Error(response.error);
			}

			toast.success("Mixtape updated successfully", { id: toastId });
			router.push("/admin/dashboard");
			router.refresh();
		} catch (error) {
			console.error("Error updating mixtape:", error);
		} finally {
			setIsSavingMixtape(false);
		}
	};

	return (
		<div className="">
			<form
				onSubmit={isEditing ? handleUpdateMixtape : handleCreateMixtape}
				className="0 mx-auto flex max-w-[1000px] flex-col gap-12 py-12"
			>
				<h1 className="text-2xl font-medium">
					{isEditing ? "Edit Mixtape" : "Upload Mixtape"}
				</h1>
				<div className="flex gap-24">
					{/* First Column */}
					<div className="flex flex-1 flex-col gap-6">
						<div className="flex flex-col gap-2">
							<Label htmlFor="number">Number</Label>
							<Input
								id="number"
								name="number"
								required
								value={formData.number}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, number: e.target.value }))
								}
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
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, title: e.target.value }))
								}
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
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, duration: e.target.value }))
								}
							/>
						</div>
					</div>

					{/* Second Column */}
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
										status: value as "draft" | "published",
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
							disabled={!isFormValid() || isUploading}
							className="h-12 w-min px-4"
						>
							{isSavingMixtape ? "Saving..." : "Save"}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
};
