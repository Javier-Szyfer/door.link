"use client";

import { ListFilter } from "lucide-react";
import { type ReactNode, useState } from "react";
import { CircleButton } from "@/components/shell/circle-button";
import { MenuOption } from "@/components/shell/menu-option";
import { PopoverMenu } from "@/components/shell/popover-menu";
import { SORT_LABELS, SORT_ORDERS, type SortOrder } from "@/lib/sort";

type SortMenuProps = {
  order: SortOrder;
  onChoose: (order: SortOrder) => void;
  extra?: (close: () => void) => ReactNode;
};

// The sort button of a screen and its menu, which can hold extra choices below the orders.
export function SortMenu({ order, onChoose, extra }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="relative">
      <CircleButton aria-label="Sort" onClick={() => setOpen((value) => !value)}>
        <ListFilter size={20} strokeWidth={2.2} />
      </CircleButton>
      <PopoverMenu open={open} onClose={close} className="w-56">
        {SORT_ORDERS.map((value) => (
          <MenuOption
            key={value}
            selected={order === value}
            onSelect={() => {
              onChoose(value);
              close();
            }}
          >
            {SORT_LABELS[value]}
          </MenuOption>
        ))}
        {extra?.(close)}
      </PopoverMenu>
    </div>
  );
}
