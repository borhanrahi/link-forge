"use client";

import { useState } from "react";
import { Card, CardContent, Button, Input, Badge } from "@/components/ui";
import { useDomains, useAddDomain } from "@/hooks";
import { Globe, Plus, CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function DomainsPage() {
  const { data: domains, isLoading } = useDomains();
  const addDomain = useAddDomain();
  const [newDomain, setNewDomain] = useState("");

  const handleAdd = async () => {
    if (!newDomain.trim()) return;
    try {
      await addDomain.mutateAsync(newDomain.trim());
      toast.success("Domain added!");
      setNewDomain("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add domain");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
            <Sparkles className="h-3 w-3" />
            Domains
          </span>
          <h1 className="text-4xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Custom Domains
            </span>
          </h1>
          <p className="mt-2 text-sm text-white/40 font-light">Use your own domain for links and bio pages</p>
        </div>
      </div>

      {/* Add domain form */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="flex max-w-lg gap-3 items-center">
          <div className="flex-1">
            <Input
              placeholder="e.g., links.yourdomain.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={addDomain.isPending || !newDomain.trim()}
            className="h-10 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/20 hover:from-terracotta-400 hover:to-terracotta-500"
          >
            {addDomain.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Plus className="h-4 w-4 mr-1.5" />
            )}
            Add
          </Button>
        </div>
        <p className="mt-2 text-xs text-white/30">Enter your domain to get started. We'll guide you through DNS setup.</p>
      </div>

      {/* Domains list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-white/20" />
        </div>
      ) : domains && domains.length > 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl divide-y divide-white/[0.06]">
          {(domains as any[]).map((d: any) => (
            <div key={d.id} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.03]">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-white/[0.06]">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/70">{d.domain}</p>
                  <p className="text-xs text-white/30">Added {new Date(d.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {(d as any).status === "verified" || (d as any).verified ? (
                <Badge variant="success">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="warning">
                  <XCircle className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
          <div className="flex flex-col items-center py-12 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] mb-4">
              <Globe className="h-6 w-6 text-white/30" />
            </div>
            <h3 className="text-lg font-semibold text-white/70">No domains yet</h3>
            <p className="mt-1 text-sm text-white/40 max-w-sm">
              Add your first custom domain above to start using it with your links and bio pages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
