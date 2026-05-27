"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, CardContent, Input, Divider, Badge } from "@/components/ui";
import { useBioPage, useTogglePublish, useUpdateBioPage, useAddBlock, useUpdateBlock, useDeleteBlock } from "@/hooks";
import {
  ArrowLeft, Trash2, Globe, Copy, Check,
  Save, Loader2, Type, Link2, Image, Minus, Heading,
  AtSign, Code, Video, Square, Grip
} from "lucide-react";
import { toast } from "sonner";

const BIO_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const BLOCK_TYPES = [
  { id: "link", label: "Link", description: "A single link button", icon: Link2 },
  { id: "heading", label: "Heading", description: "Section heading", icon: Heading },
  { id: "text", label: "Text", description: "A text block", icon: Type },
  { id: "image", label: "Image", description: "An image", icon: Image },
  { id: "social", label: "Social", description: "Social media link", icon: AtSign },
  { id: "embed", label: "Embed", description: "HTML embed code", icon: Code },
  { id: "video", label: "Video", description: "Video embed (YouTube/Vimeo)", icon: Video },
  { id: "spacer", label: "Spacer", description: "Empty space", icon: Square },
  { id: "divider", label: "Divider", description: "A visual separator", icon: Minus },
];

interface Block {
  id: string;
  block_type: string;
  label?: string;
  url?: string;
  icon?: string;
  image_url?: string;
  video_url?: string;
  embed_html?: string;
  position: number;
}

function createEmptyBlock(blockType: string, position: number): Block {
  return {
    id: crypto.randomUUID(),
    block_type: blockType,
    label: "",
    url: "",
    icon: "",
    image_url: "",
    video_url: "",
    embed_html: "",
    position,
  };
}

const SOCIAL_PLATFORMS = [
  { id: "globe", label: "Website" },
  { id: "twitter", label: "X / Twitter" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "github", label: "GitHub" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "facebook", label: "Facebook" },
  { id: "discord", label: "Discord" },
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
];

export default function BioPageEditorPage() {
  const { id } = useParams();
  const { data: page, isLoading: pageLoading } = useBioPage(id as string);
  const togglePublish = useTogglePublish();
  const updateBioPage = useUpdateBioPage();
  const addBlock = useAddBlock();
  const updateBlockMutation = useUpdateBlock();
  const deleteBlockMutation = useDeleteBlock();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const originalBlockIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (page) {
      setTitle(page.title || "");
      setSubtitle(page.subtitle || "");
      const loadedBlocks = (page.blocks || []).map((b: any, i: number) => ({
        id: b.id,
        block_type: b.block_type,
        label: b.label || "",
        url: b.url || "",
        icon: b.icon || "",
        image_url: b.image_url || "",
        video_url: b.video_url || "",
        embed_html: b.embed_html || "",
        position: b.position ?? i,
      }));
      setBlocks(loadedBlocks);
      originalBlockIds.current = new Set(loadedBlocks.map((b: Block) => b.id));
    }
  }, [page]);

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, ...updates } : b)));
  }, []);

  const addNewBlock = useCallback((blockType: string) => {
    setBlocks((prev) => [...prev, createEmptyBlock(blockType, prev.length)]);
    toast.success(`Added ${BLOCK_TYPES.find((bt) => bt.id === blockType)?.label || blockType} block`);
  }, []);

  const removeBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBioPage.mutateAsync({
        id: id as string,
        data: { title, subtitle },
      });

      const currentIds = new Set(blocks.map((b) => b.id));
      const origIds = originalBlockIds.current;

      // Delete removed blocks
      const removedIds = [...origIds].filter((bid) => !currentIds.has(bid));
      for (const blockId of removedIds) {
        await deleteBlockMutation.mutateAsync({ pageId: id as string, blockId });
      }

      // Create new blocks / update existing blocks
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const isNew = !origIds.has(block.id);

        const blockData = {
          block_type: block.block_type,
          label: block.label || "",
          url: block.url || "",
          icon: block.icon || "",
          image_url: block.image_url || "",
          video_url: block.video_url || "",
          embed_html: block.embed_html || "",
          position: i,
        };

        if (isNew) {
          await addBlock.mutateAsync({ pageId: id as string, data: blockData });
        } else {
          await updateBlockMutation.mutateAsync({
            pageId: id as string,
            blockId: block.id,
            data: blockData,
          });
        }
      }

      originalBlockIds.current = new Set(blocks.map((b) => b.id));
      toast.success("Page saved successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await togglePublish.mutateAsync(id as string);
      toast.success(page?.is_published ? "Page unpublished" : "Page published!");
    } catch {
      toast.error("Failed to toggle publish");
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-neutral-400">Page not found</p>
      </div>
    );
  }

  const pageUrl = `${BIO_DOMAIN}/b/${page.slug}`;

  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">
      {/* ─── Header ─── */}
      <div>
        <Link
          href="/dashboard/bio-pages"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to bio pages
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 truncate">
              {title || "Untitled Page"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-terracotta-500 hover:text-terracotta-600 underline underline-offset-2 truncate max-w-[300px]"
              >
                {pageUrl}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pageUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {saving ? "Saving..." : "Save"}
            </Button>
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
        {/* ─── Editor ─── */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-5 space-y-5">
              <Input
                label="Page Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Bio Page"
              />
              <Input
                label="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="A short description or tagline"
                hint="Appears below the title on your public page"
              />

              {/* ─── Blocks List ─── */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Blocks ({blocks.length})
                  </h3>
                  <span className="text-xs text-neutral-500">Drag to reorder</span>
                </div>

                {blocks.length === 0 && (
                  <div className="rounded-lg border border-dashed border-neutral-700 py-10 text-center">
                    <p className="text-sm text-neutral-500">
                      No blocks yet. Add one from the sidebar.
                    </p>
                  </div>
                )}

                {blocks.map((block, i) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    index={i}
                    onChange={(updates) => updateBlock(block.id, updates)}
                    onRemove={() => removeBlock(block.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Sidebar ─── */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-neutral-100 mb-3">Add Block</h3>
              <div className="space-y-1.5">
                {BLOCK_TYPES.map((bt) => {
                  const Icon = bt.icon;
                  return (
                    <button
                      key={bt.id}
                      type="button"
                      onClick={() => addNewBlock(bt.id)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-left text-sm transition-all hover:bg-neutral-800 hover:border-neutral-600 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-800 text-neutral-400">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="font-medium text-neutral-200">{bt.label}</span>
                          <p className="text-xs text-neutral-500">{bt.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* ─── Quick Save Card ─── */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-neutral-100 mb-3">Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlePublish}
                >
                  <Globe className="h-4 w-4" />
                  {page.is_published ? "Unpublish" : "Publish"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Block Editor Component ───

function BlockEditor({
  block,
  index,
  onChange,
  onRemove,
}: {
  block: Block;
  index: number;
  onChange: (updates: Partial<Block>) => void;
  onRemove: () => void;
}) {
  const blockTypeMeta = BLOCK_TYPES.find((bt) => bt.id === block.block_type);
  const Icon = blockTypeMeta?.icon || Link2;

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4 space-y-3 transition-all hover:border-neutral-600">
      {/* Block header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-neutral-500 cursor-grab active:cursor-grabbing">
            <Grip className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-neutral-800 px-2 py-0.5">
            <Icon className="h-3 w-3 text-neutral-400" />
            <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
              {blockTypeMeta?.label || block.block_type}
            </span>
          </div>
          <span className="text-[11px] text-neutral-600">#{index + 1}</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-1.5 text-neutral-500 hover:bg-rust-900/20 hover:text-red-400 transition-colors"
          title="Remove block"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Block fields based on type */}
      {block.block_type === "link" && (
        <div className="space-y-2">
          <input
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50"
            placeholder="Button label"
            value={block.label || ""}
            onChange={(e) => onChange({ label: e.target.value })}
          />
          <input
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50"
            placeholder="https://example.com"
            value={block.url || ""}
            onChange={(e) => onChange({ url: e.target.value })}
          />
          <input
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50"
            placeholder="Icon name (globe, heart, star...)"
            value={block.icon || ""}
            onChange={(e) => onChange({ icon: e.target.value })}
          />
        </div>
      )}

      {block.block_type === "heading" && (
        <input
          className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50"
          placeholder="Heading text"
          value={block.label || ""}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      )}

      {block.block_type === "text" && (
        <textarea
          className="h-24 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50 resize-none"
          placeholder="Write some text..."
          value={block.label || ""}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      )}

      {block.block_type === "image" && (
        <div className="space-y-2">
          <input
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50"
            placeholder="https://example.com/image.jpg"
            value={block.image_url || ""}
            onChange={(e) => onChange({ image_url: e.target.value })}
          />
          {block.image_url && (
            <div className="rounded-md overflow-hidden border border-neutral-700">
              <img
                src={block.image_url}
                alt="Preview"
                className="max-h-40 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.display = "block";
                }}
              />
            </div>
          )}
        </div>
      )}

      {block.block_type === "social" && (
        <div className="space-y-2">
          <select
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 focus:outline-none focus:border-terracotta-500/50 appearance-none"
            value={block.icon || "globe"}
            onChange={(e) => onChange({ icon: e.target.value })}
          >
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <input
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50"
            placeholder="Display label"
            value={block.label || ""}
            onChange={(e) => onChange({ label: e.target.value })}
          />
          <input
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50"
            placeholder="https://twitter.com/username"
            value={block.url || ""}
            onChange={(e) => onChange({ url: e.target.value })}
          />
        </div>
      )}

      {block.block_type === "embed" && (
        <textarea
          className="h-24 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50 font-mono text-[13px] resize-none"
          placeholder="<iframe src='...'></iframe>"
          value={block.embed_html || ""}
          onChange={(e) => onChange({ embed_html: e.target.value })}
        />
      )}

      {block.block_type === "video" && (
        <div className="space-y-2">
          <input
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50"
            placeholder="https://youtube.com/watch?v=..."
            value={block.video_url || ""}
            onChange={(e) => onChange({ video_url: e.target.value })}
          />
          <input
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-terracotta-500/50"
            placeholder="Caption (optional)"
            value={block.label || ""}
            onChange={(e) => onChange({ label: e.target.value })}
          />
        </div>
      )}

      {block.block_type === "spacer" && (
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 border-t border-dashed border-neutral-700" />
          <span className="text-xs text-neutral-500">Spacer</span>
          <div className="flex-1 border-t border-dashed border-neutral-700" />
        </div>
      )}

      {block.block_type === "divider" && (
        <Divider className="border-neutral-600" />
      )}
    </div>
  );
}
