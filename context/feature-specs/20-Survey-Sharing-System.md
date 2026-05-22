## Goal

Implement the public survey sharing infrastructure for InsightFlow, including shareable survey links, QR code generation, and distribution helper utilities.  
The outcome of this unit is a scalable public sharing system that allows surveys to be distributed easily across web, mobile, print, and future campaign distribution channels.

---

# Design

## Survey Sharing Philosophy

The survey sharing system should prioritize:

- simplicity
- accessibility
- portability
- mobile usability
- branding consistency
- scalable distribution architecture

The sharing experience should make survey distribution frictionless while remaining extensible for future analytics and campaign automation systems.

---

## Public Sharing Philosophy

The sharing workflow should support:

```txt
Survey
→ Public Share Link
→ QR Code
→ Distribution
→ Participation
```

---

## Sharing UX Philosophy

The experience should feel:

- instant
- intuitive
- modern
- platform-friendly
- mobile-first

---

## High-Level Sharing Architecture

```txt
Survey
  ↓
Public Share URL
  ↓
Distribution Helpers
  ↓
QR Code Generation
  ↓
Respondent Access
```

---

## Public URL Philosophy

Every publicly shareable survey should have:

- stable URL structure
- predictable routing
- secure public accessibility
- future analytics compatibility

---

## QR Distribution Philosophy

QR codes should support:

- mobile scanning
- printed distribution
- classroom usage
- conference usage
- offline outreach workflows

---

## Initial Scope

This unit should implement:

| Feature | Included |
|---|---|
| Shareable links | Yes |
| Public URL generation | Yes |
| QR code generation | Yes |
| Copy/share helpers | Yes |
| Campaign integration support | Yes |

---

## Deferred Features

The following should be postponed for future units:

- link expiration
- password-protected links
- advanced analytics tracking
- branded short URLs
- AI distribution optimization
- channel attribution
- referral tracking
- smart redirect routing

---

# Implementation

# 1. Sharing System Architecture

## Objective

Create scalable survey sharing infrastructure.

---

## Recommended Frontend Structure

```txt
/src/features/survey-sharing
├── components
│   ├── share-modal.tsx
│   ├── share-link-card.tsx
│   ├── qr-code-card.tsx
│   ├── copy-button.tsx
│   ├── social-share-buttons.tsx
│   ├── share-preview.tsx
│   └── distribution-helper.tsx
│
├── hooks
│   ├── use-share-link.ts
│   ├── use-qr-code.ts
│   └── use-copy-to-clipboard.ts
│
├── services
│   └── sharing-api.ts
│
├── utils
│   ├── url-builder.ts
│   ├── qr-utils.ts
│   └── share-utils.ts
│
├── types
├── constants
└── pages
```

---

## Recommended Backend Structure

```txt
/backend/apps/sharing
├── serializers
├── views
├── services
├── utils
├── urls.py
├── validators.py
└── permissions.py
```

---

# 2. Public Survey Link Architecture

## Objective

Create stable public survey URLs.

---

## Recommended URL Structure

### Standard Public Survey

```txt
https://app.insightflow.ai/s/:surveySlug
```

---

## Conversational Survey Variant

```txt
https://app.insightflow.ai/s/:surveySlug/chat
```

---

## URL Philosophy

URLs should be:

- human-readable
- stable
- shareable
- SEO-friendly
- mobile-compatible

---

# 3. Survey Slug System

## Objective

Generate unique public survey identifiers.

---

## Suggested Survey Field

Add to survey schema:

```python
slug = models.SlugField(
    unique=True
)
```

---

## Slug Rules

Slugs should:

- remain unique
- remain stable after publishing
- support human readability

---

## Suggested Example

```txt
student-feedback-2026
```

---

# 4. Public Share Link Generation

## Objective

Generate frontend-accessible public survey links.

---

## Suggested Utility

```txt
url-builder.ts
```

---

## Example Helper

```ts
generateSurveyShareLink(slug)
```

---

## Example Output

```txt
https://app.insightflow.ai/s/student-feedback-2026
```

---

# 5. Share Modal UI

## Objective

Provide centralized survey sharing interface.

---

## File

```txt
share-modal.tsx
```

---

## Responsibilities

The modal should display:

- shareable URL
- copy button
- QR code preview
- social sharing options
- conversational mode link

---

## Suggested Layout Structure

```txt
Share Link
↓
Copy Actions
↓
QR Code
↓
Social Share Actions
```

---

# 6. Copy-to-Clipboard Functionality

## Objective

Allow instant survey URL copying.

---

## Suggested Hook

```txt
useCopyToClipboard()
```

---

## Responsibilities

The hook should:

- copy URLs
- display success feedback
- handle unsupported browsers gracefully

---

## UX Feedback Example

```txt
Link copied successfully
```

---

# 7. QR Code Generation System

## Objective

Generate survey QR codes dynamically.

---

## Recommended Strategy

Generate QR codes client-side initially.

---

## Suggested Component

```txt
qr-code-card.tsx
```

---

## Responsibilities

The QR component should:

- render scannable QR codes
- support download/export
- support responsive sizing

---

## QR Data

The QR should encode:

```txt
Public survey URL
```

---

# 8. QR Export Functionality

## Objective

Support offline and printed distribution workflows.

---

## Suggested Features

Allow users to:

- download QR as PNG
- print QR code
- copy QR image

---

## Suggested Export Sizes

| Size | Use Case |
|---|---|
| Small | Social sharing |
| Medium | Flyers |
| Large | Posters |

---

# 9. Distribution Helper Utilities

## Objective

Provide lightweight distribution assistance tools.

---

## Suggested Features

Support:

- copy link
- open survey preview
- launch conversational survey
- generate QR
- quick share actions

---

## Suggested Component

```txt
distribution-helper.tsx
```

---

# 10. Social Sharing Preparation

## Objective

Prepare architecture for social distribution workflows.

---

## Initial Scope

Provide basic:

- social share buttons
- generated share text
- URL integration

---

## Future Support

Architecture should support:

- Open Graph metadata
- Twitter cards
- branded previews
- platform analytics

---

# 11. Campaign Integration Preparation

## Objective

Connect sharing infrastructure to campaign systems.

---

## Future Relationship

```txt
Campaign
→ Shareable Distribution Link
```

---

## Preparation Goals

Architecture should support:

- campaign-specific links
- tracking parameters
- audience attribution
- distribution analytics

---

# 12. Public Link Validation

## Objective

Prevent invalid survey access.

---

## Backend Validation Rules

Public links should only work for:

| Survey State | Allowed |
|---|---|
| Published | Yes |
| Draft | No |
| Archived | No |

---

## Suggested Validation Service

```txt
sharing_validation_service.py
```

---

# 13. Public Survey Discovery Protection

## Objective

Prevent accidental exposure of private surveys.

---

## Security Rules

Private surveys should:

- never generate public links
- reject public access
- remain inaccessible without publishing

---

## Future Support

Architecture should support:

- password-protected surveys
- invite-only links
- signed URLs
- expiration-based access

---

# 14. QR Code Styling Standards

## Objective

Maintain brand-consistent QR presentation.

---

## Design Rules

QR presentation should include:

- white background
- readable contrast
- optional InsightFlow branding
- scan-safe margins

---

## Accessibility Rules

QR displays should:

- include fallback links
- remain screen-reader friendly

---

# 15. Mobile Sharing Optimization

## Objective

Ensure exceptional mobile sharing workflows.

---

## Mobile UX Rules

The sharing interface should support:

- responsive modals
- native share APIs
- thumb-friendly controls
- QR resizing

---

## Suggested Browser API

Use:

```txt
navigator.share()
```

when supported.

---

# 16. Analytics Preparation

## Objective

Prepare sharing system for engagement tracking.

---

## Future Metrics

Architecture should support:

- share clicks
- QR scans
- referral sources
- device attribution
- campaign analytics

---

## Current Scope

Only structure URLs and helpers for future expansion.

---

# 17. API Infrastructure

## Objective

Provide scalable sharing-related backend utilities.

---

## Suggested Endpoints

### Share Metadata Endpoint

```txt
GET /api/v1/sharing/surveys/:slug/
```

---

## Responsibilities

The endpoint should return:

- survey title
- public accessibility state
- share metadata
- conversational mode availability

---

# 18. Theme Integration

## Objective

Ensure compatibility with InsightFlow design system.

---

## Theme Areas

The following should support theme variables:

- share modal
- QR cards
- copy buttons
- sharing actions
- previews

---

## Dark Mode Requirements

Dark mode should maintain:

- readable contrast
- visible QR presentation
- accessible interaction states

---

# 19. Accessibility Requirements

## Objective

Ensure accessible sharing workflows.

---

## Accessibility Standards

The system should support:

- keyboard navigation
- screen readers
- accessible copy actions
- QR fallback URLs

---

## Required Behaviors

### QR Accessibility

QR codes should always include:

```txt
Visible fallback link
```

---

### Copy Accessibility

Copy buttons should:

- announce success states
- remain keyboard accessible

---

# 20. Future Extensibility Preparation

## Objective

Prepare sharing infrastructure for advanced distribution systems.

---

## Future Features Supported

Architecture should support:

- branded short links
- dynamic routing
- campaign attribution
- AI distribution optimization
- scheduled sharing
- multi-platform distribution
- referral systems
- deep linking

---

## Extensibility Philosophy

Keep:

- URL generation centralized
- QR utilities modular
- sharing actions reusable
- campaign integration abstracted

---

# 21. Developer Experience Standards

## Objective

Maintain scalable sharing infrastructure engineering practices.

---

## Rules

Sharing workflows should:

- isolate URL generation
- centralize sharing helpers
- separate QR rendering
- avoid hardcoded domains

---

## Architectural Principles

Prefer:

- reusable hooks
- centralized share utilities
- configurable environment-based URLs
- modular sharing components

Avoid:

- duplicated URL logic
- hardcoded environments
- tightly coupled sharing workflows

---

# Dependencies

# Existing Frontend Dependencies

```txt
tailwindcss
shadcn/ui
react
typescript
lucide-react
```

---

# Required New Dependencies

```bash
npm install qrcode.react
```

---

```bash
npm install react-copy-to-clipboard
```

---

# Optional Recommended Dependencies

```bash
npm install react-qr-code
```

alternative QR rendering library.

---

```bash
npm install file-saver
```

for QR image downloads.

---

# Existing Backend Dependencies

```txt
django
djangorestframework
```

---

# Related Units

This unit depends on:

```txt
Unit 19 — Campaign & Distribution Data Layer
```

---

# Verification Checklist

# Shareable Links

- [ ] Public survey URLs generate correctly
- [ ] Survey slug system functions properly
- [ ] Conversational links work correctly
- [ ] Environment-aware URLs function

---

# QR Code Generation

- [ ] QR codes render successfully
- [ ] QR codes scan correctly
- [ ] QR exports/downloads function
- [ ] Responsive QR sizing works

---

# Sharing UI

- [ ] Share modal opens correctly
- [ ] Copy-to-clipboard works
- [ ] Sharing actions responsive
- [ ] Mobile sharing optimized

---

# Validation & Security

- [ ] Draft surveys inaccessible publicly
- [ ] Archived surveys blocked
- [ ] Public validation enforced
- [ ] Invalid links handled gracefully

---

# Accessibility

- [ ] Keyboard navigation works
- [ ] Screen readers supported
- [ ] QR fallback links visible
- [ ] Copy actions accessible

---

# Mobile Optimization

- [ ] Mobile modals responsive
- [ ] Native share API works
- [ ] Touch interactions optimized
- [ ] QR visibility preserved

---

# Theme Compatibility

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] QR visibility maintained
- [ ] Share actions theme-compatible

---

# Developer Experience

- [ ] URL utilities reusable
- [ ] QR generation modularized
- [ ] Sharing helpers centralized
- [ ] Architecture scalable for campaign tracking

---

# Visible Result

By the end of Unit 20:

- surveys can be shared publicly through stable shareable links
- QR code generation functions successfully
- distribution helper utilities improve survey outreach workflows
- mobile-friendly public sharing infrastructure is operational
- scalable campaign-compatible sharing architecture is established
- InsightFlow has a production-ready public survey distribution foundation ready for analytics, campaign attribution, AI-driven outreach optimization, and future multi-channel sharing system