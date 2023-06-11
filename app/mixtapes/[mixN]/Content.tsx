"use client";

import Image from "next/image";
import Link from "next/link";
// lib
import { getMixtapeByNumber } from "@/lib/getMixtapeByNumber";
// components
import { Player } from "@/components/ui/Player";
// context
import { TrackContext } from "../../Providers";
// hooks
import { useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
// icons
import { FiPlay } from "react-icons/fi";

export const Content = () => {
  const { theme } = useTheme();
  const { selectedTrack, setSelectedTrack } = useContext(TrackContext);

  const [mix, setMix] = useState<any>(null);

  const pathname = usePathname();
  const mixNumber = pathname && pathname.split("/")[2];

  useEffect(() => {
    const fetchMix = async () => {
      const mixData = await getMixtapeByNumber(mixNumber as string);
      setMix(mixData[0]);
    };

    fetchMix();
  }, [mixNumber]);

  useEffect(() => {
    if (mix) setSelectedTrack({ ...mix, audioUrl: mix.audio.url });
  }, [mix]);

  if (!mix) return null;

  return (
    <>
      <Link href={"/"} passHref>
        <div
          className="cursor-pointer my-20"
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
      <Image src={mix.artwork.url} alt={mix.title} width={250} height={250} />
      <div className="flex flex-col justify-center items-center ">
        <div className="flex items-center mt-20">
          {!selectedTrack && (
            <FiPlay
              onClick={() => {
                setSelectedTrack({ ...mix, audioUrl: mix.audio.url });
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
