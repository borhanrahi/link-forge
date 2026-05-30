"use client";

import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  showArea?: boolean;
}

export function Sparkline({
  data,
  width = 56,
  height = 20,
  className,
  color = "#d47844",
  showArea = false,
}: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div
        className={cn("inline-flex items-end gap-px", className)}
        style={{ height, width }}
        aria-label="No data available"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-[1px] bg-white/[0.06]"
            style={{ height: "30%" }}
          />
        ))}
      </div>
    );
  }

  const validData = data.map((d) => Math.max(0, d ?? 0));
  const max = Math.max(...validData, 1);
  const min = Math.min(...validData);
  const range = max - min || 1;

  const pathD = validData
    .map((value, i) => {
      const x = (i / (validData.length - 1)) * (width - 2) + 1;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const areaD = showArea
    ? `${pathD} L${width - 1},${height - 1} L1,${height - 1} Z`
    : "";

  return (
    <svg
      width={width}
      height={height}
      className={cn("overflow-visible shrink-0", className)}
      viewBox={`0 0 ${width} ${height}`}
      aria-label={`Sparkline: ${data.join(", ")}`}
    >
      {showArea && (
        <path
          d={areaD}
          fill={color}
          fillOpacity={0.08}
          className="transition-all duration-300"
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-[0.08] transition-all duration-300"
      />
    </svg>
  );
}
