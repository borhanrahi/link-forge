## Context

The frontend uses Tailwind CSS v4 (CSS-first config via `@import "tailwindcss"` and `@theme` in `globals.css`). Currently only 6 CSS variables exist (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`, `--border`). There is no `tailwind.config.ts` (v4 dropped it for CSS `@theme`). The component library has 4 basic components (Button, Input, Card, Badge) with minimal styling. Layout is a fixed 64px sidebar + sticky header. All pages use direct Tailwind utility classes with no consistent design language.

The app targets link-in-bio and URL shortener SaaS — a space where visual polish directly impacts trust and conversion. Competitors (Linktree, Bio.link, Bitly) invest heavily in clean UI.

## Goals / Non-Goals

**Goals:**
- Establish a complete design token system in CSS variables (colors, shadows, radii, transitions, fonts)
- Rebuild all UI components with proper ARIA, focus management, and animation
- Redesign the layout shell (sidebar collapse, header with user menu, responsive)
- Restyle all 10 dashboard pages to match the new design system
- Create a professional landing page
- Achieve ~95% Lighthouse accessibility score
- Zero new npm dependencies — use existing Tailwind v4 + lucide-react + clsx/twMerge

**Non-Goals:**
- No backend changes
- No data fetching logic changes — hooks stay as-is with mock data
- No new pages or routes — only restyling existing ones
- No gradient usage anywhere (per user requirement)
- No external UI library (shadcn/ui, Radix, etc.) — keep zero-dependency custom components

## Decisions

### 1. Design Tokens in CSS `@theme` (Tailwind v4)
**Decision**: Define all design tokens in `globals.css` using Tailwind v4's `@theme` directive (CSS-first config).
**Rationale**: Tailwind v4 has deprecated `tailwind.config.ts`. The `@theme` directive is the new standard approach. It generates utility classes automatically and keeps tokens in one place.
**Alternatives**: `tailwind.config.ts` (v3 approach) — would fight the framework. CSS custom properties only — misses utility class generation.

### 2. Neutral Color Palette with Indigo Accent
**Decision**: Use neutral gray palette (slate/gray) as base + indigo as single accent color — applied minimally.
**Rationale**: Creates a professional, content-forward UI. Indigo is already the brand color but currently overused (colored icon backgrounds everywhere). Restricting it to buttons, links, and subtle highlights creates a cleaner look.
**Alternatives**: Full brand color everywhere — would look heavy and dated. Multi-color system — unnecessary complexity.

### 3. Component Architecture
**Decision**: Keep all components in `components/ui/index.tsx` for now, expand with proper sub-components. Each component follows a pattern: `cn()` utility for class merging, forwardRef where appropriate, proper HTML semantics.
**Rationale**: Avoids premature file splitting. The current pattern works — just needs expansion. ForwardRef for Input ensures form library compatibility.
**Alternatives**: One file per component — cleaner but unnecessary for the current scope.

### 4. Sidebar Collapsible with CSS Transitions
**Decision**: Implement sidebar collapse via state toggle + CSS `width` transition. Active nav item uses subtle background tint (not colored background).
**Rationale**: Simple, performant, no animation library needed. Collapsed state shows only icons. Subtle active state (light gray bg + indigo text) follows the "no color explosions" principle.
**Alternatives**: CSS Grid layout shift — more complex. JS animation library — overkill.

### 5. KPI Cards — Typography-First
**Decision**: KPI cards show a large number + subtle label + optional trend indicator. No colored icon backgrounds, no decorative elements.
**Rationale**: Puts data front and center. Users in analytics-heavy SaaS products prefer clear data over decoration. Linear, Vercel, and Sentry all use this pattern.

### 6. Landing Page — Content-First, No Gradients
**Decision**: Clean hero with large headline + subtitle + two CTA buttons (solid + outline). Feature cards with minimal icon + heading + description. No gradient text, no gradient backgrounds, no decorative blobs.
**Rationale**: Gradient heroes are a 2020 trend. 2025/2026 SaaS landings favor clean typography with subtle borders and generous whitespace.

## Risks / Trade-offs

- **[Risk] Tailwind v4 CSS-first config is relatively new**: The `@theme` syntax differs from v3's JS config. Some advanced plugin patterns may not translate cleanly.
  → **Mitigation**: Keep customizations simple — palette, shadows, radii, fonts only. No advanced plugins needed.

- **[Risk] Sidebar collapse on mobile**: A collapsible sidebar works on desktop but needs a proper mobile drawer pattern.
  → **Mitigation**: Implement as a slide-over drawer on mobile (< 768px) with backdrop overlay. Sidebar stays hidden by default on mobile, toggled via hamburger.

- **[Risk] Zero gradient policy may feel too stark**: Without any gradients, the UI could look flat.
  → **Mitigation**: Use subtle border colors, careful shadow layering, and hover transitions to create depth without gradients.

- **[Risk] Component changes may break existing pages**: All 10 pages use the old component APIs.
  → **Mitigation**: Component APIs remain backward-compatible. Old props still work — only visual output changes.
