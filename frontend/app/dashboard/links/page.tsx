"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { EmptyState, CopyButton, StatusBadge, SearchInput, Sparkline, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useLinks, useSparklines, useBulkLinkAction, useTags } from "@/hooks";
import { Link2, Plus, ExternalLink, ArrowUpRight, Sparkles, QrCode, Download, X, CheckSquare, Square, Archive, RotateCcw, Trash2, Tag } from "lucide-react";

const SHORT_DOMAIN = "http://localhost:8000";

export default function LinksPage() {
  const router = useRouter();
  const { data: links } = useLinks();
  const { data: sparklines } = useSparklines();
  const [search, setSearch] = useState("");
  const [qrLink, setQrLink] = useState<{ id: string; shortCode: string; title?: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const bulkAction = useBulkLinkAction();
  const { data: tags } = useTags();
  const [selectedTag, setSelectedTag] = useState<string>("");

  const filtered = links?.filter(
    (l: any) =>
      !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.short_code?.toLowerCase().includes(search.toLowerCase()),
  );

  const downloadQR = (shortCode: string, title?: string) => {
    const svg = document.getElementById(`qr-inline-${shortCode}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || shortCode}-qr.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl dash-glass border p-6 lg:p-8">
        <div className="absolute -inset-x-40 -top-40 h-[500px] w-[700px] rounded-full bg-terracotta-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dash-glass-border)] bg-[var(--dash-glass-bg)] px-3 py-1 text-[11px] font-semibold text-terracotta-300 tracking-[0.15em] uppercase mb-4">
              <Sparkles className="h-3 w-3" />
              Links
            </span>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="text-foreground">
                Links
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-light">Manage all your shortened links</p>
          </div>
          <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500" render={<Link href="/dashboard/links/new" />}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Link
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search links..."
      />

      {/* Tag filter */}
      {tags && tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-3.5 w-3.5 text-muted-foreground/60" />
          <button
            onClick={() => setSelectedTag("")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              selectedTag === ""
                ? "bg-terracotta-500/20 text-terracotta-300 ring-1 ring-terracotta-500/30"
                : "bg-[var(--dash-glass-bg)] text-muted-foreground hover:text-foreground/60 ring-1 ring-[var(--dash-glass-border)]"
            }`}
          >
            All
          </button>
          {tags.map((tag: string) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedTag === tag
                  ? "bg-terracotta-500/20 text-terracotta-300 ring-1 ring-terracotta-500/30"
                  : "bg-[var(--dash-glass-bg)] text-muted-foreground hover:text-foreground/60 ring-1 ring-[var(--dash-glass-border)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-terracotta-500/20 bg-terracotta-500/5 backdrop-blur-xl px-4 py-3">
          <span className="text-sm text-foreground/60">{selected.size} selected</span>
          <Button variant="ghost" size="sm" onClick={() => bulkAction.mutate({ link_ids: Array.from(selected), action: "archive" })}>
            <Archive className="h-3.5 w-3.5 mr-1" /> Archive
          </Button>
          <Button variant="ghost" size="sm" onClick={() => bulkAction.mutate({ link_ids: Array.from(selected), action: "restore" })}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Restore
          </Button>
          <Button variant="ghost" size="sm" className="text-rust-400 hover:text-rust-300" onClick={() => bulkAction.mutate({ link_ids: Array.from(selected), action: "delete" })}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
        </div>
      )}

      {/* Links list — glass panel */}
      {filtered && filtered.length > 0 ? (
        <div className="dash-glass rounded-2xl border divide-y divide-[var(--dash-glass-border)]">
          {filtered.map((link: any) => {
            const shortUrl = `${SHORT_DOMAIN}/${link.short_code}`;
            return (
              <div
                key={link.id}
                onClick={() => router.push(`/dashboard/links/${link.id}`)}
                className="flex items-center justify-between px-6 py-4 transition-all duration-200 cursor-pointer hover:bg-[var(--dash-glass-hover-bg)]"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(prev => {
                        const next = new Set(prev);
                        if (next.has(link.id)) next.delete(link.id);
                        else next.add(link.id);
                        return next;
                      });
                    }}
                    className="shrink-0"
                  >
                    {selected.has(link.id) ? (
                      <CheckSquare className="h-4 w-4 text-terracotta-400" />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500/20 to-terracotta-500/5 text-terracotta-400 ring-1 ring-[var(--dash-glass-border)] shrink-0">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground/80 truncate max-w-[240px]">
                      {link.title || "Untitled"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-terracotta-400/80 font-mono hover:text-terracotta-300 truncate max-w-[240px] transition-colors"
                      >
                        {shortUrl}
                      </a>
                      <CopyButton text={shortUrl} />
                      <div className="flex items-center gap-1 text-xs text-muted-foreground/40">
                        <ArrowUpRight className="h-3 w-3" />
                        {link.clicks_count ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {/* Sparkline */}
                  <Sparkline
                    data={sparklines?.[link.id] ?? []}
                    width={48}
                    height={18}
                    className="hidden sm:block"
                  />
                  {/* QR download */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrLink({ id: link.id, shortCode: link.short_code, title: link.title });
                    }}
                    className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/40 hover:text-terracotta-400 hover:bg-[var(--dash-glass-hover-bg)] transition-all"
                    title="Download QR code"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                  </button>
                  {/* Status */}
                  <StatusBadge
                    status={link.is_active ? "active" : "inactive"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dash-glass rounded-2xl border">
          <EmptyState
            icon={<Link2 className="h-6 w-6 text-muted-foreground/60" />}
            title={search ? "No links found" : "No links yet"}
            description={search ? "Try a different search term." : "Create your first shortened link to get started."}
            action={!search && (
              <Button className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500" render={<Link href="/dashboard/links/new" />}>
                <Plus className="h-4 w-4 mr-1.5" />
                Create Link
              </Button>
            )}
          />
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={!!qrLink} onOpenChange={(open) => { if (!open) setQrLink(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          {qrLink && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex items-center justify-center rounded-xl border border-[var(--dash-glass-border)] bg-[var(--dash-glass-bg)] p-4">
                <QRCodeSVG
                  id={`qr-inline-${qrLink.shortCode}`}
                  value={`${SHORT_DOMAIN}/${qrLink.shortCode}`}
                  size={160}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-sm text-foreground/70 font-mono truncate max-w-full">
                {SHORT_DOMAIN}/{qrLink.shortCode}
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setQrLink(null)}>
              <X className="h-4 w-4 mr-1.5" />
              Close
            </Button>
            {qrLink && (
              <Button
                onClick={() => downloadQR(qrLink.shortCode, qrLink.title)}
                className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/25 hover:shadow-xl hover:shadow-terracotta-500/30 hover:from-terracotta-400 hover:to-terracotta-500"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Download SVG
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
