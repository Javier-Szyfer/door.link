import "../../styles/globals.css";

import { getMixtapes } from "@/lib/getAllMixtapes";
import { UI } from "./UI";

const MixPage = async () => {
  const mixtapesData: Promise<any[]> = getMixtapes();
  const allMixtapes = await mixtapesData;

  const mixtapesFormatted =
    allMixtapes &&
    allMixtapes.map((track: any) => {
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
      <UI mixtapes={mixtapesFormatted} />
    </>
  );
};

export default MixPage;
