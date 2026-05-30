"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useClickGoalAlerts, useCreateClickGoalAlert, useDeleteClickGoalAlert, useLinks } from "@/hooks";
import { Bell, Plus, Trash2, Target, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AlertsPage() {
  const { data: alerts } = useClickGoalAlerts();
  const { data: links } = useLinks();
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

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
              <Sparkles className="h-3 w-3" />
              Alerts
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">Goal Alerts</span>
            </h1>
            <p className="mt-2 text-sm text-white/40 font-light">Get notified when links hit click milestones</p>
          </div>
          <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Alert
          </Button>
        </div>
      </div>

      {alerts && alerts.length > 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl divide-y divide-white/[0.06]">
          {alerts.map((alert: any) => {
            const link = links?.find((l: any) => l.id === alert.link_id);
            return (
              <div key={alert.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/[0.06] ${alert.is_achieved ? "bg-forest-500/20 text-forest-400" : "bg-terracotta-500/20 text-terracotta-400"}`}>
                    {alert.is_achieved ? <CheckCircle2 className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80">{link?.title || link?.short_code || "Unknown link"}</p>
                    <p className="text-xs text-white/40">Goal: {alert.goal_clicks.toLocaleString()} clicks {alert.is_achieved && "✓ Achieved"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="text-white/20 hover:text-rust-400" onClick={() => deleteAlert.mutate(alert.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
          <EmptyState
            icon={<Bell className="h-6 w-6 text-white/30" />}
            title="No alerts"
            description="Set click goals and get notified when they're reached."
            action={<Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Create Alert</Button>}
          />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Create Click Goal Alert</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <select value={linkId} onChange={(e) => setLinkId(e.target.value)} className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none">
              <option value="">Select a link...</option>
              {links?.map((l: any) => <option key={l.id} value={l.id}>{l.title || l.short_code}</option>)}
            </select>
            <Input type="number" placeholder="Goal clicks (e.g. 1000)" value={goalClicks} onChange={(e) => setGoalClicks(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white" onClick={handleCreate} disabled={!linkId || !goalClicks}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
