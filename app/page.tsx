import "./styles/globals.css";
import { MixtapeListItem } from "./components/ui/MixtapeListItem";
import { getMixtapes } from "./lib/getAllMixtapes";
import Player from "./components/ui/Player";

const Page = async () => {
  const mixtapesData: Promise<any[]> = getMixtapes();
  const mixtapes = await mixtapesData;

  const tracks =
    mixtapes &&
    mixtapes.map((track: any) => {
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

  if (!tracks) return null;
  return (
    <>
      {tracks.map((track) => (
        <MixtapeListItem track={track} key={track.id} />
      ))}
      <Player />
    </>
  );
};

export default Page;
