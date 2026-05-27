"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, CardContent, Input, Divider, Badge } from "@/components/ui";
import {
  useBioPage, useTogglePublish, useUpdateBioPage, useAddBlock,
  useUpdateBlock, useDeleteBlock, useDeleteBioPage
} from "@/hooks";
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

// ─── Preview Render Helpers (mirrors public page rendering) ───

const SOCIAL_ICONS: Record<string, string> = {
  twitter: "𝕏",
  x: "𝕏",
  instagram: "📷",
  youtube: "▶️",
  tiktok: "🎵",
  github: "🐙",
  linkedin: "💼",
  facebook: "👍",
  discord: "💬",
  telegram: "✈️",
  whatsapp: "💚",
  email: "✉️",
  website: "🌐",
  spotify: "🎧",
  twitch: "🎮",
  snapchat: "👻",
  pinterest: "📌",
  link: "🔗",
};

function resolveIcon(icon?: string): string {
  if (!icon) return "🔗";
  const key = icon.toLowerCase().replace(/[^a-z]/g, "");
  return SOCIAL_ICONS[key] || icon;
}

function getContrastColor(hex: string): string {
  if (!hex || hex === "transparent") return "#ffffff";
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}

function isDarkColor(hex: string): boolean {
  return getContrastColor(hex) === "#ffffff";
}

const THEME_STYLES: Record<string, {
  avatarShape: "circle" | "rounded" | "square";
  linkStyle: "pill" | "rounded" | "sharp" | "underline";
  alignment: "center" | "left";
  showDivider: boolean;
  gradientBg: boolean;
  glassLinks: boolean;
  shadowColor: string;
}> = {
  minimal: {
    avatarShape: "circle", linkStyle: "pill", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(0,0,0,0.08)",
  },
  "dark-matte": {
    avatarShape: "circle", linkStyle: "rounded", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(255,255,255,0.05)",
  },
  sunset: {
    avatarShape: "circle", linkStyle: "pill", alignment: "center",
    showDivider: true, gradientBg: true, glassLinks: true,
    shadowColor: "rgba(255,107,53,0.25)",
  },
  ocean: {
    avatarShape: "circle", linkStyle: "pill", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(15,118,110,0.25)",
  },
  midnight: {
    avatarShape: "circle", linkStyle: "rounded", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(251,191,36,0.15)",
  },
  forest: {
    avatarShape: "circle", linkStyle: "sharp", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(22,101,52,0.3)",
  },
  rose: {
    avatarShape: "rounded", linkStyle: "pill", alignment: "center",
    showDivider: true, gradientBg: false, glassLinks: true,
    shadowColor: "rgba(159,18,57,0.2)",
  },
  slate: {
    avatarShape: "circle", linkStyle: "rounded", alignment: "left",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(15,23,42,0.08)",
  },
  neon: {
    avatarShape: "circle", linkStyle: "rounded", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: true,
    shadowColor: "rgba(6,182,212,0.2)",
  },
  lavender: {
    avatarShape: "rounded", linkStyle: "pill", alignment: "center",
    showDivider: true, gradientBg: false, glassLinks: true,
    shadowColor: "rgba(76,29,149,0.25)",
  },
  "warm-paper": {
    avatarShape: "circle", linkStyle: "underline", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(146,64,14,0.08)",
  },
  coral: {
    avatarShape: "circle", linkStyle: "pill", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(225,29,72,0.25)",
  },
};

const FONT_MAP: Record<string, string> = {
  inter: "'Inter', system-ui, -apple-system, sans-serif",
  poppins: "'Poppins', sans-serif",
  "playfair-display": "'Playfair Display', Georgia, serif",
  "roboto-mono": "'Roboto Mono', monospace",
  serif: "Georgia, 'Times New Roman', serif",
};

const GRADIENT_PRESETS: Record<string, string> = {
  sunset: "linear-gradient(135deg, #ff6b35 0%, #f7c948 50%, #ff6b35 100%)",
  ocean: "linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)",
  midnight: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
  forest: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
  rose: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #9f1239 100%)",
  neon: "linear-gradient(135deg, #020617 0%, #0c4a6e 100%)",
  lavender: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
  coral: "linear-gradient(135deg, #e11d48 0%, #fb923c 100%)",
};

// Recommended colors for each theme (brand_color, bg_color)
const THEME_COLORS: Record<string, { brand: string; bg: string }> = {
  minimal: { brand: "#000000", bg: "#ffffff" },
  "dark-matte": { brand: "#ffffff", bg: "#1a1a1a" },
  sunset: { brand: "#ff6b35", bg: "#fffbeb" },
  ocean: { brand: "#0f766e", bg: "#f0fdfa" },
  midnight: { brand: "#fbbf24", bg: "#0f172a" },
  forest: { brand: "#166534", bg: "#f0fdf4" },
  rose: { brand: "#9f1239", bg: "#fff1f2" },
  slate: { brand: "#1e293b", bg: "#f8fafc" },
  neon: { brand: "#06b6d4", bg: "#020617" },
  lavender: { brand: "#7c3aed", bg: "#faf5ff" },
  "warm-paper": { brand: "#92400e", bg: "#fffbeb" },
  coral: { brand: "#e11d48", bg: "#fff7ed" },
};

function getLinkStylesPreview(
  linkStyle: string,
  brandColor: string,
  glassLinks: boolean,
  shadowColor: string,
): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: "14px 20px",
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  };

  switch (linkStyle) {
    case "pill":
      return {
        ...base,
        borderRadius: 9999,
        background: glassLinks ? "rgba(255,255,255,0.15)" : brandColor,
        color: glassLinks ? "#fff" : getContrastColor(brandColor),
        backdropFilter: glassLinks ? "blur(16px)" : undefined,
        WebkitBackdropFilter: glassLinks ? "blur(16px)" : undefined,
        border: glassLinks ? "1px solid rgba(255,255,255,0.2)" : "none",
        boxShadow: glassLinks ? "0 4px 24px rgba(0,0,0,0.1)" : `0 2px 8px ${shadowColor}`,
      };
    case "rounded":
      return {
        ...base,
        borderRadius: 12,
        background: glassLinks ? "rgba(255,255,255,0.1)" : brandColor,
        color: glassLinks ? "#fff" : getContrastColor(brandColor),
        backdropFilter: glassLinks ? "blur(12px)" : undefined,
        WebkitBackdropFilter: glassLinks ? "blur(12px)" : undefined,
        border: glassLinks ? "1px solid rgba(255,255,255,0.15)" : "none",
      };
    case "sharp":
      return {
        ...base,
        borderRadius: 4,
        background: brandColor,
        color: getContrastColor(brandColor),
      };
    case "underline":
      return {
        ...base,
        borderRadius: 0,
        background: "transparent",
        color: brandColor,
        padding: "10px 8px",
        borderBottom: "2px solid transparent",
      };
  }
  return base;
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
  const [blocks, setBlocks] = useState<Block[]>([]);
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

// ─── Live Preview Component ───

function BioPagePreview({
  title,
  subtitle,
  blocks,
  page,
}: {
  title: string;
  subtitle: string;
  blocks: Block[];
  page: any;
}) {
  const themeStyle = THEME_STYLES[page.theme] || THEME_STYLES.minimal;
  const fontFamily = FONT_MAP[page.font_family] || FONT_MAP.inter;
  const dark = isDarkColor(page.bg_color);
  const textColor = dark ? "#f0eee9" : "#2c2723";
  const mutedColor = dark ? "#a8a099" : "#857e77";
  const gradient = GRADIENT_PRESETS[page.theme];
  const isGradientBg = themeStyle.gradientBg && gradient;
  const alignment = themeStyle.alignment;

  const bg = page.bg_image_url
    ? `url(${page.bg_image_url}) center/cover no-repeat fixed`
    : isGradientBg
      ? gradient
      : page.bg_color || "#ffffff";

  return (              <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "9 / 16" }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: bg,
          backgroundBlendMode: "overlay",
          transition: "background 0.3s ease",
        }}
      />
      {(isGradientBg || page.bg_image_url) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isGradientBg ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.3)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* Scrollable content */}
      <div
        className="overflow-y-auto"
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          padding: "32px 16px 24px",
          fontFamily,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: alignment === "left" ? "flex-start" : "center",
            gap: 0,
          }}
        >
          {/* Profile Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: alignment === "left" ? "flex-start" : "center",
              width: "100%",
              marginBottom: 24,
            }}
          >
            {page.profile_image_url && (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius:
                    themeStyle.avatarShape === "circle"
                      ? "50%"
                      : themeStyle.avatarShape === "rounded"
                        ? 20
                        : 10,
                  overflow: "hidden",
                  width: 72,
                  height: 72,
                  border: `2px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}`,
                  boxShadow: dark
                    ? "0 0 0 1px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.3)"
                    : "0 0 0 1px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={page.profile_image_url}
                  alt={title || ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )}

            {title && (
              <h1
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  color: page.theme === "warm-paper" ? "#92400e" : textColor,
                  textAlign: alignment === "left" ? "left" : "center",
                  wordBreak: "break-word",
                }}
              >
                {title}
              </h1>
            )}

            {subtitle && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: page.theme === "warm-paper" ? "#a16207" : mutedColor,
                  textAlign: alignment === "left" ? "left" : "center",
                  maxWidth: 360,
                  wordBreak: "break-word",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Blocks */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: alignment === "left" ? "stretch" : "center",
              width: "100%",
              gap: 10,
            }}
          >
            {blocks.length === 0 && (
              <p
                style={{
                  fontSize: 12,
                  color: mutedColor,
                  opacity: 0.5,
                  textAlign: "center",
                  padding: "24px 0",
                }}
              >
                Add blocks to see a live preview
              </p>
            )}
            {blocks.map((block) => {
              switch (block.block_type) {
                case "link": {
                  const isUnderline = themeStyle.linkStyle === "underline";
                  const linkHref = block.url || "#";
                  if (isUnderline) {
                    return (
                      <a
                        key={block.id}
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: alignment === "left" ? "flex-start" : "center",
                          gap: 8,
                          width: "100%",
                          padding: "10px 8px",
                          fontSize: 13,
                          fontWeight: 500,
                          color: page.brand_color,
                          borderBottom: `2px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                          textDecoration: "none",
                          transition: "opacity 0.2s",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                      >
                        <span style={{ fontSize: 15 }}>{resolveIcon(block.icon)}</span>
                        <span>{block.label || "Link"}</span>
                      </a>
                    );
                  }
                  const linkBtnStyles = getLinkStylesPreview(
                    themeStyle.linkStyle,
                    page.brand_color,
                    themeStyle.glassLinks,
                    themeStyle.shadowColor,
                  );
                  return (
                    <a
                      key={block.id}
                      href={linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={linkBtnStyles}
                    >
                      <span style={{ fontSize: 15, position: "relative", zIndex: 1 }}>
                        {resolveIcon(block.icon)}
                      </span>
                      <span style={{ position: "relative", zIndex: 1 }}>
                        {block.label || "Link"}
                      </span>
                    </a>
                  );
                }

                case "heading":
                  return block.label ? (
                    <h2
                      key={block.id}
                      style={{
                        width: "100%",
                        fontSize: 17,
                        fontWeight: 700,
                        color: textColor,
                        textAlign: alignment === "left" ? "left" : "center",
                        margin: "4px 0 0",
                        wordBreak: "break-word",
                      }}
                    >
                      {block.label}
                    </h2>
                  ) : (
                    <div key={block.id} style={{ width: "100%" }}>
                      <div
                        style={{
                          height: 22,
                          width: "60%",
                          margin: alignment === "left" ? "4px 0 0" : "4px auto 0",
                          borderRadius: 4,
                          background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                        }}
                      />
                    </div>
                  );

                case "text":
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        padding: "6px 4px",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: mutedColor,
                        textAlign: alignment === "left" ? "left" : "center",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {block.label || (
                        <span style={{ opacity: 0.3, fontStyle: "italic" }}>Empty text block</span>
                      )}
                    </div>
                  );

                case "image":
                  if (!block.image_url) {
                    return (
                      <div
                        key={block.id}
                        style={{
                          width: "100%",
                          height: 80,
                          borderRadius: 10,
                          background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                          border: `1px dashed ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          color: mutedColor,
                          opacity: 0.4,
                        }}
                      >
                        No image URL set
                      </div>
                    );
                  }
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        overflow: "hidden",
                        boxShadow: dark
                          ? "0 4px 16px rgba(0,0,0,0.3)"
                          : "0 4px 16px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={block.image_url}
                        alt={block.label || ""}
                        style={{ width: "100%", height: "auto", display: "block" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  );

                case "social": {
                  const socialLabel = block.label || SOCIAL_PLATFORMS.find((p) => p.id === block.icon)?.label || "Social";
                  return (
                    <a
                      key={block.id}
                      href={block.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: alignment === "left" ? "flex-start" : "center",
                        gap: 10,
                        width: "100%",
                        padding: "10px 16px",
                        borderRadius: 10,
                        background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
                        fontSize: 13,
                        fontWeight: 500,
                        color: textColor,
                        textDecoration: "none",
                        transition: "opacity 0.2s",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{resolveIcon(block.icon)}</span>
                      <span>{socialLabel}</span>
                    </a>
                  );
                }

                case "embed":
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        overflow: "hidden",
                        border: block.embed_html
                          ? "none"
                          : `1px dashed ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                        minHeight: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: mutedColor,
                        opacity: block.embed_html ? 1 : 0.4,
                      }}
                    >
                      {block.embed_html ? (
                        <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: block.embed_html }} />
                      ) : (
                        "Paste embed HTML code"
                      )}
                    </div>
                  );

                case "video":
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        overflow: "hidden",
                        background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        border: !block.video_url
                          ? `1px dashed ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`
                          : "none",
                      }}
                    >
                      {block.video_url ? (
                        <>
                          <div
                            style={{
                              aspectRatio: "16 / 9",
                              background: dark ? "#1a1a1a" : "#e5e5e5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 24,
                            }}
                          >
                            ▶️
                          </div>
                          {block.label && (
                            <p
                              style={{
                                margin: 0,
                                padding: "6px 10px",
                                fontSize: 11,
                                color: mutedColor,
                                textAlign: "center",
                              }}
                            >
                              {block.label}
                            </p>
                          )}
                        </>
                      ) : (
                        <div
                          style={{
                            height: 60,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            color: mutedColor,
                            opacity: 0.4,
                          }}
                        >
                          Enter a video URL
                        </div>
                      )}
                    </div>
                  );

                case "spacer":
                  return <div key={block.id} style={{ height: 20, width: "100%" }} />;

                case "divider":
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        height: 1,
                        background: dark
                          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
                          : "linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)",
                        margin: "4px 0",
                      }}
                    />
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 32,
              fontSize: 10,
              color: mutedColor,
              opacity: 0.35,
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            Powered by LinkNest
          </div>
        </div>
      </div>
    </div>
  );
}
