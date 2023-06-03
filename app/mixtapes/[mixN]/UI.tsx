"use client";

import Image from "next/image";
import Link from "next/link";
// components
import Player from "@/components/ui/Player";
// context
import { TrackContext } from "Providers";
// hooks
import { useContext, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
// icons
import { FiPlay } from "react-icons/fi";

export const UI = ({ mixtapes }) => {
  const { theme } = useTheme();
  const { selectedTrack, setSelectedTrack } = useContext(TrackContext);

  const pathname = usePathname();
  const mixNumber = pathname && pathname.split("/")[2];

  const mix = mixtapes.find((t: { number: string }) => t.number === mixNumber);

  useEffect(() => {
    if (mix) setSelectedTrack(mix);
  }, [mix]);

  if (!mix) return null;

  return (
    <>
      <Link href={"/"} passHref>
        <div
          className="cursor-pointer mt-12"
          onClick={() => setSelectedTrack(null)}
        >
          <Image
            src={theme === "dark" ? "/logowhite.svg" : "/logoblack.svg"}
            className="cursor-pointer p-[3px]"
            width={20}
            height={28}
            alt="door.link-logo"
          />
        </div>
      </Link>
      <div className="mt-16"></div>
      <Image src={mix.image} alt={mix.title} width={250} height={250} />
      <div className="flex flex-col justify-center items-center">
        <div className="flex items-center">
          {!selectedTrack && (
            <FiPlay
              onClick={() => {
                setSelectedTrack(mix);
              }}
              className="hover:text-[#1500FF] mr-2 cursor-pointer"
            />
          )}
          <h1 className="">{mix.title}</h1>
        </div>
        <p className="text-center mt-4 pb-12">{mix.description}</p>
      </div>
      {selectedTrack && <Player />}
    </>
  );
};
