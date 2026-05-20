# InsightFlow — Spec Unit Build Plan

## Overview

This document defines the development breakdown for **InsightFlow**, an AI-powered survey intelligence and distribution platform.

The build process follows a **spec-driven development workflow**, where:

- Each unit corresponds to one spec file
- Each unit produces one visible outcome
- Dependencies are introduced only when required
- Related work that naturally belongs together is grouped into one unit
- Units are intentionally scoped for manageable implementation sessions

The structure below is ordered in the recommended development sequence.

---

# Build Units

## 1. Frontend Application Foundation

### Builds

- React setup
- Routing system
- Tailwind CSS integration
- shadcn/ui integration
- Global theme foundation
- Basic frontend structure

### Visible Result

A styled frontend application shell is running locally.

### Dependencies

None.

---

## 2. Marketing Website & Landing Page

### Builds

- Public landing page
- Hero section
- Feature showcase sections
- CTA sections
- Responsive navigation
- Footer
- Initial design system implementation
- Mobile responsiveness
- Premium SaaS UI styling

### Visible Result

InsightFlow has a polished public-facing landing page.

### Dependencies

- Unit 1

---

## 3. Backend API Foundation

### Builds

- Django setup
- Django REST Framework setup
- PostgreSQL integration
- Base API routing
- Environment configuration

### Visible Result

Backend APIs run successfully with database connectivity.

### Dependencies

None.

---

## 4. Frontend ↔ Backend Integration

### Builds

- API communication setup
- Shared environment handling
- Health check integration
- Base API service layer

### Visible Result

Frontend successfully communicates with backend APIs.

### Dependencies

- Unit 1
- Unit 3

---

## 5. Deployment & Environment Setup

### Builds

- Railway backend deployment configuration
- Vercel frontend deployment configuration
- Production environment variables
- Initial deployment pipeline

### Visible Result

InsightFlow is deployed online.

### Dependencies

- Unit 4

---

## 6. Authentication System

### Builds

- Clerk integration
- Login/signup flows
- Session management
- Protected routes
- Backend user association layer

### Visible Result

Users can authenticate and access protected pages.

### Dependencies

- Unit 4

---

## 7. Dashboard Layout & Navigation

### Builds

- Sidebar navigation
- Responsive dashboard shell
- Main application layout
- Navigation routing structure

### Visible Result

Logged-in users see the full dashboard structure.

### Dependencies

- Unit 6

---

## 8. Survey Data Architecture

### Builds

- Survey database schema
- Question schema
- Survey relationships
- Survey CRUD APIs

### Visible Result

Surveys can be stored and managed through APIs.

### Dependencies

- Unit 3
- Unit 6

---

## 9. Survey Management Interface

### Builds

- Survey list page
- Survey creation page
- Survey detail page
- Metadata editing UI

### Visible Result

Users can create and manage surveys visually.

### Dependencies

- Unit 7
- Unit 8

---

## 10. Google Forms Import System

### Builds

- Google Forms import processing
- Question normalization
- Import APIs
- Import UI workflow

### Visible Result

Users can import Google Forms into InsightFlow.

### Dependencies

- Unit 7
- Unit 8

---

## 11. Survey Response Infrastructure

### Builds

- Response database schema
- Answer storage structure
- Submission APIs
- Response persistence logic

### Visible Result

Survey responses can be submitted and stored.

### Dependencies

- Unit 8

---

## 12. Public Survey Experience

### Builds

- Public survey routes
- Standard survey renderer
- Survey completion flow
- Mobile-friendly response UI

### Visible Result

Respondents can complete surveys publicly.

### Dependencies

- Unit 11

---

## 13. Conversational Survey Experience

### Builds

- One-question-at-a-time survey flow
- Chat-style UI
- Conversational state management
- Mobile conversational UX

### Visible Result

Surveys can be completed in conversational format.

### Dependencies

- Unit 12

---

## 14. Campaign & Distribution Data Layer

### Builds

- Campaign schema
- Audience list schema
- Distribution relationships
- Campaign CRUD APIs

### Visible Result

Campaigns and audience lists can be managed structurally.

### Dependencies

- Unit 8

---

## 15. Survey Sharing System

### Builds

- Shareable survey links
- QR code generation
- Public distribution helpers

### Visible Result

Surveys can be distributed through links and QR codes.

### Dependencies

- Unit 14

---

## 16. Audience Management Interface

### Builds

- Audience upload tools
- Contact management UI
- Audience list editing workflows

### Visible Result

Users can manage survey recipient lists.

### Dependencies

- Unit 14
- Unit 7

---

## 17. Email Distribution System

### Builds

- Resend integration
- Email template system
- Campaign sending APIs
- Campaign sending UI

### Visible Result

Users can send survey campaigns through email.

### Dependencies

- Unit 14
- Unit 16

---

## 18. Background Job Infrastructure

### Builds

- Trigger.dev integration
- Async processing pipeline
- Job retry/error handling
- Background task abstraction

### Visible Result

Long-running tasks execute asynchronously.

### Dependencies

- Unit 17

---

## 19. Campaign Scheduling & Reminder Automation

### Builds

- Campaign scheduling
- Delayed campaign sending
- Reminder workflows
- Automated follow-up logic

### Visible Result

Campaigns and reminders can run automatically.

### Dependencies

- Unit 18

---

## 20. Engagement Tracking System

### Builds

- Email open tracking
- Link click tracking
- Response tracking
- Drop-off detection

### Visible Result

Survey engagement activity is tracked.

### Dependencies

- Unit 17
- Unit 11

---

## 21. Analytics Metrics Engine

### Builds

- Aggregated analytics computation
- Response metrics
- Engagement metrics
- Drop-off analytics APIs

### Visible Result

Analytics metrics become available for visualization.

### Dependencies

- Unit 20

---

## 22. Analytics Dashboard

### Builds

- Response rate charts
- Engagement dashboards
- Question-level analytics
- Metric visualization components

### Visible Result

Users can visually analyze survey performance.

### Dependencies

- Unit 21
- Unit 7

---

## 23. Gemini AI Infrastructure

### Builds

- Gemini API integration
- AI processing abstraction
- Async AI task execution
- AI prompt orchestration

### Visible Result

AI services are operational inside the platform.

### Dependencies

- Unit 18

---

## 24. AI Response Summarization

### Builds

- AI-generated survey summaries
- Summary storage and retrieval
- Summary UI components

### Visible Result

Surveys display AI-generated summaries.

### Dependencies

- Unit 23
- Unit 11

---

## 25. AI Sentiment & Quality Analysis

### Builds

- Sentiment analysis
- Response quality scoring
- Sentiment/quality visualizations

### Visible Result

Responses receive AI-based sentiment and quality analysis.

### Dependencies

- Unit 23
- Unit 11

---

## 26. Per-Question AI Insights

### Builds

- Question-level AI insights
- Insight generation logic
- Insight dashboard components

### Visible Result

Questions display AI-generated insights.

### Dependencies

- Unit 23
- Unit 22

---

## 27. Simulation Mode Infrastructure

### Builds

- Simulation data isolation
- Persona system
- Simulation safety boundaries
- Controlled execution rules

### Visible Result

Simulation mode operates separately from real data.

### Dependencies

- Unit 11
- Unit 23

---

## 28. Synthetic Response Generation System

### Builds

- Persona-driven synthetic responses
- AI simulation generation
- Simulation run management
- Simulation UI workflows

### Visible Result

Users can generate synthetic survey responses.

### Dependencies

- Unit 27

---

## 29. Engagement Optimization Automation

### Builds

- Non-respondent targeting
- Smart reminder logic
- Rule-based engagement optimization

### Visible Result

Campaigns optimize follow-ups automatically.

### Dependencies

- Unit 19
- Unit 20

---

## 30. PDF Report Generation System

### Builds

- PDF report generation
- Structured report templates
- AI insight embedding
- One-click report export UI

### Visible Result

Users can export professional analytics reports as PDFs.

### Dependencies

- Unit 21
- Unit 24
- Unit 25
- Unit 26

---

## 31. Observability & Error Monitoring

### Builds

- Logging system
- Error monitoring
- Background job observability
- API diagnostics

### Visible Result

System issues are traceable and monitorable.

### Dependencies

- Unit 18

---

## 32. API Security & Access Protection

### Builds

- Rate limiting
- API protection middleware
- Security headers
- Abuse prevention measures

### Visible Result

Platform APIs are secured for production usage.

### Dependencies

- Unit 31

---

## 33. Database & Performance Optimization

### Builds

- Query optimization
- Database indexing
- Analytics performance tuning
- Response caching strategies

### Visible Result

Platform performance is optimized for scale.

### Dependencies

- Unit 21
- Unit 30

---

## 34. Production Readiness & Final Validation

### Builds

- Deployment verification
- Environment validation
- Final production checks
- Stability testing workflows

### Visible Result

InsightFlow is fully production-ready.

### Dependencies

- All previous units

---
