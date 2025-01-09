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

// TYPES
import type { Database } from "@/types/database.types";

export const MixtapeItem = ({
	mixtape,
}: {
	mixtape: Database["public"]["Tables"]["mixtapes"]["Row"];
}) => {
	const { number, title, duration, artwork_uri, description } = mixtape;
	const URL = `${baseUrl}/mix/${number}`;

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
									className="hover:text-[#1500FF]"
								>
									Play
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
