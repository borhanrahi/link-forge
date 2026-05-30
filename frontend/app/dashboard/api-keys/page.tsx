"use client";

import { useState } from "react";
import { Stat, EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAPIKeys, useCreateAPIKey, useRevokeAPIKey } from "@/hooks";
import { Key, Plus, Trash2, Copy, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function APIKeysPage() {
  const { data: keys } = useAPIKeys();
  const createKey = useCreateAPIKey();
  const revokeKey = useRevokeAPIKey();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const result = await createKey.mutateAsync({ name: name.trim() });
      setRevealedKey(result.key);
      setName("");
      setOpen(false);
      toast.success("API key created");
    } catch {
      toast.error("Failed to create API key");
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
              API Keys
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">API Keys</span>
            </h1>
            <p className="mt-2 text-sm text-white/40 font-light">Manage programmatic access tokens</p>
          </div>
          <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Key
          </Button>
        </div>
      </div>

      {revealedKey && (
        <div className="rounded-2xl border border-forest-500/20 bg-forest-500/5 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-300">Your API key (copy it now, it won't be shown again):</p>
              <p className="text-xs text-white/50 font-mono mt-1 break-all">{revealedKey}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(revealedKey); toast.success("Copied!"); }}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {keys && keys.length > 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl divide-y divide-white/[0.06]">
          {keys.map((key: any) => (
            <div key={key.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-white/[0.06]">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">{key.name}</p>
                  <p className="text-xs text-white/40 font-mono">{key.key_prefix}...{key.scopes}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-white/40 bg-white/[0.03]">
                  {key.is_active ? "Active" : "Revoked"}
                </span>
                <Button variant="ghost" size="icon-sm" className="text-white/20 hover:text-rust-400" onClick={() => revokeKey.mutate(key.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
          <EmptyState
            icon={<Key className="h-6 w-6 text-white/30" />}
            title="No API keys"
            description="Create an API key to access LinkNest programmatically."
            action={<Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Create Key</Button>}
          />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Key name (e.g. CI/CD)" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white" onClick={handleCreate} disabled={!name.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
