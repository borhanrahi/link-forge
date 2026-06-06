"use client";

import { cn } from "@/lib/utils";

export interface StatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
  hint?: string;
  className?: string;
}

export function Stat({ label, value, icon, trend, accent, hint, className }: StatProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-[var(--dash-glass-border)] bg-[var(--dash-glass-bg)] backdrop-blur-xl p-5 transition-all duration-300 hover:bg-[var(--dash-glass-hover-bg)]",
        accent
          ? "hover:border-terracotta-500/30 hover:shadow-[0_0_30px_-5px] hover:shadow-terracotta-500/15"
          : "hover:border-[var(--dash-glass-hover-border)]",
        className,
      )}
    >
      {accent && (
        <div className="absolute inset-x-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-terracotta-500/60 to-transparent" />
      )}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground tracking-[0.15em] uppercase">
          {label}
        </span>
        {icon && (
          <div className="text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/60">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="text-4xl font-black tracking-tight text-foreground tabular-nums">
          {value}
        </p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
              trend.positive
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500",
            )}
          >
            {trend.positive ? "\u2191" : "\u2193"} {trend.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground/70">{hint}</p>}
    </div>
  );
}
