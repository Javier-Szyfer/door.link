type ProgressRingProps = { fraction: number; size?: number };

// A ring that fills while downloading.
export function ProgressRing({ fraction, size = 26 }: ProgressRingProps) {
  const circumference = 2 * Math.PI * 10;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="-rotate-90" aria-hidden="true">
      <circle cx={12} cy={12} r={10} fill="none" stroke="var(--separator)" strokeWidth={3} />
      <circle
        cx={12}
        cy={12}
        r={10}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - fraction)}
        strokeLinecap="round"
        className="transition-[stroke-dashoffset] duration-200"
      />
    </svg>
  );
}
