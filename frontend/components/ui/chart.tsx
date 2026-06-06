"use client";

import * as React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "var(--chart-1, #d47844)",
  "var(--chart-2, #6b8e76)",
  "var(--chart-3, #7a8db5)",
  "var(--chart-4, #c89b7a)",
  "var(--chart-5, #a47ab5)",
  "var(--chart-6, #b5a47a)",
];

export function ChartContainer({
  children,
  className,
  height = 280,
}: {
  children: React.ReactElement;
  className?: string;
  height?: number;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

const tooltipContentStyle: React.CSSProperties = {
  backgroundColor: "rgba(20, 16, 13, 0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  color: "rgba(255,255,255,0.85)",
  fontSize: 12,
  padding: "8px 12px",
  backdropFilter: "blur(8px)",
};

const axisStyle: React.CSSProperties = {
  fontSize: 11,
  fill: "rgba(255,255,255,0.4)",
};

export interface SeriesPoint {
  [key: string]: string | number;
}

export interface AreaChartProps {
  data: SeriesPoint[];
  xKey: string;
  yKey: string;
  yLabel?: string;
  height?: number;
  className?: string;
  color?: string;
}

export function AreaChart({
  data,
  xKey,
  yKey,
  height = 280,
  className,
  color = CHART_COLORS[0],
}: AreaChartProps) {
  return (
    <ChartContainer className={className} height={height}>
      <RechartsAreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey={xKey} tick={axisStyle} stroke="rgba(255,255,255,0.1)" />
        <YAxis tick={axisStyle} stroke="rgba(255,255,255,0.1)" width={40} />
        <Tooltip contentStyle={tooltipContentStyle} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${yKey})`}
        />
      </RechartsAreaChart>
    </ChartContainer>
  );
}

export interface LineChartProps extends AreaChartProps {}

export function LineChart({
  data,
  xKey,
  yKey,
  height = 280,
  className,
  color = CHART_COLORS[0],
}: LineChartProps) {
  return (
    <ChartContainer className={className} height={height}>
      <RechartsLineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey={xKey} tick={axisStyle} stroke="rgba(255,255,255,0.1)" />
        <YAxis tick={axisStyle} stroke="rgba(255,255,255,0.1)" width={40} />
        <Tooltip contentStyle={tooltipContentStyle} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
}

export interface BarChartProps {
  data: SeriesPoint[];
  xKey: string;
  yKey: string;
  height?: number;
  className?: string;
  color?: string;
  horizontal?: boolean;
}

export function BarChart({
  data,
  xKey,
  yKey,
  height = 280,
  className,
  color = CHART_COLORS[2],
  horizontal = false,
}: BarChartProps) {
  return (
    <ChartContainer className={className} height={height}>
      <RechartsBarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        {horizontal ? (
          <>
            <XAxis type="number" tick={axisStyle} stroke="rgba(255,255,255,0.1)" />
            <YAxis dataKey={xKey} type="category" tick={axisStyle} stroke="rgba(255,255,255,0.1)" width={80} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={axisStyle} stroke="rgba(255,255,255,0.1)" />
            <YAxis tick={axisStyle} stroke="rgba(255,255,255,0.1)" width={40} />
          </>
        )}
        <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ChartContainer>
  );
}

export interface PieChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

export function PieChart({
  data,
  height = 260,
  className,
  showLegend = false,
}: PieChartProps) {
  return (
    <ChartContainer className={className} height={height}>
      <RechartsPieChart>
        <Tooltip contentStyle={tooltipContentStyle} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  );
}

export { CHART_COLORS };
