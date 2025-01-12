"use client";

// COMPONENTS
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "../ui/accordion";
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
}: {
	mixtape: Database["public"]["Tables"]["mixtapes"]["Row"];
}) => {
	const { id, number, title, duration, artwork_uri, description, audio_uri } =
		mixtape;
	const URL = `${baseUrl}/mix/${number}`;
	const { isPlaying, currentMixtape, togglePlay, setAudioSrc } = useAudio();

	const isCurrentlyPlaying = isPlaying && currentMixtape?.id === id.toString();

	const handlePlayClick = () => {
		if (currentMixtape?.id === id.toString()) {
			togglePlay();
		} else {
			setAudioSrc(audio_uri, { number, title, id: id.toString() });
		}
	};

	return (
		<Accordion type="single" collapsible>
			<AccordionItem value={mixtape.id.toString()}>
				<AccordionTrigger className="px-4 text-left">
					<div className="grid w-full grid-cols-12 items-center">
						<div className="col-span-12 md:col-span-2">{number}</div>
						<div className="col-span-12 md:col-span-7">{title}</div>
						<div className="col-span-12 md:col-span-2">{duration}</div>
					</div>
				</AccordionTrigger>
				<AccordionContent className="px-4">
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
