"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "xs" | "sm" | "default" | "lg" | "icon" | "icon-sm";
  className?: string;
  showLabel?: boolean;
  onCopy?: () => void;
}

export function CopyButton({
  text,
  label,
  variant = "ghost",
  size = "icon-sm",
  className,
  showLabel = false,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      onCopy?.();
      setTimeout(() => setCopied(false), 1500);
    },
    [text, onCopy]
  );

  if (showLabel) {
    return (
      <Button variant={variant as any} size={size as any} onClick={handleCopy} className={cn("gap-1.5", className)}>
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            {label || "Copied"}
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            {label || "Copy"}
          </>
        )}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "shrink-0 rounded-lg p-1.5 text-white/30 transition-all hover:text-white/60 hover:bg-white/[0.06]",
        className
      )}
      aria-label={label || "Copy URL"}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
