import { mainnet, base, bsc, arc, monad } from "viem/chains";
import { robinhoodChain } from "@/lib/wagmi";

export type SupportedChain = {
  id: number;
  name: string;
  short: string;
  symbol: string;
  color: string;
  evm: boolean;
  comingSoon?: boolean;
};

export const SUPPORTED_CHAINS: SupportedChain[] = [
  { id: robinhoodChain.id, name: "Robinhood Chain", short: "Robinhood", symbol: "ETH", color: "#C8FF00", evm: true },
  { id: mainnet.id,        name: "Ethereum",        short: "Ethereum", symbol: "ETH",  color: "#627EEA", evm: true },
  { id: base.id,           name: "Base",            short: "Base",     symbol: "ETH",  color: "#0052FF", evm: true },
  { id: bsc.id,            name: "BNB Smart Chain", short: "BSC",      symbol: "BNB",  color: "#F0B90B", evm: true },
  { id: arc.id,            name: "ARC",             short: "ARC",      symbol: "ARC",  color: "#8A5CF6", evm: true },
  { id: monad.id,          name: "Monad",           short: "Monad",    symbol: "MON",  color: "#7C3AED", evm: true },
  { id: -1,                name: "Solana",          short: "Solana",   symbol: "SOL",  color: "#14F195", evm: false, comingSoon: true },
];

export function getChainMeta(id?: number) {
  return SUPPORTED_CHAINS.find((c) => c.id === id);
}
