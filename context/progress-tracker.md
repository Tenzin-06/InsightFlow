# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Phase 1 — Foundation

## Current Goal

- Unit 11: Survey Management Functionality — Complete

## Completed

- **Unit 14: Survey Response Infrastructure**
  - `backend/apps/responses/__init__.py` + `apps.py` + `constants.py` + `exceptions.py` + `permissions.py` + `utils.py` — full app scaffold
  - `backend/apps/responses/models/response.py` — `Response` model: survey FK, optional respondent FK, JSONField metadata, submitted_at; indexes on survey + submitted_at
  - `backend/apps/responses/models/answer.py` — `Answer` model: response FK, question FK, JSONField value, JSONField metadata; index on question
  - `backend/apps/responses/serializers/submission_serializer.py` — `SubmissionSerializer` + `AnswerInputSerializer`; validates non-empty answers, max payload size, no duplicate question_ids
  - `backend/apps/responses/serializers/response_serializer.py` — read-only `ResponseSerializer` with nested answers
  - `backend/apps/responses/serializers/answer_serializer.py` — `AnswerSerializer` ModelSerializer
  - `backend/apps/responses/services/validation_service.py` — `validate_submission`: question-survey membership, supported types, type-specific value checks (rating=numeric, checkbox=list), required-question enforcement
  - `backend/apps/responses/services/answer_normalization_service.py` — `normalize_answers`: sanitizes text (strip), normalizes checkbox lists, coerces integer ratings from float
  - `backend/apps/responses/services/submission_service.py` — `submit_survey_response`: validate → normalize → atomic `Response.create` + `Answer.bulk_create`; full rollback on any failure
  - `backend/apps/responses/views/submission_views.py` — `SurveySubmitView` (APIView, AllowAny); resolves published survey, validates payload, links optional respondent via `request.clerk_user`
  - `backend/apps/responses/urls.py` — `POST surveys/<int:survey_pk>/submit/`
  - `backend/config/settings/base.py` — added `apps.responses` to `LOCAL_APPS`
  - `backend/config/urls.py` — wired `apps.responses.urls` under `/api/v1/`
  - `backend/apps/authentication/middleware.py` — added `OPTIONAL_AUTH_PATH_SUFFIXES = ["/submit/"]`; try-auth-don't-require block for anonymous + authenticated submissions
  - `backend/apps/responses/migrations/0001_initial.py` — migration created and applied (`responses.0001_initial... OK`)

- **Unit 11: Survey Management Functionality**
  - `src/features/surveys/types/index.ts` — Added `SurveyMetadata` and `QuestionMetadata` named types; updated `Question.metadata` to `QuestionMetadata`
  - `src/features/surveys/services/survey-api.ts` — Added `reorderQuestions(orderedIds)` API method (batch PATCH for stable ordering)
  - `src/features/surveys/utils/normalize.ts` — New file: `normalizeQuestion`, `normalizeSurvey`, `normalizeQuestionMetadata`, `normalizeSurveyMetadata` utilities
  - `src/features/surveys/hooks/use-questions.ts` — Full optimistic updates for `useCreateQuestion`, `useUpdateQuestion`, `useDeleteQuestion`; new `useReorderQuestions` hook with optimistic cache reorder + rollback
  - `src/features/surveys/hooks/use-surveys.ts` — Optimistic updates for `useUpdateSurvey` (immediate cache update for `["survey", id]` and `["surveys"]` with rollback on error)
  - `src/features/surveys/components/survey-editor.tsx` — Uses `useReorderQuestions` for move-up/move-down; exposes `onSaveStateChange` prop to report mutation state to parent
  - `src/features/surveys/pages/survey-editor-page.tsx` — `SaveIndicator` component in top bar showing "Saving…" / "Saved" / "Error saving" driven by combined survey + question mutation state

- **Unit 10: Survey Management UI**
  - `src/components/ui/badge.tsx` — Badge component with success/warning/muted/outline variants
  - `src/components/ui/skeleton.tsx` — Skeleton loading component
  - `src/components/ui/textarea.tsx` — Textarea form input
  - `src/components/ui/select.tsx` — Radix-based Select component (installed @radix-ui/react-select)
  - `src/features/surveys/types/index.ts` — Survey, Question, payload types + SurveyStatus/QuestionType enums
  - `src/lib/api/endpoints.ts` — Added surveys and questions endpoint registry
  - `src/features/surveys/services/survey-api.ts` — Full CRUD service: getSurveys, getSurveyById, createSurvey, updateSurvey, deleteSurvey, getQuestions, createQuestion, updateQuestion, deleteQuestion
  - `src/features/surveys/hooks/use-surveys.ts` — useSurveys, useCreateSurvey, useUpdateSurvey, useDeleteSurvey with TanStack Query + toast notifications
  - `src/features/surveys/hooks/use-survey.ts` — useSurvey (single survey by id)
  - `src/features/surveys/hooks/use-questions.ts` — useQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion
  - `src/features/surveys/components/survey-status-badge.tsx` — Status badge (Draft/Published/Archived)
  - `src/features/surveys/components/empty-state.tsx` — Reusable empty state with optional CTA
  - `src/features/surveys/components/survey-card.tsx` — Survey card with dropdown actions (edit, view, publish, delete)
  - `src/features/surveys/components/survey-list.tsx` — Responsive grid with skeleton loading + empty state
  - `src/features/surveys/components/survey-header.tsx` — Page header with back button, status badge, and action slots
  - `src/features/surveys/components/survey-form.tsx` — react-hook-form + zod validated create/edit form
  - `src/features/surveys/components/question-card.tsx` — Question card with ordering controls, type/required badges, edit/delete
  - `src/features/surveys/components/question-editor.tsx` — Question create/edit form with type Select, required toggle
  - `src/features/surveys/components/question-toolbar.tsx` — Add question toolbar strip
  - `src/features/surveys/components/survey-editor.tsx` — Full editor with add/edit/delete/reorder via dialogs + TanStack Query
  - `src/features/surveys/pages/survey-list-page.tsx` — /surveys route: survey grid, create button, delete + publish actions
  - `src/features/surveys/pages/survey-create-page.tsx` — /surveys/create: creation form, redirects to editor on success
  - `src/features/surveys/pages/survey-detail-page.tsx` — /surveys/:surveyId: overview card, question summary card, management actions
  - `src/features/surveys/pages/survey-editor-page.tsx` — /surveys/:surveyId/edit: two-column layout (editor + info sidebar)
  - `src/app/router/index.tsx` — Added /surveys/create, /surveys/:surveyId, /surveys/:surveyId/edit routes
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

- **Unit 8: Survey Data Architecture**
  - `backend/apps/surveys/models/survey.py` — `Survey` model with owner FK, title, description, status (draft/published/archived), is_public, timestamps, DB indexes
  - `backend/apps/surveys/models/question.py` — `Question` model with survey FK, question_text, question_type (5 types), is_required, order, JSONField metadata
  - `backend/apps/surveys/serializers/survey_serializer.py` — validates title, status; nested read-only questions
  - `backend/apps/surveys/serializers/question_serializer.py` — validates type, text, order
  - `backend/apps/surveys/permissions.py` — `IsSurveyOwner` custom permission
  - `backend/apps/surveys/views/survey_views.py` — `SurveyViewSet` (ModelViewSet, owner-scoped queryset, standardized responses)
  - `backend/apps/surveys/views/question_views.py` — `QuestionViewSet` (PATCH, DELETE flat + POST nested via survey_pk)
  - `backend/apps/surveys/services.py` — survey + question CRUD service functions
  - `backend/apps/surveys/utils.py` — `success_response` / `error_response` helpers
  - `backend/apps/surveys/urls.py` — DRF router: `surveys/`, `questions/`, + `surveys/<id>/questions/`
  - `backend/config/urls.py` — surveys URLs registered under `/api/v1/`
  - Migration `0001_initial.py` created and applied

- **Unit 7: Dashboard UI**
  - `src/routes/route-config.ts` — centralized route metadata (label, path, icon) for all dashboard modules
  - `src/components/layout/sidebar-item.tsx` — reusable nav item with active/hover states and left-accent border
  - `src/components/layout/sidebar.tsx` — updated with `logo-bg.png` branding, main nav + settings footer section
  - `src/components/layout/user-nav.tsx` — Clerk `<UserButton />` wrapper for authenticated user controls
  - `src/components/layout/mobile-sidebar.tsx` — Sheet-based responsive drawer, auto-closes on route change
  - `src/components/layout/dashboard-header.tsx` — header with mobile toggle, page title, search/bell placeholders, theme toggle, user nav
  - `src/components/layout/page-container.tsx` — standardized page wrapper (max-w-7xl, responsive padding)
  - `src/app/layouts/dashboard-layout.tsx` — updated: desktop sidebar hidden on mobile, uses `DashboardHeader`

- **Unit 6 (revised): Authentication — Local JWT (replaces Clerk)**
  - Clerk removed entirely: `@clerk/react` uninstalled, `src/lib/clerk-appearance.ts` deleted, `CLERK_JWKS_URL` no longer needed
  - `backend/apps/authentication/models.py` — `AppUser` updated: removed `clerk_user_id`, added `password` (PBKDF2 hash) + `is_active`; `set_password`/`check_password` helpers; `is_authenticated` property
  - `backend/apps/authentication/migrations/0002_update_appuser_local_auth.py` — removes `clerk_user_id`, adds `password` + `is_active`
  - `backend/apps/authentication/authentication.py` — `JWTAuthentication` (DRF `BaseAuthentication`); validates HS256 tokens with `SECRET_KEY`
  - `backend/apps/authentication/middleware.py` — `ClerkAuthMiddleware` removed; file is now a no-op comment
  - `backend/apps/authentication/permissions.py` — `IsAuthenticated` replaces `IsClerkAuthenticated`
  - `backend/apps/authentication/views.py` — `RegisterView`, `LoginView`, `TokenRefreshView`, `MeView`
  - `backend/apps/authentication/serializers.py` — `RegisterSerializer`, `LoginSerializer`
  - `backend/apps/authentication/urls.py` — `auth/register/`, `auth/login/`, `auth/token/refresh/`, `auth/me/`
  - `backend/config/urls.py` — auth URLs registered under `/api/v1/`
  - `backend/config/settings/base.py` — `ClerkAuthMiddleware` removed from `MIDDLEWARE`; DRF uses `JWTAuthentication` + `IsAuthenticated`
  - `backend/requirements/base.txt` — `cryptography` removed (no longer needed)
  - `backend/apps/surveys/views/survey_views.py` + `question_views.py` — swapped to `IsAuthenticated`
  - `src/features/auth/context/auth-context.tsx` — `AuthProvider` + `useAuth()` hook; tokens in `localStorage`
  - `src/features/auth/services/auth-api.ts` — `loginApi`, `registerApi`, `refreshTokenApi`
  - `src/main.tsx` — `<AuthProvider>` replaces `<ClerkProvider>`
  - `src/routes/protected-route.tsx` — uses custom `useAuth()`
  - `src/app/providers/auth-token-provider.tsx` — reads access token from `localStorage` into axios interceptor
  - `src/features/auth/layouts/authentication-layout.tsx` — uses custom `useAuth()`
  - `src/features/auth/pages/login-page.tsx` — custom form (react-hook-form + zod)
  - `src/features/auth/pages/register-page.tsx` — custom form with confirm-password
  - `src/components/layout/user-nav.tsx` — user initials avatar + dropdown (profile, sign out)
  - `src/components/layout/navigation.tsx` — auth-aware navbar using `useAuth()` (no Clerk `<Show>`)

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

- None. Unit 14 complete.

## Next Up

- None.

## Open Questions

- None currently.

## Architecture Decisions

- **Auth**: Switched from Clerk to self-contained JWT auth (PyJWT HS256) — no external service, works everywhere without environment keys at startup
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
