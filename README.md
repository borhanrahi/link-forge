# LinkNest (link-forge)

> **Link-in-bio & URL shortener platform** — shorten URLs, create bio landing pages, generate QR codes, and track every click. Built with FastAPI + Next.js.

---

## What It Is

LinkNest is a full-featured link management platform. It replaces tools like Linktree, Bitly, and QR code generators with a single, self-hosted dashboard.

**Who it's for:** creators, marketers, agencies, and developers who want to own their links and their data.

### Key Features

| Feature | Description |
|---------|-------------|
| **Short Links** | Custom, trackable short URLs with your own domain |
| **Bio Pages** | Beautiful link-in-bio landing pages — drag-and-drop blocks |
| **Analytics** | Real-time clicks, locations (geo-IP), referrers, devices, browsers |
| **QR Codes** | Branded, downloadable QR codes for any link |
| **Custom Domains** | Bring your own domain for short links and bio pages |
| **Team Workspaces** | Multi-user workspaces with roles and permissions |
| **UTM Builder** | Preset UTM parameters for campaign tracking |
| **Billing** | Stripe-powered subscription plans (Free / Pro / Business) |
| **Webhooks** | Real-time event notifications for integrations |
| **REST API** | Full programmatic access to all resources |

---

## Architecture

```
┌──────────┐     ┌──────────┐     ┌────────────┐
│  Next.js │────▶│ FastAPI  │────▶│ PostgreSQL │
│  (React) │     │ (Python) │     │  (Neon)    │
├──────────┤     ├──────────┤     ├────────────┤
│ Port 3000│     │ Port 8000│     │ Port 5432  │
└──────────┘     ├──────────┤     └────────────┘
                 │   Redis  │
                 ├──────────┤
                 │   R2 🪣  │     ┌────────────┐
                 │  Stripe  │────▶│   Resend   │
                 │  Neon    │     │  (Email)   │
                 │   Auth   │     └────────────┘
                 └──────────┘
```

### Backend (FastAPI)

- **Framework:** FastAPI with async endpoints, auto-generated OpenAPI docs at `/docs`
- **ORM:** SQLAlchemy 2.0 (async) with Alembic migrations
- **Auth:** Neon Auth — JWKS-based token validation with optional dev bypass
- **Cache:** Redis (click dedup, rate limiting, session cache)
- **Payments:** Stripe (subscriptions, webhooks, invoices)
- **Email:** Resend (transactional emails)
- **Storage:** Cloudflare R2 (avatar uploads, bio page assets)
- **Geo-IP:** MaxMind GeoLite2 database for click location analytics

**Routers:** `auth`, `users`, `workspaces`, `links`, `clicks`, `analytics`, `bio_pages`, `bio_public`, `qr_codes`, `custom_domains`, `utm`, `billing`, `subscriptions`, `webhooks`

**Services:** `click_tracker`, `short_code` generator, `qr_generator`, `geo_ip`, `quota_enforcer`, `billing_manager`, `domain_validator`, `email_sender`, `scheduler`

### Frontend (Next.js)

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4 + CVA + `tailwind-merge`
- **State:** Zustand (client), TanStack React Query (server)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion + custom animated components
- **Charts:** Recharts (analytics)
- **Auth:** Neon Auth client integration
- **Drag & drop:** dnd-kit (bio page block editor)
- **UI:** Sonner (toasts), Lucide React (icons), qrcode.react (QR display)

**Pages (public):** Landing, Features, Pricing, Integrations, Blog, About, Careers, Contact, Privacy, Terms

**Pages (auth):** Login, Register, Forgot Password

**Dashboard:** Overview, Links, Bio Pages, QR Codes, Analytics, Domains, Team, Billing, Settings

---

## How the App Works

### URL Shortening Flow

1. User pastes a long URL into the dashboard
2. Backend generates a unique short code (or uses a custom alias)
3. The short link is stored in PostgreSQL with metadata (workspace, tags, UTM params)
4. When anyone visits `https://linknest.app/s/<code>`, the backend:
   - Looks up the link by short code
   - Records a click event (IP, user-agent, referrer, geo-location via GeoLite2)
   - Redirects (HTTP 307) to the destination URL
5. Analytics update in real-time on the dashboard

### Bio Pages Flow

1. User creates a bio page with a title, description, avatar, and theme
2. Adds content blocks (links, text, images, social icons, dividers) via drag-and-drop
3. Publishes to a LinkNest subdomain (`user.linknest.app`) or custom domain
4. Visitors see a mobile-optimized landing page with all the user's links

### Analytics

- Every click records: timestamp, IP, user-agent, referrer, country/city (geo-IP), device type, browser
- Dashboard displays: total clicks, unique visitors, top referrers, geographic map, device breakdown, time-series charts
- Data filters by date range, workspace, link, and UTM parameters

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0 (async), Alembic |
| **Frontend** | Node.js 22+, Next.js 16, React 19, TypeScript 5.5 |
| **Database** | PostgreSQL 16 (via Neon or local) |
| **Cache** | Redis 7 |
| **Auth** | Neon Auth (JWT / JWKS) |
| **Payments** | Stripe |
| **Email** | Resend |
| **Storage** | Cloudflare R2 (S3-compatible) |
| **Container** | Docker + Docker Compose |

---

## Project Structure

```
link-forge/
├── backend/                          # FastAPI backend
│   ├── app/
│   │   ├── main.py                   # App factory, CORS, router registration
│   │   ├── config.py                 # Pydantic settings (env vars)
│   │   ├── database.py               # SQLAlchemy async engine & session
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── user.py               # User, oauth accounts
│   │   │   ├── workspace.py          # Workspaces
│   │   │   ├── workspace_member.py   # Workspace membership & roles
│   │   │   ├── link.py               # Short links
│   │   │   ├── click.py              # Click events
│   │   │   ├── bio_page.py           # Bio landing pages
│   │   │   ├── bio_block.py          # Bio page content blocks
│   │   │   ├── qr_code.py            # QR code records
│   │   │   ├── custom_domain.py      # Custom domain mappings
│   │   │   ├── utm_preset.py         # UTM parameter presets
│   │   │   ├── subscription.py       # Subscription plans
│   │   │   ├── invoice.py            # Stripe invoices
│   │   │   ├── feature_usage.py      # Quota tracking
│   │   │   └── webhook_event.py      # Webhook event log
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   ├── routers/                  # API route handlers
│   │   ├── services/                 # Business logic layer
│   │   │   ├── short_code.py         # Unique short code generation
│   │   │   ├── click_tracker.py      # Click recording & dedup
│   │   │   ├── geo_ip.py             # GeoIP lookups (MaxMind)
│   │   │   ├── qr_generator.py       # QR code image generation
│   │   │   ├── quota_enforcer.py     # Usage quota checks
│   │   │   ├── billing_manager.py    # Stripe billing logic
│   │   │   ├── domain_validator.py   # DNS verification for domains
│   │   │   ├── email_sender.py       # Resend email integration
│   │   │   └── scheduler.py          # Scheduled tasks
│   │   ├── dependencies/             # FastAPI dependency injection
│   │   │   ├── auth.py               # JWT auth & current user
│   │   │   ├── db.py                 # DB session dependency
│   │   │   ├── neon_auth.py          # Neon Auth JWKS validation
│   │   │   ├── permissions.py        # Role-based access control
│   │   │   ├── rate_limit.py         # Redis-backed rate limiting
│   │   │   └── workspace.py          # Current workspace resolution
│   │   └── utils/
│   │       ├── exceptions.py         # Custom exception classes
│   │       └── validators.py         # URL & domain validators
│   ├── alembic/                      # Database migrations
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/                         # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx                # Root layout (fonts, providers)
│   │   ├── page.tsx                  # Landing page
│   │   ├── providers.tsx             # React context providers
│   │   ├── globals.css               # Tailwind CSS + theme
│   │   ├── (public)/                 # Marketing pages
│   │   │   ├── features/
│   │   │   ├── pricing/
│   │   │   ├── integrations/
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   ├── careers/
│   │   │   ├── contact/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   ├── (auth)/                   # Auth pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── dashboard/                # Protected dashboard
│   │   │   ├── page.tsx              # Overview
│   │   │   ├── layout.tsx            # Dashboard layout & sidebar
│   │   │   ├── links/
│   │   │   ├── bio-pages/
│   │   │   ├── qr-codes/
│   │   │   ├── analytics/
│   │   │   ├── domains/
│   │   │   ├── team/
│   │   │   ├── billing/
│   │   │   └── settings/
│   │   └── api/                      # Next.js API routes (proxies, etc.)
│   ├── components/
│   │   ├── ui/                       # Shared UI primitives (Button, Badge, Card, etc.)
│   │   │   └── animated/             # Animated components (Framer Motion + custom)
│   │   ├── layout/                   # Layout components (headers, footer, sidebar)
│   │   ├── forms/                    # Form components
│   │   ├── charts/                   # Analytics chart components
│   │   ├── modals/                   # Modal/dialog components
│   │   └── bio-editor/               # Bio page drag-and-drop editor
│   ├── lib/
│   │   ├── api-client.ts             # API client (fetch + error handling)
│   │   ├── auth-client.ts            # Auth API methods
│   │   ├── auth-store.ts             # Zustand auth state
│   │   ├── neon-auth.ts              # Neon Auth client config
│   │   ├── constants.ts              # App-wide constants
│   │   └── utils.ts                  # Utility functions
│   ├── hooks/
│   │   └── index.ts                  # Custom React hooks
│   ├── types/
│   │   └── generated.ts              # Auto-generated TypeScript types (openapi-typescript)
│   ├── data/
│   │   └── mock/                     # Mock data for development
│   ├── next.config.ts
│   ├── package.json
│   ├── Dockerfile
│   └── .env.local
├── docker-compose.yml                # Full-stack Docker Compose
└── README.md
```

---

## Setup

### Prerequisites

- **Python 3.11+**
- **Node.js 22+** (for frontend dev)
- **PostgreSQL 16** (or use Docker)
- **Redis 7** (or use Docker)
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
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection string |
| `FRONTEND_URL` | No | `http://localhost:3000` | CORS origin |
| `SECRET_KEY` | No | — | Signing key (not used with Neon Auth) |
| `NEON_AUTH_URL` | Yes | — | Neon Auth JWKS endpoint |
| `R2_ENDPOINT` | No | — | Cloudflare R2 endpoint |
| `R2_ACCESS_KEY_ID` | No | — | R2 access key |
| `R2_SECRET_ACCESS_KEY` | No | — | R2 secret key |
| `R2_BUCKET_NAME` | No | `linknest-assets` | R2 bucket |
| `R2_PUBLIC_URL` | No | — | R2 public CDN URL |
| `STRIPE_SECRET_KEY` | No | — | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | No | — | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | No | — | Stripe price ID for Pro plan |
| `STRIPE_BUSINESS_PRICE_ID` | No | — | Stripe price ID for Business plan |
| `RESEND_API_KEY` | No | — | Resend API key for email |
| `EMAIL_FROM` | No | `LinkNest <noreply@linknest.app>` | Sender email address |
| `DEV_AUTH_BYPASS` | No | `False` | Skip JWKS validation in dev |
| `GEOLITE_DB_PATH` | No | `./GeoLite2-City.mmdb` | MaxMind GeoIP database path |

### Frontend (.env.local)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `http://localhost:8000`) |

---

## API Overview

The backend exposes a REST API at `http://localhost:8000/api/...` (or directly at http://localhost:8000). Interactive docs are at `/docs` (Swagger UI) and `/redoc` (ReDoc).

| Router | Endpoints | Description |
|--------|-----------|-------------|
| `auth` | `/auth/*` | Login, register, OAuth, session management |
| `users` | `/users/*` | User profile, settings |
| `workspaces` | `/workspaces/*` | Workspace CRUD, member management |
| `links` | `/links/*` | Short link CRUD, search, tags |
| `clicks` | `/clicks/*` | Click events, bulk operations |
| `analytics` | `/analytics/*` | Aggregated stats, charts data, exports |
| `bio_pages` | `/bio-pages/*` | Bio page CRUD, block editor |
| `bio_public` | `/bio/*` | Public bio page rendering & redirect |
| `qr_codes` | `/qr-codes/*` | QR code generation & CRUD |
| `custom_domains` | `/custom-domains/*` | Domain verification & mapping |
| `utm` | `/utm/*` | UTM preset templates |
| `billing` | `/billing/*` | Stripe checkout, portal, invoices |
| `subscriptions` | `/subscriptions/*` | Plan management, feature access |
| `webhooks` | `/webhooks/*` | Webhook endpoint management, event log |

---

## Database Models

| Model | Table | Purpose |
|-------|-------|---------|
| `User` | `users` | User accounts, OAuth identities |
| `Workspace` | `workspaces` | Team/organization workspaces |
| `WorkspaceMember` | `workspace_members` | User-workspace membership with roles |
| `Link` | `links` | Shortened URLs with metadata |
| `Click` | `clicks` | Individual click events |
| `BioPage` | `bio_pages` | Bio landing page configurations |
| `BioBlock` | `bio_blocks` | Ordered content blocks on bio pages |
| `QRCode` | `qr_codes` | Generated QR code records |
| `CustomDomain` | `custom_domains` | Custom domain DNS mappings |
| `UTMPreset` | `utm_presets` | Saved UTM parameter templates |
| `Subscription` | `subscriptions` | Stripe subscription plans |
| `Invoice` | `invoices` | Synced Stripe invoices |
| `FeatureUsage` | `feature_usage` | Per-workspace quota counters |
| `WebhookEvent` | `webhook_events` | Outgoing webhook delivery log |

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
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Lint check
```

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
