import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme,
  type Theme,
} from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmi";

const hudTheme: Theme = {
  ...darkTheme({
    accentColor: "#c8ff00",
    accentColorForeground: "#050505",
    borderRadius: "medium",
    fontStack: "system",
    overlayBlur: "small",
  }),
};

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider theme={hudTheme} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
