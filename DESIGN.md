---
name: LinkNest
description: Link management platform for creators — shorten URLs, bio pages, QR codes, analytics
colors:
  ember: "#c06030"
  ember-deep: "#843d22"
  stone-bg: "#0d0b0a"
  stone-surface: "#1a1714"
  stone-elevated: "#2c2723"
  stone-ink: "#f8f7f5"
  stone-muted: "#857e77"
  stone-border: "#443e39"
  moss: "#3d865e"
  rust: "#dd4f27"
  sky: "#3992e2"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.05
    fontStyle: italic
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
    textTransform: uppercase
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "#a14a28"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.stone-muted}"
    rounded: "{rounded.md}"
    borderColor: "{colors.stone-elevated}"
    padding: "10px 20px"
  card-default:
    backgroundColor: "#ffffff08"
    rounded: "{rounded.xl}"
    backdropFilter: "blur(12px)"
    borderColor: "#ffffff08"
  input-default:
    backgroundColor: "#ffffff08"
    rounded: "{rounded.md}"
    borderColor: "#ffffff14"
    placeholderColor: "#ffffff4d"
---

# Design System: LinkNest

## 1. Overview

**Creative North Star: "The Control Room"**

A warm, precise command center for creators who own their links. Every metric, every link, every click at your fingertips — like a recording studio control desk where every fader, every meter, every button has a deliberate place. The interface is dark without being brooding, warm without being soft, and precise without being cold.

This system explicitly rejects the generic SaaS template: no purple-to-blue gradients, no Inter font, no cards nested inside cards, no stray uppercase tracked eyebrows above every section. It favors depth through glass layering (subtle backdrop-blur + transparent borders + tonal backgrounds) over flat surfaces or heavy shadows. The terracotta accent (Ember) is used sparingly — its rarity on any given screen is the point, reserved for primary actions, active navigation, and data highlights.

The dashboard exists to surface the creator's content — links, analytics, bio pages — and get out of the way. Every empty state, loading spinner, and error message is designed with the same care as the hero section.

**Key Characteristics:**
- Dark ambient background (Stone) with glass-elevated surfaces
- Ember (terracotta) accent used selectively, ≤10% of any screen
- Geist sans-serif for UI, Instrument Serif italic for display moments
- Glass layering: backdrop-blur + rgba borders, no heavy shadows
- Refined and tactile components with 8px radius and subtle transitions
- Confident whitespace — rhythm through spacing, not decorative graphics

## 2. Colors

The Stone + Ember + Moss palette. Warm stone neutrals anchor the dark interface, Ember (terracotta) provides the accent pulse, Moss (forest green) marks positive states, Rust communicates danger, and Sky handles informational roles.

### Primary

- **Ember** (`#c06030`, oklch(0.52 0.12 45)): Primary actions, active nav items, data highlights, link accents. Used on ≤10% of any given screen. The Ember glow is the signal that something is interactive or important.
- **Ember Deep** (`#843d22`, oklch(0.38 0.1 45)): Hover states of Ember elements, secondary Ember surfaces, selection backgrounds.

### Neutral

- **Stone BG** (`#0d0b0a`, oklch(0.071 0.005 55)): Page background. The ambient room.
- **Stone Surface** (`#1a1714`, oklch(0.13 0.008 55)): Card and panel backgrounds.
- **Stone Elevated** (`#2c2723`, oklch(0.19 0.01 55)): Borders, dividers, subtle separation.
- **Stone Ink** (`#f8f7f5`, oklch(0.96 0.005 70)): Primary text color.
- **Stone Muted** (`#857e77`, oklch(0.55 0.01 55)): Secondary text, placeholder text, metadata.

### Semantic

- **Moss** (`#3d865e`, oklch(0.55 0.1 155)): Success states, checkmarks, positive trends, active/online indicators.
- **Rust** (`#dd4f27`, oklch(0.55 0.18 35)): Destructive actions, error states, deletion, danger signals.
- **Sky** (`#3992e2`, oklch(0.6 0.16 250)): Informational roles, charts, external link indicators, blue data points.

### Named Rules

**The Accent Rarity Rule.** Ember covers ≤10% of any given screen. If the accent covers more, it's not accenting — it's wallpaper. The selective glow is what makes it read as intentional.

**The Glass-Not-Frost Rule.** Glass surfaces use `backdrop-blur` with rgba borders on a dark ambient base. They should read as transparent depth, not as frosted white. The background color is always Stone BG or Stone Surface, never white or near-white.

## 3. Typography

**Display Font:** Instrument Serif (with Georgia, serif fallback) — italic weight only, for hero headings and display moments.
**Body Font:** Geist (with system-ui, sans-serif fallback) — the workhorse UI typeface, clean and precise.
**Label/Mono Font:** Geist covers label roles; no separate mono face unless code display is needed.

**Character:** A serene serif italic for headlines expresses the editorial confidence; a sharp geometric sans for everything else provides the precision. The pairing is serif warmth + sans clarity — not two competing sans faces.

### Hierarchy

- **Display** (400 italic, `clamp(2.5rem, 5vw, 4.5rem)`, 1.05): Hero headings only. Used on landing and section openers. `text-wrap: balance`.
- **Headline** (700, `clamp(1.75rem, 3.5vw, 3rem)`, 1.1, -0.03em): Major section titles. `text-wrap: balance`.
- **Title** (600, 1rem, 1.4): Card titles, modal titles, list item primary text.
- **Body** (400, 0.9375rem, 1.65): Paragraphs, descriptions, dashboard content. Max line length 65–75ch.
- **Label** (600, 0.75rem, 0.05em, uppercase): Stat headers, section eyebrows (used sparingly per anti-reference rules), badges, table headers.

### Named Rules

**The One-Family UI Rule.** Geist is the sole UI typeface. Instrument Serif is reserved exclusively for display hero moments. More than two type families reads as indecision.

**The No-SaaS-Starter Rule.** No Inter, no system-ui stacks that read "default startup template." Geist with Instrument Serif italic is the pair that distinguishes LinkNest from the template crowd.

## 4. Elevation

Depth through glass layering and tonal differentiation, not through shadows. The dark ambient background (Stone BG) hosts glass-elevated surfaces that use subtle `backdrop-blur(12px)` combined with `rgba(255,255,255,0.03–0.08)` backgrounds and `rgba(255,255,255,0.06)` borders. This creates a layered feel without casting shadows — surfaces sit on top of each other like frosted glass panels in a dark room.

The only shadows used are ambient accent glows: `box-shadow[0_0_30px_-5px_rgba(192,96,48,0.15)]` on hover for Ember-accented elements, low-diffuse and non-structural. No raised-card box-shadows, no drop shadows on nav elements.

### Shadow Vocabulary

- **Accent Glow** (`0 0 30px -5px rgba(192,96,48,0.15)`): Hover state on Ember-accented cards and stat tiles. Ambient, not structural.
- **Modal Overlay** (`0 0 60px -12px rgba(0,0,0,0.6)`): Dialog and sheet containers. The only elevated shadow in the system.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Blur and glow appear only as a response to interaction (hover, focus, open state). The glass surface at rest should look like tinted glass, not like glowing neon.

## 5. Components

### Buttons

- **Shape:** 8px radius (rounded-lg). Compact, confident hit areas.
- **Primary (Ember):** `bg-[#c06030] text-white`. Hover: `bg-[#a14a28]`. Active: `translate-y-px`. Focus: ring-2 ring-ember/40. Icon gap 6px.
- **Outline:** `border border-stone-elevated bg-transparent text-stone-muted`. Hover: `bg-white/[0.06] text-white`. Used for secondary actions alongside Ember buttons.
- **Ghost:** No border or bg at rest. Hover: `bg-white/[0.06]`. Used for dismissible actions and icon buttons.
- **Destructive:** `bg-rust/10 text-rust border-rust/20`. Hover: `bg-rust/20`.
- **Size defaults:** default h-8 px-2.5, sm h-7, lg h-9, icon 32px square.
- **All buttons** use `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` and `active:translate-y-px` for tactile feedback.

### Cards / Containers

- **Corner Style:** 16px radius (rounded-2xl). Restrained rounding — curved, not pill-shaped.
- **Background:** `bg-white/[0.03] backdrop-blur-xl` with `border border-white/[0.06]`.
- **Shadow:** None at rest. Accent cards (`accent` prop) get a top gradient line and hover glow.
- **Internal Padding:** 20px (p-5). Content spacing via `gap-4`.
- **Variants:** `size="sm"` reduces padding to 12px and gap to 12px.

### Inputs & Fields

- **Style:** `border-white/[0.08] bg-white/[0.03] backdrop-blur-xl`. Text: `text-white`, placeholder: `text-white/30`.
- **Focus:** `border-ember/40 ring-2 ring-ember/20`. The Ember glow signals interaction.
- **Error:** `border-rust/50 ring-rust/20` with red label text.
- **Height:** 40px (h-10) for default size. Labels above, error messages below.

### Navigation (Dashboard Sidebar)

- **Style:** shadcn sidebar with collapsible icon mode. Default state shows icons + labels; collapsed state shows icons only.
- **Active state:** Ember icon color (`text-ember`) on current route. Background: none — color is sufficient signaling.
- **Hover:** `bg-white/[0.04]`.
- **Typography:** 14px Geist medium for labels. Icons are 16px.
- **Header:** LinkNest logo (Ember gradient "L" + text) at top, collapsed to just icon.

### Chips / Status Badges

- **Style:** `rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[11px] font-medium bg-white/[0.03]`.
- **Color roles:** Active = white; Inactive = muted. Semantic variants for link status, plan tiers, and role badges.

### Stat Cards

- **Layout:** 4-column responsive grid. Each stat: label (uppercase 11px semibold muted), value (36px black weight tabular-nums), optional trend badge.
- **Accent variant:** Adds top gradient bar (`via-ember/60`) and hover glow. Used for primary metrics (total links, total clicks).

### Signature Component: Empty State

- **Layout:** Centered column with icon container (56px circle, border + blurred bg), title (16px semibold), description (14px muted, max-w-sm), optional CTA button.
- **Used across:** Links page (no links yet), analytics (no data), bio pages, QR codes.
- **Tone:** Informative, not apologetic. A clear next action always present.

### Signature Component: Onboarding Checklist

- **Layout:** Tracked progress of key first actions (create link, create bio page, set up domain, invite team).
- **Items:** Checkable rows with link to each action. Completed items show Moss checkmark + strikethrough.
- **Position:** Dashboard home, above quick actions.

## 6. Do's and Don'ts

### Do:

- **Do** use Ember sparingly (≤10% of any screen). Selective accent = intentional design.
- **Do** use glass layering (`backdrop-blur` + rgba borders) for surface elevation.
- **Do** use Instrument Serif italic for hero display moments only.
- **Do** keep body text at minimum 0.9375rem with 4.5:1 contrast against Stone BG.
- **Do** design every state: empty, loading, error, hover, focus, active, disabled.
- **Do** use `text-wrap: balance` on headings, `text-wrap: pretty` on body.
- **Do** use Moss checkmarks for positive/active states.
- **Do** keep card radius at 16px — curved but not pill-shaped.
- **Do** use `active:translate-y-px` on buttons for tactile press feedback.

### Don't:

- **Don't** use gradient text (`background-clip: text` with gradient). Solid Ember or white only.
- **Don't** use glassmorphism decoratively — no random blurs that don't contain content.
- **Don't** use uppercase tracked eyebrows above every section. One per page is voice; more than one is template grammar.
- **Don't** use the hero-metric template (big number, small label, gradient accent). Stats are inline, not hero blocks.
- **Don't** use identical card grids repeated endlessly. Vary card content patterns.
- **Don't** use side-stripe borders (border-left >1px as accent on cards or list items).
- **Don't** use bounce, elastic, or spring easing curves. Use `ease-out` with exponential curves.
- **Don't** use Inter font. Geist is the UI face; Instrument Serif is the display face.
- **Don't** let text overflow its container. Test heading sizes at every breakpoint.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding.
- **Don't** use all-caps for body copy. Reserve uppercase for short labels and badges.
- **Don't** let body line length exceed 75ch.
