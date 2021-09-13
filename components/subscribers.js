import { useState } from "react";

import { AiOutlineClose } from "react-icons/ai";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
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
  },
  close: {
    position: "fixed",
    top: "2rem",
    right: "2rem",
    cursor: "pointer",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      padding: "0  2rem",
    },
  },
  input: {
    margin: "1rem 0 0 0",
    borderColor: "red",
  },
  cssFocused: { color: "white", borderRadius: "0" },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: "green",
    },
    color: theme.palette.primary.main,
    borderRadius: "0",
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "blue !important",
  },

  btnsWrapper: {
    display: "flex",
    width: "100%",
    margin: "1rem 0",
    justifyContent: "space-between",
  },
}));

export default function Subscribers({ setShowForm, dark }) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const subscribeToNewsletter = async (e) => {
    e.preventDefault();

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
      setSuccess(true);
      setEmail("");
      setLoading(false);
    } catch (err) {
      setError("Not a valid email");
    }
  };

  return (
    <Box
      className={classes.boxWrapper}
      style={{ backgroundColor: dark ? "#121212" : "white" }}
    >
      <Box onClick={() => setShowForm(false)} className={classes.close}>
        <AiOutlineClose style={{ color: "blue", fontSize: "30px" }} />
      </Box>

      <form onSubmit={subscribeToNewsletter}>
        <Box className={classes.form}>
          <Typography variant="body2">
            Sign up for updates — no spam, just music.
          </Typography>

          <TextField
            variant="outlined"
            type="email"
            size="small"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value), setSuccess(false), setError(false);
            }}
            className={classes.input}
            autoComplete="true"
            InputProps={{
              classes: {
                root: classes.cssOutlinedInput,
                focused: classes.cssFocused,
                notchedOutline: classes.notchedOutline,
              },
            }}
          />

          <Box className={classes.btnsWrapper}>
            <Button
              variant="text"
              type="text"
              disableRipple
              disableElevation={true}
              onClick={() => setShowForm(false)}
              style={{
                width: "40%",
                padding: "0 1 rem",
                borderRadius: "0",
                textTransform: "none",
                backgroundColor: "#f2f2f2",
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              disableRipple
              disableElevation={true}
              style={{
                width: "40%",
                borderRadius: "0",
                textTransform: "none",
                backgroundColor: "blue",
                color: "white",
              }}
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
