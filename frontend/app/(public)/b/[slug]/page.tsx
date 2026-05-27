import type { Metadata } from "next";
import type { BlockData, BioPageData, ThemeStyle } from "@/components/bio";
import {
  THEME_STYLES,
  FONT_MAP,
  SOCIAL_ICONS,
  resolveIcon,
  getContrastColor,
  isDarkColor,
  GRADIENT_PRESETS,
  SOCIAL_PLATFORMS,
  getLinkStyles,
  extractYouTubeId,
  extractVimeoId,
} from "@/components/bio";

interface Props {
  params: Promise<{ slug: string }>;
}



// ─── Metadata ───

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${apiUrl}/b/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const page: BioPageData = data.page;
      return {
        title: page.title || page.slug,
        description: page.subtitle || `Check out ${page.title || page.slug} on LinkNest`,
        openGraph: page.profile_image_url
          ? { images: [{ url: page.profile_image_url }] }
          : undefined,
        themeColor: page.brand_color,
        other: {
          "theme-color": page.brand_color,
        },
      };
    }
  } catch {}
  return { title: "Bio Page" };
}

// ─── Page Component ───

export default async function BioPagePublic(props: Props) {
  const { slug } = await props.params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  let page: BioPageData | null = null;
  let blocks: BlockData[] = [];

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 16,
          padding: 24,
          background: "#0d0b0a",
          color: "#a8a099",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #d47844, #a14a28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            marginBottom: 4,
          }}
        >
          🔗
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f0eee9" }}>
          Page not found
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#857e77", textAlign: "center", maxWidth: 360 }}>
          This bio page doesn&apos;t exist or has been unpublished.
        </p>
      </div>
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

  const bg = page.bg_image_url
    ? `url(${page.bg_image_url}) center/cover no-repeat fixed`
    : isGradientBg
      ? gradient
      : page.bg_color || "#ffffff";

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isGradientBg ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.3)",
    pointerEvents: "none",
    zIndex: 0,
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Roboto+Mono:wght@400;500;600&display=swap"
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

      {(isGradientBg || page.bg_image_url) && (
        <div className={isGradientBg ? "gradient-bg" : ""} style={overlayStyle} />
      )}

      <div
        className="bio-page-wrapper"
        style={{
          fontFamily,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          padding: "clamp(40px, 8vh, 80px) clamp(16px, 4vw, 32px) clamp(32px, 6vh, 60px)",
          boxSizing: "border-box",
          background: bg,
          backgroundBlendMode: "overlay",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "min(520px, 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: alignment === "left" ? "flex-start" : "center",
            gap: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ─── Profile Section ─── */}
          <div
            className="bio-header"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: alignment === "left" ? "flex-start" : "center",
              width: "100%",
              marginBottom: "clamp(24px, 4vw, 40px)",
            }}
          >
            {page.profile_image_url && (
              <div
                className="bio-avatar"
                style={{
                  marginBottom: "clamp(14px, 2.5vw, 24px)",
                  borderRadius:
                    themeStyle.avatarShape === "circle"
                      ? "50%"
                      : themeStyle.avatarShape === "rounded"
                        ? 20
                        : 10,
                  overflow: "hidden",
                  width: "clamp(80px, 12vw, 120px)",
                  height: "clamp(80px, 12vw, 120px)",
                  border: `3px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}`,
                  boxShadow: dark
                    ? "0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3)"
                    : "0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)",
                  animation: "bioScaleIn 0.6s ease-out, bioGlow 3s ease-in-out 1s infinite",
                }}
              >
                <img
                  src={page.profile_image_url}
                  alt={page.title || ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )}

            {page.title && (
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(22px, 3.5vw, 30px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.25,
                  color: page.theme === "warm-paper" ? "#92400e" : textColor,
                  textAlign: alignment === "left" ? "left" : "center",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                }}
              >
                {page.title}
              </h1>
            )}

            {page.subtitle && (
              <p
                style={{
                  margin: "clamp(6px, 1vw, 10px) 0 0",
                  fontSize: "clamp(13px, 1.5vw, 15px)",
                  lineHeight: 1.65,
                  color: page.theme === "warm-paper" ? "#a16207" : mutedColor,
                  textAlign: alignment === "left" ? "left" : "center",
                  maxWidth: "min(400px, 100%)",
                  wordBreak: "break-word",
                }}
              >
                {page.subtitle}
              </p>
            )}
          </div>

          {/* ─── Blocks ─── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: alignment === "left" ? "stretch" : "center",
              width: "100%",
              gap: "clamp(10px, 1.5vw, 16px)",
            }}
          >
            {blocks.map((block, index) => {
              const delay = index * 0.07;
              const animationDelay = `${delay}s`;

              switch (block.block_type) {
                // ── Link Block ──
                case "link": {
                  const isUnderline = themeStyle.linkStyle === "underline";

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
                          gap: "clamp(8px, 1.2vw, 12px)",
                          width: "100%",
                          padding: "clamp(12px, 1.8vw, 16px) 8px",
                          fontSize: "clamp(14px, 1.6vw, 16px)",
                          fontWeight: 500,
                          color: page.brand_color,
                          textDecoration: "none",
                          borderBottom: `2px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                          transition: "all 0.2s ease",
                          boxSizing: "border-box",
                        }}
                      >
                        <span style={{ fontSize: "clamp(16px, 2vw, 20px)" }}>{resolveIcon(block.icon)}</span>
                        <span>{block.label || "Link"}</span>
                      </a>
                    );
                  }

                  const linkBtnStyles = getLinkStyles(
                    themeStyle.linkStyle,
                    page.brand_color,
                    themeStyle.glassLinks,
                    themeStyle.shadowColor,
                  );

                  return (
                    <a
                      key={block.id}
                      href={block.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bio-link"
                      style={{ ...linkBtnStyles, animationDelay }}
                    >
                      {themeStyle.glassLinks && (
                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(110deg, transparent 0%, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%, transparent 100%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmerLink 3s ease-in-out infinite",
                            pointerEvents: "none",
                            borderRadius: "inherit",
                          }}
                        />
                      )}
                      <span style={{ fontSize: "clamp(16px, 2vw, 20px)", position: "relative", zIndex: 1 }}>
                        {resolveIcon(block.icon)}
                      </span>
                      <span style={{ position: "relative", zIndex: 1 }}>{block.label || "Link"}</span>
                    </a>
                  );
                }

                // ── Heading Block ──
                case "heading":
                  return block.label ? (
                    <h2
                      key={block.id}
                      className="bio-text-block"
                      style={{
                        animationDelay,
                        width: "100%",
                        margin: "8px 0 0",
                        fontSize: "clamp(17px, 2.2vw, 21px)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: textColor,
                        textAlign: alignment === "left" ? "left" : "center",
                        wordBreak: "break-word",
                      }}
                    >
                      {block.label}
                    </h2>
                  ) : null;

                // ── Text Block ──
                case "text":
                  return (
                    <div
                      key={block.id}
                      className="bio-text-block"
                      style={{
                        animationDelay,
                        width: "100%",
                        padding: "clamp(6px, 1vw, 10px) 4px",
                        fontSize: "clamp(13px, 1.5vw, 15px)",
                        lineHeight: 1.75,
                        color: mutedColor,
                        textAlign: alignment === "left" ? "left" : "center",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {block.label}
                    </div>
                  );

                // ── Image Block ──
                case "image":
                  if (!block.image_url) return null;
                  return (
                    <div
                      key={block.id}
                      className="bio-image-block"
                      style={{
                        animationDelay,
                        width: "100%",
                        borderRadius: "clamp(10px, 1.5vw, 16px)",
                        overflow: "hidden",
                        boxShadow: dark
                          ? "0 4px 20px rgba(0,0,0,0.3)"
                          : "0 4px 20px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={block.image_url}
                        alt={block.label || ""}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </div>
                  );

                // ── Social Block ──
                case "social": {
                  const socialLabel = block.label || SOCIAL_PLATFORMS.find((p) => p.id === block.icon)?.label || "Social";
                  return (
                    <a
                      key={block.id}
                      href={block.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bio-link"
                      style={{
                        animationDelay,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: alignment === "left" ? "flex-start" : "center",
                        gap: "clamp(10px, 1.5vw, 14px)",
                        width: "100%",
                        padding: "clamp(12px, 1.8vw, 16px) clamp(16px, 2.5vw, 24px)",
                        borderRadius: "clamp(10px, 1.2vw, 14px)",
                        background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                        fontSize: "clamp(13px, 1.5vw, 15px)",
                        fontWeight: 500,
                        color: textColor,
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                      }}
                    >
                      <span style={{ fontSize: "clamp(18px, 2.2vw, 22px)" }}>{resolveIcon(block.icon)}</span>
                      <span>{socialLabel}</span>
                    </a>
                  );
                }

                // ── Embed Block ──
                case "embed":
                  if (!block.embed_html) return null;
                  return (
                    <div
                      key={block.id}
                      className="bio-text-block"
                      style={{
                        animationDelay,
                        width: "100%",
                        borderRadius: "clamp(10px, 1.5vw, 16px)",
                        overflow: "hidden",
                        boxShadow: dark
                          ? "0 4px 20px rgba(0,0,0,0.3)"
                          : "0 4px 20px rgba(0,0,0,0.06)",
                      }}
                      dangerouslySetInnerHTML={{ __html: block.embed_html }}
                    />
                  );

                // ── Video Block ──
                case "video": {
                  const youtubeId = block.video_url ? extractYouTubeId(block.video_url) : null;
                  const vimeoId = block.video_url ? extractVimeoId(block.video_url) : null;
                  const embedSrc = youtubeId
                    ? `https://www.youtube.com/embed/${youtubeId}`
                    : vimeoId
                      ? `https://player.vimeo.com/video/${vimeoId}`
                      : null;
                  return (
                    <div
                      key={block.id}
                      className="bio-image-block"
                      style={{
                        animationDelay,
                        width: "100%",
                        borderRadius: "clamp(10px, 1.5vw, 16px)",
                        overflow: "hidden",
                        boxShadow: dark
                          ? "0 4px 20px rgba(0,0,0,0.3)"
                          : "0 4px 20px rgba(0,0,0,0.06)",
                      }}
                    >
                      {embedSrc ? (
                        <iframe
                          src={embedSrc}
                          title={block.label || "Video"}
                          style={{
                            width: "100%",
                            aspectRatio: "16 / 9",
                            border: "none",
                            display: "block",
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : block.video_url ? (
                        <div
                          style={{
                            aspectRatio: "16 / 9",
                            background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            fontSize: 13,
                            color: mutedColor,
                          }}
                        >
                          <span style={{ fontSize: 32 }}>▶️</span>
                          <span>Video — check URL format</span>
                        </div>
                      ) : null}
                      {block.label && (
                        <p
                          style={{
                            margin: 0,
                            padding: "clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 16px)",
                            fontSize: "clamp(12px, 1.3vw, 14px)",
                            color: mutedColor,
                            textAlign: "center",
                          }}
                        >
                          {block.label}
                        </p>
                      )}
                    </div>
                  );
                }

                // ── Spacer Block ──
                case "spacer":
                  return (
                    <div
                      key={block.id}
                      className="bio-divider"
                      style={{
                        animationDelay,
                        width: "100%",
                        height: "clamp(16px, 3vw, 32px)",
                      }}
                    />
                  );

                // ── Divider Block ──
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
                          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
                          : "linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)",
                        margin: "clamp(6px, 1vw, 10px) 0",
                      }}
                    />
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* ─── Footer ─── */}
          <div
            className="bio-footer"
            style={{
              marginTop: "clamp(36px, 6vh, 56px)",
              fontSize: "clamp(11px, 1.2vw, 13px)",
              color: mutedColor,
              opacity: 0.4,
              textAlign: "center",
              letterSpacing: "0.03em",
            }}
          >
            <span>Powered by LinkNest</span>
          </div>
        </div>
      </div>
    </>
  );
}
