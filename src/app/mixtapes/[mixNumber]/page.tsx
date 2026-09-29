import { getMixtapeByMixNumber } from "@/actions/mixtapes";
import Keyhole from "@/components/keyhole";
import { Player } from "@/components/player/player";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_ICONS } from "@/constants/metadata";
import { PROD_URL } from "@/constants/urls";
import type { Database } from "@/types/database.types";
import Image from "next/image";

type ParamsType = Promise<{ mixNumber: string }>;

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
        draggable={false}
      />
      <h1 className="mt-24 text-base text-[#414141] dark:text-[#f1f1f1]">{mixtape.title}</h1>
      <p className="mt-4 text-center text-base text-[#414141] dark:text-[#f1f1f1]">
        {mixtape.description}
      </p>
      <Player mixtape={mixtape} />
    </div>
  );
}
