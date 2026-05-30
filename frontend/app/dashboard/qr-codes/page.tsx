"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  EmptyState,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useQRCodes, useCreateQRCode, useDeleteQRCode, useRegenerateQR, useLinks, useCreateLink } from "@/hooks";
import { QrCode, Download, Plus, Trash2, Palette, ExternalLink, X, Check, Copy, Loader2, Sparkles } from "lucide-react";
import { LinkSelect } from "@/components/link-select";
import type { QRCodeWithLink } from "@/types/generated";
import { toast } from "sonner";

const SHORT_DOMAIN = "http://localhost:8000";

const DEFAULT_FG = "#171717";
const DEFAULT_BG = "#ffffff";

const COLOR_PRESETS = [
  { fg: "#171717", bg: "#ffffff", label: "Classic" },
  { fg: "#5B2333", bg: "#FEF3F0", label: "Terracotta" },
  { fg: "#1E3A5F", bg: "#F0F7FF", label: "Navy" },
  { fg: "#276749", bg: "#F0FFF4", label: "Forest" },
  { fg: "#6B21A8", bg: "#FAF5FF", label: "Purple" },
  { fg: "#B45309", bg: "#FFFBEB", label: "Amber" },
  { fg: "#1E1B4B", bg: "#F8FAFC", label: "Indigo" },
  { fg: "#9D174D", bg: "#FFF5F5", label: "Rose" },
];

export default function QrCodesPage() {
  const { data: qrCodes, isLoading } = useQRCodes();
  const { data: links } = useLinks();
  const createQR = useCreateQRCode();
  const deleteQR = useDeleteQRCode();
  const regenerateQR = useRegenerateQR();

  const [showCreate, setShowCreate] = useState(false);
  const [createMode, setCreateMode] = useState<"existing" | "new">("existing");
  const [selectedLink, setSelectedLink] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [createFg, setCreateFg] = useState(DEFAULT_FG);
  const [createBg, setCreateBg] = useState(DEFAULT_BG);
  const createLink = useCreateLink();

  const [editingColors, setEditingColors] = useState<string | null>(null);
  const [editFg, setEditFg] = useState(DEFAULT_FG);
  const [editBg, setEditBg] = useState(DEFAULT_BG);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const confirmDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteQR.mutateAsync(id);
      toast.success("QR code deleted");
    } catch {
      toast.error("Failed to delete QR code");
    }
    setDeletingId(null);
  };

  const handleCreate = async () => {
    if (createMode === "existing" && !selectedLink) return;
    if (createMode === "new" && !newUrl.trim()) return;

    try {
      let linkId = selectedLink;

      if (createMode === "new") {
        try { new URL(newUrl.trim()); } catch { return; }
        const result = await createLink.mutateAsync({
          original_url: newUrl.trim(),
          title: newTitle.trim() || undefined,
        });
        linkId = result.id;
      }

      await createQR.mutateAsync({ link_id: linkId, color_fg: createFg, color_bg: createBg });
      toast.success("QR code created!");
      resetCreateModal();
    } catch (e) {
      toast.error("Failed to create QR code");
    }
  };

  const resetCreateModal = () => {
    setShowCreate(false);
    setCreateMode("existing");
    setSelectedLink("");
    setNewUrl("");
    setNewTitle("");
    setCreateFg(DEFAULT_FG);
    setCreateBg(DEFAULT_BG);
  };

  const startEditing = (qr: QRCodeWithLink) => {
    setEditingColors(qr.id);
    setEditFg(qr.color_fg);
    setEditBg(qr.color_bg);
  };

  const saveColors = async (linkId: string) => {
    try {
      await regenerateQR.mutateAsync({ linkId, color_fg: editFg, color_bg: editBg });
      setEditingColors(null);
      toast.success("Colors updated!");
    } catch {
      toast.error("Failed to save colors");
    }
  };

  const downloadSVG = (shortCode: string, title?: string) => {
    const svg = document.getElementById(`qr-${shortCode}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || shortCode}-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = (linkId: string, shortCode: string, title?: string) => {
    const svg = document.getElementById(`qr-${shortCode}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title || shortCode}-qr.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const isCreating = createQR.isPending || createLink.isPending;
  const activeLinks = (links || []).filter((l: any) => l.is_active);

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent backdrop-blur-xl p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
              <Sparkles className="h-3 w-3" />
              QR Codes
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                QR Codes
              </span>
            </h1>
            <p className="mt-2 text-sm text-white/40 font-light">Generate, customize, and download QR codes</p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New QR Code
          </Button>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={(open) => { if (!open) resetCreateModal(); }}>
        <DialogTrigger nativeButton={false} render={<span style={{ display: 'none' }} />} />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New QR Code</DialogTitle>
            <DialogDescription>Create a QR code for an existing link or a new one.</DialogDescription>
          </DialogHeader>

          <div className="flex rounded-xl border border-white/[0.08] p-0.5 bg-white/[0.03] backdrop-blur-xl">
            {(["existing", "new"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setCreateMode(mode)}
                className={`flex-1 rounded-[10px] px-3 py-1.5 text-sm font-medium transition-all ${
                  createMode === mode
                    ? "bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-sm"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {mode === "existing" ? "Existing Link" : "New Link"}
              </button>
            ))}
          </div>

          {createMode === "existing" ? (
            <LinkSelect
              value={selectedLink}
              onChange={setSelectedLink}
              links={activeLinks}
              placeholder="Choose a link..."
            />
          ) : (
            <div className="space-y-3">
              <input
                type="url"
                placeholder="https://example.com/my-long-url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl px-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
              />
              <input
                type="text"
                placeholder="Title (optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl px-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">Color</label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => { setCreateFg(preset.fg); setCreateBg(preset.bg); }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all hover:scale-110 ${
                    createFg === preset.fg && createBg === preset.bg
                      ? "border-terracotta-500 ring-2 ring-terracotta-500/20"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: preset.bg }}
                  title={preset.label}
                >
                  <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: preset.fg }} />
                </button>
              ))}
              <div className="flex items-center gap-1.5">
                <input type="color" value={createFg} onChange={(e) => setCreateFg(e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5" title="Foreground" />
                <span className="text-xs text-white/30">/</span>
                <input type="color" value={createBg} onChange={(e) => setCreateBg(e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5" title="Background" />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-2">
              <QRCodeSVG value={newUrl || "https://preview.link"} size={96} bgColor={createBg} fgColor={createFg} level="M" includeMargin={false} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetCreateModal}>Cancel</Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500"
            >
              {isCreating ? <><Loader2 className="h-4 w-4 animate-spin mr-1.5" />Creating...</> : "Create QR Code"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
              <div className="mx-auto mb-3 h-32 w-32 animate-pulse rounded-xl bg-white/[0.06]" />
              <div className="mx-auto mb-2 h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
              <div className="mx-auto mb-3 h-3 w-36 animate-pulse rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      ) : qrCodes && qrCodes.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {qrCodes.map((qr: QRCodeWithLink) => {
            const shortUrl = `${SHORT_DOMAIN}/${qr.link.short_code}`;
            const qrDataUrl = `${SHORT_DOMAIN}/${qr.link.short_code}?qr=${qr.id}`;
            const isEditing = editingColors === qr.id;

            return (
              <div key={qr.id} className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 transition-all duration-300 hover:border-terracotta-500/30 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-8px] hover:shadow-terracotta-500/20">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] p-2">
                  {isEditing ? (
                    <QRCodeSVG value={qrDataUrl} size={120} bgColor={editBg} fgColor={editFg} level="M" includeMargin={false} />
                  ) : (
                    <QRCodeSVG id={`qr-${qr.link.short_code}`} value={qrDataUrl} size={120} bgColor={qr.color_bg} fgColor={qr.color_fg} level="M" includeMargin={false} />
                  )}
                </div>

                <h3 className="mt-3 font-semibold text-sm text-white/80 truncate">{qr.link.title || "Untitled"}</h3>
                <p className="text-xs text-white/30 mb-2 truncate font-mono">{shortUrl}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-white/40 bg-white/[0.03]">
                    {qr.scan_count} scans
                  </span>
                  <span className="text-[11px] text-white/20 uppercase">{qr.format}</span>
                </div>

                {isEditing ? (
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <input type="color" value={editFg} onChange={(e) => setEditFg(e.target.value)}
                        className="h-6 w-6 cursor-pointer rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5" />
                      <input type="color" value={editBg} onChange={(e) => setEditBg(e.target.value)}
                        className="h-6 w-6 cursor-pointer rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5" />
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="sm" onClick={() => saveColors(qr.link_id)} disabled={regenerateQR.isPending}
                        className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white hover:from-terracotta-400 hover:to-terracotta-500">
                        <Check className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingColors(null)}>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => startEditing(qr)} className="mb-2 rounded-full">
                    <Palette className="h-3 w-3 mr-1.5" />
                    Color
                  </Button>
                )}

                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => downloadSVG(qr.link.short_code, qr.link.title)} className="flex-1 rounded-lg">
                    <Download className="h-3 w-3 mr-1" />
                    SVG
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadPNG(qr.link_id, qr.link.short_code, qr.link.title)} className="flex-1 rounded-lg">
                    <Download className="h-3 w-3 mr-1" />
                    PNG
                  </Button>
                  <Button variant="outline" size="sm" render={<a href={shortUrl} target="_blank" rel="noopener noreferrer" />}>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => confirmDelete(qr.id)} disabled={deletingId === qr.id}>
                    {deletingId === qr.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  </Button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl);
                    setCopiedId(qr.id);
                    toast.success("URL copied!");
                    setTimeout(() => setCopiedId(null), 1500);
                  }}
                  className="absolute right-3 top-3 rounded-lg p-1.5 text-white/20 opacity-0 group-hover:opacity-100 transition-all hover:text-white/60 hover:bg-white/[0.06]"
                >
                  {copiedId === qr.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
          <EmptyState
            icon={<QrCode className="h-6 w-6 text-white/30" />}
            title="No QR codes yet"
            description="Create a QR code for any of your links. Customize colors and download as SVG or PNG."
            action={
              <Button
                onClick={() => setShowCreate(true)}
                className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Create QR Code
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
