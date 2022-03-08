import { useContext, useEffect } from "react";
import { TrackContext } from "../../context/trackContext";

import Image from "next/image";
import Link from "next/link";
import { getPlaylist } from "../api/playlist";
import { useTheme } from "next-themes";

import Player from "../../components/player";

export default function MixNum({ mix }) {
  const { selectedTrack, setSelectedTrack } = useContext(TrackContext);
  const { theme } = useTheme();

  const m = {
    id: mix.id,
    title: mix.Title,
    url: mix.audio.url,
    duration: mix.duration,
    number: mix.number,
    description: mix.Description,
    image: mix.artwork.url,
  };

  useEffect(() => {
    setSelectedTrack(m);
  }, []);

  return (
    <div className="bg-white dark:bg-[#121212] text-[#444444] dark:text-[#f1f1f1] px-8 min-h-screen max-w-3xl flex flex-col space-y-4 mx-auto justify-evenly pb-20  items-center overflow-y-auto">
      <Link href={"/"} passHref>
        <div
          className="cursor-pointer mt-12"
          onClick={() => setSelectedTrack(null)}
        >
          <Image
            src={theme === "dark" ? "/logowhite.svg" : "/logoblack.svg"}
            className="cursor-pointer p-[3px]"
            width="20px"
            height="28.55px"
            alt="door.link-logo"
          />
        </div>
      </Link>
      <div className="mt-16"></div>
      <Image
        src={m.image}
        alt={m.title}
        layout="fixed"
        objectFit="cover"
        width={250}
        height={250}
        priority
      />
      <div className="flex flex-col justify-center items-center ">
        <h1 className="">{m.title}</h1>
        <p className="text-center mt-4 pb-12">{m.description}</p>
      </div>
      {selectedTrack && <Player />}
    </div>
  );
}

export async function getStaticPaths() {
  const data = await getPlaylist();

  const paths = data.map((track) => {
    return {
      params: { mixN: track.number.toString() },
    };
  });
  return {
    paths,
    fallback: blocking,
  };
}

export async function getStaticProps(context) {
  const mixN = context.params.mixN;
  const data = await getPlaylist();
  const mix = data.filter((x) => x.number.toString() === mixN);

  return {
    props: {
      mix: mix[0],
    },
  };
}
