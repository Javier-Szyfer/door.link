import Image from "next/image";
import Link from "next/link";

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
