"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useABTests, useCreateABTest, useToggleABTest, useDeleteABTest } from "@/hooks";
import { FlaskConical, Plus, Trash2, ToggleLeft, ToggleRight, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ABTestsPage() {
  const router = useRouter();
  const { data: tests } = useABTests();
  const createTest = useCreateABTest();
  const toggleTest = useToggleABTest();
  const deleteTest = useDeleteABTest();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [variants, setVariants] = useState<{ name: string; url: string; weight: number }[]>([
    { name: "Control", url: "", weight: 50 },
    { name: "Variant B", url: "", weight: 50 },
  ]);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a test name");
      return;
    }
    const emptyUrls = variants.filter(v => !v.url.trim());
    if (emptyUrls.length > 0) {
      toast.error(`Please enter a destination URL for "${emptyUrls[0].name}"`);
      return;
    }
    try {
      await createTest.mutateAsync({ name: name.trim(), variants });
      setOpen(false);
      setName("");
      setVariants([
        { name: "Control", url: "", weight: 50 },
        { name: "Variant B", url: "", weight: 50 },
      ]);
      toast.success("A/B test created");
    } catch {
      toast.error("Failed to create A/B test");
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl dash-glass border p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dash-glass-border)] bg-[var(--dash-glass-bg)] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
              <Sparkles className="h-3 w-3" />
              A/B Testing
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="text-foreground">A/B Tests</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-light">Split traffic between destination URLs</p>
          </div>
          <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Test
          </Button>
        </div>
      </div>

      {tests && tests.length > 0 ? (
        <div className="dash-glass rounded-2xl border divide-y divide-[var(--dash-glass-border)]">
          {tests.map((test: any) => (
            <div
              key={test.id}
              className="flex items-center justify-between px-6 py-4 cursor-pointer transition-all duration-200 hover:bg-[var(--dash-glass-hover-bg)]"
              onClick={() => router.push(`/dashboard/ab-tests/${test.id}`)}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-[var(--dash-glass-border)] shrink-0">
                  <FlaskConical className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground/80 truncate">{test.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {test.variants?.length || 0} variants · /{test.short_code}
                    {test.variants && (
                      <span className="ml-2">
                        · {test.variants.reduce((a: number, v: any) => a + (v.clicks_count || 0), 0)} total clicks
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => toggleTest.mutate(test.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {test.is_active ? <ToggleRight className="h-5 w-5 text-forest-400" /> : <ToggleLeft className="h-5 w-5" />}
                </button>                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground/40 hover:text-rust-400" onClick={() => deleteTest.mutate(test.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dash-glass rounded-2xl border">
          <EmptyState
            icon={<FlaskConical className="h-6 w-6 text-muted-foreground/60" />}
            title="No A/B tests"
            description="Split traffic between URLs to optimize conversions."
            action={<Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1.5" />Create Test</Button>}
          />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create A/B Test</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Test name" value={name} onChange={(e) => setName(e.target.value)} />
            {variants.map((v, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Input placeholder="Variant name" value={v.name} onChange={(e) => {
                    const newVariants = [...variants];
                    newVariants[i].name = e.target.value;
                    setVariants(newVariants);
                  }} className="flex-1" />
                  <Input type="number" placeholder="%" value={v.weight} onChange={(e) => {
                    const newVariants = [...variants];
                    newVariants[i].weight = parseInt(e.target.value) || 0;
                    setVariants(newVariants);
                  }} className="w-20" />
                </div>
                <Input placeholder="Destination URL" value={v.url} onChange={(e) => {
                  const newVariants = [...variants];
                  newVariants[i].url = e.target.value;
                  setVariants(newVariants);
                }} />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setVariants([...variants, { name: `Variant ${String.fromCharCode(65 + variants.length)}`, url: "", weight: 50 }])}>
              <Plus className="h-3 w-3 mr-1" /> Add Variant
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white" onClick={handleCreate} disabled={createTest.isPending}>
              {createTest.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
