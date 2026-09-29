"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Keyhole = () => {
  const { theme } = useTheme();
  return (
    <Link href="/">
      <Image
        src={theme === "dark" ? "/logowhite.svg" : "/logoblack.svg"}
        alt="Keyhole logo"
        width={20}
        height={28}
        draggable={false}
      />
    </Link>
  );
};

export default Keyhole;
