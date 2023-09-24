import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import { LoadingBox } from "@/components/ui/loading/loading-box";
import "@/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import {
  EthereumClient,
} from "@web3modal/ethereum";
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  phantomWallet,
  trustWallet,

} from '@rainbow-me/rainbowkit/wallets';
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { store } from "../store";
import { infuraProvider } from 'wagmi/providers/infura'
import { mainnet } from "wagmi/chains";

import { goerli } from "wagmi/chains"; //Change this when deployed to mainnet

import ToastProvider from "@/components/ToastProvider";
import { Web3Modal } from "@web3modal/react";

if (!process.env.NEXT_PUBLIC_YOUR_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable"); 
}
const projectId = process.env.NEXT_PUBLIC_YOUR_PROJECT_ID as string;
const chains = [goerli, mainnet];

const { publicClient, webSocketPublicClient } = configureChains(
  chains,
  [
    infuraProvider({apiKey: process.env.NEXT_PUBLIC_INFURA_KEY as string})
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      coinbaseWallet({ appName:"Uruloki", chains }),
      phantomWallet({ chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiConfig, chains);


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLandingPage = router.pathname === "/index" || router.pathname === "/";
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setIsLoading(true);
    });
    Router.events.on("routeChangeComplete", () => {
      setIsLoading(false);
    });
    Router.events.on("routeChangeError", () => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <ToastProvider>
        <WagmiConfig config={wagmiConfig}>
          <Provider store={store}>
            <RainbowKitProvider chains={chains}>
              {isLoading && ( 
                <div className="w-screen h-screen">
                  <LoadingBox
                    title="Loading data"
                    description="Please wait patiently as we process your transaction, ensuring it is secure and reliable."
                  />
                </div>
              )}
              {isLandingPage ? (
                <Component {...pageProps} />
              ) : (
                <DashboardLayout>
                  <Component {...pageProps} />
                </DashboardLayout>
              )}
            </RainbowKitProvider>
          </Provider>
        </WagmiConfig>
      </ToastProvider>
      <Web3Modal
        projectId={projectId}
        explorerExcludedWalletIds={"ALL"}
        explorerRecommendedWalletIds={[
          process.env.NEXT_PUBLIC_METAMASK_WALLET_ID as string,
          process.env.NEXT_PUBLIC_COINBASE_WALLET_ID as string,
        ]}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
