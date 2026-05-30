"use client";

import Link from "next/link";
import { Stat, EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useLinks, useAnalytics } from "@/hooks";
import { Link2, BarChart3, MousePointerClick, QrCode, Layout, ArrowUpRight, ExternalLink, Plus, TrendingUp, Sparkles } from "lucide-react";
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
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-8 lg:p-10">
        <div className="absolute -inset-x-40 -top-40 h-[600px] w-[800px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase">
              <Sparkles className="h-3 w-3" />
              Overview
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="mt-2 text-sm text-white/40 max-w-lg font-light tracking-wide">
            Welcome back. Here&apos;s what&apos;s happening with your links today.
          </p>
        </div>
      </div>

      {/* Stats — glass bento grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Links" value={links?.length ?? 0} icon={<Link2 className="h-4 w-4" />} accent />
        <Stat label="Active Links" value={activeLinks} icon={<BarChart3 className="h-4 w-4" />} />
        <Stat label="Total Clicks" value={totalClicks.toLocaleString()} icon={<MousePointerClick className="h-4 w-4" />} accent />
        <Stat label="Today" value={todayClicks.toLocaleString()} icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      {/* Onboarding checklist */}
      <OnboardingChecklist />

      {/* Quick actions — glass row */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-1 rounded-full bg-terracotta-500" />
          <h2 className="text-sm font-semibold text-white/60 tracking-wider uppercase">Quick Actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 transition-all duration-300 hover:border-terracotta-500/30 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-8px] hover:shadow-terracotta-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-white/[0.06] transition-all duration-300 group-hover:from-terracotta-500/30 group-hover:to-terracotta-500/10 group-hover:ring-terracotta-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-white/30 group-hover:text-white/40 transition-colors">{action.desc}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/20 transition-all duration-300 group-hover:text-terracotta-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent links — glass panel */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-white/70">Recent Links</h2>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-white/40 hover:text-white" render={<Link href="/dashboard/links" />}>
            View all <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
        {links && links.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {links.slice(0, 5).map((link: any) => (
              <Link
                key={link.id}
                href={`/dashboard/links/${link.id}`}
                className="flex items-center justify-between px-6 py-3.5 text-sm transition-all duration-200 hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/40 shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white/70 truncate max-w-[220px]">
                      {link.title || "Untitled"}
                    </p>
                    <p className="text-xs text-white/30 font-mono truncate max-w-[180px]">
                      {link.short_code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-white/30">{link.clicks_count ?? 0} clicks</span>
                  <span className="inline-flex items-center rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-white/40 bg-white/[0.03]">
                    {link.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16">
            <EmptyState
              icon={<Link2 className="h-6 w-6 text-white/30" />}
              title="No links yet"
              description="Create your first shortened link to start tracking clicks."
              action={
                <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500" render={<Link href="/dashboard/links/new" />}>
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
