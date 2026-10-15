"use client";

import { SITE_URL } from "@/constants/urls";
import { toTrack, useAudio } from "@/contexts/audio-context";
import type { Database } from "@/types/database.types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { CopyLinkButton } from "./copy-link";
import { ExpandedDialog } from "./expanded-dialog";

export const MixtapeItem = ({
  mixtape,
  allMixtapes,
}: {
  mixtape: Database["public"]["Tables"]["mixtapes"]["Row"];
  allMixtapes: Database["public"]["Tables"]["mixtapes"]["Row"][];
}) => {
  const { id, number, title, duration, artwork_uri, description } = mixtape;
  const { isPlaying, currentTrack, togglePlay, playTrack } = useAudio();

  const isCurrent = currentTrack?.id === id;

  const handlePlayClick = () => {
    if (isCurrent) return togglePlay();

    // Continuous playback carries on down the list from here.
    const index = allMixtapes.findIndex((m) => m.id === id);
    playTrack(toTrack(mixtape), allMixtapes.slice(index + 1).map(toTrack));
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={id.toString()}>
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
                  {isCurrent && isPlaying ? "Pause" : "Play"}
                </Button>
                <span className="mx-2">|</span>
                <CopyLinkButton url={`${SITE_URL}/mixtapes/${number}`} />
              </div>
              <p>{description}</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
