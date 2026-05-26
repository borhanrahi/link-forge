"use client";

import { Button, Card, CardContent, Badge, SectionHeading } from "@/components/ui";
import { useSubscription, usePlans } from "@/hooks";
import { cn } from "@/lib/utils";
import { CreditCard, Check, Loader2 } from "lucide-react";

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
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="Billing"
        description="Manage your subscription and plan"
      />

      {/* Current plan */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-950 dark:text-terracotta-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              {subLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
              ) : (
                <>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                    {currentPlan} Plan
                  </p>
                  <p className="text-sm text-neutral-400">
                    {subscription?.status === "active"
                      ? `Next billing: ${subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : "N/A"}`
                      : "No active subscription"}
                  </p>
                </>
              )}
            </div>
          </div>
          <Badge variant={subscription?.status === "active" ? "accent" : "default"}>
            {subscription?.status || "Inactive"}
          </Badge>
        </CardContent>
      </Card>

      {/* Plan comparison */}
      {plansLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {(plans as any[]).map((plan: any) => {
            const isCurrent = plan.name?.toLowerCase() === currentPlan;
            return (
              <div
                key={plan.name}
                className={cn(
                  "rounded-lg border bg-white p-5 dark:bg-neutral-900 relative",
                  plan.popular
                    ? "border-terracotta-300 dark:border-terracotta-700"
                    : "border-neutral-200 dark:border-neutral-800",
                )}
              >
                {plan.popular && !isCurrent && (
                  <Badge variant="accent" className="absolute -top-2.5 left-4">
                    Popular
                  </Badge>
                )}
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{plan.price}</span>
                  <span className="text-sm text-neutral-400">/month</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {(plan.features || []).map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                      <Check className="h-3.5 w-3.5 shrink-0 text-forest-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {isCurrent ? (
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button variant={plan.popular ? "secondary" : "outline"} className="w-full">
                      Upgrade
                    </Button>
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
