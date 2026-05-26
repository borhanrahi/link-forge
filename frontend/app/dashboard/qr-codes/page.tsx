"use client";

import Link from "next/link";
import { Button, Card, CardContent, SectionHeading, EmptyState } from "@/components/ui";
import { QRCodeSVG } from "qrcode.react";
import { useLinks } from "@/hooks";
import { QrCode, Download } from "lucide-react";

export default function QrCodesPage() {
  const { data: links } = useLinks();
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
          {linkCodes.map((link: any) => (
            <Card key={link.id}>
              <CardContent className="p-5 text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-2">
                  <QRCodeSVG
                    id={`qr-${link.short_code}`}
                    value={link.original_url}
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
                <p className="text-xs text-neutral-400 mb-3 truncate">
                  /{link.short_code}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => downloadQR(link.short_code, link.title)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download SVG
                </Button>
              </CardContent>
            </Card>
          ))}
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
