import { useState } from "react";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme) => ({
  boxWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    position: "fixed",
    zIndex: "99",
    top: "0",
    left: "0",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      padding: "0  2rem",
    },
  },
  input: {
    margin: "1rem 0",
  },
  btnsWrapper: {
    display: "flex",
    width: "100%",
    margin: "1rem 0",
    justifyContent: "center",
  },
}));

export default function Subscribers({ setShowForm }) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const subscribeToNewsletter = async (e) => {
    e.preventDefault();
    console.log("subscribing");

    if (email === "") {
      setError("Enter your email to subscribe");
      return;
    }
    setLoading(true);
    try {
      const { API_URL } = process.env;
      const res = await fetch(`${API_URL}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();
      console.log(data);
      setSuccess(true);
      setEmail("");
      setLoading(false);
    } catch (err) {
      setError("Not a valid email");
    }
  };

  return (
    <Box className={classes.boxWrapper}>
      <form onSubmit={subscribeToNewsletter}>
        <Box className={classes.form}>
          <Typography variant="body2" style={{ color: "rgb(20,20,20)" }}>
            Sign up for updates — no spam, just music.
          </Typography>

          <TextField
            variant="outlined"
            type="email"
            size="small"
            value={email}
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value), setSuccess(false), setError(false);
            }}
            className={classes.input}
            autoComplete="true"
          />

          <Box className={classes.btnsWrapper}>
            <Button
              variant="text"
              type="text"
              disableRipple
              disableElevation={true}
              onClick={() => setShowForm(false)}
              style={{ width: "40%", padding: "0 1 rem" }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              type="submit"
              disableRipple
              disableElevation={true}
              style={{ width: "40%" }}
            >
              Join
            </Button>
          </Box>
          {success && (
            <Typography
              variant="body2"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              : ) thx!
            </Typography>
          )}
          {error && (
            <Typography
              variant="body2"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              {error}
            </Typography>
          )}
          {loading && <LinearProgress />}
        </Box>
      </form>
    </Box>
  );
}
