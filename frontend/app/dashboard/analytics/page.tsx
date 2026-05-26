"use client";

import { useState } from "react";
import { Stat, Card, CardContent, SectionHeading, Select } from "@/components/ui";
import { useAnalytics } from "@/hooks";
import { BarChart3, MousePointerClick, Globe, Smartphone } from "lucide-react";

const MOCK_ANALYTICS = [
  { label: "Today", clicks: 142, prev: 98 },
  { label: "This Week", clicks: 892, prev: 654 },
  { label: "This Month", clicks: 3421, prev: 2890 },
];

export default function AnalyticsPage() {
  const { data: analytics } = useAnalytics();
  const totalClicks = analytics?.summary?.total_clicks ?? 0;

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
          />
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Clicks" value={totalClicks.toLocaleString()} icon={<MousePointerClick className="h-4 w-4" />} />
        <Stat label="Unique Visitors" value={totalClicks > 0 ? Math.round(totalClicks * 0.72).toLocaleString() : "0"} icon={<Globe className="h-4 w-4" />} />
        <Stat label="Click Rate" value={totalClicks > 0 ? "4.2%" : "0%"} trend={{ value: "12%", positive: true }} icon={<BarChart3 className="h-4 w-4" />} />
        <Stat label="Mobile Share" value={totalClicks > 0 ? "63%" : "0%"} icon={<Smartphone className="h-4 w-4" />} />
      </div>

      {/* Comparative chart */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-5">Click Activity</h3>
          <div className="space-y-3">
            {MOCK_ANALYTICS.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">{item.label}</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{item.clicks.toLocaleString()} clicks</span>
                </div>
                <div className="flex h-2 gap-1">
                  <div
                    className="rounded-sm bg-terracotta-500 dark:bg-terracotta-600 transition-all"
                    style={{ width: `${Math.min(100, (item.clicks / 3500) * 100)}%` }}
                  />
                  <div
                    className="rounded-sm bg-neutral-200 dark:bg-neutral-700 transition-all"
                    style={{ width: `${Math.min(100, (item.prev / 3500) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-terracotta-500" />
                    Current
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-neutral-200 dark:bg-neutral-700" />
                    Previous
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
