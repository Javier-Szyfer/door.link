type EmptyStateProps = { title: string; hint: string };

// The message a list shows when it has nothing in it.
export function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-10 pt-24 text-center text-muted">
      <p className="text-[15px] font-semibold text-fg">{title}</p>
      <p className="pt-1 text-[13px]">{hint}</p>
    </div>
  );
}
