import type { ReactNode } from "react";

// The small heading above a section of a screen.
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="px-4 pb-2 text-[13px] font-medium text-muted">{children}</h2>;
}
