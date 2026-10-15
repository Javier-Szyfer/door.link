"use client";

import { DownloadIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getDownloadUrl } from "@/constants/media-hosts";
import { useAudio } from "@/contexts/audio-context";

import { MuteIcon } from "./icons/mute-icon";
import { PauseIcon } from "./icons/pause-icon";
import { PlayIcon } from "./icons/play-icon";
import { VolumeIcon } from "./icons/volume-icon";

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
    isLoading,
  } = useAudio();

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

  const handleDownload = () => {
    if (!audioSrc || !currentMixtape) return;

    const filename = `${currentMixtape.number}-${currentMixtape.title}.mp3`;

    // Let the browser own the transfer: it streams to disk, survives a tab
    // change and can resume. Reading the response into a Blob first meant
    // holding a ~100MB file in memory before anything was written.
    const link = document.createElement("a");
    link.href = getDownloadUrl(audioSrc, filename);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success(`Downloading ${currentMixtape.title}`);
  };

  if (!audioSrc) return null;

  const baseIconStyles = "h-5 w-5";

  return (
    <div className="fixed bottom-0 z-40 h-20 w-screen border-t border-stone-300 bg-white p-4 dark:bg-[#121212] lg:bottom-[1rem] lg:left-[50%] lg:h-[88px] lg:w-1/2 lg:translate-x-[-50%] lg:border">
      <div className="mx-auto flex max-w-7xl flex-col gap-2">
        <div className="px-2 text-xs text-[#414141] dark:text-[#f1f1f1]">
          {currentMixtape?.number} - {currentMixtape?.title}
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            className="h-8 w-8 shrink-0"
            size="icon"
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-foreground" />
            ) : isPlaying ? (
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
            <Button size="icon" className="h-8 w-8 shrink-0" onClick={toggleMute}>
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
            >
              <DownloadIcon className={baseIconStyles} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
