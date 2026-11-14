"use client";

import { AnimatePresence, motion } from "motion/react";
import { useNotice } from "@/lib/use-notice";
import { useChrome } from "./use-chrome";

// The look shared by every notice, matching the search bar.
export const noticeStyle =
  "glass mx-4 flex min-h-11 items-center justify-center rounded-full px-5 py-2 text-center text-[13px] font-medium shadow-glass";

// A short message above the bottom bar, or at the top of the player sheet while it's open.
export function Notice({ inSheet = false }: { inSheet?: boolean }) {
  const { notice } = useNotice();
  const { playerOpen } = useChrome();
  const shown = playerOpen === inSheet ? notice : null;

  return (
    <AnimatePresence>
      {shown && (
        <motion.p
          role="status"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          className={noticeStyle}
        >
          {shown}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
