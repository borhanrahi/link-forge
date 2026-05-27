"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { useBioPages } from "@/hooks";
import { Layout, Plus, Copy, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";

const BIO_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function BioPagesPage() {
  const router = useRouter();
  const { data: bioPages, isLoading, error, refetch } = useBioPages();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Bio Pages</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Your link-in-bio pages {bioPages ? `(${bioPages.length}/10 used)` : ""}
          </p>
        </div>
        <Link href="/dashboard/bio-pages/new">
          <button
            disabled={bioPages && bioPages.length >= 10}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            New Page
          </button>
        </Link>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-12">
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500">
            <Loader2 className="h-5 w-5 animate-spin text-terracotta-400" />
            Loading bio pages...
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <div>
              <h3 className="font-semibold text-white">Failed to load bio pages</h3>
              <p className="mt-1 text-sm text-neutral-500 max-w-md">
                {error instanceof Error ? error.message : "An unexpected error occurred. Please try again."}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      ) : bioPages && bioPages.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bioPages.map((page: any) => {
            const pageUrl = `${BIO_DOMAIN}/b/${page.slug}`;
            return (
              <div
                key={page.id}
                onClick={() => router.push(`/dashboard/bio-pages/${page.id}`)}
                className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm transition-all hover:border-neutral-700 hover:bg-neutral-800/50 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400 group-hover:bg-terracotta-500/20 transition-colors">
                    <Layout className="h-4 w-4" />
                  </div>
                  <Badge variant={page.is_published ? "success" : "default"}>
                    {page.is_published ? "Live" : "Draft"}
                  </Badge>
                </div>
                <h3 className="font-semibold text-white group-hover:text-terracotta-300 transition-colors">
                  {page.title || "Untitled"}
                </h3>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <Layout className="h-3 w-3 shrink-0 text-neutral-500" />
                    <span className="text-xs text-neutral-500 truncate">/{page.slug}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-neutral-500 hover:text-terracotta-400 transition-colors"
                      title="Open page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(pageUrl);
                        setCopiedId(page.id);
                        setTimeout(() => setCopiedId(null), 1500);
                      }}
                      className="p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-800 mb-4">
              <Layout className="h-6 w-6 text-neutral-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">No bio pages yet</h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-sm">
              Create your first link-in-bio page to share all your important links in one place.
            </p>
            <Link href="/dashboard/bio-pages/new" className="mt-5">
              <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500">
                <Plus className="h-4 w-4" />
                Create Page
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
