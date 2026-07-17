import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rabbyWallet,
  okxWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
  rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { defineChain } from "viem";

export const robinhoodChain = defineChain({
  id: 626,
  name: "Robinhood Chain",
  nativeCurrency: { name: "HOOD", symbol: "HOOD", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.robinhoodchain.com"] },
  },
  blockExplorers: {
    default: { name: "Robinhood Explorer", url: "https://explorer.robinhoodchain.com" },
  },
  testnet: false,
});

const projectId =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_WC_PROJECT_ID) ||
  "hudlabs-launchpad-demo";

export const wagmiConfig = getDefaultConfig({
  appName: "HUDLABS",
  projectId,
  chains: [robinhoodChain],
  ssr: false,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        injectedWallet, // Robinhood Wallet + any injected
        metaMaskWallet,
        rabbyWallet,
        okxWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
      ],
    },
  ],
});
