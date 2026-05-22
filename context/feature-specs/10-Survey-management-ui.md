## Goal

Design and implement the core survey management frontend experience for InsightFlow, including survey listing, survey creation, survey detail views, and an interactive survey editor interface.  
The outcome of this unit is a production-ready survey management system where authenticated users can visually create, organize, edit, and manage surveys through a scalable dashboard interface.

---

# Design

## Survey Management UX Philosophy

The survey management experience should feel:

- intuitive
- structured
- fast
- research-oriented
- productivity-focused
- scalable for complex survey workflows

The UI should minimize friction while enabling users to efficiently manage survey structures and question flows.

---

## Survey Workflow Philosophy

The survey management system should support the following lifecycle:

```txt
Create Survey
→ Edit Questions
→ Organize Structure
→ Save Draft
→ Publish Survey
```

---

## Survey UI Architecture

### High-Level Structure

```txt
Survey Management
├── Survey List Page
├── Survey Creation Page
├── Survey Detail Page
└── Survey Editor
```

---

## Visual Design Direction

The survey management UI should align with the InsightFlow dashboard system.

### Design Characteristics

- clean dashboard layouts
- card-based organization
- modular editor panels
- soft shadows
- spacious forms
- responsive grids
- drag-ready architecture
- clear hierarchy

---

## Survey Editor Philosophy

The editor should feel similar to:

- Notion-style block editing
- Typeform-style structure management
- Google Forms-style simplicity
- Airtable-inspired organization

The interface should prioritize future extensibility for advanced survey workflows.

---

## Responsive Design Philosophy

Survey management pages must fully support:

| Device | Support |
|---|---|
| Mobile | Yes |
| Tablet | Yes |
| Desktop | Yes |

---

## Mobile Design Strategy

On mobile:

- stacked layouts
- simplified controls
- collapsible panels
- vertical question organization

---

## Desktop Design Strategy

On desktop:

- multi-panel editing
- persistent editor controls
- larger workspace
- scalable content organization

---

# Implementation

# 1. Survey Feature Architecture

## Objective

Create isolated survey frontend architecture.

---

## Recommended Structure

```txt
/src/features/surveys
├── components
│   ├── survey-card.tsx
│   ├── survey-list.tsx
│   ├── survey-form.tsx
│   ├── survey-editor.tsx
│   ├── question-card.tsx
│   ├── question-editor.tsx
│   ├── question-toolbar.tsx
│   ├── empty-state.tsx
│   ├── survey-header.tsx
│   └── survey-status-badge.tsx
│
├── pages
│   ├── survey-list-page.tsx
│   ├── survey-create-page.tsx
│   ├── survey-detail-page.tsx
│   └── survey-editor-page.tsx
│
├── hooks
│   ├── use-surveys.ts
│   ├── use-survey.ts
│   └── use-questions.ts
│
├── services
│   └── survey-api.ts
│
├── types
├── constants
└── utils
```

---

# 2. Survey List Page

## Objective

Display all user surveys in an organized dashboard view.

---

## File

```txt
survey-list-page.tsx
```

---

## Route

```txt
/surveys
```

---

## Responsibilities

The page should:

- fetch authenticated user surveys
- display survey summaries
- support navigation to survey details
- provide survey creation entry point

---

## Layout Structure

```txt
Page Header
├── Title
├── Search Placeholder
├── Create Survey Button

Survey Grid/List
├── Survey Cards
└── Empty State
```

---

## Survey Card Design

Each survey card should display:

- survey title
- short description
- survey status
- question count
- last updated timestamp
- quick actions

---

## Suggested Quick Actions

| Action | Purpose |
|---|---|
| Edit | Open editor |
| View | Open detail page |
| Delete | Remove survey |
| Publish | Change status |

---

## Empty State Design

When no surveys exist:

```txt
Illustration
+ Create Survey CTA
+ Helper description
```

---

# 3. Survey Creation Page

## Objective

Allow users to initialize new surveys.

---

## File

```txt
survey-create-page.tsx
```

---

## Route

```txt
/surveys/create
```

---

## Form Fields

### Title

```txt
Required
```

---

### Description

```txt
Optional
```

---

### Visibility (future-ready)

```txt
Private / Public
```

---

## Form UX

The form should support:

- inline validation
- loading states
- success/error messaging
- auto-navigation after creation

---

## Post-Creation Flow

After successful creation:

```txt
Redirect to survey editor
```

---

# 4. Survey Detail Page

## Objective

Provide survey overview and management controls.

---

## File

```txt
survey-detail-page.tsx
```

---

## Route

```txt
/surveys/:surveyId
```

---

## Responsibilities

Display:

- survey metadata
- question summary
- survey status
- creation information
- quick management actions

---

## Suggested Sections

### Survey Overview

Displays:

- title
- description
- status
- ownership
- timestamps

---

### Question Summary

Displays:

- total questions
- question types
- completion structure

---

### Management Actions

Actions:

- Edit Survey
- Publish
- Duplicate (future)
- Delete

---

# 5. Survey Editor UI

## Objective

Create interactive survey editing interface.

---

## File

```txt
survey-editor-page.tsx
```

---

## Route

```txt
/surveys/:surveyId/edit
```

---

## Editor Responsibilities

The editor should support:

- question creation
- question editing
- question ordering
- survey metadata editing
- question deletion

---

## Editor Layout Structure

### Desktop Layout

```txt
Sidebar Panel | Main Editor Workspace
```

---

### Mobile Layout

```txt
Stacked Editor Sections
```

---

# 6. Question Management System

## Objective

Provide modular question editing workflows.

---

## Supported Question Types

| Type | Description |
|---|---|
| Short Text | Single-line response |
| Long Text | Paragraph response |
| Multiple Choice | Single selection |
| Checkbox | Multi-selection |
| Rating | Numeric scale |

---

## Question Card Structure

Each question should display:

- question title
- question type
- required badge
- ordering controls
- edit/delete actions

---

## Question Toolbar

### Responsibilities

Allow users to:

- add new question
- select question type
- duplicate question (future)
- reorder questions

---

# 7. Question Editor Component

## Objective

Provide editable question configuration UI.

---

## File

```txt
question-editor.tsx
```

---

## Editable Properties

### Question Text

Editable text field.

---

### Question Type

Dropdown selector.

---

### Required Toggle

Boolean toggle.

---

### Metadata Fields

Future-ready support for:

- choices
- rating ranges
- validation rules

---

# 8. Survey Editor State Management

## Objective

Handle editor interactions efficiently.

---

## Recommended Strategy

Use:

```txt
React Query + Local Component State
```

---

## State Categories

### Server State

Managed with:

```txt
TanStack Query
```

---

### Local Editing State

Managed with:

```txt
useState/useReducer
```

---

## Future Scalability

Architecture should support:

- autosave
- collaborative editing
- optimistic updates
- undo/redo

---

# 9. API Integration Layer

## Objective

Connect frontend survey UI to backend APIs.

---

## File

```txt
services/survey-api.ts
```

---

## Responsibilities

Should handle:

- survey CRUD requests
- question CRUD requests
- API error handling
- auth token integration

---

## Suggested API Functions

```ts
getSurveys()
getSurveyById()
createSurvey()
updateSurvey()
deleteSurvey()

createQuestion()
updateQuestion()
deleteQuestion()
```

---

# 10. Survey Routing Structure

## Objective

Establish scalable survey routing.

---

## Suggested Routes

| Route | Purpose |
|---|---|
| `/surveys` | Survey list |
| `/surveys/create` | Create survey |
| `/surveys/:id` | Survey detail |
| `/surveys/:id/edit` | Survey editor |

---

## Route Protection

All routes must require:

```txt
Authenticated session
```

---

# 11. Loading & Empty States

## Objective

Improve UX during async operations.

---

## Required Loading States

### Survey List

Skeleton loading cards.

---

### Survey Detail

Loading placeholders.

---

### Survey Editor

Editor loading state before survey fetch completes.

---

## Empty State Strategy

Provide meaningful messaging for:

- no surveys
- no questions
- failed loading

---

# 12. Error Handling Strategy

## Objective

Provide resilient survey management UX.

---

## Frontend Error Handling

Should support:

- API failures
- validation errors
- network issues
- unauthorized access

---

## Error UX

Display:

- inline validation
- toast notifications
- retry states

---

# 13. Responsive Editor Design

## Objective

Ensure editor usability across devices.

---

## Mobile Requirements

### Question Editing

- full-width cards
- stacked controls
- simplified spacing

---

## Desktop Requirements

### Workspace Layout

Should support:

- large editing canvas
- future side panels
- scalable question organization

---

# 14. Survey Status System

## Objective

Visually communicate survey lifecycle state.

---

## Supported Statuses

| Status | Meaning |
|---|---|
| Draft | Editable |
| Published | Active |
| Archived | Inactive |

---

## Status UI

Use:

- badges
- color indicators
- status labels

---

# 15. Future Editor Scalability

## Objective

Prepare survey editor for advanced functionality.

---

## Future Features Supported

Architecture should support:

- drag-and-drop question ordering
- conditional logic
- branching workflows
- AI-generated questions
- templates
- collaborative editing
- autosave
- version history

---

## Editor Extensibility Philosophy

Editor architecture should remain:

- modular
- plugin-friendly
- scalable

---

# 16. Accessibility Requirements

## Objective

Ensure accessible survey management experience.

---

## Accessibility Standards

The UI should support:

- keyboard navigation
- focus states
- semantic forms
- accessible buttons
- screen reader compatibility

---

## Required Semantic Elements

Use:

```html
<form>
<section>
<button>
<input>
```

appropriately.

---

# 17. Theme Integration

## Objective

Ensure compatibility with global theme system.

---

## Theme Areas

The following should support theme variables:

- editor surfaces
- cards
- forms
- sidebars
- status badges
- toolbars

---

## Dark Mode Requirements

Dark mode should maintain:

- readable contrast
- clean hierarchy
- accessible interaction states

---

# 18. Developer Experience Standards

## Objective

Maintain scalable frontend architecture.

---

## Rules

Survey UI logic should:

- remain modular
- separate API/services/hooks
- isolate reusable components
- avoid duplicated editor logic

---

## Styling Rules

Prefer:

- Tailwind utilities
- shadcn/ui components

Avoid:

- inline styles
- duplicated layout patterns

---

# Dependencies

# Existing Dependencies Used

From previous units:

```txt
react-router-dom
@tanstack/react-query
axios
react-hook-form
zod
tailwindcss
shadcn/ui
lucide-react
```

---

# Recommended shadcn/ui Components

```bash
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add skeleton
```

---

# Optional Recommended Dependencies

```bash
npm install clsx
npm install tailwind-merge
```

---

# Verification Checklist

# Survey List Page

- [ ] Survey list route renders correctly
- [ ] Surveys fetch successfully
- [ ] Survey cards display correctly
- [ ] Empty state displays properly
- [ ] Create Survey button works

---

# Survey Creation

- [ ] Survey creation form validates correctly
- [ ] Survey creation API works
- [ ] Loading states function properly
- [ ] Redirect after creation works

---

# Survey Detail Page

- [ ] Survey detail route works
- [ ] Survey metadata displays correctly
- [ ] Question summary displays correctly
- [ ] Management actions accessible

---

# Survey Editor

- [ ] Survey editor loads correctly
- [ ] Questions render properly
- [ ] Question editing works
- [ ] Question deletion works
- [ ] Question ordering updates correctly

---

# API Integration

- [ ] Survey CRUD APIs connected correctly
- [ ] Question CRUD APIs connected correctly
- [ ] Authenticated requests function properly
- [ ] API errors handled correctly

---

# Responsive Design

- [ ] Mobile layout functions correctly
- [ ] Tablet layout optimized
- [ ] Desktop editor layout polished
- [ ] No horizontal overflow issues

---

# Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Forms accessible
- [ ] Semantic structure implemented

---

# Theme Compatibility

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Status badges theme-compatible
- [ ] Editor surfaces theme-aware

---

# Developer Experience

- [ ] Components modularized correctly
- [ ] Hooks reusable
- [ ] API services isolated
- [ ] Editor architecture scalable

---

# Visible Result

By the end of Unit 10:

- users can visually manage surveys through the dashboard
- survey list, creation, detail, and editor pages are fully functional
- authenticated users can create and edit survey structures
- question management workflows are operational
- responsive survey management UI works across devices
- scalable frontend survey architecture is established
- InsightFlow has a production-ready survey management experience ready for future analytics, distribution, and AI-powered survey enhancements