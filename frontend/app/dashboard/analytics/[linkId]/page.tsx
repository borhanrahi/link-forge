"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Stat } from "@/components/ui";
import { useLinks, useLinkAnalytics } from "@/hooks";
import { ArrowLeft, ExternalLink } from "lucide-react";

const SHORT_DOMAIN = "http://localhost:8000";

export default function LinkAnalyticsPage() {
  const { linkId } = useParams();
  const { data: links } = useLinks();
  const { data: analytics } = useLinkAnalytics(linkId as string);
  const link = links?.find((l: any) => l.id === linkId);

  const totalClicks = analytics?.total_clicks ?? link?.clicks_count ?? 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <Link
          href="/dashboard/analytics"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to analytics
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          {link?.title || "Link Analytics"}
        </h1>
        <p className="mt-0.5 text-sm text-neutral-400 dark:text-neutral-500">
          {link && (
            <a
              href={`${SHORT_DOMAIN}/${link.short_code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracotta-500 hover:text-terracotta-600 underline underline-offset-2"
            >
              {SHORT_DOMAIN}/{link.short_code}
            </a>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Clicks (selected range)" value={totalClicks.toLocaleString()} />
        <Stat label="Unique Clicks" value={link?.unique_clicks_count ?? 0} />
        <Stat label="Status" value={link?.is_active ? "Active" : "Inactive"} />
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-neutral-400 text-center py-8">
            Detailed analytics chart would render here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
