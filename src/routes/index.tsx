import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { default as CountUp } from "react-countup";
import {
  Zap, Coins, Building2, ShieldCheck, LayoutDashboard, LineChart, Wallet as WalletIcon,
  Droplets, Megaphone, Rocket, Cpu, ArrowRight, ArrowUpRight, Check, ChevronDown,
  Menu, X, Twitter, Send, Github, Sparkles, Lock, Layers, BarChart3,
} from "lucide-react";
import logoAsset from "@/assets/hudlabs-logo.png.asset.json";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

const OG_IMAGE =
  typeof window === "undefined"
    ? logoAsset.url
    : new URL(logoAsset.url, window.location.origin).toString();

export const Route = createFileRoute("/")({
  component: HudLabsLanding,
  head: () => ({
    meta: [
      { title: "HUDLABS — Premium Launchpad for Robinhood Chain" },
      {
        name: "description",
        content:
          "Launch dividend-enabled tokens, RWAs and enterprise-grade blockchain projects on Robinhood Chain with HUDLABS.",
      },
      { property: "og:title", content: "HUDLABS — Premium Launchpad for Robinhood Chain" },
      {
        property: "og:description",
        content:
          "Launch dividend-enabled tokens, RWAs and enterprise-grade blockchain projects on Robinhood Chain with HUDLABS.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:url", content: "/" },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:title", content: "HUDLABS — Premium Launchpad for Robinhood Chain" },
      {
        name: "twitter:description",
        content: "Empowering Innovation on Robinhood Chain. Built by ETHF Team.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

/* ---------------- Utilities ---------------- */

const ease = [0.22, 1, 0.36, 1] as const;

function FadeIn({
  children,
  delay = 0,
  y = 24,
  x = 0,
  blur = 8,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  blur?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Mouse Glow ---------------- */

function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl transition-transform"
      style={{
        background:
          "radial-gradient(circle, rgba(200,255,0,.22) 0%, rgba(200,255,0,.08) 30%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}

/* ---------------- Navbar ---------------- */

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <img src={logoAsset.url} alt="HUDLABS" className="h-9 w-9 drop-shadow-[0_0_16px_rgba(200,255,0,0.45)]" />
          <span className="font-display text-lg font-bold tracking-tight">HUDLABS</span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#launch"
            className="ml-1 rounded-full px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition"
          >
            Launch App
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://x.com/hudlabs"
            target="_blank" rel="noreferrer"
            aria-label="X"
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:border-primary/40 transition"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href="https://t.me/hudlabs"
            target="_blank" rel="noreferrer"
            aria-label="Telegram"
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:border-primary/40 transition"
          >
            <Send className="h-4 w-4" />
          </a>
          <ConnectWalletButton />
        </div>

        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden glass-strong border-t border-border"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#launch"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10"
              >
                Launch App
              </a>
              <div className="mt-2 pt-3 border-t border-border flex items-center gap-2">
                <ConnectWalletButton compact />
                <a href="https://x.com/hudlabs" target="_blank" rel="noreferrer" className="h-10 w-10 inline-flex items-center justify-center rounded-full glass"><Twitter className="h-4 w-4" /></a>
                <a href="https://t.me/hudlabs" target="_blank" rel="noreferrer" className="h-10 w-10 inline-flex items-center justify-center rounded-full glass"><Send className="h-4 w-4" /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------- Hero ---------------- */

function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0 hero-radial" />
      <motion.div style={{ y }} className="absolute inset-0 grid-bg" />
      {/* particles */}
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary"
          style={{
            left: `${(i * 47) % 100}%`,
            top: `${(i * 83) % 100}%`,
            boxShadow: "0 0 8px rgba(200,255,0,.9)",
          }}
          animate={{ opacity: [0.15, 0.9, 0.15], scale: [1, 1.6, 1] }}
          transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.1, delay: 0.4, ease }}
      className="relative mx-auto mt-20 max-w-5xl"
      style={{ perspective: 1400 }}
    >
      <div className="absolute -inset-6 gradient-neon opacity-20 blur-3xl rounded-3xl" />
      <div className="relative glass rounded-2xl p-4 md:p-6 shadow-[0_40px_120px_-20px_rgba(200,255,0,0.25)]">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5C5C]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFC64C]" />
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
          </div>
          <div className="text-xs font-mono-num text-muted-foreground">hudlabs.app/dashboard</div>
          <div className="flex items-center gap-1.5 text-xs text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-3">
          {[
            { label: "Total Value Locked", value: "$125.4M", delta: "+12.4%", icon: <LineChart className="h-4 w-4" /> },
            { label: "Active Projects", value: "1,250", delta: "+38", icon: <Rocket className="h-4 w-4" /> },
            { label: "Wallets Connected", value: "140,320", delta: "+2.1K", icon: <WalletIcon className="h-4 w-4" /> },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-black/40 p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs">{s.label}</span>
                <span className="text-primary">{s.icon}</span>
              </div>
              <div className="mt-2 font-display text-2xl font-semibold font-mono-num">{s.value}</div>
              <div className="mt-1 text-xs text-success font-mono-num">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-border bg-black/40 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>TVL / 30d</span>
            <span className="font-mono-num text-foreground">$125,412,908</span>
          </div>
          <svg viewBox="0 0 600 120" className="mt-3 h-24 w-full">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#c8ff00" stopOpacity="0.55" />
                <stop offset="1" stopColor="#c8ff00" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,90 C60,70 100,80 160,60 C220,40 260,70 320,50 C380,30 420,50 480,30 C540,15 580,25 600,20 L600,120 L0,120 Z"
              fill="url(#g)"
            />
            <path
              d="M0,90 C60,70 100,80 160,60 C220,40 260,70 320,50 C380,30 420,50 480,30 C540,15 580,25 600,20"
              fill="none" stroke="#c8ff00" strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden">
      <HeroBackground />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8 text-center">
        <FadeIn delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built exclusively for Robinhood Chain
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
            Empowering Innovation
            <br />
            <span className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#c8ff00_0%,#65ff66_50%,#9fef00_100%)]">
              on Robinhood Chain
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.25}>
          <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            HUDLABS is a premium launchpad designed to simplify token creation, dividend-enabled
            projects and Real World Asset tokenization — with enterprise-grade security and
            an exceptional user experience.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#launch"
              className="group inline-flex items-center gap-2 rounded-full gradient-neon px-7 py-3.5 text-sm font-semibold text-[#050505] neon-glow hover:neon-glow-strong transition-all hover:scale-[1.02]"
            >
              Launch App
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold hover:border-primary/40 transition"
            >
              Learn More
            </a>
          </div>
        </FadeIn>

        <DashboardPreview />
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */

const STATS = [
  { label: "Projects", end: 1250, suffix: "+" },
  { label: "Users", end: 52, suffix: "K+" },
  { label: "Wallets Connected", end: 140, suffix: "K+" },
  { label: "TVL", prefix: "$", end: 125, suffix: "M" },
  { label: "Transactions", end: 18, suffix: "M+" },
];

function StatItem({ s }: { s: (typeof STATS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-3xl md:text-5xl font-bold font-mono-num neon-text">
        {s.prefix}
        {inView ? <CountUp end={s.end} duration={2.4} separator="," /> : 0}
        {s.suffix}
      </div>
      <div className="mt-2 text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
        {s.label}
      </div>
    </div>
  );
}

function LiveStats() {
  return (
    <section className="relative border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 md:grid-cols-5 md:px-8">
        {STATS.map((s) => (
          <StatItem key={s.label} s={s} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */

function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center">
        <FadeIn>
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-primary">About HUDLABS</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold leading-tight">
              The launchpad Robinhood Chain deserves.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              HUDLABS is a premium, user-centric launchpad built exclusively for Robinhood Chain.
              We simplify token creation with a beautiful, secure and intuitive platform that
              lets founders, communities and businesses launch blockchain projects without
              technical complexity.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Dividend-enabled tokens, Real World Asset tokenization and professional launch
              tools — everything you need to build lasting ecosystems.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Built by <span className="font-semibold text-foreground">ETHF Team</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn x={40} delay={0.1}>
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {[
                { icon: <ShieldCheck className="h-5 w-5" />, k: "Audited", v: "Security first" },
                { icon: <Layers className="h-5 w-5" />, k: "Modular", v: "Composable stack" },
                { icon: <Lock className="h-5 w-5" />, k: "Non-custodial", v: "Your keys" },
                { icon: <BarChart3 className="h-5 w-5" />, k: "Real-time", v: "Live analytics" },
              ].map((c, i) => (
                <motion.div
                  key={c.k}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease }}
                  className="glass hover-elevate rounded-2xl p-5"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg gradient-neon text-[#050505]">
                    {c.icon}
                  </div>
                  <div className="mt-4 font-display text-lg font-semibold">{c.k}</div>
                  <div className="text-sm text-muted-foreground">{c.v}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */

const FEATURES = [
  { icon: Zap, title: "Lightning Fast Token Creation", desc: "Deploy production-grade tokens in minutes with a guided, no-code flow." },
  { icon: Coins, title: "Dividend Enabled Tokens", desc: "Reward holders automatically with configurable dividend distribution." },
  { icon: Building2, title: "Real World Asset Support", desc: "Tokenize revenue, real estate and off-chain assets with compliance-first tooling." },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "Audited templates, granular permissions and multisig-ready architecture." },
  { icon: LayoutDashboard, title: "Modern Dashboard", desc: "A refined control center for every project you launch on Robinhood Chain." },
  { icon: LineChart, title: "Professional Analytics", desc: "Real-time metrics, holder distribution and TVL trends at a glance." },
  { icon: WalletIcon, title: "Treasury Management", desc: "Track balances, allocate spend and manage runway across wallets." },
  { icon: Droplets, title: "Liquidity Management", desc: "Bootstrap and steward liquidity with fair, transparent primitives." },
  { icon: Megaphone, title: "Marketing Toolkit", desc: "Landing pages, campaigns and community tooling in one integrated suite." },
  { icon: Rocket, title: "Launch Assistant", desc: "Guided launch checklists and best-practice presets from ETHF Team." },
  { icon: Cpu, title: "Future Smart Contract Ready", desc: "Frontend architecture prepared for seamless on-chain integration." },
];

function Features() {
  return (
    <section id="features" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeIn>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-primary">Features</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold leading-tight">
              Every primitive a serious builder needs.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A refined, opinionated toolkit — engineered for founders who care about their launch.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease }}
              className="glass hover-elevate group relative overflow-hidden rounded-2xl p-6"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:gradient-neon group-hover:text-[#050505] transition">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Products ---------------- */

const PRODUCTS = [
  { name: "Token Creator", tag: "Core", desc: "Launch ERC-20 tokens with dividend, tax and vesting presets." },
  { name: "Dividend Manager", tag: "Rewards", desc: "Distribute revenue and rewards to holders on schedule." },
  { name: "RWA Platform", tag: "Institutional", desc: "Tokenize off-chain assets with compliance-ready primitives." },
  { name: "Analytics Dashboard", tag: "Insights", desc: "Deep visibility into holders, TVL and on-chain activity." },
  { name: "Treasury", tag: "Operations", desc: "Multisig-ready wallets, allocations and financial reporting." },
  { name: "Launchpad", tag: "Distribution", desc: "Fair launches, whitelists and vesting schedules." },
  { name: "Liquidity", tag: "Markets", desc: "Bootstrap and manage pools across supported venues." },
  { name: "Portfolio", tag: "Investors", desc: "A unified view for every position across HUDLABS." },
];

function Products() {
  return (
    <section id="products" className="relative py-28 md:py-36 border-t border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.25em] text-primary">Products</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold leading-tight">
                A complete suite. One elegant surface.
              </h2>
            </div>
            <a href="#launch" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Explore all <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <motion.a
              key={p.name}
              href="#launch"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.6, ease }}
              className="glass hover-elevate group relative flex flex-col justify-between rounded-2xl p-5 min-h-[180px]"
            >
              <div>
                <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                  {p.tag}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Coming soon</span>
                <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Roadmap ---------------- */

const ROADMAP = [
  { phase: "Phase 1", status: "Live", items: ["Website", "Wallet", "Dashboard", "Community"] },
  { phase: "Phase 2", status: "Building", items: ["Token Creator", "Launchpad", "Analytics"] },
  { phase: "Phase 3", status: "Next", items: ["Dividend", "Liquidity", "Treasury"] },
  { phase: "Phase 4", status: "Vision", items: ["Real World Assets", "Governance", "Cross Chain"] },
];

function Roadmap() {
  return (
    <section id="roadmap" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <FadeIn>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-primary">Roadmap</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold leading-tight">
              A deliberate path to scale.
            </h2>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((r, i) => (
            <motion.div
              key={r.phase}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease }}
              className="glass hover-elevate rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-num text-xs text-muted-foreground uppercase tracking-widest">
                  {r.phase}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 border ${
                    r.status === "Live"
                      ? "bg-primary/15 text-primary border-primary/30"
                      : r.status === "Building"
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-white/5 text-muted-foreground border-border"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {r.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQS = [
  { q: "What is HUDLABS?", a: "HUDLABS is a premium, user-centric launchpad built exclusively for Robinhood Chain. It simplifies token creation, dividend-enabled projects and Real World Asset tokenization." },
  { q: "Why Robinhood Chain?", a: "Robinhood Chain provides the performance, distribution and reach we believe next-generation on-chain products deserve. HUDLABS is designed to make that surface effortless for founders." },
  { q: "How do I connect my wallet?", a: "Click Connect Wallet in the navbar, choose your wallet, approve the connection request and you're in. HUDLABS reads your address, network and native balance — no signatures required." },
  { q: "What wallets are supported?", a: "Robinhood Wallet, MetaMask, Rabby, OKX Wallet, Backpack, Coinbase Wallet and WalletConnect-compatible wallets." },
  { q: "Is HUDLABS secure?", a: "Yes. HUDLABS is non-custodial and never touches your keys. Contracts and integrations follow an audit-first approach with enterprise-grade practices." },
  { q: "What products are available?", a: "Token Creator, Dividend Manager, RWA Platform, Analytics, Treasury, Launchpad, Liquidity and Portfolio — with more shipping through 2026." },
];

function FaqItem({ item, i }: { item: (typeof FAQS)[number]; i: number }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.05, ease }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-base md:text-lg font-medium">{item.q}</span>
        <ChevronDown
          className={`h-5 w-5 text-primary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQ() {
  return (
    <section id="faq" className="relative py-28 md:py-36 border-t border-border bg-surface/30">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <FadeIn>
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-primary">FAQ</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold leading-tight">
              Frequently asked.
            </h2>
          </div>
        </FadeIn>
        <div className="mt-14 space-y-3">
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} item={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Community CTA ---------------- */

function Community() {
  return (
    <section id="launch" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,255,0,0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-4 md:px-8 text-center">
        <FadeIn>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Ready to build <span className="neon-text">the future?</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg">
            Launch with confidence on HUDLABS.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#home"
              className="inline-flex items-center gap-2 rounded-full gradient-neon px-7 py-3.5 text-sm font-semibold text-[#050505] neon-glow hover:neon-glow-strong transition"
            >
              Launch App <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://t.me/hudlabs"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold hover:border-primary/40 transition"
            >
              <Send className="h-4 w-4" /> Join Telegram
            </a>
            <a
              href="https://x.com/hudlabs"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold hover:border-primary/40 transition"
            >
              <Twitter className="h-4 w-4" /> Follow X
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src={logoAsset.url} alt="HUDLABS" className="h-9 w-9 drop-shadow-[0_0_16px_rgba(200,255,0,0.4)]" />
            <span className="font-display text-lg font-bold">HUDLABS</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Empowering Innovation on Robinhood Chain.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Built by ETHF Team.</p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Menu</div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["Home", "#home"],
              ["Features", "#features"],
              ["Products", "#products"],
              ["Roadmap", "#roadmap"],
              ["FAQ", "#faq"],
              ["Launch App", "#launch"],
            ].map(([l, h]) => (
              <li key={l}><a href={h} className="text-muted-foreground hover:text-foreground transition">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Social</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="https://x.com/hudlabs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><Twitter className="h-4 w-4" /> X</a></li>
            <li><a href="https://t.me/hudlabs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><Send className="h-4 w-4" /> Telegram</a></li>
            <li><a href="https://github.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><Github className="h-4 w-4" /> Github</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} HUDLABS. All rights reserved.</span>
          <span className="font-mono-num">Robinhood Chain · Mainnet</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Lenis smooth scroll ---------------- */

function useLenis() {
  useEffect(() => {
    let lenis: { destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;
    (async () => {
      const Lenis = (await import("lenis")).default;
      if (cancelled) return;
      const instance = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis = instance;
      const loop = (t: number) => {
        instance.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
}

/* ---------------- Page ---------------- */

function HudLabsLanding() {
  useLenis();
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <MouseGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <LiveStats />
        <About />
        <Features />
        <Products />
        <Roadmap />
        <FAQ />
        <Community />
      </main>
      <Footer />
    </div>
  );
}
