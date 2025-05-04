"use client";

// COMPONENTS
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { PlayIcon } from "./icons/play-icon";
import { PauseIcon } from "./icons/pause-icon";
import { VolumeIcon } from "./icons/volume-icon";
import { MuteIcon } from "./icons/mute-icon";

// HOOKS
import { useAudio } from "@/contexts/AudioContext";
import { useEffect, useState } from "react";

// TYPES
import type { Database } from "@/types/database.types";

export function Player({
	mixtape,
}: {
	mixtape?: Database["public"]["Tables"]["mixtapes"]["Row"];
}) {
	const [isDownloading, setIsDownloading] = useState(false);
	const {
		isPlaying,
		isMuted,
		volume,
		progress,
		duration,
		currentMixtape,
		audioSrc,
		togglePlay,
		toggleMute,
		setVolume,
		seek,
		setAudioSrc,
	} = useAudio();

	// If player is receiving a mixtape, set the current mixtape
	useEffect(() => {
		if (
			mixtape &&
			(!currentMixtape || mixtape.id.toString() !== currentMixtape.id)
		) {
			setAudioSrc(
				mixtape.audio_uri,
				{
					number: mixtape.number,
					title: mixtape.title,
					id: mixtape.id.toString(),
				},
				undefined,
				false,
			);
		}
	}, [mixtape, setAudioSrc, currentMixtape]);

	const formatTime = (time: number) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = Math.floor(time % 60);

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
		}
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const remainingTime = duration - progress;

	const handleDownload = async () => {
		if (!audioSrc || isDownloading || !currentMixtape) return;
		setIsDownloading(true);

		try {
			const filename = `${currentMixtape.number}-${currentMixtape.title}.mp3`;
			const downloadUrl = `/api/download?url=${encodeURIComponent(audioSrc)}&filename=${encodeURIComponent(filename)}`;

			const downloadPromise = new Promise<{ title: string }>(
				(resolve, reject) => {
					fetch(downloadUrl)
						.then((response) => {
							if (!response.ok) throw new Error("Download failed");
							return response.blob();
						})
						.then((blob) => {
							const url = window.URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.style.display = "none";
							a.href = url;
							a.download = filename;
							document.body.appendChild(a);
							a.click();
							window.URL.revokeObjectURL(url);
							document.body.removeChild(a);
							resolve({ title: currentMixtape.title });
						})
						.catch(reject);
				},
			);

			toast.promise(downloadPromise, {
				loading: `Downloading mixtape ${currentMixtape.title}`,
				success: (data) => `Downloaded ${data.title}`,
				error: "Download failed",
			});
		} catch (error) {
			console.error("Download error:", error);
		} finally {
			setIsDownloading(false);
		}
	};

	// Show player if we have either a mixtape prop or an audioSrc
	if (!mixtape && !audioSrc) return null;

	const baseIconStyles = "h-5 w-5";

	return (
		<div className="fixed bottom-0 z-40 h-20 w-screen border-t border-stone-300 bg-white p-4 dark:bg-[#121212] lg:bottom-[1rem] lg:left-[50%] lg:h-[88px] lg:w-1/2 lg:translate-x-[-50%] lg:border">
			<div className="mx-auto flex max-w-7xl flex-col gap-2">
				<div className="px-2 text-xs text-[#414141] dark:text-[#f1f1f1]">
					{currentMixtape?.number} - {currentMixtape?.title}
				</div>
				<div className="flex items-center justify-between gap-2">
					<Button className="h-8 w-8 shrink-0" size="icon" onClick={togglePlay}>
						{isPlaying ? (
							<PauseIcon className="text-foreground hover:text-foreground/80" />
						) : (
							<PlayIcon className="text-foreground hover:text-foreground/80" />
						)}
					</Button>
					<Slider
						value={[progress]}
						max={duration}
						step={1}
						onValueChange={(value) => seek(value[0])}
						className="cursor-pointer"
					/>
					<span className="w-12 text-xs text-[#414141] dark:text-[#f1f1f1]">
						{formatTime(remainingTime)}
					</span>
					<div className="flex items-center gap-2">
						<Button
							size="icon"
							className="h-8 w-8 shrink-0"
							onClick={toggleMute}
						>
							{isMuted ? (
								<MuteIcon className="text-foreground hover:text-foreground/80" />
							) : (
								<VolumeIcon className="text-foreground hover:text-foreground/80" />
							)}
						</Button>
						<Slider
							value={[volume * 100]}
							max={100}
							step={1}
							onValueChange={(value) => setVolume(value[0] / 100)}
							className="w-24 cursor-pointer"
						/>
						<Button
							size="icon"
							onClick={handleDownload}
							className="h-8 w-8 shrink-0"
							title="Download"
							disabled={isDownloading}
						>
							<DownloadIcon
								className={`${baseIconStyles} ${
									isDownloading ? "opacity-50" : ""
								}`}
							/>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
