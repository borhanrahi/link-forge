"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import { BarChart3, Globe } from "lucide-react";

const COLORS = ["#d47844", "#3d865e", "#3992e2", "#f06b44", "#a78bfa", "#dc9468", "#5fa37b", "#5faeed"];

interface ChartProps {
  data: any[];
  height?: number;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#1a1714]/95 backdrop-blur-xl px-3 py-2 shadow-xl shadow-black/30">
      <p className="text-[11px] text-white/40 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-semibold text-white">
          {entry.value?.toLocaleString()} <span className="text-white/40 font-normal text-xs">{entry.name || "clicks"}</span>
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#1a1714]/95 backdrop-blur-xl px-3 py-2 shadow-xl shadow-black/30">
      <p className="text-[11px] text-white/40 capitalize">{d.name}</p>
      <p className="text-sm font-semibold text-white">{d.value?.toLocaleString()} <span className="text-white/40 font-normal text-xs">clicks</span></p>
    </div>
  );
}

export function ClicksAreaChart({ data, height = 300 }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <BarChart3 className="mx-auto h-8 w-8 text-white/10 mb-2" />
          <p className="text-sm text-white/30">No click data yet</p>
          <p className="text-xs text-white/15 mt-0.5">Data will appear once your links get clicks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d47844" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#d47844" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dy={8}
            tickFormatter={(val) => {
              const d = new Date(val);
              return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dx={-5}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#d47844"
            strokeWidth={2.5}
            fill="url(#clickGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#d47844",
              stroke: "#0d0b0a",
              strokeWidth: 2,
            }}
            name="Clicks"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DevicePieChart({ data, height = 300 }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-white/10 mb-2" />
          <p className="text-sm text-white/30">No device data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 pb-3">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="clicks"
            nameKey="device_type"
            stroke="none"
          >
            {data.map((_: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-white/50 capitalize">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReferrerBarChart({ data, height = 300 }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="mx-auto h-6 w-6 rounded bg-white/5 mb-2" />
          <p className="text-sm text-white/30">No referrer data</p>
        </div>
      </div>
    );
  }

  const formattedData = data.map((d: any) => ({
    ...d,
    referrer: d.referrer?.length > 18 ? d.referrer.slice(0, 18) + "…" : d.referrer,
  }));

  return (
    <div className="px-2 pb-3">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={formattedData} layout="vertical" margin={{ left: 5, right: 10, top: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
          <XAxis
            type="number"
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="referrer"
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="clicks" fill="#3992e2" radius={[0, 6, 6, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GeoBarChart({ data, height = 300 }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl" style={{ height }}>
        <div className="text-center">
          <Globe className="mx-auto h-8 w-8 text-white/10 mb-2" />
          <p className="text-sm text-white/30">No geographic data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
      <div className="px-5 pt-4 pb-1">
        <h3 className="text-sm font-semibold text-white/70">Geography</h3>
      </div>
      <div className="px-4 pb-4">
        <ResponsiveContainer width="100%" height={height - 40}>
          <BarChart data={data} margin={{ left: 0, right: 10, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis
              dataKey="country_code"
              stroke="rgba(255,255,255,0.15)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.15)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="clicks" fill="#3d865e" radius={[6, 6, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


