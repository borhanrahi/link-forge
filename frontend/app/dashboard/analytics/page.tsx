"use client";

import { useState } from "react";
import { Stat } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks";
import {
  MousePointerClick, Globe, BarChart3, Download, Users,
  TrendingUp, TrendingDown, Sparkles, Activity,
} from "lucide-react";
import { ClicksAreaChart, DevicePieChart, ReferrerBarChart, GeoBarChart } from "@/components/charts";

const RANGES = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
] as const;

function RangeTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl dash-glass border p-1">
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            value === r.value
              ? "bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-md shadow-terracotta-500/20"
              : "text-muted-foreground hover:text-foreground/70 hover:bg-[var(--dash-glass-hover-bg)]"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("7d");
  const { data: analytics, isLoading } = useAnalytics(range);
  const s = analytics?.summary;

  const totalClicks = s?.total_clicks ?? 0;
  const todayClicks = s?.today_clicks ?? 0;
  const weekClicks = s?.week_clicks ?? 0;
  const prevWeek = s?.prev_week_clicks ?? 0;
  const prevMonth = s?.prev_month_clicks ?? 0;

  const weekTrend = prevWeek > 0 ? Math.round(((weekClicks - prevWeek) / prevWeek) * 100) : null;
  const monthTrend = prevMonth > 0 ? Math.round(((totalClicks - prevMonth) / prevMonth) * 100) : null;

  const handleExport = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("neon_session_token") : null;
    const workspaceId = typeof window !== "undefined" ? localStorage.getItem("active_workspace_id") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (workspaceId) headers["X-Workspace-Id"] = workspaceId;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/analytics/export?range=${range}`, { headers })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${range}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl dash-glass border p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dash-glass-border)] bg-[var(--dash-glass-bg)] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-3">
              <Sparkles className="h-3 w-3" />
              Analytics
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="text-foreground">
                Performance Overview
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground font-light">Track clicks, visitors, and engagement across all your links</p>
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

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative dash-glass rounded-2xl border p-5 transition-all hover:border-terracotta-500/20 hover:bg-[var(--dash-glass-hover-bg)]">
          <div className="flex items-center justify-between mb-3">
            <div              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-[var(--dash-glass-border)]">
              <MousePointerClick className="h-5 w-5" />
            </div>
            {weekTrend !== null && (
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${weekTrend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {weekTrend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(weekTrend)}%
              </span>
            )}
          </div>
          <p className="text-3xl font-black tabular-nums text-foreground">{totalClicks.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Clicks</p>
        </div>

        <div className="group relative dash-glass rounded-2xl border p-5 transition-all hover:border-blue-500/20 hover:bg-[var(--dash-glass-hover-bg)]">
          <div className="flex items-center justify-between mb-3">
            <div              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-400 ring-1 ring-[var(--dash-glass-border)]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black tabular-nums text-foreground">{(s?.unique_clicks ?? 0).toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Unique Visitors</p>
        </div>

        <div className="group relative dash-glass rounded-2xl border p-5 transition-all hover:border-forest-500/20 hover:bg-[var(--dash-glass-hover-bg)]">
          <div className="flex items-center justify-between mb-3">
            <div              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-forest-500/20 to-forest-500/5 text-forest-400 ring-1 ring-[var(--dash-glass-border)]">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-black tabular-nums text-foreground">{s?.total_links ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Active Links</p>
        </div>

        <div className="group relative dash-glass rounded-2xl border p-5 transition-all hover:border-purple-500/20 hover:bg-[var(--dash-glass-hover-bg)]">
          <div className="flex items-center justify-between mb-3">
            <div              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-400 ring-1 ring-[var(--dash-glass-border)]">
              <Globe className="h-5 w-5" />
            </div>
            {monthTrend !== null && (
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${monthTrend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {monthTrend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(monthTrend)}%
              </span>
            )}
          </div>
          <p className="text-3xl font-black tabular-nums text-foreground">{s?.top_country ?? "—"}</p>
          <p className="text-xs text-muted-foreground mt-1">Top Country</p>
        </div>
      </div>

      {/* Period comparison bars */}
      <div className="dash-glass rounded-2xl border p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400">
            <Activity className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold text-foreground/70">Period Breakdown</h3>
        </div>
        <div className="space-y-5">
          {[
            { label: "Today", value: todayClicks, color: "from-terracotta-500 to-terracotta-400" },
            { label: "This Week", value: weekClicks, prev: prevWeek, color: "from-blue-500 to-blue-400" },
            { label: "This Month", value: totalClicks, prev: prevMonth, color: "from-forest-500 to-forest-400" },
          ].map((item) => {
            const maxVal = Math.max(item.value, item.prev || 0, 1);
            const trend = item.prev != null && item.prev > 0
              ? Math.round(((item.value - item.prev) / item.prev) * 100)
              : null;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tabular-nums text-foreground">{item.value.toLocaleString()}</span>
                    {trend !== null && (
                      <span className={`text-[10px] font-semibold ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {trend >= 0 ? "+" : ""}{trend}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                    style={{ width: `${Math.min(100, (item.value / maxVal) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main chart */}
      <div className="dash-glass rounded-2xl border">
        <div className="px-6 pt-5 pb-1">
          <h3 className="text-sm font-semibold text-foreground/70">Click Trends</h3>
          <p className="text-xs text-muted-foreground/60 mt-0.5">Daily clicks over the selected period</p>
        </div>
        <ClicksAreaChart data={analytics?.timeseries || []} height={320} />
      </div>

      {/* Breakdown charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="dash-glass rounded-2xl border">
          <div className="px-5 pt-4 pb-1">
            <h3 className="text-sm font-semibold text-foreground/70">Devices</h3>
          </div>
          <DevicePieChart data={analytics?.devices || []} height={260} />
        </div>
        <div className="dash-glass rounded-2xl border">
          <div className="px-5 pt-4 pb-1">
            <h3 className="text-sm font-semibold text-foreground/70">Referrers</h3>
          </div>
          <ReferrerBarChart data={analytics?.referrers || []} height={260} />
        </div>
        <div className="dash-glass rounded-2xl border">
          <div className="px-5 pt-4 pb-1">
            <h3 className="text-sm font-semibold text-foreground/70">Geography</h3>
          </div>
          <GeoBarChart data={analytics?.geo || []} height={260} />
        </div>
      </div>
    </div>
  );
}
