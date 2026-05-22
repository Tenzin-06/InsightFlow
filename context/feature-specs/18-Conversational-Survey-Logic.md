## Goal

Implement the complete functional logic for InsightFlow’s conversational survey system, including conversational flow state management, sequential question progression, validation handling, and conversational submission workflows.  
The outcome of this unit is a fully operational conversational survey experience where respondents can progress naturally through surveys in a guided, chat-like interaction flow.

---

# Design

## Conversational Logic Philosophy

The conversational survey logic should prioritize:

- sequential progression
- predictable conversational state
- smooth interaction pacing
- reliable submission handling
- mobile responsiveness
- resilient state management

The system should feel conversational while maintaining structured survey integrity and reliable persistence workflows.

---

## Core Conversational Philosophy

The experience should simulate:

```txt
Natural conversational progression
```

while preserving:

- deterministic question order
- validation consistency
- reliable submission workflows
- scalable state architecture

---

## High-Level Conversational Logic Flow

```txt
Survey Initialization
  ↓
Conversation State Setup
  ↓
Display Current Question
  ↓
Capture Response
  ↓
Validate Answer
  ↓
Store Local State
  ↓
Transition to Next Question
  ↓
Repeat Until Completion
  ↓
Submit Responses
  ↓
Completion Experience
```

---

## State Management Philosophy

The conversational system should maintain:

| State Category | Responsibility |
|---|---|
| Survey State | Survey metadata |
| Conversation State | Current progression |
| Answer State | User responses |
| Validation State | Question validation |
| Submission State | Submission lifecycle |

---

## Sequential Navigation Philosophy

The conversational flow should enforce:

```txt
Single active question progression
```

to preserve conversational immersion and reduce cognitive overload.

---

## UX Philosophy

The logic layer should ensure:

- no abrupt transitions
- no skipped questions
- preserved responses
- reliable progression recovery
- responsive interactions

---

# Implementation

# 1. Conversational Logic Architecture

## Objective

Create scalable conversational workflow infrastructure.

---

## Recommended Frontend Structure

```txt
/src/features/conversational-surveys
├── hooks
│   ├── use-conversation-flow.ts
│   ├── use-question-sequence.ts
│   ├── use-conversation-state.ts
│   ├── use-conversation-validation.ts
│   ├── use-conversation-submission.ts
│   └── use-conversation-transitions.ts
│
├── stores
│   └── conversation-store.ts
│
├── services
│   ├── conversational-api.ts
│   ├── answer-normalizer.ts
│   └── validation-service.ts
│
├── utils
│   ├── progression-utils.ts
│   ├── response-utils.ts
│   └── validation-utils.ts
│
├── types
├── constants
└── state
```

---

# 2. Conversational State Management

## Objective

Centralize all conversation workflow state.

---

## Core State Categories

The conversation state should manage:

- active question index
- conversation history
- answers
- validation state
- completion state
- submission state

---

## Suggested State Structure

```ts
type ConversationState = {
  currentQuestionIndex: number
  answers: Record<string, unknown>
  completedQuestions: string[]
  isSubmitting: boolean
  isComplete: boolean
}
```

---

## Recommended State Management Strategy

Use:

```txt
React Context + custom hooks
```

or

```txt
Zustand
```

for scalable conversation orchestration.

---

# 3. Survey Initialization Logic

## Objective

Initialize conversational workflows correctly.

---

## Responsibilities

Initialization should:

- fetch survey data
- prepare question sequence
- initialize empty answer state
- configure progression state

---

## Suggested Workflow

```txt
Load Survey
→ Parse Questions
→ Initialize Conversation State
→ Display Welcome Screen
→ Render First Question
```

---

# 4. Sequential Question Handling

## Objective

Control deterministic question progression.

---

## Core Rule

Only:

```txt
One active question
```

may accept input at a time.

---

## Navigation Responsibilities

The progression system should:

- advance questions sequentially
- preserve history
- prevent invalid skipping
- support future branching logic

---

## Suggested Hook

```txt
useQuestionSequence()
```

---

# 5. Question Progression Logic

## Objective

Advance conversations naturally after responses.

---

## Progression Workflow

```txt
User Response
→ Validate
→ Persist Local State
→ Trigger Transition
→ Show Next Question
```

---

## Auto-Advance Behavior

For certain question types:

| Question Type | Auto Advance |
|---|---|
| multiple_choice | Yes |
| rating | Yes |
| checkbox | No |
| long_text | No |

---

## UX Philosophy

Progression should feel:

- conversational
- responsive
- lightweight

---

# 6. Conversation History Management

## Objective

Preserve conversational continuity.

---

## Responsibilities

The history system should store:

- previous questions
- submitted answers
- timestamps (future-ready)
- conversation order

---

## Display Philosophy

Completed conversation history should remain visible but non-editable in the initial version.

---

# 7. Conversational Validation Logic

## Objective

Provide conversational validation workflows.

---

## Validation Layers

| Layer | Responsibility |
|---|---|
| Inline Validation | UX feedback |
| Submission Validation | Integrity enforcement |

---

## Suggested Validation Hook

```txt
useConversationValidation()
```

---

## Validation Rules

Validate:

- required responses
- supported answer structures
- rating boundaries
- checkbox minimums

---

## Validation UX Philosophy

Validation should:

- feel lightweight
- avoid interruption
- preserve conversational flow

---

# 8. Active Question State

## Objective

Track and manage the currently interactive question.

---

## Responsibilities

The active question state should:

- identify current question
- lock previous questions
- prevent duplicate interactions
- coordinate transitions

---

## Suggested Structure

```ts
{
  activeQuestionId: string
  isTransitioning: boolean
}
```

---

# 9. Conversational Transition Coordination

## Objective

Synchronize logic with UI transitions.

---

## Responsibilities

The transition system should coordinate:

- answer confirmation
- typing indicators
- question appearance
- animation timing

---

## Suggested Workflow

```txt
Answer Submitted
→ Lock Input
→ Animate Answer
→ Show Typing Indicator
→ Advance Question
```

---

## Suggested Hook

```txt
useConversationTransitions()
```

---

# 10. Conversational Answer Persistence

## Objective

Maintain stable in-memory response storage.

---

## Responsibilities

The answer state should:

- persist responses locally
- support revisiting history (future-ready)
- normalize answer structures

---

## Suggested Answer Shape

```ts
{
  [questionId]: {
    value: unknown
  }
}
```

---

# 11. Conversational Submission Flow

## Objective

Submit complete conversational survey responses.

---

## Suggested Workflow

```txt
Final Question Answered
→ Validate Entire Survey
→ Normalize Responses
→ Submit to Backend
→ Show Completion Screen
```

---

## Suggested Hook

```txt
useConversationSubmission()
```

---

## Suggested Backend Endpoint

```txt
POST /api/v1/public/surveys/:slug/submit/
```

---

# 12. Submission Payload Normalization

## Objective

Ensure backend-compatible answer structures.

---

## Responsibilities

The normalization layer should:

- standardize answer shapes
- remove UI-only metadata
- prepare API payloads

---

## Example Payload

```json
{
  "answers": [
    {
      "question_id": 1,
      "value": "Example"
    }
  ]
}
```

---

# 13. Submission Error Recovery

## Objective

Handle submission failures gracefully.

---

## Failure Handling Rules

If submission fails:

- preserve answers
- preserve progression state
- allow retry
- prevent data loss

---

## UX Messaging Examples

### Network Error

```txt
Connection issue detected. Please try again.
```

---

### Validation Failure

```txt
Some responses need attention before submission.
```

---

# 14. Completion State Handling

## Objective

Manage post-submission conversational state.

---

## Responsibilities

After successful submission:

- lock interactions
- mark conversation complete
- transition to completion screen
- optionally clear temporary state

---

## Suggested Completion Workflow

```txt
Submission Success
→ Transition Animation
→ Completion Screen
→ Optional Redirect
```

---

# 15. Conversation Recovery Preparation

## Objective

Prepare architecture for resumable conversations.

---

## Future Support

Architecture should support:

- autosave recovery
- draft restoration
- session persistence
- reconnect recovery

---

## Current Scope

Only structure state architecture to support future expansion.

---

# 16. Progress Tracking Logic

## Objective

Track conversational progression accurately.

---

## Suggested Metrics

Track:

- completed questions
- total questions
- current position
- completion percentage

---

## Suggested Hook

```txt
useConversationProgress()
```

---

## Progress Formula

```txt
completedQuestions / totalQuestions
```

---

# 17. Conversational Timing Management

## Objective

Control conversational pacing.

---

## Timing Responsibilities

The logic layer should manage:

- typing indicator duration
- transition timing
- auto-advance timing
- animation synchronization

---

## UX Philosophy

Timing should feel:

- human-like
- responsive
- non-delayed

---

## Recommended Timing Guidelines

| Interaction | Suggested Delay |
|---|---|
| Typing Indicator | 500–1200ms |
| Question Transition | 200–400ms |
| Auto Advance | 300–600ms |

---

# 18. Accessibility Logic Requirements

## Objective

Ensure accessible conversational workflows.

---

## Accessibility Responsibilities

The logic system should support:

- keyboard progression
- focus management
- screen reader announcements
- validation accessibility

---

## Required Behaviors

### New Question Handling

When a question appears:

- focus should shift correctly
- screen readers should announce new content

---

### Validation Errors

Validation should:

- identify invalid fields
- preserve accessible navigation

---

# 19. Mobile Interaction Logic

## Objective

Optimize conversational workflows for mobile devices.

---

## Mobile UX Rules

The logic layer should support:

- keyboard-safe scrolling
- input visibility preservation
- smooth vertical progression

---

## Input Handling

When mobile keyboard opens:

- active input remains visible
- scrolling adjusts automatically

---

# 20. Performance Optimization Strategy

## Objective

Maintain smooth conversational interactions.

---

## Optimization Goals

The logic system should:

- minimize re-renders
- optimize state updates
- avoid unnecessary animation recalculation
- preserve mobile performance

---

## Suggested Optimization Techniques

Use:

- memoized hooks
- selective state subscriptions
- isolated transition state

---

# 21. Future Extensibility Preparation

## Objective

Prepare conversational workflows for advanced AI features.

---

## Future Features Supported

Architecture should support:

- adaptive branching logic
- AI-generated follow-up questions
- sentiment-aware progression
- conversational memory
- voice-based interaction
- multilingual conversational flows
- AI interview simulation

---

## Extensibility Philosophy

Keep:

- progression logic modular
- validation reusable
- transitions isolated
- submission flows centralized

---

# 22. Developer Experience Standards

## Objective

Maintain scalable conversational engineering practices.

---

## Rules

Conversational logic should:

- isolate progression state
- separate validation from UI
- centralize submission workflows
- avoid duplicated state logic

---

## Architectural Principles

Prefer:

- reusable hooks
- typed state structures
- centralized progression management
- isolated transition orchestration

Avoid:

- progression logic inside components
- duplicated validation handling
- tightly coupled animation logic

---

# Dependencies

# Existing Frontend Dependencies

```txt
react-hook-form
zod
@hookform/resolvers
framer-motion
@tanstack/react-query
axios
tailwindcss
shadcn/ui
```

---

# Recommended New Dependency

```bash
npm install zustand
```

---

# Optional Recommended Dependencies

```bash
npm install nanoid
```

for future conversation event IDs.

---

# Verification Checklist

# Conversation State Management

- [ ] Conversation state initializes correctly
- [ ] Active question state functions properly
- [ ] Answers persist locally
- [ ] Completion state updates correctly

---

# Sequential Question Handling

- [ ] Questions progress sequentially
- [ ] Skipping prevented correctly
- [ ] Previous questions preserved
- [ ] Auto-advance behaviors function

---

# Conversational Validation

- [ ] Required validation works
- [ ] Inline validation appears correctly
- [ ] Invalid progression prevented
- [ ] Validation remains non-disruptive

---

# Conversational Submission

- [ ] Responses normalize correctly
- [ ] Submission payload valid
- [ ] Backend submission succeeds
- [ ] Completion workflow operates properly

---

# Error Recovery

- [ ] Submission failures preserve answers
- [ ] Retry workflows function
- [ ] Network errors handled gracefully
- [ ] Validation failures recover correctly

---

# Transition Coordination

- [ ] Typing indicators synchronized
- [ ] Progression transitions smooth
- [ ] Input locking works correctly
- [ ] Animation timing coordinated properly

---

# Progress Tracking

- [ ] Question counters accurate
- [ ] Completion percentages correct
- [ ] Progress updates dynamically
- [ ] Progress preserved during interaction

---

# Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader announcements function
- [ ] Focus management implemented
- [ ] Accessible validation supported

---

# Mobile Optimization

- [ ] Mobile keyboard handling works
- [ ] Active input remains visible
- [ ] Scrolling behavior smooth
- [ ] Touch interactions responsive

---

# Performance

- [ ] No excessive re-renders
- [ ] Animations remain performant
- [ ] State updates optimized
- [ ] Mobile performance stable

---

# Developer Experience

- [ ] Progression logic modularized
- [ ] Validation isolated
- [ ] Submission workflows reusable
- [ ] Architecture scalable for AI workflows

---

# Visible Result

By the end of Unit 18:

- conversational surveys function correctly end-to-end
- sequential question handling operates reliably
- conversational flow state management is fully implemented
- conversational submissions persist successfully
- validation workflows integrate seamlessly into conversation progression
- animated transitions coordinate properly with logic state
- scalable conversational participation architecture is established
- InsightFlow has a production-ready conversational survey engine ready for AI-assisted interactions, adaptive questioning, conversational analytics, and future intelligent survey experiences