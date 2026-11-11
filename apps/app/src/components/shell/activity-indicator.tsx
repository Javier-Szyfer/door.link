const SPOKES = 8;

type ActivityIndicatorProps = { progress?: number; spinning?: boolean; size?: number };

// The iOS spinner: spokes appear with the pull progress and rotate while spinning.
export function ActivityIndicator({
  progress = 1,
  spinning = false,
  size = 26,
}: ActivityIndicatorProps) {
  const visible = spinning ? SPOKES : Math.ceil(progress * SPOKES);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      aria-hidden="true"
      className={`text-muted ${spinning ? "animate-[ios-spin_0.8s_steps(8)_infinite]" : ""}`}
    >
      {Array.from({ length: SPOKES }, (_, i) => (
        <rect
          // biome-ignore lint/suspicious/noArrayIndexKey: spokes are fixed positions
          key={i}
          x={11.75}
          y={2}
          width={2.5}
          height={7}
          rx={1.25}
          fill="currentColor"
          opacity={i < visible ? (spinning ? (i + 1) / SPOKES : 1) : 0}
          transform={`rotate(${i * (360 / SPOKES)} 13 13)`}
        />
      ))}
    </svg>
  );
}
