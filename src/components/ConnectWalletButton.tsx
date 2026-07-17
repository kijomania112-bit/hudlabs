import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Copy, LogOut, ArrowLeftRight, Check } from "lucide-react";
import { useState } from "react";

export function ConnectWalletButton({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openChainModal, openAccountModal, mounted, authenticationStatus }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain;

        const copyAddress = async () => {
          if (!account?.address) return;
          try {
            await navigator.clipboard.writeText(account.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        };

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
            className="flex items-center gap-2"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="group relative inline-flex items-center gap-2 rounded-full gradient-neon px-5 py-2.5 text-sm font-semibold text-[#050505] transition-all hover:scale-[1.02] neon-glow hover:neon-glow-strong"
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    Switch to Robinhood Chain
                  </button>
                );
              }

              if (compact) {
                return (
                  <button
                    onClick={openAccountModal}
                    className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_var(--color-success)]" />
                    <span className="font-mono-num">{account.displayName}</span>
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    className="hidden md:inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-xs font-medium hover:border-primary/40 transition"
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <img src={chain.iconUrl} alt={chain.name ?? ""} className="h-4 w-4 rounded-full" />
                    )}
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {chain.name}
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium hover:border-primary/40 transition"
                  >
                    {account.ensAvatar ? (
                      <img src={account.ensAvatar} alt="" className="h-5 w-5 rounded-full" />
                    ) : (
                      <span className="h-5 w-5 rounded-full gradient-neon" />
                    )}
                    <span className="font-mono-num text-xs">{account.displayName}</span>
                    {account.displayBalance && (
                      <span className="hidden lg:inline text-xs text-muted-foreground border-l border-border pl-2">
                        {account.displayBalance}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={copyAddress}
                    title="Copy address"
                    className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:border-primary/40 transition"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={openAccountModal}
                    title="Disconnect"
                    className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:border-destructive/40 hover:text-destructive transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
