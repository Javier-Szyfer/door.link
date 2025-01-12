"use client";

import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

export function Player() {
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
	} = useAudio();

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	if (!currentMixtape || !audioSrc) return null;

	return (
		<div className="fixed bottom-0 z-40 h-20 w-screen border-t border-stone-300 bg-white p-4 dark:bg-[#121212] lg:bottom-[1rem] lg:left-[50%] lg:h-[88px] lg:w-1/2 lg:translate-x-[-50%] lg:border">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col gap-2">
					<div className="text-sm font-medium">
						{currentMixtape.number} - {currentMixtape.title}
					</div>
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							size="icon"
							onClick={togglePlay}
							className="h-8 w-8"
						>
							{isPlaying ? (
								<PauseIcon className="h-4 w-4" />
							) : (
								<PlayIcon className="h-4 w-4" />
							)}
						</Button>
						<Slider
							value={[progress]}
							max={duration}
							step={1}
							onValueChange={(value) => seek(value[0])}
							className="cursor-pointer"
						/>
						<span className="w-12 text-xs">{formatTime(progress)}</span> -
						<span className="w-12 text-xs">{formatTime(duration)}</span>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleMute}
								className="h-8 w-8"
							>
								{isMuted ? (
									<VolumeXIcon className="h-4 w-4" />
								) : (
									<Volume2Icon className="h-4 w-4" />
								)}
							</Button>
							<Slider
								value={[volume * 100]}
								max={100}
								step={1}
								onValueChange={(value) => setVolume(value[0] / 100)}
								className="w-24 cursor-pointer"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
