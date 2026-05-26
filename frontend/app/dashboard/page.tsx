"use client";

import Link from "next/link";
import { Stat, Card, CardContent, Badge } from "@/components/ui";
import { useLinks, useAnalytics } from "@/hooks";
import { Link2, BarChart3, MousePointerClick, QrCode, ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: links } = useLinks();
  const { data: analytics } = useAnalytics();

  const totalClicks = analytics?.summary?.total_clicks ?? 0;
  const activeLinks = links?.filter((l: any) => l.is_active).length ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Dashboard</h1>
        <p className="mt-0.5 text-sm text-neutral-400 dark:text-neutral-500">Overview of your link activity</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Links" value={links?.length ?? 0} icon={<Link2 className="h-4 w-4" />} />
        <Stat label="Active Links" value={activeLinks} icon={<BarChart3 className="h-4 w-4" />} />
        <Stat label="Total Clicks" value={totalClicks.toLocaleString()} icon={<MousePointerClick className="h-4 w-4" />} />
        <Stat label="QR Codes" value={0} icon={<QrCode className="h-4 w-4" />} />
      </div>

      {/* Recent links */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Recent Links</h2>
            <Link href="/dashboard/links" className="text-xs font-medium text-terracotta-500 hover:text-terracotta-600 dark:text-terracotta-400 inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {links && links.length > 0 ? (
            <div className="space-y-1">
              {links.slice(0, 5).map((link: any) => (
                <Link
                  key={link.id}
                  href={`/dashboard/links/${link.id}`}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-950 dark:text-terracotta-400 shrink-0">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]">
                        {link.title || "Untitled"}
                      </p>
                      <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                        {link.short_code}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-neutral-400">{link.clicks_count ?? 0} clicks</span>
                    <Badge variant={link.is_active ? "success" : "default"}>
                      {link.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-neutral-400">No links yet. Create your first one!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
