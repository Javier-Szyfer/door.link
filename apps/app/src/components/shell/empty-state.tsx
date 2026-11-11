import type { LucideIcon } from "lucide-react";

type EmptyStateProps = { icon: LucideIcon; title: string; hint: string };

// The message a list shows when it has nothing in it.
export function EmptyState({ icon: Icon, title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-10 pt-24 text-center text-muted">
      <Icon size={44} strokeWidth={1.5} />
      <p className="pt-3 text-[15px] font-semibold text-fg">{title}</p>
      <p className="pt-1 text-[13px]">{hint}</p>
    </div>
  );
}
