"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useLinks, useLinkAnalytics } from "@/hooks";
import { ArrowLeft, ExternalLink, TrendingUp, Users, Activity, BarChart3 } from "lucide-react";

const SHORT_DOMAIN = "http://localhost:8000";

export default function LinkAnalyticsPage() {
  const { linkId } = useParams();
  const { data: links } = useLinks();
  const { data: analytics } = useLinkAnalytics(linkId as string);
  const link = links?.find((l: any) => l.id === linkId);

  const totalClicks = analytics?.total_clicks ?? link?.clicks_count ?? 0;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/analytics"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-300 mb-3 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to analytics
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {link?.title || "Link Analytics"}
        </h1>
        {link && (
          <a
            href={`${SHORT_DOMAIN}/${link.short_code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-sm text-terracotta-400 hover:text-terracotta-300 transition-colors"
          >
            {SHORT_DOMAIN}/{link.short_code}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta-500/10 text-terracotta-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total Clicks</p>
                <p className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Unique Clicks</p>
                <p className="text-2xl font-bold text-white">{(link?.unique_clicks_count ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Status</p>
                <Badge variant={link?.is_active ? "success" : "default"} className="mt-1">
                  {link?.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart placeholder */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-neutral-500" />
            <h3 className="font-semibold text-white">Click Timeline</h3>
          </div>
          <div className="flex items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/30 py-16">
            <div className="text-center">
              <BarChart3 className="mx-auto h-8 w-8 text-neutral-600 mb-2" />
              <p className="text-sm text-neutral-500">Detailed chart will render here</p>
              <p className="text-xs text-neutral-600 mt-1">Historical click data over time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
