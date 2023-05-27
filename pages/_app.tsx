import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { TrackProvider } from "../context/trackContext";
import "../styles/globals.css";

import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TrackProvider>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </TrackProvider>
    </ThemeProvider>
  );
};
export default MyApp;
