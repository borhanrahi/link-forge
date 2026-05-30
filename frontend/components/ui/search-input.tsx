"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative max-w-sm", className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl pl-10 pr-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500/30 transition-all"
      />
    </div>
  );
}
