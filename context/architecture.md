# InsightFlow — Architecture Overview

## 🧱 Stack Overview

| Layer              | Technology            | Role                                                              |
| ------------------ | --------------------- | ----------------------------------------------------------------- |
| Frontend Framework | React                 | Core UI framework for building the web application                |
| UI Components      | shadcn/ui             | Prebuilt accessible UI components                                 |
| Styling            | Tailwind CSS          | Utility-first styling system                                      |
| Backend Framework  | Django                | Core backend application (modular monolith)                       |
| API Layer          | Django REST Framework | REST APIs for frontend communication                              |
| Database           | PostgreSQL            | Primary relational database for surveys, responses, and analytics |
| Authentication     | Local JWT (PyJWT)     | Self-contained JWT auth; no external service required             |
| AI Provider        | Google Gemini API     | AI-powered analysis, summarization, and simulation                |
| Background Jobs    | Trigger.dev           | Async processing for emails, AI tasks, and scheduling             |
| Email Service      | Resend                | Email delivery for campaigns and reminders                        |
| Frontend Hosting   | Vercel                | Deployment platform for React frontend                            |
| Backend Hosting    | Render                | Deployment platform for Django backend                            |
| Database Hosting   | Neon                  | Managed serverless PostgreSQL (production)                        |

---

## 📁 System Boundaries (Folder Responsibilities)

### Frontend (`/frontend`)

Responsible for all user-facing logic.

- `/pages` → route-level screens (dashboard, survey, analytics)
- `/components` → reusable UI components (forms, charts, cards)
- `/features/surveys` → survey creation + import UI
- `/features/distribution` → campaign setup, email/QR/link UI
- `/features/analytics` → dashboards and visualization
- `/features/chat-survey` → conversational survey interface (non-AI logic)
- `/lib/api` → API client for backend communication
- `/hooks` → custom React hooks (state, fetching, auth wrappers)

---

### Backend (`/backend`)

Modular monolithic Django application.

- `/apps/surveys` → survey models, creation, import (Google Forms integration)
- `/apps/responses` → response collection and storage
- `/apps/distribution` → email campaigns, link generation, QR codes
- `/apps/analytics` → metrics computation and reporting logic
- `/apps/reports` → PDF report generation, analytics/AI embedding, chart assets, export records, and authenticated downloads
- `/apps/engagement` → email opens, link clicks, survey sessions, drop-off events, and raw engagement event persistence
- `/apps/ai` → AI orchestration layer (Gemini API integration)
- `/apps/simulation` → synthetic response generation (controlled mode)
- `/apps/auth` → user/workspace access control (Clerk integration layer)
- `/core` → shared utilities, base models, constants
- `/api` → DRF routing and API endpoint aggregation

---

### Background Jobs (`/backend/jobs` or Trigger.dev external workflows)

- email campaign dispatch
- scheduled reminder execution
- AI processing pipelines (summaries, sentiment, scoring)
- synthetic response generation tasks
- PDF report generation

---

## 🗄️ Storage Model

### 1. PostgreSQL (Primary Database)

Stores structured application data:

- Users (via Clerk reference IDs)
- Surveys
- Questions (including JSON schema for flexible structure)
- Responses
- Campaigns
- Engagement tracking (opens, clicks, completions)
- Engagement events, tracking tokens, response sessions, and drop-off events
- AI analysis results
- Simulation runs and synthetic responses metadata

**Key design choice:**

- Survey structure stored using JSON fields for flexibility
- Normalized relational model for responses and analytics

---

### 2. File Storage (External or Object Storage)

Used for:

- PDF survey reports
- Exported analytics reports
- Generated QR code images
- Optional attachments (if future extension added)

**Rule:**

- No large binary data stored in PostgreSQL

---

### 3. Cache Layer (Optional / Future)

If introduced:

- Redis (recommended)

Used for:

- session caching
- rate limiting
- temporary campaign tracking states
- AI response caching (for repeated queries)

---

## 🔐 Authentication & Access Model

### Provider: Local JWT (PyJWT + Django password hashing)

### Core Principles:

- All auth is self-contained — no external service dependencies
- Passwords hashed with Django's PBKDF2-SHA256 (`make_password` / `check_password`)
- Short-lived **access tokens** (60 min, HS256) + long-lived **refresh tokens** (7 days)
- Tokens stored in `localStorage` on the client

### Access Control Model:

- Each user belongs to a **workspace (implicit MVP single workspace)**
- All surveys, campaigns, and responses are **owned by a user**
- Ownership is enforced via `owner` FK on `Survey`

### Authorization Rules:

- Users can only access their own:
  - surveys
  - campaigns
  - analytics
  - AI results
- No cross-user data access unless explicitly shared (future feature)

### Session Flow:

1. User registers/logs in via `/api/v1/auth/register/` or `/api/v1/auth/login/`
2. Backend returns `{ access, refresh, user }` JSON
3. Frontend stores tokens in `localStorage`, injects `Bearer <access>` on every request
4. `JWTAuthentication` (DRF) validates the token using `SECRET_KEY` and sets `request.user`
5. `IsAuthenticated` permission guards all protected endpoints

### Auth Endpoints:

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register/` | Create account → returns tokens |
| POST | `/api/v1/auth/login/` | Sign in → returns tokens |
| POST | `/api/v1/auth/token/refresh/` | Exchange refresh token for new access token |
| GET | `/api/v1/auth/me/` | Return current user info |

---

## 🤖 AI & Background Task Model

### AI Layer (Google Gemini API)

AI is used strictly as an **analysis and augmentation layer**, not a decision-maker.

#### AI Responsibilities:

- survey response summarization
- sentiment classification
- response quality scoring
- insight extraction from aggregated responses
- synthetic response generation (simulation mode only)

#### Constraints:

- no model training in MVP
- prompt-based inference only
- AI outputs always stored separately from raw data

---

### Background Task System (Trigger.dev)

Used for async and scheduled workloads:

#### Task Types:

- **Email Campaign Jobs**
  - send survey invitations
  - batch processing for large lists

- **Reminder System**
  - scheduled follow-up emails
  - inactivity-based triggers

- **AI Processing Jobs**
  - batch summarization
  - sentiment analysis runs
  - quality scoring pipelines

- **Simulation Jobs**
  - generate synthetic responses using persona definitions
  - strictly limited execution quotas

- **Report Generation**
  - PDF export creation
  - analytics packaging
  - chart asset rendering and authenticated report download delivery

---

## 📄 System Invariants (Critical Rules)

These are non-negotiable rules the system must never violate:

1. **Survey Ownership Isolation**
   - A user can only access surveys, responses, and campaigns they own.

2. **Separation of Real vs Synthetic Data**
   - Synthetic responses must NEVER be mixed with real responses.
   - Stored in separate tables or explicitly flagged with strict validation rules.

3. **Simulation Mode is Explicit Only**
   - Synthetic response generation can only run when explicitly enabled by the user.
   - Default state is ALWAYS disabled.

4. **AI is Read-Only on Core Data**
   - AI cannot modify survey structure or real response data.
   - AI outputs are advisory/analytical only.

5. **No Direct External Messaging Automation**
   - System cannot send messages outside email (no WhatsApp/social integrations in MVP).

6. **Survey Data Integrity**
   - Responses are immutable once submitted (no edits allowed).
   - Any correction must create a new record.

7. **Campaign Tracking Consistency**
   - Every email/link click must map to a valid campaign and survey ID.
   - No orphan tracking events allowed.

8. **Engagement Attribution Integrity**
   - Public tracking tokens must map internally to campaign, survey, and recipient records.
   - Tracking redirects must only point to approved survey destinations.
   - Survey completion events should be deduplicated per response session.

9. **Strict MVP Scope Enforcement**
   - No CRM, marketplace, or social distribution features exist in backend logic or schema.

---

## 🚫 Architectural Non-Goals

The system explicitly avoids:

- microservices architecture
- real-time streaming pipelines
- WhatsApp/social automation systems
- survey marketplaces or public discovery
- CRM or sales automation tools
- autonomous AI interviewer agents
- multi-tenant enterprise hierarchy systems (for MVP)

---

## 🧠 Summary

InsightFlow is designed as a **modular monolithic, API-driven intelligence layer** on top of traditional survey tools. It prioritizes simplicity, data integrity, and research trust while integrating AI and automation only where it enhances survey distribution, engagement, and insight generation.

The architecture is intentionally minimal for the MVP, but structured to scale into a more advanced intelligence platform in later phases.
