import { useState } from "react";

//Material UI
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

//Components
import Playlist from "../components/playlist";
import Player from "../components/player";
import Header from "../components/header";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: "transparent",
    position: "relative",

    [theme.breakpoints.down("md")]: {
      width: "100vw",
      height: "100%",
      padding: "0px",
    },
  },
  paper: {
    backgroundColor: "transparent",
    position: "relative",

    borderRadius: 0,
    height: "100%",
  },
}));

export default function Home({ playlists, darkTheme, dark }) {
  const tracks = playlists.map((track) => {
    return {
      id: track.id,
      title: track.Title,
      url: track.audio.url,
      duration: track.duration,
      number: track.number,
      description: track.Description,
      image: track.artwork.url,
    };
  });
  const [selectedTrack, setSelectedTrack] = useState(null);
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.paper}>
      <Container maxWidth="lg" className={classes.container}>
        <Header
          darkTheme={darkTheme}
          dark={dark}
          selectedTrack={selectedTrack}
        />
        {selectedTrack && dark && (
          <Player
            selectedTrack={selectedTrack}
            setSelectedTrack={setSelectedTrack}
            dark={dark}
          />
        )}
        {selectedTrack && !dark && (
          <Player
            selectedTrack={selectedTrack}
            setSelectedTrack={setSelectedTrack}
            dark={dark}
          />
        )}

        {tracks.map((track) => (
          <Playlist
            track={track}
            key={track.id}
            setSelectedTrack={setSelectedTrack}
          />
        ))}
      </Container>
    </Paper>
  );
}

export async function getStaticProps() {
  const { API_URL } = process.env;
  const res = await fetch(`${API_URL}/playlists?_sort=date:DESC`);
  const data = await res.json();

  return {
    props: {
      playlists: data,
    },
    revalidate: 100,
  };
}
