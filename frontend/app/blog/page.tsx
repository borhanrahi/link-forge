"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { ChevronRight, Sparkles, Calendar, ArrowRight } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  Particles,
  ShimmerButton,
} from "@/components/ui/animated";

const POSTS = [
  { title: "Introducing Team Workspaces", date: "May 20, 2026", desc: "Collaborate with your team on link management. Shared analytics, roles, and more.", tag: "Product" },
  { title: "How to Optimize Your Bio Link for Maximum Clicks", date: "May 12, 2026", desc: "A deep dive into bio page best practices, design tips, and analytics-driven optimization.", tag: "Guide" },
  { title: "LinkNest API v1 is Now Available", date: "May 5, 2026", desc: "Our REST API is live. Build custom integrations and automate your link management.", tag: "Engineering" },
  { title: "The State of Link Management in 2026", date: "April 28, 2026", desc: "An analysis of trends, tools, and best practices in the link management space.", tag: "Industry" },
  { title: "5 Custom Domain Strategies for Brand Building", date: "April 20, 2026", desc: "How custom short domains can boost your brand recognition and click-through rates.", tag: "Marketing" },
  { title: "Behind the Scenes: Designing LinkNest", date: "April 12, 2026", desc: "Our design philosophy and how we approach the intersection of beauty and utility.", tag: "Design" },
];

export default function BlogPage() {
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
                Insights & updates
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.05] dark:text-neutral-50">
                The{" "}
                <span className="text-terracotta-500">LinkNest</span> Blog
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500 leading-relaxed dark:text-neutral-400">
                Product updates, guides, and insights from the team behind LinkNest.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="bg-white py-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
              {POSTS.map((post) => (
                <StaggerItem key={post.title}>
                  <div className="group rounded-xl border border-neutral-200 bg-neutral-50 p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
                    <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                      <span className="rounded-md bg-terracotta-50 px-2 py-0.5 font-medium text-terracotta-600 dark:bg-terracotta-900/30 dark:text-terracotta-400">{post.tag}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                    </div>
                    <h3 className="mt-3 font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 transition-colors">{post.title}</h3>
                    <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">{post.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-terracotta-500 dark:text-terracotta-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="relative overflow-hidden bg-neutral-900 py-20 dark:bg-neutral-950">
          <Particles quantity={12} color="255 255 255" size={{ min: 2, max: 4 }} speed={{ min: 10, max: 22 }} />
          <AnimatedSection className="mx-auto max-w-6xl px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tight text-white">Stay in the loop</h2>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-500">Get the latest posts delivered to your inbox.</p>
            <div className="mt-8"><ShimmerButton className="bg-white text-neutral-900 hover:bg-neutral-100">Subscribe<ChevronRight className="h-4 w-4" /></ShimmerButton></div>
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
