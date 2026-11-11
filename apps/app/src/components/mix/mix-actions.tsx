import type { Mix } from "@/lib/mix";
import { MixMenu } from "./mix-menu";
import { SaveButton } from "./save-button";

// The star and "…" menu at the end of a list row.
export function MixActions({ mix }: { mix: Mix }) {
  return (
    <>
      <SaveButton number={mix.number} size={20} />
      <MixMenu mix={mix} />
    </>
  );
}
