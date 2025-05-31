import Link from "next/link";

export const Nav = () => {
  return (
    <div className="flex space-x-3 px-4 py-6 text-[#1500FF] dark:text-[#84858C] lg:py-9">
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
  );
};
