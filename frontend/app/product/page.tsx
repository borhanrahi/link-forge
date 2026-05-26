"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import {
  Link2, Layout, BarChart3, QrCode, Globe, Users,
  ChevronRight, ArrowUpRight, ArrowRight,
  Sparkles, Check, Zap, Shield,
} from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  Spotlight,
  TextReveal,
  HoverCard,
  ShimmerButton,
  Particles,
} from "@/components/ui/animated";

const PRODUCT_FEATURES = [
  {
    title: "Short Links",
    desc: "Clean, custom, trackable short links with full alias support. Build trust and drive clicks with branded URLs.",
    icon: Link2,
    highlights: ["Custom aliases", "Expiration dates", "Password protection", "Bulk creation"],
  },
  {
    title: "Bio Pages",
    desc: "Stunning link-in-bio landing pages with drag-and-drop blocks. Fully customizable themes, colors, and fonts.",
    icon: Layout,
    highlights: ["Drag-and-drop editor", "Custom themes", "Social icons", "SEO optimized"],
  },
  {
    title: "Analytics",
    desc: "Real-time click data including locations, devices, referrers, and trends. Know exactly what works.",
    icon: BarChart3,
    highlights: ["Real-time dashboard", "Geo data", "Device tracking", "CSV exports"],
  },
  {
    title: "QR Codes",
    desc: "Branded QR codes for any link. Download in multiple sizes and formats. Scan-to-link in seconds.",
    icon: QrCode,
    highlights: ["Branded designs", "Multiple formats", "High resolution", "Bulk generation"],
  },
  {
    title: "Custom Domains",
    desc: "Use your own domain for a professional branded experience. Easy DNS setup with step-by-step guidance.",
    icon: Globe,
    highlights: ["Branded domains", "SSL automatic", "Easy DNS setup", "Multiple domains"],
  },
  {
    title: "Team Workspaces",
    desc: "Collaborate with your team. Set roles, permissions, and shared analytics across your organization.",
    icon: Users,
    highlights: ["Role management", "Shared analytics", "Activity logs", "Unlimited members"],
  },
  {
    title: "API Access",
    desc: "Integrate link management into your tools and workflows via our powerful REST API and webhooks.",
    icon: Zap,
    highlights: ["REST API", "Webhooks", "Rate limiting", "API keys"],
  },
  {
    title: "Security & Privacy",
    desc: "Enterprise-grade security with encryption, SSO, audit logs, and compliance controls.",
    icon: Shield,
    highlights: ["Encryption", "SSO/SAML", "Audit logs", "GDPR compliant"],
  },
];

const PRODUCT_HIGHLIGHTS = [
  { value: "10M+", label: "links created" },
  { value: "50K+", label: "active users" },
  { value: "99.9%", label: "uptime SLA" },
  { value: "<50ms", label: "avg redirect" },
];

export default function ProductPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-lg dark:border-neutral-800/60 dark:bg-neutral-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white transition-transform duration-200 group-hover:scale-105">
              L
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">LinkNest</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-6">
            <Link href="/features" className="hidden sm:inline text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Features</Link>
            <Link href="/pricing" className="hidden sm:inline text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Pricing</Link>
            <Link href="/login" className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Sign in</Link>
            <Link href="/register"><Button>Get Started</Button></Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden bg-neutral-50 pt-32 pb-24 dark:bg-neutral-950">
          <div className="pointer-events-none absolute inset-0 bg-grid" />
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          <Particles quantity={15} color="212 120 68" size={{ min: 2, max: 4 }} speed={{ min: 12, max: 25 }} />
          <div className="mx-auto max-w-6xl px-6 relative">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-500 shadow-sm mb-6 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
                The complete link management platform
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.05] dark:text-neutral-50">
                Everything you need to{" "}
                <span className="text-terracotta-500">own your links</span>
              </h1>
              <TextReveal
                text="Shorten, organize, track, and optimize every link you share. One platform. Infinite possibilities."
                className="mx-auto mt-4 max-w-lg text-base text-neutral-500 leading-relaxed dark:text-neutral-400"
                delay={0.15}
              />
              <AnimatedSection delay={0.3} direction="none" className="mt-8 flex items-center justify-center gap-3">
                <Link href="/register">
                  <ShimmerButton className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                    Start Free
                    <ChevronRight className="h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg">Explore features</Button>
                </Link>
              </AnimatedSection>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ Stats ═══ */}
        <section className="bg-neutral-900 py-14 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-neutral-800">
              {PRODUCT_HIGHLIGHTS.map((h) => (
                <StaggerItem key={h.label} className="text-center md:px-8">
                  <p className="text-3xl font-bold tracking-tight text-white">{h.value}</p>
                  <p className="mt-1 text-sm text-neutral-500">{h.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ Features Grid ═══ */}
        <section className="bg-white py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Powerful features, beautifully simple
              </h2>
              <p className="mt-2 text-base text-neutral-500 dark:text-neutral-400">
                Everything you need to manage, track, and optimize your links.
              </p>
            </AnimatedSection>

            <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.06}>
              {PRODUCT_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <StaggerItem key={f.title}>
                    <HoverCard
                      glowColor="rgb(212 120 68 / 0.08)"
                      className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-700 h-full"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-900/30 dark:text-terracotta-400 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-semibold text-neutral-800 dark:text-neutral-200">{f.title}</h3>
                      <p className="mt-1 text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">{f.desc}</p>
                      <ul className="mt-3 space-y-1">
                        {f.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                            <Check className="h-3 w-3 shrink-0 text-forest-500" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </HoverCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative overflow-hidden bg-neutral-900 py-20 dark:bg-neutral-950">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <Particles quantity={15} color="255 255 255" size={{ min: 2, max: 4 }} speed={{ min: 10, max: 22 }} />
          <AnimatedSection className="mx-auto max-w-6xl px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to take control?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-500">
              Join 50,000+ creators and teams who trust LinkNest.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/register">
                <ShimmerButton className="bg-white text-neutral-900 hover:bg-neutral-100">
                  Get Started Free
                  <ChevronRight className="h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                  See pricing
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white">L</div>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">LinkNest</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Home</Link>
              <Link href="/features" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Features</Link>
              <Link href="/pricing" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Pricing</Link>
              <Link href="/login" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
