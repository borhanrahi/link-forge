"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, Printer, QrCode as QrIcon } from "lucide-react";
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

export interface LinkQRDialogProps {
  shortUrl: string | null;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QR_COLOR_PRESETS = [
  { fg: "#000000", bg: "#ffffff" },
  { fg: "#d47844", bg: "#ffffff" },
  { fg: "#1f2937", bg: "#fef3c7" },
  { fg: "#ffffff", bg: "#000000" },
  { fg: "#065f46", bg: "#d1fae5" },
  { fg: "#1e3a8a", bg: "#dbeafe" },
] as const;

export function LinkQRDialog({
  shortUrl,
  title,
  open,
  onOpenChange,
}: LinkQRDialogProps) {
  if (!shortUrl) return null;

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById(
      "link-qr-svg",
    ) as unknown as SVGElement | null;
    if (!svgEl) {
      toast.error("QR not ready yet");
      return;
    }
    const xml = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${shortUrl.split("/").pop() || "link"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("QR code downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrIcon className="h-4 w-4 text-terracotta-400" />
            QR code
          </DialogTitle>
          <DialogDescription>
            Scan to open <span className="font-mono text-foreground/80">{shortUrl}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-2xl border border-white/[0.06] bg-white p-4">
            <QRCodeSVG
              id="link-qr-svg"
              value={shortUrl}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={false}
            />
          </div>

          {title && (
            <p className="text-sm font-medium text-foreground/80 text-center">
              {title}
            </p>
          )}

          <Input value={shortUrl} readOnly className="text-center text-xs font-mono" />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
          <Button onClick={handleDownloadSVG}>
            <Download className="h-3.5 w-3.5" />
            Download SVG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QR_COLOR_PRESETS };
