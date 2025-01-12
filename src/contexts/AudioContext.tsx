"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
	isPlaying: boolean;
	isMuted: boolean;
	volume: number;
	progress: number;
	duration: number;
	currentMixtape: { number: string; title: string; id: string } | null;
	audioSrc: string | null;
	queue: Array<{
		audio_uri: string;
		mixtapeInfo: { number: string; title: string; id: string };
	}>;
	togglePlay: () => void;
	toggleMute: () => void;
	setVolume: (volume: number) => void;
	seek: (time: number) => void;
	setAudioSrc: (
		src: string,
		mixtapeInfo: { number: string; title: string; id: string },
		queue?: Array<{
			audio_uri: string;
			mixtapeInfo: { number: string; title: string; id: string };
		}>,
	) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [volume, setVolumeState] = useState(() => {
		if (typeof window !== "undefined") {
			return Number(localStorage.getItem("audio-volume")) || 1;
		}
		return 1;
	});
	const [lastVolume, setLastVolume] = useState(1);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [audioSrc, setAudioSrcState] = useState<string | null>(null);
	const [currentMixtape, setCurrentMixtape] = useState<{
		number: string;
		title: string;
		id: string;
	} | null>(null);
	const [queue, setQueue] = useState<
		Array<{
			audio_uri: string;
			mixtapeInfo: { number: string; title: string; id: string };
		}>
	>([]);

	console.log("queue", queue);
	console.log("currentMixtape", currentMixtape);

	useEffect(() => {
		if (!audioRef.current) return;
		const audio = audioRef.current;

		const handleTimeUpdate = () => {
			setProgress(audio.currentTime);
		};

		const handleDurationChange = () => {
			setDuration(audio.duration);
		};

		const handleEnded = async () => {
			setIsPlaying(false);
			setProgress(0);

			// Play next track if available
			if (queue.length > 0) {
				const nextTrack = queue[0];
				const remainingQueue = queue.slice(1);

				try {
					// First, pause and reset any existing playback
					audio.pause();

					// Set up the new audio source
					audio.src = nextTrack.audio_uri;
					audio.load();
					setAudioSrcState(nextTrack.audio_uri);
					setCurrentMixtape(nextTrack.mixtapeInfo);
					setQueue(remainingQueue);

					// Wait a bit for the audio to be ready
					await new Promise((resolve) => setTimeout(resolve, 100));

					// Start playing the new audio
					await audio.play();
					setIsPlaying(true);
				} catch (error) {
					console.log("Auto-play next track error:", error);
					setIsPlaying(false);
				}
			}
		};

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("durationchange", handleDurationChange);

		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("durationchange", handleDurationChange);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [queue]); // Add queue as dependency

	// Initialize audio element
	useEffect(() => {
		audioRef.current = new Audio();
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.src = "";
			}
		};
	}, []); // This effect only runs once to initialize

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			localStorage.setItem("audio-volume", volume.toString());
		}
	}, [volume]);

	const togglePlay = async () => {
		if (!audioRef.current) return;

		try {
			if (isPlaying) {
				audioRef.current.pause();
				setIsPlaying(false);
			} else {
				const playPromise = audioRef.current.play();
				await playPromise;
				setIsPlaying(true);
			}
		} catch (error) {
			console.log("Toggle play error:", error);
			setIsPlaying(false);
		}
	};

	const toggleMute = () => {
		if (!audioRef.current) return;

		if (!isMuted) {
			// Saving current volume before muting
			if (volume > 0) {
				setLastVolume(volume);
			}
			setVolumeState(0);
		} else {
			// Restore to last volume, but ensure it's not 0
			setVolumeState(lastVolume || 1);
		}

		audioRef.current.muted = !isMuted;
		setIsMuted(!isMuted);
	};

	const setVolume = (newVolume: number) => {
		if (!audioRef.current) return;
		const clampedVolume = Math.max(0, Math.min(1, newVolume));
		setVolumeState(clampedVolume);
	};

	const seek = (time: number) => {
		if (!audioRef.current) return;
		const clampedTime = Math.max(0, Math.min(time, audioRef.current.duration));
		audioRef.current.currentTime = clampedTime;
		setProgress(clampedTime);
	};

	const setAudioSrc = async (
		src: string,
		mixtapeInfo: { number: string; title: string; id: string },
		newQueue?: Array<{
			audio_uri: string;
			mixtapeInfo: { number: string; title: string; id: string };
		}>,
	) => {
		if (!audioRef.current) return;

		try {
			// Pause and reset any existing playback
			if (audioRef.current.src) {
				audioRef.current.pause();
				setIsPlaying(false);
			}

			// Set up the new audio source
			audioRef.current.src = src;
			audioRef.current.load();
			setAudioSrcState(src);
			setCurrentMixtape(mixtapeInfo);

			// Update queue if provided
			if (newQueue) setQueue(newQueue);

			// Wait a bit for the audio to be ready
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Start playing the new audio
			const playPromise = audioRef.current.play();
			await playPromise;
			setIsPlaying(true);
		} catch (error) {
			console.log("Playback error:", error);
			setIsPlaying(false);
		}
	};

	return (
		<AudioContext.Provider
			value={{
				isPlaying,
				isMuted: isMuted || volume === 0,
				volume,
				progress,
				duration,
				currentMixtape,
				audioSrc,
				queue,
				togglePlay,
				toggleMute,
				setVolume,
				seek,
				setAudioSrc,
			}}
		>
			{children}
		</AudioContext.Provider>
	);
}

export function useAudio() {
	const context = useContext(AudioContext);
	if (context === undefined) {
		throw new Error("useAudio must be used within an AudioProvider");
	}
	return context;
}
