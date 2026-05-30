"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ExternalLink, Search } from "lucide-react";

interface LinkSelectProps {
  value: string;
  onChange: (v: string) => void;
  links: any[];
  placeholder?: string;
}

export function LinkSelect({ value, onChange, links, placeholder = "Select a link..." }: LinkSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const filtered = links.filter((l) =>
    !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.short_code?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = links.find((l) => l.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-sm transition-all outline-none ${
          open
            ? "border-terracotta-500/40 bg-white/[0.06] ring-2 ring-terracotta-500/10"
            : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]"
        } ${value ? "text-white/80" : "text-white/30"}`}
      >
        <span className="truncate">{selected ? (selected.title || selected.short_code) : placeholder}</span>
        <ChevronDown className={`h-4 w-4 text-white/30 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-white/[0.08] bg-[#131110] backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
          {links.length > 5 && (
            <div className="p-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 h-8">
                <Search className="h-3.5 w-3.5 text-white/25" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search links..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white/80 outline-none placeholder:text-white/25"
                />
              </div>
            </div>
          )}
          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-xs text-white/30">No links found</p>
            ) : (
              filtered.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => { onChange(link.id); setOpen(false); setSearch(""); }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    value === link.id
                      ? "bg-terracotta-500/10 text-white"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-md shrink-0 ${
                    value === link.id ? "bg-terracotta-500/20 text-terracotta-400" : "bg-white/[0.06] text-white/30"
                  }`}>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{link.title || "Untitled"}</p>
                    <p className="text-[11px] text-white/30 font-mono truncate">{link.short_code}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
