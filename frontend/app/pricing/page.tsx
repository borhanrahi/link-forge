"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import { Check, Sparkles, ChevronRight } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  GradientBorder,
  Particles,
  ShimmerButton,
} from "@/components/ui/animated";

const MONTHLY_PLANS = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for getting started",
    features: ["100 links", "Basic analytics", "1 bio page", "Standard QR codes"],
    cta: "Get Started",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$19",
    desc: "For creators and marketers",
    popular: true,
    features: [
      "Unlimited links",
      "Advanced analytics",
      "Unlimited bio pages",
      "Custom domains",
      "Branded QR codes",
      "Team collaboration (up to 5)",
    ],
    cta: "Start Trial",
    variant: "default" as const,
  },
  {
    name: "Business",
    price: "$49",
    desc: "For teams and organizations",
    features: [
      "Everything in Pro",
      "API access",
      "Priority support",
      "Custom branding",
      "Audit logs",
      "SSO & SAML",
      "Unlimited team members",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
  },
];

const YEARLY_PLANS = MONTHLY_PLANS.map((plan) => {
  if (plan.name === "Free") return plan;
  const monthlyPrice = parseInt(plan.price.replace("$", ""));
  const yearlyPrice = Math.round(monthlyPrice * 10); // 2 months free
  return {
    ...plan,
    price: `$${yearlyPrice}`,
    desc: plan.name === "Pro" ? "$19/mo billed annually" : "$49/mo billed annually",
  };
});

const FAQ_ITEMS = [
  { q: "Can I switch plans anytime?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately." },
  { q: "What happens when I upgrade?", a: "All your links and data remain intact. You instantly get access to new features." },
  { q: "Is there a free trial?", a: "All paid plans include a 14-day free trial. No credit card required to start." },
  { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime. Your data will be preserved for 30 days." },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const plans = yearly ? YEARLY_PLANS : MONTHLY_PLANS;

  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-lg dark:border-neutral-800/60 dark:bg-neutral-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white transition-transform duration-200 group-hover:scale-105">
              L
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">LinkNest</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-6">
            <Link href="/features" className="hidden sm:inline text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Features</Link>
            <Link href="/login" className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">Sign in</Link>
            <Link href="/register"><Button>Get Started</Button></Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden bg-neutral-50 pt-32 pb-20 dark:bg-neutral-950">
          <div className="pointer-events-none absolute inset-0 bg-grid" />
          <Particles quantity={15} color="212 120 68" size={{ min: 2, max: 4 }} speed={{ min: 12, max: 25 }} />
          <div className="mx-auto max-w-6xl px-6 relative">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-500 shadow-sm mb-6 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
                Simple, transparent pricing
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.05] dark:text-neutral-50">
                Start free,{" "}
                <span className="text-terracotta-500">upgrade</span> as you grow
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500 leading-relaxed dark:text-neutral-400">
                All plans include a 14-day free trial. No hidden fees. No surprises.
              </p>
            </AnimatedSection>

            {/* Toggle */}
            <AnimatedSection delay={0.2} direction="none" className="mt-10 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium transition-colors ${!yearly ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 dark:text-neutral-500"}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setYearly(!yearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/25 ${
                  yearly ? "bg-terracotta-500" : "bg-neutral-300 dark:bg-neutral-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    yearly ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${yearly ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 dark:text-neutral-500"}`}>
                Yearly
              </span>
              {yearly && (
                <Badge variant="accent" className="animate-scale-in">
                  Save 17%
                </Badge>
              )}
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ Plans ═══ */}
        <section className="bg-white pb-24 dark:bg-neutral-950">
          <div className="mx-auto max-w-6xl px-6">
            <StaggerContainer className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto" staggerDelay={0.1}>
              {plans.map((plan) => (
                <StaggerItem key={plan.name}>
                  {plan.popular ? (
                    <GradientBorder containerClassName="h-full">
                      <div className="relative rounded-[11px] bg-white p-6 dark:bg-neutral-900 h-full">
                        <Badge variant="accent" className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                          Most Popular
                        </Badge>
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">{plan.name}</h3>
                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            {plan.price}
                          </span>
                          <span className="text-sm text-neutral-500">/month</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500">{plan.desc}</p>
                        <ul className="mt-6 space-y-2.5">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                              <Check className="h-4 w-4 mt-0.5 shrink-0 text-forest-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8">
                          <Link href="/register">
                            <Button variant={plan.variant === "default" ? "default" : "outline"} className="w-full">
                              {plan.cta}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </GradientBorder>
                  ) : (
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:bg-neutral-900 dark:border-neutral-800 h-full flex flex-col transition-all duration-200 hover:border-neutral-300 hover:shadow-md dark:hover:border-neutral-700">
                      <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">{plan.name}</h3>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                          {plan.price}
                        </span>
                        <span className="text-sm text-neutral-500">/month</span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">{plan.desc}</p>
                      <ul className="mt-6 space-y-2.5 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                            <Check className="h-4 w-4 mt-0.5 shrink-0 text-forest-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <Link href="/register">
                          <Button variant="outline" className="w-full">
                            {plan.cta}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </StaggerItem>
              ))}
            </StaggerContainer>

            <AnimatedSection direction="none" delay={0.4}>
              <p className="mt-6 text-center text-xs text-neutral-500">
                All prices in USD. Cancel anytime. Your data is always yours.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="border-t border-neutral-100 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mx-auto max-w-3xl px-6">
            <AnimatedSection className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Still have questions?
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Find answers to common questions about pricing and plans.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="mt-10 space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.05} className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-200">{item.q}</h3>
                  <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">{item.a}</p>
                </AnimatedSection>
              ))}
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="bg-white py-20 dark:bg-neutral-950">
          <AnimatedSection className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-neutral-500 dark:text-neutral-400">
              Join 50,000+ creators and teams using LinkNest.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/register">
                <ShimmerButton className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
                  Start Your Free Trial
                  <ChevronRight className="h-4 w-4" />
                </ShimmerButton>
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold tracking-tight text-white">L</div>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">LinkNest</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Home</Link>
              <Link href="/features" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Features</Link>
              <Link href="/about" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">About</Link>
              <Link href="/contact" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Contact</Link>
              <Link href="/login" className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
