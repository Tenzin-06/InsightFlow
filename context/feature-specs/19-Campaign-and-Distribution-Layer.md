Design and implement the foundational backend infrastructure for InsightFlow’s campaign and survey distribution system, including campaign schemas, audience management structures, and campaign APIs.  
The outcome of this unit is a scalable campaign data architecture capable of supporting survey distribution workflows, respondent targeting, engagement tracking, and future automated outreach systems.

---

# Design

## Campaign Infrastructure Philosophy

The campaign system should prioritize:

- scalability
- audience segmentation
- flexible distribution workflows
- analytics readiness
- extensibility
- reliable relational modeling

The architecture should establish a clean separation between surveys, campaigns, audiences, and future communication channels.

---

## Distribution System Philosophy

The distribution layer should support:

```txt
Survey
→ Campaign
→ Audience
→ Distribution
→ Engagement Tracking
```

---

## Core Architecture Philosophy

The system should separate:

| Entity | Responsibility |
|---|---|
| Survey | Survey content |
| Campaign | Distribution event/workflow |
| Audience | Target respondent group |
| Recipient | Individual participant |
| Delivery Channel | Distribution mechanism |

---

## High-Level Data Relationships

```txt
Survey
  ↓
Campaign
  ↓
Audience
  ↓
Recipients
```

---

## Campaign Lifecycle Philosophy

Campaigns should support:

```txt
Draft
→ Scheduled
→ Active
→ Completed
→ Archived
```

---

## Audience Management Philosophy

Audiences should support:

- reusable recipient groups
- imported contacts
- segmentation workflows
- future AI targeting systems

---

## Initial Distribution Scope

The first implementation should focus on:

| Feature | Included |
|---|---|
| Campaign schema | Yes |
| Audience schema | Yes |
| Campaign CRUD APIs | Yes |
| Audience CRUD APIs | Yes |
| Basic recipient storage | Yes |

---

## Deferred Features

The following should be postponed for future units:

- email delivery
- SMS delivery
- automated reminders
- scheduling engine
- AI audience optimization
- delivery analytics
- engagement scoring
- unsubscribe workflows
- multi-channel orchestration

---

# Implementation

# 1. Campaign App Architecture

## Objective

Create modular campaign/distribution backend architecture.

---

## Recommended Structure

```txt
/backend/apps/campaigns
├── migrations
├── models
│   ├── campaign.py
│   ├── audience.py
│   ├── recipient.py
│   └── campaign_status.py
│
├── serializers
│   ├── campaign_serializer.py
│   ├── audience_serializer.py
│   └── recipient_serializer.py
│
├── views
│   ├── campaign_views.py
│   └── audience_views.py
│
├── services
│   ├── campaign_service.py
│   ├── audience_service.py
│   └── recipient_service.py
│
├── permissions.py
├── constants.py
├── validators.py
├── urls.py
└── utils.py
```

---

# 2. Campaign Schema Design

## Objective

Create the primary survey distribution entity.

---

## File

```txt
models/campaign.py
```

---

## Campaign Responsibilities

The campaign model should manage:

- survey association
- distribution configuration
- lifecycle status
- ownership
- metadata

---

## Suggested Campaign Fields

| Field | Purpose |
|---|---|
| title | Campaign name |
| description | Internal campaign description |
| survey | Related survey |
| owner | Campaign creator |
| status | Lifecycle state |
| metadata | Flexible configuration |
| created_at | Timestamp |
| updated_at | Timestamp |

---

## Recommended Model Example

```python
class Campaign(models.Model):
    title = models.CharField(max_length=255)

    description = models.TextField(
        blank=True
    )

    survey = models.ForeignKey(
        Survey,
        related_name="campaigns",
        on_delete=models.CASCADE
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    status = models.CharField(
        max_length=50,
        default="draft"
    )

    metadata = models.JSONField(
        default=dict,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )
```

---

# 3. Campaign Status Management

## Objective

Standardize campaign lifecycle states.

---

## Suggested Campaign Status Values

| Status | Purpose |
|---|---|
| draft | In creation |
| scheduled | Pending activation |
| active | Currently distributing |
| completed | Distribution finished |
| archived | Historical state |

---

## Suggested Constants File

```txt
constants.py
```

---

## Example

```python
CAMPAIGN_STATUS_CHOICES = [
    ("draft", "Draft"),
    ("scheduled", "Scheduled"),
    ("active", "Active"),
    ("completed", "Completed"),
    ("archived", "Archived"),
]
```

---

# 4. Audience Schema Design

## Objective

Store reusable audience groups.

---

## File

```txt
models/audience.py
```

---

## Audience Responsibilities

The audience model should manage:

- audience identity
- ownership
- segmentation metadata
- recipient relationships

---

## Suggested Audience Fields

| Field | Purpose |
|---|---|
| name | Audience name |
| description | Internal notes |
| owner | Audience creator |
| metadata | Flexible audience configuration |
| created_at | Timestamp |

---

## Recommended Model Example

```python
class Audience(models.Model):
    name = models.CharField(max_length=255)

    description = models.TextField(
        blank=True
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    metadata = models.JSONField(
        default=dict,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
```

---

# 5. Recipient Schema Design

## Objective

Store audience participant records.

---

## File

```txt
models/recipient.py
```

---

## Recipient Responsibilities

Recipients should store:

- email address
- optional metadata
- audience relationships
- future engagement tracking support

---

## Suggested Recipient Fields

| Field | Purpose |
|---|---|
| audience | Parent audience |
| email | Recipient email |
| first_name | Optional personalization |
| last_name | Optional personalization |
| metadata | Flexible recipient data |
| created_at | Timestamp |

---

## Recommended Model Example

```python
class Recipient(models.Model):
    audience = models.ForeignKey(
        Audience,
        related_name="recipients",
        on_delete=models.CASCADE
    )

    email = models.EmailField()

    first_name = models.CharField(
        max_length=255,
        blank=True
    )

    last_name = models.CharField(
        max_length=255,
        blank=True
    )

    metadata = models.JSONField(
        default=dict,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
```

---

# 6. Campaign ↔ Audience Relationships

## Objective

Connect campaigns to distribution audiences.

---

## Recommended Relationship

Use:

```txt
Many-to-Many Relationship
```

---

## Suggested Implementation

```python
audiences = models.ManyToManyField(
    Audience,
    related_name="campaigns",
    blank=True
)
```

---

## Relationship Philosophy

A campaign may target:

- multiple audiences

An audience may belong to:

- multiple campaigns

---

# 7. Metadata Strategy

## Objective

Enable flexible future campaign configuration.

---

## Suggested Metadata Examples

### Campaign Metadata

```json
{
  "channel": "email",
  "priority": "high"
}
```

---

### Audience Metadata

```json
{
  "segment": "students"
}
```

---

### Recipient Metadata

```json
{
  "organization": "University"
}
```

---

## Metadata Philosophy

Use:

```txt
JSONField
```

to support future extensibility.

---

# 8. Campaign Serializer Architecture

## Objective

Expose structured campaign APIs.

---

## File

```txt
serializers/campaign_serializer.py
```

---

## Responsibilities

The serializer should expose:

- campaign metadata
- survey relationships
- audience relationships
- lifecycle status

---

## Suggested Serializer Fields

```txt
id
title
description
survey
status
audiences
created_at
```

---

# 9. Audience Serializer Architecture

## Objective

Expose audience management APIs.

---

## File

```txt
serializers/audience_serializer.py
```

---

## Responsibilities

The serializer should expose:

- audience metadata
- recipient counts
- audience relationships

---

# 10. Campaign CRUD APIs

## Objective

Provide campaign management endpoints.

---

## Suggested Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/campaigns/` | List campaigns |
| POST | `/api/v1/campaigns/` | Create campaign |
| GET | `/api/v1/campaigns/:id/` | Campaign detail |
| PATCH | `/api/v1/campaigns/:id/` | Update campaign |
| DELETE | `/api/v1/campaigns/:id/` | Delete campaign |

---

# 11. Audience CRUD APIs

## Objective

Provide audience management endpoints.

---

## Suggested Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/audiences/` | List audiences |
| POST | `/api/v1/audiences/` | Create audience |
| GET | `/api/v1/audiences/:id/` | Audience detail |
| PATCH | `/api/v1/audiences/:id/` | Update audience |
| DELETE | `/api/v1/audiences/:id/` | Delete audience |

---

# 12. Recipient Management Preparation

## Objective

Prepare architecture for scalable recipient management.

---

## Future Recipient Features

Architecture should support:

- CSV imports
- bulk uploads
- deduplication
- tagging
- segmentation
- AI scoring

---

## Current Scope

Only implement foundational recipient schema support.

---

# 13. Campaign Permissions

## Objective

Secure campaign infrastructure.

---

## Access Rules

Users may:

- create campaigns
- manage their own campaigns
- manage their own audiences

Users may not:

- access campaigns owned by others
- modify external audiences

---

## Suggested Permission Classes

```txt
IsCampaignOwner
IsAudienceOwner
```

---

# 14. Query Optimization Strategy

## Objective

Prepare campaign infrastructure for analytics workloads.

---

## Recommended Database Indexes

Add indexes for:

```python
status
owner
survey
created_at
email
```

---

## Optimization Goals

Optimize for:

- dashboard filtering
- analytics aggregation
- campaign reporting
- future delivery tracking

---

# 15. Validation Strategy

## Objective

Maintain clean campaign data integrity.

---

## Validation Rules

Validate:

- unique audience names per owner
- valid survey ownership
- proper campaign status transitions
- valid email structures

---

## Suggested Validators

```txt
validators.py
```

---

# 16. Campaign Service Layer

## Objective

Centralize campaign business logic.

---

## Suggested Services

| Service | Responsibility |
|---|---|
| campaign_service.py | Campaign workflows |
| audience_service.py | Audience operations |
| recipient_service.py | Recipient workflows |

---

## Architectural Philosophy

Keep:

- business logic outside views
- validation reusable
- workflows centralized

---

# 17. API Response Standardization

## Objective

Ensure predictable frontend/backend communication.

---

## Success Response Example

```json
{
  "success": true,
  "data": {
    "campaign_id": 1
  }
}
```

---

## Error Response Example

```json
{
  "success": false,
  "error": {
    "message": "Campaign validation failed"
  }
}
```

---

# 18. Future Distribution Infrastructure Preparation

## Objective

Prepare architecture for advanced outreach systems.

---

## Future Features Supported

Architecture should support:

- email campaigns
- SMS distribution
- WhatsApp integration
- automated reminders
- engagement tracking
- delivery analytics
- AI-driven audience optimization
- scheduling systems

---

## Extensibility Philosophy

Keep:

- campaign configuration flexible
- audiences reusable
- recipients normalized
- delivery channels abstracted

---

# 19. Developer Experience Standards

## Objective

Maintain scalable backend engineering practices.

---

## Rules

Campaign infrastructure should:

- isolate business logic
- centralize validation
- separate serializers cleanly
- avoid tightly coupled workflows

---

## Architectural Principles

Prefer:

- reusable services
- modular APIs
- typed status constants
- normalized relationships

Avoid:

- business logic in views
- duplicated validation
- hardcoded distribution assumptions

---

# Dependencies

# Existing Backend Dependencies

```txt
django
djangorestframework
psycopg2-binary
```

---

# Recommended Optional Dependencies

```bash
pip install django-filter
```

for future campaign filtering support.

---

```bash
pip install django-import-export
```

for future audience CSV import workflows.

---

# Existing Related Units

This unit depends on:

```txt
Unit 8 — Survey Data Architecture
```

---

# Verification Checklist

# Campaign Schema

- [ ] Campaign model created successfully
- [ ] Campaign relationships configured correctly
- [ ] Campaign status system implemented
- [ ] Database migrations run successfully

---

# Audience Schema

- [ ] Audience model created successfully
- [ ] Recipient model created successfully
- [ ] Audience-recipient relationships valid
- [ ] Metadata fields operate correctly

---

# Campaign APIs

- [ ] Campaign list endpoint works
- [ ] Campaign creation works
- [ ] Campaign updates persist correctly
- [ ] Campaign deletion functions properly

---

# Audience APIs

- [ ] Audience list endpoint works
- [ ] Audience creation works
- [ ] Audience updates persist correctly
- [ ] Audience deletion functions properly

---

# Validation

- [ ] Email validation works
- [ ] Campaign ownership enforced
- [ ] Audience ownership enforced
- [ ] Status validation operates correctly

---

# Permissions

- [ ] Unauthorized access blocked
- [ ] Owner-only modification enforced
- [ ] External campaign access prevented
- [ ] Audience permissions validated

---

# Database Integrity

- [ ] Foreign key relationships valid
- [ ] Many-to-many relationships work
- [ ] Cascade behavior functions correctly
- [ ] Indexes applied successfully

---

# Developer Experience

- [ ] Services modularized correctly
- [ ] Validation centralized
- [ ] Serializers reusable
- [ ] Architecture scalable for distribution systems

---

# Visible Result

By the end of Unit 19:

- campaign data structures exist successfully
- audience and recipient schemas are operational
- campaign CRUD APIs function correctly
- reusable audience management infrastructure is established
- scalable survey distribution architecture is implemented
- InsightFlow has a production-ready foundation for outreach systems, engagement tracking, automated reminders, AI-driven targeting, and future multi-channel distribution workflows