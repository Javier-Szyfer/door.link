import React, { useState, useEffect, useRef } from "react";
import styles from "../components/player.module.css";
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiX } from "react-icons/fi";

//Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

//Components

const useStyles = makeStyles((theme) => ({
  player: {
    width: "50%",
    position: "fixed",
    zIndex: " 9999",
    bottom: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.954)",
    border: "1px solid #a9a9a9",
    padding: "10px",
    [theme.breakpoints.down("md")]: {
      bottom: "0",
      width: "100vw",
      borderLeft: "0",
      borderRight: "0",
      borderBottom: "0",
    },
  },
  setProgress: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  backProgress: {
    width: "32vw",
    height: "8px",
    borderRadius: "8px",
    backgroundColor: "rgb(235, 235, 235)",
    [theme.breakpoints.down("md")]: {
      width: "65vw",
      marginRight: "1vw",
    },
    [theme.breakpoints.down("xs")]: {
      width: "50vw",
      marginRight: "1vw",
    },
  },
  progress: {
    marginRight: "1vw",
    backgroundColor: "blue",
    height: "8px",
    borderRadius: "8px",
    position: "absolute",
  },
  setVolume: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  backVolume: {
    width: "6vw",
    height: "8px",
    borderRadius: "8px",
    backgroundColor: "rgb(235, 235, 235)",
    [theme.breakpoints.down("md")]: {
      width: "10vw",
      marginRight: "1vw",
    },
    [theme.breakpoints.down("xs")]: {
      width: "10vw",
      marginRight: "1vw",
    },
  },
}));

// function useInterval(callback, delay) {
//   const savedCallback = useRef();

//   // Remember the latest callback.
//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);

//   // Set up the interval.
//   useEffect(() => {
//     function tick() {
//       savedCallback.current();
//     }
//     if (delay !== null) {
//       let id = setInterval(tick, delay);
//       return () => clearInterval(id);
//     }
//   }, [delay]);
// }

export function formatTime(seconds) {
  let hours = Math.floor(seconds / 60 / 60);
  hours = hours >= 10 ? hours : "0" + hours;
  let minutes = hours * 60;
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = seconds >= 10 ? seconds : "0" + seconds;
  return hours + ":" + minutes + ":" + seconds;
}

export default function Player({
  selectedTrack,
  setPlayer,
  playing,
  togglePlaying,
}) {
  const classes = useStyles();
  // const [progress, setProgress] = useState(0);
  const [progBarWidth, setProgBarWidth] = useState(0);
  const [volume, setVolume] = useState(10);
  const [curTime, setCurTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef && audioRef.current) {
      if (playing) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [playing]);

  // useInterval(() => {
  //   if (audioRef && audioRef.current) {
  //     const { currentTime, duration } = audioRef.current;
  //     setProgress(Math.ceil((currentTime * 100) / duration));
  //   }
  // });
  const onLoadMetaData = () => {
    const { current: aud } = audioRef;
    setDuration(aud.duration);
  };
  const onTimeUpdate = () => {
    const { current: aud } = audioRef;

    setCurTime(aud.currentTime);
    setProgBarWidth(Math.floor((aud.currentTime / duration) * 100));
  };

  const onSkipAhead = (e) => {
    const { current: aud } = audioRef;
    const progress = e.target;

    const pos = (e.pageX - progress.offsetLeft) / progress.offsetWidth;
    aud.currentTime = pos * aud.duration;
  };

  const onVolumeChange = (e) => {
    const { current: aud } = audioRef;
    const val = e.target.value;
    aud.volume = val / 10;
    setVolume(val);
  };
  const onMute = (e) => {
    e.preventDefault();
    setIsMuted(!isMuted);
  };
  // const onEnded = () => {
  //   togglePlaying();
  // };

  return (
    <Box className={classes.player}>
      <audio
        ref={audioRef}
        src={selectedTrack.url}
        autoPlay
        muted={isMuted}
        onLoadedMetadata={onLoadMetaData}
        onTimeUpdate={onTimeUpdate}
        controls={false}
        // onEnded={onEnded}
      ></audio>
      <Box className={styles.top}>
        <Box className={styles.trackInfo}>
          <Typography variant="caption">{selectedTrack.number} -</Typography>
          <Typography variant="caption">{selectedTrack.title}</Typography>
        </Box>
        <FiX className={styles.clickable} onClick={() => setPlayer(false)} />
      </Box>
      <Box className={styles.controls}>
        <Box className={styles.flex}>
          <Box onClick={togglePlaying}>
            {playing ? (
              <button className={styles.button} type="button">
                <FiPause />
              </button>
            ) : (
              <button className={styles.button} type="button">
                <FiPlay />
              </button>
            )}
          </Box>
          <Box className={classes.setProgress}>
            <progress
              type="range"
              value={curTime}
              max={duration}
              onClick={onSkipAhead}
              // width={progBarWidth + "%"}
              style={{ width: "300px" }}
            >
              <span
                style={{ width: progBarWidth + "%" }}
                className="progress-bar"
              />
            </progress>
            {/* <Box
              className={classes.progress}
              style={{ width: `${progress}%` }}
            ></Box>
            <Box className={classes.backProgress}></Box> */}
          </Box>

          <Box className={styles.flex}>
            <Typography variant="caption" style={{ marginLeft: "1vw" }}>
              {formatTime(duration - curTime)}
            </Typography>
          </Box>
        </Box>
        <Box className={styles.flex}>
          <button className={styles.button} onClick={onMute}>
            {!isMuted | (volume === 0) ? <FiVolume2 /> : <FiVolumeX />}
          </button>
          <input
            onChange={onVolumeChange}
            // className={styles.volume}
            type="range"
            min={0}
            max={10}
            value={isMuted ? 0 : volume}
          />

          <Box className={classes.setVolume}>
            {/* <Box className={styles.volume}></Box> */}
            {/* <Box className={classes.backVolume}></Box> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
