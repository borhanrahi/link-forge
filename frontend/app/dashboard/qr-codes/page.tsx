"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useQRCodes, useCreateQRCode, useDeleteQRCode, useRegenerateQR, useLinks, useCreateLink } from "@/hooks";
import { QrCode, Download, Plus, Trash2, Palette, ExternalLink, X, Check, Copy } from "lucide-react";
import { Button, Card, CardContent, SectionHeading, Badge } from "@/components/ui";
import type { QRCodeWithLink } from "@/types/generated";

const SHORT_DOMAIN = "http://localhost:8000";

const DEFAULT_FG = "#171717";
const DEFAULT_BG = "#ffffff";

// ─── Color Presets ───
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
        // Validate URL
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
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="QR Codes"
        description="Generate, customize, and download QR codes for your links"
        action={
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            New QR Code
          </Button>
        }
      />

      {/* ─── Create Modal ─── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => resetCreateModal()}>
          <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-900" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">New QR Code</h2>
              <button onClick={() => resetCreateModal()} className="text-neutral-400 hover:text-neutral-600"><X className="h-5 w-5" /></button>
            </div>

            {/* Mode tabs */}
            <div className="mb-4 flex rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-700">
              <button
                onClick={() => setCreateMode("existing")}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${createMode === "existing" ? "bg-terracotta-500 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"}`}
              >
                Existing Link
              </button>
              <button
                onClick={() => setCreateMode("new")}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${createMode === "new" ? "bg-terracotta-500 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"}`}
              >
                New Link
              </button>
            </div>

            {/* Link fields */}
            {createMode === "existing" ? (
              <>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Select Link</label>
                <select
                  value={selectedLink}
                  onChange={(e) => setSelectedLink(e.target.value)}
                  className="mb-4 h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/15 focus:border-terracotta-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="">Choose a link...</option>
                  {activeLinks.map((link: any) => (
                    <option key={link.id} value={link.id}>
                      {link.title || link.short_code} — {link.original_url?.slice(0, 50)}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Destination URL *</label>
                  <input
                    type="url"
                    placeholder="https://example.com/my-long-url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/15 focus:border-terracotta-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Title (optional)</label>
                  <input
                    type="text"
                    placeholder="My Link"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/15 focus:border-terracotta-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                  />
                </div>
              </>
            )}

            {/* Color presets */}
            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Color</label>
            <div className="mb-4 flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => { setCreateFg(preset.fg); setCreateBg(preset.bg); }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all hover:scale-110 ${createFg === preset.fg && createBg === preset.bg ? "border-terracotta-500 ring-2 ring-terracotta-500/20" : "border-transparent"}`}
                  style={{ backgroundColor: preset.bg }}
                  title={preset.label}
                >
                  <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: preset.fg }} />
                </button>
              ))}
              <div className="flex items-center gap-1.5">
                <input type="color" value={createFg} onChange={(e) => setCreateFg(e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded border border-neutral-300 p-0.5 dark:border-neutral-600"
                  title="Custom foreground" />
                <span className="text-xs text-neutral-400">/</span>
                <input type="color" value={createBg} onChange={(e) => setCreateBg(e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded border border-neutral-300 p-0.5 dark:border-neutral-600"
                  title="Custom background" />
              </div>
            </div>

            {/* Preview */}
            <div className="mb-5 flex justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-700">
                <QRCodeSVG value={newUrl || "https://preview.link"} size={96} bgColor={createBg} fgColor={createFg} level="M" includeMargin={false} />
              </div>
            </div>

            <Button className="w-full" onClick={handleCreate} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create QR Code"}
            </Button>
          </div>
        </div>
      )}

      {/* ─── QR Code Grid ─── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="mx-auto mb-3 h-32 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                <div className="mx-auto mb-2 h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="mx-auto mb-3 h-3 w-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : qrCodes && qrCodes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {qrCodes.map((qr: QRCodeWithLink) => {
            const shortUrl = `${SHORT_DOMAIN}/${qr.link.short_code}`;
            const isEditing = editingColors === qr.id;

            return (
              <Card key={qr.id} className="group relative">
                <CardContent className="p-5">
                  {/* QR Code preview */}
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-2">
                    {isEditing ? (
                      <QRCodeSVG
                        value={shortUrl}
                        size={120}
                        bgColor={editBg}
                        fgColor={editFg}
                        level="M"
                        includeMargin={false}
                      />
                    ) : (
                      <QRCodeSVG
                        id={`qr-${qr.link.short_code}`}
                        value={shortUrl}
                        size={120}
                        bgColor={qr.color_bg}
                        fgColor={qr.color_fg}
                        level="M"
                        includeMargin={false}
                      />
                    )}
                  </div>

                  {/* Link title & URL */}
                  <h3 className="mt-3 font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                    {qr.link.title || "Untitled"}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-1 truncate font-mono">
                    {shortUrl}
                  </p>

                  {/* Scan count */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Badge variant="default" className="text-[10px]">
                      {qr.scan_count} scans
                    </Badge>
                    <span className="text-[10px] text-neutral-400">
                      {qr.format.toUpperCase()}
                    </span>
                  </div>

                  {/* Color editing */}
                  {isEditing ? (
                    <div className="space-y-2 mb-2">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5">
                          <input type="color" value={editFg} onChange={(e) => setEditFg(e.target.value)}
                            className="h-6 w-6 cursor-pointer rounded border border-neutral-300 p-0.5 dark:border-neutral-600" />
                          <input type="color" value={editBg} onChange={(e) => setEditBg(e.target.value)}
                            className="h-6 w-6 cursor-pointer rounded border border-neutral-300 p-0.5 dark:border-neutral-600" />
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="sm" onClick={() => saveColors(qr.link_id)} disabled={regenerateQR.isPending}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingColors(null)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {/* Palette button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(qr)}
                        className="flex items-center gap-1"
                      >
                        <Palette className="h-3 w-3" />
                        Color
                      </Button>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-1.5 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => downloadSVG(qr.link.short_code, qr.link.title)}
                    >
                      <Download className="h-3 w-3" />
                      SVG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => downloadPNG(qr.link_id, qr.link.short_code, qr.link.title)}
                    >
                      <Download className="h-3 w-3" />
                      PNG
                    </Button>
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:border-red-300 dark:hover:border-red-700"
                      onClick={() => confirmDelete(qr.id)}
                      disabled={deletingId === qr.id}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Copy URL button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shortUrl);
                      setCopiedId(qr.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    className="absolute right-3 top-3 rounded-md p-1.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {copiedId === qr.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <QrCode className="h-7 w-7 text-neutral-400" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">No QR codes yet</h3>
              <p className="mb-5 max-w-xs text-sm text-neutral-500">
                Create a QR code for any of your links. Customize the colors and download it as SVG or PNG.
              </p>
              <Button size="sm" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" />
                Create QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
