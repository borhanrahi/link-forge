"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { ChevronRight, Sparkles, Quote } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  Particles,
  ShimmerButton,
} from "@/components/ui/animated";

const TEAM_VALUES = [
  { title: "Transparency", desc: "We believe in open communication, honest metrics, and radical transparency with our users." },
  { title: "Craftsmanship", desc: "Every pixel, every interaction, every line of code is built with care and intention." },
  { title: "Ownership", desc: "We take responsibility. For our product, our users, and the impact we make." },
  { title: "Simplicity", desc: "Complexity is easy. Simplicity is hard. We choose simple every time." },
];

const TEAM_MEMBERS = [
  { name: "Alex Rivera", role: "CEO & Co-Founder" },
  { name: "Sarah Chen", role: "CTO & Co-Founder" },
  { name: "Marcus Johnson", role: "Head of Design" },
  { name: "Priya Sharma", role: "Head of Engineering" },
  { name: "James Wilson", role: "Head of Marketing" },
  { name: "Elena Rodriguez", role: "Head of Sales" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-lg dark:border-neutral-800/60 dark:bg-neutral-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white transition-transform duration-200 group-hover:scale-105">L</div>
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
                Our story
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.05] dark:text-neutral-50">
                We believe every link{" "}
                <span className="text-terracotta-500">deserves to be owned</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500 leading-relaxed dark:text-neutral-400">
                LinkNest was built because we believed link management could be beautiful, powerful, and simple — all at once. We're a small team on a mission to help creators and businesses own their links.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ Values ═══ */}
        <section className="bg-white py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-500 tracking-wide uppercase dark:text-terracotta-400">Our values</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">What we stand for</h2>
            </AnimatedSection>
            <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
              {TEAM_VALUES.map((v) => (
                <StaggerItem key={v.title}>
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">{v.title}</h3>
                    <p className="mt-2 text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">{v.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ Team ═══ */}
        <section className="bg-neutral-50 py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-500 tracking-wide uppercase dark:text-terracotta-400">Team</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Meet the people behind LinkNest</h2>
            </AnimatedSection>
            <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
              {TEAM_MEMBERS.map((m) => (
                <StaggerItem key={m.name}>
                  <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500 text-xl font-bold dark:bg-terracotta-900/30 dark:text-terracotta-400">
                      {m.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <h3 className="mt-4 font-semibold text-neutral-800 dark:text-neutral-200">{m.name}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{m.role}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative overflow-hidden bg-neutral-900 py-20 dark:bg-neutral-950">
          <Particles quantity={15} color="255 255 255" size={{ min: 2, max: 4 }} speed={{ min: 10, max: 22 }} />
          <AnimatedSection className="mx-auto max-w-6xl px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tight text-white">Join us on this journey</h2>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-500">We're just getting started. Come grow with us.</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/register">
                <ShimmerButton className="bg-white text-neutral-900 hover:bg-neutral-100">
                  Get Started Free
                  <ChevronRight className="h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Link href="/careers">
                <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">We're hiring</Button>
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

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
