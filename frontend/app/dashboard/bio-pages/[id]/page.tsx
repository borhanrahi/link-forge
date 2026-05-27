"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button, Card, CardContent, Input, Divider, Badge } from "@/components/ui";
import { useBioPages, useTogglePublish } from "@/hooks";
import { ArrowLeft, Plus, Trash2, GripVertical, Globe, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const BLOG_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const BLOCK_TYPES = [
  { id: "link", label: "Link", description: "A single link button" },
  { id: "text", label: "Text", description: "A text block" },
  { id: "image", label: "Image", description: "An image" },
  { id: "divider", label: "Divider", description: "A visual separator" },
];

export default function BioPageEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: bioPages } = useBioPages();
  const togglePublish = useTogglePublish();
  const page = bioPages?.find((p: any) => p.id === id);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (page) {
      setTitle(page.title || "");
      setBlocks(page.blocks || []);
    }
  }, [page]);

  const addBlock = (type: string) => {
    setBlocks([...blocks, { id: crypto.randomUUID(), type, content: "" }]);
  };

  const removeBlock = (blockId: string) => {
    setBlocks(blocks.filter((b) => b.id !== blockId));
  };

  const handlePublish = async () => {
    try {
      await togglePublish.mutateAsync(id as string);
      toast.success(page?.is_published ? "Page unpublished" : "Page published!");
    } catch {
      toast.error("Failed to toggle publish");
    }
  };

  if (!page) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-neutral-400">Page not found</p>
      </div>
    );
  }

  const pageUrl = `${BLOG_DOMAIN}/b/${page.slug}`;

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <Link
          href="/dashboard/bio-pages"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to bio pages
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {title || "Untitled Page"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-terracotta-500 hover:text-terracotta-600 underline underline-offset-2"
              >
                {pageUrl}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pageUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePublish}>
              <Globe className="h-3.5 w-3.5" />
              {page.is_published ? "Unpublish" : "Publish"}
            </Button>
            <Badge variant={page.is_published ? "success" : "default"}>
              {page.is_published ? "Live" : "Draft"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <Input
                label="Page Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Bio Page"
              />

              {blocks.map((block, i) => (
                <div
                  key={block.id}
                  className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/50"
                >
                  <div className="mt-2 text-neutral-300 dark:text-neutral-600">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                        {block.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {block.type === "link" && (
                      <div className="space-y-2">
                        <input
                          className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                          placeholder="Label"
                        />
                        <input
                          className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                          placeholder="URL"
                        />
                      </div>
                    )}
                    {block.type === "text" && (
                      <textarea
                        className="h-20 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm resize-none dark:border-neutral-700 dark:bg-neutral-900"
                        placeholder="Write some text..."
                      />
                    )}
                    {block.type === "image" && (
                      <input
                        className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        placeholder="Image URL"
                      />
                    )}
                    {block.type === "divider" && (
                      <Divider />
                    )}
                  </div>
                </div>
              ))}

              {blocks.length === 0 && (
                <p className="text-sm text-neutral-400 text-center py-6">
                  No blocks yet. Add your first one below.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Add blocks */}
        <div>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Add Block
              </h3>
              <div className="space-y-2">
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.id}
                    type="button"
                    onClick={() => addBlock(bt.id)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-50 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:border-neutral-600"
                  >
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{bt.label}</span>
                    <p className="text-xs text-neutral-400 mt-0.5">{bt.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
