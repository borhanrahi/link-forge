export interface BioTemplate {
  id: string;
  name: string;
  description: string;
  theme: string;
  brand_color: string;
  bg_color: string;
  font_family: string;
  preview: {
    avatarShape: "circle" | "rounded" | "square";
    linkStyle: "pill" | "rounded" | "sharp" | "underline";
    alignment: "center" | "left";
    showDivider: boolean;
    gradientBg: boolean;
  };
}

export const BIO_TEMPLATES: BioTemplate[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple — just your links",
    theme: "minimal",
    brand_color: "#000000",
    bg_color: "#ffffff",
    font_family: "inter",
    preview: { avatarShape: "circle", linkStyle: "pill", alignment: "center", showDivider: false, gradientBg: false },
  },
  {
    id: "dark-matte",
    name: "Dark Matte",
    description: "Sleek dark background with soft contrast",
    theme: "dark-matte",
    brand_color: "#f5f5f5",
    bg_color: "#0a0a0a",
    font_family: "inter",
    preview: { avatarShape: "circle", linkStyle: "rounded", alignment: "center", showDivider: false, gradientBg: false },
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    description: "Warm orange-to-pink gradient background",
    theme: "sunset",
    brand_color: "#ffffff",
    bg_color: "#ff6b35",
    font_family: "inter",
    preview: { avatarShape: "circle", linkStyle: "pill", alignment: "center", showDivider: true, gradientBg: true },
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    description: "Cool blue tones with a fresh feel",
    theme: "ocean",
    brand_color: "#ffffff",
    bg_color: "#0f766e",
    font_family: "inter",
    preview: { avatarShape: "circle", linkStyle: "pill", alignment: "center", showDivider: false, gradientBg: false },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep navy with golden accents",
    theme: "midnight",
    brand_color: "#fbbf24",
    bg_color: "#0f172a",
    font_family: "inter",
    preview: { avatarShape: "circle", linkStyle: "rounded", alignment: "center", showDivider: false, gradientBg: false },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Earthy green palette, natural vibe",
    theme: "forest",
    brand_color: "#ffffff",
    bg_color: "#166534",
    font_family: "inter",
    preview: { avatarShape: "circle", linkStyle: "sharp", alignment: "center", showDivider: false, gradientBg: false },
  },
  {
    id: "rose",
    name: "Rose",
    description: "Soft pink tones, elegant and warm",
    theme: "rose",
    brand_color: "#ffffff",
    bg_color: "#9f1239",
    font_family: "inter",
    preview: { avatarShape: "rounded", linkStyle: "pill", alignment: "center", showDivider: true, gradientBg: false },
  },
  {
    id: "slate",
    name: "Slate & White",
    description: "Corporate, clean, professional",
    theme: "slate",
    brand_color: "#0f172a",
    bg_color: "#f8fafc",
    font_family: "inter",
    preview: { avatarShape: "circle", linkStyle: "rounded", alignment: "left", showDivider: false, gradientBg: false },
  },
  {
    id: "neon",
    name: "Neon Pulse",
    description: "Dark with electric cyan and magenta accents",
    theme: "neon",
    brand_color: "#06b6d4",
    bg_color: "#020617",
    font_family: "inter",
    preview: { avatarShape: "circle", linkStyle: "rounded", alignment: "center", showDivider: false, gradientBg: false },
  },
  {
    id: "lavender",
    name: "Lavender Dream",
    description: "Soft purple tones, calm and dreamy",
    theme: "lavender",
    brand_color: "#ffffff",
    bg_color: "#4c1d95",
    font_family: "inter",
    preview: { avatarShape: "rounded", linkStyle: "pill", alignment: "center", showDivider: true, gradientBg: false },
  },
  {
    id: "warm-paper",
    name: "Warm Paper",
    description: "Beige/cream background, cozy feel",
    theme: "warm-paper",
    brand_color: "#92400e",
    bg_color: "#fef3c7",
    font_family: "serif",
    preview: { avatarShape: "circle", linkStyle: "underline", alignment: "center", showDivider: false, gradientBg: false },
  },
  {
    id: "coral",
    name: "Coral Reef",
    description: "Vibrant coral with teal accents",
    theme: "coral",
    brand_color: "#ffffff",
    bg_color: "#e11d48",
    font_family: "inter",
    preview: { avatarShape: "circle", linkStyle: "pill", alignment: "center", showDivider: false, gradientBg: false },
  },
];
