// COMPONENTS
import Keyhole from "../components/keyhole";
import Image from "next/image";
import { Player } from "@/components/player/player";

// ACTIONS
import { getMixtapeByMixNumber } from "@/actions/mixtapes";

// TYPES
import type { Database } from "@/types/database.types";

type ParamsType = Promise<{ mixNumber: string }>;
export default async function MixPage(props: {
	params: ParamsType;
}) {
	const { mixNumber } = await props.params;
	const { mixtape, error } = (await getMixtapeByMixNumber(mixNumber)) as {
		mixtape: Database["public"]["Tables"]["mixtapes"]["Row"] | null;
		error: Error | null;
	};

	if (error)
		return (
			<p>
				Error fetching mixtape {mixNumber}, error: {error.message}
			</p>
		);
	if (!mixtape) return <p>Mixtape not found</p>;

	return (
		<div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-8 py-24">
			<Keyhole />
			<Image
				src={mixtape.artwork_uri}
				alt={mixtape.title}
				width={250}
				height={250}
				className="mt-32"
				priority
			/>
			<h1 className="mt-24 text-base">{mixtape.title}</h1>
			<p className="mt-4 text-center text-base">{mixtape.description}</p>
			<Player mixtape={mixtape} />
		</div>
	);
}
