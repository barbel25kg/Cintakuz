# Azizah Khairunnisa — Portfolio App

## Overview
A personal portfolio website for Azizah Khairunnisa with an admin dashboard for managing uploaded files (PDFs, images, documents, etc.).

## Architecture

### Artifacts
| Artifact | Path | Description |
|---|---|---|
| `artifacts/portfolio` | `/` | React + Vite frontend (portfolio + admin UI) |
| `artifacts/api-server` | `/api` | Express + TypeScript REST API |
| `artifacts/mockup-sandbox` | `/__mockup` | Design sandbox (Replit internal) |

### Tech Stack
- **Frontend**: React 19, Vite 7, Tailwind CSS v4, TanStack Query, Wouter (routing), Framer Motion
- **Backend**: Express 5, TypeScript, esbuild (bundler), pino (logging)
- **Database**: PostgreSQL via `pg` Pool (Replit managed DB)
- **Auth**: Username/password login → JWT token (stored in localStorage)
- **Storage**: Local filesystem (`artifacts/api-server/uploads/`)

## Key Files

### Frontend (`artifacts/portfolio/src/`)
- `App.tsx` — Router: `/` Home, `/admin` Login, `/admin/dashboard` Dashboard
- `pages/Home.tsx` — Public portfolio page
- `pages/AdminLogin.tsx` — Username/password login form
- `pages/AdminDashboard.tsx` — File upload/manage UI
- `lib/api.ts` — All API calls (BASE = `/api`)

### Backend (`artifacts/api-server/src/`)
- `app.ts` — Express app, CORS, static uploads at `/api/uploads/`
- `lib/auth.ts` — JWT sign/verify, `requireAdmin` middleware
- `lib/db.ts` — pg Pool connection
- `lib/storage.ts` — Local file save/delete
- `routes/auth.ts` — `POST /api/auth/login`
- `routes/files.ts` — CRUD for portfolio_files table

## Database Schema

```sql
CREATE TABLE portfolio_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL DEFAULT 'other',
  featured BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/files` | — | List all files |
| POST | `/api/files` | JWT | Upload file |
| PATCH | `/api/files/:id` | JWT | Update file metadata |
| DELETE | `/api/files/:id` | JWT | Delete file |
| POST | `/api/files/download/:id` | — | Track download, returns file URL |

## Required Environment Variables (Secrets)

| Variable | Description |
|---|---|
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `SESSION_SECRET` | JWT signing secret |
| `DATABASE_URL` | PostgreSQL connection string |

See `.env.example` for the full template.

## Running Locally

```bash
pnpm install
# Set env vars in .env (copy from .env.example)
# Start API server
cd artifacts/api-server && pnpm dev
# Start frontend (separate terminal)
cd artifacts/portfolio && pnpm dev
```
