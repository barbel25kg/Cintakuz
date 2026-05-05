# Portfolio Web App

## Overview

A modern dark-mode portfolio web app with admin-only authentication, Supabase file storage, and public portfolio viewing. Built as a pnpm monorepo with React + Vite (frontend) and Express (backend API).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **API framework**: Express 5
- **Storage**: Supabase (Storage bucket + PostgreSQL table)
- **Auth**: JWT (username + password only, no OAuth)
- **Build**: esbuild (API), Vite (frontend)

## Artifacts

| Artifact | Path | Port |
|----------|------|------|
| Portfolio (frontend) | `/` | 21113 |
| API Server (backend) | `/api` | 8080 |

## Key Features

- **Landing Page**: Hero, Skills bento grid, Featured Project, Portfolio file grid
- **Public Portfolio**: Browse, preview, download files (PDF, DOC, images) with download counter
- **Admin Panel** (`/admin`): Login with username+password → upload files, edit titles/descriptions, toggle featured, delete
- **Auth**: JWT tokens stored in localStorage, 24h expiry, verified on all admin API routes

## Environment Variables / Secrets

| Key | Description |
|-----|-------------|
| `SUPABASE_URL` | Project URL: `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key from Supabase Settings → API |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `SESSION_SECRET` | Secret for JWT signing |

## Supabase Setup (one-time)

Run this SQL in Supabase SQL Editor (https://supabase.com/dashboard/project/bdydpbwlvmllgutcovgb/sql/new):

```sql
CREATE TABLE IF NOT EXISTS portfolio_files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'other',
  featured boolean DEFAULT false,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

The `portfolio-files` storage bucket is already created (public, 50MB limit).

## Key Commands

- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/portfolio run dev` — run frontend locally
- `pnpm run typecheck` — full typecheck across all packages

## File Structure

```
artifacts/
  api-server/src/
    lib/auth.ts        — JWT helpers, admin credential check
    lib/supabase.ts    — Supabase client
    routes/auth.ts     — POST /api/auth/login
    routes/files.ts    — GET/POST/PATCH/DELETE /api/files
  portfolio/src/
    lib/api.ts         — All API calls + auth helpers
    pages/Home.tsx     — Landing page (hero, skills, featured, files)
    pages/AdminLogin.tsx      — /admin login form
    pages/AdminDashboard.tsx  — /admin/dashboard (upload, edit, delete)
```
