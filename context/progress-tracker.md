# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Phase 1 — Foundation

## Current Goal

- Unit 9: Landing Page (complete)

## Completed

- **Unit 9: Landing Page (Marketing Website)**
  - `src/features/marketing/components/mobile-nav.tsx` — Sheet-based mobile menu with nav links and auth CTAs
  - `src/features/marketing/components/navbar.tsx` — sticky responsive navbar with logo, nav links, theme toggle, login, Get Started
  - `src/features/marketing/components/hero-section.tsx` — hero with gradient headline, dual CTAs, hero image, floating stat cards
  - `src/features/marketing/components/feature-section.tsx` — 4 feature cards (distribution, analytics, intelligence, automation) in 2-col grid
  - `src/features/marketing/components/workflow-section.tsx` — 5-step workflow (Create → Launch → Track → Analyze → Insights), desktop horizontal + mobile vertical
  - `src/features/marketing/components/analytics-section.tsx` — AI intelligence section with 4 capabilities, mock metrics grid, mock bar chart
  - `src/features/marketing/components/cta-section.tsx` — reusable CTA component with mid-page and final variants
  - `src/features/marketing/components/footer.tsx` — structured footer with branding, nav, legal, social links
  - `src/features/marketing/pages/landing-page.tsx` — full-page assembly with Navbar, Hero, Features, Workflow, Analytics, CTAs, Footer
  - `src/app/router/index.tsx` — updated landing page import to `@/features/marketing/pages/landing-page`

- **Unit 5: Authentication UI**
  - `react-hook-form`, `zod`, `@hookform/resolvers` installed
  - `src/components/ui/label.tsx` — Radix Label primitive
  - `src/features/auth/layouts/authentication-layout.tsx` — split-screen layout (branding left, form right)
  - `src/features/auth/components/` — auth-card, auth-header, auth-footer, password-input, login-form, signup-form
  - `src/features/auth/pages/login-page.tsx` — Login/Sign Up tab switcher + LoginForm
  - `src/features/auth/pages/register-page.tsx` — Login/Sign Up tab switcher + SignupForm
  - `src/app/router/index.tsx` — `/login` + `/register` under `AuthenticationLayout`
  - `src/components/layout/navigation.tsx` — session-aware nav (guest: Login+SignUp / auth: Dashboard+avatar)
  - `src/components/layout/header.tsx` — uses Navigation component

- **Unit 3: Frontend ↔ Backend Integration**
  - `axios` + `@tanstack/react-query` installed
  - `.env`, `.env.development`, `.env.production` created with `VITE_API_BASE_URL`
  - `src/lib/env/index.ts` — centralized environment access
  - `src/lib/api/config.ts` — base URL + timeout from env
  - `src/lib/api/client.ts` — Axios instance with 10s timeout + JSON headers
  - `src/lib/api/interceptors.ts` — response error normalization (401, 403, 5xx, network)
  - `src/lib/api/endpoints.ts` — endpoint registry (`/health/`, `/auth/*`)
  - `src/lib/api/types.ts` — `ApiResponse<T>` and `ApiError` types
  - `src/lib/api/utils.ts` — `getRequest`, `postRequest`, `patchRequest`, `deleteRequest`
  - `src/app/providers/query-provider.tsx` — `QueryClient` (retry:1, no window-focus refetch)
  - `src/services/health/index.ts` — `getHealthStatus()` service
  - `src/hooks/api/use-health-check.ts` — `useHealthCheck()` React Query hook
  - `src/App.tsx` updated: `QueryProvider` wraps the app
  - `src/features/dashboard/pages/dashboard-page.tsx` — shows live API connection status
  - Production build passes (0 TS errors, 440 kB bundle)

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

- None.

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
- Unit 5 complete. Authentication UI implemented with split-screen layout, react-hook-form + zod validation, session-aware navigation.
- Unit 9 complete. Landing page (marketing website) with full section layout, scroll animations, and responsive design.
