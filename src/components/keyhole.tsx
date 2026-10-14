import Image from "next/image";
import Link from "next/link";

// Both logos are rendered and CSS picks one: the theme is unknown on the server,
// so choosing in JS would hydrate with the wrong logo.
const Keyhole = () => {
  return (
    <Link href="/">
      <Image
        src="/logoblack.svg"
        alt="Keyhole logo"
        width={20}
        height={28}
        draggable={false}
        className="dark:hidden"
      />
      <Image
        src="/logowhite.svg"
        alt="Keyhole logo"
        width={20}
        height={28}
        draggable={false}
        className="hidden dark:block"
      />
    </Link>
  );
};

export default Keyhole;
