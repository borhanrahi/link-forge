export const APP_NAME = "LinkNest";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://linknest.app";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "10 short links",
      "1 bio page",
      "Basic click analytics (7 days)",
      "LinkNest branded domain",
      "Standard QR codes",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 900,
    interval: "month",
    features: [
      "Unlimited short links",
      "3 bio pages",
      "Full analytics (unlimited history)",
      "1 custom domain",
      "Custom bio page colors & themes",
      "Password-protected links",
      "UTM builder + presets",
      "Branded QR codes",
      "Link scheduling & expiration",
      "CSV export",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 2900,
    interval: "month",
    features: [
      "Everything in Pro",
      "Unlimited bio pages",
      "5 custom domains",
      "Team workspaces (up to 10 members)",
      "Role-based access",
      "Bio page password protection",
      "Webhook events",
      "Priority support",
      "White-label QR codes",
      "API access",
    ],
  },
];

export const THEMES = ["minimal", "dark", "gradient", "glass", "card", "neon"];
export const FONTS = ["inter", "poppins", "playfair-display", "roboto-mono"];
export const BLOCK_TYPES = ["link", "social", "text", "image", "video", "divider", "tip_jar", "embed"];
