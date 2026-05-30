"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "active" | "inactive" | "published" | "draft" | "live" | "success" | "warning";
  label?: string;
  className?: string;
}

const STATUS_CONFIG = {
  active: {
    variant: "success" as const,
    label: "Active",
  },
  inactive: {
    variant: "default" as const,
    label: "Inactive",
  },
  published: {
    variant: "success" as const,
    label: "Live",
  },
  draft: {
    variant: "default" as const,
    label: "Draft",
  },
  live: {
    variant: "success" as const,
    label: "Live",
  },
  success: {
    variant: "success" as const,
    label: "Success",
  },
  warning: {
    variant: "warning" as const,
    label: "Warning",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant={config.variant} className={cn("shrink-0", className)}>
      {label || config.label}
    </Badge>
  );
}
