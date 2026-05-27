"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, CardContent, Input, Badge } from "@/components/ui";
import {
  useBioPage, useTogglePublish, useUpdateBioPage, useAddBlock,
  useUpdateBlock, useDeleteBlock, useDeleteBioPage
} from "@/hooks";
import {
  BlockEditor, createEmptyBlock, BLOCK_TYPES, BioPagePreview,
  THEME_COLORS,
} from "@/components/bio";
import type { BlockData } from "@/components/bio";
import {
  ArrowLeft, Trash2, Globe, Copy, Check,
  Save, Loader2
} from "lucide-react";
import { toast } from "sonner";

const BIO_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function BioPageEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: page, isLoading: pageLoading } = useBioPage(id as string);
  const togglePublish = useTogglePublish();
  const updateBioPage = useUpdateBioPage();
  const addBlock = useAddBlock();
  const updateBlockMutation = useUpdateBlock();
  const deleteBlockMutation = useDeleteBlock();
  const deleteBioPage = useDeleteBioPage();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [theme, setTheme] = useState("minimal");
  const [brandColor, setBrandColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [fontFamily, setFontFamily] = useState("inter");
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const originalBlockIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (page) {
      setTitle(page.title || "");
      setSubtitle(page.subtitle || "");
      setProfileImageUrl(page.profile_image_url || "");
      setTheme(page.theme || "minimal");
      setBrandColor(page.brand_color || "#000000");
      setBgColor(page.bg_color || "#ffffff");
      setBgImageUrl(page.bg_image_url || "");
      setFontFamily(page.font_family || "inter");
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
      originalBlockIds.current = new Set(loadedBlocks.map((b: BlockData) => b.id));
    }
  }, [page]);

  const updateBlock = useCallback((blockId: string, updates: Partial<BlockData>) => {
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
        data: {
          title,
          subtitle,
          profile_image_url: profileImageUrl || null,
          theme,
          brand_color: brandColor,
          bg_color: bgColor,
          bg_image_url: bgImageUrl || null,
          font_family: fontFamily,
        },
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this page? This cannot be undone.")) return;
    try {
      await deleteBioPage.mutateAsync(id as string);
      toast.success("Page deleted!");
      router.push("/dashboard/bio-pages");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete page");
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

  return (            <div className="max-w-5xl xl:max-w-7xl 2xl:max-w-full xl:px-8 space-y-6 animate-fade-in">
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="border-red-900/40 text-red-400 hover:bg-red-950/30 hover:border-red-700/50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
            <Badge variant={page.is_published ? "success" : "default"}>
              {page.is_published ? "Live" : "Draft"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ─── Column 1: Editor ─── */}
        <div className="space-y-4 min-w-0">
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-5">
              {/* ─── Blocks List ─── */}
              <div className="space-y-3">
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

        {/* ─── Column 2: Add Block + Design + Blocks ─── */}
        <div className="space-y-4 min-w-0">
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

          {/* ─── Design / Theme Card ─── */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-neutral-100">Design</h3>

              <Input
                label="Profile Image URL"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">Theme Template</label>
                <select
                  className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 focus:outline-none focus:border-terracotta-500/50 appearance-none"
                  value={theme}
                  onChange={(e) => {
                    const newTheme = e.target.value;
                    setTheme(newTheme);
                    const colors = THEME_COLORS[newTheme];
                    if (colors) {
                      setBrandColor(colors.brand);
                      setBgColor(colors.bg);
                    }
                  }}
                >
                  <option value="minimal">Minimal — Clean, light</option>
                  <option value="dark-matte">Dark Matte — Sleek, dark</option>
                  <option value="sunset">Sunset — Warm gradient</option>
                  <option value="ocean">Ocean — Cool blues</option>
                  <option value="midnight">Midnight — Deep navy</option>
                  <option value="forest">Forest — Earthy greens</option>
                  <option value="rose">Rose — Elegant pink</option>
                  <option value="slate">Slate — Left-aligned, subtle</option>
                  <option value="neon">Neon — Cyberpunk glow</option>
                  <option value="lavender">Lavender — Soft purple</option>
                  <option value="warm-paper">Warm Paper — Textured beige</option>
                  <option value="coral">Coral — Vibrant orange</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-2">Brand Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="h-9 w-9 rounded-md border border-neutral-700 bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 text-xs text-neutral-100 focus:outline-none focus:border-terracotta-500/50 font-mono"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-2">Background Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-9 w-9 rounded-md border border-neutral-700 bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 text-xs text-neutral-100 focus:outline-none focus:border-terracotta-500/50 font-mono"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <Input
                label="Background Image URL"
                value={bgImageUrl}
                onChange={(e) => setBgImageUrl(e.target.value)}
                placeholder="https://example.com/bg.jpg"
                hint="Optional — overrides background color"
              />

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">Font Family</label>
                <select
                  className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 focus:outline-none focus:border-terracotta-500/50 appearance-none"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option value="inter">Inter — Modern, clean</option>
                  <option value="poppins">Poppins — Friendly, round</option>
                  <option value="playfair-display">Playfair Display — Elegant, serif</option>
                  <option value="roboto-mono">Roboto Mono — Monospace, tech</option>
                  <option value="serif">Serif — Classic</option>
                </select>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* ─── Column 3: Preview ─── */}
        <div className="min-w-0">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-100">Preview</h3>
                <span className="text-[10px] text-neutral-600 bg-neutral-800 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <BioPagePreview
                title={title}
                subtitle={subtitle}
                blocks={blocks}
                page={{
                  ...page,
                  profile_image_url: profileImageUrl,
                  theme,
                  brand_color: brandColor,
                  bg_color: bgColor,
                  bg_image_url: bgImageUrl,
                  font_family: fontFamily,
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Live Preview Component ───


