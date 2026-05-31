"use client";

import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useSubscription, usePlans } from "@/hooks";
import { CreditCard, Check, Loader2, Sparkles } from "lucide-react";

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
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl dash-glass border p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dash-glass-border)] bg-[var(--dash-glass-bg)] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
            <Sparkles className="h-3 w-3" />
            Billing
          </span>
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-foreground">
              Billing
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-light">Manage your subscription and plan</p>
        </div>
      </div>

      {/* Current plan card */}
      <div className="dash-glass rounded-2xl border p-6">
        {subLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-[var(--dash-glass-border)]">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground/80 capitalize">{currentPlan} Plan</p>
                <p className="text-sm text-muted-foreground">
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
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {(plans as any[]).map((plan: any) => {
            const isCurrent = plan.name?.toLowerCase() === currentPlan;
            return (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-terracotta-500/40" : ""}`}
              >
                <CardContent className="p-6">
                  {plan.popular && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-foreground/80">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground/60">/month</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {(plan.features || []).map((f: string) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground/60">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {isCurrent ? (
                      <Button variant="outline" disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant={plan.popular ? "default" : "outline"}
                        className={plan.popular ? "w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/20 hover:from-terracotta-400 hover:to-terracotta-500" : "w-full"}
                      >
                        Upgrade to {plan.name}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
