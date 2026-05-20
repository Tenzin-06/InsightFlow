# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Phase 1 — Foundation

## Current Goal

- Unit 3: Frontend ↔ Backend Integration

## Completed

- **Unit 2: Backend API Foundation**
  - Django 5.x + DRF + PostgreSQL backend initialized under `/backend`
  - Modular settings: `config/settings/{base,development,production}.py`
  - Six Django apps scaffolded: `authentication`, `users`, `surveys`, `analytics`, `campaigns`, `core`
  - Each app has: `models.py`, `views.py`, `serializers.py`, `urls.py`, `services.py`, `selectors.py`
  - `apps.core.models.TimeStampedModel` abstract base with `created_at` / `updated_at`
  - `GET /api/v1/health/` endpoint returning `{"status": "ok", "service": "InsightFlow API"}`
  - DRF configured: JSON-only renderer/parser, `LimitOffsetPagination`
  - CORS configured: `localhost:5173` allowed in development
  - PostgreSQL credentials loaded from `.env` via `django-environ`
  - Static/media dirs configured (`staticfiles/`, `media/`)
  - Console logging configured (DEBUG level in development)
  - Requirements split: `requirements/{base,development,production}.txt`
  - `django-admin check` passes with 0 issues

- **Unit 1: Frontend Application Foundation**
  - React + Vite + TypeScript project initialized
  - Tailwind CSS v4 integrated via `@tailwindcss/vite` plugin
  - shadcn/ui components written with Radix UI primitives (button, card, input, separator, dialog, sheet, dropdown-menu, sonner)
  - `cn()` utility via clsx + tailwind-merge at `src/lib/utils.ts`
  - react-router-dom v7 routing (/, /login, /register, /dashboard, /surveys, /analytics, /campaigns, /settings)
  - next-themes global theme system (light/dark toggle in header)
  - Feature-oriented folder structure: `src/app/`, `src/components/`, `src/features/`, `src/lib/`, `src/hooks/`, `src/types/`
  - Dashboard shell: sidebar with nav links + active state, header with theme toggle + user avatar, responsive content area
  - Public layout (landing, login, register) and Dashboard layout
  - Placeholder pages for all 8 routes
  - `@/` path alias configured in vite.config.ts (no baseUrl in tsconfig for TS6 compatibility)
  - Production build passes, dev server runs on localhost:5173

## In Progress

- None.

## Next Up

1. **Unit 3: Frontend ↔ Backend Integration** — API communication layer, shared env handling
2. **Unit 4: Deployment & Environment Setup** — Railway + Vercel deployment pipeline

## Open Questions

- None currently.

## Architecture Decisions

- Tailwind v4 (not v3) — uses `@tailwindcss/vite` plugin; CSS-based config in `src/index.css` via `@theme {}` block
- Tailwind animate plugin loaded via `@plugin "tailwindcss-animate"` (not `@import`) — required for Tailwind v4
- shadcn/ui CLI (v4.6.0) on Windows puts files in literal `@/` directory — all components written manually with Radix UI imports
- shadcn "base-nova" style uses React Aria primitives (not installed) — used standard "default" style with Radix UI instead
- TypeScript 6 deprecated `baseUrl` — removed from tsconfig; paths use `./src/*` relative to tsconfig
- react-router-dom v7 (createBrowserRouter API)
- next-themes for dark/light mode

## Session Notes

- Unit 1 complete. Frontend shell running at `localhost:5173` with full design system, routing, and dashboard layout.
- Begin Unit 2 next: create `/backend` Django project. No dependency on Unit 1 for this step.
