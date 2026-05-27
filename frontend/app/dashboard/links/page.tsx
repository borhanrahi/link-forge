"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { useLinks } from "@/hooks";
import { Link2, Plus, ExternalLink, Search, Copy, Check, ArrowUpRight } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Links</h1>
          <p className="mt-1 text-sm text-neutral-400">Manage all your shortened links</p>
        </div>
        <Link href="/dashboard/links/new">
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500 hover:shadow-terracotta-500/30">
            <Plus className="h-4 w-4" />
            New Link
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-neutral-800 bg-neutral-900/50 pl-9 pr-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600/50 transition-all"
        />
      </div>

      {/* Links list */}
      {filtered && filtered.length > 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
          <div className="divide-y divide-neutral-800">
            {filtered.map((link: any) => {
              const shortUrl = `${SHORT_DOMAIN}/${link.short_code}`;
              return (
                <div
                  key={link.id}
                  onClick={() => router.push(`/dashboard/links/${link.id}`)}
                  className="flex items-center justify-between px-5 py-4 transition-all hover:bg-neutral-800/40 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400 shrink-0 group-hover:bg-terracotta-500/20 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-200 truncate group-hover:text-white transition-colors">
                        {link.title || "Untitled"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-terracotta-400 font-mono hover:text-terracotta-300 truncate max-w-[260px] transition-colors"
                        >
                          {shortUrl}
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(shortUrl);
                            setCopiedId(link.id);
                            setTimeout(() => setCopiedId(null), 1500);
                          }}
                          className="shrink-0 text-neutral-500 hover:text-neutral-300 transition-colors"
                        >
                          {copiedId === link.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <ArrowUpRight className="h-3 w-3" />
                          {link.clicks_count ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant={link.is_active ? "success" : "default"} className="shrink-0">
                    {link.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-800 mb-4">
              <Link2 className="h-6 w-6 text-neutral-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">{search ? "No links found" : "No links yet"}</h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-sm">
              {search ? "Try a different search term." : "Create your first shortened link to get started."}
            </p>
            {!search && (
              <Link href="/dashboard/links/new" className="mt-5">
                <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500">
                  <Plus className="h-4 w-4" />
                  Create Link
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
