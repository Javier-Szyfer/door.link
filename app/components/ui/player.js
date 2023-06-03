"use client";

import { useContext, useEffect, useRef } from "react";
import { TrackContext } from "Providers";
import { useTheme } from "next-themes";
import { FiX } from "react-icons/fi";

// Plyr
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

export const Player = () => {
  const { selectedTrack, setSelectedTrack } = useContext(TrackContext);
  const { theme } = useTheme();

  const playerContainerRef = useRef(null);

  const audioSrc = {
    type: "audio",
    sources: [
      {
        src: selectedTrack && selectedTrack.url,
      },
    ],
  };

  const plyrOptions = {
    options: {
      controls: [
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings",
        "download",
      ],
      listeners: "true",
    },
  };

  useEffect(() => {
    if (playerContainerRef.current) {
      // Initiate the observer
      const observer = new MutationObserver(() => {
        // Locate the download button
        // Locate the download button
        const downloadButton = playerContainerRef.current.querySelector(
          'a[data-plyr="download"]'
        ); // Update its properties
        if (downloadButton) {
          downloadButton.href = selectedTrack && selectedTrack.url;
          downloadButton.download = selectedTrack && selectedTrack.title;
          downloadButton.target = "_blank";
        }
      });
      // Observe changes
      observer.observe(playerContainerRef.current, {
        childList: true,
        subtree: true,
      });

      // Disconnect observer on unmount
      return () => observer.disconnect();
    }
  }, [selectedTrack]);

  if (!selectedTrack) return null;

  return (
    <div
      ref={playerContainerRef}
      className="fixed bottom-0 z-40 w-screen h-20 border-t border-stone-300 lg:w-1/2
      lg:h-[88px] lg:bottom-[1rem] lg:left-[50%] lg:translate-x-[-50%] lg:border"
      style={{
        backgroundColor:
          theme === "dark" ? "rgb(20,20,20)" : "rgba(255, 255, 255, 0.95)",
      }}
    >
      <div className="flex items-center pt-[10px] px-[18px] justify-between">
        <div className="flex items-center">
          <span className="text-xs">{selectedTrack.number}</span>
          <span className="mx-1">-</span>
          <span className="text-xs">{selectedTrack.title}</span>
        </div>
        <FiX
          className="cursor-pointer"
          onClick={() => setSelectedTrack(null)}
        />
      </div>
      <Plyr
        {...plyrOptions}
        source={audioSrc}
        autoPlay
        href={selectedTrack.url}
        style={
          theme === "dark"
            ? {
                "--plyr-color-main": "#dddddd",
                "--plyr-audio-controls-background": "rgb(20,20,20)",
                "--plyr-audio-control-color": "#BBBBBB",
                "--plyr-audio-control-color-hover": "rgb(20,20,20)",
              }
            : {
                "--plyr-color-main": "blue",
                "--plyr-audio-controls-background": "rgba(255, 255, 255, 0.95)",
              }
        }
      ></Plyr>
    </div>
  );
};
