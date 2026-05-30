"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Stat } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useLinks, useLinkAnalytics, useLinkTimeseries, useLinkGeo, useLinkDevices, useLinkReferrers } from "@/hooks";
import {
  ArrowLeft, ExternalLink, TrendingUp, Users, Activity,
  Globe, MousePointerClick, Download, Sparkles, TrendingDown, BarChart3,
} from "lucide-react";
import { ClicksAreaChart, DevicePieChart, ReferrerBarChart, GeoBarChart } from "@/components/charts";

const SHORT_DOMAIN = "http://localhost:8000";

const RANGES = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
] as const;

function RangeTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            value === r.value
              ? "bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-md shadow-terracotta-500/20"
              : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export default function LinkAnalyticsPage() {
  const { linkId } = useParams();
  const [range, setRange] = useState("30d");
  const { data: links } = useLinks();
  const { data: analytics } = useLinkAnalytics(linkId as string, range);
  const { data: timeseries } = useLinkTimeseries(linkId as string, range);
  const { data: geo } = useLinkGeo(linkId as string, range);
  const { data: devices } = useLinkDevices(linkId as string, range);
  const { data: referrers } = useLinkReferrers(linkId as string, range);
  const link = links?.find((l: any) => l.id === linkId);

  const totalClicks = analytics?.total_clicks ?? link?.clicks_count ?? 0;
  const uniqueClicks = analytics?.unique_clicks ?? link?.unique_clicks_count ?? 0;
  const weekClicks = analytics?.week_clicks ?? 0;
  const prevWeek = analytics?.prev_week_clicks ?? 0;
  const weekTrend = prevWeek > 0 ? Math.round(((weekClicks - prevWeek) / prevWeek) * 100) : null;

  const handleExport = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("neon_session_token") : null;
    const workspaceId = typeof window !== "undefined" ? localStorage.getItem("active_workspace_id") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (workspaceId) headers["X-Workspace-Id"] = workspaceId;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/analytics/export?link_id=${linkId}&range=${range}`, { headers })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${link?.title || "link"}-${range}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative">
          <Link
            href="/dashboard/analytics"
            className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 mb-3 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to analytics
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-2">
                <Sparkles className="h-3 w-3" />
                Link Analytics
              </span>
              <h1 className="text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  {link?.title || "Untitled Link"}
                </span>
              </h1>
              {link && (
                <a
                  href={`${SHORT_DOMAIN}/${link.short_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-xs text-terracotta-400/70 hover:text-terracotta-300 transition-colors font-mono"
                >
                  {SHORT_DOMAIN}/{link.short_code}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <RangeTabs value={range} onChange={setRange} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400 mb-3">
            <MousePointerClick className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black tabular-nums text-white">{totalClicks.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-0.5">Total Clicks</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 mb-3">
            <Users className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black tabular-nums text-white">{uniqueClicks.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-0.5">Unique Visitors</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-500/10 text-forest-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            {weekTrend !== null && (
              <span className={`text-xs font-semibold ${weekTrend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {weekTrend >= 0 ? "+" : ""}{weekTrend}%
              </span>
            )}
          </div>
          <p className="text-2xl font-black tabular-nums text-white">{weekClicks.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-0.5">This Week</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 mb-3">
            <Activity className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black tabular-nums text-white">
            {link?.is_active ? (
              <span className="text-emerald-400">Active</span>
            ) : (
              <span className="text-white/30">Inactive</span>
            )}
          </p>
          <p className="text-xs text-white/40 mt-0.5">Status</p>
        </div>
      </div>

      {/* Main chart */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
        <div className="px-6 pt-5 pb-1">
          <h3 className="text-sm font-semibold text-white/70">Click Trends</h3>
          <p className="text-xs text-white/30 mt-0.5">Daily clicks over the selected period</p>
        </div>
        <ClicksAreaChart data={timeseries || []} height={320} />
      </div>

      {/* Breakdown charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
          <div className="px-5 pt-4 pb-1">
            <h3 className="text-sm font-semibold text-white/70">Devices</h3>
          </div>
          <DevicePieChart data={devices || []} height={260} />
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
          <div className="px-5 pt-4 pb-1">
            <h3 className="text-sm font-semibold text-white/70">Referrers</h3>
          </div>
          <ReferrerBarChart data={referrers || []} height={260} />
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
          <div className="px-5 pt-4 pb-1">
            <h3 className="text-sm font-semibold text-white/70">Geography</h3>
          </div>
          <GeoBarChart data={geo || []} height={260} />
        </div>
      </div>
    </div>
  );
}
