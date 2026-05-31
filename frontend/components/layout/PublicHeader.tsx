"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui";

export function PublicHeader() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white transition-transform duration-200 group-hover:scale-105">
            L
          </div>
          <span className="text-sm font-semibold text-neutral-900">LinkNest</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-6">
          <Link
            href="/features"
            className="hidden sm:inline text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="hidden sm:inline text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Pricing
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Sign in
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
