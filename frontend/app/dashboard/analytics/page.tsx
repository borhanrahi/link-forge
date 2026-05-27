"use client";

import { useState } from "react";
import { Stat } from "@/components/ui";
import { useAnalytics } from "@/hooks";
import { BarChart3, MousePointerClick, Globe, Smartphone, TrendingUp, Activity, TrendingDown, Sparkles } from "lucide-react";

function periodTrend(current: number, previous: number): { value: string; positive: boolean } | undefined {
  if (previous <= 0) return undefined;
  const pct = Math.round(((current - previous) / previous) * 100);
  return { value: `${Math.abs(pct)}%`, positive: pct >= 0 };
}

function TimeRangeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl px-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
    >
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
      <option value="90d">Last 90 days</option>
    </select>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("7d");
  const { data: analytics } = useAnalytics(range);
  const summary = analytics?.summary;
  const totalClicks = summary?.total_clicks ?? 0;
  const todayClicks = summary?.today_clicks ?? 0;
  const weekClicks = summary?.week_clicks ?? 0;
  const prevWeek = summary?.prev_week_clicks ?? 0;
  const prevMonth = summary?.prev_month_clicks ?? 0;

  const periods = [
    { label: "Today", clicks: todayClicks, prev: 0 },
    { label: "This Week", clicks: weekClicks, prev: prevWeek },
    { label: "This Month", clicks: totalClicks, prev: prevMonth },
  ];

  const maxClicks = Math.max(...periods.map((p) => Math.max(p.clicks, p.prev || 1)), 1);

  return (
    <div className="space-y-10">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-8 lg:p-10">
        <div className="absolute -inset-x-40 -top-40 h-[600px] w-[800px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
              <Sparkles className="h-3 w-3" />
              Insights
            </span>
            <h1 className="text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Analytics
              </span>
            </h1>
            <p className="mt-2 text-sm text-white/40 font-light">Track your link performance</p>
          </div>
          <TimeRangeSelect value={range} onChange={setRange} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Clicks" value={totalClicks.toLocaleString()} icon={<MousePointerClick className="h-4 w-4" />} accent />
        <Stat label="Unique Visitors" value={summary?.unique_clicks != null ? summary.unique_clicks.toLocaleString() : "0"} icon={<Globe className="h-4 w-4" />} />
        <Stat label="Total Links" value={summary?.total_links ?? 0} icon={<BarChart3 className="h-4 w-4" />} />
        <Stat label="Top Country" value={summary?.top_country ?? "\u2014"} icon={<Smartphone className="h-4 w-4" />} />
      </div>

      {/* Click Activity — glass panel */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-white/[0.06]">
            <Activity className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold text-white/70">Click Activity</h3>
        </div>
        <div className="space-y-7">
          {periods.map((item) => {
            const trend = periodTrend(item.clicks, item.prev);
            return (
              <div key={item.label} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/40">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black tabular-nums text-white">{item.clicks.toLocaleString()}</span>
                    {trend && (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-xl ${
                        trend.positive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {trend.value}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-terracotta-400 transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(100, (item.clicks / maxClicks) * 100)}%` }}
                  />
                </div>
                {item.prev > 0 && (
                  <div className="flex items-center gap-2 text-xs text-white/20">
                    <span className="h-2 w-2 rounded-full bg-white/[0.06]" />
                    Previous period: {item.prev.toLocaleString()} clicks
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
