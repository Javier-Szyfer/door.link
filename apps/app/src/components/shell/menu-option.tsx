import { Check } from "lucide-react";
import type { ReactNode } from "react";

type MenuOptionProps = { selected: boolean; onSelect: () => void; children: ReactNode };

// A popover menu choice, with a check when it's the current one.
export function MenuOption({ selected, onSelect, children }: MenuOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between border-b border-separator px-4 py-3 text-left text-[15px] last:border-0 active:bg-fill"
    >
      {children}
      {selected && <Check size={18} />}
    </button>
  );
}
