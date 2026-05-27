export interface BlockData {
  id: string;
  block_type: string;
  label?: string;
  url?: string;
  icon?: string;
  image_url?: string;
  video_url?: string;
  embed_html?: string;
  position: number;
}

export interface BioPageData {
  id: string;
  slug: string;
  title?: string;
  subtitle?: string;
  profile_image_url?: string;
  theme: string;
  brand_color: string;
  bg_color: string;
  bg_image_url?: string;
  font_family: string;
  is_published?: boolean;
  blocks?: BlockData[];
}

export interface ThemeStyle {
  avatarShape: "circle" | "rounded" | "square";
  linkStyle: "pill" | "rounded" | "sharp" | "underline";
  alignment: "center" | "left";
  showDivider: boolean;
  gradientBg: boolean;
  glassLinks: boolean;
  shadowColor: string;
}
