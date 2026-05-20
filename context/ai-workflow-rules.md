# InsightFlow — AI Workflow Rules

This document defines mandatory execution rules for any AI coding agent working on InsightFlow. These rules exist to ensure predictable, safe, incremental, and architecture-compliant development.

---

# 1. Overall Development Approach

## 1.1 Follow Spec-Driven Execution

- Always implement features strictly based on provided specs (PRD, architecture, or code standards).
- Do not invent features, endpoints, or behaviors not explicitly defined.
- Treat documentation as the source of truth over assumptions.

## 1.2 Work Incrementally

- Build the system one **small, verifiable unit at a time**.
- Never attempt full-feature implementation in a single step.
- Each change must produce a runnable or testable improvement.

## 1.3 Preserve System Stability

- Do not modify working modules unless explicitly instructed.
- Do not refactor unrelated code during feature implementation.

---

# 2. Scoping Rules

## 2.1 Single Unit Rule

- Only implement ONE of the following per task:
  - one API endpoint
  - one frontend feature
  - one background job
  - one model/service change
- If a task contains multiple units, split it before execution.

## 2.2 No Speculation Rule

- Do not add “future-proofing” code.
- Do not implement features that are “likely needed later.”
- Do not assume missing requirements.

## 2.3 No Cross-Domain Expansion

- Backend tasks must not modify frontend logic.
- Frontend tasks must not alter backend logic unless explicitly stated.
- AI module changes must remain isolated within `/apps/ai`.

---

# 3. Task Splitting Rules

Split work into smaller tasks when:

- More than one domain is affected (e.g., surveys + analytics)
- More than one API endpoint is required
- More than one model/table is modified
- More than 150–200 lines of code would be added in a single change
- UI + backend changes are requested together

Each split task must:

- be independently testable
- have a clear input/output boundary
- not depend on future unimplemented tasks

---

# 4. Handling Missing or Ambiguous Requirements

## 4.1 Stop and Clarify Rule

- If a requirement is ambiguous, STOP implementation.
- Do NOT guess behavior.

## 4.2 Allowed Minimal Assumptions

Only assume:

- standard REST conventions
- existing architecture rules
- previously defined data models

## 4.3 Required Action for Ambiguity

When unclear:

- explicitly list missing details
- propose 1–2 possible interpretations
- wait for confirmation before proceeding

---

# 5. Protected Files and Components

## 5.1 Never Modify Without Explicit Instruction

Do NOT modify:

### UI Library / External Components

- `shadcn/ui` components
- third-party UI primitives
- any auto-generated UI components

### Core Infrastructure

- authentication middleware (Clerk integration layer)
- background job configuration (Trigger.dev setup)
- API base routing structure (`/api/v1/`)
- Django core settings (`settings.py` unless explicitly required)

### AI Orchestration Core

- `/apps/ai/services.py` core pipeline logic unless explicitly instructed
- simulation safety constraints logic

---

## 5.2 Safe Modification Areas

You MAY modify:

- feature-specific components inside `/features/*`
- Django app logic inside domain apps
- serializers, services, and views inside relevant app
- frontend API wrapper (`/lib/api`) when endpoints change

---

# 6. Documentation Synchronization Rules

## 6.1 Mandatory Update Rule

- Any change to:
  - API structure
  - data models
  - workflow logic
    MUST be reflected in documentation.

## 6.2 Required Docs to Update

Depending on change type:

- API change → update API contract documentation
- backend logic change → update architecture.md
- feature behavior change → update project-overview.md if relevant
- workflow change → update ai-workflow-rules.md if needed

## 6.3 No Silent Drift Rule

- Implementation and documentation must never diverge.
- If mismatch is detected, fix documentation immediately before proceeding.

---

# 7. Execution Discipline Rules

## 7.1 No Multi-Step Implementation Without Approval

- Do not implement Step 2 before Step 1 is validated.
- Each step must complete full implementation + verification.

## 7.2 No Mixed Concerns

- Do not mix:
  - UI logic + backend logic in one step
  - AI logic + analytics logic in one step
  - simulation logic + real response logic in one step

## 7.3 No Refactor During Feature Work

- Do not refactor unrelated code while implementing a feature.
- Refactoring is a separate, explicit task.

---

# 8. AI Feature Safety Rules

## 8.1 AI Output Isolation

- AI outputs must NEVER overwrite raw survey data.
- AI results must be stored separately with reference IDs.

## 8.2 Simulation Mode Isolation

- Synthetic responses must:
  - be stored in separate tables OR flagged explicitly
  - never be mixed with real responses in queries or analytics
  - only be generated when simulation mode is enabled

## 8.3 AI is Non-Authoritative

- AI outputs are advisory only.
- AI cannot determine system state or modify business logic.

---

# 9. Backend and API Rules

## 9.1 Endpoint Discipline

- Every endpoint must follow `/api/v1/<domain>/<resource>/`
- No ad-hoc or unversioned endpoints allowed.

## 9.2 Service Layer Rule

- Business logic MUST live in `services.py`
- Views must remain thin and orchestration-only

## 9.3 Response Consistency

- All API responses must follow standard format:
  - `{ success, data, error }`

---

# 10. Verification Checklist (MANDATORY BEFORE COMPLETION)

Before marking any task complete, verify:

## Code Correctness

- [ ] Code follows project architecture rules
- [ ] No unrelated files were modified
- [ ] No speculative features added

## Scope Compliance

- [ ] Only one unit was implemented
- [ ] No cross-domain leakage occurred

## Data Safety

- [ ] No raw data overwritten
- [ ] No mixing of synthetic and real data

## API Integrity (if applicable)

- [ ] Endpoint follows versioning rules
- [ ] Response format is consistent
- [ ] Frontend API wrapper updated if needed

## Documentation Sync

- [ ] Relevant documentation updated
- [ ] No mismatch between code and docs

## Final Validation

- [ ] Feature works in isolation
- [ ] No breaking changes introduced
- [ ] System remains stable

---

# 11. Final Enforcement Rule

If any rule in this document conflicts with implementation convenience:

👉 This document takes priority.
👉 Do not proceed until compliance is restored.
