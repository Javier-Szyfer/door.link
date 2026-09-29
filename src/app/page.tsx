import { Header } from "@/components/header/header";
import { MixtapeItem } from "@/components/mixtape-item/mixtape-item";
import { Nav } from "@/components/nav";
import { getPublishedMixtapes } from "@/lib/mixtapes";

// Mixtapes change rarely; serve from cache and refresh in the background.
export const revalidate = 300;

export default async function Home() {
  const { mixtapes, error } = await getPublishedMixtapes();

  if (error) return <p>Error fetching mixtapes :/</p>;

  return (
    <main>
      <Header />
      <Nav />
      <div className="border-t border-gray-200">
        {mixtapes?.map((mixtape) => (
          <MixtapeItem key={mixtape.id} mixtape={mixtape} allMixtapes={mixtapes} />
        ))}
      </div>
    </main>
  );
}
