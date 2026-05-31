"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { Spotlight } from "@/components/ui/animated";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />

      <main className="flex-1 relative flex items-center justify-center px-6 overflow-hidden pt-14">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgb(212 120 68)" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.03]" />

        <div className="w-full max-w-sm animate-slide-up relative z-10">
          <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-500 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-center text-xl font-bold tracking-tight text-neutral-900">Welcome back</h1>
            <p className="mt-1 text-center text-sm text-neutral-500">Sign in to your account</p>
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-neutral-500 cursor-pointer">
                  <input type="checkbox" className="rounded border-neutral-300 accent-terracotta-500" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-terracotta-500 hover:text-terracotta-600 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-neutral-900 text-white hover:bg-neutral-800" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
          <p className="mt-4 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-terracotta-500 hover:text-terracotta-600 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white">L</div>
              <span className="text-sm font-semibold text-neutral-900">LinkNest</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Home</Link>
              <Link href="/features" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Features</Link>
              <Link href="/pricing" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Pricing</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
