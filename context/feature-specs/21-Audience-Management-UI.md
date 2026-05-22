## Goal

Design and implement the frontend interface for InsightFlow’s audience management system, including audience management pages, contact upload workflows, and contact list interfaces.  
The outcome of this unit is a scalable and user-friendly audience management experience that enables users to organize, upload, and manage survey recipients efficiently.

---

# Design

## Audience Management Philosophy

The audience management experience should prioritize:

- scalability
- simplicity
- bulk management efficiency
- clean organization
- responsive interaction
- future campaign integration

The interface should support both small academic studies and large-scale distribution operations while remaining intuitive for non-technical users.

---

## UX Philosophy

The audience management system should feel:

- spreadsheet-friendly
- organized
- lightweight
- fast
- modern
- operationally efficient

---

## High-Level Audience Workflow

```txt
Create Audience
  ↓
Upload Contacts
  ↓
Review Contact List
  ↓
Manage Audience
  ↓
Attach to Campaigns
```

---

## UI Architecture Philosophy

The UI should clearly separate:

| Area | Purpose |
|---|---|
| Audience List | Audience organization |
| Audience Detail | Contact management |
| Upload Workflow | Bulk contact import |
| Contact Table | Recipient visibility |

---

## Mobile vs Desktop Philosophy

### Desktop

Desktop layouts should optimize for:

- table visibility
- bulk management
- filtering workflows

---

### Mobile

Mobile layouts should prioritize:

- readable cards
- simplified controls
- manageable scrolling

---

## Initial Scope

This unit should implement:

| Feature | Included |
|---|---|
| Audience list page | Yes |
| Audience detail page | Yes |
| Contact table UI | Yes |
| Upload modal/page | Yes |
| Basic search/filter UI | Yes |

---

## Deferred Features

The following should be postponed for future units:

- AI audience segmentation
- deduplication engine
- advanced filtering
- tagging systems
- audience analytics
- engagement scoring
- smart imports
- CRM synchronization

---

# Implementation

# 1. Audience Management Feature Architecture

## Objective

Create scalable frontend audience management architecture.

---

## Recommended Structure

```txt
/src/features/audiences
├── components
│   ├── audience-card.tsx
│   ├── audience-table.tsx
│   ├── audience-header.tsx
│   ├── audience-form.tsx
│   ├── audience-filters.tsx
│   ├── contact-table.tsx
│   ├── contact-row.tsx
│   ├── upload-modal.tsx
│   ├── upload-dropzone.tsx
│   ├── upload-preview.tsx
│   ├── upload-errors.tsx
│   ├── empty-state.tsx
│   └── audience-actions.tsx
│
├── hooks
│   ├── use-audiences.ts
│   ├── use-audience-detail.ts
│   ├── use-contact-upload.ts
│   └── use-contact-filters.ts
│
├── services
│   └── audience-api.ts
│
├── pages
│   ├── audiences-page.tsx
│   └── audience-detail-page.tsx
│
├── types
├── constants
└── utils
```

---

# 2. Audience Routing Structure

## Objective

Expose scalable audience management routes.

---

## Suggested Routes

| Route | Purpose |
|---|---|
| `/dashboard/audiences` | Audience list |
| `/dashboard/audiences/new` | Create audience |
| `/dashboard/audiences/:id` | Audience detail |
| `/dashboard/audiences/:id/edit` | Edit audience |

---

## Routing Philosophy

Audience routes should integrate seamlessly into the dashboard navigation system from Unit 7.

---

# 3. Audience List Page

## Objective

Display all user audiences in a manageable overview interface.

---

## File

```txt
audiences-page.tsx
```

---

## Responsibilities

The audience list page should:

- display audience summaries
- support audience creation
- support search/filtering
- provide quick navigation

---

## Suggested Layout Structure

```txt
Page Header
↓
Search & Filters
↓
Audience Grid/Table
↓
Pagination
```

---

## Audience Card Information

Each audience card should display:

- audience name
- contact count
- creation date
- description preview
- quick actions

---

# 4. Audience Detail Page

## Objective

Provide centralized audience management interface.

---

## File

```txt
audience-detail-page.tsx
```

---

## Responsibilities

The detail page should:

- display audience metadata
- render contact list
- expose upload actions
- support contact management

---

## Suggested Layout

```txt
Audience Header
↓
Audience Stats
↓
Upload Actions
↓
Contact Table
```

---

# 5. Contact List UI

## Objective

Render audience recipients clearly and efficiently.

---

## File

```txt
contact-table.tsx
```

---

## Responsibilities

The contact table should display:

- email
- first name
- last name
- metadata preview
- creation date

---

## Suggested Table Columns

| Column | Purpose |
|---|---|
| Email | Primary identity |
| First Name | Personalization |
| Last Name | Personalization |
| Tags/Metadata | Context |
| Added Date | Timeline |

---

## Empty State Requirements

When no contacts exist:

```txt
Display upload guidance
```

---

# 6. Upload Interface System

## Objective

Provide bulk contact upload workflows.

---

## Suggested Components

| Component | Responsibility |
|---|---|
| upload-modal.tsx | Upload container |
| upload-dropzone.tsx | File selection |
| upload-preview.tsx | Parsed preview |
| upload-errors.tsx | Validation feedback |

---

## Upload UX Philosophy

The upload experience should feel:

- guided
- safe
- transparent
- recoverable

---

# 7. CSV Upload Workflow

## Objective

Support audience contact imports.

---

## Initial Supported Formats

| Format | Supported |
|---|---|
| CSV | Yes |
| XLSX | Future |
| Google Sheets | Future |

---

## Suggested Workflow

```txt
Upload CSV
→ Parse Contacts
→ Validate Structure
→ Preview Data
→ Confirm Import
```

---

## Required CSV Fields

Minimum required field:

```txt
email
```

---

## Optional Fields

| Field | Optional |
|---|---|
| first_name | Yes |
| last_name | Yes |
| tags | Future |
| metadata | Future |

---

# 8. Upload Validation System

## Objective

Prevent invalid contact imports.

---

## Validation Rules

Validate:

- email format
- duplicate rows
- required fields
- malformed CSV structure

---

## Suggested Validation UX

Display:

- row-level errors
- upload summaries
- skipped rows
- validation counts

---

## Error UX Example

```txt
12 valid contacts
2 invalid rows
```

---

# 9. Upload Preview Interface

## Objective

Allow users to verify imported contacts before confirmation.

---

## Responsibilities

The preview should display:

- parsed contacts
- validation results
- import counts
- detected issues

---

## Suggested Layout

```txt
Upload Summary
↓
Validation Results
↓
Preview Table
↓
Import Confirmation
```

---

# 10. Audience Creation UI

## Objective

Enable audience creation workflows.

---

## File

```txt
audience-form.tsx
```

---

## Required Fields

| Field | Required |
|---|---|
| Name | Yes |
| Description | No |

---

## UX Philosophy

Audience creation should feel:

- fast
- lightweight
- non-blocking

---

# 11. Search & Filtering UI

## Objective

Improve large audience management usability.

---

## Suggested Features

Support:

- search by email
- search by name
- sort by creation date
- contact count sorting

---

## Suggested Component

```txt
audience-filters.tsx
```

---

## Future Expansion

Architecture should support:

- segmentation filters
- tags
- engagement filtering
- campaign filtering

---

# 12. Bulk Action Preparation

## Objective

Prepare scalable contact management workflows.

---

## Future Bulk Features

Architecture should support:

- bulk deletion
- bulk tagging
- export selection
- campaign assignment

---

## Current Scope

Only structure UI to support future expansion.

---

# 13. Audience Statistics UI

## Objective

Provide lightweight audience insights.

---

## Suggested Metrics

Display:

- total contacts
- recently added contacts
- audience size
- upload activity

---

## Suggested UI Pattern

Use:

```txt
Compact stat cards
```

---

# 14. API Integration Layer

## Objective

Connect UI to audience backend infrastructure.

---

## Suggested API Hooks

| Hook | Responsibility |
|---|---|
| useAudiences() | Audience listing |
| useAudienceDetail() | Audience detail |
| useContactUpload() | Upload workflows |

---

## Suggested Backend Endpoints

| Method | Endpoint |
|---|---|
| GET | `/api/v1/audiences/` |
| POST | `/api/v1/audiences/` |
| GET | `/api/v1/audiences/:id/` |
| POST | `/api/v1/audiences/:id/upload/` |

---

# 15. Loading & Empty States

## Objective

Provide polished operational UX.

---

## Required Loading States

### Audience Loading

```txt
Loading audiences...
```

---

### Upload Processing

```txt
Processing contacts...
```

---

## Required Empty States

### No Audiences

```txt
Create your first audience
```

---

### No Contacts

```txt
Upload contacts to begin
```

---

# 16. Error Handling System

## Objective

Handle audience management failures gracefully.

---

## Supported Error States

| Error Type | Example |
|---|---|
| Upload Failure | Invalid file |
| API Failure | Network issue |
| Validation Failure | Duplicate emails |
| Empty Import | No contacts found |

---

## Recovery Philosophy

Users should always be able to:

- retry uploads
- edit imports
- preserve progress

---

# 17. Accessibility Requirements

## Objective

Ensure inclusive audience management workflows.

---

## Accessibility Standards

The interface should support:

- keyboard navigation
- screen readers
- accessible tables
- focus management
- upload accessibility

---

## Required Behaviors

### Upload Accessibility

Upload interfaces should support:

- keyboard-triggered uploads
- visible upload instructions
- accessible error announcements

---

### Table Accessibility

Tables should:

- use semantic structure
- support screen reader navigation

---

# 18. Mobile Optimization

## Objective

Ensure mobile-friendly audience workflows.

---

## Mobile UX Rules

The interface should support:

- responsive tables
- stacked layouts
- simplified actions
- mobile upload compatibility

---

## Contact Table Mobile Strategy

On smaller screens:

```txt
Convert table rows into stacked cards
```

---

# 19. Theme Integration

## Objective

Ensure compatibility with InsightFlow design system.

---

## Theme Areas

The following should support theme variables:

- upload modals
- tables
- cards
- buttons
- validation states

---

## Dark Mode Requirements

Dark mode should maintain:

- readable tables
- accessible contrasts
- visible upload states

---

# 20. Future Extensibility Preparation

## Objective

Prepare audience management for advanced campaign systems.

---

## Future Features Supported

Architecture should support:

- AI audience segmentation
- smart deduplication
- CRM integration
- campaign assignment
- engagement analytics
- audience scoring
- contact tagging
- behavioral targeting

---

## Extensibility Philosophy

Keep:

- upload workflows modular
- tables reusable
- filtering isolated
- API hooks centralized

---

# 21. Developer Experience Standards

## Objective

Maintain scalable frontend engineering practices.

---

## Rules

Audience workflows should:

- isolate upload logic
- centralize API communication
- separate validation from UI
- avoid duplicated table logic

---

## Architectural Principles

Prefer:

- reusable tables
- modular upload systems
- isolated validation hooks
- centralized API services

Avoid:

- tightly coupled upload workflows
- duplicated filtering logic
- hardcoded table structures

---

# Dependencies

# Existing Frontend Dependencies

```txt
react
typescript
tailwindcss
shadcn/ui
@tanstack/react-query
axios
react-hook-form
zod
```

---

# Required New Dependencies

```bash
npm install react-dropzone
```

---

```bash
npm install papaparse
```

for CSV parsing.

---

# Optional Recommended Dependencies

```bash
npm install react-table
```

for advanced table workflows.

---

```bash
npm install sonner
```

for upload notifications.

---

# Recommended shadcn/ui Components

```bash
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dropdown-menu
npx shadcn@latest add skeleton
```

---

# Related Units

This unit depends on:

```txt
Unit 7 — Dashboard Layout & Navigation UI
```

---

# Verification Checklist

# Audience Pages

- [ ] Audience list page renders correctly
- [ ] Audience detail page functions properly
- [ ] Audience creation UI works
- [ ] Dashboard routing integrated successfully

---

# Contact List UI

- [ ] Contact tables render correctly
- [ ] Contact metadata visible
- [ ] Empty states display properly
- [ ] Responsive layouts function

---

# Upload Workflows

- [ ] CSV uploads function correctly
- [ ] File parsing works
- [ ] Validation catches invalid rows
- [ ] Upload preview displays accurately

---

# Validation & Error Handling

- [ ] Invalid emails rejected
- [ ] Duplicate rows detected
- [ ] Upload errors displayed clearly
- [ ] Recovery workflows function properly

---

# Search & Filtering

- [ ] Search functionality works
- [ ] Sorting functions correctly
- [ ] Filters update dynamically
- [ ] Large audience handling remains performant

---

# Accessibility

- [ ] Keyboard navigation works
- [ ] Screen readers supported
- [ ] Upload accessibility implemented
- [ ] Table accessibility validated

---

# Mobile Optimization

- [ ] Mobile layouts responsive
- [ ] Tables convert appropriately
- [ ] Upload workflows mobile-compatible
- [ ] Touch interactions optimized

---

# Theme Compatibility

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Upload states visible
- [ ] Table readability preserved

---

# Performance

- [ ] Large contact lists remain performant
- [ ] Upload processing responsive
- [ ] Table rendering optimized
- [ ] Filtering efficient

---

# Developer Experience

- [ ] Upload logic modularized
- [ ] API hooks reusable
- [ ] Validation centralized
- [ ] Architecture scalable for advanced audience systems

---

# Visible Result

By the end of Unit 21:

- audience management screens are fully operational
- users can create and manage audiences visually
- contact upload workflows function correctly
- responsive contact list interfaces are available
- scalable audience management infrastructure is established
- InsightFlow has a production-ready frontend foundation for campaign targeting, audience segmentation, outreach automation, and future AI-powered distribution systems