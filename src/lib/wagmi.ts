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
import { mainnet, base, bsc, arc, monad } from "viem/chains";

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

// Note: Solana is non-EVM and not supported by wagmi/viem. Add @solana/wallet-adapter separately for Solana support.

const projectId =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_WC_PROJECT_ID) ||
  "14a6012ffc42d98b14cc3637e1c3c924";

export const wagmiConfig = getDefaultConfig({
  appName: "HUDLABS",
  projectId,
  chains: [robinhoodChain, mainnet, base, bsc, arc, monad],
  ssr: true,

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
