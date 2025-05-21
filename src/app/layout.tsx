import "./globals.css";
import { ThemeProvider } from "next-themes";
import { GoogleTagManager } from "@next/third-parties/google";

// COMPONENTS
import { Toaster } from "@/components/ui/sonner";
import { Player } from "@/components/player/player";
import { BlueHeartIcon } from "@/components/BlueHeartIcon";

// CONTEXT
import { AudioProvider } from "@/contexts/AudioContext";

// CONSTANTS
import {
	SITE_NAME,
	SITE_DESCRIPTION,
	SITE_ICONS,
	OG_IMAGE,
} from "@/constants/metadata";
import { PROD_URL } from "@/constants/urls";

export const metadata = {
	title: SITE_NAME,
	description: SITE_DESCRIPTION,
	icons: SITE_ICONS,
	openGraph: {
		url: PROD_URL,
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		images: OG_IMAGE,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<GoogleTagManager gtmId="GTM-4BZFL0TX5S" />
			<body>
				<div className="mx-auto max-w-7xl pb-10 text-sm">
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem={false}
						disableTransitionOnChange
					>
						<AudioProvider>
							{children}
							<Player />
							<Toaster
								icons={{
									loading: <BlueHeartIcon />,
								}}
							/>
						</AudioProvider>
					</ThemeProvider>
				</div>
			</body>
		</html>
	);
}
