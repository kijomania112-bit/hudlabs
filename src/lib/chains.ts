import { mainnet, base, bsc, arc, monad } from "viem/chains";
import { robinhoodChain } from "@/lib/wagmi";
import robinhoodLogo from "@/assets/robinhood.png";
import ethereumLogo from "@/assets/ethereum.png";
import baseLogo from "@/assets/base.jpeg";
import bscLogo from "@/assets/bsc.png";
import arcLogo from "@/assets/ARC.jpg";
import monadLogo from "@/assets/monad.png";
import solanaLogo from "@/assets/solana.png";

export type SupportedChain = {
  id: number;
  name: string;
  short: string;
  symbol: string;
  color: string;
  evm: boolean;
  logo: string;
  comingSoon?: boolean;
};

export const SUPPORTED_CHAINS: SupportedChain[] = [
  { id: robinhoodChain.id, name: "Robinhood Chain", short: "Robinhood", symbol: "ETH", color: "#C8FF00", evm: true, logo: robinhoodLogo },
  { id: mainnet.id,        name: "Ethereum",        short: "Ethereum", symbol: "ETH",  color: "#627EEA", evm: true, logo: ethereumLogo },
  { id: base.id,           name: "Base",            short: "Base",     symbol: "ETH",  color: "#0052FF", evm: true, logo: baseLogo },
  { id: bsc.id,            name: "BNB Smart Chain", short: "BSC",      symbol: "BNB",  color: "#F0B90B", evm: true, logo: bscLogo },
  { id: arc.id,            name: "ARC",             short: "ARC",      symbol: "ARC",  color: "#8A5CF6", evm: true, logo: arcLogo },
  { id: monad.id,          name: "Monad",           short: "Monad",    symbol: "MON",  color: "#7C3AED", evm: true, logo: monadLogo },
  { id: -1,                name: "Solana",          short: "Solana",   symbol: "SOL",  color: "#14F195", evm: false, comingSoon: true, logo: solanaLogo },
];

export function getChainMeta(id?: number) {
  return SUPPORTED_CHAINS.find((c) => c.id === id);
}
