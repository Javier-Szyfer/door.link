import { FiX } from "react-icons/fi";

//Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

// Plyr
import Plyr from "plyr-react";
import "plyr-react/dist/plyr.css";
//Components

const useStyles = makeStyles((theme) => ({
  player: {
    width: "50%",
    height: "88px",
    position: "fixed",
    zIndex: " 9999",
    bottom: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    border: "1px solid #ccc",
    [theme.breakpoints.down("md")]: {
      bottom: "0",
      width: "100vw",
      height: "80px",
      borderLeft: "0",
      borderRight: "0",
      borderBottom: "0",
    },
  },
  top: {
    display: "flex",
    alignItems: "center",
    paddingTop: "10px",
    justifyContent: "space-between",
    padding: "0 18px",
    backgroundColor: "red",
  },
  trackInfo: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function Player({ selectedTrack, setSelectedTrack, dark }) {
  const classes = useStyles();

  const audioSrc = {
    type: "audio",
    sources: [
      {
        src: selectedTrack.url,
      },
    ],
  };

  return (
    <Box
      className={classes.player}
      style={{
        backgroundColor: dark ? "rgb(20,20,20)" : "rgba(255, 255, 255, 0.95)",
      }}
    >
      <Box
        className={classes.top}
        style={{
          backgroundColor: dark
            ? "rgb(20, 20,20)"
            : "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Box className={classes.trackInfo}>
          <Typography variant="caption">{selectedTrack.number}</Typography>
          <span
            style={{ margin: "0 2px", color: dark ? "#f1f1f1" : "#444444" }}
          >
            -
          </span>
          <Typography variant="caption">{selectedTrack.title}</Typography>
        </Box>
        <FiX
          style={{ cursor: "pointer", color: dark ? "#f1f1f1" : "#444444" }}
          onClick={() => setSelectedTrack(false)}
        />
      </Box>
      <Plyr
        source={audioSrc}
        autoPlay
        style={
          dark
            ? {
                "--plyr-color-main": "#dddddd",
                "--plyr-audio-controls-background": "rgb(20,20,20)",
                "--plyr-audio-control-color": "#BBBBBB",
                "--plyr-audio-control-color-hover": "rgb(20,20,20)",
              }
            : {
                "--plyr-color-main": "blue",
                "--plyr-audio-controls-background": "rgba(255, 255, 255, 0.95)",
              }
        }
      />
    </Box>
  );
}
Plyr.displayName = "Plyr";
Plyr.defaultProps = {
  options: {
    controls: [
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "settings",
      "download",
    ],
    // debug: "true",
    listeners: "true",
  },
};
