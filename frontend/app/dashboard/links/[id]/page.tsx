"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Stat, Badge, Button, SectionHeading, Divider } from "@/components/ui";
import { useLinks, useDeleteLink } from "@/hooks";
import { ArrowLeft, ExternalLink, Copy, Check, Trash2 } from "lucide-react";
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
        <p className="text-sm text-neutral-400">Link not found</p>
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
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <Link
          href="/dashboard/links"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to links
        </Link>
        <SectionHeading
          title={link.title || "Untitled"}
          description={shortUrl}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleArchive}>
                <Trash2 className="h-3.5 w-3.5" />
                Archive
              </Button>
            </div>
          }
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total Clicks" value={link.clicks_count ?? 0} />
        <Stat label="Status" value={link.is_active ? "Active" : "Inactive"} />
        <Stat label="Created" value={new Date(link.created_at || Date.now()).toLocaleDateString()} />
      </div>

      {/* Details */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">Destination URL</p>
            <p className="mt-1 text-sm text-neutral-800 dark:text-neutral-200 break-all">{link.original_url}</p>
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">Short Link</p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm font-mono text-terracotta-500 hover:text-terracotta-600 underline underline-offset-2 inline-block"
              >
                {shortUrl}
              </a>
            </div>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3.5 w-3.5" />
                Open
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
