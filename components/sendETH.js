import { useState } from "react";
import NextLink from "next/link";

//SWR
import useSWR from "swr";
import { AiOutlineClose } from "react-icons/ai";
//web3 Portal
import { ethers } from "ethers";

import TxList from "./txList";
//UI
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  boxWrapper: {
    display: "flex",
    flexDirection: "column",
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
  bigBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "white",
    width: "100%",
    maxWidth: "800px",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  payPal: {
    color: "blue",
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    maxHeight: "400px",
    maxWidth: "400px",
    width: "100%",
    height: "300px",
    padding: "2rem",
    textAlign: "left",
    paddingLeft: 0,

    [theme.breakpoints.down("xs")]: {
      height: "auto",
    },
  },
  outerBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    maxHeight: "400px",
    maxWidth: "400px",
    width: "100%",
    height: "250px",
    backgroundColor: "blue",
    color: "white",
    padding: "2rem",
  },
  text: {
    fontSize: "1rem",
    lineHeight: "1.1",
    color: theme.palette.primary.main,
    marginBottom: " 1rem",
    textAlign: "left",
  },
  inputField: {
    marginRight: ".5rem",
    border: "1px solid white",
  },
  input: {
    color: "white",
    fontSize: "1.5rem",
  },
  flex: {
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
  },
  eth: {
    letterSpacing: 0,
    fontSize: "2rem",
    fontWeight: "normal",
  },
  Button: {
    width: "100%",
    color: "blue",
    backgroundColor: "white",
    borderColor: "white",
    textTransform: "none",
    fontWeight: "bold",
    borderRadius: "0",
    "&:hover": {
      backgroundColor: "#fff",
      color: "blue",
    },
  },
}));

const createTransaction = async ({
  setError,
  setLoading,
  setEther,
  setTxs,
  ether,
  addr,
}) => {
  try {
    if (!window.ethereum) {
      setLoading(false);
      throw new Error("No crypto wallet found. Please install it.");
    }
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress(addr);
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(ether),
    });
    setTxs([tx]);
    setLoading(false);
    setEther("");
    console.log("success");
  } catch (err) {
    setLoading(false);
    setError(err.message);
  }
};

const SendETH = ({ dark, setSupport }) => {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(
    "https://api.coingecko.com/api/v3/coins/ethereum",
    fetcher
  );

  const classes = useStyles();
  //State
  const [ether, setEther] = useState("0.01");
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //variables
  const currentETHPriceInUSD = data?.market_data.current_price.usd;
  const addr = "0xf5F849c1c5AA93e1231220E844a92dE39fbE5F35";
  //helper function
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setError("");
    if (!ether || ether == "0") {
      setError("Please enter an amount");
      return;
    }
    setLoading(true);
    await createTransaction({
      setError,
      setLoading,
      setEther,
      setTxs,
      ether,
      addr,
    });
  };

  return (
    <Box
      className={classes.boxWrapper}
      style={{ backgroundColor: dark ? "#121212" : "white" }}
    >
      <Box onClick={() => setSupport(false)} className={classes.close}>
        <AiOutlineClose style={{ color: "blue", fontSize: "30px" }} />
      </Box>
      <Box
        style={{
          width: "100%",
          display: "flex",
          maxWidth: "800px",
          padding: "2rem",
          flexDirection: "column",
        }}
      >
        <Typography className={classes.text}>
          If you enjoy door.link, <br /> consider sending your support
        </Typography>

        <Box className={classes.bigBox}>
          <Box className={classes.payPal} style={{ textAlign: "left" }}>
            <NextLink href="https://www.paypal.com/donate?hosted_button_id=A397N24XG4CZJ">
              <a
                target="_blank"
                rel="noopener"
                style={{ cursor: "pointer", width: "80px" }}
              >
                &rarr; Paypal
              </a>
            </NextLink>
          </Box>
          <form onSubmit={handleSubmitPayment}>
            <Box className={classes.outerBox}>
              <Box className={classes.flex}>
                <TextField
                  value={ether}
                  variant="outlined"
                  className={classes.inputField}
                  InputProps={{
                    className: classes.input,
                  }}
                  onChange={(e) => {
                    setError(""), setEther(e.target.value);
                  }}
                />
                <Typography className={classes.eth}>ETH</Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: ".7rem",
                  margin: "0.5rem 0",
                }}
              >
                <Typography variant="body1" style={{ fontSize: ".8rem" }}>
                  {ether && "USD"}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ marginLeft: "0.5rem", fontSize: ".8rem" }}
                >
                  {ether ? formatter.format(ether * currentETHPriceInUSD) : ""}
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="outlined"
                disableElevation
                disableRipple
                disabled={loading}
                className={classes.Button}
              >
                {loading ? <CircularProgress size={25} /> : "Transfer"}
              </Button>
            </Box>
            {error && (
              <Typography
                style={{ color: "red", textAlign: "center", marginTop: "1rem" }}
              >
                {error}
              </Typography>
            )}
          </form>
        </Box>
      </Box>

      <TxList txs={txs} />
    </Box>
  );
};

export default SendETH;
