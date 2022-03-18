import { ThemeProvider } from "next-themes";
import { TrackProvider } from "../context/trackContext";
import "../styles/globals.css";

//wagmi hooks
import { Provider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import { ethers } from "ethers";

// API key for Ethereum node
const infuraId =
  "https://mainnet.infura.io/v3/161721284ff9485c90b9f09026704e55";

//Only for testing otherwise use mainnet and remove provider prop from Provider Hook
// const provider = new ethers.providers.InfuraProvider(
//   "ropsten",
//   "bf59c8a90d37443083854e5567ca2bf6"
// );

// Chains for connectors to support
const chains = defaultChains;

// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0];
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: "My wagmi app",
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ];
};

function MyApp({ Component, pageProps }) {
  return (
    <Provider autoConnect connectors={connectors}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TrackProvider>
          <DefaultSeo {...SEO} />
          <Component {...pageProps} />
        </TrackProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
