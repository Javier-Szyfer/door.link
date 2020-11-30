import { useEffect, useState } from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "../styles/globals.css";

import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

export function reportWebVitals(metric) {
  console.log(metric);
}

function MyApp({ Component, pageProps }) {
  const [dark, setDark] = useState(false);
  const darkTheme = () => setDark(!dark);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  //Making the Themes
  const lightt = createMuiTheme({
    palette: {
      primary: {
        main: "#0000FF",
      },
      secondary: {
        main: "#444444",
      },
      background: {
        default: "#ffffff",
      },
    },

    overrides: {
      MuiTypography: {
        body2: {
          fontSize: "14px",
          color: "#444444",
        },
        caption: {
          fontSize: "11px",
          color: "#444444",
        },
        h6: {
          fontSize: "14px",
          color: "#444444",
        },
      },
    },
  });
  const darkk = createMuiTheme({
    palette: {
      primary: {
        main: "#83858C",
      },
      secondary: {
        main: "#83858C",
      },
      background: {
        default: "#121212",
      },
    },

    overrides: {
      MuiTypography: {
        body2: {
          fontSize: "14px",
          color: "#f1f1f1",
        },
        caption: {
          fontSize: "11px",
          color: "#f1f1f1",
        },
        h6: {
          fontSize: "14px",
          color: "#f1f1f1",
        },
      },
    },
  });

  return (
    <>
      <DefaultSeo {...SEO} />
      <ThemeProvider theme={dark ? darkk : lightt}>
        <CssBaseline />
        <Component {...pageProps} darkTheme={darkTheme} dark={dark} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
