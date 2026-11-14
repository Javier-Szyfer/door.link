"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isInterruption, shouldResume } from "@/lib/interruption";
import { pickLastPlayed } from "@/lib/last-played";
import type { Mix } from "@/lib/mix";
import { isFinished } from "@/lib/progress";
import { isPlayable, nextPlayable, previousPlayable } from "@/lib/queue";
import { getLastPlayed, getProgressMap, type Progress, setLastPlayed } from "@/lib/storage";
import { useLibrary } from "@/lib/use-library";
import { useNotice } from "@/lib/use-notice";
import { useOnline } from "@/lib/use-online";

type Player = {
  current: Mix | null;
  isPlaying: boolean;
  isBuffering: boolean;
  play: (mix: Mix) => void;
  toggle: () => void;
  seekBy: (seconds: number) => void;
  seekTo: (seconds: number) => void;
  next: () => void;
  previous: () => void;
  airplayAvailable: boolean;
  showAirPlay: () => void;
  canSetVolume: boolean;
  volume: number;
  setVolume: (volume: number) => void;
};

type AirPlayAudio = HTMLAudioElement & { webkitShowPlaybackTargetPicker?: () => void };

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

type PlayerTime = { position: number; duration: number };

const PlayerContext = createContext<Player | null>(null);
const PlayerTimeContext = createContext<PlayerTime>({ position: 0, duration: 0 });

const SKIP_BACK_S = 15;
const SKIP_FORWARD_S = 30;
const SAVE_EVERY_MS = 5000;

const FALLBACK_ARTWORK = [
  { src: "/icons/android-chrome-256x256.png", sizes: "256x256", type: "image/png" },
  { src: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
];

const OFFLINE_MESSAGE = "You’re offline. Download a mix to play it without a connection.";

// Plays the audio, reloading it first if it had failed.
const startPlayback = (audio: HTMLAudioElement) => {
  if (audio.error) audio.load();
  return audio.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "AbortError") return;
    console.error("Playback error:", error);
  });
};

// Owns the audio element, remembers where each mix was left and drives lock-screen controls.
export function PlayerProvider({ children }: { children: ReactNode }) {
  const { mixes, progress, saveProgress, downloads } = useLibrary();
  const online = useOnline();
  const { notify } = useNotice();
  const availabilityRef = useRef({ online, downloads });
  availabilityRef.current = { online, downloads };
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRef = useRef<Mix | null>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const lastSaveRef = useRef(0);
  const resumeOnReconnectRef = useRef(false);
  const listenerPausedRef = useRef(false);
  const interruptedAtRef = useRef<number | null>(null);
  const mixesRef = useRef(mixes);
  mixesRef.current = mixes;
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const saveProgressRef = useRef(saveProgress);
  saveProgressRef.current = saveProgress;

  const [current, setCurrent] = useState<Mix | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [time, setTime] = useState<PlayerTime>({ position: 0, duration: 0 });
  const [airplayAvailable, setAirplayAvailable] = useState(false);
  const [canSetVolume, setCanSetVolume] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const restoredRef = useRef(false);

  const persist = useCallback(() => {
    const audio = audioRef.current;
    const mix = currentRef.current;
    if (!audio || !mix || pendingSeekRef.current != null) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : mix.durationSeconds;
    const position = audio.currentTime;
    lastSaveRef.current = Date.now();
    saveProgressRef.current(mix.number, {
      position,
      duration,
      updatedAt: Date.now(),
      finished: isFinished(position, duration),
    });
  }, []);

  // Points the player at a mix, ready to resume where it was left.
  const load = useCallback(
    (mix: Mix, saved: Progress | undefined = progressRef.current[mix.number]) => {
      const audio = audioRef.current;
      if (!audio) return;
      persist();
      pendingSeekRef.current = saved && !saved.finished ? saved.position : null;
      currentRef.current = mix;
      setCurrent(mix);
      setTime({ position: pendingSeekRef.current ?? 0, duration: mix.durationSeconds ?? 0 });
      audio.src = mix.audioUrl;
      setLastPlayed(mix.number).catch(() => {});
    },
    [persist],
  );

  const play = useCallback(
    (mix: Mix) => {
      const audio = audioRef.current;
      if (!audio) return;
      const { online, downloads } = availabilityRef.current;
      if (!isPlayable(mix.number, online, downloads)) {
        notify(OFFLINE_MESSAGE);
        return;
      }
      if (currentRef.current?.number !== mix.number) load(mix);
      startPlayback(audio);
    },
    [load, notify],
  );

  // Pauses at the listener's request, so it isn't taken for an interruption.
  const pauseForListener = useCallback((audio: HTMLAudioElement) => {
    if (audio.paused) return;
    listenerPausedRef.current = true;
    audio.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentRef.current) return;
    if (audio.paused || audio.error) startPlayback(audio);
    else pauseForListener(audio);
  }, [pauseForListener]);

  const seekTo = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const max = Number.isFinite(audio.duration) ? audio.duration : seconds;
    const target = Math.min(Math.max(seconds, 0), max);
    if (pendingSeekRef.current != null) pendingSeekRef.current = target;
    else audio.currentTime = target;
    setTime((t) => ({ ...t, position: target }));
  }, []);

  const seekBy = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      seekTo((pendingSeekRef.current ?? audio.currentTime) + seconds);
    },
    [seekTo],
  );

  const next = useCallback(() => {
    const { online, downloads } = availabilityRef.current;
    const following = nextPlayable(mixesRef.current, currentRef.current?.number, online, downloads);
    if (following) play(following);
  }, [play]);

  const previous = useCallback(() => {
    const { online, downloads } = availabilityRef.current;
    const before = previousPlayable(
      mixesRef.current,
      currentRef.current?.number,
      online,
      downloads,
    );
    if (before) play(before);
  }, [play]);

  const showAirPlay = useCallback(() => {
    (audioRef.current as AirPlayAudio | null)?.webkitShowPlaybackTargetPicker?.();
  }, []);

  const setVolume = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.min(Math.max(value, 0), 1);
    setVolumeState(audio.volume);
  }, []);

  useEffect(() => {
    if (restoredRef.current || !mixes.length || currentRef.current) return;
    restoredRef.current = true;
    Promise.all([getLastPlayed(), getProgressMap()])
      .then(([last, saved]) => {
        const mix = pickLastPlayed(mixes, last, saved);
        if (mix && !currentRef.current) load(mix, saved[mix.number]);
      })
      .catch(() => {});
  }, [mixes, load]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.setAttribute("x-webkit-airplay", "allow");
    const { audioSession } = navigator as AudioSessionNavigator;
    if (audioSession) audioSession.type = "playback";
    audioRef.current = audio;
    audio.volume = 0.5;
    setCanSetVolume(audio.volume === 0.5);
    audio.volume = 1;
    const onTargets = (event: Event) =>
      setAirplayAvailable(
        (event as Event & { availability?: string }).availability === "available",
      );
    audio.addEventListener("webkitplaybacktargetavailabilitychanged", onTargets);

    const updatePositionState = () => {
      if (!("mediaSession" in navigator) || !Number.isFinite(audio.duration)) return;
      try {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: Math.min(audio.currentTime, audio.duration),
        });
      } catch {}
    };

    const listeners: Record<string, () => void> = {
      play: () => {
        interruptedAtRef.current = null;
        setIsPlaying(true);
      },
      playing: () => {
        setIsBuffering(false);
        updatePositionState();
      },
      pause: () => {
        const interrupted = isInterruption({
          byListener: listenerPausedRef.current,
          ended: audio.ended,
          hidden: document.visibilityState === "hidden",
        });
        listenerPausedRef.current = false;
        if (interrupted) interruptedAtRef.current = Date.now();
        setIsPlaying(false);
        setIsBuffering(false);
        persist();
        updatePositionState();
      },
      waiting: () => setIsBuffering(true),
      canplay: () => setIsBuffering(false),
      loadedmetadata: () => {
        const target = pendingSeekRef.current;
        pendingSeekRef.current = null;
        if (target != null && target < audio.duration) audio.currentTime = target;
        setTime({ position: audio.currentTime, duration: audio.duration });
        updatePositionState();
      },
      timeupdate: () => {
        if (pendingSeekRef.current != null) return;
        setTime({
          position: audio.currentTime,
          duration: Number.isFinite(audio.duration) ? audio.duration : 0,
        });
        if (Date.now() - lastSaveRef.current >= SAVE_EVERY_MS) persist();
      },
      seeked: () => {
        persist();
        updatePositionState();
      },
      ended: () => {
        persist();
        next();
      },
      error: () => {
        resumeOnReconnectRef.current = !audio.paused;
        pendingSeekRef.current ??= audio.currentTime;
        setIsBuffering(false);
        setIsPlaying(false);
        notify(navigator.onLine ? "This mix couldn’t be loaded. Try again." : OFFLINE_MESSAGE);
      },
    };
    for (const [event, listener] of Object.entries(listeners)) {
      audio.addEventListener(event, listener);
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        persist();
        return;
      }
      if (shouldResume(interruptedAtRef.current, Date.now())) startPlayback(audio);
      interruptedAtRef.current = null;
    };
    window.addEventListener("pagehide", persist);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => startPlayback(audio)],
      ["pause", () => pauseForListener(audio)],
      ["seekbackward", ({ seekOffset }) => seekBy(-(seekOffset || SKIP_BACK_S))],
      ["seekforward", ({ seekOffset }) => seekBy(seekOffset || SKIP_FORWARD_S)],
      ["seekto", ({ seekTime }) => seekTime != null && seekTo(seekTime)],
      ["nexttrack", next],
      ["previoustrack", previous],
    ];
    const setHandlers = (clear: boolean) => {
      if (!("mediaSession" in navigator)) return;
      for (const [action, handler] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, clear ? null : handler);
        } catch {}
      }
    };
    setHandlers(false);

    return () => {
      setHandlers(true);
      for (const [event, listener] of Object.entries(listeners)) {
        audio.removeEventListener(event, listener);
      }
      window.removeEventListener("pagehide", persist);
      audio.removeEventListener("webkitplaybacktargetavailabilitychanged", onTargets);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      audio.pause();
      audio.removeAttribute("src");
    };
  }, [persist, next, previous, seekBy, seekTo, notify, pauseForListener]);

  // Picks a failed mix back up when the connection returns, playing it if it was playing.
  useEffect(() => {
    const audio = audioRef.current;
    if (!online || !audio?.error) return;
    if (resumeOnReconnectRef.current) startPlayback(audio);
    else audio.load();
    resumeOnReconnectRef.current = false;
  }, [online]);

  useEffect(() => {
    if (!current || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: "door.link",
      album: `door ${current.number}`,
      artwork: current.artworkUrl
        ? [{ src: current.artworkUrl, sizes: "512x512", type: "image/jpeg" }]
        : FALLBACK_ARTWORK,
    });
  }, [current]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  const value = useMemo(
    () => ({
      current,
      isPlaying,
      isBuffering,
      play,
      toggle,
      seekBy,
      seekTo,
      next,
      previous,
      airplayAvailable,
      showAirPlay,
      canSetVolume,
      volume,
      setVolume,
    }),
    [
      current,
      isPlaying,
      isBuffering,
      play,
      toggle,
      seekBy,
      seekTo,
      next,
      previous,
      airplayAvailable,
      showAirPlay,
      canSetVolume,
      volume,
      setVolume,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      <PlayerTimeContext.Provider value={time}>{children}</PlayerTimeContext.Provider>
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const player = useContext(PlayerContext);
  if (!player) throw new Error("usePlayer must be used inside PlayerProvider");
  return player;
}

export const usePlayerTime = () => useContext(PlayerTimeContext);
