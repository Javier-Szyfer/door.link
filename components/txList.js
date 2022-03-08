import NextLink from "next/link";

export default function TxList({ txs }) {
  //Add a test network or the mainnet
  const network = "https://etherscan.io/tx/";
  if (txs.length === 0) return null;

  return (
    <>
      {txs.map((item) => (
        <div key={item}>
          <NextLink href={`${network}${item.hash}`}>
            <div
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
              <span> See your transaction</span>
              <span style={{ maxWidth: "300px" }}>{item.hash}</span>
            </div>
          </NextLink>
        </div>
      ))}
    </>
  );
}
