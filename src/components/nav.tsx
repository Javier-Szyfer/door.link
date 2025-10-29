import Link from "next/link";
import { PlaybackModeToggle } from "./playback-toggle";

export const Nav = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-6 text-[#1500FF] dark:text-[#84858C] lg:py-9">
      <div className="flex items-center gap-3">
        <a target="_blank" rel="noopener noreferrer" href="/rss.xml">
          <h2>RSS</h2>
        </a>
        <Link href="https://shop.door.link" target="_blank" rel="noopener noreferrer">
          Shop
        </Link>
        <Link href="mailto:contact@door.link">
          <h2>Contact</h2>
        </Link>
      </div>
      <PlaybackModeToggle />
    </div>
  );
};
