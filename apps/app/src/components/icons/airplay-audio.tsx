// The AirPlay audio glyph: concentric arcs over a triangle.
export function AirPlayAudio({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6.3 16.5a8 8 0 1 1 11.4 0" />
      <path d="M8.8 13.9a4.5 4.5 0 1 1 6.4 0" />
      <path d="M12 15.5 8 21h8z" fill="currentColor" stroke="none" />
    </svg>
  );
}
