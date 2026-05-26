# LinkForge

A link-in-bio and URL shortener platform built with FastAPI + Next.js.

## Prerequisites

- **Python 3.11+**
- **Node.js 22+**
- **PostgreSQL 16** (for local development, or use Docker)
- **Redis 7** (for local development, or use Docker)

---

## Running with Docker (Recommended)

The easiest way to run the full stack:

```bash
docker compose up --build
```

This starts:

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000       |
| Backend   | http://localhost:8000       |
| API Docs  | http://localhost:8000/docs  |
| Postgres  | localhost:5432              |
| Redis     | localhost:6379              |

---

## Running Locally (Development)

### 1. Start Dependencies

Start PostgreSQL and Redis. Using Docker for just the dependencies:

```bash
docker run -d --name linkforge-postgres -e POSTGRES_USER=linknest -e POSTGRES_PASSWORD=linknest -e POSTGRES_DB=linknest -p 5432:5432 postgres:16-alpine
docker run -d --name linkforge-redis -p 6379:6379 redis:7-alpine
```

Or if you have them installed natively, just ensure they're running on the default ports.

### 2. Backend Server

```bash
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv

# On macOS/Linux:
source .venv/bin/activate
# On Windows (Git Bash):
source .venv/Scripts/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file (optional — defaults work for local dev)
# If needed, copy and adjust:
#   DATABASE_URL=postgresql+asyncpg://linknest:linknest@localhost:5432/linknest
#   REDIS_URL=redis://localhost:6379
#   SECRET_KEY=your-secret-key

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The backend is now running at **http://localhost:8000**. API docs are at **http://localhost:8000/docs**.

### 3. Frontend Server

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend is now running at **http://localhost:3000**.

---

## Project Structure

```
link-forge/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # App entry point
│   │   ├── config.py          # Settings & env vars
│   │   ├── database.py        # SQLAlchemy setup
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routers/           # API route handlers
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── dependencies/      # FastAPI dependencies
│   ├── alembic/               # Database migrations
│   └── requirements.txt
├── frontend/                   # Next.js frontend
│   ├── app/                   # App router pages
│   ├── components/            # Shared components
│   ├── lib/                   # Utilities & API client
│   ├── hooks/                 # React hooks
│   └── types/                 # TypeScript types
└── docker-compose.yml         # Full stack Docker setup
```
# link-forge
