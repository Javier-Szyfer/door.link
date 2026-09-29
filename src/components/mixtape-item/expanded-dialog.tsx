"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const ExpandedDialog = ({ artwork_uri }: { artwork_uri: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={artwork_uri}
          alt="Mixtape cover art"
          width={100}
          height={100}
          className="cursor-pointer select-none hover:opacity-80"
          draggable={false}
          unoptimized
        />
      </DialogTrigger>
      <DialogContent className="place-items-center">
        <DialogTitle className="sr-only">Expanded cover art</DialogTitle>
        <div className="h-72 w-72 md:h-[512px] md:w-[512px]">
          <Image
            src={artwork_uri}
            alt="Mixtape cover art"
            width={1000}
            height={1000}
            className="select-none"
            unoptimized
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
