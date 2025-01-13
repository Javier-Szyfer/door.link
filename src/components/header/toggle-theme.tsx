"use client";
import Image from "next/image";
// HOOKS
import { useTheme } from "next-themes";

export const ToggleThemeIcon = () => {
	const { theme, setTheme } = useTheme();

	return (
		<button type="button">
			<Image
				src={theme === "dark" ? "/logowhite.svg" : "/logoblack.svg"}
				className="cursor-pointer p-[3px]"
				width={16}
				height={16}
				alt="Keyhole logo"
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			/>
		</button>
	);
};
