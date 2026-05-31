"use client";

import Link from "next/link";
import { Stat, EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useLinks, useAnalytics } from "@/hooks";
import { Link2, BarChart3, MousePointerClick, QrCode, Layout, ArrowUpRight, ExternalLink, Plus, TrendingUp } from "lucide-react";
import { OnboardingChecklist } from "@/components/onboarding-checklist";

export default function DashboardPage() {
  const { data: links } = useLinks();
  const { data: analytics } = useAnalytics();

  const totalClicks = analytics?.summary?.total_clicks ?? 0;
  const activeLinks = links?.filter((l: any) => l.is_active).length ?? 0;
  const todayClicks = analytics?.summary?.today_clicks ?? 0;

  const quickActions = [
    { href: "/dashboard/links/new", label: "New Link", icon: Link2, desc: "Shorten a URL" },
    { href: "/dashboard/bio-pages/new", label: "Bio Page", icon: Layout, desc: "Link-in-bio page" },
    { href: "/dashboard/qr-codes", label: "QR Code", icon: QrCode, desc: "Generate QR code" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="dash-glass relative overflow-hidden rounded-2xl border p-8 lg:p-10">
        <div className="absolute -inset-x-40 -top-40 h-[600px] w-[800px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg">
            Welcome back. Here is what is happening with your links today.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Links" value={links?.length ?? 0} icon={<Link2 className="h-4 w-4" />} accent />
        <Stat label="Active Links" value={activeLinks} icon={<BarChart3 className="h-4 w-4" />} />
        <Stat label="Total Clicks" value={totalClicks.toLocaleString()} icon={<MousePointerClick className="h-4 w-4" />} accent />
        <Stat label="Today" value={todayClicks.toLocaleString()} icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      {/* Onboarding checklist */}
      <OnboardingChecklist />

      {/* Quick actions */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-semibold text-muted-foreground tracking-[0.15em] uppercase">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="dash-glass group relative rounded-2xl border p-5 transition-all duration-300 hover:border-terracotta-500/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-500/10 text-terracotta-400 ring-1 ring-[var(--dash-glass-border)] transition-all duration-300 group-hover:bg-terracotta-500/15 group-hover:ring-terracotta-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">{action.desc}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 transition-all duration-300 group-hover:text-terracotta-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent links */}
      <div className="dash-glass rounded-2xl border">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[var(--dash-glass-border)]">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-foreground/70">Recent Links</h2>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground" render={<Link href="/dashboard/links" />}>
            View all <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
        {links && links.length > 0 ? (
          <div className="divide-y divide-[var(--dash-glass-border)]">
            {links.slice(0, 5).map((link: any) => (
              <Link
                key={link.id}
                href={`/dashboard/links/${link.id}`}
                className="flex items-center justify-between px-6 py-3.5 text-sm transition-all duration-200 hover:bg-[var(--dash-glass-hover-bg)]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground/70 truncate max-w-[220px]">
                      {link.title || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-mono truncate max-w-[180px]">
                      {link.short_code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground/60">{link.clicks_count ?? 0} clicks</span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground bg-muted/50">
                    {link.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16">
            <EmptyState
              icon={<Link2 className="h-6 w-6 text-muted-foreground" />}
              title="No links yet"
              description="Create your first shortened link to start tracking clicks."
              action={
                <Button className="bg-terracotta-500 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:bg-terracotta-400" render={<Link href="/dashboard/links/new" />}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Create Link
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
