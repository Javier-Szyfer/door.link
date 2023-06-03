import "./styles/globals.css";
import { getMixtapes } from "@/lib/getAllMixtapes";
// components
import { MixtapeListItem } from "@/components/ui/MixtapeListItem";
import { Player } from "@/components/ui/Player";
import { Header } from "@/components/ui/Header/Header";
import { Nav } from "@/components/ui/Header/Nav";

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
    <main className="max-w-7xl mx-auto  pb-10 text-sm">
      <Header />
      <Nav />
      {tracks.map((track) => (
        <MixtapeListItem track={track} key={track.id} />
      ))}
      <Player />
    </main>
  );
};

export default Page;
