import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import logoAsset from "@/assets/hudlabs-logo.jpeg";
import {
  Upload, Rocket, Info, Twitter, Send, Github, Globe, BookOpen,
  MessageCircle, ImageIcon, Sparkles, Loader2, Check,
} from "lucide-react";

const OG_IMAGE =
  typeof window === "undefined"
    ? logoAsset
    : new URL(logoAsset, window.location.origin).toString();
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { ChainSelector } from "@/components/ChainSelector";
import { getChainMeta } from "@/lib/chains";

export const Route = createFileRoute("/create")({
  component: CreateLaunchPage,
  head: () => ({
    meta: [
      { title: "Launch a Token — HUDLABS" },
      {
        name: "description",
        content:
          "Deploy a fair-launch token on a bonding curve across Robinhood, Ethereum, Base, BSC, ARC or Monad. LP burned, no presale, no team allocation.",
      },
      { property: "og:title", content: "Launch a Token — HUDLABS" },
      {
        property: "og:description",
        content: "Fair-launch tokens on the HUDLABS launchpad — 1B supply, bonded curve, LP 100% burned.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:url", content: "/create" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@hudlabs" },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:title", content: "Launch a Token — HUDLABS" },
      {
        name: "twitter:description",
        content: "Fair-launch tokens on the HUDLABS launchpad — 1B supply, bonded curve, LP 100% burned.",
      },
    ],
    links: [{ rel: "canonical", href: "/create" }],
  }),
});

const SUPPLIES = [
  { label: "1B",   value: 1_000_000_000 },
  { label: "100M", value: 100_000_000 },
  { label: "10M",  value: 10_000_000 },
  { label: "1M",   value: 1_000_000 },
  { label: "10K",  value: 10_000 },
];

function CreateLaunchPage() {
  const { address, chain: walletChain } = useAccount();

  const [chainId, setChainId] = useState<number>(626);
  const selectedChain = getChainMeta(chainId);
  const nativeSymbol = selectedChain?.symbol ?? "ETH";

  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [initialBuy, setInitialBuy] = useState("");
  const [supply, setSupply] = useState<number>(1_000_000_000);
  const [staking, setStaking] = useState<"none" | "enable">("none");
  const [feeAddress, setFeeAddress] = useState("");

  const [x, setX] = useState("");
  const [tg, setTg] = useState("");
  const [dc, setDc] = useState("");
  const [gh, setGh] = useState("");
  const [gb, setGb] = useState("");
  const [web, setWeb] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feeValid = useMemo(() => /^0x[a-fA-F0-9]{40}$/.test(feeAddress.trim()), [feeAddress]);
  const walletOnSelected = walletChain?.id === chainId;
  const canSubmit =
    address && name.trim() && ticker.trim() && feeValid && walletOnSelected && !selectedChain?.comingSoon;

  const onPickImage = (f?: File | null) => {
    if (!f) return;
    if (f.size > 400 * 1024) {
      alert("Image too large — max 400KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    // Architecture-ready: no smart-contract call yet.
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoAsset}
              alt="HUDLABS"
              className="h-8 w-8 rounded-md object-cover drop-shadow-[0_0_16px_rgba(200,255,0,0.45)]"
            />
            <span className="font-display text-lg font-bold tracking-tight">HUDLABS</span>
          </Link>
          <ConnectWalletButton compact />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Fair-launch · No presale · No team allocation
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Launch a token
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Deploy a bonding-curve token. <b className="text-foreground">1B supply</b> · 70% on the curve ·
            graduates into a Uniswap-style pool with the LP <b className="text-primary">100% burned</b>.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Chain */}
          <Field label="Network" hint="Where your token will be deployed.">
            <ChainSelector value={chainId} onChange={setChainId} />
          </Field>

          {/* Image */}
          <Field label="Token image">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/gif"
              className="hidden"
              onChange={(e) => onPickImage(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/10 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              {image ? (
                <img src={image} alt="Token" className="h-32 w-32 rounded-2xl object-cover" />
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span>Click to upload (PNG / JPG / GIF, ≤ 400KB)</span>
                </>
              )}
            </button>
          </Field>

          {/* Name + Ticker */}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <TextInput placeholder="Robin Coin" value={name} onChange={setName} />
            </Field>
            <Field label="Ticker">
              <TextInput
                placeholder="ROBIN"
                value={ticker}
                onChange={(v) => setTicker(v.toUpperCase().slice(0, 10))}
              />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's your token about?"
              rows={4}
              className="w-full resize-none rounded-2xl border border-border bg-muted/10 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50"
            />
          </Field>

          {/* Initial buy */}
          <Field
            label="Initial buy (optional)"
            hint={`Buy your own token in the same transaction to seed the curve. You pay exactly this amount (a small trade fee applies).`}
          >
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.0001"
                value={initialBuy}
                onChange={(e) => setInitialBuy(e.target.value)}
                placeholder="0.0"
                className="w-full rounded-2xl border border-border bg-muted/10 px-4 py-3 pr-16 text-sm font-mono-num outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                {nativeSymbol}
              </span>
            </div>
          </Field>

          {/* Supply */}
          <Field
            label="Total supply"
            hint="Market-cap targets ($4k start, ~$44k graduation) are the same for any supply — only the price per token changes."
          >
            <div className="flex flex-wrap gap-2">
              {SUPPLIES.map((s) => {
                const active = supply === s.value;
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSupply(s.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "gradient-neon text-[#050505] neon-glow"
                        : "border border-border bg-muted/10 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Staking */}
          <Field
            label="Staking (optional)"
            hint="Enabling reserves 10% of supply as a staking pool; stakers pick their own lock (14/30/45/60d) and longer locks earn more. Sets the LP to 20%."
          >
            <div className="flex gap-2">
              {(["none", "enable"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStaking(opt)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                    staking === opt
                      ? "gradient-neon text-[#050505] neon-glow"
                      : "border border-border bg-muted/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt === "none" ? "None" : "Enable"}
                </button>
              ))}
            </div>
          </Field>

          {/* Fee address */}
          <Field
            label={
              <span>
                Fee address <span className="text-destructive">*</span>
              </span>
            }
            hint="Where your share of trade fees is paid (0.5% of every buy & sell, on the curve and after graduation). Fixed at launch."
          >
            <input
              value={feeAddress}
              onChange={(e) => setFeeAddress(e.target.value)}
              placeholder="0x… (the wallet that receives your fees)"
              className={`w-full rounded-2xl border bg-muted/10 px-4 py-3 text-sm font-mono-num outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50 ${
                feeAddress.length === 0
                  ? "border-border"
                  : feeValid
                    ? "border-success/50"
                    : "border-destructive/60"
              }`}
            />
            {address && (
              <button
                type="button"
                onClick={() => setFeeAddress(address)}
                className="mt-2 text-[11px] text-primary hover:underline"
              >
                Use connected wallet ({address.slice(0, 6)}…{address.slice(-4)})
              </button>
            )}
          </Field>

          {/* Socials */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Social links
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <SocialInput icon={<Twitter className="h-4 w-4" />} placeholder="X (Twitter)" value={x} onChange={setX} />
              <SocialInput icon={<Send className="h-4 w-4" />} placeholder="Telegram" value={tg} onChange={setTg} />
              <SocialInput icon={<MessageCircle className="h-4 w-4" />} placeholder="Discord" value={dc} onChange={setDc} />
              <SocialInput icon={<Github className="h-4 w-4" />} placeholder="GitHub" value={gh} onChange={setGh} />
              <SocialInput icon={<BookOpen className="h-4 w-4" />} placeholder="GitBook" value={gb} onChange={setGb} />
              <SocialInput icon={<Globe className="h-4 w-4" />} placeholder="Website" value={web} onChange={setWeb} />
            </div>
          </div>

          {/* Submit area */}
          <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
            {!address ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <p className="text-sm text-muted-foreground">Connect a wallet to launch.</p>
                <ConnectWalletButton />
              </div>
            ) : submitted ? (
              <div className="flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
                <Check className="h-4 w-4" />
                Launch draft prepared for {selectedChain?.name}. Smart-contract deployment will be wired in a
                future release.
              </div>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-neon px-6 py-3.5 text-sm font-bold text-[#050505] neon-glow transition hover:neon-glow-strong disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Preparing launch…
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" /> Launch on {selectedChain?.short ?? "network"}
                  </>
                )}
              </button>
            )}

            {address && !walletOnSelected && !selectedChain?.comingSoon && (
              <p className="mt-3 flex items-center gap-2 text-[11px] text-warning">
                <Info className="h-3 w-3" />
                Wallet is on a different network — use the switch button in the chain selector above.
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

/* ---------- small building blocks ---------- */

function Field({
  label,
  hint,
  children,
}: {
  label: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      {children}
      {hint && <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-border bg-muted/10 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50"
    />
  );
}

function SocialInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/10 px-3 py-2.5 focus-within:border-primary/50 transition">
      <span className="text-muted-foreground">{icon}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}

// Silence unused imports when tree-shaken
void ImageIcon;
