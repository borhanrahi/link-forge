# LinkNest (link-forge)

> **Link-in-bio & URL shortener platform** — shorten URLs, create bio landing pages, generate QR codes, and track every click. Built with FastAPI + Next.js.

---

## What It Is

LinkNest is a full-featured link management platform. It replaces tools like Linktree, Bitly, and QR code generators with a single, self-hosted dashboard.

**Who it's for:** creators, marketers, agencies, and developers who want to own their links and their data.

### Key Features

| Feature | Description |
|---------|-------------|
| **Short Links** | Custom aliases, password-protected, expirable, scheduled, cloaked, UTM-tagged |
| **Bio Pages** | Drag-and-drop block editor with 12 themes, 13 social platforms, custom fonts/colors |
| **A/B Testing** | Weighted-variant short links with per-variant click attribution |
| **Analytics** | Real-time clicks, geo-IP locations, referrers, devices, browsers, time-series |
| **QR Codes** | Branded, downloadable QR codes with custom colors and per-scan tracking |
| **Custom Domains** | Bring your own domain for short links and bio pages (DNS-verified) |
| **Team Workspaces** | Multi-user workspaces with roles, permissions, and member invites |
| **Tags** | Organize links with color-coded workspace tags |
| **UTM Builder** | Saved presets and one-click URL building for campaign tracking |
| **Click Goal Alerts** | Email + in-app notifications when links hit milestone clicks |
| **Notifications** | Real-time in-app notification feed (per-link clicks, billing, invites) |
| **Billing** | Stripe-powered subscriptions (Free / Pro / Business) with invoices and portal |
| **CSV Export** | Export link click data for any range |
| **Bulk Actions** | Archive, restore, delete, import links in bulk |
| **Webhooks** | Generic + Stripe event ingestion and delivery |
| **REST API** | Full programmatic access via API keys with scopes |

---

## Architecture

```
┌──────────┐     ┌──────────┐     ┌────────────┐
│  Next.js │────▶│ FastAPI  │────▶│ PostgreSQL │
│  (React) │     │ (Python) │     │  (Neon)    │
├──────────┤     ├──────────┤     └────────────┘
│ Port 3000│     │ Port 8000│     ┌────────────┐
└──────────┘     ├──────────┤────▶│   Redis    │
                 │   R2 🪣  │     └────────────┘
                 │  Stripe  │────▶┌────────────┐
                 │  Neon    │     │   Resend   │
                 │   Auth   │     │  (Email)   │
                 └──────────┘     └────────────┘
```

### Backend (FastAPI)

- **Framework:** FastAPI with async endpoints, auto-generated OpenAPI docs at `/docs`
- **ORM:** SQLAlchemy 2.0 (async) with Alembic migrations
- **Auth:** Neon Auth — JWKS-based token validation with optional dev bypass
- **API Keys:** `ln_*`-prefixed, SHA-256 hashed, with read/write scopes
- **Cache:** Redis (rate limiting) with in-memory fallback
- **Payments:** Stripe (subscriptions, webhooks, invoices, customer portal)
- **Email:** Resend (transactional emails)
- **Storage:** Cloudflare R2 (avatar uploads, bio page assets)
- **Geo-IP:** MaxMind GeoLite2 (config-driven, currently stubbed)
- **QR:** qrcode + Pillow (PNG rendering)

**23 Routers:** `auth`, `users`, `workspaces`, `links`, `redirect`, `clicks`, `analytics`, `bio_pages`, `bio_public`, `qr_codes`, `custom_domains`, `utm`, `tags`, `ab_tests`, `click_goal_alerts`, `api_keys`, `notifications`, `billing`, `subscriptions`, `webhooks`, `export_import`

**13 Services:** `click_tracker`, `short_code`, `qr_generator`, `geo_ip`, `quota_enforcer`, `billing_manager`, `stripe_service`, `domain_validator`, `email_sender`, `email_service`, `webhook_dispatcher`, `scheduler`

**19 Pydantic Schemas:** `user`, `workspace`, `link`, `click`, `bio_page`, `qr_code`, `custom_domain`, `utm`, `tag`, `ab_test`, `click_goal_alert`, `api_key`, `notification`, `billing`, `subscription`, `analytics`, `auth`, `webhook`, `export`

### Frontend (Next.js)

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5.5
- **Styling:** Tailwind CSS 4 + CVA + `tailwind-merge` + `class-variance-authority`
- **UI Primitives:** `@base-ui/react` (not Radix)
- **State:** Zustand (client auth), TanStack React Query v5 (server)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion + custom animated components
- **Charts:** Recharts (analytics)
- **Auth:** Custom Neon Auth client (JWKS-based)
- **Drag & drop:** `@dnd-kit` (bio page block editor)
- **Toasts:** Sonner
- **Command palette:** `cmdk` (Cmd+K)
- **Icons:** Lucide React
- **QR display:** `qrcode.react`
- **Generated types:** `openapi-typescript`

**Pages (public):** Landing, Features, Pricing, Integrations, API, Product, Blog, About, Careers, Contact, Privacy, Terms, Bio Page (`/b/{slug}`), Short Redirect (`/{shortCode}`)

**Pages (auth):** Login, Register, Forgot Password

**Dashboard:** Overview, Links (+ detail + new), Bio Pages (+ new + editor), QR Codes, Analytics (+ per-link), Domains, Team, Billing (+ Invoices), API Keys, Alerts, A/B Tests (+ detail), Settings

**Power features:** Command palette (Cmd+K), keyboard shortcuts (Ctrl+N new link, Ctrl+B new bio), 30s notification polling, ISR for public bio pages, dark/light theme toggle, onboarding checklist

---

## How the App Works

### URL Shortening Flow

1. User pastes a long URL into the dashboard
2. Backend generates a unique short code (or uses a custom alias)
3. The short link is stored in PostgreSQL with metadata (workspace, tags, UTM params, password, expiration, schedule)
4. When anyone visits `https://linknest.app/s/{code}` (or `/{shortCode}` on backend), the backend:
   - Detects A/B tests and picks a weighted variant
   - Checks expiration (410 Gone) and password protection
   - Records a click event (IP-hash, user-agent, referrer, geo-location, device, bot detection)
   - Increments the link's click counter
   - Creates a notification for the owner
   - Redirects (HTTP 307) to the destination URL
5. Analytics update in real-time on the dashboard (with sparklines on the link list)

### Bio Pages Flow

1. User creates a bio page with a title, subtitle, avatar, and one of 12 themes
2. Adds content blocks (link, heading, text, image, social, embed, video, spacer, divider) via drag-and-drop
3. Customizes: brand color, background color, background image, font family, slug, SEO meta
4. Optionally attaches a custom domain (DNS TXT verified at `_linknest.{domain}`)
5. Optionally enables password protection or schedule-based visibility
6. Publishes — public route `/b/{slug}` server-renders with ISR (revalidate 60s)

### Analytics

- Every click records: timestamp, IP-hash, user-agent, referrer, country/city (geo-IP), device type, browser, bot flag
- Dashboard displays: total clicks, unique visitors, top referrers, geographic breakdown, device breakdown, time-series charts, period-over-period deltas
- Per-link analytics includes sparkline, geo, devices, referrers, and UTM breakdown
- CSV export for any range
- A/B test analytics shows per-variant timeseries + conversion splits

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0 (async), Alembic |
| **Frontend** | Node.js 22+, Next.js 16, React 19, TypeScript 5.5 |
| **Database** | PostgreSQL 16 (via Neon or local) |
| **Cache** | Redis 7 (with in-memory fallback) |
| **Auth** | Neon Auth (JWT / JWKS) + custom API keys |
| **Payments** | Stripe |
| **Email** | Resend |
| **Storage** | Cloudflare R2 (S3-compatible) |
| **Container** | Docker + Docker Compose |

---

## Project Structure

```
link-forge/
├── backend/                                # FastAPI backend
│   ├── app/
│   │   ├── main.py                         # App factory, CORS, lifespan, router registration
│   │   ├── config.py                       # Pydantic settings (env vars)
│   │   ├── database.py                     # SQLAlchemy async engine & session
│   │   ├── models/                         # 21 SQLAlchemy ORM models
│   │   │   ├── user.py                     # User accounts
│   │   │   ├── workspace.py                # Workspaces
│   │   │   ├── workspace_member.py         # Workspace membership & roles
│   │   │   ├── link.py                     # Short links (with custom alias, password, expiration, scheduling)
│   │   │   ├── click.py                    # Click events
│   │   │   ├── bio_page.py                 # Bio landing pages
│   │   │   ├── bio_block.py                # Bio page content blocks
│   │   │   ├── qr_code.py                  # QR code records
│   │   │   ├── custom_domain.py            # Custom domain mappings
│   │   │   ├── tag.py                      # Workspace tags
│   │   │   ├── link_tag.py                 # Link↔Tag many-to-many
│   │   │   ├── ab_test.py                  # A/B test container
│   │   │   ├── ab_test_variant.py          # A/B test variant (weighted)
│   │   │   ├── utm_preset.py               # UTM parameter presets
│   │   │   ├── subscription.py             # Stripe subscription plans
│   │   │   ├── invoice.py                  # Stripe invoices
│   │   │   ├── feature_usage.py            # Quota tracking (per workspace per period)
│   │   │   ├── api_key.py                  # Hashed API keys with scopes
│   │   │   ├── click_goal_alert.py         # Click milestone alerts
│   │   │   ├── notification.py             # In-app notifications
│   │   │   └── webhook_event.py            # Webhook event log
│   │   ├── schemas/                        # 19 Pydantic request/response schemas
│   │   ├── routers/                        # 23 API route handlers
│   │   │   ├── auth.py                     # Neon Auth callback, dev login
│   │   │   ├── users.py                    # User profile
│   │   │   ├── workspaces.py               # Workspace CRUD, member mgmt
│   │   │   ├── links.py                    # Link CRUD, bulk, search, tag attach
│   │   │   ├── redirect.py                 # `/{shortCode}` redirect engine (A/B, expiration, password)
│   │   │   ├── clicks.py                   # Click listing
│   │   │   ├── analytics.py                # Aggregated stats, exports
│   │   │   ├── bio_pages.py                # Bio page CRUD, blocks
│   │   │   ├── bio_public.py               # Public bio page fetcher
│   │   │   ├── qr_codes.py                 # QR generation, download
│   │   │   ├── custom_domains.py           # Domain verification
│   │   │   ├── utm.py                      # UTM presets, URL builder
│   │   │   ├── tags.py                     # Tag CRUD
│   │   │   ├── ab_tests.py                 # A/B test CRUD, analytics
│   │   │   ├── click_goal_alerts.py        # Milestone alerts
│   │   │   ├── api_keys.py                 # API key CRUD
│   │   │   ├── notifications.py            # Notification feed
│   │   │   ├── billing.py                  # Stripe checkout, portal
│   │   │   ├── subscriptions.py            # Plan mgmt
│   │   │   ├── webhooks.py                 # Stripe + generic webhooks
│   │   │   └── export_import.py            # JSON export, CSV import
│   │   ├── services/                       # 12 business logic services
│   │   │   ├── short_code.py               # Unique short code generation
│   │   │   ├── click_tracker.py            # Click recording, dedup, bot detection
│   │   │   ├── geo_ip.py                   # GeoIP lookups (MaxMind)
│   │   │   ├── qr_generator.py             # QR code image generation (PNG)
│   │   │   ├── quota_enforcer.py           # Per-plan usage quota checks
│   │   │   ├── billing_manager.py          # Stripe billing logic (with dummy mode)
│   │   │   ├── stripe_service.py           # Stripe SDK wrapper
│   │   │   ├── domain_validator.py         # DNS TXT verification
│   │   │   ├── email_sender.py             # Console/Resend integration
│   │   │   ├── email_service.py            # High-level email templates
│   │   │   ├── webhook_dispatcher.py       # Outbound webhook delivery
│   │   │   └── scheduler.py                # Scheduled tasks (expiration, etc.)
│   │   ├── dependencies/                   # FastAPI dependency injection
│   │   │   ├── auth.py                     # JWT + API key resolution
│   │   │   ├── db.py                       # DB session
│   │   │   ├── neon_auth.py                # Neon Auth JWKS validation
│   │   │   ├── permissions.py              # Role-based access
│   │   │   ├── rate_limit.py               # Redis-backed rate limiting
│   │   │   └── workspace.py                # Active workspace resolution
│   │   └── utils/
│   │       ├── exceptions.py               # Custom exception classes
│   │       └── validators.py               # URL & domain validators
│   ├── alembic/                            # Database migrations
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/                               # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx                      # Root layout (fonts, providers)
│   │   ├── page.tsx                        # Landing page
│   │   ├── providers.tsx                   # React context providers
│   │   ├── globals.css                     # Tailwind CSS + theme
│   │   ├── (public)/                       # Public short-link redirect proxy
│   │   │   ├── [shortCode]/page.tsx        # Server-side redirect with manual fetch
│   │   │   └── b/[slug]/page.tsx           # Public bio page (SSR + ISR 60s)
│   │   ├── (auth)/                         # Auth pages
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── dashboard/                      # Protected dashboard
│   │   │   ├── page.tsx                    # Overview
│   │   │   ├── layout.tsx                  # Sidebar + header + command palette
│   │   │   ├── links/
│   │   │   │   ├── page.tsx                # List + bulk actions + search
│   │   │   │   ├── new/page.tsx            # Create link
│   │   │   │   └── [id]/page.tsx           # Link detail
│   │   │   ├── bio-pages/
│   │   │   │   ├── page.tsx                # Grid
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx           # 3-column editor (blocks, design, preview)
│   │   │   ├── analytics/
│   │   │   │   ├── page.tsx                # Workspace dashboard
│   │   │   │   └── [linkId]/page.tsx       # Per-link deep analytics
│   │   │   ├── qr-codes/page.tsx
│   │   │   ├── domains/page.tsx
│   │   │   ├── team/page.tsx               # Workspaces & members
│   │   │   ├── billing/
│   │   │   │   ├── page.tsx                # Plans + checkout
│   │   │   │   └── invoices/page.tsx
│   │   │   ├── api-keys/page.tsx
│   │   │   ├── alerts/page.tsx             # Click goal alerts
│   │   │   ├── ab-tests/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── features/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── integrations/page.tsx
│   │   ├── about/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── careers/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── api/page.tsx                    # REST API docs
│   │   ├── product/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── components/
│   │   ├── ui/                             # 27 shadcn-on-base-ui primitives
│   │   │   ├── animated.tsx                # Marquee, Particles, GradientBorder, ShimmerButton,
│   │   │   │                               #   WobbleCard, FlipWords, Accordion, Spotlight,
│   │   │   │                               #   AnimatedCounter, TextReveal, HoverCard, etc.
│   │   │   ├── button.tsx, card.tsx, dialog.tsx, sheet.tsx, sidebar.tsx, tabs.tsx,
│   │   │   ├── table.tsx, command.tsx, popover.tsx, dropdown-menu.tsx, switch.tsx,
│   │   │   ├── badge.tsx, avatar.tsx, tooltip.tsx, input.tsx, textarea.tsx, select.tsx,
│   │   │   ├── separator.tsx, progress.tsx, skeleton.tsx
│   │   │   ├── copy-button.tsx, search-input.tsx, status-badge.tsx, sparkline.tsx,
│   │   │   └── input-group.tsx
│   │   ├── layout/                         # AppSidebar (11 nav items), AppHeader, PublicHeader
│   │   ├── forms/                          # Form helpers
│   │   ├── charts/analytics-charts.tsx     # ClicksAreaChart, DevicePieChart,
│   │   │                                   #   ReferrerBarChart, GeoBarChart
│   │   ├── bio/                            # BioPagePreview, BlockEditor, rendering
│   │   ├── command-palette.tsx             # Cmd+K navigation
│   │   ├── onboarding-checklist.tsx        # 4-step first-run guide
│   │   ├── link-select.tsx                 # Link picker (used in QR + bio blocks)
│   │   └── theme-toggle.tsx                # Dark/light switch
│   ├── lib/
│   │   ├── api-client.ts                   # Fetch wrapper with auth + workspace headers
│   │   ├── auth-client.ts                  # Re-exports neon-auth
│   │   ├── auth-store.ts                   # Zustand auth store
│   │   ├── neon-auth.ts                    # Custom Neon Auth REST client
│   │   ├── bio-templates.ts                # 12 bio page themes
│   │   ├── constants.ts                    # PLANS, THEMES, FONTS, BLOCK_TYPES
│   │   └── utils.ts                        # Helpers (cn, formatters, etc.)
│   ├── hooks/
│   │   ├── index.ts                        # 50+ react-query hooks
│   │   ├── use-keyboard-shortcut.ts        # Ctrl+N, Ctrl+B, Cmd+K
│   │   └── use-mobile.ts                   # Viewport detection
│   ├── types/
│   │   └── generated.ts                    # Auto-generated types (openapi-typescript)
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── components.json                     # shadcn config (base-nova style)
│   ├── package.json
│   ├── Dockerfile
│   └── .env.local
├── docker-compose.yml                      # Full-stack Docker Compose
└── README.md
```

---

## Setup

### Prerequisites

- **Python 3.11+**
- **Node.js 22+** (for frontend dev)
- **PostgreSQL 16** (or use Docker)
- **Redis 7** (optional — falls back to in-memory)
- **Docker** (optional, for containerized setup)

### Option 1: Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/your-org/link-forge.git
cd link-forge

# Start everything
docker compose up --build
```

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000       |
| Backend   | http://localhost:8000       |
| API Docs  | http://localhost:8000/docs  |
| Postgres  | localhost:5432              |
| Redis     | localhost:6379              |

### Option 2: Local Development

#### 1. Start Dependencies

```bash
# Using Docker for Postgres & Redis (recommended)
docker run -d --name linknest-postgres \
  -e POSTGRES_USER=linknest \
  -e POSTGRES_PASSWORD=linknest \
  -e POSTGRES_DB=linknest \
  -p 5432:5432 postgres:16-alpine

docker run -d --name linknest-redis \
  -p 6379:6379 redis:7-alpine
```

#### 2. Backend

```bash
cd backend

# Virtual environment
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
# source .venv/Scripts/activate  # Windows (Git Bash)

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env if needed (defaults work for local Docker deps)

# Run migrations
alembic upgrade head

# Start backend
uvicorn app.main:app --reload --port 8000
```

Backend at **http://localhost:8000** — API docs at **http://localhost:8000/docs**.

#### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# NEXT_PUBLIC_API_URL defaults to http://localhost:8000
# Edit .env.local if needed

# Start dev server
npm run dev
```

Frontend at **http://localhost:3000**.

---

## Configuration

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | Neon URL | PostgreSQL connection string (asyncpg) |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection string (in-memory fallback if unreachable) |
| `FRONTEND_URL` | No | `http://localhost:3000` | CORS origin |
| `SECRET_KEY` | No | — | Signing key (not used with Neon Auth) |
| `NEON_AUTH_URL` | Yes | — | Neon Auth JWKS endpoint |
| `NEON_AUTH_AUDIENCE` | No | — | Expected JWT audience claim |
| `DEV_AUTH_BYPASS` | No | `False` | Skip JWKS validation; use `X-User-Email` header |
| `R2_ENDPOINT` | No | — | Cloudflare R2 endpoint |
| `R2_ACCESS_KEY_ID` | No | — | R2 access key |
| `R2_SECRET_ACCESS_KEY` | No | — | R2 secret key |
| `R2_BUCKET_NAME` | No | `linknest-assets` | R2 bucket |
| `R2_PUBLIC_URL` | No | — | R2 public CDN URL |
| `STRIPE_SECRET_KEY` | No | — | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | No | — | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | No | — | Stripe price ID for Pro plan |
| `STRIPE_BUSINESS_PRICE_ID` | No | — | Stripe price ID for Business plan |
| `STRIPE_DUMMY_MODE` | No | `False` | Skip real Stripe calls (instant-activate) |
| `RESEND_API_KEY` | No | — | Resend API key for email |
| `EMAIL_FROM` | No | `LinkNest <noreply@linknest.app>` | Sender email address |
| `GEOLITE_DB_PATH` | No | `./GeoLite2-City.mmdb` | MaxMind GeoIP database path |
| `RATE_LIMIT_PER_MIN` | No | `60` | Default per-user rate limit |

### Frontend (.env.local)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `http://localhost:8000`) |
| `NEXT_PUBLIC_DEV_AUTH` | Set to `1` to enable dev-mode `X-User-Email` header auth |

---

## API Overview

The backend exposes a REST API at `http://localhost:8000/api/...` (or directly at http://localhost:8000). Interactive docs are at `/docs` (Swagger UI) and `/redoc` (ReDoc).

| Router | Prefix | Description |
|--------|--------|-------------|
| `auth` | `/auth/*` | Neon Auth callback, dev login, magic link |
| `users` | `/users/*` | User profile, settings, avatar |
| `workspaces` | `/workspaces/*` | Workspace CRUD, member management, roles |
| `links` | `/links/*` | Short link CRUD, bulk import, tag attach, archive |
| `redirect` | `/{shortCode}` | Public redirect engine (A/B, expiration, password) |
| `clicks` | `/clicks/*` | Click event listing |
| `analytics` | `/analytics/*` | Aggregated stats, sparklines, CSV export |
| `bio_pages` | `/bio-pages/*` | Bio page CRUD, block CRUD, publish toggle |
| `bio_public` | `/bio/public/*` | Public bio page fetcher (JSON for SSR) |
| `qr_codes` | `/qr-codes/*` | QR code generation, regeneration, PNG download |
| `custom_domains` | `/custom-domains/*` | Domain add / verify / delete |
| `utm` | `/utm/*` | UTM preset CRUD, URL builder |
| `tags` | `/tags/*` | Workspace tag CRUD |
| `ab_tests` | `/ab-tests/*` | A/B test CRUD, toggle, per-variant analytics |
| `click_goal_alerts` | `/click-goal-alerts/*` | Click milestone alerts |
| `api_keys` | `/api-keys/*` | API key generate, list, revoke |
| `notifications` | `/notifications/*` | Notification feed, mark read |
| `billing` | `/billing/*` | Stripe checkout, customer portal, invoices |
| `subscriptions` | `/subscriptions/*` | Current plan, plan list, dummy activate |
| `webhooks` | `/webhooks/*` | Stripe + generic webhook ingestion |
| `export_import` | `/export/*`, `/import/*` | JSON workspace export, CSV link import |

---

## Database Models (21)

| Model | Table | Purpose |
|-------|-------|---------|
| `User` | `users` | User accounts (synced from Neon Auth) |
| `Workspace` | `workspaces` | Team/organization workspaces |
| `WorkspaceMember` | `workspace_members` | User-workspace membership with roles |
| `Link` | `links` | Shortened URLs with metadata, password, expiration |
| `Click` | `clicks` | Individual click events with geo + device data |
| `BioPage` | `bio_pages` | Bio landing page configurations |
| `BioBlock` | `bio_blocks` | Ordered content blocks on bio pages |
| `QRCode` | `qr_codes` | Generated QR code records with scan counts |
| `CustomDomain` | `custom_domains` | Custom domain DNS mappings (TXT-verified) |
| `Tag` | `tags` | Workspace tags (with color) |
| `LinkTag` | `link_tags` | Link↔Tag many-to-many |
| `UTMPreset` | `utm_presets` | Saved UTM parameter templates |
| `ABTest` | `ab_tests` | A/B test container (active/paused) |
| `ABTestVariant` | `ab_test_variants` | A/B test variants with weight |
| `Subscription` | `subscriptions` | Stripe subscription plans |
| `Invoice` | `invoices` | Synced Stripe invoices |
| `FeatureUsage` | `feature_usage` | Per-workspace quota counters (monthly period) |
| `APIKey` | `api_keys` | SHA-256-hashed API keys with scopes |
| `ClickGoalAlert` | `click_goal_alerts` | Per-link click milestone alerts |
| `Notification` | `notifications` | In-app notification feed |
| `WebhookEvent` | `webhook_events` | Outbound webhook delivery log |

---

## Scripts

### Backend

```bash
# Run migrations
alembic upgrade head

# Create a new migration
alembic revision --autogenerate -m "description"

# Run tests
pytest

# Dev server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Lint check
npm run type-check # TypeScript check
```

---

## Plans & Quotas

| Plan | Price | Links | Bio Pages | QR Codes | Custom Domains | Team Seats |
|------|-------|-------|-----------|----------|----------------|------------|
| **Free** | $0 | 25 | 3 | 10 | 0 | 1 |
| **Pro** | $19/mo | 500 | 20 | 200 | 5 | 5 |
| **Business** | $49/mo | Unlimited | Unlimited | Unlimited | Unlimited | Unlimited |

Plan limits are enforced server-side via the `quota_enforcer` service and the `feature_usage` table (monthly period).

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

[MIT](LICENSE)
