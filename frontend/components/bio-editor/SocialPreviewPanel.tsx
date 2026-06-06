"use client";

import { Image as ImageIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui";

export interface SocialPreviewPanelProps {
  title: string;
  subtitle: string;
  slug: string;
  brandColor: string;
  ogImageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  baseUrl: string;
}

export function SocialPreviewPanel({
  title,
  subtitle,
  slug,
  brandColor,
  ogImageUrl,
  metaTitle,
  metaDescription,
  baseUrl,
}: SocialPreviewPanelProps) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-100">
            Social Preview
          </h3>
        </div>
        <p className="text-xs text-neutral-500">
          How this page looks when shared on social media &amp; messaging apps.
        </p>
        <div className="rounded-xl border border-neutral-700 overflow-hidden bg-neutral-900/50">
          <div className="aspect-[1.91/1] bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center overflow-hidden">
            {ogImageUrl ? (
              <img
                src={ogImageUrl}
                alt="OG preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <div
                  className="mx-auto mb-2 h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: brandColor || "#d47844" }}
                >
                  <span className="text-lg font-bold text-white">
                    {(title || "L").charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">No OG image set</p>
              </div>
            )}
          </div>
          <div className="p-3 space-y-1 bg-neutral-950">
            <p className="text-[11px] text-neutral-500 uppercase tracking-wide font-medium">
              {metaTitle || title || "Bio Page"}
            </p>
            <p className="text-xs text-neutral-400 line-clamp-2">
              {metaDescription || subtitle || "Check out my bio page"}
            </p>
            <p className="text-[10px] text-neutral-600 font-mono">
              {baseUrl}/b/{slug}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
