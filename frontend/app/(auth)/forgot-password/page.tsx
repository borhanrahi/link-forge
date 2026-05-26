"use client";

import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { Spotlight } from "@/components/ui/animated";
import { ArrowLeft, Lock } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      {/* ─── Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[11px] font-bold tracking-tight text-neutral-950 transition-transform duration-200 group-hover:scale-105">
              L
            </div>
            <span className="text-sm font-semibold text-white">LinkNest</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-6">
            <Link href="/features" className="hidden sm:inline text-sm text-neutral-300 transition-colors hover:text-white">Features</Link>
            <Link href="/pricing" className="hidden sm:inline text-sm text-neutral-300 transition-colors hover:text-white">Pricing</Link>
            <Link href="/login" className="text-sm text-neutral-300 transition-colors hover:text-white">Sign in</Link>
            <Link href="/register"><Button>Get Started</Button></Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center px-6 overflow-hidden pt-14">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

        <div className="w-full max-w-sm animate-slide-up relative z-10">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-sm">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-900/30 text-terracotta-400 mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-center text-xl font-bold tracking-tight text-white">Reset your password</h1>
            <p className="mt-1 text-center text-sm text-neutral-400">
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input label="Email" type="email" placeholder="you@example.com" />
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[11px] font-bold tracking-tight text-neutral-950">L</div>
              <span className="text-sm font-semibold text-white">LinkNest</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-neutral-400 hover:text-white">Home</Link>
              <Link href="/features" className="text-xs text-neutral-400 hover:text-white">Features</Link>
              <Link href="/pricing" className="text-xs text-neutral-400 hover:text-white">Pricing</Link>
              <Link href="/login" className="text-xs text-neutral-400 hover:text-white">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
