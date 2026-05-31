"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { PublicHeader } from "@/components/layout/PublicHeader";
import {
  Link2, Layout, BarChart3, QrCode, Globe, Users,
  ChevronRight, Sparkles, Star, Check, Quote,
  TrendingUp, Rocket, Shield, Youtube, ArrowRight,
  Zap, ExternalLink, MousePointerClick,
} from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  ShimmerButton,
  FlipWords,
  Accordion,
  WobbleCard,
  Marquee,
  AnimatedCounter,
} from "@/components/ui/animated";

const FEATURES = [
  { title: "Short Links", desc: "Clean, custom, trackable links your audience trusts at a glance.", icon: Link2, color: "bg-terracotta-50 text-terracotta-600" },
  { title: "Bio Pages", desc: "A single page for all your content. Links, text, images, social icons, all in one place.", icon: Layout, color: "bg-forest-50 text-forest-600" },
  { title: "Analytics", desc: "Know what works. Real-time clicks, locations, referrers, and device data.", icon: BarChart3, color: "bg-blue-50 text-blue-600" },
  { title: "QR Codes", desc: "Branded QR codes that look good everywhere. Download, print, and scan.", icon: QrCode, color: "bg-amber-50 text-amber-600" },
  { title: "Custom Domains", desc: "Your own short domain for branded links that build recognition.", icon: Globe, color: "bg-forest-50 text-forest-600" },
  { title: "Team Workspaces", desc: "Collaborate with your team. Shared analytics, roles, and permissions.", icon: Users, color: "bg-blue-50 text-blue-600" },
];

const STEPS = [
  { icon: Link2, title: "Create your account", desc: "Sign up free in under 30 seconds. No credit card needed." },
  { icon: Globe, title: "Shorten your first link", desc: "Paste your URL, customize it, and generate a clean short link." },
  { icon: BarChart3, title: "Share everywhere", desc: "Post on social media, email, or your website. Then watch the clicks roll in." },
  { icon: TrendingUp, title: "Track and optimize", desc: "See what is working and refine your strategy based on real data." },
];

const TESTIMONIALS = [
  { quote: "LinkNest completely changed how we manage our campaign links. The analytics alone saved us hours every week.", name: "Sarah Chen", role: "Marketing Director, Pulse", rating: 5 },
  { quote: "We switched from our old link manager and never looked back. The bio pages are gorgeous out of the box.", name: "Marcus Johnson", role: "Creator and Podcaster", rating: 5 },
  { quote: "Having custom domains, QR codes, and analytics in one place is a game changer for our agency.", name: "Elena Rodriguez", role: "CEO, Brightside Studio", rating: 5 },
  { quote: "The API is fantastic. We integrated LinkNest into our entire content workflow in an afternoon.", name: "Alex Kim", role: "CTO, DataFlow Inc.", rating: 5 },
  { quote: "Our click-through rates jumped 40% after switching to branded short links. The difference is real.", name: "Priya Sharma", role: "Growth Lead, Beacon", rating: 5 },
  { quote: "I have tried a dozen link managers. LinkNest is the only one that combines beauty with real utility.", name: "James Wilson", role: "Independent Creator", rating: 5 },
];

const INTEGRATIONS = [
  { name: "Slack", desc: "Post link updates to any channel", icon: Zap },
  { name: "Zapier", desc: "Connect with 5,000+ apps", icon: Zap },
  { name: "Google Analytics", desc: "Sync click data effortlessly", icon: BarChart3 },
  { name: "Notion", desc: "Embed links in any page", icon: Layout },
  { name: "Twitter / X", desc: "Auto-shorten from the compose box", icon: ExternalLink },
  { name: "Instagram", desc: "Swap bio links on schedule", icon: Globe },
];

const USE_CASES = [
  {
    title: "For Creators",
    desc: "Build your digital storefront with a single bio link. Share content, grow your audience.",
    icon: Youtube,
    features: ["Link-in-bio pages", "Content analytics", "QR codes for events"],
    accent: "from-terracotta-500/20 to-terracotta-500/5",
    badge: "bg-terracotta-50 text-terracotta-600",
  },
  {
    title: "For Marketers",
    desc: "Run campaigns with confidence. Track every click and prove ROI.",
    icon: TrendingUp,
    features: ["Campaign tracking", "UTM builder", "Team collaboration"],
    accent: "from-blue-500/20 to-blue-500/5",
    badge: "bg-blue-50 text-blue-600",
  },
  {
    title: "For Agencies",
    desc: "Manage multiple client accounts from one dashboard with white-label links.",
    icon: Rocket,
    features: ["Multi-workspace", "White labeling", "Client reporting"],
    accent: "from-forest-500/20 to-forest-500/5",
    badge: "bg-forest-50 text-forest-600",
  },
  {
    title: "For Developers",
    desc: "Integrate link management into your product via REST API and webhooks.",
    icon: Shield,
    features: ["REST API", "Webhook events", "Custom integrations"],
    accent: "from-amber-500/20 to-amber-500/5",
    badge: "bg-amber-50 text-amber-600",
  },
];

const FAQ_ITEMS = [
  {
    title: "What is LinkNest?",
    content: "LinkNest is a link management platform that lets you shorten URLs, create bio pages, generate QR codes, and track analytics all from one dashboard. It is designed for creators, marketers, and teams who want to own their links.",
  },
  {
    title: "Is there a free plan?",
    content: "Yes. Our Free plan includes 100 links, basic analytics, and 1 bio page forever, with no credit card required. Upgrade to Pro when you are ready for unlimited links and advanced features.",
  },
  {
    title: "Can I use my own domain?",
    content: "Absolutely. Custom domains are available on our Pro and Business plans. You can set up your own branded short domain like link.yourbrand.com in just a few minutes with our DNS configuration guide.",
  },
  {
    title: "How do bio pages work?",
    content: "Bio pages are single-page link-in-bio landing pages that aggregate all your important links. You can customize the design, add blocks for links, text, images, and social icons, and publish with your own domain or a LinkNest subdomain.",
  },
  {
    title: "What analytics do you provide?",
    content: "We track clicks, unique visitors, referrer sources, geographic locations, devices, and browsers in real time. Pro plans add exportable reports, UTM parameter tracking, and advanced filtering.",
  },
  {
    title: "Can I collaborate with my team?",
    content: "Yes. Team workspaces let you invite team members, set roles and permissions, and share analytics across your organization. Workspaces are available on Pro and Business plans.",
  },
];

const LOGOS = ["Stripe", "Shopify", "Notion", "Figma", "Vercel", "Linear"];

// ─── Reusable scroll-reveal wrapper ───
function Reveal({ children, className, delay = 0, x, y }: { children: React.ReactNode; className?: string; delay?: number; x?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: x ?? 0, y: y ?? 24 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Fade-in when scrolled into view ───
function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />

      <main className="flex-1">
        {/* ════════════════════════════════════════════
            HERO — Split layout with mockup
        ════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50 pt-28 pb-24 lg:pt-36 lg:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.03]" />
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal x={-20} delay={0.1}>
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-500 shadow-sm mb-6">
                  <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
                  Now with team workspaces and API access
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.08]">
                  Own every link
                  <br />
                  <span className="text-terracotta-500">you share.</span>
                </h1>
                <p className="mt-4 text-base text-neutral-500 leading-relaxed max-w-lg">
                  Shorten, organize, and track every link you share. One dashboard for bio pages, QR codes, analytics, and more.
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <Link href="/register">
                    <ShimmerButton size="lg" className="bg-neutral-900 text-white hover:bg-neutral-800">
                      Start Free
                      <ChevronRight className="h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" size="lg">See Pricing</Button>
                  </Link>
                </div>
                <p className="mt-4 text-xs text-neutral-400">Free forever plan. No credit card required.</p>
              </Reveal>

              <Reveal x={20} delay={0.3} className="relative">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden"
                >
                  <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    <span className="ml-3 text-[11px] text-neutral-400 font-mono">dashboard.linknest.com</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-terracotta-500" />
                        <div className="h-3 w-24 rounded bg-neutral-100" />
                      </div>
                      <div className="h-7 w-20 rounded-lg bg-terracotta-50 border border-terracotta-200 flex items-center justify-center">
                        <div className="h-2 w-10 rounded bg-terracotta-300" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[80, 65, 45, 30].map((w, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                          className="space-y-2 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3"
                        >
                          <div className="h-2 rounded bg-neutral-200" style={{ width: `${w}%` }} />
                          <div className="h-5 rounded bg-neutral-200" />
                        </motion.div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[100, 85, 70, 55].map((w, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + i * 0.08, duration: 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <div className="h-7 w-7 rounded-md bg-neutral-100" />
                          <div className="h-2 flex-1 rounded bg-neutral-100" style={{ width: `${w}%` }} />
                          <div className="h-5 w-14 rounded-md bg-neutral-100" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            STATS — Pill cards with animated counters
        ════════════════════════════════════════════ */}
        <section className="border-y border-neutral-100 bg-white py-14">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 10000000, suffix: "+", label: "links created", icon: Link2, delay: 0 },
                { value: 50000, suffix: "+", label: "active users", icon: Users, delay: 0.1 },
                { value: 99.9, suffix: "%", label: "uptime", icon: Shield, delay: 0.2 },
                { value: 150, suffix: "+", label: "countries", icon: Globe, delay: 0.3 },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: stat.delay, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-500">
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight text-neutral-900 tabular-nums">
                      <AnimatedCounter to={stat.value} suffix={stat.suffix} duration={2} />
                    </p>
                    <p className="text-xs text-neutral-500">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            TRUSTED BY — Logo cloud grid
        ════════════════════════════════════════════ */}
        <section className="bg-neutral-50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal delay={0.1} className="text-center mb-10">
              <p className="text-sm font-medium text-neutral-400">Trusted by teams at</p>
            </Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {LOGOS.map((name, i) => (
                <motion.div
                  key={`${name}-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="text-sm font-semibold text-neutral-400"
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            USE CASES — Spotlight card + grid
        ════════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Built for <FlipWords words={["Creators", "Marketers", "Agencies", "Developers"]} className="text-terracotta-500" />
              </h2>
              <p className="mt-2 text-neutral-500">
                Every role gets a workspace that fits how they work.
              </p>
            </Reveal>

            <StaggerContainer className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.07}>
              {USE_CASES.map((uc) => {
                const Icon = uc.icon;
                return (
                  <StaggerItem key={uc.title} className="h-full">
                    <WobbleCard intensity={4} containerClassName="h-full" className="h-full">
                      <div className="group h-full rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5">
                        <div className={`inline-flex items-center gap-1.5 rounded-full ${uc.badge} px-3 py-1 text-xs font-medium`}>
                          <Icon className="h-3.5 w-3.5" />
                          {uc.title}
                        </div>
                        <p className="mt-4 text-sm text-neutral-500 leading-relaxed">{uc.desc}</p>
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

        {/* ════════════════════════════════════════════
            HOW IT WORKS — Alternating timeline
        ════════════════════════════════════════════ */}
        <section className="bg-neutral-50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Get started in <span className="text-terracotta-500">four</span> steps
              </h2>
              <p className="mt-2 text-neutral-500">
                From signup to your first tracked link in under a minute.
              </p>
            </Reveal>

            <div className="relative mt-16">
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 -translate-x-1/2" />
              <div className="space-y-12 lg:space-y-16">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isLeft = i % 2 === 0;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                      className={`relative flex items-start gap-6 lg:gap-0 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                    >
                      <div className={`hidden lg:block w-1/2 ${isLeft ? "pr-12 text-right" : "pl-12"}`}>
                        <div className={`inline-flex flex-col ${isLeft ? "items-end" : "items-start"}`}>
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-neutral-200 shadow-sm">
                            <Icon className="h-5 w-5 text-terracotta-600" />
                          </div>
                          <h3 className={`mt-4 text-lg font-semibold text-neutral-900 ${isLeft ? "text-right" : "text-left"}`}>
                            {step.title}
                          </h3>
                          <p className={`mt-1 text-sm text-neutral-500 max-w-xs ${isLeft ? "text-right" : "text-left"}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-terracotta-300 text-[11px] font-bold text-terracotta-600">
                          {i + 1}
                        </div>
                      </div>

                      <div className="lg:hidden flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200 shadow-sm">
                          <Icon className="h-5 w-5 text-terracotta-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                          <p className="mt-1 text-sm text-neutral-500">{step.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURES — HoverCard grid
        ════════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Tools that make your links work harder
              </h2>
              <p className="mt-2 text-neutral-500">
                A complete toolkit for creators, marketers, and teams.
              </p>
            </Reveal>

            <StaggerContainer className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <StaggerItem key={f.title}>
                    <HoverCard
                      glowColor="rgb(212 120 68 / 0.06)"
                      className="rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-semibold text-neutral-800">{f.title}</h3>
                      <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                    </HoverCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PRODUCT SHOWCASE — Two column with metrics
        ════════════════════════════════════════════ */}
        <section className="bg-neutral-50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <Reveal x={-20} className="lg:order-2">
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                  Everything at a glance
                </h2>
                <p className="mt-3 text-neutral-500 leading-relaxed max-w-md">
                  Your unified command center. See total clicks, active links, recent activity, and key metrics all updated in real time.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    { label: "Real-time analytics", desc: "See clicks as they happen" },
                    { label: "Recent links feed", desc: "Quick access to your latest links" },
                    { label: "Cross-device sync", desc: "Access your dashboard anywhere" },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-600 mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/register">
                    <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
                      Explore the Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal x={20} className="lg:order-1 relative">
                <div className="relative rounded-xl border border-neutral-200 bg-white shadow-md overflow-hidden">
                  <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50/80 px-4 py-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    <span className="ml-3 text-[11px] text-neutral-400 font-medium">Dashboard</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
                        <div className="flex items-center gap-2 text-neutral-500">
                          <MousePointerClick className="h-3.5 w-3.5" />
                          <span className="text-xs">Total clicks</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-neutral-900 tabular-nums">12,847</p>
                        <span className="inline-flex items-center gap-0.5 text-xs text-forest-600 font-medium mt-1">
                          &uarr; 12%
                        </span>
                      </div>
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
                        <div className="flex items-center gap-2 text-neutral-500">
                          <Link2 className="h-3.5 w-3.5" />
                          <span className="text-xs">Active links</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-neutral-900 tabular-nums">243</p>
                        <span className="inline-flex items-center gap-0.5 text-xs text-forest-600 font-medium mt-1">
                          &uarr; 8%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {["linknest.co/summer", "linknest.co/portfolio", "linknest.co/shop"].map((url, i) => (
                        <div key={url} className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-white p-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 text-neutral-400">
                            <ExternalLink className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-700 truncate">{url}</p>
                          </div>
                          <span className="text-xs text-neutral-400 tabular-nums">{[142, 89, 56][i]} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            TESTIMONIALS — Featured card + Marquee
        ════════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Loved by creators and marketers
              </h2>
              <p className="mt-2 text-neutral-500">
                Hear from the people who use LinkNest every day.
              </p>
            </Reveal>

            <div className="mt-14">
              <Marquee direction="left" speed={38} pauseOnHover={true}>
                {TESTIMONIALS.slice(0, 3).map((t) => (
                  <div
                    key={t.name}
                    className="w-[360px] shrink-0 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
                  >
                    <Quote className="h-4 w-4 text-terracotta-400 mb-3" />
                    <p className="text-sm text-neutral-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-500">
                        {t.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-800">{t.name}</p>
                        <p className="text-xs text-neutral-500">{t.role}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                ))}
              </Marquee>
              <div className="mt-4">
                <Marquee direction="right" speed={33} pauseOnHover={true}>
                  {TESTIMONIALS.slice(3, 6).map((t) => (
                    <div
                      key={t.name}
                      className="w-[360px] shrink-0 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
                    >
                      <Quote className="h-4 w-4 text-terracotta-400 mb-3" />
                      <p className="text-sm text-neutral-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-500">
                          {t.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-800">{t.name}</p>
                          <p className="text-xs text-neutral-500">{t.role}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            INTEGRATIONS — Grid with descriptions
        ════════════════════════════════════════════ */}
        <section className="bg-neutral-50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <Reveal x={-20}>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                  Works with your favorite tools
                </h2>
                <p className="mt-3 text-neutral-500 max-w-md">
                  Connect LinkNest with the apps you already use. No friction, just results.
                </p>
                <div className="mt-8">
                  <Link href="/integrations">
                    <Button variant="outline">
                      View all integrations
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal x={20} className="grid grid-cols-2 gap-3">
                {INTEGRATIONS.map((int) => {
                  const Icon = int.icon;
                  return (
                    <HoverCard
                      key={int.name}
                      glowColor="rgb(212 120 68 / 0.05)"
                      className="rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-200 hover:border-neutral-300 hover:shadow-sm"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="mt-3 font-semibold text-neutral-800 text-sm">{int.name}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">{int.desc}</p>
                    </HoverCard>
                  );
                })}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PRICING — Cards with feature list
        ════════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Start free, upgrade as you grow
              </h2>
              <p className="mt-2 text-neutral-500">
                All plans include a 14-day free trial. No surprises.
              </p>
            </Reveal>

            <StaggerContainer className="mt-14 mx-auto max-w-4xl grid gap-5 sm:grid-cols-3 items-stretch" staggerDelay={0.1}>
              <StaggerItem className="h-full">
                <FadeIn className="h-full">
                  <div className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-neutral-300 hover:shadow-md h-full">
                    <h3 className="font-semibold text-neutral-900">Free</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-neutral-900 tabular-nums">$0</span>
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-500">Forever</p>
                    <ul className="mt-6 space-y-2 flex-1">
                      {["100 links", "Basic analytics", "1 bio page"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-neutral-500">
                          <Check className="h-3.5 w-3.5 shrink-0 text-forest-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Link href="/register">
                        <Button variant="outline" className="w-full">Get Started</Button>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              </StaggerItem>

              <StaggerItem className="h-full">
                <FadeIn className="h-full">
                  <div className="relative flex flex-col rounded-xl border-2 border-terracotta-300 bg-white p-6 shadow-lg shadow-terracotta-500/5 h-full">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-terracotta-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                      Most Popular
                    </div>
                    <h3 className="font-semibold text-neutral-900">Pro</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-neutral-900 tabular-nums">$19</span>
                      <span className="text-sm text-neutral-500">/month</span>
                    </div>
                    <ul className="mt-6 space-y-2 flex-1">
                      {["Unlimited links", "Advanced analytics", "Custom domains", "Bio pages", "QR codes"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                          <Check className="h-3.5 w-3.5 shrink-0 text-forest-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Link href="/register">
                        <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800">Start Trial</Button>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              </StaggerItem>

              <StaggerItem className="h-full">
                <FadeIn className="h-full">
                  <div className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-neutral-300 hover:shadow-md h-full">
                    <h3 className="font-semibold text-neutral-900">Business</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-neutral-900 tabular-nums">$49</span>
                      <span className="text-sm text-neutral-500">/month</span>
                    </div>
                    <ul className="mt-6 space-y-2 flex-1">
                      {["Everything in Pro", "API access", "Priority support", "SSO", "Audit logs"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-neutral-500">
                          <Check className="h-3.5 w-3.5 shrink-0 text-forest-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Link href="/register">
                        <Button variant="outline" className="w-full">Contact Sales</Button>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              </StaggerItem>
            </StaggerContainer>
            <Reveal delay={0.3}>
              <p className="mt-6 text-center text-xs text-neutral-400">
                All plans include a 14-day free trial. Cancel anytime.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FAQ
        ════════════════════════════════════════════ */}
        <section className="bg-neutral-50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl">
              <Reveal className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                  Got questions? We have answers.
                </h2>
              </Reveal>

              <Reveal delay={0.15} className="mt-14 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <Accordion items={FAQ_ITEMS} />
              </Reveal>

              <Reveal delay={0.2} className="mt-10 text-center">
                <p className="text-sm text-neutral-500">
                  Still have questions?{" "}
                  <Link href="/contact" className="text-terracotta-600 hover:text-terracotta-500 font-medium">
                    Contact our team
                  </Link>
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CTA — Branded section
        ════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-24">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.04]" />
          <Reveal className="mx-auto max-w-6xl px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to take control of your links?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-neutral-400">
              Join 50,000+ creators and teams who trust LinkNest.
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Link href="/register">
                <ShimmerButton size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                  Get Started Free
                  <ChevronRight className="h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white">
                  Compare plans
                </Button>
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-[13px] font-bold tracking-tight text-white">L</div>
                <span className="text-sm font-semibold text-neutral-900">LinkNest</span>
              </div>
              <p className="mt-3 text-sm text-neutral-500 max-w-xs leading-relaxed">
                The link management platform for creators, marketers, and teams who care about every click.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Product</p>
              <div className="mt-4 space-y-3">
                {[{n:"Features",h:"/features"},{n:"Pricing",h:"/pricing"},{n:"Integrations",h:"/integrations"},{n:"API",h:"/api"}].map((l) => (
                  <Link key={l.n} href={l.h} className="block text-sm text-neutral-500 hover:text-neutral-800 transition-colors">{l.n}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Company</p>
              <div className="mt-4 space-y-3">
                {[{n:"About",h:"/about"},{n:"Blog",h:"/blog"},{n:"Careers",h:"/careers"},{n:"Contact",h:"/contact"}].map((l) => (
                  <Link key={l.n} href={l.h} className="block text-sm text-neutral-500 hover:text-neutral-800 transition-colors">{l.n}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-neutral-400">&copy; {new Date().getFullYear()} LinkNest. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
