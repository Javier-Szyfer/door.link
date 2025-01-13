"use client";

// COMPONENTS
import Image from "next/image";
import Link from "next/link";

// HOOKS
import { useTheme } from "next-themes";

const Keyhole = () => {
	const { theme } = useTheme();
	return (
		<Link href="/">
			<Image
				src={theme === "dark" ? "/logowhite.svg" : "/logoblack.svg"}
				alt="Keyhole logo"
				width={20}
				height={28}
			/>
		</Link>
	);
};

export default Keyhole;
