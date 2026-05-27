"use client";

import Link from "next/link";
import { Stat, Card, CardContent, Badge, SectionHeading } from "@/components/ui";
import { useLinks, useAnalytics } from "@/hooks";
import { Link2, BarChart3, MousePointerClick, QrCode, ArrowUpRight, ExternalLink, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { data: links } = useLinks();
  const { data: analytics } = useAnalytics();

  const totalClicks = analytics?.summary?.total_clicks ?? 0;
  const activeLinks = links?.filter((l: any) => l.is_active).length ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeading
        title="Dashboard"
        description="Overview of your link activity"
      />

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Links" value={links?.length ?? 0} icon={<Link2 className="h-4 w-4" />} accent />
        <Stat label="Active Links" value={activeLinks} icon={<BarChart3 className="h-4 w-4" />} />
        <Stat label="Total Clicks" value={totalClicks.toLocaleString()} icon={<MousePointerClick className="h-4 w-4" />} accent />
        <Stat label="QR Codes" value={0} icon={<QrCode className="h-4 w-4" />} />
      </div>

      {/* Recent links */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-neutral-800/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800">
                <TrendingUp className="h-3.5 w-3.5 text-neutral-400" />
              </div>
              <h2 className="text-sm font-semibold text-neutral-100">Recent Links</h2>
            </div>
            <Link href="/dashboard/links" className="text-xs font-medium text-terracotta-400 hover:text-terracotta-300 inline-flex items-center gap-1 transition-colors">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {links && links.length > 0 ? (
            <div className="divide-y divide-neutral-800/50">
              {links.slice(0, 5).map((link: any) => (
                <Link
                  key={link.id}
                  href={`/dashboard/links/${link.id}`}
                  className="flex items-center justify-between px-5 py-3 text-sm transition-colors hover:bg-neutral-800/30"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800/50 text-neutral-500 shrink-0">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-neutral-200 truncate max-w-[220px]">
                        {link.title || "Untitled"}
                      </p>
                      <p className="text-xs text-neutral-500 font-mono">
                        {link.short_code}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-neutral-500">{link.clicks_count ?? 0} clicks</span>
                    <Badge variant={link.is_active ? "success" : "default"} dot>
                      {link.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center">
              <p className="text-sm text-neutral-500">No links yet. Create your first one!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
