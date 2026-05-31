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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, fullName);
      toast.success("Account created! Welcome to LinkNest.");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
            <h1 className="text-center text-xl font-bold tracking-tight text-neutral-900">Create your account</h1>
            <p className="mt-1 text-center text-sm text-neutral-500">Start managing your links in minutes</p>
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Full name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button type="submit" className="w-full bg-neutral-900 text-white hover:bg-neutral-800" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-neutral-400">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline text-neutral-500 hover:text-neutral-700 transition-colors">Terms</Link> and{" "}
              <Link href="/privacy" className="underline text-neutral-500 hover:text-neutral-700 transition-colors">Privacy Policy</Link>.
            </p>
          </div>
          <p className="mt-4 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-terracotta-500 hover:text-terracotta-600 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      {/* ─── Footer ─── */}
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
              <Link href="/login" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
