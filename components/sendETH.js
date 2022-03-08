import { useState } from "react";
import Link from "next/link";

//SWR
import useSWR from "swr";
import { AiOutlineClose } from "react-icons/ai";
//web3 Portal
import { ethers } from "ethers";

import TxList from "./TxList";

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

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-white dark:bg-[#121212] text-[#1500FF] dark:text-[#f1f1f1]">
      <div
        onClick={() => setSupport(false)}
        className="fixed z-50 right-[1rem] top-[1rem] md:top-[2rem] md:right-[2rem]  cursor-pointer "
      >
        <AiOutlineClose className="text-[#1500FF] h-8 w-8" />
      </div>
      <div className="flex flex-col max-w-3xl p-[2rem] w-full">
        <h2 className="">
          If you enjoy door.link, <br /> consider sending your support
        </h2>

        <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between mt-10">
          <div className="text-left  font-bold flex flex-col justify-evenly max-h-[400px] max-w-[400px] md:h-[250px] mb-10 sm:mb-0 ">
            <Link
              href="https://www.paypal.com/donate?hosted_button_id=A397N24XG4CZJ"
              passHref
            >
              <a target="_blank" rel="noopener" className="cursor-pointer">
                &rarr; Paypal
              </a>
            </Link>
          </div>
          <form onSubmit={handleSubmitPayment}>
            <div className="mb-2 flex flex-col justify-evenly max-h-[400px] max-w-[400px] w-full h-[250px] bg-[#1500FF] text-white p-4 ">
              <div className="flex items-center">
                <input
                  value={ether}
                  className="border border-white w-full px-2 py-2 text-xl mr-2 bg-[#1500FF] placeholder:text-white focus:outline-none"
                  onChange={(e) => {
                    setError(""), setEther(e.target.value);
                  }}
                  placeholder="0.01"
                />
                <span className="text-4xl">ETH</span>
              </div>
              <div className="flex items-center">
                <span className=" mr-2">{ether && "USD"}</span>
                <span className="">
                  {ether ? formatter.format(ether * currentETHPriceInUSD) : ""}
                </span>
              </div>
              <button
                type="submit"
                className="bg-[#1500FF] py-2 px-4 text-xl font-bold hover:bg-white hover:text-[#1500FF] border border-white"
              >
                {loading ? <CircularProgress size={25} /> : "Transfer"}
              </button>
            </div>
            {error && <span className=" text-red-600">{error}</span>}
          </form>
        </div>
      </div>

      <TxList txs={txs} />
    </div>
  );
};

export default SendETH;
