"use client";
import "../styles/globals.css";

import { useContext, useEffect, useState } from "react";
import { TrackContext } from "../context/trackContext";

//Components
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
    <>
      {selectedTrack && <Player />}
      {tracks?.map((track) => (
        <Playlist track={track} key={track.id} />
      ))}
    </>
  );
}
