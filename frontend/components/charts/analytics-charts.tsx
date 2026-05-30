"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

const COLORS = ["#d47844", "#3d865e", "#3992e2", "#f06b44", "#857e77", "#dc9468", "#5fa37b", "#5faeed"];

interface ChartProps {
  data: any[];
  height?: number;
}

export function ClicksAreaChart({ data, height = 300 }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl" style={{ height }}>
        <p className="text-sm text-white/30">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Click Trends</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d47844" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d47844" stopOpacity={0} />
            </linearGradient>
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
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#d47844"
            strokeWidth={2}
            fill="url(#clickGradient)"
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
      <div className="flex items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl" style={{ height }}>
        <p className="text-sm text-white/30">No device data</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Devices</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="clicks"
            nameKey="device_type"
          >
            {data.map((_: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
            formatter={(value) => <span style={{ color: "rgba(255,255,255,0.5)" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReferrerBarChart({ data, height = 300 }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl" style={{ height }}>
        <p className="text-sm text-white/30">No referrer data</p>
      </div>
    );
  }

  const formattedData = data.map((d: any) => ({
    ...d,
    referrer: d.referrer?.length > 20 ? d.referrer.slice(0, 20) + "..." : d.referrer,
  }));

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Top Referrers</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={formattedData} layout="vertical" margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="referrer"
            stroke="rgba(255,255,255,0.2)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1714",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="clicks" fill="#d47844" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GeoBarChart({ data, height = 300 }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl" style={{ height }}>
        <p className="text-sm text-white/30">No geo data</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Geographic Distribution</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ left: 0, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="country_code" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
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
          <Bar dataKey="clicks" fill="#3d865e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
