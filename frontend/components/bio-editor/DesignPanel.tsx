"use client";

import { Palette } from "lucide-react";

import { Card, CardContent, Input } from "@/components/ui";
import { THEME_COLORS } from "@/components/bio";

export interface DesignPanelProps {
  theme: string;
  brandColor: string;
  bgColor: string;
  bgImageUrl: string;
  fontFamily: string;
  onThemeChange: (v: string) => void;
  onBrandColorChange: (v: string) => void;
  onBgColorChange: (v: string) => void;
  onBgImageChange: (v: string) => void;
  onFontChange: (v: string) => void;
}

const THEME_OPTIONS = [
  { value: "minimal", label: "Minimal — Clean, light" },
  { value: "dark-matte", label: "Dark Matte — Sleek, dark" },
  { value: "sunset", label: "Sunset — Warm gradient" },
  { value: "ocean", label: "Ocean — Cool blues" },
  { value: "midnight", label: "Midnight — Deep navy" },
  { value: "forest", label: "Forest — Earthy greens" },
  { value: "rose", label: "Rose — Elegant pink" },
  { value: "slate", label: "Slate — Left-aligned, subtle" },
  { value: "neon", label: "Neon — Cyberpunk glow" },
  { value: "lavender", label: "Lavender — Soft purple" },
  { value: "warm-paper", label: "Warm Paper — Textured beige" },
  { value: "coral", label: "Coral — Vibrant orange" },
];

const FONT_OPTIONS = [
  { value: "inter", label: "Inter — Modern, clean" },
  { value: "poppins", label: "Poppins — Friendly, round" },
  { value: "playfair-display", label: "Playfair Display — Elegant, serif" },
  { value: "roboto-mono", label: "Roboto Mono — Monospace, tech" },
  { value: "serif", label: "Serif — Classic" },
];

function ColorField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-400 mb-2">
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 rounded-md border border-neutral-700 bg-transparent cursor-pointer shrink-0"
        />
        <input
          className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 text-xs text-neutral-100 focus:outline-none focus:border-terracotta-500/50 font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export function DesignPanel({
  theme,
  brandColor,
  bgColor,
  bgImageUrl,
  fontFamily,
  onThemeChange,
  onBrandColorChange,
  onBgColorChange,
  onBgImageChange,
  onFontChange,
}: DesignPanelProps) {
  const handleThemeChange = (newTheme: string) => {
    onThemeChange(newTheme);
    const colors = THEME_COLORS[newTheme];
    if (colors) {
      onBrandColorChange(colors.brand);
      onBgColorChange(colors.bg);
    }
  };

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-100">Design</h3>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-2">
            Theme Template
          </label>
          <select
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 focus:outline-none focus:border-terracotta-500/50 appearance-none"
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            {THEME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Brand Color"
            value={brandColor}
            onChange={onBrandColorChange}
            placeholder="#000000"
          />
          <ColorField
            label="Background Color"
            value={bgColor}
            onChange={onBgColorChange}
            placeholder="#ffffff"
          />
        </div>

        <Input
          label="Background Image URL"
          value={bgImageUrl}
          onChange={(e) => onBgImageChange(e.target.value)}
          placeholder="https://example.com/bg.jpg"
          hint="Optional — overrides background color"
        />

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-2">
            Font Family
          </label>
          <select
            className="h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 focus:outline-none focus:border-terracotta-500/50 appearance-none"
            value={fontFamily}
            onChange={(e) => onFontChange(e.target.value)}
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
