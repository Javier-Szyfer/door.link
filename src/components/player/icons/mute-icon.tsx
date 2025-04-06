import type { SVGProps } from "react";

interface MuteIconProps extends SVGProps<SVGSVGElement> {
	size?: number;
	title?: string;
}

export function MuteIcon({
	size = 24,
	className = "",
	title = "Mute",
	...props
}: MuteIconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			color="currentColor"
			strokeWidth="1.5"
			{...props}
		>
			<title>{title}</title>
			<path
				d="M8.6 15H6.6C6.26863 15 6 14.7314 6 14.4V9.6C6 9.26863 6.26863 9 6.6 9H8.6C8.80979 9 9.01124 8.92678 9.16667 8.79667L12.8333 5.79667C13.2233 5.47559 13.8 5.74825 13.8 6.24667V17.7533C13.8 18.2518 13.2233 18.5244 12.8333 18.2033L9.16667 15.2033C9.01124 15.0732 8.80979 15 8.6 15Z"
				fill="currentColor"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M16.5 9.5L18.5 11.5M18.5 11.5L20.5 13.5M18.5 11.5L20.5 9.5M18.5 11.5L16.5 13.5"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
