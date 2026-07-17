import { useEffect, useRef, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { ChevronDown, Check, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { SUPPORTED_CHAINS, getChainMeta, type SupportedChain } from "@/lib/chains";

type Props = {
  value?: number;
  onChange?: (chainId: number) => void;
  className?: string;
};

/**
 * ChainSelector
 * - Shows all supported networks
 * - Highlights the chain the connected wallet is currently on
 * - If wallet chain differs from the selected chain, shows a "Switch Network" CTA
 *   that calls wagmi's switchChain
 */
export function ChainSelector({ value, onChange, className = "" }: Props) {
  const { address, chain: walletChain } = useAccount();
  const { switchChain, isPending: switching, error: switchError } = useSwitchChain();

  const [selectedId, setSelectedId] = useState<number>(
    value ?? walletChain?.id ?? SUPPORTED_CHAINS[0].id,
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) setSelectedId(value);
  }, [value]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = getChainMeta(selectedId) ?? SUPPORTED_CHAINS[0];
  const walletOnSelected = walletChain?.id === selected.id;

  const pick = (c: SupportedChain) => {
    if (c.comingSoon) return;
    setSelectedId(c.id);
    onChange?.(c.id);
    setOpen(false);
  };

  const doSwitch = () => {
    if (!selected.evm || selected.comingSoon) return;
    switchChain({ chainId: selected.id });
  };

  return (
    <div className={`w-full ${className}`}>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl glass px-4 py-3 text-left hover:border-primary/40 transition"
        >
          <span className="flex items-center gap-3">
            <ChainDot color={selected.color} />
            <span className="flex flex-col">
              <span className="text-sm font-semibold">{selected.name}</span>
              <span className="text-[11px] text-muted-foreground font-mono-num">
                Chain ID · {selected.id > 0 ? selected.id : "—"}
              </span>
            </span>
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl">
            <ul className="max-h-80 overflow-auto py-1">
              {SUPPORTED_CHAINS.map((c) => {
                const active = c.id === selectedId;
                const isWallet = walletChain?.id === c.id;
                return (
                  <li key={`${c.id}-${c.name}`}>
                    <button
                      type="button"
                      disabled={c.comingSoon}
                      onClick={() => pick(c)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${
                        c.comingSoon
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-primary/10"
                      } ${active ? "bg-primary/5" : ""}`}
                    >
                      <span className="flex items-center gap-3">
                        <ChainDot color={c.color} />
                        <span className="flex flex-col">
                          <span className="font-medium">{c.name}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {c.comingSoon ? "Non-EVM · coming soon" : `${c.symbol} · ID ${c.id}`}
                          </span>
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        {isWallet && (
                          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                            Wallet
                          </span>
                        )}
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Status / switch guidance */}
      <div className="mt-3">
        {!address && (
          <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 text-primary" />
            Connect a wallet to detect your current network.
          </div>
        )}

        {address && selected.comingSoon && (
          <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-warning" />
            {selected.name} is non-EVM. HUDLABS support is in progress.
          </div>
        )}

        {address && !selected.comingSoon && walletOnSelected && (
          <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
            <Check className="h-3.5 w-3.5" />
            Wallet is connected to {selected.name}.
          </div>
        )}

        {address && !selected.comingSoon && !walletOnSelected && (
          <div className="flex flex-col gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
              <span>
                Your wallet is on{" "}
                <b>{walletChain?.name ?? `Chain ${walletChain?.id ?? "unknown"}`}</b>. Switch to{" "}
                <b>{selected.name}</b> to continue.
              </span>
            </div>
            <button
              type="button"
              onClick={doSwitch}
              disabled={switching}
              className="inline-flex items-center justify-center gap-2 rounded-lg gradient-neon px-3 py-1.5 text-xs font-semibold text-[#050505] neon-glow hover:neon-glow-strong disabled:opacity-60"
            >
              {switching ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Switching…
                </>
              ) : (
                <>Switch to {selected.short}</>
              )}
            </button>
            {switchError && (
              <span className="text-[11px] text-destructive">
                {switchError.message.includes("Unrecognized")
                  ? "Wallet rejected the switch. Add the network manually and try again."
                  : switchError.message}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ChainDot({ color }: { color: string }) {
  return (
    <span
      className="relative inline-flex h-7 w-7 items-center justify-center rounded-full"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${color}, ${color}22 70%)`,
        boxShadow: `0 0 12px ${color}55`,
      }}
    >
      <span className="h-2 w-2 rounded-full bg-white/90" />
    </span>
  );
}
