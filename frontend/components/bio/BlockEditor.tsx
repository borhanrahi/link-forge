"use client";

import { Trash2, Grip, Link2 } from "lucide-react";
import { Divider } from "@/components/ui";
import { SOCIAL_PLATFORMS } from "./rendering";
import type { BlockData } from "./types";

// ─── Block Types ───

export const BLOCK_TYPES = [
  { id: "link", label: "Link", description: "A single link button", icon: Link2 },
  { id: "heading", label: "Heading", description: "Section heading", icon: Link2 },
  { id: "text", label: "Text", description: "A text block", icon: Link2 },
  { id: "image", label: "Image", description: "An image", icon: Link2 },
  { id: "social", label: "Social", description: "Social media link", icon: Link2 },
  { id: "embed", label: "Embed", description: "HTML embed code", icon: Link2 },
  { id: "video", label: "Video", description: "Video embed (YouTube/Vimeo)", icon: Link2 },
  { id: "spacer", label: "Spacer", description: "Empty space", icon: Link2 },
  { id: "divider", label: "Divider", description: "A visual separator", icon: Link2 },
];

// ─── Interfaces ───

interface BlockEditorProps {
  block: BlockData;
  index: number;
  onChange: (updates: Partial<BlockData>) => void;
  onRemove: () => void;
}

// ─── Helpers ───

export function createEmptyBlock(blockType: string, position: number): BlockData {
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

// ─── Component ───

export function BlockEditor({ block, index, onChange, onRemove }: BlockEditorProps) {
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
