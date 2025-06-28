"use client";

// COMPONENTS
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { Button } from "../ui/button";
import { CopyLinkButton } from "./copy-link";
import { ExpandedDialog } from "./expanded-dialog";

// CONSTANTS
import { baseUrl } from "@/constants/urls";

// HOOKS
import { useAudio } from "@/contexts/AudioContext";

// TYPES
import type { Database } from "@/types/database.types";

export const MixtapeItem = ({
  mixtape,
  allMixtapes,
}: {
  mixtape: Database["public"]["Tables"]["mixtapes"]["Row"];
  allMixtapes: Database["public"]["Tables"]["mixtapes"]["Row"][];
}) => {
  const { id, number, title, duration, artwork_uri, description, audio_uri } = mixtape;
  const URL = `${baseUrl}/mixtapes/${number}`;
  const { isPlaying, currentMixtape, togglePlay, setAudioSrc } = useAudio();

  const isCurrentlyPlaying = isPlaying && currentMixtape?.id === id.toString();

  const handlePlayClick = () => {
    if (currentMixtape?.id === id.toString()) {
      togglePlay();
    } else {
      // Find current mixtape index
      const currentIndex = allMixtapes.findIndex((m) => m.id === id);

      // Create queue of all mixtapes after the current one, excluding the current one
      const remainingMixtapes = allMixtapes.slice(currentIndex + 1);
      const queue =
        remainingMixtapes.length > 0
          ? remainingMixtapes.map((m) => ({
              audio_uri: m.audio_uri,
              mixtapeInfo: {
                number: m.number,
                title: m.title,
                id: m.id.toString(),
                artwork_uri: m.artwork_uri,
              },
            }))
          : [];

      setAudioSrc(audio_uri, { number, title, id: id.toString(), artwork_uri }, queue, true);
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={mixtape.id.toString()}>
        <AccordionTrigger className="px-4 text-left text-[#414141] dark:text-[#f1f1f1]">
          <div className="grid w-full grid-cols-12 items-center">
            <div className="col-span-12 md:col-span-2">{number}</div>
            <div className="col-span-12 md:col-span-7">{title}</div>
            <div className="col-span-12 md:col-span-2">{duration}</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 text-[#414141] dark:text-[#f1f1f1]">
          <div className="grid w-full grid-cols-12 items-start py-4">
            <div className="col-span-12 md:col-span-2">
              <ExpandedDialog artwork_uri={artwork_uri} />
            </div>
            <div className="col-span-12 text-sm md:col-span-9">
              <div className="flex items-center py-2">
                <Button
                  type="button"
                  variant="text"
                  className="flex items-center gap-2 hover:text-[#1500FF]"
                  onClick={handlePlayClick}
                >
                  {isCurrentlyPlaying ? "Pause" : "Play"}
                </Button>
                <span className="mx-2">|</span>
                <CopyLinkButton url={URL} />
              </div>
              <p>{description}</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
