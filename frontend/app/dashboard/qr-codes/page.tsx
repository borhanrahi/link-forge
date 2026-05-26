"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, SectionHeading, EmptyState } from "@/components/ui";
import { QRCodeSVG } from "qrcode.react";
import { useLinks } from "@/hooks";
import { QrCode, Download, Copy, Check, ExternalLink } from "lucide-react";

const SHORT_DOMAIN = "http://localhost:8000";

export default function QrCodesPage() {
  const { data: links } = useLinks();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const linkCodes = (links || []).filter((l: any) => l.is_active).slice(0, 12);

  const downloadQR = (shortCode: string, title: string) => {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeading
        title="QR Codes"
        description="Generate and download QR codes for your active links"
        action={
          <Link href="/dashboard/links/new">
            <Button size="sm">
              <QrCode className="h-4 w-4" />
              New Link QR
            </Button>
          </Link>
        }
      />

      {linkCodes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {linkCodes.map((link: any) => {
            const shortUrl = `${SHORT_DOMAIN}/${link.short_code}`;
            return (
              <Card key={link.id}>
                <CardContent className="p-5 text-center">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-2">
                    <QRCodeSVG
                      id={`qr-${link.short_code}`}
                      value={shortUrl}
                      size={120}
                      bgColor="#ffffff"
                      fgColor="#171717"
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <h3 className="mt-3 font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                    {link.title || "Untitled"}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-1 truncate px-1">
                    {shortUrl}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => downloadQR(link.short_code, link.title)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      SVG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(shortUrl);
                        setCopiedId(link.id);
                        setTimeout(() => setCopiedId(null), 1500);
                      }}
                    >
                      {copiedId === link.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={<QrCode className="h-6 w-6 text-neutral-400" />}
              title="No QR codes yet"
              description="Create an active link to generate a QR code for it."
              action={
                <Link href="/dashboard/links/new">
                  <Button size="sm">Create a Link</Button>
                </Link>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
