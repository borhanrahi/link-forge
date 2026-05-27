"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useQRCodes, useCreateQRCode, useDeleteQRCode, useRegenerateQR, useLinks, useCreateLink } from "@/hooks";
import { QrCode, Download, Plus, Trash2, Palette, ExternalLink, X, Check, Copy, Loader2 } from "lucide-react";
import type { QRCodeWithLink } from "@/types/generated";

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
    await deleteQR.mutateAsync(id);
    setDeletingId(null);
  };

  const handleCreate = async () => {
    if (createMode === "existing" && !selectedLink) return;
    if (createMode === "new" && !newUrl.trim()) return;

    const isSubmitting = createQR.isPending || createLink.isPending;
    if (isSubmitting) return;

    try {
      let linkId = selectedLink;

      if (createMode === "new") {
        try {
          new URL(newUrl.trim());
        } catch {
          return;
        }
        const result = await createLink.mutateAsync({
          original_url: newUrl.trim(),
          title: newTitle.trim() || undefined,
        });
        linkId = result.id;
      }

      await createQR.mutateAsync({ link_id: linkId, color_fg: createFg, color_bg: createBg });
      resetCreateModal();
    } catch (e) {
      console.error("Failed to create:", e);
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
    } catch (e) {
      console.error("Failed to save colors:", e);
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
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">QR Codes</h1>
          <p className="mt-1 text-sm text-neutral-400">Generate, customize, and download QR codes for your links</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500"
        >
          <Plus className="h-4 w-4" />
          New QR Code
        </button>
      </div>

      {/* ─── Create Modal ─── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => resetCreateModal()}>
          <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">New QR Code</h2>
              <button onClick={() => resetCreateModal()} className="text-neutral-500 hover:text-neutral-300 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mode tabs */}
            <div className="mb-4 flex rounded-lg border border-neutral-800 p-0.5 bg-neutral-950">
              {(["existing", "new"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCreateMode(mode)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    createMode === mode
                      ? "bg-terracotta-500 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {mode === "existing" ? "Existing Link" : "New Link"}
                </button>
              ))}
            </div>

            {/* Link fields */}
            {createMode === "existing" ? (
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-neutral-300">Select Link</label>
                <select
                  value={selectedLink}
                  onChange={(e) => setSelectedLink(e.target.value)}
                  className="h-10 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600/50"
                >
                  <option value="">Choose a link...</option>
                  {activeLinks.map((link: any) => (
                    <option key={link.id} value={link.id}>
                      {link.title || link.short_code} — {link.original_url?.slice(0, 50)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mb-4 space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-300">Destination URL *</label>
                  <input
                    type="url"
                    placeholder="https://example.com/my-long-url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="h-10 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-300">Title (optional)</label>
                  <input
                    type="text"
                    placeholder="My Link"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-10 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-600/50"
                  />
                </div>
              </div>
            )}

            {/* Color presets */}
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Color</label>
            <div className="mb-4 flex flex-wrap items-center gap-2">
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
                  className="h-7 w-7 cursor-pointer rounded border border-neutral-700 bg-neutral-950 p-0.5"
                  title="Custom foreground" />
                <span className="text-xs text-neutral-500">/</span>
                <input type="color" value={createBg} onChange={(e) => setCreateBg(e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded border border-neutral-700 bg-neutral-950 p-0.5"
                  title="Custom background" />
              </div>
            </div>

            {/* Preview */}
            <div className="mb-5 flex justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 p-2">
                <QRCodeSVG value={newUrl || "https://preview.link"} size={96} bgColor={createBg} fgColor={createFg} level="M" includeMargin={false} />
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating..." : "Create QR Code"}
            </button>
          </div>
        </div>
      )}

      {/* ─── QR Code Grid ─── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <div className="mx-auto mb-3 h-32 w-32 animate-pulse rounded-lg bg-neutral-800" />
              <div className="mx-auto mb-2 h-4 w-24 animate-pulse rounded bg-neutral-800" />
              <div className="mx-auto mb-3 h-3 w-36 animate-pulse rounded bg-neutral-800" />
            </div>
          ))}
        </div>
      ) : qrCodes && qrCodes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {qrCodes.map((qr: QRCodeWithLink) => {
            const shortUrl = `${SHORT_DOMAIN}/${qr.link.short_code}`;
            const isEditing = editingColors === qr.id;

            return (
              <div key={qr.id} className="group relative rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition-all hover:border-neutral-700">
                {/* QR Code preview */}
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-lg bg-neutral-950 border border-neutral-800 p-2">
                  {isEditing ? (
                    <QRCodeSVG value={shortUrl} size={120} bgColor={editBg} fgColor={editFg} level="M" includeMargin={false} />
                  ) : (
                    <QRCodeSVG id={`qr-${qr.link.short_code}`} value={shortUrl} size={120} bgColor={qr.color_bg} fgColor={qr.color_fg} level="M" includeMargin={false} />
                  )}
                </div>

                {/* Info */}
                <h3 className="mt-3 font-semibold text-sm text-white truncate">{qr.link.title || "Untitled"}</h3>
                <p className="text-xs text-neutral-500 mb-2 truncate font-mono">{shortUrl}</p>

                {/* Scan count */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-full border border-neutral-800 px-2 py-0.5 text-[11px] font-medium text-neutral-400">
                    {qr.scan_count} scans
                  </span>
                  <span className="text-[11px] text-neutral-500 uppercase">{qr.format}</span>
                </div>

                {/* Color editing */}
                {isEditing ? (
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <input type="color" value={editFg} onChange={(e) => setEditFg(e.target.value)}
                        className="h-6 w-6 cursor-pointer rounded border border-neutral-700 bg-neutral-950 p-0.5" />
                      <input type="color" value={editBg} onChange={(e) => setEditBg(e.target.value)}
                        className="h-6 w-6 cursor-pointer rounded border border-neutral-700 bg-neutral-950 p-0.5" />
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => saveColors(qr.link_id)} disabled={regenerateQR.isPending}
                        className="flex items-center gap-1 rounded-lg bg-terracotta-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-terracotta-400 transition-all">
                        <Check className="h-3 w-3" />
                        Save
                      </button>
                      <button onClick={() => setEditingColors(null)}
                        className="flex items-center gap-1 rounded-lg border border-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => startEditing(qr)}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all mb-2">
                    <Palette className="h-3 w-3" />
                    Color
                  </button>
                )}

                {/* Actions */}
                <div className="flex gap-1.5">
                  <button onClick={() => downloadSVG(qr.link.short_code, qr.link.title)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-neutral-800 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
                    <Download className="h-3 w-3" />
                    SVG
                  </button>
                  <button onClick={() => downloadPNG(qr.link_id, qr.link.short_code, qr.link.title)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-neutral-800 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
                    <Download className="h-3 w-3" />
                    PNG
                  </button>
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-lg border border-neutral-800 px-2.5 py-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <button onClick={() => confirmDelete(qr.id)} disabled={deletingId === qr.id}
                    className="flex items-center justify-center rounded-lg border border-red-900/30 px-2.5 py-1.5 text-red-400 hover:bg-red-950/30 hover:border-red-700/50 transition-all">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                {/* Copy URL - hover reveal */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl);
                    setCopiedId(qr.id);
                    setTimeout(() => setCopiedId(null), 1500);
                  }}
                  className="absolute right-3 top-3 rounded-md p-1.5 text-neutral-500 opacity-0 group-hover:opacity-100 transition-all hover:text-neutral-300"
                >
                  {copiedId === qr.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-800">
              <QrCode className="h-7 w-7 text-neutral-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">No QR codes yet</h3>
            <p className="mt-1 mb-6 max-w-xs text-sm text-neutral-500">
              Create a QR code for any of your links. Customize colors and download as SVG or PNG.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-terracotta-500 to-terracotta-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-terracotta-500/20 transition-all hover:from-terracotta-400 hover:to-terracotta-500"
            >
              <Plus className="h-4 w-4" />
              Create QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
