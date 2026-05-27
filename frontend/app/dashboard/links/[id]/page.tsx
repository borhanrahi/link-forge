"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLinks, useDeleteLink } from "@/hooks";
import { ArrowLeft, ExternalLink, Copy, Check, Trash2, BarChart3, CalendarDays, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SHORT_DOMAIN = "http://localhost:8000";

export default function LinkDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: links } = useLinks();
  const deleteLink = useDeleteLink();
  const [copied, setCopied] = useState(false);
  const link = links?.find((l: any) => l.id === id);

  if (!link) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-neutral-500">Link not found</p>
      </div>
    );
  }

  const shortUrl = `${SHORT_DOMAIN}/${link.short_code}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleArchive = async () => {
    try {
      await deleteLink.mutateAsync(link.id);
      toast.success("Link archived");
      router.push("/dashboard/links");
    } catch {
      toast.error("Failed to archive link");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/links"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to links
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{link.title || "Untitled"}</h1>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-mono text-terracotta-400 hover:text-terracotta-300 transition-colors"
          >
            {shortUrl}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleArchive}
            className="inline-flex items-center gap-2 rounded-lg border border-red-900/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:border-red-700/50 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            Archive
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total Clicks</p>
              <p className="text-2xl font-bold text-white">{(link.clicks_count ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Status</p>
              <p className="text-2xl font-bold text-white">{link.is_active ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Created</p>
              <p className="text-2xl font-bold text-white">{new Date(link.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-5">
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Destination URL</p>
          <p className="text-sm text-neutral-300 break-all font-mono">{link.original_url}</p>
        </div>
        <div className="border-t border-neutral-800" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Short Link</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-terracotta-400 hover:text-terracotta-300 transition-colors"
            >
              {shortUrl}
            </a>
          </div>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all">
              <ExternalLink className="h-4 w-4" />
              Open
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
