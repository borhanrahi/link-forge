"use client";

import { Button, Badge } from "@/components/ui";
import { useSubscription, usePlans } from "@/hooks";
import { CreditCard, Check, Loader2, Sparkles, Shield } from "lucide-react";

const DEFAULT_PLANS = [
  {
    name: "Free",
    price: "$0",
    features: ["100 links", "Basic analytics", "1 bio page", "Community support"],
  },
  {
    name: "Pro",
    price: "$19",
    features: ["Unlimited links", "Advanced analytics", "Unlimited bio pages", "Custom domains", "Priority support"],
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    features: ["Everything in Pro", "API access", "Team collaboration", "SSO", "Dedicated support"],
  },
];

export default function BillingPage() {
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const { data: plansData, isLoading: plansLoading } = usePlans();
  const currentPlan = subscription?.plan || "free";
  const plans = plansData?.plans || DEFAULT_PLANS;

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Billing</h1>
        <p className="mt-1 text-sm text-neutral-400">Manage your subscription and plan</p>
      </div>

      {/* Current plan card */}
      <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-neutral-900 to-neutral-950 p-6">
        {subLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-600/10 text-terracotta-400">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white capitalize">
                  {currentPlan} Plan
                </p>
                <p className="text-sm text-neutral-400">
                  {subscription?.status === "active"
                    ? `Next billing: ${subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : "N/A"}`
                    : "No active subscription"}
                </p>
              </div>
            </div>
            <Badge variant={subscription?.status === "active" ? "success" : "default"}>
              {subscription?.status || "Inactive"}
            </Badge>
          </div>
        )}
      </div>

      {/* Plan comparison */}
      {plansLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {(plans as any[]).map((plan: any) => {
            const isCurrent = plan.name?.toLowerCase() === currentPlan;
            return (
              <div
                key={plan.name}
                className={`relative rounded-xl border bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:border-neutral-700 ${
                  plan.popular
                    ? "border-terracotta-600/50 shadow-lg shadow-terracotta-500/5"
                    : "border-neutral-800"
                }`}
              >
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-neutral-500">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {(plan.features || []).map((f: string) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-400 cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                        plan.popular
                          ? "bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white hover:from-terracotta-400 hover:to-terracotta-500 shadow-lg shadow-terracotta-500/20"
                          : "border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      Upgrade to {plan.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
