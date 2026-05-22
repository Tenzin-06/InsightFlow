## Goal

Implement the complete backend infrastructure for InsightFlow’s email distribution system, including Resend integration, email sending logic, campaign processing workflows, and reusable email templates.  
The outcome of this unit is a production-ready email delivery pipeline capable of sending survey campaigns reliably, securely, and at scale.

---

# Design

## Email Distribution Philosophy

The email distribution system should prioritize:

- reliability
- deliverability
- scalability
- recoverability
- modularity
- operational transparency

The architecture should support both lightweight academic survey campaigns and large-scale institutional outreach operations.

---

## Campaign Delivery Philosophy

The campaign lifecycle should support:

```txt
Campaign Created
→ Audience Selected
→ Recipients Processed
→ Email Rendered
→ Emails Queued
→ Emails Sent
→ Delivery Logged
```

---

## System Architecture Philosophy

The email delivery system should separate:

| Layer | Responsibility |
|---|---|
| Campaign Processing | Campaign orchestration |
| Template Rendering | Email content generation |
| Email Delivery | Resend communication |
| Delivery Logging | Tracking & auditing |
| Queue Management | Future async scaling |

---

## Reliability Philosophy

The system should:

- fail gracefully
- preserve delivery state
- avoid duplicate sends
- support retry mechanisms
- maintain delivery transparency

---

## Initial Scope

This unit should implement:

| Feature | Included |
|---|---|
| Resend integration | Yes |
| Email sending logic | Yes |
| Campaign processing | Yes |
| Template rendering | Yes |
| Delivery logging | Yes |

---

## Deferred Features

The following should be postponed for future units:

- advanced analytics
- bounce tracking
- open/click tracking
- unsubscribe workflows
- AI-generated emails
- automated reminders
- email throttling intelligence
- distributed queues
- webhooks processing

---

# Implementation

# 1. Email Distribution Architecture

## Objective

Create scalable backend email delivery infrastructure.

---

## Recommended Backend Structure

```txt
/backend/apps/email_campaigns
├── services
│   ├── campaign_processor.py
│   ├── resend_service.py
│   ├── email_renderer.py
│   ├── delivery_service.py
│   ├── queue_service.py
│   └── tracking_service.py
│
├── templates
│   ├── base_email.html
│   ├── survey_invitation.html
│   ├── reminder_email.html
│   └── test_email.html
│
├── views
│   ├── campaign_views.py
│   ├── send_views.py
│   └── preview_views.py
│
├── serializers
│   ├── campaign_serializer.py
│   ├── send_serializer.py
│   └── delivery_serializer.py
│
├── models
│   ├── campaign.py
│   ├── delivery_log.py
│   └── email_event.py
│
├── tasks
│   └── send_campaign_task.py
│
├── utils
│   ├── template_utils.py
│   ├── personalization_utils.py
│   └── recipient_utils.py
│
├── validators.py
├── permissions.py
└── constants.py
```

---

# 2. Resend Integration

## Objective

Integrate Resend as the primary email delivery provider.

---

## Integration Responsibilities

The integration should support:

- transactional email sending
- HTML email delivery
- plain text fallback
- API authentication
- delivery responses
- error handling

---

## Suggested Service

```txt
resend_service.py
```

---

## Required Environment Variables

```env
RESEND_API_KEY=
DEFAULT_FROM_EMAIL=
RESEND_AUDIENCE_DOMAIN=
```

---

## Suggested Initialization

```python
import resend

resend.api_key = settings.RESEND_API_KEY
```

---

# 3. Campaign Processing Engine

## Objective

Orchestrate campaign delivery workflows.

---

## Suggested Service

```txt
campaign_processor.py
```

---

## Responsibilities

The processor should:

- load campaigns
- fetch recipients
- render templates
- initiate delivery
- track send status

---

## Suggested Workflow

```txt
Load Campaign
→ Fetch Audience
→ Render Emails
→ Send Emails
→ Record Delivery Results
```

---

# 4. Email Template System

## Objective

Create reusable and scalable email templates.

---

## Template Philosophy

Templates should be:

- reusable
- responsive
- accessible
- survey-focused
- personalization-ready

---

## Initial Templates

| Template | Purpose |
|---|---|
| survey_invitation.html | Initial outreach |
| reminder_email.html | Follow-up reminders |
| test_email.html | Preview/testing |

---

## Suggested Template Stack

Use:

```txt
Django template engine
```

for backend rendering.

---

# 5. HTML Email Rendering

## Objective

Generate production-ready HTML emails.

---

## Suggested Service

```txt
email_renderer.py
```

---

## Responsibilities

The renderer should:

- inject variables
- render HTML safely
- generate plain text fallback
- sanitize content

---

## Supported Variables

| Variable | Example |
|---|---|
| `{{ first_name }}` | John |
| `{{ survey_link }}` | Survey URL |
| `{{ campaign_name }}` | Research Outreach |

---

# 6. Plain Text Email Fallback

## Objective

Ensure compatibility with non-HTML email clients.

---

## Requirements

Each email should include:

- HTML version
- plain text version

---

## Suggested Strategy

Generate plain text from:

```txt
Rendered HTML template
```

---

# 7. Campaign Send Workflow

## Objective

Execute campaign email delivery safely.

---

## Suggested API Endpoint

```txt
POST /api/v1/campaigns/:id/send/
```

---

## Workflow

```txt
Validate Campaign
→ Validate Audience
→ Generate Emails
→ Send Emails
→ Store Delivery Logs
→ Return Summary
```

---

## Validation Requirements

Validate:

- audience exists
- recipients exist
- subject line exists
- template exists

---

# 8. Recipient Processing

## Objective

Prepare recipient-specific emails.

---

## Responsibilities

The system should:

- personalize variables
- generate survey links
- normalize recipient data
- skip invalid recipients

---

## Personalization Example

### Input

```txt
{{ first_name }}
```

---

### Output

```txt
Tenzin
```

---

# 9. Survey Link Generation

## Objective

Attach correct survey access links.

---

## Link Types

| Link Type | Included |
|---|---|
| Standard Survey Link | Yes |
| Conversational Survey Link | Yes |

---

## Suggested Format

```txt
https://app.insightflow.ai/s/:survey_id
```

---

## Future Expansion

Architecture should support:

- recipient-specific tracking links
- campaign attribution
- analytics parameters

---

# 10. Delivery Logging System

## Objective

Track campaign delivery outcomes.

---

## Suggested Model

```txt
DeliveryLog
```

---

## Suggested Fields

| Field | Purpose |
|---|---|
| campaign | Campaign relation |
| recipient_email | Delivery target |
| status | Delivery status |
| provider_message_id | Resend identifier |
| sent_at | Timestamp |
| error_message | Failure reason |

---

## Suggested Statuses

| Status | Meaning |
|---|---|
| pending | Waiting |
| sent | Delivered to provider |
| failed | Failed to send |

---

# 11. Delivery Error Handling

## Objective

Handle email failures safely.

---

## Supported Failure Types

| Failure Type | Example |
|---|---|
| Invalid Email | Malformed address |
| Resend Failure | API error |
| Missing Template | Rendering issue |
| Missing Audience | Invalid campaign |

---

## Recovery Philosophy

Failures should:

- not crash campaigns
- isolate problematic recipients
- preserve successful sends

---

# 12. Retry Preparation Architecture

## Objective

Prepare scalable retry workflows.

---

## Initial Scope

Implement:

```txt
Failure logging only
```

---

## Future Retry Support

Architecture should support:

- automatic retries
- retry limits
- exponential backoff
- dead-letter queues

---

# 13. Send Test Email Workflow

## Objective

Allow campaign validation before sending.

---

## Suggested Endpoint

```txt
POST /api/v1/campaigns/:id/test/
```

---

## Responsibilities

The workflow should:

- render email
- send to single address
- validate template rendering

---

## Suggested Use Cases

| Use Case | Purpose |
|---|---|
| Internal preview | QA |
| Rendering verification | Design check |
| Variable testing | Personalization validation |

---

# 14. API Response Standardization

## Objective

Provide predictable campaign responses.

---

## Success Response Example

```json
{
  "success": true,
  "sent": 120,
  "failed": 2
}
```

---

## Error Response Example

```json
{
  "success": false,
  "message": "Campaign audience is empty"
}
```

---

# 15. Background Processing Preparation

## Objective

Prepare email sending for async scalability.

---

## Initial Scope

Use:

```txt
Synchronous processing
```

for early implementation simplicity.

---

## Future Architecture

Prepare for:

- Celery
- Redis queues
- distributed workers

---

## Suggested Task File

```txt
send_campaign_task.py
```

---

# 16. Campaign State Management

## Objective

Track campaign delivery lifecycle.

---

## Suggested Campaign Statuses

| Status | Purpose |
|---|---|
| draft | Editable |
| sending | In progress |
| sent | Completed |
| failed | Failed state |

---

## Suggested Workflow

```txt
Draft
→ Sending
→ Sent / Failed
```

---

# 17. Security & Permission Enforcement

## Objective

Protect campaign delivery integrity.

---

## Access Rules

Users may:

- send their own campaigns
- preview their own templates

Users may not:

- send foreign campaigns
- access foreign audiences

---

## Suggested Permission Class

```txt
IsCampaignOwner
```

---

# 18. Rate Limiting Preparation

## Objective

Prepare for provider protection and scalability.

---

## Initial Scope

No advanced throttling required initially.

---

## Future Support

Architecture should support:

- send rate limits
- queue batching
- provider pacing
- regional routing

---

# 19. Template Accessibility

## Objective

Ensure inclusive email rendering.

---

## Accessibility Standards

Emails should support:

- semantic structure
- readable typography
- proper contrast
- mobile readability

---

## Required Behaviors

Templates should:

- render properly on dark/light clients
- degrade gracefully
- remain screen-reader compatible

---

# 20. Mobile Email Responsiveness

## Objective

Ensure proper mobile email rendering.

---

## Requirements

Templates should support:

- responsive layouts
- stacked content
- readable buttons
- mobile-safe spacing

---

## Suggested Approach

Use:

```txt
Table-based responsive email layouts
```

for compatibility.

---

# 21. Logging & Monitoring

## Objective

Provide operational visibility.

---

## Suggested Logging Areas

Log:

- send attempts
- failures
- rendering issues
- provider responses

---

## Suggested Logging Tools

Use:

```txt
Python logging module
```

initially.

---

## Future Expansion

Support:

- Sentry
- analytics dashboards
- delivery monitoring

---

# 22. Performance Optimization Strategy

## Objective

Maintain scalable campaign delivery.

---

## Optimization Goals

The system should:

- minimize template re-renders
- batch recipient processing
- reduce API overhead
- optimize database queries

---

## Suggested Optimizations

Use:

- bulk inserts
- prefetch_related()
- cached templates
- batched delivery workflows

---

# 23. Future Extensibility Preparation

## Objective

Prepare email delivery for advanced automation systems.

---

## Future Features Supported

Architecture should support:

- automated reminders
- drip campaigns
- AI-generated emails
- behavioral targeting
- analytics tracking
- webhooks
- unsubscribe systems
- A/B testing

---

## Extensibility Philosophy

Keep:

- delivery providers modular
- templates reusable
- campaign processing isolated
- personalization centralized

---

# 24. Developer Experience Standards

## Objective

Maintain scalable backend email engineering practices.

---

## Rules

Email systems should:

- isolate provider integrations
- centralize rendering logic
- separate delivery from processing
- avoid hardcoded templates

---

## Architectural Principles

Prefer:

- reusable renderers
- modular provider services
- centralized logging
- isolated personalization utilities

Avoid:

- email logic in views
- duplicated rendering code
- tightly coupled provider APIs

---

# Dependencies

# Required Backend Dependencies

```bash
pip install resend
```

---

```bash
pip install django-environ
```

for environment configuration.

---

```bash
pip install premailer
```

for CSS inlining in email templates.

---

## Optional Recommended Dependencies

```bash
pip install beautifulsoup4
```

for HTML/plain-text processing.

---

```bash
pip install html2text
```

for plain text email generation.

---

```bash
pip install celery
```

for future async delivery support.

---

```bash
pip install redis
```

for future task queues.

---

# Existing Related Units

This unit depends on:

```txt
Unit 22 — Audience Management Functionality
Unit 23 — Email Campaign UI
```

---

# Verification Checklist

# Resend Integration

- [ ] Resend API integration works
- [ ] API authentication successful
- [ ] Emails deliver correctly
- [ ] Provider responses handled safely

---

# Campaign Processing

- [ ] Campaign send workflow functions
- [ ] Audience loading works
- [ ] Recipient processing functions
- [ ] Campaign statuses update correctly

---

# Template Rendering

- [ ] HTML emails render correctly
- [ ] Plain text fallback generated
- [ ] Variables personalize correctly
- [ ] Survey links generated properly

---

# Delivery Logging

- [ ] Delivery logs persist correctly
- [ ] Failed sends tracked
- [ ] Provider message IDs stored
- [ ] Timestamps recorded accurately

---

# Error Handling

- [ ] Invalid emails skipped safely
- [ ] Failed sends isolated properly
- [ ] API failures handled gracefully
- [ ] Rendering failures logged

---

# Security

- [ ] Campaign ownership enforced
- [ ] Unauthorized sending blocked
- [ ] Audience access restricted
- [ ] Sensitive credentials protected

---

# Accessibility

- [ ] Emails readable by screen readers
- [ ] Responsive layouts validated
- [ ] Accessible HTML structure used
- [ ] Mobile readability verified

---

# Performance

- [ ] Bulk sending performs efficiently
- [ ] Database queries optimized
- [ ] Template rendering efficient
- [ ] Delivery processing scalable

---

# Developer Experience

- [ ] Provider integrations modularized
- [ ] Rendering centralized
- [ ] Logging standardized
- [ ] Architecture scalable for automation systems

---

# Visible Result

By the end of Unit 24:

- email campaigns can be sent successfully
- Resend-powered delivery infrastructure is operational
- scalable campaign processing workflows exist
- reusable email template systems are established
- delivery logging and campaign tracking infrastructure are functional
- InsightFlow has a production-ready email outreach foundation ready for automated reminders, intelligent campaign orchestration, analytics tracking, AI-generated messaging, and large-scale survey distribution systems