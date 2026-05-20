# InsightFlow — Code Standards

This document defines the coding conventions, architectural rules, and structural guidelines for building InsightFlow. The goal is to ensure consistency across a 3-developer team, reduce complexity, and keep the system modular, maintainable, and research-safe.

---

# 1. General Engineering Principles

These principles apply to the entire codebase (frontend + backend).

## 1.1 Simplicity First

- Prefer simple solutions over abstract or over-engineered designs.
- Avoid premature optimization.
- MVP features must be understandable and maintainable by all team members.

## 1.2 Modular Monolith Discipline

- Backend architecture is a modular monolith.
- Keep domains isolated internally even though they exist in one backend.
- Avoid tightly coupling unrelated modules.

## 1.3 Strict Separation of Concerns

- UI components must not contain business logic.
- Backend services must not depend on frontend implementation details.
- AI orchestration must remain isolated from core business logic.

## 1.4 Data Integrity First

- Survey responses are immutable once submitted.
- AI-generated outputs must never overwrite raw survey data.
- Synthetic data must always remain separated from real user data.

## 1.5 Explicit Over Implicit

- Avoid hidden side effects.
- All async jobs must be explicitly triggered or scheduled.
- Simulation mode must always require explicit user activation.

## 1.6 Research Trust Principle

- Preserve original survey responses exactly as submitted.
- AI-generated insights are advisory only.
- Never manipulate analytics to alter actual research results.

---

# 2. TypeScript Standards (Frontend)

Frontend stack:

- React
- TypeScript

## 2.1 Type Safety Rules

- `any` is forbidden unless documented with justification.
- All API responses must have explicit types.
- Use `type` over `interface` unless inheritance is required.

## 2.2 Component Rules

- Components must have a single responsibility.
- Prefer small reusable components.
- Move complex logic into hooks or services.

## 2.3 State Management

Use local component state by default.

Global state is allowed only for:

- authenticated user state
- workspace/session context
- global UI state

## 2.4 API Layer Rules

- All API communication must go through `/lib/api`.
- Do not call `fetch` or `axios` directly inside UI components.

## 2.5 Import Rules

Use absolute imports:

```ts
import { SurveyCard } from "@/features/surveys/components/survey-card";
```

Do not use deep relative imports:

```ts
../../../../components/button
```

---

# 3. React Framework Conventions

## 3.1 Frontend Structure

Use feature-based organization.

Each feature owns:

- components
- hooks
- services
- types

Example:

```plaintext
/features
  /surveys
  /analytics
  /distribution
  /chat-survey
```

---

## 3.2 UI Layer Rules

- Use `shadcn/ui` as the primary UI component system.
- Use Tailwind CSS for styling.
- Avoid custom CSS files unless absolutely necessary.

---

## 3.3 Data Flow Rules

Frontend data flow must always follow:

```plaintext
UI → API Layer → Backend → Database
```

Do not bypass layers.

---

# 4. Django + DRF Backend Conventions

## 4.1 Backend Architecture

Backend follows a modular monolith structure.

Each Django app represents a business domain:

- surveys
- responses
- distribution
- analytics
- ai
- simulation
- auth

---

## 4.2 Service Layer Rule

Business logic belongs in:

```plaintext
services.py
```

Views must remain thin.

Views are responsible only for:

- request validation
- authentication checks
- orchestration
- response formatting

---

## 4.3 Serializer Rules

Serializers must:

- validate input
- transform API data
- avoid business logic

---

## 4.4 AI Layer Rules

All Gemini API calls must go through:

```plaintext
/apps/ai/services.py
```

Do not invoke AI providers directly from:

- views
- models
- frontend code

AI outputs must:

- be stored separately
- include metadata
- remain traceable to original inputs

---

# 5. Styling Standards

## 5.1 Tailwind-Only Rule

Use Tailwind CSS exclusively for styling.

Avoid:

- inline CSS
- CSS modules
- styled-components
- external UI styling frameworks

---

## 5.2 UI Consistency Rules

Use `shadcn/ui` for:

- buttons
- dialogs
- forms
- dropdowns
- cards

Do not build duplicate UI primitives unless necessary.

---

## 5.3 Layout Rules

Dashboard pages must follow:

- sidebar navigation
- top header
- responsive content area

Use consistent spacing:

- `gap-4`
- `gap-6`
- `p-4`
- `p-6`

---

## 5.4 Design System Rules

Use:

- `rounded-xl` for cards
- `shadow-sm` for subtle depth
- consistent typography scale

Avoid:

- random custom spacing
- inconsistent font sizes
- unnecessary animations

---

# 6. API Routes Standards

## 6.1 Route Structure

All endpoints must follow:

```plaintext
/api/v1/<domain>/<resource>/
```

Examples:

```plaintext
/api/v1/surveys/
/api/v1/surveys/{id}/responses/
/api/v1/campaigns/{id}/analytics/
```

---

## 6.2 HTTP Method Rules

| Method    | Usage                                    |
| --------- | ---------------------------------------- |
| GET       | Retrieve data                            |
| POST      | Create resources                         |
| PUT/PATCH | Update resources                         |
| DELETE    | Remove resources (soft delete preferred) |

---

## 6.3 API Response Format

Successful response:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Error response:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

## 6.4 Pagination Rules

All list endpoints must support:

- `limit`
- `offset`

---

## 6.5 Idempotency Rules

Campaign sending endpoints must be idempotent.

Duplicate sends must be prevented at backend level.

---

# 7. Data and Storage Rules

## 7.1 PostgreSQL (Primary Database)

Used for:

- surveys
- questions
- responses
- campaigns
- analytics metadata
- AI metadata
- simulation metadata

### Database Rules

- Do not store large binary files in PostgreSQL.
- Use JSON fields only where schema flexibility is required.
- All models must include:
  - `created_at`
  - `updated_at`
  - `owner_id`

---

## 7.2 File Storage

Used for:

- PDF reports
- exported analytics
- QR code images

### Rules

- Store files externally or in object storage.
- Store only file references/URLs in PostgreSQL.

---

## 7.3 Cache Layer (Future / Optional)

Recommended:

- Redis

Used for:

- temporary caching
- rate limiting
- session optimization
- AI response caching

### Rules

- Cache is never source of truth.
- Database must remain authoritative.

---

# 8. File Organization Standards

## 8.1 Frontend Structure

```plaintext
/frontend
  /pages
  /features
    /surveys
    /distribution
    /analytics
    /chat-survey
  /components
  /hooks
  /lib
    /api
  /types
```

### Rules

- Shared UI components go in `/components`
- Feature-specific components stay inside feature folders
- API calls only inside `/lib/api`

---

## 8.2 Backend Structure

```plaintext
/backend
  /apps
    /surveys
    /responses
    /distribution
    /analytics
    /ai
    /simulation
    /auth
  /core
  /api
  /jobs
```

### Rules

Each Django app must include:

- models.py
- views.py
- serializers.py
- services.py

Avoid unnecessary cross-app imports.

---

## 8.3 Background Jobs Structure

```plaintext
/jobs
  email_campaigns
  reminders
  ai_processing
  simulation
  report_generation
```

### Rules

Background jobs must:

- be stateless
- be retry-safe
- produce logs
- handle failures gracefully

---

# 9. Architectural Constraints

The MVP intentionally does NOT include:

- microservices
- real-time streaming systems
- WhatsApp/social automation
- CRM functionality
- respondent marketplace
- autonomous AI interviewing

Do not introduce architecture that assumes these features exist.

---

# 10. Final Enforcement Rules

Code is considered invalid if it:

- mixes synthetic and real response data
- bypasses API layers
- places business logic in UI components
- violates ownership/access rules
- allows AI to overwrite raw survey data
- introduces speculative architecture outside MVP scope
