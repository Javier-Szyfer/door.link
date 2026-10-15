"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Database } from "@/types/database.types";

type Mixtape = Database["public"]["Tables"]["mixtapes"]["Row"];

export type Track = Pick<Mixtape, "id" | "number" | "title"> & { src: string };

export const toTrack = ({ id, number, title, audio_uri }: Mixtape): Track => ({
  id,
  number,
  title,
  src: audio_uri,
});

interface AudioContextType {
  // True once the audio element exists.
  isReady: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: Track | null;
  isContinuousPlayback: boolean;
  setContinuousPlayback: Dispatch<SetStateAction<boolean>>;
  playTrack: (track: Track, queue: Track[]) => void;
  loadTrack: (track: Track) => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

interface AudioProgressType {
  progress: number;
  duration: number;
}

const AudioContext = createContext<AudioContextType | null>(null);
const AudioProgressContext = createContext<AudioProgressType>({ progress: 0, duration: 0 });

const VOLUME_KEY = "audio-volume";
const CONTINUOUS_PLAYBACK_KEY = "audio-continuous-playback";
const DEFAULT_VOLUME = 0.5;
const SEEK_OFFSET_S = 10;
// Past this point "previous" restarts the current track instead.
const RESTART_THRESHOLD_S = 3;

const MEDIA_SESSION_ARTWORK = [
  { src: "/android-chrome-256x256.png", sizes: "256x256", type: "image/png" },
  { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
  { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const play = (audio: HTMLAudioElement) =>
  audio.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "AbortError") return;
    console.error("Playback error:", error);
  });

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<Track | null>(null);
  const queueRef = useRef<Track[]>([]);
  const historyRef = useRef<Track[]>([]);
  const continuousPlaybackRef = useRef(true);
  const lastVolumeRef = useRef(DEFAULT_VOLUME);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isContinuousPlayback, setContinuousPlayback] = useState(true);

  const switchTo = useCallback((track: Track, autoPlay: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = track.src;
    currentTrackRef.current = track;
    setCurrentTrack(track);
    if (autoPlay) play(audio);
  }, []);

  const select = useCallback(
    (track: Track, autoPlay: boolean) => {
      const current = currentTrackRef.current;
      if (current && current.id !== track.id) historyRef.current.push(current);
      switchTo(track, autoPlay);
    },
    [switchTo],
  );

  const playTrack = useCallback(
    (track: Track, queue: Track[]) => {
      queueRef.current = queue;
      select(track, true);
    },
    [select],
  );

  const loadTrack = useCallback((track: Track) => select(track, false), [select]);

  const next = useCallback(() => {
    const [nextTrack, ...rest] = queueRef.current;
    if (!nextTrack) return;

    queueRef.current = rest;
    select(nextTrack, true);
  }, [select]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const previousTrack = historyRef.current.at(-1);
    if (!previousTrack || audio.currentTime > RESTART_THRESHOLD_S) {
      audio.currentTime = 0;
      return;
    }

    historyRef.current = historyRef.current.slice(0, -1);
    const current = currentTrackRef.current;
    if (current) queueRef.current = [current, ...queueRef.current];
    switchTo(previousTrack, true);
  }, [switchTo]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) play(audio);
    else audio.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedTime = clamp(time, 0, audio.duration || 0);
    audio.currentTime = clampedTime;
    setProgress(clampedTime);
  }, []);

  const setVolume = useCallback((value: number) => setVolumeState(clamp(value, 0, 1)), []);

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      lastVolumeRef.current = volume;
      setVolumeState(0);
    } else {
      setVolumeState(lastVolumeRef.current);
    }
  }, [volume]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const savedVolume = Number(localStorage.getItem(VOLUME_KEY) ?? Number.NaN);
    if (Number.isFinite(savedVolume)) setVolumeState(clamp(savedVolume, 0, 1));
    const savedContinuousPlayback = localStorage.getItem(CONTINUOUS_PLAYBACK_KEY);
    if (savedContinuousPlayback !== null) {
      setContinuousPlayback(savedContinuousPlayback === "true");
    }

    const updatePositionState = () => {
      if (!("mediaSession" in navigator) || !Number.isFinite(audio.duration)) return;
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime,
      });
    };

    const listeners: Record<string, () => void> = {
      play: () => {
        setIsPlaying(true);
        updatePositionState();
      },
      pause: () => {
        setIsPlaying(false);
        setIsBuffering(false);
        updatePositionState();
      },
      playing: () => setIsBuffering(false),
      waiting: () => setIsBuffering(true),
      seeking: () => setIsBuffering(true),
      canplay: () => setIsBuffering(false),
      timeupdate: () => setProgress(audio.currentTime),
      seeked: updatePositionState,
      loadstart: () => {
        setIsLoading(true);
        setProgress(0);
        setDuration(0);
      },
      loadedmetadata: () => {
        setIsLoading(false);
        setDuration(audio.duration);
        updatePositionState();
      },
      error: () => {
        setIsLoading(false);
        setIsBuffering(false);
      },
      ended: () => {
        setProgress(0);
        if (continuousPlaybackRef.current) next();
      },
    };

    for (const [event, listener] of Object.entries(listeners)) {
      audio.addEventListener(event, listener);
    }

    const actionHandlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => play(audio)],
      ["pause", () => audio.pause()],
      ["seekbackward", ({ seekOffset }) => seek(audio.currentTime - (seekOffset || SEEK_OFFSET_S))],
      ["seekforward", ({ seekOffset }) => seek(audio.currentTime + (seekOffset || SEEK_OFFSET_S))],
      ["seekto", ({ seekTime }) => seekTime != null && seek(seekTime)],
      ["nexttrack", next],
      ["previoustrack", previous],
    ];

    const setActionHandlers = (clear: boolean) => {
      if (!("mediaSession" in navigator)) return;
      for (const [action, handler] of actionHandlers) {
        try {
          navigator.mediaSession.setActionHandler(action, clear ? null : handler);
        } catch {}
      }
    };

    setActionHandlers(false);
    setIsReady(true);

    return () => {
      setActionHandlers(true);
      for (const [event, listener] of Object.entries(listeners)) {
        audio.removeEventListener(event, listener);
      }
      audio.pause();
      audio.src = "";
    };
  }, [next, previous, seek]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume]);

  useEffect(() => {
    continuousPlaybackRef.current = isContinuousPlayback;
    if (isReady) localStorage.setItem(CONTINUOUS_PLAYBACK_KEY, String(isContinuousPlayback));
  }, [isContinuousPlayback, isReady]);

  useEffect(() => {
    if (!currentTrack || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: "door.link",
      album: `Mix ${currentTrack.number}`,
      artwork: MEDIA_SESSION_ARTWORK,
    });
  }, [currentTrack]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  const value = useMemo(
    () => ({
      isReady,
      isPlaying,
      isLoading,
      isBuffering,
      isMuted: volume === 0,
      volume,
      currentTrack,
      isContinuousPlayback,
      setContinuousPlayback,
      playTrack,
      loadTrack,
      togglePlay,
      toggleMute,
      setVolume,
      seek,
    }),
    [
      isReady,
      isPlaying,
      isLoading,
      isBuffering,
      volume,
      currentTrack,
      isContinuousPlayback,
      playTrack,
      loadTrack,
      togglePlay,
      toggleMute,
      setVolume,
      seek,
    ],
  );

  const progressValue = useMemo(() => ({ progress, duration }), [progress, duration]);

  return (
    <AudioContext.Provider value={value}>
      <AudioProgressContext.Provider value={progressValue}>
        {children}
      </AudioProgressContext.Provider>
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within an AudioProvider");
  return context;
}

export const useAudioProgress = () => useContext(AudioProgressContext);
