"use client";

import { useState, useEffect } from "react";
import { Stat } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser, useExportWorkspace } from "@/hooks";
import { useAuthStore } from "@/lib/auth-store";
import { Settings, User, Download, Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useCurrentUser();
  const exportWorkspace = useExportWorkspace();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (user?.full_name) setFullName(user.full_name);
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl dash-glass border p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dash-glass-border)] bg-[var(--dash-glass-bg)] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
            <Sparkles className="h-3 w-3" />
            Settings
          </span>
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-foreground">Settings</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-light">Manage your account and workspace</p>
        </div>
      </div>

      {/* Profile */}
      <div className="dash-glass rounded-2xl border p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-4 w-4 text-terracotta-400" />
          <h2 className="text-sm font-semibold text-foreground/70">Profile</h2>
        </div>
        <div className="space-y-3 max-w-md">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <Input value={user?.email || ""} disabled className="opacity-50" />
          </div>
          <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white">Save Changes</Button>
        </div>
      </div>

      {/* Export */}
      <div className="dash-glass rounded-2xl border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Download className="h-4 w-4 text-terracotta-400" />
          <h2 className="text-sm font-semibold text-foreground/70">Export Workspace</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Download all your links, bio pages, tags, and UTM presets as a JSON file.</p>
        <Button variant="outline" onClick={() => exportWorkspace.mutate()} disabled={exportWorkspace.isPending}>
          <Download className="h-4 w-4 mr-1.5" />
          {exportWorkspace.isPending ? "Exporting..." : "Export Data"}
        </Button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="dash-glass rounded-2xl border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-4 w-4 text-terracotta-400" />
          <h2 className="text-sm font-semibold text-foreground/70">Keyboard Shortcuts</h2>
        </div>
        <div className="space-y-2 text-sm">
          {[
            ["Ctrl/Cmd + K", "Open command palette"],
            ["Ctrl + N", "Create new link"],
            ["Ctrl + B", "Create new bio page"],
          ].map(([key, desc]) => (                <div key={key} className="flex items-center justify-between py-1.5 border-b border-[var(--dash-glass-border)] last:border-0">
              <span className="text-foreground/50">{desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground font-mono">{key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
