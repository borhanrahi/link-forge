"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { ChevronRight, Sparkles, Check, ArrowRight } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  Particles,
  ShimmerButton,
} from "@/components/ui/animated";

const INTEGRATIONS_LIST = [
  { category: "Communication", items: [
    { name: "Slack", desc: "Post link updates to any channel automatically." },
    { name: "Discord", desc: "Share new links with your community." },
    { name: "Telegram", desc: "Auto-post links to Telegram channels." },
    { name: "Email", desc: "Send link analytics reports via email." },
  ]},
  { category: "Automation", items: [
    { name: "Zapier", desc: "Connect with 5,000+ apps and services." },
    { name: "Make", desc: "Build complex automation workflows." },
    { name: "n8n", desc: "Self-hosted workflow automation." },
    { name: "IFTTT", desc: "Simple triggers for your links." },
  ]},
  { category: "Analytics", items: [
    { name: "Google Analytics", desc: "Sync click data directly to GA4." },
    { name: "Mixpanel", desc: "Track link events in Mixpanel." },
    { name: "Amplitude", desc: "Send link interactions to Amplitude." },
    { name: "Plausible", desc: "Privacy-friendly analytics integration." },
  ]},
  { category: "Social & Content", items: [
    { name: "Notion", desc: "Embed your links in any Notion page." },
    { name: "Twitter / X", desc: "Auto-shorten links from the compose box." },
    { name: "Instagram", desc: "Swap bio links on schedule." },
    { name: "WordPress", desc: "Shorten links directly from your WP dashboard." },
  ]},
  { category: "Developer Tools", items: [
    { name: "GitHub", desc: "Track link clicks from your repos." },
    { name: "Vercel", desc: "Deploy link management integrations." },
    { name: "Netlify", desc: "Serverless functions for link processing." },
    { name: "Railway", desc: "Host your link management workflows." },
  ]},
  { category: "CRM & Sales", items: [
    { name: "HubSpot", desc: "Track link clicks in your CRM." },
    { name: "Salesforce", desc: "Sync link analytics to Salesforce." },
    { name: "Pipedrive", desc: "Log link interactions in deals." },
    { name: "Close", desc: "Track email link clicks." },
  ]},
];

export default function IntegrationsPage() {
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
          <Particles quantity={15} color="212 120 68" size={{ min: 2, max: 4 }} speed={{ min: 12, max: 25 }} />
          <div className="mx-auto max-w-6xl px-6 relative">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-500 shadow-sm mb-6 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
                Connect with your favorite tools
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.05] dark:text-neutral-50">
                Integrations that{" "}
                <span className="text-terracotta-500">work for you</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500 leading-relaxed dark:text-neutral-400">
                LinkNest connects with the tools you already use. No friction, just seamless link management across your entire workflow.
              </p>
              <AnimatedSection delay={0.3} direction="none" className="mt-8 flex items-center justify-center gap-3">
                <Link href="/register">
                  <ShimmerButton className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                    Start Free
                    <ChevronRight className="h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Link href="/api">
                  <Button variant="outline" size="lg">API Reference</Button>
                </Link>
              </AnimatedSection>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ Integrations Grid ═══ */}
        <section className="bg-white py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            {INTEGRATIONS_LIST.map((group, gi) => (
              <div key={group.category} className="mb-16 last:mb-0">
                <AnimatedSection>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{group.category}</h2>
                  <div className="mt-2 h-px w-12 bg-terracotta-400" />
                </AnimatedSection>
                <StaggerContainer className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.04}>
                  {group.items.map((item) => (
                    <StaggerItem key={item.name}>
                      <HoverCard
                        glowColor="rgb(212 120 68 / 0.06)"
                        className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 transition-all duration-200 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                      >
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">{item.name}</p>
                        <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed dark:text-neutral-400">{item.desc}</p>
                      </HoverCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative overflow-hidden bg-neutral-900 py-20 dark:bg-neutral-950">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <Particles quantity={15} color="255 255 255" size={{ min: 2, max: 4 }} speed={{ min: 10, max: 22 }} />
          <AnimatedSection className="mx-auto max-w-6xl px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Don't see your tool?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-500">
              We're adding new integrations every week. Or use our API to build your own.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/register">
                <ShimmerButton className="bg-white text-neutral-900 hover:bg-neutral-100">
                  Get Started Free
                  <ChevronRight className="h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Link href="/api">
                <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                  API Reference
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
