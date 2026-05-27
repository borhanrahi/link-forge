import type { ThemeStyle } from "./types";

// ─── Social Icons ───

export const SOCIAL_ICONS: Record<string, string> = {
  twitter: "𝕏",
  x: "𝕏",
  instagram: "📷",
  youtube: "▶️",
  tiktok: "🎵",
  github: "🐙",
  linkedin: "💼",
  facebook: "👍",
  discord: "💬",
  telegram: "✈️",
  whatsapp: "💚",
  email: "✉️",
  website: "🌐",
  spotify: "🎧",
  twitch: "🎮",
  snapchat: "👻",
  pinterest: "📌",
  link: "🔗",
};

export function resolveIcon(icon?: string): string {
  if (!icon) return "🔗";
  const key = icon.toLowerCase().replace(/[^a-z]/g, "");
  return SOCIAL_ICONS[key] || icon;
}

// ─── Color Helpers ───

export function getContrastColor(hex: string): string {
  if (!hex || hex === "transparent") return "#ffffff";
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}

export function isDarkColor(hex: string): boolean {
  return getContrastColor(hex) === "#ffffff";
}

// ─── Theme Styles ───

export const THEME_STYLES: Record<string, ThemeStyle> = {
  minimal: {
    avatarShape: "circle", linkStyle: "pill", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(0,0,0,0.08)",
  },
  "dark-matte": {
    avatarShape: "circle", linkStyle: "rounded", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(255,255,255,0.05)",
  },
  sunset: {
    avatarShape: "circle", linkStyle: "pill", alignment: "center",
    showDivider: true, gradientBg: true, glassLinks: true,
    shadowColor: "rgba(255,107,53,0.25)",
  },
  ocean: {
    avatarShape: "circle", linkStyle: "pill", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(15,118,110,0.25)",
  },
  midnight: {
    avatarShape: "circle", linkStyle: "rounded", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(251,191,36,0.15)",
  },
  forest: {
    avatarShape: "circle", linkStyle: "sharp", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(22,101,52,0.3)",
  },
  rose: {
    avatarShape: "rounded", linkStyle: "pill", alignment: "center",
    showDivider: true, gradientBg: false, glassLinks: true,
    shadowColor: "rgba(159,18,57,0.2)",
  },
  slate: {
    avatarShape: "circle", linkStyle: "rounded", alignment: "left",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(15,23,42,0.08)",
  },
  neon: {
    avatarShape: "circle", linkStyle: "rounded", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: true,
    shadowColor: "rgba(6,182,212,0.2)",
  },
  lavender: {
    avatarShape: "rounded", linkStyle: "pill", alignment: "center",
    showDivider: true, gradientBg: false, glassLinks: true,
    shadowColor: "rgba(76,29,149,0.25)",
  },
  "warm-paper": {
    avatarShape: "circle", linkStyle: "underline", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(146,64,14,0.08)",
  },
  coral: {
    avatarShape: "circle", linkStyle: "pill", alignment: "center",
    showDivider: false, gradientBg: false, glassLinks: false,
    shadowColor: "rgba(225,29,72,0.25)",
  },
};

// ─── Font Map ───

export const FONT_MAP: Record<string, string> = {
  inter: "'Inter', system-ui, -apple-system, sans-serif",
  poppins: "'Poppins', sans-serif",
  "playfair-display": "'Playfair Display', Georgia, serif",
  "roboto-mono": "'Roboto Mono', monospace",
  serif: "Georgia, 'Times New Roman', serif",
};

// ─── Gradient Presets ───

export const GRADIENT_PRESETS: Record<string, string> = {
  sunset: "linear-gradient(135deg, #ff6b35 0%, #f7c948 50%, #ff6b35 100%)",
  ocean: "linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)",
  midnight: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
  forest: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
  rose: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #9f1239 100%)",
  neon: "linear-gradient(135deg, #020617 0%, #0c4a6e 100%)",
  lavender: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
  coral: "linear-gradient(135deg, #e11d48 0%, #fb923c 100%)",
};

// ─── Theme Colors (brand + bg) ───

export const THEME_COLORS: Record<string, { brand: string; bg: string }> = {
  minimal: { brand: "#000000", bg: "#ffffff" },
  "dark-matte": { brand: "#ffffff", bg: "#1a1a1a" },
  sunset: { brand: "#ff6b35", bg: "#fffbeb" },
  ocean: { brand: "#0f766e", bg: "#f0fdfa" },
  midnight: { brand: "#fbbf24", bg: "#0f172a" },
  forest: { brand: "#166534", bg: "#f0fdf4" },
  rose: { brand: "#9f1239", bg: "#fff1f2" },
  slate: { brand: "#1e293b", bg: "#f8fafc" },
  neon: { brand: "#06b6d4", bg: "#020617" },
  lavender: { brand: "#7c3aed", bg: "#faf5ff" },
  "warm-paper": { brand: "#92400e", bg: "#fffbeb" },
  coral: { brand: "#e11d48", bg: "#fff7ed" },
};

// ─── Social Platforms ───

export const SOCIAL_PLATFORMS = [
  { id: "globe", label: "Website" },
  { id: "twitter", label: "X / Twitter" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "github", label: "GitHub" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "facebook", label: "Facebook" },
  { id: "discord", label: "Discord" },
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
];

// ─── Link Button Styles (public page — responsive clamp values) ───

export function getLinkStyles(
  linkStyle: ThemeStyle["linkStyle"],
  brandColor: string,
  glassLinks: boolean,
  shadowColor: string,
): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: "clamp(14px, 2.5vw, 18px) clamp(18px, 3vw, 28px)",
    fontSize: "clamp(14px, 1.6vw, 16px)",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    boxSizing: "border-box" as const,
    position: "relative" as const,
    overflow: "hidden",
  };

  switch (linkStyle) {
    case "pill":
      return {
        ...base,
        borderRadius: 9999,
        background: glassLinks ? "rgba(255,255,255,0.15)" : brandColor,
        color: glassLinks ? "#fff" : getContrastColor(brandColor),
        backdropFilter: glassLinks ? "blur(16px)" : undefined,
        WebkitBackdropFilter: glassLinks ? "blur(16px)" : undefined,
        border: glassLinks ? "1px solid rgba(255,255,255,0.2)" : "none",
        boxShadow: glassLinks ? "0 4px 24px rgba(0,0,0,0.1)" : `0 2px 8px ${shadowColor}`,
      };
    case "rounded":
      return {
        ...base,
        borderRadius: 14,
        background: glassLinks ? "rgba(255,255,255,0.1)" : brandColor,
        color: glassLinks ? "#fff" : getContrastColor(brandColor),
        backdropFilter: glassLinks ? "blur(12px)" : undefined,
        WebkitBackdropFilter: glassLinks ? "blur(12px)" : undefined,
        border: glassLinks ? "1px solid rgba(255,255,255,0.15)" : "none",
      };
    case "sharp":
      return {
        ...base,
        borderRadius: 6,
        background: brandColor,
        color: getContrastColor(brandColor),
      };
    case "underline":
      return {
        ...base,
        borderRadius: 0,
        background: "transparent",
        color: brandColor,
        padding: "clamp(10px, 1.5vw, 14px) 8px",
        borderBottom: "2px solid transparent",
      };
  }
  return base;
}

// ─── Link Button Styles (editor preview — fixed smaller values) ───

export function getLinkStylesPreview(
  linkStyle: string,
  brandColor: string,
  glassLinks: boolean,
  shadowColor: string,
): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: "14px 20px",
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  };

  switch (linkStyle) {
    case "pill":
      return {
        ...base,
        borderRadius: 9999,
        background: glassLinks ? "rgba(255,255,255,0.15)" : brandColor,
        color: glassLinks ? "#fff" : getContrastColor(brandColor),
        backdropFilter: glassLinks ? "blur(16px)" : undefined,
        WebkitBackdropFilter: glassLinks ? "blur(16px)" : undefined,
        border: glassLinks ? "1px solid rgba(255,255,255,0.2)" : "none",
        boxShadow: glassLinks ? "0 4px 24px rgba(0,0,0,0.1)" : `0 2px 8px ${shadowColor}`,
      };
    case "rounded":
      return {
        ...base,
        borderRadius: 12,
        background: glassLinks ? "rgba(255,255,255,0.1)" : brandColor,
        color: glassLinks ? "#fff" : getContrastColor(brandColor),
        backdropFilter: glassLinks ? "blur(12px)" : undefined,
        WebkitBackdropFilter: glassLinks ? "blur(12px)" : undefined,
        border: glassLinks ? "1px solid rgba(255,255,255,0.15)" : "none",
      };
    case "sharp":
      return {
        ...base,
        borderRadius: 4,
        background: brandColor,
        color: getContrastColor(brandColor),
      };
    case "underline":
      return {
        ...base,
        borderRadius: 0,
        background: "transparent",
        color: brandColor,
        padding: "10px 8px",
        borderBottom: "2px solid transparent",
      };
  }
  return base;
}

// ─── Video URL Helpers ───

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  return match ? match[1] : null;
}
