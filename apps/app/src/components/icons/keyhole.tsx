// The door.link keyhole, filled with the current text color.
export function Keyhole({ size = 22 }: { size?: number }) {
  return (
    <svg width={(size * 43) / 66} height={size} viewBox="0 0 43 66" aria-hidden="true">
      <path
        fill="currentColor"
        d="M39.5 62.1c-.2.3-.5.5-.8.7-.3.2-.7.2-1 .2H5.4c-.4 0-.7-.1-1-.2-.3-.2-.6-.4-.8-.7-.2-.3-.4-.6-.5-.9-.1-.3-.1-.7 0-1.1l7.4-29.2C8.8 29.4 7.5 27.6 6.7 25.6c-.9-2-1.3-4.2-1.3-6.4 0-4.3 1.7-8.4 4.7-11.4C13.1 4.7 17.2 3 21.5 3s8.4 1.7 11.4 4.7c3 3 4.7 7.1 4.7 11.4 0 2.2-.4 4.4-1.3 6.4-.9 2-2.2 3.8-3.8 5.3l7.4 29.2c.1.3.1.7 0 1.1-.1.4-.2.7-.4 1z"
      />
    </svg>
  );
}
