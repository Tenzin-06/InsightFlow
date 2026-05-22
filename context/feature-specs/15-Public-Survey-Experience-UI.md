## Goal

Design and implement the public-facing survey experience for InsightFlow, including survey rendering, respondent interaction flows, responsive layouts, and completion experiences.  
The outcome of this unit is a polished and mobile-friendly survey participation interface where respondents can visually interact with and complete surveys seamlessly.

---

# Design

## Public Survey Experience Philosophy

The survey participation experience should prioritize:

- simplicity
- accessibility
- responsiveness
- clarity
- engagement
- low-friction interaction

The interface should feel lightweight and distraction-free while remaining scalable for future advanced survey experiences.

---

## UX Philosophy

The respondent experience should emphasize:

- easy question navigation
- fast completion
- mobile-first usability
- clear progress communication
- accessible interaction patterns

---

## High-Level Experience Flow

```txt
Public Survey Link
  ↓
Survey Landing Page
  ↓
Survey Questions
  ↓
Submission
  ↓
Completion Screen
```

---

## Public Survey UI Architecture

### High-Level Structure

```txt
Public Survey Experience
├── Survey Landing
├── Survey Renderer
├── Question Components
├── Navigation Controls
├── Progress Indicators
├── Validation States
└── Completion Screen
```

---

## Visual Design Philosophy

The survey UI should feel:

- clean
- focused
- modern
- mobile-optimized
- minimal
- readable

The experience should avoid heavy dashboard-like interfaces and instead prioritize respondent comfort.

---

## Design Characteristics

The interface should use:

- centered layouts
- large touch targets
- comfortable spacing
- readable typography
- clear progress hierarchy
- distraction-free presentation

---

## Responsive Design Philosophy

The public survey experience must fully support:

| Device | Support |
|---|---|
| Mobile | Yes |
| Tablet | Yes |
| Desktop | Yes |

---

## Mobile-First Philosophy

The UI should primarily optimize for:

```txt
Mobile respondents
```

since most public survey participation happens on mobile devices.

---

## Desktop Philosophy

Desktop layouts should:

- maintain centered readability
- avoid overly wide forms
- preserve vertical completion flow

---

# Implementation

# 1. Public Survey Feature Architecture

## Objective

Create isolated frontend architecture for public survey participation.

---

## Recommended Structure

```txt
/src/features/public-surveys
├── components
│   ├── survey-container.tsx
│   ├── survey-header.tsx
│   ├── survey-progress.tsx
│   ├── survey-footer.tsx
│   ├── completion-screen.tsx
│   ├── survey-loading.tsx
│   ├── survey-error.tsx
│   ├── submit-button.tsx
│   └── question-renderer.tsx
│
├── question-components
│   ├── short-text-question.tsx
│   ├── long-text-question.tsx
│   ├── multiple-choice-question.tsx
│   ├── checkbox-question.tsx
│   └── rating-question.tsx
│
├── pages
│   └── public-survey-page.tsx
│
├── hooks
│   ├── use-public-survey.ts
│   ├── use-survey-submission.ts
│   └── use-survey-progress.ts
│
├── services
│   └── public-survey-api.ts
│
├── types
├── constants
└── utils
```

---

# 2. Public Survey Routing

## Objective

Expose public survey participation routes.

---

## Suggested Route Structure

```txt
/s/:surveySlug
```

---

## Alternative Route

```txt
/surveys/public/:surveyId
```

---

## Routing Philosophy

Routes should:

- support public access
- avoid authentication requirements
- support shareable survey links

---

# 3. Public Survey Page

## Objective

Render the complete public survey experience.

---

## File

```txt
public-survey-page.tsx
```

---

## Responsibilities

The page should:

- fetch public survey data
- render survey structure
- manage respondent state
- handle submission workflows

---

## Layout Structure

```txt
Survey Container
├── Survey Header
├── Survey Description
├── Question Renderer
├── Progress Indicator
├── Submit Section
└── Footer
```

---

# 4. Survey Header UI

## Objective

Display survey identity and instructions.

---

## File

```txt
survey-header.tsx
```

---

## Header Content

Display:

- survey title
- description
- estimated completion info
- optional branding

---

## Visual Rules

The header should:

- remain compact
- maintain readability
- establish survey context quickly

---

# 5. Survey Renderer System

## Objective

Render questions dynamically from survey schema.

---

## File

```txt
question-renderer.tsx
```

---

## Responsibilities

The renderer should:

- map question types
- render appropriate components
- preserve question ordering
- manage answer binding

---

## Rendering Workflow

```txt
Question Schema
→ Question Type Detection
→ Component Mapping
→ Interactive Rendering
```

---

# 6. Supported Question Components

## Objective

Provide reusable survey interaction components.

---

## Supported Components

| Question Type | Component |
|---|---|
| short_text | ShortTextQuestion |
| long_text | LongTextQuestion |
| multiple_choice | MultipleChoiceQuestion |
| checkbox | CheckboxQuestion |
| rating | RatingQuestion |

---

## Shared Question Responsibilities

Each component should support:

- required indicators
- validation states
- accessible labels
- mobile-friendly interactions

---

# 7. Short Text Question Component

## Objective

Render single-line text responses.

---

## Responsibilities

The component should support:

- placeholder text
- validation
- required states
- keyboard accessibility

---

# 8. Long Text Question Component

## Objective

Render paragraph response inputs.

---

## Responsibilities

The component should support:

- textarea autosizing
- multiline input
- mobile-friendly typing

---

# 9. Multiple Choice Component

## Objective

Render single-select survey options.

---

## Responsibilities

The component should support:

- radio selection
- keyboard interaction
- large touch targets

---

# 10. Checkbox Question Component

## Objective

Render multi-select survey options.

---

## Responsibilities

The component should support:

- multi-selection
- validation
- accessible controls

---

# 11. Rating Question Component

## Objective

Render numeric scale interactions.

---

## Suggested UI

Support:

```txt
1–5 or 1–10 scale buttons
```

---

## UX Goals

The rating interaction should feel:

- touch-friendly
- visually clear
- quick to complete

---

# 12. Survey Progress Indicator

## Objective

Provide completion visibility.

---

## File

```txt
survey-progress.tsx
```

---

## Progress Options

### Percentage Progress

```txt
40% Completed
```

---

### Question Counter

```txt
4 of 10 Questions
```

---

## Recommended Strategy

Use:

```txt
Question Counter + Progress Bar
```

---

# 13. Form State Management

## Objective

Manage respondent answers efficiently.

---

## Recommended Libraries

Use:

```txt
react-hook-form
```

---

## Responsibilities

The form state should manage:

- answer collection
- validation
- submission state
- progress tracking

---

# 14. Validation UX

## Objective

Ensure valid submissions before submission.

---

## Validation Rules

Validate:

- required questions
- answer structure
- supported value types

---

## Validation UX

Display:

- inline validation messages
- missing required indicators
- accessible error feedback

---

# 15. Survey Submission UX

## Objective

Create reliable submission interactions.

---

## Submit Button Rules

During submission:

- disable submit button
- display loading state
- prevent duplicate submissions

---

## Suggested Loading Text

```txt
Submitting Survey...
```

---

# 16. Completion Screen

## Objective

Provide positive submission confirmation.

---

## File

```txt
completion-screen.tsx
```

---

## Completion Content

Display:

- thank-you message
- submission confirmation
- optional next actions

---

## Suggested Completion Actions

### Primary

```txt
Return Home
```

---

### Optional Future Actions

```txt
View Resources
Share Survey
```

---

# 17. Public Survey Loading States

## Objective

Handle async survey loading gracefully.

---

## File

```txt
survey-loading.tsx
```

---

## Loading UX

Display:

- loading skeletons
- survey placeholders
- centered progress indicators

---

## Goals

Prevent:

- layout shifting
- empty page flashes
- confusing transitions

---

# 18. Public Survey Error States

## Objective

Handle unavailable surveys gracefully.

---

## File

```txt
survey-error.tsx
```

---

## Supported Errors

### Survey Not Found

```txt
This survey does not exist
```

---

### Survey Unavailable

```txt
This survey is currently unavailable
```

---

### Network Failure

```txt
Unable to load survey
```

---

## Recovery UX

Allow:

- retry actions
- navigation back home

---

# 19. API Integration Layer

## Objective

Connect public survey UI to backend APIs.

---

## File

```txt
services/public-survey-api.ts
```

---

## Responsibilities

Should manage:

- survey retrieval
- submission requests
- response normalization
- API errors

---

## Suggested API Methods

```ts
getPublicSurvey()
submitSurvey()
```

---

# 20. Accessibility Requirements

## Objective

Ensure inclusive survey participation.

---

## Accessibility Standards

The public survey experience should support:

- keyboard navigation
- screen readers
- semantic forms
- focus management
- accessible labels

---

## Required Accessibility Features

### Question Labels

All questions must include:

- visible labels
- semantic form associations

---

### Validation Errors

Errors should:

- announce clearly
- identify invalid fields

---

# 21. Mobile Interaction Standards

## Objective

Optimize for mobile survey completion.

---

## Mobile UX Rules

The UI should use:

- large tap targets
- comfortable spacing
- stacked layouts
- fixed-width readable forms

---

## Input Optimization

Use:

- mobile-friendly keyboards
- optimized input types
- textarea scaling

---

# 22. Theme Integration

## Objective

Ensure compatibility with global theme system.

---

## Theme Areas

The following should support theme variables:

- form surfaces
- progress bars
- buttons
- validation states
- completion screens

---

## Dark Mode Requirements

Dark mode should maintain:

- readable contrast
- visible controls
- accessible focus states

---

# 23. Future Extensibility Preparation

## Objective

Prepare public survey architecture for advanced workflows.

---

## Future Features Supported

Architecture should support:

- multi-page surveys
- conditional logic
- autosave drafts
- anonymous tracking
- progress recovery
- AI-assisted completion
- accessibility personalization
- multilingual surveys

---

## Extensibility Philosophy

Keep:

- renderer modular
- question components isolated
- submission logic centralized

---

# 24. Developer Experience Standards

## Objective

Maintain scalable frontend engineering practices.

---

## Rules

Survey rendering logic should:

- isolate question rendering
- centralize form handling
- avoid duplicated validation logic
- separate API integration from UI

---

## Styling Principles

Prefer:

- Tailwind utilities
- shadcn/ui components

Avoid:

- duplicated question rendering logic
- inline styles
- hardcoded layouts

---

# Dependencies

# Existing Dependencies Used

From previous units:

```txt
react-hook-form
zod
@hookform/resolvers
axios
@tanstack/react-query
tailwindcss
shadcn/ui
lucide-react
```

---

# Recommended shadcn/ui Components

```bash
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add radio-group
npx shadcn@latest add checkbox
npx shadcn@latest add progress
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add skeleton
npx shadcn@latest add alert
```

---

# Optional Recommended Dependencies

```bash
npm install sonner
```

for submission notifications.

---

# Verification Checklist

# Public Survey Rendering

- [ ] Public survey routes work correctly
- [ ] Survey data loads successfully
- [ ] Questions render correctly
- [ ] Question ordering preserved

---

# Question Components

- [ ] Short text inputs work
- [ ] Long text inputs work
- [ ] Multiple choice selection works
- [ ] Checkbox selection works
- [ ] Rating interaction works

---

# Validation

- [ ] Required questions validated
- [ ] Error messages display correctly
- [ ] Invalid submissions blocked
- [ ] Accessible validation implemented

---

# Submission UX

- [ ] Submit button loading works
- [ ] Duplicate submissions prevented
- [ ] Submission success handled correctly
- [ ] Completion screen displays properly

---

# Loading & Error States

- [ ] Loading skeletons render correctly
- [ ] Survey not found state works
- [ ] Network error state handled
- [ ] Retry workflows function properly

---

# Responsive Design

- [ ] Mobile layouts optimized
- [ ] Tablet layouts functional
- [ ] Desktop layouts polished
- [ ] No overflow/layout issues

---

# Accessibility

- [ ] Keyboard navigation works
- [ ] Screen readers supported
- [ ] Focus states visible
- [ ] Semantic forms implemented

---

# Theme Compatibility

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Progress indicators theme-compatible
- [ ] Completion screens accessible

---

# Developer Experience

- [ ] Question renderer modularized
- [ ] Form state centralized
- [ ] API integration isolated
- [ ] Architecture scalable for future workflows

---

# Visible Result

By the end of Unit 15:

- respondents can visually interact with public surveys
- surveys render dynamically from backend schemas
- mobile-friendly survey participation workflows function correctly
- validation and submission experiences operate reliably
- completion screens provide polished respondent feedback
- scalable public survey rendering architecture is established
- InsightFlow has a production-ready public survey participation experience ready for analytics, AI enhancements, conditional logic, and future advanced survey workflows