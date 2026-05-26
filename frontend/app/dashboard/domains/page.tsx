"use client";

import { useState } from "react";
import { Button, Card, CardContent, Input, Badge, SectionHeading, EmptyState } from "@/components/ui";
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
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="Custom Domains"
        description="Use your own domain for links and bio pages"
      />

      <div className="flex max-w-md gap-2">
        <div className="flex-1">
          <Input
            placeholder="e.g., links.yourdomain.com"
            hint="Enter your domain to get started"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <Button
          size="sm"
          className="mt-[26px]"
          onClick={handleAdd}
          disabled={addDomain.isPending || !newDomain.trim()}
        >
          {addDomain.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </div>
          ) : domains && domains.length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {(domains as any[]).map((d: any) => (
                <div key={d.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-950 dark:text-terracotta-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{d.domain}</p>
                      <p className="text-xs text-neutral-400">Added {new Date(d.created_at).toLocaleDateString()}</p>
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
            <div className="px-5">
              <EmptyState
                icon={<Globe className="h-6 w-6 text-neutral-400" />}
                title="No domains yet"
                description="Add your first custom domain above."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
