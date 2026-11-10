import { PlaybackModeToggle } from "./playback-toggle";

export const Nav = () => {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 px-4 py-6 text-[#1500FF] dark:text-[#84858C] lg:py-9">
      <div className="flex items-center gap-3">
        <a target="_blank" rel="noopener noreferrer" href="/rss.xml">
          RSS
        </a>
        <a href="https://shop.door.link" target="_blank" rel="noopener noreferrer">
          Shop
        </a>
        <a href="mailto:contact@door.link">Contact</a>
      </div>
      <PlaybackModeToggle />
    </nav>
  );
};
