import "../../styles/globals.css";

import { Content } from "./Content";

import { Metadata } from "next";

type Props = {
  params: { mixN: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mixN } = params;

  return {
    title: `${mixN} | door.link`,
    twitter: {
      title: `${mixN} | door.link`,
    },
  };
}

const MixPage = async () => {
  return <Content />;
};

export default MixPage;
