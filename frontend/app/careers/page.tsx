"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  Particles,
  ShimmerButton,
} from "@/components/ui/animated";

const OPENINGS = [
  { title: "Senior Frontend Engineer", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Full Stack Developer", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer", dept: "Design", location: "Remote", type: "Full-time" },
  { title: "Head of Growth", dept: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Customer Success Manager", dept: "Support", location: "Remote", type: "Full-time" },
  { title: "Technical Writer", dept: "Engineering", location: "Remote", type: "Contract" },
];

const PERKS = [
  "Competitive salary & equity",
  "Remote-first culture",
  "Unlimited PTO",
  "Home office stipend",
  "Health & wellness benefits",
  "Annual team retreats",
  "Conference budget",
  "Latest equipment",
];

export default function CareersPage() {
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
        <section className="relative overflow-hidden bg-neutral-50 pt-32 pb-24 dark:bg-neutral-950">
          <div className="pointer-events-none absolute inset-0 bg-grid" />
          <Particles quantity={12} color="212 120 68" size={{ min: 2, max: 4 }} speed={{ min: 12, max: 25 }} />
          <div className="mx-auto max-w-6xl px-6 relative">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-500 shadow-sm mb-6 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
                Join the team
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.05] dark:text-neutral-50">
                Help us build the future of{" "}
                <span className="text-terracotta-500">link management</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500 leading-relaxed dark:text-neutral-400">
                We're a small, passionate team building products that help millions of people own their links. Come join us.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ Perks ═══ */}
        <section className="bg-white py-20 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-500 tracking-wide uppercase dark:text-terracotta-400">Perks & benefits</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">We take care of our team</h2>
            </AnimatedSection>
            <StaggerContainer className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto" staggerDelay={0.05}>
              {PERKS.map((p) => (
                <StaggerItem key={p}>
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">{p}</div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ Openings ═══ */}
        <section className="bg-neutral-50 py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-terracotta-500 tracking-wide uppercase dark:text-terracotta-400">Open positions</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Join us remotely</h2>
            </AnimatedSection>
            <div className="mt-12 mx-auto max-w-3xl space-y-3">
              {OPENINGS.map((job) => (
                <AnimatedSection key={job.title} direction="none" className="group">
                  <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-200 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
                    <div>
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">{job.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{job.dept}</span>
                        <span className="h-1 w-1 rounded-full bg-neutral-300" />
                        <span>{job.location}</span>
                        <span className="h-1 w-1 rounded-full bg-neutral-300" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-terracotta-500 dark:text-terracotta-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Apply <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-neutral-900 py-20 dark:bg-neutral-950">
          <Particles quantity={12} color="255 255 255" size={{ min: 2, max: 4 }} speed={{ min: 10, max: 22 }} />
          <AnimatedSection className="mx-auto max-w-6xl px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tight text-white">Don't see a role that fits?</h2>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-500">We're always looking for great people. Send us your resume.</p>
            <div className="mt-8"><Link href="/contact"><ShimmerButton className="bg-white text-neutral-900 hover:bg-neutral-100">Get in Touch<ChevronRight className="h-4 w-4" /></ShimmerButton></Link></div>
          </AnimatedSection>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white">L</div><span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">LinkNest</span></div>
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
