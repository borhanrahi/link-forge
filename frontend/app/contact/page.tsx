"use client";

import Link from "next/link";
import { Button, Input, Textarea } from "@/components/ui";
import { Sparkles, Mail, MessageSquare, HelpCircle } from "lucide-react";
import {
  AnimatedSection,
  Particles,
  ShimmerButton,
} from "@/components/ui/animated";

const CONTACT_OPTIONS = [
  { icon: Mail, title: "Email us", desc: "hello@linknest.com", note: "We'll respond within 24 hours" },
  { icon: MessageSquare, title: "Live chat", desc: "Available Mon-Fri, 9am-6pm EST", note: "Look for the chat bubble" },
  { icon: HelpCircle, title: "Knowledge base", desc: "Visit our FAQ page for quick answers", note: "See FAQ" },
];

export default function ContactPage() {
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
        <section className="relative overflow-hidden bg-neutral-50 pt-32 pb-20 dark:bg-neutral-950">
          <div className="pointer-events-none absolute inset-0 bg-grid" />
          <Particles quantity={12} color="212 120 68" size={{ min: 2, max: 4 }} speed={{ min: 12, max: 25 }} />
          <div className="mx-auto max-w-6xl px-6 relative">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-500 shadow-sm mb-6 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
                We'd love to hear from you
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.05] dark:text-neutral-50">
                Get in{" "}
                <span className="text-terracotta-500">touch</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500 leading-relaxed dark:text-neutral-400">
                Have a question, feedback, or just want to say hello? We're here for you.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ Contact Grid ═══ */}
        <section className="bg-white pb-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-3 mb-12">
              {CONTACT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <AnimatedSection key={opt.title} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-900/30 dark:text-terracotta-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold text-neutral-800 dark:text-neutral-200">{opt.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{opt.desc}</p>
                    <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">{opt.note}</p>
                  </AnimatedSection>
                );
              })}
            </div>

            <AnimatedSection delay={0.2} className="mx-auto max-w-lg">
              <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Send us a message</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">We'll get back to you within 24 hours.</p>
                <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="First name" placeholder="John" />
                    <Input label="Last name" placeholder="Doe" />
                  </div>
                  <Input label="Email" type="email" placeholder="john@example.com" />
                  <Input label="Subject" placeholder="How can we help?" />
                  <Textarea label="Message" placeholder="Tell us more..." rows={4} />
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </div>
            </AnimatedSection>
          </div>
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
