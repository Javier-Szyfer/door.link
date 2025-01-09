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

	return <div>{mixtape.title}</div>;
}
