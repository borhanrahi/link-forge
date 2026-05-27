"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, Badge, SectionHeading, EmptyState } from "@/components/ui";
import { useBioPages } from "@/hooks";
import { Layout, Plus, Copy, Check, AlertCircle, Loader2 } from "lucide-react";

const BIO_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function BioPagesPage() {
  const router = useRouter();
  const { data: bioPages, isLoading, error, refetch } = useBioPages();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="Bio Pages"
        description={`Your link-in-bio pages ${bioPages ? `(${bioPages.length}/10 used)` : ""}`}
        action={
          <Link href="/dashboard/bio-pages/new">
            <Button size="sm" disabled={bioPages && bioPages.length >= 10}>
              <Plus className="h-4 w-4" />
              New Page
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            <span className="ml-3 text-sm text-neutral-500">Loading bio pages...</span>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-8 w-8 text-rust-400" />
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Failed to load bio pages</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {error instanceof Error ? error.message : "An unexpected error occurred. Please try again."}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : bioPages && bioPages.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bioPages.map((page: any) => {
            const pageUrl = `${BIO_DOMAIN}/b/${page.slug}`;
            return (
              <div
                key={page.id}
                onClick={() => router.push(`/dashboard/bio-pages/${page.id}`)}
                className="cursor-pointer"
              >
                <Card className="p-5 block">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-terracotta-50 text-terracotta-500 dark:bg-terracotta-950 dark:text-terracotta-400">
                      <Layout className="h-4 w-4" />
                    </div>
                    <Badge variant={page.is_published ? "success" : "default"}>
                      {page.is_published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{page.title || "Untitled"}</h3>
                  <div className="mt-1 flex items-center gap-1.5">
                    <a
                      href={pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-terracotta-500 hover:text-terracotta-600 truncate underline underline-offset-2"
                    >
                      {pageUrl}
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(pageUrl);
                        setCopiedId(page.id);
                        setTimeout(() => setCopiedId(null), 1500);
                      }}
                      className="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      {copiedId === page.id ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </Card>
              </div>
            );
          })}
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
