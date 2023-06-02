import Link from "next/link";

export const Nav = () => {
  return (
    <div className="py-6 lg:py-9 flex space-x-3 text-[#1500FF] dark:text-[#84858C] px-4">
      <Link href={"/subscribers"}>Subscribe</Link>
      <a target="_blank" rel="noopener noreferrer" href="/rss.xml">
        <h2>RSS</h2>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://urbit.org/groups/~natnex-ronret/door-link"
      >
        <h2>Urbit</h2>
      </a>
      <Link href="mailto:contact@door.link">
        <h2>Contact</h2>
      </Link>
    </div>
  );
};
