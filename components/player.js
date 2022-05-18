import { useContext } from "react";
import { TrackContext } from "../context/trackContext";

import { useTheme } from "next-themes";
import { FiX } from "react-icons/fi";

// Plyr
import Plyr from "plyr-react";
import "plyr-react/dist/plyr.css";

export default function Player() {
  const { selectedTrack, setSelectedTrack, player } = useContext(TrackContext);
  const { theme } = useTheme();
  const audioSrc = {
    type: "audio",
    sources: [
      {
        src: selectedTrack.url,
      },
    ],
  };

  return (
    <div
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
        source={audioSrc}
        autoPlay
        ref={player}
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
      />
    </div>
  );
}
Plyr.displayName = "Plyr";
Plyr.defaultProps = {
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
    // debug: "true",
    listeners: "true",
  },
};
