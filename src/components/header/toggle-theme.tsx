"use client";
import Image from "next/image";
import { useTheme } from "next-themes";

export const ToggleThemeIcon = () => {
  const { resolvedTheme, setTheme } = useTheme();

  // The logo is picked in CSS: the theme is unknown on the server.
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="cursor-pointer"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Image src="/logoblack.svg" width={16} height={16} alt="" className="p-[3px] dark:hidden" />
      <Image
        src="/logowhite.svg"
        width={16}
        height={16}
        alt=""
        className="hidden p-[3px] dark:block"
      />
    </button>
  );
};
