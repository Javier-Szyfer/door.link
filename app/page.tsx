"use client";

import { useContext, useEffect, useState } from "react";
import { TrackContext } from "../context/trackContext";

//Components
import Header from "./components/header";
import Playlist from "./components/playlist";
import Player from "./components/player";

import { getPlaylist } from "../api/playlist";

async function allMixtapes() {
  const allMixtapes = await getPlaylist();
  return allMixtapes;
}
export default function Home() {
  const { selectedTrack } = useContext(TrackContext);
  const [playlists, setPlaylists] = useState<any[]>();
  console.log(playlists);
  useEffect(() => {
    allMixtapes().then((data) => {
      return setPlaylists(data);
    });
  }, []);

  const tracks =
    playlists &&
    playlists.map((track: any) => {
      return {
        id: track.id,
        title: track.Title,
        url: track.audio.url,
        duration: track.duration,
        number: track.number,
        description: track.Description,
        image: track.artwork.url,
      };
    });

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-[#121212] pb-10">
      <Header />
      {selectedTrack && <Player />}

      {tracks?.map((track) => (
        <Playlist track={track} key={track.id} />
      ))}
    </div>
  );
}
