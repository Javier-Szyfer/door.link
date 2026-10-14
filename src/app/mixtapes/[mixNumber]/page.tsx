import Image from "next/image";
import { notFound } from "next/navigation";
import Keyhole from "@/components/keyhole";
import { LoadMixtape } from "@/components/player/load-mixtape";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_ICONS } from "@/constants/metadata";
import { PROD_URL } from "@/constants/urls";
import { getMixtapeByMixNumber, getPublishedMixtapes } from "@/lib/mixtapes";

type ParamsType = Promise<{ mixNumber: string }>;

// Mixtapes change rarely; serve from cache and refresh in the background.
export const revalidate = 300;

// Prerender every published mixtape so the page is served from cache instead of
// querying Supabase per visit.
export const generateStaticParams = async () => {
  const { mixtapes } = await getPublishedMixtapes();
  return mixtapes?.map(({ number }) => ({ mixNumber: number })) ?? [];
};

export const generateMetadata = async ({ params }: { params: ParamsType }) => {
  const { mixNumber } = await params;
  return {
    title: `${mixNumber} | door.link`,
    description: SITE_DESCRIPTION,
    icons: SITE_ICONS,
    openGraph: {
      title: `${mixNumber} | door.link`,
      description: SITE_DESCRIPTION,
      images: OG_IMAGE,
      url: `${PROD_URL}/mixtapes/${mixNumber}`,
    },
  };
};

export default async function MixPage(props: { params: ParamsType }) {
  const { mixNumber } = await props.params;
  const { mixtape, error } = await getMixtapeByMixNumber(mixNumber);

  // Thrown rather than rendered so a failed revalidation keeps serving the
  // cached page instead of caching the error.
  if (error) throw error;
  if (!mixtape) notFound();

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
        draggable={false}
      />
      <h1 className="mt-24 text-base text-[#414141] dark:text-[#f1f1f1]">{mixtape.title}</h1>
      <p className="mt-4 text-center text-base text-[#414141] dark:text-[#f1f1f1]">
        {mixtape.description}
      </p>
      <LoadMixtape mixtape={mixtape} />
    </div>
  );
}
