"use client";

import {
  THEME_STYLES,
  FONT_MAP,
  SOCIAL_ICONS,
  resolveIcon,
  getContrastColor,
  isDarkColor,
  GRADIENT_PRESETS,
  SOCIAL_PLATFORMS,
  getLinkStylesPreview,
} from "./rendering";
import type { BlockData, BioPageData } from "./types";

// ─── Props ───

interface BioPagePreviewProps {
  title: string;
  subtitle: string;
  blocks: BlockData[];
  page: Partial<BioPageData> & {
    theme: string;
    brand_color: string;
    bg_color: string;
  };
}

// ─── Component ───

export function BioPagePreview({ title, subtitle, blocks, page }: BioPagePreviewProps) {
  const themeStyle = THEME_STYLES[page.theme] || THEME_STYLES.minimal;
  const fontFamily = FONT_MAP[page.font_family || "inter"] || FONT_MAP.inter;
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

  return (
    <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "9 / 16" }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: bg,
          backgroundBlendMode: "overlay",
          transition: "background 0.3s ease",
        }}
      />
      {(isGradientBg || page.bg_image_url) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isGradientBg ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.3)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* Scrollable content */}
      <div
        className="overflow-y-auto"
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          padding: "32px 16px 24px",
          fontFamily,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: alignment === "left" ? "flex-start" : "center",
            gap: 0,
          }}
        >
          {/* Profile Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: alignment === "left" ? "flex-start" : "center",
              width: "100%",
              marginBottom: 24,
            }}
          >
            {page.profile_image_url && (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius:
                    themeStyle.avatarShape === "circle"
                      ? "50%"
                      : themeStyle.avatarShape === "rounded"
                        ? 20
                        : 10,
                  overflow: "hidden",
                  width: 72,
                  height: 72,
                  border: `2px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}`,
                  boxShadow: dark
                    ? "0 0 0 1px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.3)"
                    : "0 0 0 1px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={page.profile_image_url}
                  alt={title || ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )}

            {title && (
              <h1
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  color: page.theme === "warm-paper" ? "#92400e" : textColor,
                  textAlign: alignment === "left" ? "left" : "center",
                  wordBreak: "break-word",
                }}
              >
                {title}
              </h1>
            )}

            {subtitle && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: page.theme === "warm-paper" ? "#a16207" : mutedColor,
                  textAlign: alignment === "left" ? "left" : "center",
                  maxWidth: 360,
                  wordBreak: "break-word",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Blocks */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: alignment === "left" ? "stretch" : "center",
              width: "100%",
              gap: 10,
            }}
          >
            {blocks.length === 0 && (
              <p
                style={{
                  fontSize: 12,
                  color: mutedColor,
                  opacity: 0.5,
                  textAlign: "center",
                  padding: "24px 0",
                }}
              >
                Add blocks to see a live preview
              </p>
            )}
            {blocks.map((block) => {
              switch (block.block_type) {
                case "link": {
                  const isUnderline = themeStyle.linkStyle === "underline";
                  const linkHref = block.url || "#";
                  if (isUnderline) {
                    return (
                      <a
                        key={block.id}
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: alignment === "left" ? "flex-start" : "center",
                          gap: 8,
                          width: "100%",
                          padding: "10px 8px",
                          fontSize: 13,
                          fontWeight: 500,
                          color: page.brand_color,
                          borderBottom: `2px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                          textDecoration: "none",
                          transition: "opacity 0.2s",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                      >
                        <span style={{ fontSize: 15 }}>{resolveIcon(block.icon)}</span>
                        <span>{block.label || "Link"}</span>
                      </a>
                    );
                  }
                  const linkBtnStyles = getLinkStylesPreview(
                    themeStyle.linkStyle,
                    page.brand_color,
                    themeStyle.glassLinks,
                    themeStyle.shadowColor,
                  );
                  return (
                    <a
                      key={block.id}
                      href={linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={linkBtnStyles}
                    >
                      <span style={{ fontSize: 15, position: "relative", zIndex: 1 }}>
                        {resolveIcon(block.icon)}
                      </span>
                      <span style={{ position: "relative", zIndex: 1 }}>
                        {block.label || "Link"}
                      </span>
                    </a>
                  );
                }

                case "heading":
                  return block.label ? (
                    <h2
                      key={block.id}
                      style={{
                        width: "100%",
                        fontSize: 17,
                        fontWeight: 700,
                        color: textColor,
                        textAlign: alignment === "left" ? "left" : "center",
                        margin: "4px 0 0",
                        wordBreak: "break-word",
                      }}
                    >
                      {block.label}
                    </h2>
                  ) : (
                    <div key={block.id} style={{ width: "100%" }}>
                      <div
                        style={{
                          height: 22,
                          width: "60%",
                          margin: alignment === "left" ? "4px 0 0" : "4px auto 0",
                          borderRadius: 4,
                          background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                        }}
                      />
                    </div>
                  );

                case "text":
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        padding: "6px 4px",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: mutedColor,
                        textAlign: alignment === "left" ? "left" : "center",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {block.label || (
                        <span style={{ opacity: 0.3, fontStyle: "italic" }}>Empty text block</span>
                      )}
                    </div>
                  );

                case "image":
                  if (!block.image_url) {
                    return (
                      <div
                        key={block.id}
                        style={{
                          width: "100%",
                          height: 80,
                          borderRadius: 10,
                          background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                          border: `1px dashed ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          color: mutedColor,
                          opacity: 0.4,
                        }}
                      >
                        No image URL set
                      </div>
                    );
                  }
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        overflow: "hidden",
                        boxShadow: dark
                          ? "0 4px 16px rgba(0,0,0,0.3)"
                          : "0 4px 16px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={block.image_url}
                        alt={block.label || ""}
                        style={{ width: "100%", height: "auto", display: "block" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  );

                case "social": {
                  const socialLabel = block.label || SOCIAL_PLATFORMS.find((p) => p.id === block.icon)?.label || "Social";
                  return (
                    <a
                      key={block.id}
                      href={block.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: alignment === "left" ? "flex-start" : "center",
                        gap: 10,
                        width: "100%",
                        padding: "10px 16px",
                        borderRadius: 10,
                        background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
                        fontSize: 13,
                        fontWeight: 500,
                        color: textColor,
                        textDecoration: "none",
                        transition: "opacity 0.2s",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{resolveIcon(block.icon)}</span>
                      <span>{socialLabel}</span>
                    </a>
                  );
                }

                case "embed":
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        overflow: "hidden",
                        border: block.embed_html
                          ? "none"
                          : `1px dashed ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                        minHeight: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: mutedColor,
                        opacity: block.embed_html ? 1 : 0.4,
                      }}
                    >
                      {block.embed_html ? (
                        <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: block.embed_html }} />
                      ) : (
                        "Paste embed HTML code"
                      )}
                    </div>
                  );

                case "video":
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        overflow: "hidden",
                        background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        border: !block.video_url
                          ? `1px dashed ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`
                          : "none",
                      }}
                    >
                      {block.video_url ? (
                        <>
                          <div
                            style={{
                              aspectRatio: "16 / 9",
                              background: dark ? "#1a1a1a" : "#e5e5e5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 24,
                            }}
                          >
                            ▶️
                          </div>
                          {block.label && (
                            <p
                              style={{
                                margin: 0,
                                padding: "6px 10px",
                                fontSize: 11,
                                color: mutedColor,
                                textAlign: "center",
                              }}
                            >
                              {block.label}
                            </p>
                          )}
                        </>
                      ) : (
                        <div
                          style={{
                            height: 60,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            color: mutedColor,
                            opacity: 0.4,
                          }}
                        >
                          Enter a video URL
                        </div>
                      )}
                    </div>
                  );

                case "spacer":
                  return <div key={block.id} style={{ height: 20, width: "100%" }} />;

                case "divider":
                  return (
                    <div
                      key={block.id}
                      style={{
                        width: "100%",
                        height: 1,
                        background: dark
                          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
                          : "linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)",
                        margin: "4px 0",
                      }}
                    />
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 32,
              fontSize: 10,
              color: mutedColor,
              opacity: 0.35,
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            Powered by LinkNest
          </div>
        </div>
      </div>
    </div>
  );
}
