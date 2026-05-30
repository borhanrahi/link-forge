"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useAPIKeys, useCreateAPIKey, useRevokeAPIKey } from "@/hooks";
import { Key, Plus, Trash2, Copy, Check, Sparkles, Shield } from "lucide-react";
import { toast } from "sonner";

export default function APIKeysPage() {
  const { data: keys, isLoading } = useAPIKeys();
  const createKey = useCreateAPIKey();
  const revokeKey = useRevokeAPIKey();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<{ name: string; key: string; prefix: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const result = await createKey.mutateAsync({ name: name.trim() });
      setNewKey({ name: result.name, key: result.key, prefix: result.key_prefix });
      setName("");
      setShowCreate(false);
    } catch {
      toast.error("Failed to create API key");
    }
  };

  const handleCopy = () => {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey.key);
    setCopied(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPrefix = (prefix: string) => {
    navigator.clipboard.writeText(prefix);
    toast.success("Copied");
  };

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
              API Keys
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">API Keys</span>
            </h1>
            <p className="mt-1.5 text-sm text-white/40 font-light">Manage programmatic access tokens for your workspace</p>
          </div>
          <Button
            className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 shrink-0"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Key
          </Button>
        </div>
      </div>

      {/* Keys list */}
      {isLoading ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl divide-y divide-white/[0.06]">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.06]" />
                <div>
                  <div className="h-4 w-28 animate-pulse rounded bg-white/[0.06] mb-1.5" />
                  <div className="h-3 w-40 animate-pulse rounded bg-white/[0.04]" />
                </div>
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.06]" />
            </div>
          ))}
        </div>
      ) : keys && keys.length > 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl divide-y divide-white/[0.06]">
          {keys.map((key: any) => (
            <div key={key.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-white/[0.06] shrink-0">
                  <Key className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/80 truncate">{key.name}</p>
                  <button
                    onClick={() => handleCopyPrefix(key.key_prefix)}
                    className="text-xs text-white/30 font-mono hover:text-white/50 transition-colors"
                    title="Copy key prefix"
                  >
                    {key.key_prefix}••••••••
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  key.is_active
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border border-white/[0.08] bg-white/[0.03] text-white/40"
                }`}>
                  {key.is_active ? "Active" : "Revoked"}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-white/15 hover:text-red-400 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm("Revoke this API key? This cannot be undone.")) {
                      revokeKey.mutate(key.id, { onSuccess: () => toast.success("Key revoked") });
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
          <EmptyState
            icon={<Shield className="h-8 w-8 text-white/15" />}
            title="No API keys"
            description="Create an API key to access LinkNest programmatically via the REST API."
            action={
              <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                Create Key
              </Button>
            }
          />
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>Give your key a name to identify it later.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g. CI/CD Pipeline, Mobile App"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white"
              onClick={handleCreate}
              disabled={!name.trim() || createKey.isPending}
            >
              {createKey.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Key Revealed Modal */}
      <Dialog open={!!newKey} onOpenChange={(open) => { if (!open) setNewKey(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Check className="h-4 w-4" />
              </div>
              API Key Created
            </DialogTitle>
            <DialogDescription>
              Copy your key now — it will <span className="text-white/70 font-medium">not</span> be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-[11px] text-emerald-300/70 font-medium uppercase tracking-wider mb-2">Your API Key</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-white/70 font-mono break-all bg-black/20 rounded-lg px-3 py-2.5 select-all leading-relaxed">
                {newKey?.key}
              </code>
              <button
                onClick={handleCopy}
                className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                  copied
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/[0.08] bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white"
              onClick={() => setNewKey(null)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
