"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

type PopoverMenuProps = {
  open: boolean;
  onClose: () => void;
  upward?: boolean;
  className?: string;
  children: ReactNode;
};

const ENTER = { type: "spring", stiffness: 520, damping: 34 } as const;
const EXIT = { duration: 0.14, ease: "easeOut" } as const;

// A floating menu that grows out of its button and shrinks back into it, like iOS.
export function PopoverMenu({
  open,
  onClose,
  upward = false,
  className = "",
  children,
}: PopoverMenuProps) {
  return (
    <MotionConfig reducedMotion="user">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 cursor-default"
          onClick={onClose}
        />
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1, transition: ENTER }}
            exit={{ opacity: 0, scale: 0.8, transition: EXIT }}
            style={{ transformOrigin: upward ? "bottom right" : "top right" }}
            className={`glass absolute right-0 z-40 overflow-hidden rounded-2xl shadow-glass-large ${
              upward ? "bottom-full mb-1" : "top-full mt-1"
            } ${className}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
