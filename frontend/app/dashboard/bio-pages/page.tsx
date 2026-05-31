"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useBioPages } from "@/hooks";
import { Layout, Plus, Copy, Check, AlertCircle, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";

const BIO_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function BioPagesPage() {
  const router = useRouter();
  const { data: bioPages, isLoading, error, refetch } = useBioPages();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, id: string, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl dash-glass border p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dash-glass-border)] bg-[var(--dash-glass-bg)] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
              <Sparkles className="h-3 w-3" />
              Bio Pages
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="text-foreground">
                Bio Pages
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-light">
              Your link-in-bio pages {bioPages ? `(${bioPages.length}/10 used)` : ""}
            </p>
          </div>
          <Button
            disabled={bioPages && bioPages.length >= 10}
            className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500"
            render={<Link href="/dashboard/bio-pages/new" />}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Page
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="dash-glass rounded-2xl border">
          <div className="flex items-center justify-center py-16 gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-terracotta-400" />
            Loading bio pages...
          </div>
        </div>
      ) : error ? (
        <div className="dash-glass rounded-2xl border">
          <div className="flex flex-col items-center py-14 px-6 text-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground/70">Failed to load</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                {error instanceof Error ? error.message : "An unexpected error occurred. Please try again."}
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      ) : bioPages && bioPages.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bioPages.map((page: any) => {
            const pageUrl = `${BIO_DOMAIN}/b/${page.slug}`;
            return (
              <div
                key={page.id}
                onClick={() => router.push(`/dashboard/bio-pages/${page.id}`)}
                className="dash-glass rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:border-terracotta-500/30 hover:bg-[var(--dash-glass-hover-bg)] hover:shadow-[0_0_40px_-8px] hover:shadow-terracotta-500/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-[var(--dash-glass-border)]">
                    <Layout className="h-4 w-4" />
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-xl ${
                    page.is_published
                      ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10"
                      : "border-[var(--dash-glass-border)] text-muted-foreground bg-[var(--dash-glass-bg)]"
                  }`}>
                    {page.is_published ? "Live" : "Draft"}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground/80">
                  {page.title || "Untitled"}
                </h3>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <Layout className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground truncate font-mono">/{page.slug}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-muted-foreground/60 hover:text-terracotta-400 transition-colors rounded-lg hover:bg-[var(--dash-glass-hover-bg)]"
                      title="Open page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={(e) => handleCopy(e, page.id, pageUrl)}
                      className="p-1.5 text-muted-foreground/60 hover:text-foreground/60 transition-colors rounded-lg hover:bg-[var(--dash-glass-hover-bg)]"
                      title="Copy URL"
                    >
                      {copiedId === page.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                {(page.brand_color || page.bg_color) && (
                  <div className="mt-3 flex items-center gap-2 border-t border-[var(--dash-glass-border)] pt-3">
                    {page.brand_color && (
                      <span
                        className="h-3.5 w-3.5 rounded-full ring-1 ring-white/10"
                        style={{ backgroundColor: page.brand_color }}
                        title={`Brand: ${page.brand_color}`}
                      />
                    )}
                    {page.bg_color && (
                      <span
                        className="h-3.5 w-3.5 rounded-full ring-1 ring-white/10"
                        style={{ backgroundColor: page.bg_color }}
                        title={`Background: ${page.bg_color}`}
                      />
                    )}
                    <span className="text-[11px] text-muted-foreground/40 ml-auto">{page.blocks?.length ?? 0} blocks</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dash-glass rounded-2xl border">
          <EmptyState
            icon={<Layout className="h-6 w-6 text-muted-foreground/60" />}
            title="No bio pages yet"
            description="Create your first link-in-bio page to share all your important links in one place."
            action={
              <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500" render={<Link href="/dashboard/bio-pages/new" />}>
                <Plus className="h-4 w-4 mr-1.5" />
                Create Page
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
