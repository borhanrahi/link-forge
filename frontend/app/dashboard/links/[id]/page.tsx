"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Stat, Badge, Button, SectionHeading, Divider } from "@/components/ui";
import { useLinks } from "@/hooks";
import { ArrowLeft, ExternalLink, Copy, Trash2 } from "lucide-react";

export default function LinkDetailPage() {
  const { id } = useParams();
  const { data: links } = useLinks();
  const link = links?.find((l: any) => l.id === id);

  if (!link) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-neutral-400">Link not found</p>
      </div>
    );
  }

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
          description={link.short_code}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button variant="destructive" size="sm">
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
              <p className="mt-1 text-sm font-mono text-terracotta-500">{link.short_code}</p>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
