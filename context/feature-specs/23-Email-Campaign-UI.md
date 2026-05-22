## Goal

Design and implement the frontend interface for InsightFlow’s email campaign system, including campaign creation workflows, email template editing interfaces, and send/schedule management screens.  
The outcome of this unit is a polished and scalable email campaign experience that visually supports survey outreach, distribution preparation, and future automated campaign orchestration.

---

# Design

## Email Campaign UX Philosophy

The email campaign system should prioritize:

- simplicity
- clarity
- campaign organization
- scalable workflows
- responsive interactions
- future automation compatibility

The interface should feel modern and approachable while remaining powerful enough for academic institutions, researchers, and organizational survey campaigns.

---

## Campaign Workflow Philosophy

The email campaign lifecycle should support:

```txt
Create Campaign
→ Select Audience
→ Compose Email
→ Preview Campaign
→ Send or Schedule
```

---

## Core UI Separation Philosophy

The UI should clearly separate:

| Area | Purpose |
|---|---|
| Campaign Setup | Campaign metadata |
| Audience Selection | Distribution targeting |
| Email Editor | Message composition |
| Scheduling Panel | Delivery timing |
| Preview Area | Final verification |

---

## Visual Style Philosophy

The campaign experience should feel:

- professional
- lightweight
- operationally efficient
- dashboard-native
- email-platform inspired

---

## Initial Scope

This unit should implement:

| Feature | Included |
|---|---|
| Campaign creation page | Yes |
| Email template editor UI | Yes |
| Audience selection UI | Yes |
| Send/schedule interface | Yes |
| Email preview UI | Yes |

---

## Deferred Features

The following should be postponed for future units:

- actual email delivery
- campaign analytics
- AI email generation
- drag-and-drop editors
- automated reminders
- A/B testing
- engagement tracking
- multi-step automation flows

---

# Implementation

# 1. Email Campaign Feature Architecture

## Objective

Create scalable frontend campaign management architecture.

---

## Recommended Structure

```txt
/src/features/email-campaigns
├── components
│   ├── campaign-form.tsx
│   ├── campaign-header.tsx
│   ├── campaign-sidebar.tsx
│   ├── audience-selector.tsx
│   ├── template-editor.tsx
│   ├── subject-line-input.tsx
│   ├── sender-settings.tsx
│   ├── schedule-panel.tsx
│   ├── send-actions.tsx
│   ├── campaign-preview.tsx
│   ├── preview-modal.tsx
│   ├── email-layout.tsx
│   ├── variable-insert-menu.tsx
│   ├── template-toolbar.tsx
│   ├── campaign-status-badge.tsx
│   ├── empty-state.tsx
│   └── loading-state.tsx
│
├── hooks
│   ├── use-campaign-form.ts
│   ├── use-template-preview.ts
│   ├── use-schedule-state.ts
│   ├── use-audience-selection.ts
│   └── use-email-preview.ts
│
├── services
│   └── campaign-api.ts
│
├── pages
│   ├── campaigns-page.tsx
│   ├── create-campaign-page.tsx
│   └── campaign-detail-page.tsx
│
├── utils
│   ├── template-utils.ts
│   ├── variable-utils.ts
│   └── preview-utils.ts
│
├── types
├── constants
└── state
```

---

# 2. Routing Structure

## Objective

Expose scalable campaign management routes.

---

## Suggested Routes

| Route | Purpose |
|---|---|
| `/dashboard/campaigns` | Campaign list |
| `/dashboard/campaigns/new` | Create campaign |
| `/dashboard/campaigns/:id` | Campaign detail |
| `/dashboard/campaigns/:id/edit` | Edit campaign |

---

## Navigation Philosophy

Campaign routes should integrate naturally into the dashboard sidebar navigation from Unit 7.

---

# 3. Campaign Creation Page

## Objective

Provide centralized campaign setup experience.

---

## File

```txt
create-campaign-page.tsx
```

---

## Responsibilities

The campaign creation page should support:

- campaign naming
- survey selection
- audience assignment
- email composition
- scheduling configuration

---

## Suggested Layout Structure

```txt
Campaign Header
↓
Campaign Settings
↓
Audience Selection
↓
Email Template Editor
↓
Preview & Scheduling
↓
Send Actions
```

---

# 4. Campaign Metadata UI

## Objective

Collect campaign configuration data.

---

## Required Fields

| Field | Required |
|---|---|
| Campaign Name | Yes |
| Survey | Yes |
| Audience | Yes |
| Subject Line | Yes |

---

## Optional Fields

| Field | Optional |
|---|---|
| Internal Notes | Yes |
| Preview Text | Yes |
| Sender Name | Future |
| Reply-To Address | Future |

---

# 5. Audience Selection Interface

## Objective

Allow campaign targeting workflows.

---

## File

```txt
audience-selector.tsx
```

---

## Responsibilities

The selector should:

- list available audiences
- display audience sizes
- support multi-select preparation
- provide search/filtering

---

## Suggested UI Pattern

Use:

```txt
Searchable selection cards
```

or

```txt
Combobox dropdown
```

---

## Display Information

Each audience option should display:

- audience name
- recipient count
- creation date

---

# 6. Email Template Editor UI

## Objective

Provide email composition workflows.

---

## File

```txt
template-editor.tsx
```

---

## Responsibilities

The editor should support:

- rich text editing
- formatting controls
- survey link insertion
- personalization placeholders
- responsive previewing

---

## Suggested Toolbar Features

| Feature | Included |
|---|---|
| Bold | Yes |
| Italic | Yes |
| Links | Yes |
| Lists | Yes |
| Headings | Yes |
| Variables | Yes |

---

## Initial Scope

Use:

```txt
Simple rich text editor
```

instead of full drag-and-drop builders.

---

# 7. Personalization Variable System

## Objective

Prepare dynamic email personalization workflows.

---

## Suggested Variables

| Variable | Example |
|---|---|
| `{{first_name}}` | John |
| `{{survey_link}}` | Public survey URL |
| `{{campaign_name}}` | Student Outreach |

---

## Suggested Component

```txt
variable-insert-menu.tsx
```

---

## Future Expansion

Architecture should support:

- AI-generated variables
- conditional personalization
- behavioral personalization

---

# 8. Subject Line Editor

## Objective

Support campaign email configuration.

---

## File

```txt
subject-line-input.tsx
```

---

## Responsibilities

The input should:

- enforce length guidance
- support variables
- display live preview

---

## Suggested UX Guidance

```txt
Recommended: under 60 characters
```

---

# 9. Email Preview System

## Objective

Provide accurate campaign previews.

---

## File

```txt
campaign-preview.tsx
```

---

## Responsibilities

The preview should display:

- email body
- subject line
- personalization examples
- survey link rendering

---

## Suggested Preview Modes

| Mode | Purpose |
|---|---|
| Desktop | Email client preview |
| Mobile | Mobile email preview |

---

# 10. Scheduling Interface

## Objective

Prepare delivery timing workflows.

---

## File

```txt
schedule-panel.tsx
```

---

## Initial Scope

Support:

| Action | Included |
|---|---|
| Send Immediately | Yes |
| Schedule Send | UI only |
| Save Draft | Yes |

---

## Suggested Scheduling UI

```txt
Date Picker
+
Time Picker
```

---

## Deferred Logic

Actual scheduling infrastructure will be implemented in future backend units.

---

# 11. Send Action Interface

## Objective

Provide clear campaign actions.

---

## Suggested Actions

| Action | Included |
|---|---|
| Save Draft | Yes |
| Preview Email | Yes |
| Send Test | UI only |
| Schedule Campaign | UI only |

---

## Suggested Component

```txt
send-actions.tsx
```

---

# 12. Campaign Status UI

## Objective

Display campaign lifecycle state visually.

---

## Suggested Statuses

| Status | Purpose |
|---|---|
| Draft | In progress |
| Ready | Configured |
| Scheduled | Pending send |
| Sent | Completed |

---

## Suggested Component

```txt
campaign-status-badge.tsx
```

---

# 13. Survey Link Integration

## Objective

Connect campaigns to public survey distribution.

---

## Responsibilities

The editor should support:

- automatic survey link insertion
- conversational survey links
- preview rendering

---

## Suggested Insert Options

| Link Type | Included |
|---|---|
| Standard Survey | Yes |
| Conversational Survey | Yes |

---

# 14. Template Layout System

## Objective

Provide reusable email structures.

---

## Initial Layouts

| Template | Included |
|---|---|
| Minimal Invite | Yes |
| Academic Survey | Yes |
| Reminder Layout | Placeholder |

---

## Suggested Component

```txt
email-layout.tsx
```

---

# 15. Mobile Responsiveness

## Objective

Ensure mobile-friendly campaign workflows.

---

## Mobile UX Rules

The interface should support:

- stacked layouts
- collapsible sections
- responsive editors
- mobile preview modes

---

## Mobile Editor Philosophy

On smaller screens:

```txt
Prioritize readability over toolbar density
```

---

# 16. Loading & Empty States

## Objective

Provide polished operational UX.

---

## Required Loading States

### Campaign Loading

```txt
Loading campaign...
```

---

### Preview Loading

```txt
Generating preview...
```

---

## Required Empty States

### No Audiences

```txt
Create an audience to begin campaign distribution
```

---

### No Campaigns

```txt
Create your first email campaign
```

---

# 17. Error Handling System

## Objective

Handle campaign creation failures gracefully.

---

## Supported Error States

| Error Type | Example |
|---|---|
| Missing Audience | Validation issue |
| Empty Subject | Required field |
| Invalid Schedule | Scheduling conflict |
| API Failure | Network issue |

---

## Recovery Philosophy

Users should always be able to:

- preserve draft state
- retry failed actions
- continue editing

---

# 18. Accessibility Requirements

## Objective

Ensure inclusive campaign management workflows.

---

## Accessibility Standards

The interface should support:

- keyboard navigation
- screen readers
- accessible forms
- focus management
- editor accessibility

---

## Required Behaviors

### Editor Accessibility

The email editor should:

- support keyboard formatting
- expose accessible toolbar labels

---

### Preview Accessibility

Preview sections should:

- remain readable
- preserve semantic structure

---

# 19. Theme Integration

## Objective

Ensure compatibility with InsightFlow design system.

---

## Theme Areas

The following should support theme variables:

- editors
- toolbars
- forms
- previews
- status badges
- scheduling panels

---

## Dark Mode Requirements

Dark mode should maintain:

- readable editor content
- accessible toolbar visibility
- proper contrast

---

# 20. API Integration Preparation

## Objective

Prepare campaign UI for backend integration.

---

## Suggested Future Endpoints

| Method | Endpoint |
|---|---|
| GET | `/api/v1/campaigns/` |
| POST | `/api/v1/campaigns/` |
| PATCH | `/api/v1/campaigns/:id/` |

---

## Current Scope

This unit should focus on:

```txt
UI workflows and local state handling
```

not actual campaign sending.

---

# 21. Future Extensibility Preparation

## Objective

Prepare email campaign UI for advanced automation systems.

---

## Future Features Supported

Architecture should support:

- AI email generation
- automated reminders
- campaign analytics
- A/B testing
- smart scheduling
- engagement tracking
- multi-step workflows
- visual drag-and-drop builders

---

## Extensibility Philosophy

Keep:

- editor modular
- scheduling isolated
- campaign state centralized
- templates reusable

---

# 22. Developer Experience Standards

## Objective

Maintain scalable frontend campaign engineering practices.

---

## Rules

Campaign workflows should:

- isolate editor state
- centralize template utilities
- separate preview rendering
- avoid duplicated scheduling logic

---

## Architectural Principles

Prefer:

- reusable editors
- isolated preview systems
- centralized campaign state
- modular toolbar actions

Avoid:

- hardcoded templates
- tightly coupled preview logic
- monolithic editor components

---

# Dependencies

# Existing Frontend Dependencies

```txt
react
typescript
tailwindcss
shadcn/ui
@tanstack/react-query
react-hook-form
zod
```

---

# Required New Dependencies

```bash
npm install @tiptap/react
```

---

```bash
npm install @tiptap/starter-kit
```

---

## Optional Recommended Dependencies

```bash
npm install date-fns
```

for scheduling UI formatting.

---

```bash
npm install react-email
```

for future email rendering support.

---

```bash
npm install sonner
```

for notifications and draft-save feedback.

---

# Recommended shadcn/ui Components

```bash
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add popover
npx shadcn@latest add calendar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add card
npx shadcn@latest add badge
```

---

# Related Units

This unit depends on:

```txt
Unit 21 — Audience Management UI
```

---

# Verification Checklist

# Campaign Creation UI

- [ ] Campaign creation page renders correctly
- [ ] Campaign forms function properly
- [ ] Audience selection works visually
- [ ] Survey assignment UI operational

---

# Email Template Editor

- [ ] Rich text editor functions correctly
- [ ] Formatting controls work
- [ ] Variable insertion works visually
- [ ] Template layouts render properly

---

# Preview System

- [ ] Email previews generate correctly
- [ ] Mobile previews display properly
- [ ] Survey links render correctly
- [ ] Personalization placeholders display

---

# Scheduling UI

- [ ] Schedule controls function visually
- [ ] Date picker works
- [ ] Time picker works
- [ ] Draft actions operational

---

# Accessibility

- [ ] Keyboard navigation works
- [ ] Screen readers supported
- [ ] Editor accessibility validated
- [ ] Accessible forms implemented

---

# Mobile Optimization

- [ ] Mobile layouts responsive
- [ ] Editor usable on small screens
- [ ] Preview modes responsive
- [ ] Touch interactions optimized

---

# Theme Compatibility

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Editor readability preserved
- [ ] Status badges visible

---

# Performance

- [ ] Editor remains responsive
- [ ] Preview rendering efficient
- [ ] State updates optimized
- [ ] UI interactions smooth

---

# Developer Experience

- [ ] Editor modularized
- [ ] Campaign state centralized
- [ ] Template utilities reusable
- [ ] Architecture scalable for automation systems

---

# Visible Result

By the end of Unit 23:

- email campaign workflows exist visually
- users can configure campaigns through polished interfaces
- audience selection and email composition workflows function visually
- send/schedule interfaces are operational at the UI level
- scalable campaign management frontend architecture is established
- InsightFlow has a production-ready foundation for future automated outreach, campaign analytics, AI email generation, and intelligent survey distribution systems