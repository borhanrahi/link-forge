"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui";
import { BLOCK_TYPES, createEmptyBlock } from "@/components/bio";
import type { BlockData } from "@/components/bio";

export interface AddBlockPanelProps {
  onAdd: (block: BlockData) => void;
}

export function AddBlockPanel({ onAdd }: AddBlockPanelProps) {
  const handleAdd = (blockType: string) => {
    const newBlock = createEmptyBlock(blockType, Date.now());
    onAdd(newBlock);
    const meta = BLOCK_TYPES.find((bt) => bt.id === blockType);
    toast.success(`Added ${meta?.label || blockType} block`);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-neutral-100">Add Block</h3>
          <Plus className="h-3.5 w-3.5 text-neutral-500" />
        </div>
        <div className="space-y-1.5">
          {BLOCK_TYPES.map((bt) => {
            const Icon = bt.icon;
            return (
              <button
                key={bt.id}
                type="button"
                onClick={() => handleAdd(bt.id)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-left text-sm transition-all hover:bg-neutral-800 hover:border-neutral-600 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-800 text-neutral-400">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-medium text-neutral-200">
                      {bt.label}
                    </span>
                    <p className="text-xs text-neutral-500">{bt.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
