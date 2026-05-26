"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Card, CardContent, Badge, SectionHeading, EmptyState } from "@/components/ui";
import { useLinks } from "@/hooks";
import { Link2, Plus, ExternalLink, Search, ArrowUpRight } from "lucide-react";

export default function LinksPage() {
  const { data: links } = useLinks();
  const [search, setSearch] = useState("");

  const filtered = links?.filter(
    (l: any) =>
      !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.short_code?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="Links"
        description="Manage all your shortened links"
        action={
          <Link href="/dashboard/links/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Link
            </Button>
          </Link>
        }
      />

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-neutral-300 bg-white pl-9 pr-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/15 focus:border-terracotta-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered && filtered.length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((link: any) => (
                <Link
                  key={link.id}
                  href={`/dashboard/links/${link.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-950 dark:text-terracotta-400 shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {link.title || "Untitled"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-terracotta-500 font-mono">{link.short_code}</span>
                        <span className="text-xs text-neutral-400">{link.clicks_count ?? 0} clicks</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={link.is_active ? "success" : "default"} className="shrink-0">
                    {link.is_active ? "Active" : "Inactive"}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5">
              <EmptyState
                icon={<Link2 className="h-6 w-6 text-neutral-400" />}
                title={search ? "No links found" : "No links yet"}
                description={search ? "Try a different search term." : "Create your first link to get started."}
                action={
                  !search ? (
                    <Link href="/dashboard/links/new">
                      <Button size="sm">Create Link</Button>
                    </Link>
                  ) : undefined
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
