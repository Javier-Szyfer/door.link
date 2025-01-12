"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
	isPlaying: boolean;
	isMuted: boolean;
	volume: number;
	progress: number;
	duration: number;
	currentMixtape: { number: string; title: string } | null;
	audioSrc: string | null;
	togglePlay: () => void;
	toggleMute: () => void;
	setVolume: (volume: number) => void;
	seek: (time: number) => void;
	setAudioSrc: (
		src: string,
		mixtapeInfo: { number: string; title: string },
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
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [audioSrc, setAudioSrcState] = useState<string | null>(null);
	const [currentMixtape, setCurrentMixtape] = useState<{
		number: string;
		title: string;
	} | null>(null);

	useEffect(() => {
		audioRef.current = new Audio();

		const audio = audioRef.current;

		audio.addEventListener("timeupdate", () => {
			setProgress(audio.currentTime);
		});

		audio.addEventListener("durationchange", () => {
			setDuration(audio.duration);
		});

		audio.addEventListener("ended", () => {
			setIsPlaying(false);
			setProgress(0);
		});

		return () => {
			audio.pause();
			audio.src = "";
		};
	}, []);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			localStorage.setItem("audio-volume", volume.toString());
		}
	}, [volume]);

	const togglePlay = () => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
		setIsPlaying(!isPlaying);
	};

	const toggleMute = () => {
		if (!audioRef.current) return;
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

	const setAudioSrc = (
		src: string,
		mixtapeInfo: { number: string; title: string },
	) => {
		if (!audioRef.current) return;
		audioRef.current.src = src;
		audioRef.current.load();
		setAudioSrcState(src);
		setCurrentMixtape(mixtapeInfo);
	};

	return (
		<AudioContext.Provider
			value={{
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
