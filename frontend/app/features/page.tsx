"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Link2, Layout, BarChart3, QrCode, Globe, Users, ChevronRight, Zap, Shield, Smartphone, Sparkles, Check } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  Particles,
  ShimmerButton,
} from "@/components/ui/animated";

const FEATURES = [
  { title: "Link Shortening", desc: "Create clean, custom short links that build trust and drive clicks. Full custom alias support.", icon: Link2, color: "bg-terracotta-50 text-terracotta-600 dark:bg-terracotta-900/30 dark:text-terracotta-400" },
  { title: "Bio Pages", desc: "Design beautiful link-in-bio pages in minutes. Fully customizable with blocks, themes, and branding.", icon: Layout, color: "bg-forest-50 text-forest-600 dark:bg-forest-900/30 dark:text-forest-400" },
  { title: "Analytics", desc: "See who clicks, where, and when. Real-time data on locations, devices, referrers, and trends.", icon: BarChart3, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { title: "QR Codes", desc: "Generate branded QR codes for any link. Download in multiple sizes and formats.", icon: QrCode, color: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400" },
  { title: "Custom Domains", desc: "Use your own domain for a professional, branded experience. Easy DNS setup.", icon: Globe, color: "bg-terracotta-50 text-terracotta-600 dark:bg-terracotta-900/30 dark:text-terracotta-400" },
  { title: "Team Workspaces", desc: "Collaborate with your team. Set roles, permissions, and shared analytics.", icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { title: "API Access", desc: "Integrate link management directly into your tools and workflows via our REST API.", icon: Zap, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { title: "Privacy Controls", desc: "Password protection, expiration dates, and link deactivation for full control.", icon: Shield, color: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400" },
  { title: "Mobile Ready", desc: "Everything works seamlessly on every device. Native-feeling mobile experience.", icon: Smartphone, color: "bg-forest-50 text-forest-600 dark:bg-forest-900/30 dark:text-forest-400" },
];

const HIGHLIGHTS = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<50ms", label: "Avg. redirect time" },
  { value: "50K+", label: "Active users" },
  { value: "150+", label: "Countries served" },
];

const DETAILS = [
  {
    title: "Advanced Link Management",
    desc: "Create, organize, and manage unlimited links with custom aliases, tags, and expiration rules. Bulk import and export supported.",
    features: ["Custom short codes", "Expiration dates", "Password protection", "Bulk operations", "Tag & filter"],
  },
  {
    title: "Beautiful Bio Pages",
    desc: "Build stunning link-in-bio landing pages with drag-and-drop blocks. Custom themes, brand colors, and fonts.",
    features: ["Drag-and-drop editor", "Custom themes", "Social icons", "Analytics tracking", "SEO optimized"],
  },
  {
    title: "Powerful Analytics",
    desc: "Understand your audience with comprehensive click data. Export reports, track conversions, and measure ROI.",
    features: ["Real-time dashboard", "Geo-location data", "Device tracking", "Referrer analysis", "CSV exports"],
  },
];

export default function FeaturesPage() {
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
            <Link href="/pricing" className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Pricing</Link>
            <Link href="/login" className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Sign in</Link>
            <Link href="/register"><Button>Get Started</Button></Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden bg-neutral-50 pt-32 pb-24 dark:bg-neutral-950">
          <div className="pointer-events-none absolute inset-0 bg-grid" />
          <Particles quantity={15} color="212 120 68" size={{ min: 2, max: 4 }} speed={{ min: 12, max: 25 }} />
          <div className="mx-auto max-w-6xl px-6 relative">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-500 shadow-sm mb-6 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
                Everything you need in one platform
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.05] dark:text-neutral-50">
                A complete toolkit for{" "}
                <span className="text-terracotta-500">every link</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500 leading-relaxed dark:text-neutral-400">
                Shorten, organize, track, and optimize every link you share. One platform for creators, marketers, and teams.
              </p>
              <AnimatedSection delay={0.3} direction="none" className="mt-8 flex items-center justify-center gap-3">
                <Link href="/register">
                  <ShimmerButton className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                    Start Free
                    <ChevronRight className="h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg">See Pricing</Button>
                </Link>
              </AnimatedSection>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ Stats ═══ */}
        <section className="border-y border-neutral-100 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {HIGHLIGHTS.map((h) => (
                <StaggerItem key={h.label} className="text-center">
                  <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{h.value}</p>
                  <p className="mt-1 text-sm text-neutral-500">{h.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ All Features ═══ */}
        <section className="bg-white py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Every feature you need
              </h2>
              <p className="mt-2 text-base text-neutral-500 dark:text-neutral-400">
            No bloat. Just powerful tools that work together seamlessly.
              </p>
            </AnimatedSection>

            <StaggerContainer className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <StaggerItem key={f.title}>
                    <HoverCard
                      glowColor="rgb(212 120 68 / 0.08)"
                      className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-700"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-semibold text-neutral-800 dark:text-neutral-200">{f.title}</h3>
                      <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">{f.desc}</p>
                    </HoverCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ Deep Dive Sections ═══ */}
        <section className="bg-neutral-50 py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-500 tracking-wide uppercase dark:text-terracotta-400">Deep dive</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Built for power users
              </h2>
            </AnimatedSection>

            <div className="mt-14 space-y-6">
              {DETAILS.map((detail, i) => (
                <AnimatedSection key={detail.title} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className="rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="grid items-start gap-8 md:grid-cols-2">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{detail.title}</h3>
                        <p className="mt-2 text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">{detail.desc}</p>
                      </div>
                      <div>
                        <ul className="grid grid-cols-2 gap-3">
                          {detail.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <Check className="h-4 w-4 shrink-0 text-forest-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="bg-white py-20 dark:bg-neutral-950">
          <AnimatedSection className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Ready to simplify your links?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-500 dark:text-neutral-400">
              Join 50,000+ creators and teams already using LinkNest.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/register">
                <ShimmerButton className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                  Get Started Free
                  <ChevronRight className="h-4 w-4" />
                </ShimmerButton>
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white">L</div>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">LinkNest</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Home</Link>
              <Link href="/pricing" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Pricing</Link>
              <Link href="/about" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">About</Link>
              <Link href="/contact" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Contact</Link>
              <Link href="/login" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
