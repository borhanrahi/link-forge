"use client";

import { useState, useRef, useEffect } from "react";
import { EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useClickGoalAlerts, useCreateClickGoalAlert, useDeleteClickGoalAlert, useLinks } from "@/hooks";
import { Bell, Plus, Trash2, Target, CheckCircle2, Sparkles, ChevronDown, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";

function LinkSelect({ value, onChange, links }: { value: string; onChange: (v: string) => void; links: any[] }) {
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
      <label className="text-xs font-medium text-white/50 mb-1.5 block">Link</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-sm transition-all outline-none ${
          open
            ? "border-terracotta-500/40 bg-white/[0.06] ring-2 ring-terracotta-500/10"
            : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]"
        } ${value ? "text-white/80" : "text-white/30"}`}
      >
        <span className="truncate">{selected ? (selected.title || selected.short_code) : "Select a link..."}</span>
        <ChevronDown className={`h-4 w-4 text-white/30 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-white/[0.08] bg-[#131110] backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
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
                  {link.clicks_count > 0 && (
                    <span className="text-[10px] text-white/25 tabular-nums shrink-0">{link.clicks_count}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AlertsPage() {
  const { data: alerts, isLoading: alertsLoading } = useClickGoalAlerts();
  const { data: links, isLoading: linksLoading } = useLinks();
  const createAlert = useCreateClickGoalAlert();
  const deleteAlert = useDeleteClickGoalAlert();
  const [open, setOpen] = useState(false);
  const [linkId, setLinkId] = useState("");
  const [goalClicks, setGoalClicks] = useState("");

  const handleCreate = async () => {
    if (!linkId || !goalClicks) return;
    try {
      await createAlert.mutateAsync({ link_id: linkId, goal_clicks: parseInt(goalClicks) });
      setOpen(false);
      setLinkId("");
      setGoalClicks("");
      toast.success("Alert created");
    } catch {
      toast.error("Failed to create alert");
    }
  };

  const activeLinks = (links || []).filter((l: any) => l.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-3">
              <Sparkles className="h-3 w-3" />
              Alerts
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">Goal Alerts</span>
            </h1>
            <p className="mt-1.5 text-sm text-white/40 font-light">Get notified when links hit click milestones</p>
          </div>
          <Button
            className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 shrink-0"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Alert
          </Button>
        </div>
      </div>

      {/* Alerts list */}
      {alertsLoading ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl divide-y divide-white/[0.06]">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.06]" />
                <div>
                  <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06] mb-1.5" />
                  <div className="h-3 w-48 animate-pulse rounded bg-white/[0.04]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : alerts && alerts.length > 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl divide-y divide-white/[0.06]">
          {alerts.map((alert: any) => {
            const link = links?.find((l: any) => l.id === alert.link_id);
            return (
              <div key={alert.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/[0.06] shrink-0 ${
                    alert.is_achieved ? "bg-forest-500/15 text-forest-400" : "bg-terracotta-500/15 text-terracotta-400"
                  }`}>
                    {alert.is_achieved ? <CheckCircle2 className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/80 truncate">
                      {link?.title || link?.short_code || "Unknown link"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-white/35">
                        Goal: <span className="text-white/50 font-medium">{alert.goal_clicks.toLocaleString()}</span> clicks
                      </p>
                      {alert.is_achieved && (
                        <span className="inline-flex items-center rounded-full bg-forest-500/10 border border-forest-500/20 px-2 py-0.5 text-[10px] font-semibold text-forest-400">
                          Achieved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-white/15 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                  onClick={() => {
                    if (confirm("Delete this alert?")) {
                      deleteAlert.mutate(alert.id, { onSuccess: () => toast.success("Alert deleted") });
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
          <EmptyState
            icon={<Bell className="h-8 w-8 text-white/15" />}
            title="No alerts"
            description="Set click goals on your links and get notified when they're reached."
            action={
              <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white" onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                Create Alert
              </Button>
            }
          />
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Goal Alert</DialogTitle>
            <DialogDescription>Get notified when a link reaches a click milestone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <LinkSelect value={linkId} onChange={setLinkId} links={activeLinks} />
            <div>
              <label className="text-xs font-medium text-white/50 mb-1.5 block">Goal Clicks</label>
              <Input
                type="number"
                placeholder="e.g. 1000"
                value={goalClicks}
                onChange={(e) => setGoalClicks(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white"
              onClick={handleCreate}
              disabled={!linkId || !goalClicks || createAlert.isPending}
            >
              {createAlert.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
