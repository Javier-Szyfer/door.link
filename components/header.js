import { useState } from "react";

//Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  boxWrapper: {
    display: "flex",
    padding: "0 16px",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "3rem",
    [theme.breakpoints.down("sm")]: {
      marginTop: "1.5rem",
    },
  },

  leftContainer: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  box: {
    marginTop: "3rem",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginTop: "1.5rem",
    },
  },
  boxLast: {
    margin: "3rem 0",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      margin: "1.5rem 0",
    },
  },

  light: {
    width: "14px",
    height: "14px",
    borderRadius: "14px",
    border: "1px solid #ffffff",
    backgroundColor: "transparent",
    cursor: "pointer",
  },

  dark: {
    width: "14px",
    height: "14px",
    borderRadius: "14px",
    border: "1px solid #333333",

    backgroundColor: "transparent",
    cursor: "pointer",
  },
}));

export default function Header({ darkTheme, dark, selectedTrack }) {
  const classes = useStyles();
  const [info, setInfo] = useState(true);
  const handleInfo = () => {
    setInfo(!info);
  };
  return (
    <Box className={classes.boxWrapper}>
      <Box className={classes.header}>
        <Typography
          variant="body2"
          style={{
            fontWeight: "bolder",
            paddingTop: "3px",
            paddingBottom: "3px",
          }}
        >
          [ door ]
        </Typography>
        {!selectedTrack && (
          <img
            src={dark ? "/logowhite.svg" : "/logoblack.svg"}
            style={{ cursor: "pointer", padding: "3px" }}
            width="16px"
            height="24.55px"
            alt="door.link logo"
            onClick={darkTheme}
          />
        )}
      </Box>
      <Box className={classes.leftContainer}>
        {info ? (
          <Box className={classes.box}>
            <Typography variant="h6">
              A curated selection for listening and dancing in small, safe
              spaces.
              <Typography
                onClick={handleInfo}
                display="inline"
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                color="primary"
                variant="body2"
              >
                [ more ]
              </Typography>
            </Typography>
          </Box>
        ) : (
          <Box className={classes.box}>
            <Typography variant="h6">
              At the end of the 90s, we ripped albums that we found in physical
              stores and <i> took them to the internet.</i> it was during this
              era that we built a content channel with a noble purpose, that of
              listening. soulseek's directories were cities and “emigrate to a
              new land” was a common feeling. by then, connecting to the
              Internet required a desktop computer, a good local provider,
              modem, and time. <br /> <br /> Life was concretely and
              cybernetically constituted,a division that no longer exists and
              -without automatic playlists or advertising- finding material was
              the product of research so the user was, at the very least,
              selective. with free internet on the streets and the advent of the
              smartphone, the latest generations are now easy recipients of
              unrequested information. all this, before touching a wire or
              having a thoughtful moment. <br />
              <br />
              Curated by
              <Link
                href="https://www.hi-malta.com"
                rel="noopener"
                target="_blank"
              >
                <Typography variant="body2" color="primary" display="inline">
                  {" "}
                  romo
                </Typography>
              </Link>
              , door is a music selection for listening and dancing in small,
              safe spaces.
              <Typography
                onClick={handleInfo}
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                color="primary"
                variant="body2"
                display="inline"
              >
                [ less ]
              </Typography>
            </Typography>
          </Box>
        )}
        <Box className={classes.boxLast}>
          <Link
            href="https://www.patreon.com/doordotlink"
            rel="noopener"
            target="_blank"
          >
            <Typography
              variant="body2"
              style={{ marginRight: "10px" }}
              color="primary"
            >
              Support
            </Typography>
          </Link>
          <Link
            href="https://github.com/Javier-Szyfer/door.link"
            rel="noopener"
            target="_blank"
          >
            <Typography
              variant="body2"
              style={{ marginRight: "10px" }}
              color="primary"
            >
              Github
            </Typography>
          </Link>

          <Link href="mailto:contact@door.link">
            <Typography
              variant="body2"
              style={{ marginRight: "10px" }}
              color="primary"
            >
              Contact
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
