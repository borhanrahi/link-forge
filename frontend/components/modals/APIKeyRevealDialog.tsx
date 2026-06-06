"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";

export interface APIKeyRevealDialogProps {
  apiKey: string | null;
  keyName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function APIKeyRevealDialog({
  apiKey,
  keyName,
  open,
  onOpenChange,
}: APIKeyRevealDialogProps) {
  const [revealed, setRevealed] = useState(false);

  if (!apiKey) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setRevealed(false);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-terracotta-400" />
            {keyName ? `Key "${keyName}" created` : "API key created"}
          </DialogTitle>
          <DialogDescription>
            Copy this key now — for security, we will not show it again.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200/80 leading-relaxed">
            Store this key in a password manager or environment variable. Anyone
            with this key can access your workspace with the scopes you
            granted.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={apiKey}
            type={revealed ? "text" : "password"}
            className="font-mono text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setRevealed((v) => !v)}
            title={revealed ? "Hide" : "Reveal"}
          >
            {revealed ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={async () => {
              await navigator.clipboard.writeText(apiKey);
              toast.success("API key copied to clipboard");
            }}
            title="Copy"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>I've saved it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
