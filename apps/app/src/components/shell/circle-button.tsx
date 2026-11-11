import type { ButtonHTMLAttributes } from "react";

// A round glass button for top-bar actions.
export function CircleButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`glass flex size-11 items-center justify-center rounded-full shadow-glass-small active:scale-90 ${className}`}
    />
  );
}
