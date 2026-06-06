"use client";

import { Card, CardContent } from "@/components/ui";
import { BlockEditor } from "@/components/bio";
import type { BlockData } from "@/components/bio";

export interface BlocksListPanelProps {
  blocks: BlockData[];
  onChange: (blockId: string, updates: Partial<BlockData>) => void;
  onRemove: (blockId: string) => void;
}

export function BlocksListPanel({
  blocks,
  onChange,
  onRemove,
}: BlocksListPanelProps) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
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
            onChange={(updates) => onChange(block.id, updates)}
            onRemove={() => onRemove(block.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
