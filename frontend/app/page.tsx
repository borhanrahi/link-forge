"use client";

import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import { PublicHeader } from "@/components/layout/PublicHeader";
import {
  Link2, Layout, BarChart3, QrCode, Globe, Users,
  ChevronRight, ArrowUpRight,
  Sparkles, Star, Check, Quote,
  TrendingUp, Rocket, Shield,
  Youtube,
  ArrowRight,
} from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  Spotlight,
  TextReveal,
  HoverCard,
  GradientBorder,
  ShimmerButton,
  FlipWords,
  Accordion,
  WobbleCard,
  Particles,
  Marquee,
} from "@/components/ui/animated";

const FEATURES = [
  { title: "Short Links", desc: "Clean, custom, trackable links your audience trusts at a glance.", icon: Link2, color: "bg-terracotta-900/30 text-terracotta-400" },
  { title: "Bio Pages", desc: "A single, stunning page for all your content. Your corner of the internet.", icon: Layout, color: "bg-forest-900/30 text-forest-400" },
  { title: "Analytics", desc: "Know what works. Real-time clicks, locations, referrers, and devices.", icon: BarChart3, color: "bg-blue-900/30 text-blue-400" },
  { title: "QR Codes", desc: "Branded QR codes that look good everywhere. Scan-to-link in seconds.", icon: QrCode, color: "bg-neutral-800 text-neutral-400" },
  { title: "Custom Domains", desc: "Your brand, your domain. Professional links that build recognition.", icon: Globe, color: "bg-terracotta-900/30 text-terracotta-400" },
  { title: "Team Workspaces", desc: "Collaborate with your team. Permissions, roles, and shared analytics.", icon: Users, color: "bg-blue-900/30 text-blue-400" },
];

const STEPS = [
  { num: "01", title: "Create your account", desc: "Sign up free in under 30 seconds. No credit card needed." },
  { num: "02", title: "Shorten your first link", desc: "Paste your URL, customize it, and generate a clean short link." },
  { num: "03", title: "Share everywhere", desc: "Post on social media, email, or your website. Watch the clicks roll in." },
  { num: "04", title: "Track & optimize", desc: "See what's working. Refine your strategy based on real data." },
];

const TESTIMONIALS = [
  { quote: "LinkNest completely changed how we manage our campaign links. The analytics alone saved us hours every week.", name: "Sarah Chen", role: "Marketing Director, Pulse", rating: 5 },
  { quote: "We switched from our old link manager and never looked back. The bio pages are gorgeous out of the box.", name: "Marcus Johnson", role: "Creator & Podcaster", rating: 5 },
  { quote: "Having custom domains, QR codes, and analytics in one place is a game changer for our agency.", name: "Elena Rodriguez", role: "CEO, Brightside Studio", rating: 5 },
  { quote: "The API is fantastic. We integrated LinkNest into our entire content workflow in an afternoon.", name: "Alex Kim", role: "CTO, DataFlow Inc.", rating: 5 },
  { quote: "Our click-through rates jumped 40% after switching to branded short links. The difference is real.", name: "Priya Sharma", role: "Growth Lead, Beacon", rating: 5 },
  { quote: "I've tried a dozen link managers. LinkNest is the only one that combines beauty with real utility.", name: "James Wilson", role: "Independent Creator", rating: 5 },
];

const INTEGRATIONS = [
  { name: "Slack", desc: "Post link updates to any channel" },
  { name: "Zapier", desc: "Connect with 5,000+ apps" },
  { name: "Google Analytics", desc: "Sync click data effortlessly" },
  { name: "Notion", desc: "Embed links in any page" },
  { name: "Twitter / X", desc: "Auto-shorten from the compose box" },
  { name: "Instagram", desc: "Swap bio links on schedule" },
];

const USE_CASES = [
  {
    title: "For Creators",
    desc: "Build your digital storefront with a single bio link. Share content, grow your audience, and track what resonates.",
    icon: Youtube,
    features: ["Link-in-bio pages", "Content analytics", "QR codes for events"],
  },
  {
    title: "For Marketers",
    desc: "Run campaigns with confidence. Track every click, optimize your channels, and prove ROI with data you can trust.",
    icon: TrendingUp,
    features: ["Campaign tracking", "UTM builder", "Team collaboration"],
  },
  {
    title: "For Agencies",
    desc: "Manage multiple client accounts from one dashboard. White-label links and deliver professional reports.",
    icon: Rocket,
    features: ["Multi-workspace", "White labeling", "Client reporting"],
  },
  {
    title: "For Developers",
    desc: "Integrate link management directly into your product. Our REST API and webhooks make it effortless.",
    icon: Shield,
    features: ["REST API", "Webhook events", "Custom integrations"],
  },
];

const FAQ_ITEMS = [
  {
    title: "What is LinkNest?",
    content: "LinkNest is a link management platform that lets you shorten URLs, create bio pages, generate QR codes, and track analytics — all from one beautiful dashboard. It's designed for creators, marketers, and teams who want to own their links.",
  },
  {
    title: "Is there a free plan?",
    content: "Yes! Our Free plan includes 100 links, basic analytics, and 1 bio page — forever, with no credit card required. Upgrade to Pro when you're ready for unlimited links and advanced features.",
  },
  {
    title: "Can I use my own domain?",
    content: "Absolutely. Custom domains are available on our Pro and Business plans. You can set up your own branded short domain (like link.yourbrand.com) in just a few minutes with our easy DNS configuration guide.",
  },
  {
    title: "How do bio pages work?",
    content: "Bio pages are single-page link-in-bio landing pages that aggregate all your important links. You can customize the design, add blocks (links, text, images, social icons), and publish with your own domain or a LinkNest subdomain. Perfect for Instagram, TikTok, and other profile-link use cases.",
  },
  {
    title: "What analytics do you provide?",
    content: "We track clicks, unique visitors, referrer sources, geographic locations, devices, and browsers in real time. Pro plans add exportable reports, UTM parameter tracking, and advanced filtering. All data updates instantly in your dashboard.",
  },
  {
    title: "Can I collaborate with my team?",
    content: "Yes! Team workspaces let you invite team members, set roles and permissions, and share analytics across your organization. Workspaces are available on Pro and Business plans.",
  },
];

const TRUSTED_LOGOS = [
  "Stripe", "Shopify", "Notion", "Figma", "Vercel", "Linear",
  "Stripe", "Shopify", "Notion", "Figma", "Vercel", "Linear",
];

const STATS = [
  { value: "10M+", label: "links created" },
  { value: "50K+", label: "active users" },
  { value: "99.9%", label: "uptime" },
  { value: "150+", label: "countries" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <PublicHeader />

      <main className="flex-1">
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden bg-neutral-950 pt-32 pb-28">
          {/* Decorative grid */}
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
          {/* Spotlight effect */}
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          <Particles quantity={20} color="212 120 68" size={{ min: 2, max: 4 }} speed={{ min: 10, max: 25 }} />

          <div className="mx-auto max-w-6xl px-6 relative">
            <AnimatedSection className="mx-auto max-w-4xl text-center" delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-300 shadow-sm mb-8">
                <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
                Now with team workspaces &amp; API access
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05]">
                Own every link
                <br />
                <span className="relative">
                  <span className="text-terracotta-500">you share.</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-3 bg-terracotta-800/40 -skew-x-6 rounded-sm" />
                </span>
              </h1>

              <TextReveal
                text="Shorten, organize, and track every link you share. One beautiful dashboard for all your content — bio pages, QR codes, analytics, and more."
                className="mx-auto mt-5 max-w-xl text-base text-neutral-100 leading-relaxed"
                delay={0.2}
              />

              <AnimatedSection delay={0.4} direction="none" className="mt-10 flex items-center justify-center gap-3 flex-wrap">
                <Link href="/register">
                  <ShimmerButton className="bg-white text-neutral-900 hover:bg-neutral-100">
                    Start Free
                    <ChevronRight className="h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                    See Pricing
                  </Button>
                </Link>
              </AnimatedSection>
              <AnimatedSection delay={0.5} direction="none">
                <p className="mt-4 text-xs text-neutral-400">Free forever plan · No credit card required</p>
              </AnimatedSection>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ Stats bar ═══ */}
        <section className="bg-neutral-900 py-14">
          <div className="mx-auto max-w-6xl px-6">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-neutral-800">
              {STATS.map((stat) => (
                <StaggerItem key={stat.label} className="text-center md:px-8">
                  <p className="text-3xl font-bold tracking-tight text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-neutral-400">{stat.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ Trusted By — Logo Marquee ═══ */}
        <section className="border-y border-neutral-800 bg-neutral-950 py-10">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection direction="none" className="text-center mb-6">
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
                Trusted by teams at
              </p>
            </AnimatedSection>
            <div className="overflow-hidden">
              <Marquee speed={35} pauseOnHover={true}>
                {TRUSTED_LOGOS.slice(0, 6).map((name, i) => (
                  <div
                    key={`${name}-${i}`}
                    className="flex h-12 w-32 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 px-6 text-sm font-semibold text-neutral-300"
                  >
                    {name}
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </section>

        {/* ═══ Use Cases ═══ */}
        <section className="relative overflow-hidden bg-neutral-950 py-24">
          <Particles quantity={15} color="212 120 68" size={{ min: 2, max: 3 }} speed={{ min: 15, max: 30 }} />
          <div className="mx-auto max-w-6xl px-6 relative">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-400 tracking-wide uppercase">Who it's for</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Built for <FlipWords words={["Creators", "Marketers", "Agencies", "Developers"]} className="text-terracotta-500" />
              </h2>
              <p className="mt-2 text-base text-neutral-100">
                No matter your role, LinkNest adapts to your workflow.
              </p>
            </AnimatedSection>

            <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
              {USE_CASES.map((uc) => {
                const Icon = uc.icon;
                return (
                  <StaggerItem key={uc.title}>
                    <WobbleCard intensity={8}>
                      <div className="group rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all duration-300 hover:border-neutral-700 hover:shadow-md h-full">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-900/30 text-terracotta-400 transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-5 font-semibold text-white">{uc.title}</h3>
                        <p className="mt-1.5 text-sm text-neutral-300 leading-relaxed">{uc.desc}</p>
                        <ul className="mt-4 space-y-1.5">
                          {uc.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-xs text-neutral-400">
                              <Check className="h-3 w-3 shrink-0 text-forest-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </WobbleCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ How it works ═══ */}
        <section className="relative overflow-hidden bg-neutral-900 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-400 tracking-wide uppercase">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Get started in <span className="font-serif-heading italic text-terracotta-500">minutes</span>, not hours
              </h2>
              <p className="mt-2 text-base text-neutral-300">
                Four simple steps to take control of your links.
              </p>
            </AnimatedSection>

            <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative" staggerDelay={0.12}>
              <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
              {STEPS.map((step) => (
                <StaggerItem key={step.num} className="relative text-center lg:text-left">
                  <div className="mx-auto lg:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-900/30 text-terracotta-400 font-bold text-sm ring-1 ring-terracotta-800 transition-transform duration-200 group-hover:scale-105">
                    {step.num}
                  </div>
                  <h3 className="mt-5 font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-300 leading-relaxed">{step.desc}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ Features ═══ */}
        <section className="relative overflow-hidden bg-neutral-950 py-24">
          <div className="pointer-events-none absolute inset-0 shimmer-bg" />
          <Particles quantity={25} color="255 255 255" size={{ min: 1, max: 3 }} speed={{ min: 12, max: 28 }} />
          <div className="mx-auto max-w-6xl px-6 relative">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-400 tracking-wide uppercase">Everything included</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Tools that make your links work harder
              </h2>
              <p className="mt-2 text-base text-neutral-300">
                A complete toolkit for creators, marketers, and teams.
              </p>
            </AnimatedSection>

            <StaggerContainer className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <StaggerItem key={f.title}>
                    <HoverCard
                      glowColor="rgb(212 120 68 / 0.12)"
                      className="group rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all duration-300 hover:bg-neutral-800 hover:border-neutral-700 hover:-translate-y-0.5"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-semibold text-neutral-100">{f.title}</h3>
                      <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
                    </HoverCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ Product Showcase ═══ */}
        <section className="relative overflow-hidden bg-neutral-900 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <AnimatedSection direction="left">
                <p className="text-sm font-medium text-terracotta-400 tracking-wide uppercase">Dashboard</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                  Everything at a glance
                </h2>
                <p className="mt-2 text-base text-neutral-100 leading-relaxed">
                  Your unified command center. See total clicks, active links, recent activity, and key metrics — all updated in real time. No more jumping between tabs.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    { label: "Real-time analytics", desc: "See clicks as they happen" },
                    { label: "Recent links feed", desc: "Quick access to your latest links" },
                    { label: "Cross-device sync", desc: "Access your dashboard anywhere" },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-900/30 text-forest-400">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-neutral-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/register">
                    <Button>
                      Explore the Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" className="relative">
                {/* Dashboard mockup */}
                <div className="relative rounded-2xl border border-neutral-700 bg-neutral-900 shadow-xl overflow-hidden">
                  {/* Window chrome */}
                  <div className="flex items-center gap-1.5 border-b border-neutral-800 bg-neutral-950 px-4 py-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-rust-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-forest-400" />
                    <span className="ml-3 text-[11px] text-neutral-500 font-medium">Dashboard — LinkNest</span>
                  </div>
                  {/* Mock content */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-28 rounded bg-neutral-800" />
                      <div className="h-7 w-20 rounded-lg bg-neutral-800" />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[80, 65, 45, 30].map((w, i) => (
                        <div key={i} className="space-y-2 rounded-lg border border-neutral-800 p-3">
                          <div className="h-3 w-full rounded bg-neutral-800" style={{ width: `${w}%` }} />
                          <div className="h-6 w-full rounded bg-neutral-800" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[100, 85, 70, 55].map((w, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-md bg-neutral-800" />
                          <div className="h-3 flex-1 rounded bg-neutral-800" style={{ width: `${w}%` }} />
                          <div className="h-5 w-14 rounded-md bg-neutral-800" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Shimmer overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-900/60" />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══ Testimonials ═══ */}
        <section className="bg-neutral-950 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-400 tracking-wide uppercase">Trusted by teams</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Loved by creators and marketers
              </h2>
            </AnimatedSection>

            <div className="mt-14">
              {/* Row 1 */}
              <Marquee direction="left" speed={40} pauseOnHover={true}>
                {TESTIMONIALS.slice(0, 3).map((t) => (
                  <div
                    key={t.name}
                    className="w-[380px] shrink-0 rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm"
                  >
                    <Quote className="h-5 w-5 text-terracotta-600 mb-3" />
                    <p className="text-sm text-neutral-100 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700 text-[10px] font-semibold text-neutral-400">
                        {t.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{t.name}</p>
                        <p className="text-xs text-neutral-400">{t.role}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-terracotta-400 text-terracotta-400" />
                      ))}
                    </div>
                  </div>
                ))}
              </Marquee>
              {/* Row 2 */}
              <div className="mt-4">
                <Marquee direction="right" speed={35} pauseOnHover={true}>
                  {TESTIMONIALS.slice(3, 6).map((t) => (
                    <div
                      key={t.name}
                      className="w-[380px] shrink-0 rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm"
                    >
                      <Quote className="h-5 w-5 text-terracotta-600 mb-3" />
                      <p className="text-sm text-neutral-100 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700 text-[10px] font-semibold text-neutral-400">
                          {t.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{t.name}</p>
                          <p className="text-xs text-neutral-400">{t.role}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-terracotta-400 text-terracotta-400" />
                        ))}
                      </div>
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Integrations ═══ */}
        <section className="relative overflow-hidden bg-neutral-900 py-24">
          <div className="pointer-events-none absolute inset-0 shimmer-bg" />
          <div className="mx-auto max-w-6xl px-6 relative">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <AnimatedSection direction="left">
                <p className="text-sm font-medium text-terracotta-400 tracking-wide uppercase">Integrations</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                  Works with your favorite tools
                </h2>
                <p className="mt-2 text-base text-neutral-300 max-w-md">
                  Connect LinkNest with the apps you already use. No friction, just results.
                </p>
                <div className="mt-8">
                  <Link href="/integrations">
                    <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                      View all integrations
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" className="grid grid-cols-2 gap-3">
                {INTEGRATIONS.map((int) => (
                  <HoverCard
                    key={int.name}
                    glowColor="rgb(255 255 255 / 0.04)"
                    className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-5 transition-all duration-200 hover:bg-neutral-800 hover:border-neutral-700"
                  >
                    <p className="font-semibold text-neutral-100">{int.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{int.desc}</p>
                  </HoverCard>
                ))}
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══ Pricing preview ═══ */}
        <section className="bg-neutral-950 pt-8 pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-400 tracking-wide uppercase">Simple pricing</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Start free, upgrade as you grow
              </h2>
              <p className="mt-2 text-base text-neutral-300">
                All plans include a 14-day free trial. No surprises.
              </p>
            </AnimatedSection>

            <StaggerContainer className="mt-14 mx-auto max-w-4xl grid gap-4 sm:grid-cols-3" staggerDelay={0.1}>
              {/* Free */}
              <StaggerItem>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all duration-200 hover:border-neutral-700 hover:shadow-md">
                  <h3 className="font-semibold text-white">Free</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">$0</span>
                  </div>
                  <p className="mt-0.5 text-sm text-neutral-400">Forever</p>
                  <ul className="mt-5 space-y-2">
                    {["100 links", "Basic analytics", "1 bio page"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                        <Check className="h-3.5 w-3.5 shrink-0 text-forest-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href="/register"><Button variant="outline" className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">Get Started</Button></Link>
                  </div>
                </div>
              </StaggerItem>

              {/* Pro */}
              <StaggerItem>
                <GradientBorder containerClassName="h-full">
                  <div className="relative rounded-[11px] bg-neutral-900 p-6 h-full">
                    <Badge variant="accent" className="absolute -top-2.5 left-1/2 -translate-x-1/2">Most Popular</Badge>
                    <h3 className="font-semibold text-white">Pro</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">$19</span>
                      <span className="text-sm text-neutral-300">/month</span>
                    </div>
                    <ul className="mt-5 space-y-2">
                      {["Unlimited links", "Advanced analytics", "Custom domains", "Bio pages", "QR codes"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-neutral-400">
                          <Check className="h-3.5 w-3.5 shrink-0 text-forest-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Link href="/register"><Button className="w-full">Start Trial</Button></Link>
                    </div>
                  </div>
                </GradientBorder>
              </StaggerItem>

              {/* Business */}
              <StaggerItem>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all duration-200 hover:border-neutral-700 hover:shadow-md">
                  <h3 className="font-semibold text-white">Business</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">$49</span>
                    <span className="text-sm text-neutral-300">/month</span>
                  </div>
                  <ul className="mt-5 space-y-2">
                    {["Everything in Pro", "API access", "Priority support", "SSO", "Audit logs"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                        <Check className="h-3.5 w-3.5 shrink-0 text-forest-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href="/register"><Button variant="outline" className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">Contact Sales</Button></Link>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
            <AnimatedSection direction="none" delay={0.5}>
              <p className="mt-6 text-center text-xs text-neutral-500">
                All plans include a 14-day free trial. Cancel anytime.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="bg-neutral-900 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl">
              <AnimatedSection className="text-center">
                <p className="text-sm font-medium text-terracotta-400 tracking-wide uppercase">FAQ</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                  Got questions? We've got answers.
                </h2>
                <p className="mt-2 text-base text-neutral-300">
                  Everything you need to know about LinkNest.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.2} className="mt-12">
                <Accordion items={FAQ_ITEMS} />
              </AnimatedSection>

              <AnimatedSection delay={0.3} direction="none" className="mt-10 text-center">
                <p className="text-sm text-neutral-300">
                  Still have questions?{" "}
                  <Link href="/contact" className="text-terracotta-400 hover:text-terracotta-300 font-medium">
                    Contact our team
                  </Link>
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative overflow-hidden bg-neutral-950 py-24">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <div className="pointer-events-none absolute inset-0 shimmer-bg" />
          <Particles quantity={20} color="255 255 255" size={{ min: 2, max: 5 }} speed={{ min: 8, max: 20 }} />
          <AnimatedSection className="mx-auto max-w-6xl px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to take control of your links?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-200">
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
                  Compare plans
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[11px] font-bold tracking-tight text-neutral-950">L</div>
                <span className="text-sm font-semibold text-white">LinkNest</span>
              </div>
              <p className="mt-3 text-sm text-neutral-400 max-w-xs leading-relaxed">
                The link management platform for creators, marketers, and teams who care about every click.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Product</p>
              <div className="mt-4 space-y-2.5">
                {[{n:"Features",h:"/features"},{n:"Pricing",h:"/pricing"},{n:"Integrations",h:"/integrations"},{n:"API",h:"/api"}].map((l) => (
                  <Link key={l.n} href={l.h} className="block text-sm text-neutral-400 hover:text-white">{l.n}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Company</p>
              <div className="mt-4 space-y-2.5">
                {[{n:"About",h:"/about"},{n:"Blog",h:"/blog"},{n:"Careers",h:"/careers"},{n:"Contact",h:"/contact"}].map((l) => (
                  <Link key={l.n} href={l.h} className="block text-sm text-neutral-400 hover:text-white">{l.n}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-neutral-800 flex items-center justify-between">
            <p className="text-xs text-neutral-500">&copy; {new Date().getFullYear()} LinkNest. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-neutral-400 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-xs text-neutral-400 hover:text-white">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
