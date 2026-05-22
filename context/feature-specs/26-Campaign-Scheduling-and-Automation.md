## Goal

Implement the automated campaign scheduling and reminder infrastructure for InsightFlow, including scheduled email delivery, follow-up workflows, and configurable reminder automation.  
The outcome of this unit is a production-ready automation system capable of delivering surveys automatically over time without manual intervention.

---

# Design

## Automation Philosophy

The automation system should prioritize:

- reliability
- predictability
- scalability
- recoverability
- configurability
- operational visibility

The architecture should support both simple scheduled campaigns and future intelligent engagement automation systems.

---

## Campaign Automation Philosophy

Automation workflows should support:

```txt
Campaign Scheduled
→ Initial Delivery
→ Wait Period
→ Engagement Evaluation
→ Reminder Trigger
→ Follow-Up Delivery
```

---

## Automation Architecture Philosophy

The system should separate:

| Layer | Responsibility |
|---|---|
| Scheduling Layer | Time-based execution |
| Reminder Engine | Follow-up orchestration |
| Campaign Processor | Email delivery |
| Recipient Evaluation | Reminder eligibility |
| Logging Layer | Automation tracking |

---

## Reliability Philosophy

Automation workflows should:

- avoid duplicate sends
- recover from failures
- maintain scheduling integrity
- preserve recipient state
- support retries safely

---

## Initial Scope

This unit should implement:

| Feature | Included |
|---|---|
| Campaign scheduling | Yes |
| Delayed campaign execution | Yes |
| Reminder automation | Yes |
| Automated follow-up logic | Yes |
| Reminder eligibility checks | Yes |

---

## Deferred Features

The following should be postponed for future units:

- AI-generated reminder timing
- engagement scoring
- adaptive send optimization
- time-zone-aware sending
- behavioral automation trees
- multi-channel automation
- drip campaign builders
- advanced cron interfaces
- engagement analytics feedback loops

---

# Implementation

# 1. Campaign Automation Architecture

## Objective

Create scalable campaign scheduling and reminder infrastructure.

---

## Recommended Backend Structure

```txt
/backend
├── apps
│   ├── automation
│   │   ├── services
│   │   │   ├── scheduler_service.py
│   │   │   ├── reminder_service.py
│   │   │   ├── eligibility_service.py
│   │   │   ├── followup_service.py
│   │   │   └── automation_logger.py
│   │   │
│   │   ├── models
│   │   │   ├── automation_schedule.py
│   │   │   ├── reminder_rule.py
│   │   │   └── automation_event.py
│   │   │
│   │   ├── tasks
│   │   │   ├── execute_scheduled_campaign.ts
│   │   │   ├── process_reminders.ts
│   │   │   └── evaluate_followups.ts
│   │   │
│   │   ├── views
│   │   ├── serializers
│   │   ├── validators
│   │   └── constants
│   │
│   ├── email_campaigns
│   ├── responses
│   └── audiences
```

---

# 2. Scheduling System

## Objective

Allow campaigns to execute automatically at future times.

---

## Responsibilities

The scheduling system should:

- store scheduled campaigns
- trigger future sends
- validate schedules
- prevent duplicate execution
- support delayed execution

---

## Suggested Workflow

```txt
User Schedules Campaign
→ Schedule Persisted
→ Trigger.dev Waits
→ Campaign Executed
→ Status Updated
```

---

## Suggested Trigger Strategy

Use:

```txt
Trigger.dev delayed tasks
```

for scheduled execution.

---

# 3. Scheduled Campaign Execution

## Objective

Execute campaigns automatically at configured times.

---

## Suggested Task

```txt
execute_scheduled_campaign.ts
```

---

## Responsibilities

The task should:

- validate campaign state
- verify schedule validity
- trigger campaign delivery
- update automation status
- persist execution logs

---

## Suggested Workflow

```txt
Scheduled Trigger
→ Validate Campaign
→ Execute Send Workflow
→ Store Results
→ Complete Automation
```

---

# 4. Reminder Automation System

## Objective

Automatically send follow-up reminders to incomplete respondents.

---

## Suggested Service

```txt
reminder_service.py
```

---

## Responsibilities

The reminder system should:

- identify incomplete recipients
- evaluate reminder timing
- trigger reminder campaigns
- avoid duplicate reminders

---

## Reminder Philosophy

Only recipients who:

```txt
Have NOT completed the survey
```

should receive reminders.

---

# 5. Reminder Eligibility Engine

## Objective

Determine who qualifies for reminders.

---

## Suggested Service

```txt
eligibility_service.py
```

---

## Eligibility Rules

Recipients should qualify if:

| Rule | Required |
|---|---|
| Received original email | Yes |
| Did not complete survey | Yes |
| Reminder delay elapsed | Yes |
| Reminder limit not exceeded | Yes |

---

## Exclusion Rules

Recipients should be excluded if:

- already responded
- unsubscribed (future)
- bounced (future)
- reminder limit exceeded

---

# 6. Reminder Scheduling Logic

## Objective

Support configurable follow-up timing.

---

## Initial Reminder Timing Support

| Delay Type | Included |
|---|---|
| 1-day reminder | Yes |
| 3-day reminder | Yes |
| 7-day reminder | Yes |

---

## Future Expansion

Architecture should support:

- dynamic reminder timing
- engagement-based reminders
- AI-optimized schedules

---

# 7. Automated Follow-Up Workflow

## Objective

Create scalable reminder automation pipelines.

---

## Suggested Workflow

```txt
Campaign Sent
→ Wait Configured Delay
→ Evaluate Respondents
→ Send Reminder Emails
→ Track Reminder State
```

---

## Reminder Execution Task

```txt
process_reminders.ts
```

---

# 8. Reminder Campaign Generation

## Objective

Generate reusable reminder email workflows.

---

## Suggested Reminder Types

| Type | Purpose |
|---|---|
| Friendly Reminder | Standard follow-up |
| Final Reminder | Last attempt |
| Conversational Reminder | Conversational survey re-engagement |

---

## Suggested Template Files

```txt
reminder_email.html
final_reminder.html
```

---

# 9. Automation State Management

## Objective

Track automation lifecycle states.

---

## Suggested Automation Statuses

| Status | Meaning |
|---|---|
| scheduled | Waiting |
| running | Executing |
| completed | Successful |
| failed | Failed |
| cancelled | Stopped |

---

## Suggested Persistence Model

```txt
AutomationSchedule
```

---

# 10. Reminder Tracking Infrastructure

## Objective

Prevent duplicate reminders and track engagement.

---

## Suggested Tracking Fields

| Field | Purpose |
|---|---|
| recipient | Reminder target |
| reminder_count | Number sent |
| last_reminder_at | Last reminder time |
| responded_after_reminder | Engagement tracking |

---

## Suggested Model

```txt
ReminderRule
```

or

```txt
ReminderEvent
```

---

# 11. Retry & Failure Handling

## Objective

Ensure reliable automation execution.

---

## Failure Philosophy

Failures should:

- retry safely
- isolate affected recipients
- preserve execution state
- avoid duplicated sends

---

## Suggested Retry Targets

| Failure Type | Retry? |
|---|---|
| Provider timeout | Yes |
| Trigger failure | Yes |
| Invalid schedule | No |
| Missing campaign | No |

---

## Suggested Retry Strategy

```txt
Exponential backoff retries
```

---

# 12. Cancellation Workflow

## Objective

Allow scheduled campaigns to be cancelled safely.

---

## Suggested Features

Users should be able to:

- cancel scheduled campaigns
- disable reminders
- stop future automation

---

## Suggested Workflow

```txt
Cancel Request
→ Disable Future Tasks
→ Update Automation State
```

---

# 13. Automation Logging System

## Objective

Provide operational visibility into automation execution.

---

## Suggested Logging Areas

Log:

- scheduling events
- reminder execution
- cancellations
- failures
- retries

---

## Suggested Utility

```txt
automation_logger.py
```

---

# 14. Trigger.dev Integration Strategy

## Objective

Use Trigger.dev as the automation orchestration engine.

---

## Suggested Usage

Trigger.dev should manage:

- delayed execution
- reminder scheduling
- retry orchestration
- execution visibility

---

## Suggested Tasks

| Task | Purpose |
|---|---|
| execute_scheduled_campaign | Scheduled send |
| process_reminders | Reminder workflow |
| evaluate_followups | Eligibility checks |

---

# 15. Survey Completion Integration

## Objective

Connect automation logic to response infrastructure.

---

## Responsibilities

Automation workflows should integrate with:

```txt
Survey response completion state
```

to determine reminder eligibility.

---

## Suggested Integration Points

| Unit | Purpose |
|---|---|
| Unit 14 | Response storage |
| Unit 16 | Submission handling |
| Unit 24 | Email delivery |
| Unit 25 | Async infrastructure |

---

# 16. Timezone Preparation Architecture

## Objective

Prepare future timezone-aware delivery.

---

## Initial Scope

Use:

```txt
UTC scheduling
```

only.

---

## Future Expansion

Architecture should support:

- recipient-local timezones
- send window optimization
- regional delivery timing

---

# 17. Automation API Endpoints

## Objective

Expose scheduling and automation controls.

---

## Suggested Endpoints

| Method | Endpoint |
|---|---|
| POST | `/api/v1/campaigns/:id/schedule/` |
| POST | `/api/v1/campaigns/:id/cancel/` |
| GET | `/api/v1/automations/` |
| GET | `/api/v1/automations/:id/` |

---

# 18. Security & Permission Enforcement

## Objective

Protect automation workflows.

---

## Access Rules

Users may:

- schedule their own campaigns
- cancel their own automations

Users may not:

- manipulate foreign campaigns
- trigger unauthorized sends

---

## Suggested Permission Class

```txt
IsCampaignOwner
```

---

# 19. Scalability Strategy

## Objective

Ensure automation workflows scale safely.

---

## Scalability Goals

The system should support:

- thousands of scheduled jobs
- large reminder workflows
- concurrent automation execution

---

## Suggested Optimizations

Use:

- batched recipient evaluation
- paginated processing
- lazy loading
- async orchestration

---

# 20. Future Automation Extensibility

## Objective

Prepare InsightFlow for intelligent engagement systems.

---

## Future Features Supported

Architecture should support:

- AI reminder timing
- engagement prediction
- adaptive campaigns
- drip workflows
- SMS reminders
- WhatsApp outreach
- behavioral automation
- escalation sequences

---

## Extensibility Philosophy

Keep:

- scheduling isolated
- reminder logic modular
- eligibility centralized
- automation events reusable

---

# 21. Accessibility & UX Integration

## Objective

Ensure automation workflows integrate properly with frontend UX.

---

## Suggested UX States

Frontend should support:

```txt
Campaign scheduled successfully
```

```txt
Reminder automation active
```

```txt
Next reminder scheduled for May 28
```

---

## Operational Visibility

Users should eventually be able to view:

- scheduled sends
- reminder counts
- automation history

---

# 22. Developer Experience Standards

## Objective

Maintain scalable automation engineering practices.

---

## Rules

Automation systems should:

- isolate scheduling logic
- centralize eligibility rules
- separate orchestration from delivery
- avoid duplicated reminder workflows

---

## Architectural Principles

Prefer:

- reusable automation services
- centralized scheduling utilities
- isolated Trigger.dev tasks
- modular reminder rules

Avoid:

- scheduling logic inside views
- duplicated retry logic
- tightly coupled reminder execution

---

# Dependencies

# Existing Dependencies

This unit builds on:

```txt
Trigger.dev
Resend
PostgreSQL
Django REST Framework
```

---

# Required Backend Dependencies

```bash
npm install @trigger.dev/sdk
```

---

```bash
pip install python-dateutil
```

for schedule calculations.

---

## Optional Recommended Dependencies

```bash
pip install croniter
```

for future cron scheduling support.

---

```bash
npm install zod
```

for automation payload validation.

---

```bash
npm install pino
```

for structured automation logs.

---

# Existing Related Units

This unit depends on:

```txt
Unit 25 — Background Job Infrastructure
```

---

# Verification Checklist

# Scheduling System

- [ ] Campaign scheduling works
- [ ] Delayed execution functions correctly
- [ ] Scheduled campaigns trigger automatically
- [ ] Automation statuses update correctly

---

# Reminder Automation

- [ ] Reminder workflows execute correctly
- [ ] Incomplete respondents identified accurately
- [ ] Reminder timing logic functions
- [ ] Duplicate reminders prevented

---

# Follow-Up Logic

- [ ] Follow-up workflows operate correctly
- [ ] Reminder templates render properly
- [ ] Reminder limits enforced
- [ ] Completion checks function correctly

---

# Retry & Error Handling

- [ ] Retry logic functions safely
- [ ] Failed automations isolated
- [ ] Automation logs persisted
- [ ] Duplicate execution prevented

---

# Trigger.dev Integration

- [ ] Delayed tasks function correctly
- [ ] Automation tasks registered properly
- [ ] Async orchestration operational
- [ ] Scheduled retries work

---

# Security

- [ ] Campaign ownership enforced
- [ ] Unauthorized automation blocked
- [ ] Foreign campaign access restricted
- [ ] Sensitive scheduling data protected

---

# Scalability

- [ ] Large reminder workflows scale safely
- [ ] Batch processing optimized
- [ ] Async processing stable
- [ ] Database queries efficient

---

# Database Consistency

- [ ] Automation states persist correctly
- [ ] Reminder tracking accurate
- [ ] Scheduling consistency maintained
- [ ] Partial failures handled safely

---

# Developer Experience

- [ ] Scheduling logic modularized
- [ ] Eligibility rules centralized
- [ ] Reminder workflows reusable
- [ ] Architecture scalable for intelligent automation systems

---

# Visible Result

By the end of Unit 26:

- campaign automation works successfully
- campaigns can be scheduled for future delivery
- automated reminder workflows operate reliably
- follow-up emails send automatically to incomplete respondents
- scalable automation orchestration infrastructure exists
- InsightFlow has a production-ready engagement automation foundation ready for AI-driven optimization, behavioral workflows, multi-channel outreach, and intelligent respondent engagement systems