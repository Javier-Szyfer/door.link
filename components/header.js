import { useState } from "react";

//Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
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
  },
  leftContainer: {
    width: "60%",
    // margin: "3rem 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  box: {
    marginTop: "3rem",
    display: "flex",
  },
  boxLast: {
    margin: "3rem 0",
    display: "flex",
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
        <Typography variant="body2" style={{ fontWeight: "bolder" }}>
          [ door ]
        </Typography>
        {!selectedTrack && (
          <img
            src={dark ? "/logowhite.svg" : "/logoblack.svg"}
            style={{ cursor: "pointer" }}
            width="11px"
            height="16.9px"
            alt="door.link logo"
            onClick={darkTheme}
          />
        )}
      </Box>
      <Box className={classes.leftContainer}>
        {info ? (
          <Box className={classes.box}>
            <Typography variant="h6">
              Alternative of listening and dancing in small and safe spaces:
              safe of 2.0, aesthetics, ideology, news, no-required information,
              movements, ads and disease.
              <Typography
                onClick={handleInfo}
                display="inline"
                style={{ marginLeft: "10px", cursor: "pointer" }}
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
              At the end of the 90s, we ripped records that we found in physical
              stores and "took them to the internet". <br />
              It was during this era that we built a content channel with a
              noble purpose, that of listening. The directories in Soulseek were
              cities, and the feeling was this: emigrating to a new land. By
              then, connecting to the internet required a desktop computer, good
              local provider, modem and time. <br />
              <br /> Life was constituted concretely and cybernetically - a
              division that no longer exists - and finding material was a
              product of research, without automatic playlists or advertising,
              so the user was, at a minimum, selective. With the free internet
              on the streets and the arrival of the smartphone, the latest
              generations are easy recipients of non-required information. All
              this, before touching a wire or having a thoughtful moment. Is
              information discrimination a threat to modern society? <br />{" "}
              <br />
              DOOR is an alternative of listening and dancing in small and safe
              spaces: safe of 2.0, aesthetics, ideology, news, no-required
              information, movements, ads and disease.
              <Typography
                onClick={handleInfo}
                style={{ marginLeft: "10px", cursor: "pointer" }}
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
          <Link href="https://nextjs.org/">
            <Typography
              variant="body2"
              style={{ marginRight: "10px" }}
              color="primary"
            >
              Patreon
            </Typography>
          </Link>
          <Link href="https://nextjs.org/">
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
