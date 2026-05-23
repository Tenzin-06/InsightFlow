## Goal

Implement the frontend experience and interaction workflows for InsightFlow’s Simulation Mode, including persona management, simulation configuration, execution orchestration, and synthetic response generation interfaces.  
The outcome of this unit is a secure, production-safe simulation workspace where users can configure synthetic personas, run isolated survey simulations, and analyze generated synthetic responses through a dedicated UI system.

---

# Design

## Simulation UI Philosophy

The Simulation Mode UI should prioritize:

- clear sandbox separation
- transparency
- ethical visibility
- workflow simplicity
- controlled experimentation
- visual distinction from production

The interface must always communicate to users that they are interacting with:

```txt
Synthetic, non-production data
```

---

## Visual Identity

Simulation Mode should have its own distinct visual treatment.

### Suggested Visual Differences

| UI Element | Design Decision |
|---|---|
| Header | Sandbox banner |
| Accent color | Amber/orange safety tone |
| Warning indicators | Persistent labels |
| Cards | Simulation-specific styling |
| Analytics | “Synthetic Data” watermark |

---

## Simulation Workflow Philosophy

The user workflow should follow:

```txt
Create Simulation
→ Configure Personas
→ Define Parameters
→ Run Synthetic Execution
→ View Results
```

---

## Persona Philosophy

Personas represent:

```txt
Synthetic participant archetypes
```

and should contain:

- demographics
- behavioral tendencies
- communication style
- engagement characteristics
- response tendencies

---

## Architecture Philosophy

The frontend should separate:

| Layer | Responsibility |
|---|---|
| Persona Layer | Synthetic identity management |
| Simulation Layer | Execution workflows |
| Results Layer | Generated outputs |
| Monitoring Layer | Runtime visibility |
| Safety Layer | Sandbox awareness |

---

## Initial Scope

This unit should implement:

| Feature | Included |
|---|---|
| Simulation dashboard | Yes |
| Persona management UI | Yes |
| Simulation execution workflow | Yes |
| Synthetic response flows | Yes |
| Simulation monitoring | Yes |

---

## Deferred Features

The following should be postponed:

- AI-generated personas
- real-time collaborative simulations
- simulation branching
- adaptive persona learning
- live replay visualization
- behavioral reinforcement modeling
- comparative simulation testing
- multi-agent simulation systems

---

# Implementation

# 1. Frontend Simulation Architecture

## Objective

Create scalable frontend infrastructure for simulation systems.

---

## Recommended Frontend Structure

```txt
/frontend/src
├── app
│   ├── dashboard
│   │   ├── simulation
│   │   │   ├── page.tsx
│   │   │   ├── create
│   │   │   ├── personas
│   │   │   ├── runs
│   │   │   └── analytics
│
├── components
│   ├── simulation
│   │   ├── simulation-shell.tsx
│   │   ├── simulation-banner.tsx
│   │   ├── simulation-warning.tsx
│   │   ├── simulation-config-form.tsx
│   │   ├── simulation-progress.tsx
│   │   ├── simulation-runner.tsx
│   │   ├── simulation-results.tsx
│   │   ├── synthetic-response-preview.tsx
│   │   ├── persona-card.tsx
│   │   ├── persona-form.tsx
│   │   ├── persona-selector.tsx
│   │   ├── persona-traits.tsx
│   │   └── simulation-metrics.tsx
│
├── hooks
│   ├── use-simulation.ts
│   ├── use-personas.ts
│   └── use-simulation-runs.ts
│
├── services
│   ├── simulation-api.ts
│   └── persona-api.ts
```

---

# 2. Simulation Dashboard UI

## Objective

Provide a centralized simulation workspace.

---

## Suggested Route

```txt
/dashboard/simulation
```

---

## Responsibilities

The simulation dashboard should:

- display active simulations
- show recent runs
- surface simulation warnings
- provide quick access to personas
- display execution history

---

## Suggested Dashboard Sections

| Section | Purpose |
|---|---|
| Active Simulations | Running workflows |
| Recent Simulation Runs | Historical tracking |
| Persona Library | Persona management |
| Safety Status | Sandbox visibility |
| Synthetic Metrics | Simulation analytics |

---

# 3. Simulation Shell & Layout

## Objective

Provide consistent sandboxed UI experience.

---

## Suggested Component

```txt
simulation-shell.tsx
```

---

## Responsibilities

The shell should:

- wrap all simulation pages
- display sandbox indicators
- render safety banners
- isolate simulation navigation

---

## Suggested Layout Structure

```txt
Simulation Banner
→ Simulation Sidebar
→ Execution Workspace
→ Synthetic Analytics Panel
```

---

# 4. Persona Management System

## Objective

Allow users to create and manage synthetic personas.

---

## Suggested Route

```txt
/dashboard/simulation/personas
```

---

## Responsibilities

The persona management system should:

- create personas
- edit personas
- organize persona groups
- configure behavioral metadata
- support reusable persona templates

---

# 5. Persona Data Structure

## Objective

Standardize synthetic persona representation.

---

## Suggested Persona Fields

| Field | Purpose |
|---|---|
| Persona Name | Identification |
| Age Range | Demographic |
| Education | Profile detail |
| Occupation | Persona context |
| Region | Geographic representation |
| Communication Style | AI response behavior |
| Engagement Level | Participation tendency |
| Technology Familiarity | Behavioral factor |
| Response Tone | Simulation realism |

---

## Suggested Metadata Structure

```json
{
  "communication_style": "formal",
  "engagement_level": "high",
  "response_depth": "detailed"
}
```

---

# 6. Persona Creation Workflow

## Objective

Enable safe and structured persona configuration.

---

## Suggested Workflow

```txt
Create Persona
→ Configure Demographics
→ Configure Behavioral Traits
→ Validate Constraints
→ Save Persona
```

---

## Suggested Form Sections

| Section | Purpose |
|---|---|
| Identity | Basic profile |
| Demographics | Synthetic segmentation |
| Behavior | Participation tendencies |
| Communication | AI response guidance |
| Engagement | Completion behavior |

---

## Validation Requirements

Validate:

- required persona fields
- safe demographic ranges
- supported communication types
- prohibited traits

---

# 7. Persona Card System

## Objective

Create reusable visualization for personas.

---

## Suggested Component

```txt
persona-card.tsx
```

---

## Responsibilities

Persona cards should display:

- persona summary
- demographics
- engagement level
- communication style
- usage frequency

---

## Suggested Card Sections

| Section | Purpose |
|---|---|
| Persona Identity | Basic overview |
| Traits | Behavioral metadata |
| Engagement Profile | Participation simulation |
| Usage Stats | Simulation history |

---

# 8. Simulation Configuration Workflow

## Objective

Allow users to configure simulation execution safely.

---

## Suggested Component

```txt
simulation-config-form.tsx
```

---

## Suggested Configuration Fields

| Field | Purpose |
|---|---|
| Survey Selection | Target survey |
| Persona Group | Simulation participants |
| Synthetic Response Count | Scale |
| AI Generation Mode | Response behavior |
| Execution Constraints | Safety control |
| Runtime Limit | Workflow control |

---

## Suggested Workflow

```txt
Select Survey
→ Select Personas
→ Configure Constraints
→ Preview Simulation
→ Execute
```

---

# 9. Simulation Preview System

## Objective

Provide visibility before execution.

---

## Responsibilities

The preview system should:

- summarize configuration
- estimate workload
- display synthetic participant counts
- show safety warnings

---

## Suggested Preview Sections

| Section | Purpose |
|---|---|
| Survey Summary | Target context |
| Persona Summary | Synthetic audience |
| Execution Estimate | Runtime prediction |
| Constraint Summary | Safety visibility |

---

# 10. Synthetic Response Generation Flow

## Objective

Guide users through synthetic response creation.

---

## Suggested Workflow

```txt
Simulation Setup
→ Persona Injection
→ AI Processing
→ Synthetic Responses
→ Results Aggregation
```

---

## Suggested Runtime States

| State | Purpose |
|---|---|
| Pending | Awaiting execution |
| Validating | Safety checks |
| Generating | AI response creation |
| Aggregating | Analytics generation |
| Completed | Results finalized |
| Failed | Error handling |

---

# 11. Simulation Runner UI

## Objective

Provide execution visibility and orchestration.

---

## Suggested Component

```txt
simulation-runner.tsx
```

---

## Responsibilities

The runner should:

- display execution stages
- show progress indicators
- surface AI activity
- support cancellation
- display safeguard enforcement

---

## Suggested Progress Stages

| Stage | Description |
|---|---|
| Validation | Constraint checks |
| Dataset Preparation | Sandbox setup |
| AI Processing | Response generation |
| Aggregation | Analytics processing |
| Finalization | Completion |

---

# 12. Simulation Monitoring UI

## Objective

Provide real-time visibility into execution workflows.

---

## Suggested Component

```txt
simulation-progress.tsx
```

---

## Suggested Monitoring Metrics

| Metric | Purpose |
|---|---|
| Personas Active | Execution scope |
| Responses Generated | Progress |
| AI Tasks Completed | Workflow status |
| Runtime Duration | Monitoring |
| Error Count | Failure visibility |

---

## Suggested Features

Include:

- live progress bars
- timestamps
- retry controls
- cancellation actions

---

# 13. Synthetic Response Preview UI

## Objective

Allow inspection of generated synthetic responses.

---

## Suggested Component

```txt
synthetic-response-preview.tsx
```

---

## Responsibilities

The preview system should:

- display generated responses
- show persona attribution
- label AI-generated content
- support response filtering

---

## Suggested Preview Sections

| Section | Purpose |
|---|---|
| Persona Attribution | Synthetic ownership |
| Generated Response | AI output |
| Confidence Metadata | Transparency |
| Timestamp | Auditability |

---

# 14. Simulation Results Dashboard

## Objective

Display simulation outputs and synthetic analytics.

---

## Suggested Component

```txt
simulation-results.tsx
```

---

## Suggested Result Sections

| Section | Purpose |
|---|---|
| Simulation Summary | Overall metrics |
| Persona Breakdown | Behavioral analysis |
| Synthetic Insights | AI summaries |
| Completion Trends | Participation analysis |
| Sentiment Distribution | Emotional trends |

---

## Suggested Visualization Types

| Visualization | Purpose |
|---|---|
| Response charts | Distribution analysis |
| Persona segmentation | Behavioral comparison |
| Completion funnel | Engagement visibility |
| Sentiment graphs | Synthetic emotional analysis |

---

# 15. Simulation Analytics Isolation

## Objective

Ensure simulation analytics remain separated from production.

---

## Requirements

Simulation analytics should:

- remain visually isolated
- display synthetic labels
- avoid production contamination
- use dedicated analytics routes

---

## Required Warning

All analytics pages should display:

```txt
Synthetic Data — Not Production Analytics
```

---

# 16. Simulation API Integration

## Objective

Connect frontend workflows to backend simulation infrastructure.

---

## Suggested Services

```txt
simulation-api.ts
persona-api.ts
```

---

## Suggested Endpoints

| Method | Endpoint |
|---|---|
| GET | `/api/v1/simulation/runs/` |
| POST | `/api/v1/simulation/run/` |
| GET | `/api/v1/simulation/personas/` |
| POST | `/api/v1/simulation/personas/` |
| PATCH | `/api/v1/simulation/personas/:id/` |
| GET | `/api/v1/simulation/results/:id/` |

---

# 17. Async Workflow Integration

## Objective

Integrate frontend workflows with async simulation execution.

---

## Suggested Strategy

Use:

```txt
Polling-based execution updates
```

initially.

---

## Future Expansion

Architecture should support:

- websocket streaming
- real-time simulation updates
- live synthetic analytics
- distributed simulation execution

---

# 18. Simulation State Management

## Objective

Centralize simulation workflow state.

---

## Suggested Hooks

| Hook | Purpose |
|---|---|
| useSimulation | Execution state |
| usePersonas | Persona management |
| useSimulationRuns | Execution history |

---

## Suggested State Categories

| State | Purpose |
|---|---|
| Execution State | Runtime control |
| Persona State | Synthetic identities |
| Validation State | Constraint visibility |
| Analytics State | Synthetic insights |

---

# 19. Error Handling & Safety UX

## Objective

Provide safe and understandable user experiences.

---

## Suggested Error States

| Error | UX Response |
|---|---|
| Constraint violation | Blocking warning |
| AI failure | Retry option |
| Unauthorized access | Permission message |
| Runtime timeout | Recovery instructions |

---

## UX Requirements

Users should always understand:

- what is synthetic
- what is AI-generated
- what is restricted
- what failed

---

# 20. Accessibility & Responsive Design

## Objective

Ensure simulation systems remain accessible.

---

## Requirements

The UI should support:

- responsive layouts
- keyboard accessibility
- mobile-safe execution monitoring
- accessible warning systems

---

## Accessibility Features

Use:

- semantic HTML
- ARIA labels
- accessible alerts
- readable status indicators

---

# 21. Ethical & Transparency UX

## Objective

Maintain transparency around synthetic systems.

---

## Required Transparency Labels

| Label | Required |
|---|---|
| Synthetic Response | Yes |
| AI Generated | Yes |
| Simulation Run | Yes |
| Sandbox Mode | Yes |

---

## Transparency Rules

Simulation interfaces should:

- clearly disclose synthetic outputs
- distinguish simulation analytics
- avoid deceptive presentation
- preserve auditability

---

# 22. Future Simulation UI Preparation

## Objective

Prepare InsightFlow for advanced simulation experiences.

---

## Future Features Supported

Architecture should support:

- AI persona generation
- simulation branching
- comparative simulations
- behavioral modeling
- synthetic audience evolution
- intelligent simulation recommendations
- replayable simulation sessions

---

## Extensibility Philosophy

Keep:

- simulation workflows modular
- persona systems reusable
- analytics isolated
- execution orchestration flexible

---

# 23. Developer Experience Standards

## Objective

Maintain scalable frontend engineering practices.

---

## Rules

Simulation systems should:

- isolate simulation routes
- centralize execution state
- separate synthetic analytics
- reuse safety components

---

## Architectural Principles

Prefer:

- modular simulation components
- reusable persona cards
- isolated workflow hooks
- centralized execution services

Avoid:

- shared production UI logic
- implicit synthetic states
- duplicated execution flows
- hidden simulation indicators

---

# Dependencies

# Existing Dependencies

This unit builds on:

```txt
React
Tailwind CSS
shadcn/ui
Trigger.dev
Gemini AI Infrastructure
Simulation Infrastructure
```

---

# Required Frontend Dependencies

```bash
npm install react-hook-form
```

for simulation configuration forms.

---

```bash
npm install zod
```

for validation schemas.

---

```bash
npm install @hookform/resolvers
```

for form validation integration.

---

```bash
npm install @tanstack/react-query
```

for simulation data synchronization.

---

# Optional Recommended Dependencies

```bash
npm install recharts
```

for simulation analytics visualization.

---

```bash
npm install framer-motion
```

for simulation transitions and workflow animations.

---

```bash
npm install react-markdown
```

for AI-generated summaries and insight rendering.

---

# Existing Related Units

This unit depends on:

```txt
Unit 33a — Simulation Mode: Infrastructure & Safeguards
```

---

# Verification Checklist

# Simulation Dashboard

- [ ] Simulation dashboard renders correctly
- [ ] Active simulations visible
- [ ] Recent runs accessible
- [ ] Safety indicators displayed

---

# Persona Management

- [ ] Personas can be created
- [ ] Personas editable
- [ ] Persona validation works
- [ ] Behavioral metadata stored properly

---

# Simulation Configuration

- [ ] Survey selection functions
- [ ] Persona assignment works
- [ ] Constraint validation enforced
- [ ] Preview workflow operational

---

# Simulation Execution

- [ ] Simulation execution works
- [ ] Progress indicators update correctly
- [ ] Cancellation controls function
- [ ] Async execution states synchronize

---

# Synthetic Response Generation

- [ ] Synthetic responses generate correctly
- [ ] AI-generated content labeled
- [ ] Persona attribution visible
- [ ] Response previews render correctly

---

# Simulation Results

- [ ] Results dashboard renders
- [ ] Synthetic analytics isolated
- [ ] Charts display properly
- [ ] AI summaries visible

---

# Safety & Transparency

- [ ] Sandbox indicators visible
- [ ] Synthetic labels enforced
- [ ] Production workflows isolated
- [ ] Ethical warnings displayed

---

# Accessibility & Responsiveness

- [ ] Mobile layouts function
- [ ] Keyboard accessibility works
- [ ] Alerts readable
- [ ] Responsive execution UI operational

---

# API Integration

- [ ] Simulation APIs connected
- [ ] Persona APIs functional
- [ ] Polling updates operational
- [ ] Error handling works correctly

---

# Developer Experience

- [ ] Simulation components modularized
- [ ] State management centralized
- [ ] Workflow hooks reusable
- [ ] Analytics rendering isolated

---

# Visible Result

By the end of Unit 33b:

- users can configure and run synthetic survey simulations safely
- personas can be created, managed, and reused
- simulation workflows execute through isolated sandbox interfaces
- synthetic response generation flows function successfully
- simulation analytics remain visually and operationally separated from production systems
- InsightFlow has a scalable foundation for advanced AI-driven synthetic survey testing, behavioral experimentation, and research simulation workflows