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
  embed_html?: string;
  position: number;
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
  font_family: string;
  seo_indexable: boolean;
}

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
      <html><body><div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <p>Bio page not found</p>
      </div></body></html>
    );
  }

  const fontFamilyMap: Record<string, string> = {
    inter: "'Inter', system-ui, sans-serif",
    poppins: "'Poppins', sans-serif",
    "playfair-display": "'Playfair Display', serif",
    "roboto-mono": "'Roboto Mono', monospace",
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content={page.seo_indexable ? "index,follow" : "noindex,nofollow"} />
        <title>{page.title || page.slug} | LinkNest</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        margin: 0,
        background: page.bg_color || "#ffffff",
        fontFamily: fontFamilyMap[page.font_family] || fontFamilyMap.inter,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "40px 16px",
      }}>
        <div style={{ width: "100%", maxWidth: 560 }}>
          {page.profile_image_url && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <img src={page.profile_image_url} alt="" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: page.brand_color }}>{page.title}</h1>
            {page.subtitle && <p style={{ margin: "8px 0 0", color: "#666", fontSize: 14 }}>{page.subtitle}</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {blocks.map((block) => (
              <a
                key={block.id}
                href={block.url || "#"}
                target={block.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 20px",
                  borderRadius: 12,
                  background: page.brand_color,
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  gap: 8,
                }}
              >
                {block.icon && <span>{block.icon}</span>}
                {block.label || block.block_type}
              </a>
            ))}
          </div>
        </div>
      </body>
    </html>
  );
}
