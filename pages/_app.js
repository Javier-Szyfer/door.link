import { ThemeProvider } from "next-themes";
import { TrackProvider } from "../context/trackContext";
import "../styles/globals.css";

import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TrackProvider>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </TrackProvider>
    </ThemeProvider>
  );
}

export default MyApp;
