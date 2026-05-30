"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useABTest, useABTestAnalytics, useToggleABTest, useDeleteABTest,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  FlaskConical, ArrowLeft, ToggleLeft, ToggleRight, Trash2, ExternalLink,
  BarChart3, MousePointerClick, Target, Split,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const VARIANT_COLORS = ["#d47844", "#3d865e", "#3992e2", "#f06b44", "#857e77", "#dc9468", "#5fa37b", "#5faeed"];

const RANGE_OPTIONS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-white/[0.06]">
          {icon}
        </div>
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white/90">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

function VariantPieChart({ data }: { data: any[] }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Traffic Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {data.map((_: any, i: number) => (
              <Cell key={i} fill={VARIANT_COLORS[i % VARIANT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1714",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 space-y-2">
        {data.map((v: any, i: number) => (
          <div key={v.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: VARIANT_COLORS[i % VARIANT_COLORS.length] }} />
              <span className="text-white/60">{v.name}</span>
            </div>
            <span className="text-white/80 font-medium">{v.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CombinedTimeseriesChart({ variants }: { variants: any[] }) {
  // Merge all variant timeseries into combined data
  const dateMap = new Map<string, any>();
  variants.forEach((v: any, i: number) => {
    (v.timeseries || []).forEach((point: any) => {
      if (!dateMap.has(point.date)) {
        dateMap.set(point.date, { date: point.date });
      }
      dateMap.get(point.date)![v.name] = point.clicks;
    });
  });

  const combinedData = Array.from(dateMap.values()).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (combinedData.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Clicks Over Time</h3>
        <div className="flex items-center justify-center h-[260px]">
          <p className="text-sm text-white/30">No click data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Clicks Over Time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={combinedData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            {variants.map((v: any, i: number) => (
              <linearGradient key={v.id} id={`gradient-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={VARIANT_COLORS[i % VARIANT_COLORS.length]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={VARIANT_COLORS[i % VARIANT_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.2)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => {
              const d = new Date(val);
              return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }}
          />
          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1714",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "12px",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.5)" }}
          />
          {variants.map((v: any, i: number) => (
            <Area
              key={v.id}
              type="monotone"
              dataKey={v.name}
              stroke={VARIANT_COLORS[i % VARIANT_COLORS.length]}
              strokeWidth={2}
              fill={`url(#gradient-${v.id})`}
              name={v.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function VariantComparisonBar({ variants }: { variants: any[] }) {
  const barData = variants.map((v: any, i: number) => ({
    name: v.name,
    clicks: v.clicks_count || 0,
    percentage: v.percentage || 0,
    fill: VARIANT_COLORS[i % VARIANT_COLORS.length],
  }));

  if (barData.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Variant Comparison</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={barData} margin={{ left: 0, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1714",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="clicks" radius={[6, 6, 0, 0]}>
            {barData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ABTestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [range, setRange] = useState("30d");

  const { data: test, isLoading } = useABTest(id);
  const { data: analytics, isLoading: analyticsLoading } = useABTestAnalytics(id, range);
  const toggleTest = useToggleABTest();
  const deleteTest = useDeleteABTest();

  const handleDelete = async () => {
    if (!confirm("Delete this A/B test? This cannot be undone.")) return;
    try {
      await deleteTest.mutateAsync(id);
      toast.success("A/B test deleted");
      router.push("/dashboard/ab-tests");
    } catch {
      toast.error("Failed to delete A/B test");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FlaskConical className="h-12 w-12 text-white/20 mb-4" />
        <p className="text-white/40 text-lg">A/B test not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/ab-tests")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to A/B Tests
        </Button>
      </div>
    );
  }

  const variants = analytics?.variants || test.variants || [];
  const totalClicks = analytics?.total_clicks || variants.reduce((a: number, v: any) => a + (v.clicks_count || 0), 0);
  const isActive = test.is_active;
  const pieData = variants.map((v: any) => ({
    name: v.name,
    value: v.weight || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative">
          <button
            onClick={() => router.push("/dashboard/ab-tests")}
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to A/B Tests
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-white/[0.06]">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-forest-500/20 text-forest-300 border-forest-500/30" : ""}>
                  {isActive ? "Active" : "Paused"}
                </Badge>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white/90 truncate">{test.name}</h1>
              <p className="mt-1 text-sm text-white/40 font-light">
                {variants.length} variants · /{test.short_code}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleTest.mutate(test.id)}
                className={isActive ? "text-forest-300 border-forest-500/30" : ""}
              >
                {isActive ? <ToggleRight className="h-4 w-4 mr-1.5" /> : <ToggleLeft className="h-4 w-4 mr-1.5" />}
                {isActive ? "Pause Test" : "Activate"}
              </Button>
              <Button variant="ghost" size="sm" className="text-white/30 hover:text-rust-400" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Time range selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/40 font-medium mr-1">Range:</span>
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              range === opt.value
                ? "bg-terracotta-500/20 text-terracotta-300 border border-terracotta-500/30"
                : "text-white/40 hover:text-white/70 bg-white/[0.03] border border-transparent"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<MousePointerClick className="h-4 w-4" />}
            label="Total Clicks"
            value={totalClicks.toLocaleString()}
            sub="Across all variants"
          />
          <StatCard
            icon={<Split className="h-4 w-4" />}
            label="Variants"
            value={variants.length}
          />
          <StatCard
            icon={<BarChart3 className="h-4 w-4" />}
            label="Top Variant"
            value={variants.length > 0 ? variants.reduce((a: any, b: any) => (a.clicks_count || 0) > (b.clicks_count || 0) ? a : b).name : "—"}
            sub={variants.length > 0 ? `${(variants.reduce((a: any, b: any) => (a.clicks_count || 0) > (b.clicks_count || 0) ? a : b).percentage || 0).toFixed(1)}% of traffic` : ""}
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            label="Test Link"
            value={`/${test.short_code}`}
            sub={
              <Link
                href={`/${test.short_code}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-terracotta-400 hover:text-terracotta-300 transition-colors"
              >
                Open <ExternalLink className="h-3 w-3" />
              </Link>
            }
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CombinedTimeseriesChart variants={variants} />
        </div>
        <div>
          <VariantPieChart data={pieData} />
        </div>
      </div>

      {/* Variant comparison */}
      <VariantComparisonBar variants={variants} />

      {/* Variants table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white/70">Variant Details</h3>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {variants.map((v: any, i: number) => (
            <div key={v.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: VARIANT_COLORS[i % VARIANT_COLORS.length] }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/80">{v.name}</p>
                  <p className="text-xs text-white/40 truncate max-w-[300px]">{v.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-white/80">{v.clicks_count?.toLocaleString() || 0}</p>
                  <p className="text-xs text-white/40">clicks</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white/80">{v.percentage?.toFixed(1) || 0}%</p>
                  <p className="text-xs text-white/40">share</p>
                </div>
                <div className="w-20 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${v.percentage || 0}%`,
                      backgroundColor: VARIANT_COLORS[i % VARIANT_COLORS.length],
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
