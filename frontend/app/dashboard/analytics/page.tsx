"use client";

import { useState } from "react";
import { Stat, Card, CardContent, SectionHeading, Select } from "@/components/ui";
import { useAnalytics } from "@/hooks";
import { BarChart3, MousePointerClick, Globe, Smartphone, TrendingUp, Activity } from "lucide-react";

function calculatePeriods(analytics: any) {
  const summary = analytics?.summary;
  if (!summary) return { today: 0, week: 0, month: 0, prevWeek: 0, prevMonth: 0 };
  return {
    today: summary.today_clicks ?? 0,
    week: summary.week_clicks ?? 0,
    month: summary.total_clicks ?? 0,
    prevWeek: summary.prev_week_clicks ?? 0,
    prevMonth: summary.prev_month_clicks ?? 0,
  };
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("7d");
  const { data: analytics } = useAnalytics(range);
  const summary = analytics?.summary;
  const totalClicks = summary?.total_clicks ?? 0;
  const { today, week, month, prevWeek, prevMonth } = calculatePeriods(analytics);

  const periods = [
    { label: "Today", clicks: today, prev: 0 },
    { label: "This Week", clicks: week, prev: prevWeek },
    { label: "This Month", clicks: month, prev: prevMonth },
  ];

  const maxClicks = Math.max(...periods.map((p) => Math.max(p.clicks, p.prev || 1)), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="Analytics"
        description="Track your link performance"
        action={
          <Select
            options={[
              { value: "7d", label: "Last 7 days" },
              { value: "30d", label: "Last 30 days" },
              { value: "90d", label: "Last 90 days" },
            ]}
            defaultValue="7d"
            onChange={(v: string) => setRange(v)}
          />
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Clicks" value={totalClicks.toLocaleString()} icon={<MousePointerClick className="h-4 w-4" />} accent />
        <Stat label="Unique Visitors" value={summary?.unique_clicks != null ? summary.unique_clicks.toLocaleString() : "0"} icon={<Globe className="h-4 w-4" />} />
        <Stat label="Total Links" value={summary?.total_links ?? 0} icon={<BarChart3 className="h-4 w-4" />} />
        <Stat label="Top Country" value={summary?.top_country ?? "—"} icon={<Smartphone className="h-4 w-4" />} />
      </div>

      {/* Click Activity */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800">
              <Activity className="h-3.5 w-3.5 text-neutral-400" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-100">Click Activity</h3>
          </div>
          <div className="space-y-5">
            {periods.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">{item.label}</span>
                  <span className="font-semibold text-neutral-100">{item.clicks.toLocaleString()} clicks</span>
                </div>
                <div className="relative h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-terracotta-500 to-terracotta-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (item.clicks / maxClicks) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-terracotta-500" />
                    Current
                  </span>
                  {item.prev > 0 && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-neutral-600" />
                      Previous ({item.prev.toLocaleString()})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
