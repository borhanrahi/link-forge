"use client";

import { useState } from "react";
import { Input, Badge } from "@/components/ui";
import { useDomains, useAddDomain } from "@/hooks";
import { Globe, Plus, CheckCircle2, XCircle, Loader2 } from "lucide-react";
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Custom Domains</h1>
        <p className="mt-1 text-sm text-neutral-400">Use your own domain for links and bio pages</p>
      </div>

      {/* Add domain form */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <div className="flex max-w-lg gap-3">
          <div className="flex-1">
            <Input
              placeholder="e.g., links.yourdomain.com"
              hint="Enter your domain to get started. We'll guide you through DNS setup."
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={addDomain.isPending || !newDomain.trim()}
            className="mt-[26px] inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addDomain.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </button>
        </div>
      </div>

      {/* Domains list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        </div>
      ) : domains && domains.length > 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
          <div className="divide-y divide-neutral-800">
            {(domains as any[]).map((d: any) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-neutral-800/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-200">{d.domain}</p>
                    <p className="text-xs text-neutral-500">Added {new Date(d.created_at).toLocaleDateString()}</p>
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
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-800 mb-4">
              <Globe className="h-6 w-6 text-neutral-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">No domains yet</h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-sm">
              Add your first custom domain above to start using it with your links and bio pages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
