"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentMixtape: { number: string; title: string; id: string; artwork_uri?: string } | null;
  audioSrc: string | null;
  isLoading: boolean;
  queue: Array<{
    audio_uri: string;
    mixtapeInfo: { number: string; title: string; id: string; artwork_uri?: string };
  }>;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  setAudioSrc: (
    src: string,
    mixtapeInfo: { number: string; title: string; id: string; artwork_uri?: string },
    queue?: Array<{
      audio_uri: string;
      mixtapeInfo: { number: string; title: string; id: string; artwork_uri?: string };
    }>,
    autoPlay?: boolean,
  ) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioSrc, setAudioSrcState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentMixtape, setCurrentMixtape] = useState<{
    number: string;
    title: string;
    id: string;
    artwork_uri?: string;
  } | null>(null);
  const [queue, setQueue] = useState<
    Array<{
      audio_uri: string;
      mixtapeInfo: { number: string; title: string; id: string; artwork_uri?: string };
    }>
  >([]);

  // Initialize mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize volume from localStorage only after mounting
  useEffect(() => {
    if (mounted) {
      const savedVolume = localStorage.getItem("audio-volume");
      if (savedVolume !== null) {
        setVolumeState(Number(savedVolume));
      }
    }
  }, [mounted]);

  // Update Media Session API when track or play state changes
  const updateMediaSession = useCallback(() => {
    if (!currentMixtape || typeof navigator === "undefined" || !("mediaSession" in navigator))
      return;

    try {
      // Set metadata
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentMixtape.title,
        artist: "door.link",
        album: `Mix ${currentMixtape.number}`,
        artwork: [
          // Always use the keyhole logo
          { src: "/android-chrome-256x256.png", sizes: "256x256", type: "image/png" },
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
          { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
          { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
      });

      // Set playback state
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

      // Set action handlers
      navigator.mediaSession.setActionHandler("play", () => {
        togglePlay();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        togglePlay();
      });

      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const skipTime = details.seekOffset || 10;
        seek(Math.max(progress - skipTime, 0));
      });

      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const skipTime = details.seekOffset || 10;
        seek(Math.min(progress + skipTime, duration));
      });

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime !== null && details.seekTime !== undefined) {
          seek(details.seekTime);
        }
      });

      // Next track handler
      navigator.mediaSession.setActionHandler("nexttrack", async () => {
        if (!audioRef.current || queue.length === 0) return;

        const nextTrack = queue[0];
        const remainingQueue = queue.slice(1);

        try {
          const audio = audioRef.current;
          audio.pause();
          setIsPlaying(false);

          audio.src = nextTrack.audio_uri;
          audio.load();
          setAudioSrcState(nextTrack.audio_uri);
          setCurrentMixtape(nextTrack.mixtapeInfo);
          setQueue(remainingQueue);

          await new Promise((resolve) => setTimeout(resolve, 100));
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Next track error:", error);
          setIsPlaying(false);
        }
      });

      // Previous track handler
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (!audioRef.current) return;
        // Simple implementation: restart current track
        audioRef.current.currentTime = 0;
        setProgress(0);
      });

      // Set position state if available
      if (duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: 1,
          position: progress,
        });
      }
    } catch (error) {
      console.log("Media Session API error:", error);
    }
  }, [currentMixtape, isPlaying, progress, duration, queue]);

  // Set up audio event listeners
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);

      // Update Media Session metadata when audio loads
      updateMediaSession();
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setDuration(0);
      setProgress(0);
    };

    const handleEnded = async () => {
      setIsPlaying(false);
      setProgress(0);

      // Play next track if available
      if (queue.length > 0) {
        const nextTrack = queue[0];
        const remainingQueue = queue.slice(1);

        try {
          audio.pause();
          audio.src = nextTrack.audio_uri;
          audio.load();
          setAudioSrcState(nextTrack.audio_uri);
          setCurrentMixtape(nextTrack.mixtapeInfo);
          setQueue(remainingQueue);

          await new Promise((resolve) => setTimeout(resolve, 100));
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Auto-play next track error:", error);
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("ended", handleEnded);

    // If audio source exists, trigger metadata load
    if (audio.src) audio.load();

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [queue, audioSrc]);

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem("audio-volume", volume.toString());
    }
  }, [volume]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Update Media Session when state changes
  useEffect(() => {
    updateMediaSession();
  }, [updateMediaSession]);

  if (!mounted) {
    return null;
  }

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
    mixtapeInfo: { number: string; title: string; id: string; artwork_uri?: string },
    newQueue?: Array<{
      audio_uri: string;
      mixtapeInfo: { number: string; title: string; id: string; artwork_uri?: string };
    }>,
    autoPlay?: boolean,
  ) => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      // Pause and reset any existing playback
      if (audioRef.current.src) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      // Set up the new audio source
      audioRef.current.src = src;
      setAudioSrcState(src);
      setCurrentMixtape(mixtapeInfo);

      // Update queue if provided
      if (newQueue) setQueue(newQueue);

      // Load the audio and wait for metadata
      audioRef.current.load();

      // Wait for metadata to load
      if (!audioRef.current.duration) {
        await new Promise((resolve) => {
          const handleMetadata = () => {
            audioRef.current?.removeEventListener("loadedmetadata", handleMetadata);
            resolve(true);
          };
          audioRef.current?.addEventListener("loadedmetadata", handleMetadata);
        });
      }

      // Only auto-play if specified
      if (autoPlay) {
        const playPromise = audioRef.current.play();
        await playPromise;
        setIsPlaying(true);
      }
    } catch (error) {
      console.log("Playback error:", error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
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
        isLoading,
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
