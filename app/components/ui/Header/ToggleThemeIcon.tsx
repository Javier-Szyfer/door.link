"use client";
import Image from "next/image";
// HOOKS
import { useContext } from "react";
import { useTheme } from "next-themes";
// CONTEXT
import { TrackContext } from "@/context/trackContext";

export const ToggleThemeIcon = () => {
  const { selectedTrack } = useContext(TrackContext);
  const { theme, setTheme } = useTheme();
  console.log(theme);

  return (
    <button>
      {!selectedTrack && (
        <Image
          src={theme === "dark" ? "/logowhite.svg" : "/logoblack.svg"}
          className="cursor-pointer p-[3px]"
          width={16}
          height={16}
          alt="door.link-logo"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      )}
    </button>
  );
};
