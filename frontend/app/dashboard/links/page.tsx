"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useLinks } from "@/hooks";
import { Link2, Plus, ExternalLink, Search, Copy, Check, ArrowUpRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

const SHORT_DOMAIN = "http://localhost:8000";

export default function LinksPage() {
  const router = useRouter();
  const { data: links } = useLinks();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = links?.filter(
    (l: any) =>
      !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.short_code?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCopy = (e: React.MouseEvent, linkId: string, shortUrl: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(linkId);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
              <Sparkles className="h-3 w-3" />
              Links
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Links
              </span>
            </h1>
            <p className="mt-2 text-sm text-white/40 font-light">Manage all your shortened links</p>
          </div>
          <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500" render={<Link href="/dashboard/links/new" />}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Link
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
        <input
          type="text"
          placeholder="Search links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl pl-10 pr-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500/30 transition-all"
        />
      </div>

      {/* Links list — glass panel */}
      {filtered && filtered.length > 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl divide-y divide-white/[0.06]">
          {filtered.map((link: any) => {
            const shortUrl = `${SHORT_DOMAIN}/${link.short_code}`;
            return (
              <div
                key={link.id}
                onClick={() => router.push(`/dashboard/links/${link.id}`)}
                className="flex items-center justify-between px-6 py-4 transition-all duration-200 cursor-pointer hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-white/[0.06] shrink-0">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/80 truncate max-w-[280px]">
                      {link.title || "Untitled"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-terracotta-400/80 font-mono hover:text-terracotta-300 truncate max-w-[280px] transition-colors"
                      >
                        {shortUrl}
                      </a>
                      <button
                        onClick={(e) => handleCopy(e, link.id, shortUrl)}
                        className="shrink-0 text-white/30 hover:text-white/60 transition-colors"
                        aria-label="Copy URL"
                      >
                        {copiedId === link.id ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                      <div className="flex items-center gap-1 text-xs text-white/20">
                        <ArrowUpRight className="h-3 w-3" />
                        {link.clicks_count ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[11px] font-medium shrink-0 backdrop-blur-xl ${
                  link.is_active
                    ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10"
                    : "border-white/[0.08] text-white/40 bg-white/[0.03]"
                }`}>
                  {link.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
          <EmptyState
            icon={<Link2 className="h-6 w-6 text-white/30" />}
            title={search ? "No links found" : "No links yet"}
            description={search ? "Try a different search term." : "Create your first shortened link to get started."}
            action={!search && (
              <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500" render={<Link href="/dashboard/links/new" />}>
                <Plus className="h-4 w-4 mr-1.5" />
                Create Link
              </Button>
            )}
          />
        </div>
      )}
    </div>
  );
}
