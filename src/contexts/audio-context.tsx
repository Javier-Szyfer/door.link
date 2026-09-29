"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  previousTracks: Array<{
    audio_uri: string;
    mixtapeInfo: { number: string; title: string; id: string; artwork_uri?: string };
  }>;
  isContinuousPlayback: boolean;
  setContinuousPlayback: Dispatch<SetStateAction<boolean>>;
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
  const [isContinuousPlayback, setIsContinuousPlayback] = useState(true);
  const [previousTracks, setPreviousTracks] = useState<
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
      const savedContinuousPlayback = localStorage.getItem("audio-continuous-playback");
      if (savedContinuousPlayback !== null) {
        setIsContinuousPlayback(savedContinuousPlayback === "true");
      }
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("audio-continuous-playback", String(isContinuousPlayback));
    }
  }, [isContinuousPlayback, mounted]);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Toggle play error:", error);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    const clampedTime = Math.max(0, Math.min(time, audioRef.current.duration));
    audioRef.current.currentTime = clampedTime;
    setProgress(clampedTime);
  }, []);

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

          // Add current track to previous tracks history
          if (currentMixtape && audioSrc) {
            setPreviousTracks((prev) => [
              ...prev,
              {
                audio_uri: audioSrc,
                mixtapeInfo: currentMixtape,
              },
            ]);
          }

          audio.src = nextTrack.audio_uri;
          audio.load();
          setAudioSrcState(nextTrack.audio_uri);
          setCurrentMixtape(nextTrack.mixtapeInfo);
          setQueue(remainingQueue);

          await new Promise((resolve) => setTimeout(resolve, 100));
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Next track error:", error);
          setIsPlaying(false);
        }
      });

      // Previous track handler
      navigator.mediaSession.setActionHandler("previoustrack", async () => {
        if (!audioRef.current) return;

        // If more than 3 seconds into track, restart current track
        if (progress > 3) {
          const clampedTime = Math.max(0, Math.min(0, audioRef.current.duration || 0));
          audioRef.current.currentTime = clampedTime;
          setProgress(clampedTime);

          try {
            if (duration > 0) {
              navigator.mediaSession.setPositionState({
                duration: duration,
                playbackRate: 1,
                position: 0,
              });
            }
          } catch (_e) {
            // Ignore position state errors
          }
          return;
        }

        // If less than 3 seconds and we have previous tracks, go to previous track
        if (previousTracks.length > 0) {
          const previousTrack = previousTracks[previousTracks.length - 1];
          const newPreviousTracks = previousTracks.slice(0, -1);

          try {
            const audio = audioRef.current;
            audio.pause();
            setIsPlaying(false);

            // Add current track to front of queue for "next" functionality
            if (currentMixtape && audioSrc) {
              setQueue((prev) => [
                {
                  audio_uri: audioSrc,
                  mixtapeInfo: currentMixtape,
                },
                ...prev,
              ]);
            }

            audio.src = previousTrack.audio_uri;
            audio.load();
            setAudioSrcState(previousTrack.audio_uri);
            setCurrentMixtape(previousTrack.mixtapeInfo);
            setPreviousTracks(newPreviousTracks);

            await new Promise((resolve) => setTimeout(resolve, 100));
            await audio.play();
            setIsPlaying(true);
          } catch (error) {
            console.error("Previous track error:", error);
            setIsPlaying(false);
          }
        } else {
          // No previous tracks, just restart current track
          const clampedTime = Math.max(0, Math.min(0, audioRef.current.duration || 0));
          audioRef.current.currentTime = clampedTime;
          setProgress(clampedTime);

          try {
            if (duration > 0) {
              navigator.mediaSession.setPositionState({
                duration: duration,
                playbackRate: 1,
                position: 0,
              });
            }
          } catch (_e) {
            // Ignore position state errors
          }
        }
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
      console.error("Media Session API error:", error);
    }
  }, [
    currentMixtape,
    isPlaying,
    progress,
    duration,
    queue,
    audioSrc,
    previousTracks,
    togglePlay,
    seek,
  ]);

  // Set up audio event listeners
  // biome-ignore lint/correctness/useExhaustiveDependencies: listeners are attached once per track; re-running on every state change would tear them down mid-playback
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
      if (isContinuousPlayback && queue.length > 0) {
        const nextTrack = queue[0];
        const remainingQueue = queue.slice(1);

        try {
          // Add current track to previous tracks history
          if (currentMixtape && audioSrc) {
            setPreviousTracks((prev) => [
              ...prev,
              {
                audio_uri: audioSrc,
                mixtapeInfo: currentMixtape,
              },
            ]);
          }

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
          console.error("Auto-play next track error:", error);
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [queue, audioSrc, isContinuousPlayback, currentMixtape]);

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

      // Add current track to previous tracks history if we're switching tracks
      if (audioRef.current.src && currentMixtape && audioSrc && audioSrc !== src) {
        setPreviousTracks((prev) => [
          ...prev,
          {
            audio_uri: audioSrc,
            mixtapeInfo: currentMixtape,
          },
        ]);
      }

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
      console.error("Playback error:", error);
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
        previousTracks,
        isContinuousPlayback,
        setContinuousPlayback: setIsContinuousPlayback,
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
