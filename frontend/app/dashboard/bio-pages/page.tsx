"use client";

import Link from "next/link";
import { Button, Card, CardContent, Badge, SectionHeading, EmptyState } from "@/components/ui";
import { useBioPages } from "@/hooks";
import { Layout, Plus, ExternalLink } from "lucide-react";

export default function BioPagesPage() {
  const { data: bioPages } = useBioPages();

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="Bio Pages"
        description="Your link-in-bio pages"
        action={
          <Link href="/dashboard/bio-pages/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Page
            </Button>
          </Link>
        }
      />

      {bioPages && bioPages.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bioPages.map((page: any) => (
            <Link key={page.id} href={`/dashboard/bio-pages/${page.id}`}>
              <Card className="p-5 block">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-950 dark:text-terracotta-400">
                    <Layout className="h-4 w-4" />
                  </div>
                  <Badge variant={page.is_published ? "success" : "default"}>
                    {page.is_published ? "Live" : "Draft"}
                  </Badge>
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{page.title}</h3>
                <p className="mt-0.5 text-sm text-neutral-400">/{page.slug}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={<Layout className="h-6 w-6 text-neutral-400" />}
              title="No bio pages yet"
              description="Create your first link-in-bio page."
              action={
                <Link href="/dashboard/bio-pages/new">
                  <Button size="sm">Create Page</Button>
                </Link>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
