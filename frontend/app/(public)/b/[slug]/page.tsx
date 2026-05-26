interface Props {
  params: Promise<{ slug: string }>;
}

interface BioBlockData {
  id: string;
  block_type: string;
  label?: string;
  url?: string;
  icon?: string;
  image_url?: string;
  video_url?: string;
  embed_html?: string;
  position: number;
  is_active?: boolean;
}

interface BioPageData {
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
}

// ─── Theme Definitions ───

interface ThemeStyle {
  avatarShape: "circle" | "rounded" | "square";
  linkStyle: "pill" | "rounded" | "sharp" | "underline";
  alignment: "center" | "left";
  showDivider: boolean;
  gradientBg: boolean;
  glassLinks: boolean;
  shadowColor: string;
}

const THEME_STYLES: Record<string, ThemeStyle> = {
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

const FONT_MAP: Record<string, string> = {
  inter: "'Inter', system-ui, -apple-system, sans-serif",
  poppins: "'Poppins', sans-serif",
  "playfair-display": "'Playfair Display', Georgia, serif",
  "roboto-mono": "'Roboto Mono', monospace",
  serif: "Georgia, 'Times New Roman', serif",
};

// ─── Emoji / Icon helpers ───

const SOCIAL_ICONS: Record<string, string> = {
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

function resolveIcon(icon?: string): string {
  if (!icon) return "🔗";
  const key = icon.toLowerCase().replace(/[^a-z]/g, "");
  return SOCIAL_ICONS[key] || icon;
}

// ─── Helper: compute link button styles based on theme ───

function getLinkStyles(
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
    padding: "16px 24px",
    fontSize: 15,
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
        background: glassLinks
          ? `rgba(255,255,255,0.15)`
          : brandColor,
        color: glassLinks ? "#fff" : getContrastColor(brandColor),
        backdropFilter: glassLinks ? "blur(16px)" : undefined,
        WebkitBackdropFilter: glassLinks ? "blur(16px)" : undefined,
        border: glassLinks ? "1px solid rgba(255,255,255,0.2)" : "none",
        boxShadow: glassLinks
          ? "0 4px 24px rgba(0,0,0,0.1)"
          : `0 2px 8px ${shadowColor}`,
      };
    case "rounded":
      return {
        ...base,
        borderRadius: 14,
        background: glassLinks
          ? `rgba(255,255,255,0.1)`
          : brandColor,
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
        padding: "12px 8px",
        borderBottom: `2px solid transparent`,
      };
  }
}

function getContrastColor(hex: string): string {
  if (!hex || hex === "transparent") return "#ffffff";
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}

function isDarkColor(hex: string): boolean {
  return getContrastColor(hex) === "#ffffff";
}

// ─── Background gradient presets ───

const GRADIENT_PRESETS: Record<string, string> = {
  sunset: "linear-gradient(135deg, #ff6b35 0%, #f7c948 50%, #ff6b35 100%)",
  ocean: "linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)",
  midnight: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
  forest: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
  rose: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #9f1239 100%)",
  neon: "linear-gradient(135deg, #020617 0%, #0c4a6e 100%)",
  lavender: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
  coral: "linear-gradient(135deg, #e11d48 0%, #fb923c 100%)",
};

export default async function BioPagePublic(props: Props) {
  const { slug } = await props.params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  let page: BioPageData | null = null;
  let blocks: BioBlockData[] = [];

  try {
    const res = await fetch(`${apiUrl}/b/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      page = data.page;
      blocks = data.blocks || [];
    }
  } catch {}

  if (!page) {
    return (
      <html>
        <body style={{ margin: 0, background: "#0d0b0a", color: "#a8a099", fontFamily: "system-ui, sans-serif" }}>
          <div style={{
            display: "flex", flexDirection: "column", height: "100vh",
            alignItems: "center", justifyContent: "center", gap: 16, padding: 24,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #d47844, #a14a28)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginBottom: 4,
            }}>🔗</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f0eee9" }}>
              Page not found
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "#857e77", textAlign: "center" }}>
              This bio page doesn&apos;t exist or has been unpublished.
            </p>
          </div>
        </body>
      </html>
    );
  }

  const themeStyle = THEME_STYLES[page.theme] || THEME_STYLES.minimal;
  const fontFamily = FONT_MAP[page.font_family] || FONT_MAP.inter;
  const dark = isDarkColor(page.bg_color);
  const textColor = dark ? "#f0eee9" : "#2c2723";
  const mutedColor = dark ? "#a8a099" : "#857e77";
  const gradient = GRADIENT_PRESETS[page.theme];
  const isGradientBg = themeStyle.gradientBg && gradient;
  const alignment = themeStyle.alignment;

  const containerStyle: React.CSSProperties = {
    margin: 0,
    fontFamily,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "60px 20px 40px",
    boxSizing: "border-box",
    background: page.bg_image_url
      ? `url(${page.bg_image_url}) center/cover no-repeat fixed`
      : isGradientBg
        ? gradient
        : page.bg_color || "#ffffff",
    backgroundBlendMode: "overlay",
    position: "relative" as const,
    overflowX: "hidden",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 520,
    display: "flex",
    flexDirection: "column",
    alignItems: alignment === "left" ? "flex-start" : "center",
    gap: 0,
    position: "relative" as const,
    zIndex: 1,
  };

  // Add an overlay gradient for better readability on gradient/bg-image backgrounds
  const overlayStyle: React.CSSProperties = isGradientBg || page.bg_image_url ? {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: isGradientBg
      ? "rgba(0,0,0,0.15)"
      : "rgba(0,0,0,0.3)",
    pointerEvents: "none",
    zIndex: 0,
  } : {};

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow" />
        <title>{page.title || page.slug} &middot; LinkNest</title>
        <meta name="description" content={page.subtitle || `Check out ${page.title || page.slug} on LinkNest`} />
        {page.profile_image_url && (
          <meta property="og:image" content={page.profile_image_url} />
        )}
        <meta property="og:title" content={page.title || page.slug} />
        <meta property="og:description" content={page.subtitle || "Link-in-bio page"} />
        <meta name="theme-color" content={page.brand_color} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Roboto+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @keyframes bioFadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bioScaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes bioGlow {
            0%, 100% { box-shadow: 0 0 20px ${page.brand_color}33; }
            50% { box-shadow: 0 0 40px ${page.brand_color}55; }
          }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes shimmerLink {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .bio-link {
            animation: bioFadeIn 0.5s ease-out both;
          }
          .bio-link:hover {
            transform: translateY(-2px) scale(1.02) !important;
            box-shadow: 0 8px 30px ${themeStyle.shadowColor || "rgba(0,0,0,0.15)"} !important;
          }
          .bio-link:active {
            transform: translateY(0) scale(0.98) !important;
          }
          .bio-link-underline {
            animation: bioFadeIn 0.5s ease-out both;
          }
          .bio-link-underline:hover {
            border-bottom-color: ${page.brand_color} !important;
            opacity: 0.8;
          }
          .bio-avatar {
            animation: bioScaleIn 0.6s ease-out both;
          }
          .bio-text-block {
            animation: bioFadeIn 0.5s ease-out both;
          }
          .bio-image-block {
            animation: bioFadeIn 0.5s ease-out both;
          }
          .bio-image-block img {
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }
          .bio-image-block:hover img {
            transform: scale(1.02);
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          }
          .bio-divider {
            animation: bioFadeIn 0.4s ease-out both;
          }
          .bio-header {
            animation: bioFadeIn 0.6s ease-out both;
          }
          .bio-footer {
            animation: bioFadeIn 0.8s ease-out 0.6s both;
          }
          ${isGradientBg ? `
          .gradient-bg {
            background-size: 200% 200% !important;
            animation: gradientShift 8s ease infinite;
          }
          ` : ""}
          * {
            -webkit-tap-highlight-color: transparent;
          }
        `}</style>
      </head>
      <body style={containerStyle}>
        {isGradientBg && (
          <div className="gradient-bg" style={overlayStyle} />
        )}
        {!isGradientBg && page.bg_image_url && (
          <div style={overlayStyle} />
        )}

        <div style={cardStyle}>
          {/* ─── Profile Section ─── */}
          <div className="bio-header" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: alignment === "left" ? "flex-start" : "center",
            width: "100%",
            marginBottom: 32,
          }}>
            {page.profile_image_url && (
              <div className="bio-avatar" style={{
                marginBottom: 20,
                borderRadius: themeStyle.avatarShape === "circle"
                  ? "50%"
                  : themeStyle.avatarShape === "rounded"
                    ? 20
                    : 10,
                overflow: "hidden",
                width: 104,
                height: 104,
                border: `3px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: dark
                  ? `0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3)`
                  : `0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)`,
                animation: "bioScaleIn 0.6s ease-out, bioGlow 3s ease-in-out 1s infinite",
              }}>
                <img
                  src={page.profile_image_url}
                  alt={page.title || ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )}

            {page.title && (
              <h1 style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                color: page.theme === "warm-paper" ? "#92400e" : textColor,
                textAlign: alignment === "left" ? "left" : "center",
              }}>
                {page.title}
              </h1>
            )}

            {page.subtitle && (
              <p style={{
                margin: "8px 0 0",
                fontSize: 14,
                lineHeight: 1.6,
                color: page.theme === "warm-paper" ? "#a16207" : mutedColor,
                textAlign: alignment === "left" ? "left" : "center",
                maxWidth: 400,
              }}>
                {page.subtitle}
              </p>
            )}
          </div>

          {/* ─── Blocks ─── */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: alignment === "left" ? "stretch" : "center",
            width: "100%",
            gap: 12,
          }}>
            {blocks.map((block, index) => {
              const delay = index * 0.07;
              const animationDelay = `${delay}s`;

              switch (block.block_type) {
                case "link":
                  const isUnderline = themeStyle.linkStyle === "underline";
                  const linkBtnStyles = isUnderline
                    ? {}
                    : getLinkStyles(themeStyle.linkStyle, page.brand_color, themeStyle.glassLinks, themeStyle.shadowColor);

                  if (isUnderline) {
                    return (
                      <a
                        key={block.id}
                        href={block.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bio-link-underline"
                        style={{
                          animationDelay,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: alignment === "left" ? "flex-start" : "center",
                          gap: 10,
                          width: "100%",
                          padding: "14px 8px",
                          fontSize: 15,
                          fontWeight: 500,
                          color: page.brand_color,
                          textDecoration: "none",
                          borderBottom: `2px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                          transition: "all 0.2s ease",
                          boxSizing: "border-box" as const,
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{resolveIcon(block.icon)}</span>
                        <span>{block.label || "Link"}</span>
                      </a>
                    );
                  }

                  return (
                    <a
                      key={block.id}
                      href={block.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bio-link"
                      style={{
                        ...linkBtnStyles,
                        animationDelay,
                      }}
                    >
                      {/* Shimmer overlay for glass links */}
                      {themeStyle.glassLinks && (
                        <span style={{
                          position: "absolute",
                          top: 0, left: 0, right: 0, bottom: 0,
                          background: "linear-gradient(110deg, transparent 0%, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%, transparent 100%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmerLink 3s ease-in-out infinite",
                          pointerEvents: "none",
                          borderRadius: "inherit",
                        }} />
                      )}
                      <span style={{ fontSize: 18, position: "relative", zIndex: 1 }}>
                        {resolveIcon(block.icon)}
                      </span>
                      <span style={{ position: "relative", zIndex: 1 }}>
                        {block.label || "Link"}
                      </span>
                    </a>
                  );

                case "text":
                  return (
                    <div
                      key={block.id}
                      className="bio-text-block"
                      style={{
                        animationDelay,
                        width: "100%",
                        padding: "8px 4px",
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: mutedColor,
                        textAlign: alignment === "left" ? "left" : "center",
                      }}
                    >
                      {block.label}
                    </div>
                  );

                case "image":
                  if (!block.image_url) return null;
                  return (
                    <div
                      key={block.id}
                      className="bio-image-block"
                      style={{
                        animationDelay,
                        width: "100%",
                        borderRadius: 14,
                        overflow: "hidden",
                        boxShadow: dark
                          ? "0 4px 20px rgba(0,0,0,0.3)"
                          : "0 4px 20px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={block.image_url}
                        alt={block.label || ""}
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          borderRadius: 14,
                        }}
                      />
                    </div>
                  );

                case "divider":
                  return (
                    <div
                      key={block.id}
                      className="bio-divider"
                      style={{
                        animationDelay,
                        width: "100%",
                        height: 1,
                        background: dark
                          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
                          : "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
                        margin: "8px 0",
                      }}
                    />
                  );

                case "embed":
                  if (!block.embed_html) return null;
                  return (
                    <div
                      key={block.id}
                      className="bio-text-block"
                      style={{
                        animationDelay,
                        width: "100%",
                        borderRadius: 14,
                        overflow: "hidden",
                        boxShadow: dark
                          ? "0 4px 20px rgba(0,0,0,0.3)"
                          : "0 4px 20px rgba(0,0,0,0.06)",
                      }}
                      dangerouslySetInnerHTML={{ __html: block.embed_html }}
                    />
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* ─── Footer ─── */}
          <div className="bio-footer" style={{
            marginTop: 48,
            fontSize: 12,
            color: mutedColor,
            opacity: 0.5,
            textAlign: "center",
            letterSpacing: "0.02em",
          }}>
            <span>Powered by LinkNest</span>
          </div>
        </div>
      </body>
    </html>
  );
}
