"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { ChevronRight, Sparkles, Check, Code, Zap, Shield, Globe, ArrowRight } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  Spotlight,
  HoverCard,
  ShimmerButton,
  Particles,
} from "@/components/ui/animated";

const API_FEATURES = [
  { title: "RESTful API", desc: "Simple, predictable REST endpoints for all link management operations.", icon: Code },
  { title: "Webhook Events", desc: "Real-time webhook notifications for link clicks, creation, and updates.", icon: Zap },
  { title: "Authentication", desc: "API key-based auth with granular permissions and rate limiting.", icon: Shield },
  { title: "Global Edge", desc: "Lightning-fast redirects served from our global edge network.", icon: Globe },
];

const API_ENDPOINTS = [
  { method: "GET", endpoint: "/api/v1/links", desc: "List all links" },
  { method: "POST", endpoint: "/api/v1/links", desc: "Create a short link" },
  { method: "GET", endpoint: "/api/v1/links/:id", desc: "Get link details" },
  { method: "PATCH", endpoint: "/api/v1/links/:id", desc: "Update a link" },
  { method: "DELETE", endpoint: "/api/v1/links/:id", desc: "Delete a link" },
  { method: "GET", endpoint: "/api/v1/analytics/:id", desc: "Get link analytics" },
];

export default function APIPage() {
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
                Developer-first API
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.05] dark:text-neutral-50">
                Build with{" "}
                <span className="text-terracotta-500">LinkNest</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500 leading-relaxed dark:text-neutral-400">
                Integrate link management directly into your product. Our REST API and webhooks make it effortless.
              </p>
              <AnimatedSection delay={0.3} direction="none" className="mt-8 flex items-center justify-center gap-3">
                <Link href="/register">
                  <ShimmerButton className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                    Get API Access
                    <ChevronRight className="h-4 w-4" />
                  </ShimmerButton>
                </Link>
              </AnimatedSection>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ Features ═══ */}
        <section className="bg-white py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
              {API_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <StaggerItem key={f.title}>
                    <HoverCard
                      glowColor="rgb(212 120 68 / 0.08)"
                      className="group rounded-xl border border-neutral-200 bg-neutral-50 p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-700"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-900/30 dark:text-terracotta-400 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-semibold text-neutral-800 dark:text-neutral-200">{f.title}</h3>
                      <p className="mt-1 text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">{f.desc}</p>
                    </HoverCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ Endpoints ═══ */}
        <section className="bg-neutral-50 py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-500 tracking-wide uppercase dark:text-terracotta-400">Endpoints</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Simple, predictable API
              </h2>
              <p className="mt-2 text-base text-neutral-500 dark:text-neutral-400">
                Clean REST endpoints for all your link management needs.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="mt-12 mx-auto max-w-3xl">
              <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
                <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">LinkNest API v1</span>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {API_ENDPOINTS.map((ep) => (
                    <div key={ep.endpoint} className="flex items-center gap-4 px-5 py-3.5 text-sm">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider ${
                        ep.method === "GET" ? "bg-forest-50 text-forest-600 dark:bg-forest-900/30 dark:text-forest-400" :
                        ep.method === "POST" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                        ep.method === "PATCH" ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-rust-50 text-rust-600 dark:bg-rust-900/30 dark:text-rust-400"
                      }`}>
                        {ep.method}
                      </span>
                      <code className="font-mono text-neutral-800 dark:text-neutral-200">{ep.endpoint}</code>
                      <span className="ml-auto text-neutral-500 hidden sm:inline">{ep.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative overflow-hidden bg-neutral-900 py-20 dark:bg-neutral-950">
          <Particles quantity={15} color="255 255 255" size={{ min: 2, max: 4 }} speed={{ min: 10, max: 22 }} />
          <AnimatedSection className="mx-auto max-w-6xl px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to integrate?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-500">
              Get your API keys and start building in minutes.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/register">
                <ShimmerButton className="bg-white text-neutral-900 hover:bg-neutral-100">
                  Get API Access
                  <ChevronRight className="h-4 w-4" />
                </ShimmerButton>
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
