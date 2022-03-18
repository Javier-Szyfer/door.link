import { useState, useEffect } from "react";
import Link from "next/link";
import { formatAddress } from "../utils/formatAddress";

//SWR
import useSWR from "swr";
//Wagmi hooks and ethers
import {
  useConnect,
  useAccount,
  useBalance,
  useTransaction,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";

import { ethers } from "ethers";

const Support = () => {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(
    "https://api.coingecko.com/api/v3/coins/ethereum",
    fetcher,
    { revalidate: 30 }
  );

  //State
  const [ether, setEther] = useState(0.01);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  //variables
  const currentETHPriceInUSD = data?.market_data.current_price.usd;
  const addr = "0xf5F849c1c5AA93e1231220E844a92dE39fbE5F35";
  //helper function
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const [{ data: network }] = useNetwork();
  const [{ data: connectWallet, error: connectionError }, connect] =
    useConnect();
  const [{ data: accountData }, disconnect] = useAccount({ fetchEns: true });
  const [{ data: balance }] = useBalance({
    addressOrName: accountData?.address,
  });
  const [{ data: result, error: txError }, sendTransaction] = useTransaction();
  const [{ data: txConfirmation, error: receiptError }, wait] =
    useWaitForTransaction({ skip: true });

  const handleSubmitTx = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);
    try {
      if (!ether) {
        setError("Enter amount");
        setLoading(false);
        return;
      } else if (ether == 0) {
        setError("Amount should be greater than 0");
        setLoading(false);
        return;
      } else if (balance?.formatted < ether) {
        setError("Insufficient funds");
        setLoading(false);
        return;
      }
      const tx = await sendTransaction({
        request: {
          to: addr,
          value: ether.toString().length
            ? ethers.utils.parseEther(ether.toString())
            : ethers.utils.parseEther("0"),
        },
      });
      // Check for errors otherwise wait for tx confirmation
      if (tx && tx?.error) {
        setError(tx?.error.message);
        setLoading(false);
        return;
      } else {
        wait({ hash: tx?.data.hash }).then(() => {
          console.log(txConfirmation);
          setLoading(false);
          setSuccess(true);
        });
      }
    } catch (e) {
      console.log("error: ", e);
    }
  };
  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  useEffect(() => {
    delay(1000).then(() => setMounted(true));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-8 min-h-screen">
      <div className="top-10 py-10 flex items-center justify-between ">
        {/* SHOW ACC DATA */}
        {accountData ? (
          <div className="flex items-center text-sm">
            {accountData?.ens?.avatar ? (
              <img
                src={accountData.ens.avatar}
                className="w-6 h-6 mr-2 rounded-full "
              />
            ) : (
              <div className="bg-[#1500FF] w-6 h-6 rounded-full mr-2" />
            )}
            <span>
              {accountData?.ens
                ? accountData?.ens.name
                : formatAddress(accountData?.address)}
            </span>
            <button
              className="ml-2 text-[rgb(130,129,129)]"
              onClick={disconnect}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div></div>
        )}
        <Link href={"/"} passHref>
          <span className="text-sm hover:text-[#1500FF] cursor-pointer ">
            &larr; back{" "}
          </span>
        </Link>
      </div>
      <h2 className="text-left mt-24">
        If you enjoy door.link, <br /> consider sending your support
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 mt-10 md:mt-24 lg:mt-32">
        <div className="flex flex-col md:justify-between my-10 md:my-0">
          <div className="text-left font-medium flex flex-col mb-10 sm:mb-0  ">
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
        {!accountData && mounted && (
          <div className=" bg-[#1500FF]  p-4 h-64  max-w-[400px] text-white">
            <h2 className="text-xl">Connect wallet</h2>
            <div className="flex flex-col justify-center h-full ">
              {connectWallet.connectors.map((connector) => (
                <button
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connect(connector)}
                  className="bg-[#1500FF] mt-2 py-2 px-4 text-xl font-medium hover:bg-white hover:text-[#1500FF] border border-white"
                >
                  {connector.name}
                  {!connector.ready && " (unsupported)"}
                </button>
              ))}

              {connectionError && (
                <div className="text-xs mt-4">
                  {connectionError?.message ?? "Failed to connect"}
                </div>
              )}
            </div>
          </div>
        )}
        {accountData && (
          <form onSubmit={handleSubmitTx}>
            <div className=" flex flex-col justify-evenly h-52 p-4 max-w-[400px]  bg-[#1500FF] text-white ">
              <div className="flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <input
                    value={ether}
                    type="number"
                    className="appearance-none border border-white w-full px-2 py-2 text-xl mr-2 bg-[#1500FF] placeholder:text-white focus:outline-none"
                    onChange={(e) => {
                      setError(""), setEther(e.target.value);
                    }}
                    placeholder={ether == 0 ? "Enter amount" : "0.01"}
                  />
                  <span className="text-4xl">ETH</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
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
                disabled={network.chain.id != 1 ? true : false}
                className="disabled:opacity-60 disabled:cursor-not-allowed bg-[#1500FF] py-2 px-4 text-xl font-bold hover:bg-white hover:text-[#1500FF] border border-white"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-stone-300 "
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
          <div className="fixed bottom-4 left-1/2 translate-x-[-9rem] z-30 text-red-600 border border-red-600 py-2 px-4 mx-auto w-72 text-center truncate">
            {error}
          </div>
        )}
      </div>
      {txConfirmation && success && !error && network.chain?.id === 1 && (
        <Link
          href={`https://etherscan.io/tx/${txConfirmation.transactionHash}`}
          passHref
        >
          <a target="_blank" rel="noopener noreferrer">
            <span className="cursor-pointer fixed bottom-4 left-1/2 translate-x-[-9rem] z-30 text-emerald-700 py-2 px-4 border border-emerald-700 flex flex-col items-center mx-auto w-72 ">
              <span>Transaction completed</span>
              <span>View it on Etherscan</span>
            </span>
          </a>
        </Link>
      )}
      {mounted && network.chain?.id != 1 && accountData && (
        <div className="fixed bottom-4 left-1/2 translate-x-[-9rem] z-30 text-orange-600 border border-orange-600 py-2 px-4 mx-auto w-72 text-center">
          Wrong network, please switch to Mainnet
        </div>
      )}
    </div>
  );
};

export default Support;
