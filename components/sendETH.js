import { useState } from "react";
import Link from "next/link";

//SWR
import useSWR from "swr";
//Wagmi hooks and ethers
import { useConnect, useAccount } from "wagmi";
import { ethers } from "ethers";

import TxList from "./txList";
import { AiOutlineClose } from "react-icons/ai";

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

const SendETH = ({ setSupport }) => {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(
    "https://api.coingecko.com/api/v3/coins/ethereum",
    fetcher,
    { revalidate: 60 }
  );

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
  const [{ data: connectWallet, error: connectionError }, connect] =
    useConnect();
  const [{ data: accountData }] = useAccount();
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center  mx-auto bg-white dark:bg-[#121212] text-[#1500FF] dark:text-[#f1f1f1]">
      <div
        onClick={() => setSupport(false)}
        className="fixed z-50 right-[1rem] top-[1rem] md:top-[2rem] md:right-[2rem]  cursor-pointer "
      >
        <AiOutlineClose className="text-[#1500FF] h-8 w-8" />
      </div>
      <div className="flex flex-col  justify-center max-w-4xl mx-auto">
        <h2 className="text-left p-8 md:p-0">
          If you enjoy door.link, <br /> consider sending your support
        </h2>
        <div className="px-8 grid grid-cols-1 md:grid-cols-2 md:gap-4 md:mx-auto">
          <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between mt-10">
            <div className="text-left font-bold flex flex-col justify-evenly min-w-[290px] sm:min-w-[350px] max-h-[400px] max-w-[400px] md:h-[250px] mb-10 sm:mb-0  ">
              <Link
                href="https://www.paypal.com/donate?hosted_button_id=A397N24XG4CZJ"
                passHref
              >
                <a target="_blank" rel="noopener" className="cursor-pointer">
                  &rarr; Paypal
                </a>
              </Link>
            </div>
          </div>
          {!accountData && (
            <div className=" bg-[#1500FF] w-full p-4 h-72 ">
              <h2 className="text-xl">ETH</h2>
              <div className="flex flex-col justify-center h-full w-full">
                {connectWallet.connectors.map((connector) => (
                  <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect(connector)}
                    className="bg-[#1500FF] mt-2 py-2 px-4 text-xl font-bold hover:bg-white hover:text-[#1500FF] border border-white"
                  >
                    {connector.name}
                    {!connector.ready && " (unsupported)"}
                  </button>
                ))}

                {connectionError && (
                  <div>{connectionError?.message ?? "Failed to connect"}</div>
                )}
              </div>
            </div>
          )}
          {accountData && (
            <form onSubmit={handleSubmitPayment}>
              <div className=" flex flex-col justify-evenly h-72  bg-[#1500FF] text-white p-4 ">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center">
                    <input
                      value={ether}
                      className="border border-white  px-2 py-2 text-xl mr-2 bg-[#1500FF] placeholder:text-white focus:outline-none"
                      onChange={(e) => {
                        setError(""), setEther(e.target.value);
                      }}
                      placeholder="0.01"
                    />
                    <span className="text-4xl">ETH</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className=" mr-2">{ether && "USD"}</span>
                    <span>
                      {ether
                        ? formatter.format(ether * currentETHPriceInUSD)
                        : ""}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#1500FF] py-2 px-4 text-xl font-bold hover:bg-white hover:text-[#1500FF] border border-white"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white hover:text-[#1500FF]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Processing</span>
                    </div>
                  ) : (
                    "Transfer"
                  )}
                </button>
              </div>
            </form>
          )}
          {error && (
            <span className="mt-4 col-start-2 text-red-600 truncate overflow-hidden w-72">
              {error}
            </span>
          )}
        </div>
        <TxList txs={txs} />
      </div>
    </div>
  );
};

export default SendETH;
