# LinkNest — Link-in-Bio & URL Shortener Platform

> Production-grade full-stack spec for a Next.js + FastAPI SaaS. Monetized, multi-tenant, Instagram/TikTok-ready. PostgreSQL (Neon) backend. No AI dependencies.

---

## 1. Product Overview

LinkNest is a creator-first link-in-bio platform combined with a powerful URL shortener and analytics engine. Target users are influencers, content creators, e-commerce sellers, and small brands who need one hub for all their links — with data on what actually gets clicked.

**Core Value Props:**
- Beautiful, fast-loading bio pages optimized for Instagram/TikTok traffic
- Branded short links with detailed click analytics
- Monetization tools (tip jar, affiliate tracking, sponsored blocks)
- Team workspaces for agencies and brands

---

## 2. Monorepo Folder Structure

```
linknest/
├── backend/                          # FastAPI (Python)
│   ├── alembic/
│   │   └── versions/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app factory, CORS, middleware
│   │   ├── config.py                 # Pydantic Settings, env validation
│   │   ├── database.py               # Async SQLAlchemy engine + session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── workspace.py
│   │   │   ├── workspace_member.py
│   │   │   ├── link.py
│   │   │   ├── click.py
│   │   │   ├── bio_page.py
│   │   │   ├── bio_block.py
│   │   │   ├── custom_domain.py
│   │   │   ├── qr_code.py
│   │   │   ├── utm_preset.py
│   │   │   ├── subscription.py       # Stripe subscription tracking
│   │   │   ├── invoice.py            # Billing records
│   │   │   ├── feature_usage.py      # Quota tracking per tier
│   │   │   └── webhook_event.py      # Stripe + outgoing webhooks
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── workspace.py
│   │   │   ├── link.py
│   │   │   ├── click.py
│   │   │   ├── bio_page.py
│   │   │   ├── bio_block.py
│   │   │   ├── analytics.py
│   │   │   ├── qr_code.py
│   │   │   ├── custom_domain.py
│   │   │   ├── utm.py
│   │   │   ├── subscription.py
│   │   │   ├── billing.py
│   │   │   └── webhook.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py               # Register, login, OAuth, JWT refresh
│   │   │   ├── users.py              # Profile, password, avatar
│   │   │   ├── workspaces.py         # Team CRUD, invites, roles
│   │   │   ├── links.py              # Short link CRUD
│   │   │   ├── clicks.py             # Redirect + click logging
│   │   │   ├── analytics.py          # Charts, exports, real-time
│   │   │   ├── bio_pages.py          # Bio page builder CRUD
│   │   │   ├── bio_public.py         # Public bio page renderer (HTML/JSON)
│   │   │   ├── qr_codes.py           # QR generation, download
│   │   │   ├── custom_domains.py     # Add, verify, manage domains
│   │   │   ├── utm.py                # Builder + presets
│   │   │   ├── billing.py            # Stripe checkout, portal, invoices
│   │   │   ├── subscriptions.py      # Plan details, upgrade/downgrade
│   │   │   └── webhooks.py           # Stripe + user-defined webhooks
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── short_code.py         # Base62 + collision detection
│   │   │   ├── geo_ip.py             # IP → City/Country via GeoLite2
│   │   │   ├── click_tracker.py      # Async click logging pipeline
│   │   │   ├── qr_generator.py       # qrcode + Pillow + SVG overlay
│   │   │   ├── domain_validator.py   # DNS TXT/CNAME verification
│   │   │   ├── billing_manager.py    # Stripe integration wrapper
│   │   │   ├── quota_enforcer.py     # Feature limit checks per tier
│   │   │   ├── email_sender.py       # Transactional email (Resend)
│   │   │   └── scheduler.py          # Cron-like cleanup + reports
│   │   ├── dependencies/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py               # JWT decode + user injection
│   │   │   ├── db.py                 # Async session injection
│   │   │   ├── workspace.py          # Active workspace injection
│   │   │   ├── permissions.py        # Role-based access control
│   │   │   └── rate_limit.py         # Redis sliding window limits
│   │   └── utils/
│   │       ├── exceptions.py
│   │       └── validators.py
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── requirements.txt
│   ├── alembic.ini
│   └── pyproject.toml
│
├── frontend/                         # Next.js 16+ (TypeScript)
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx            # Shell: sidebar + header
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── links/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── analytics/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [linkId]/page.tsx
│   │   │   ├── bio-pages/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── qr-codes/
│   │   │   │   └── page.tsx
│   │   │   ├── domains/
│   │   │   │   └── page.tsx
│   │   │   ├── billing/
│   │   │   │   ├── page.tsx          # Plans + current subscription
│   │   │   │   └── invoices/page.tsx
│   │   │   ├── team/
│   │   │   │   └── page.tsx          # Workspace members + invites
│   │   │   └── settings/
│   │   │       └── page.tsx          # Profile, security, export
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (public)/
│   │   │   ├── [shortCode]/page.tsx  # Redirect handler
│   │   │   └── b/[slug]/page.tsx     # Public bio page
│   │   ├── (landing)/
│   │   │   ├── page.tsx              # Marketing homepage
│   │   │   ├── pricing/page.tsx
│   │   │   └── features/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── forms/
│   │   ├── charts/
│   │   ├── bio-editor/               # Bio page visual editor
│   │   ├── modals/
│   │   └── layout/
│   ├── hooks/
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── generated.ts
│   └── public/
│
├── docker-compose.yml
├── README.md
└── .github/workflows/ci.yml
```

---

## 3. Database Schema (PostgreSQL)

```sql
-- Users
create table users (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) not null unique,
    password_hash varchar(255),
    full_name varchar(255),
    avatar_url text,
    email_verified boolean default false,
    onboarding_completed boolean default false,
    stripe_customer_id varchar(255),
    default_workspace_id uuid,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Workspaces (Teams)
create table workspaces (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    slug varchar(100) not null unique,
    owner_id uuid not null references users(id),
    plan varchar(20) default 'free' not null,   -- free, pro, business
    branding_enabled boolean default false,
    custom_colors_enabled boolean default false,
    referral_code varchar(50) unique,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Workspace Members
create table workspace_members (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    role varchar(20) default 'member' not null,   -- owner, admin, editor, viewer
    invited_by uuid references users(id),
    invite_status varchar(20) default 'active',   -- active, pending
    joined_at timestamptz default now(),
    unique (workspace_id, user_id)
);

-- Links
create table links (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    user_id uuid not null references users(id),
    original_url text not null,
    short_code varchar(20) not null unique,
    custom_alias varchar(50) unique,
    title varchar(255),
    password_hash varchar(255),
    clicks_count bigint default 0,
    unique_clicks_count bigint default 0,
    is_active boolean default true,
    is_cloaked boolean default false,
    expires_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Clicks
create table clicks (
    id uuid primary key default gen_random_uuid(),
    link_id uuid not null references links(id) on delete cascade,
    ip_address inet,
    ip_hash varchar(64),               -- hashed IP for unique click counting
    country_code varchar(2),
    city varchar(100),
    user_agent text,
    device_type varchar(50),           -- mobile, desktop, tablet, bot
    browser varchar(50),
    os varchar(50),
    referrer text,
    utm_source varchar(100),
    utm_medium varchar(100),
    utm_campaign varchar(200),
    utm_content varchar(200),
    utm_term varchar(200),
    clicked_at timestamptz default now()
);

-- Bio Pages
create table bio_pages (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    user_id uuid not null references users(id),
    slug varchar(100) not null unique,
    title varchar(255),
    subtitle text,
    profile_image_url text,
    theme varchar(50) default 'minimal',
    brand_color varchar(7) default '#000000',
    bg_color varchar(7) default '#ffffff',
    bg_image_url text,
    font_family varchar(50) default 'inter',
    meta_title varchar(255),
    meta_description text,
    og_image_url text,
    is_published boolean default false,
    password_hash varchar(255),
    seo_indexable boolean default true,
    clicks_count bigint default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Bio Blocks
create table bio_blocks (
    id uuid primary key default gen_random_uuid(),
    bio_page_id uuid not null references bio_pages(id) on delete cascade,
    block_type varchar(50) not null,       -- link, social, text, image, video, divider, tip_jar, embed
    label varchar(255),
    url text,
    icon varchar(50),
    image_url text,
    video_url text,
    embed_html text,
    position int not null default 0,
    visible_from timestamptz,
    visible_until timestamptz,
    is_active boolean default true,
    click_tracking_enabled boolean default true,
    clicks_count bigint default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Custom Domains
create table custom_domains (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    domain varchar(255) not null unique,
    status varchar(20) default 'pending',
    verification_txt varchar(255),
    ssl_active boolean default false,
    default_bio_page_id uuid references bio_pages(id) on delete set null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- QR Codes
create table qr_codes (
    id uuid primary key default gen_random_uuid(),
    link_id uuid not null references links(id) on delete cascade,
    color_fg varchar(7) default '#000000',
    color_bg varchar(7) default '#ffffff',
    logo_url text,
    format varchar(10) default 'png',
    file_path text,
    scan_count bigint default 0,
    created_at timestamptz default now()
);

-- UTM Presets
create table utm_presets (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    name varchar(100) not null,
    utm_source varchar(100),
    utm_medium varchar(100),
    utm_campaign varchar(200),
    utm_content varchar(200),
    utm_term varchar(200),
    created_at timestamptz default now()
);

-- Subscriptions (Stripe Mirror)
create table subscriptions (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    stripe_subscription_id varchar(255) unique,
    stripe_price_id varchar(255),
    status varchar(50) default 'incomplete',   -- active, canceled, past_due, unpaid
    plan varchar(20) not null,                 -- pro, business
    current_period_start timestamptz,
    current_period_end timestamptz,
    cancel_at_period_end boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Invoices
create table invoices (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    stripe_invoice_id varchar(255) unique,
    amount_due int not null,               -- cents
    amount_paid int not null,
    currency varchar(3) default 'usd',
    status varchar(50),                    -- draft, open, paid, void, uncollectible
    pdf_url text,
    invoice_date timestamptz,
    created_at timestamptz default now()
);

-- Feature Usage (Quota Tracking)
create table feature_usage (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    feature varchar(50) not null,          -- links, bio_pages, custom_domains, team_members
    usage_count bigint default 0,
    period_start timestamptz,                -- monthly reset
    period_end timestamptz,
    unique (workspace_id, feature, period_start)
);

-- Webhook Events (Audit)
create table webhook_events (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references workspaces(id) on delete set null,
    event_type varchar(100) not null,        -- stripe.payment_intent.succeeded, etc.
    payload jsonb,
    processed boolean default false,
    created_at timestamptz default now()
);

-- Indexes
 create index idx_links_short_code on links(short_code);
 create index idx_links_workspace_id on links(workspace_id);
 create index idx_clicks_link_id on clicks(link_id);
 create index idx_clicks_clicked_at on clicks(clicked_at);
 create index idx_clicks_ip_hash on clicks(ip_hash);
 create index idx_clicks_country_code on clicks(country_code);
 create index idx_bio_blocks_page_id on bio_blocks(bio_page_id);
 create index idx_bio_pages_slug on bio_pages(slug);
 create index idx_bio_pages_workspace_id on bio_pages(workspace_id);
 create index idx_custom_domains_domain on custom_domains(domain);
 create index idx_subscriptions_workspace_id on subscriptions(workspace_id);
 create index idx_invoices_workspace_id on invoices(workspace_id);
```

---

## 4. Pricing Tiers

### Free
**$0/month** — For individuals getting started
- 10 short links
- 1 bio page
- Basic click analytics (last 7 days)
- LinkNest branded domain (`nest.ln/your-code`)
- Standard QR codes

### Pro
**$9/month** — For growing creators
- Unlimited short links
- 3 bio pages
- Full analytics (unlimited history, geo, devices, referrers)
- Custom domain (1 domain)
- Custom bio page colors & themes
- Password-protected links
- UTM builder + presets
- Branded QR codes (custom colors + logo)
- Link scheduling & expiration
- Export data as CSV

### Business
**$29/month** — For brands & agencies
- Everything in Pro
- Unlimited bio pages
- 5 custom domains
- Team workspaces (up to 10 members)
- Role-based access (Owner, Admin, Editor, Viewer)
- Bio page password protection
- Webhook events (Zapier/Make integration)
- Priority email support
- White-label QR codes (no LinkNest branding)
- API access (programmatic link creation)

### Enterprise
**Custom pricing** — For large organizations
- Everything in Business
- Unlimited team members
- Unlimited custom domains
- Dedicated support
- SLA guarantee
- SSO / SAML
- Custom contracts & invoicing

---

## 5. Core Features

### 5.1 Authentication & Identity
- Email/password with bcrypt
- JWT access (15 min) + refresh (7 days) in HTTP-only cookies
- Magic link login (passwordless)
- OAuth: Google, GitHub, Twitter/X
- Email verification required before creating links
- Onboarding flow: choose use-case (creator, brand, agency)
- Profile with avatar upload (R2/S3)

### 5.2 Workspace System
- Every user gets a personal workspace on signup
- Create additional workspaces (Business plan)
- Invite members by email with role assignment
- Role permissions:
  - **Owner:** Full control, billing, delete workspace
  - **Admin:** Manage members, edit all links/pages
  - **Editor:** Create/edit own + shared links/pages
  - **Viewer:** Read-only access to analytics
- Workspace switching header in dashboard

### 5.3 URL Shortener Engine
- Base62 short codes from sequential IDs
- Custom aliases with availability check
- Destination validation (HEAD request, blocklist)
- Device targeting (mobile → app store, desktop → web)
- Link expiration with auto-archive
- Password protection on redirect
- Cloaking/preview page toggle
- Bulk link creation via CSV upload (Pro+)
- Link archive/restore instead of hard delete

### 5.4 Bio Page Builder
- **Profile block:** Avatar, name, subtitle, verified badge
- **Link blocks:** Standard links with icons, thumbnails
- **Social blocks:** Instagram, TikTok, YouTube, X, Twitch pre-styled icons
- **Embed blocks:** TikTok video embed, YouTube embed, Spotify playlist
- **Tip jar block:** Stripe/PayPal donate button integration
- **Divider & text blocks:** Spacing and section headers
- **Schedule blocks:** Show/hide based on date ranges
- **Themes:** Minimal, Dark, Gradient, Glass, Card, Neon
- **Fonts:** Inter, Poppins, Playfair Display, Roboto Mono
- **Layouts:** Stack, Grid (2-col), Featured (hero card)
- **SEO:** Custom meta title, description, OG image per page
- **Privacy:** Password-protect entire bio page
- **Analytics:** Per-block click tracking

### 5.5 Click Analytics
- **Redirect logging:** IP, geo, device, browser, referrer, UTM
- **Unique clicks:** Deduplicated by hashed IP per 24h window
- **Dashboard charts:** Line (clicks over time), Bar (top links), Map (geo), Pie (devices)
- **Date filtering:** Today, 7 days, 30 days, 90 days, custom range
- **Export:** CSV of raw clicks, CSV of aggregated summaries
- **Real-time:** WebSocket or polling for last-hour activity
- **Comparison:** Compare two links side-by-side

### 5.6 QR Code System
- Auto-generated per link
- Custom colors (foreground, background, center eye)
- Logo overlay (upload or pick from gallery)
- Download PNG, SVG
- Print-ready high-resolution export (Business)
- Scan analytics (if scanned via in-app camera)

### 5.7 Custom Domains
- Add any domain you own
- DNS verification instructions (CNAME or TXT)
- Automatic SSL via Cloudflare or Let's Encrypt
- Domain connects to default bio page or specific link
- Multi-domain support per workspace (Business)

### 5.8 UTM Builder
- Predefined presets for major platforms
- Real-time URL preview
- Validation: lowercase, no spaces, length limits
- Save presets for reuse
- Auto-tag shared links with workspace default UTM

### 5.9 Billing & Subscriptions
- Stripe Checkout integration
- Customer portal for self-service (upgrade, downgrade, cancel)
- Invoice history with PDF download
- Webhook handling for subscription events
- Graceful downgrade: excess links/pages become read-only
- Usage warnings at 80% of quota

### 5.10 Webhooks
- **Stripe webhooks:** Invoice paid, subscription canceled, etc.
- **User webhooks (Business):** Send link click events to Zapier/Make
- **Event types:** link.created, link.clicked, bio_page.viewed

### 5.11 API (Business Plan)
- REST API with API key authentication
- Endpoints: Create link, Get analytics, List bio pages
- Rate limit: 100 req/min per key
- Auto-generated docs from OpenAPI

---

## 6. API Route Map

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /auth/register | Public | Create account + personal workspace |
| POST | /auth/login | Public | Email/password |
| POST | /auth/refresh | Public | Refresh access token |
| POST | /auth/logout | Auth | Invalidate tokens |
| POST | /auth/magic-link | Public | Send magic link email |
| POST | /auth/oauth/{provider} | Public | Google/GitHub/X OAuth callback |
| POST | /auth/forgot-password | Public | Reset token email |
| POST | /auth/reset-password | Public | Confirm reset |

### User & Profile
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /me | Auth | Current user + active workspace |
| PATCH | /me | Auth | Update profile |
| POST | /me/avatar | Auth | Upload avatar |

### Workspaces
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /workspaces | Auth | List my workspaces |
| POST | /workspaces | Auth | Create new workspace |
| GET | /workspaces/{id} | Auth | Workspace details |
| PATCH | /workspaces/{id} | Auth | Update name/settings |
| DELETE | /workspaces/{id} | Auth | Delete workspace |
| POST | /workspaces/{id}/invite | Auth | Invite member by email |
| GET | /workspaces/{id}/members | Auth | List members |
| PATCH | /workspaces/{id}/members/{user_id} | Auth | Change role |
| DELETE | /workspaces/{id}/members/{user_id} | Auth | Remove member |
| POST | /workspaces/{id}/switch | Auth | Set as active workspace |

### Links
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /links | Auth | List workspace links (search, filter, paginate) |
| POST | /links | Auth | Create short link |
| GET | /links/{id} | Auth | Link detail + stats |
| PATCH | /links/{id} | Auth | Edit destination, alias, settings |
| DELETE | /links/{id} | Auth | Archive link |
| POST | /links/{id}/restore | Auth | Unarchive |
| POST | /links/bulk | Auth | CSV bulk upload |

### Clicks & Redirects
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /{shortCode} | Public | Log click, redirect to destination |
| GET | /b/{slug} | Public | Render bio page |

### Analytics
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /analytics/dashboard | Auth | Workspace-level summary |
| GET | /analytics/{link_id} | Auth | Single link overview |
| GET | /analytics/{link_id}/timeseries | Auth | Clicks by day/week/month |
| GET | /analytics/{link_id}/geo | Auth | Country/city breakdown |
| GET | /analytics/{link_id}/devices | Auth | Device, OS, browser |
| GET | /analytics/{link_id}/referrers | Auth | Top referrers |
| GET | /analytics/export | Auth | Download CSV |

### Bio Pages
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /bio-pages | Auth | List workspace bio pages |
| POST | /bio-pages | Auth | Create bio page |
| GET | /bio-pages/{id} | Auth | Detail with blocks |
| PATCH | /bio-pages/{id} | Auth | Update meta + theme |
| DELETE | /bio-pages/{id} | Auth | Delete |
| POST | /bio-pages/{id}/publish | Auth | Toggle publish |
| POST | /bio-pages/{id}/blocks | Auth | Add block |
| PATCH | /bio-pages/{id}/blocks/{block_id} | Auth | Update block |
| DELETE | /bio-pages/{id}/blocks/{block_id} | Auth | Remove block |
| PATCH | /bio-pages/{id}/reorder | Auth | Reorder positions |

### QR Codes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /qr/{link_id} | Public | Download QR image |
| POST | /qr/{link_id}/regenerate | Auth | Regenerate with new colors/logo |

### Domains
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /domains | Auth | List custom domains |
| POST | /domains | Auth | Add domain |
| GET | /domains/{id}/verify | Auth | Check DNS verification |
| DELETE | /domains/{id} | Auth | Remove |

### UTM
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /utm/presets | Auth | List presets |
| POST | /utm/presets | Auth | Save preset |
| DELETE | /utm/presets/{id} | Auth | Delete preset |
| POST | /utm/build | Auth | Validate + construct URL |

### Billing
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /billing/plans | Auth | Available plans + current subscription |
| POST | /billing/checkout | Auth | Stripe Checkout session |
| POST | /billing/portal | Auth | Stripe Customer Portal |
| GET | /billing/invoices | Auth | Invoice history |
| POST | /webhooks/stripe | Public | Stripe webhook handler |

---

## 7. Frontend Page Map

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | Public | Marketing landing page |
| `/pricing` | Public | Plan comparison with feature matrix |
| `/features` | Public | Feature highlights |
| `/login` | Public | Login + OAuth |
| `/register` | Public | Sign up |
| `/forgot-password` | Public | Password reset |
| `/` (dashboard) | Auth | Dashboard overview, KPIs, quick actions |
| `/links` | Auth | Link table with search, filters, bulk actions |
| `/links/[id]` | Auth | Link detail editor, QR download, analytics mini-view |
| `/analytics` | Auth | Workspace-level charts and trends |
| `/analytics/[linkId]` | Auth | Deep-dive single link analytics |
| `/bio-pages` | Auth | Bio page grid, create button |
| `/bio-pages/[id]` | Auth | Drag-drop visual editor with live preview |
| `/qr-codes` | Auth | QR listing and bulk download |
| `/domains` | Auth | Domain management + DNS status |
| `/team` | Auth | Invite members, manage roles |
| `/billing` | Auth | Current plan, upgrade button, usage meter |
| `/billing/invoices` | Auth | Invoice list with PDF download |
| `/settings` | Auth | Profile, security, API keys, data export |
| `/[shortCode]` | Public | Redirect page (fast, no UI) |
| `/b/[slug]` | Public | Public bio page (cached, SEO-optimized) |

---

## 8. Tech Stack

### Backend
- **FastAPI** — async API
- **SQLAlchemy 2.0** — async ORM
- **Alembic** — migrations
- **Pydantic v2** — settings + validation
- **python-jose + passlib** — JWT + bcrypt
- **GeoLite2-City.mmdb** — IP geolocation
- **qrcode[pil]** — QR generation
- **httpx** — async HTTP
- **stripe** — billing
- **resend** — transactional email
- **redis** — rate limiting + caching
- **PostgreSQL** — Neon (serverless) or self-hosted

### Frontend
- **Next.js 16+** — App Router
- **TypeScript**
- **shadcn/ui + Tailwind**
- **TanStack Query**
- **Zustand**
- **Recharts / Tremor**
- **@dnd-kit** — drag-drop bio block editor
- **openapi-typescript** — type-safe API client

### Infrastructure
- **Vercel** — Next.js frontend
- **Render / Railway / VPS** — FastAPI backend
- **Neon** — Serverless PostgreSQL
- **Upstash Redis** — Rate limits
- **Cloudflare R2** — File storage
- **Stripe** — Payments
- **Resend** — Email

---

## 9. Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname
REDIS_URL=redis://username:password@host:port
SECRET_KEY=super-secret-jwt-key-min-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=https://linknest.vercel.app
GEOLITE_DB_PATH=./GeoLite2-City.mmdb

# Storage
R2_ENDPOINT=https://<account>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=linknest-assets
R2_PUBLIC_URL=https://cdn.linknest.app

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_BUSINESS_PRICE_ID=price_xxx

# Email
RESEND_API_KEY=re_xxx
EMAIL_FROM=LinkNest <noreply@linknest.app>
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.linknest.app
NEXT_PUBLIC_APP_NAME=LinkNest
NEXT_PUBLIC_APP_URL=https://linknest.app
```

---

## 10. Key Learning Opportunities

| Feature | Python Skill |
|---------|-------------|
| Base62 short codes | Algorithmic encoding, collision handling |
| IP geolocation | Binary database parsing, IP math |
| Click tracking | Async request interception, high-write patterns |
| Time-series analytics | SQL date bucketing, aggregation pipelines |
| QR generation | Image manipulation, SVG generation |
| DNS verification | Async DNS resolution, TXT parsing |
| Rate limiting | Redis key patterns, sliding window logic |
| Billing integration | Webhook security, idempotency, state machines |
| Workspace permissions | RBAC enforcement, query scoping |
| CSV export | Streaming HTTP responses, async generators |

---

*Spec version: 2.0 | Product: LinkNest | Stack: FastAPI + Next.js + PostgreSQL | Status: Production-ready*
