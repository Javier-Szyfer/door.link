import { useContext, useEffect } from "react";
import { TrackContext } from "../context/trackContext";

//Components
import Header from "../components/header";
import Playlist from "../components/playlist";
import Player from "../components/player";

//Playlist object
import { getPlaylist } from "./api/playlist";

export default function Home({ playlists }) {
  const { selectedTrack, setSelectedTrack } = useContext(TrackContext);

  const tracks = playlists.map((track) => {
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

  useEffect(() => {
    const lastPlayedTrackInfo = localStorage.getItem('lastPlayedTrackInfo')

    if (lastPlayedTrackInfo) {
      const { currentTime, id } = JSON.parse(lastPlayedTrackInfo)
      const targetTrack = tracks.find((track) => track.id === id)
      setSelectedTrack({
        ...targetTrack,
        url: `${targetTrack.url}#t=${Math.round(currentTime)}`
      })
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-[#121212] pb-10">
      <Header />
      {selectedTrack && <Player />}

      {tracks.map((track) => (
        <Playlist track={track} key={track.id} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const data = await getPlaylist();
  return {
    props: {
      playlists: data,
    },
    revalidate: 3600,
  };
}
