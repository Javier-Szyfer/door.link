import NextLink from "next/link";
import { Box, Typography } from "@material-ui/core";

export default function TxList({ txs }) {
  //Add a test network or the mainnet
  const network = "https://rinkeby.etherscan.io/tx/";
  if (txs.length === 0) return null;

  return (
    <>
      {txs.map((item) => (
        <div key={item}>
          <NextLink href={`${network}${item.hash}`}>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "green",
                border: "1px solid green",
                padding: "1rem 2rem",
                marginTop: "1rem",
              }}
            >
              <Typography noWrap> See your transaction</Typography>
              <Typography noWrap style={{ maxWidth: "300px" }}>
                {item.hash}
              </Typography>
            </Box>
          </NextLink>
        </div>
      ))}
    </>
  );
}
