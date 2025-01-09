// COMPONENTS
import { Header } from "@/components/header/header";
import { Nav } from "@/components/nav";
import { MixtapeItem } from "@/components/mixtape-item/mixtape-item";

// ACTIONS
import { getPublishedMixtapes } from "@/actions/mixtapes";

export default async function Home() {
	const { mixtapes, error } = await getPublishedMixtapes();

	if (error) return <p>Error fetching mixtapes :/</p>;

	return (
		<main>
			<Header />
			<Nav />
			<div className="border-t border-gray-200">
				{mixtapes?.map((mixtape) => (
					<MixtapeItem key={mixtape.id} mixtape={mixtape} />
				))}
			</div>
		</main>
	);
}
