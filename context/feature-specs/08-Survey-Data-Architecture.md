## Goal

Design and implement the foundational survey data architecture for InsightFlow, including survey schemas, question schemas, and authenticated CRUD APIs for survey management.  
The outcome of this unit is a scalable backend survey system where authenticated users can create, retrieve, update, and manage structured survey data through secure REST APIs.

---

# Design

## Survey Architecture Philosophy

The survey system should prioritize:

- flexibility
- scalability
- normalized relational design
- analytics readiness
- future AI augmentation support
- extensibility for advanced survey logic

The architecture should support both simple academic surveys and future enterprise-grade survey workflows.

---

## Core Survey Data Model Philosophy

The survey system should separate:

| Entity | Responsibility |
|---|---|
| Survey | Survey-level metadata |
| Question | Individual survey questions |
| Response (future) | User answers |
| Distribution (future) | Survey campaigns |

---

## Relationship Architecture

### High-Level Data Structure

```txt
User
  ↓
Survey
  ↓
Question
```

---

## Survey Ownership Model

Each survey should belong to:

```txt
One authenticated user
```

This enables:

- user isolation
- secure ownership
- personalized dashboards
- analytics segmentation

---

## Survey Schema Philosophy

The survey entity should store:

- metadata
- configuration
- publication status
- ownership
- timestamps

Questions should remain modular and independently manageable.

---

## Question Architecture Philosophy

Questions should support future expansion for:

- multiple question types
- branching logic
- AI-generated questions
- validation rules
- required/optional behavior
- response analytics

---

## Initial Supported Question Types

| Type | Description |
|---|---|
| short_text | Single-line text input |
| long_text | Multi-line text response |
| multiple_choice | Single option selection |
| checkbox | Multiple option selection |
| rating | Numeric rating scale |

---

## API Design Philosophy

The API architecture should:

- follow REST principles
- support authenticated access
- use versioned endpoints
- return consistent JSON responses
- support future pagination/filtering

---

## REST Endpoint Namespace

All APIs should exist under:

```txt
/api/v1/
```

---

# Implementation

# 1. Django App Structure

## Objective

Create modular survey backend architecture.

---

## Recommended Structure

```txt
/backend/apps/surveys
├── migrations
├── models
│   ├── survey.py
│   └── question.py
├── serializers
│   ├── survey_serializer.py
│   └── question_serializer.py
├── views
│   ├── survey_views.py
│   └── question_views.py
├── urls.py
├── permissions.py
├── services.py
└── utils.py
```

---

# 2. Survey Model Design

## Objective

Create the core survey database schema.

---

## File

```txt
apps/surveys/models/survey.py
```

---

## Survey Model Fields

### Ownership

```python
owner
```

Foreign key to internal user model.

---

### Basic Metadata

```python
title
description
```

---

### Status

```python
status
```

Suggested values:

```txt
draft
published
archived
```

---

### Configuration

```python
is_public
```

Future-ready for public distribution.

---

### Timestamps

```python
created_at
updated_at
```

---

## Recommended Model Example

```python
class Survey(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        default="draft"
    )

    is_public = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

---

# 3. Question Model Design

## Objective

Create flexible question architecture.

---

## File

```txt
apps/surveys/models/question.py
```

---

## Question Relationships

Each question belongs to:

```txt
One Survey
```

---

## Question Fields

### Relationship

```python
survey
```

---

### Question Content

```python
question_text
```

---

### Question Type

```python
question_type
```

---

### Required State

```python
is_required
```

---

### Display Order

```python
order
```

---

### Future Configuration

```python
metadata
```

JSONField for extensibility.

---

## Recommended Model Example

```python
class Question(models.Model):
    survey = models.ForeignKey(
        Survey,
        related_name="questions",
        on_delete=models.CASCADE
    )

    question_text = models.TextField()

    question_type = models.CharField(
        max_length=50
    )

    is_required = models.BooleanField(default=False)

    order = models.PositiveIntegerField(default=0)

    metadata = models.JSONField(default=dict, blank=True)
```

---

# 4. Question Type Standardization

## Objective

Prevent invalid question types.

---

## Recommended Choices

```python
QUESTION_TYPES = [
    ("short_text", "Short Text"),
    ("long_text", "Long Text"),
    ("multiple_choice", "Multiple Choice"),
    ("checkbox", "Checkbox"),
    ("rating", "Rating"),
]
```

---

## Why Use Choices

Provides:

- validation consistency
- frontend compatibility
- analytics standardization

---

# 5. Survey Serializer Architecture

## Objective

Create API-ready survey serialization.

---

## File

```txt
apps/surveys/serializers/survey_serializer.py
```

---

## Responsibilities

Survey serializers should:

- validate survey data
- expose survey metadata
- support nested question serialization
- enforce ownership logic

---

## Nested Serialization

Survey responses should optionally include:

```json
{
  "id": 1,
  "title": "Research Survey",
  "questions": []
}
```

---

# 6. Question Serializer Architecture

## Objective

Serialize question data consistently.

---

## Responsibilities

Question serializers should:

- validate question types
- validate metadata structure
- enforce required fields

---

## Validation Examples

Should validate:

- valid question type
- non-empty question text
- valid order values

---

# 7. Survey CRUD API Design

## Objective

Create authenticated survey management APIs.

---

## REST Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/surveys/` | List user surveys |
| POST | `/api/v1/surveys/` | Create survey |
| GET | `/api/v1/surveys/:id/` | Retrieve survey |
| PATCH | `/api/v1/surveys/:id/` | Update survey |
| DELETE | `/api/v1/surveys/:id/` | Delete survey |

---

## Authentication Requirement

All survey endpoints must require:

```python
IsAuthenticated
```

---

# 8. Survey View Architecture

## Objective

Implement scalable DRF views.

---

## Recommended Approach

Use:

```txt
ModelViewSet
```

---

## File

```txt
apps/surveys/views/survey_views.py
```

---

## Responsibilities

Views should:

- restrict surveys to owners
- validate permissions
- support CRUD operations
- enforce authentication

---

## Queryset Restriction

Users should only access:

```python
Survey.objects.filter(owner=request.user)
```

---

# 9. Question CRUD APIs

## Objective

Allow question management inside surveys.

---

## Suggested Endpoints

| Method | Endpoint |
|---|---|
| POST | `/api/v1/surveys/:id/questions/` |
| PATCH | `/api/v1/questions/:id/` |
| DELETE | `/api/v1/questions/:id/` |

---

## Ownership Rules

Users may only modify questions belonging to:

```txt
Their own surveys
```

---

# 10. URL Routing Structure

## Objective

Create scalable API routing.

---

## File

```txt
apps/surveys/urls.py
```

---

## Suggested Structure

```python
router.register("surveys", SurveyViewSet)
router.register("questions", QuestionViewSet)
```

---

## Main API Registration

Include routes under:

```txt
/api/v1/
```

---

# 11. Backend Authentication Integration

## Objective

Connect survey ownership to authenticated Clerk users.

---

## Ownership Association

On survey creation:

```python
owner = request.user
```

---

## Security Rule

Frontend should NEVER send:

```txt
owner_id
```

The backend determines ownership automatically.

---

# 12. Permission Architecture

## Objective

Prevent unauthorized survey access.

---

## Permission Requirements

Users must NOT:

- access other users’ surveys
- edit unauthorized surveys
- delete unauthorized questions

---

## Recommended Permission Classes

Use:

```python
IsAuthenticated
```

and custom ownership permissions.

---

## Example Custom Permission

```python
IsSurveyOwner
```

---

# 13. Survey Lifecycle Support

## Objective

Prepare survey system for publication workflows.

---

## Supported Statuses

### Draft

Editable survey.

---

### Published

Available for distribution.

---

### Archived

Inactive but preserved.

---

## Future Workflow Support

Architecture should support:

- scheduled publishing
- versioning
- cloning
- templates

---

# 14. Validation Strategy

## Objective

Ensure consistent survey integrity.

---

## Survey Validation

Should validate:

- title length
- required ownership
- valid status values

---

## Question Validation

Should validate:

- supported question type
- valid ordering
- non-empty question text

---

# 15. Future Extensibility Preparation

## Objective

Prepare architecture for advanced survey features.

---

## Future Features Supported

Architecture should support:

- branching logic
- conditional questions
- response validation
- AI-generated surveys
- multilingual surveys
- survey templates
- survey analytics
- synthetic responses
- real-time collaboration

---

## Metadata Strategy

Using `JSONField` enables future:

```python
metadata = {
  "options": [],
  "min_rating": 1,
  "max_rating": 5
}
```

---

# 16. API Response Standardization

## Objective

Ensure consistent frontend integration.

---

## Success Response Example

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Survey"
  }
}
```

---

## Error Response Example

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized"
  }
}
```

---

# 17. Database Optimization Preparation

## Objective

Prepare for scalable survey workloads.

---

## Recommended Indexes

Add indexes for:

```python
owner
status
created_at
```

---

## Query Optimization Goals

Optimize for:

- dashboard loading
- survey listing
- analytics queries
- ownership filtering

---

# 18. Developer Experience Standards

## Objective

Maintain scalable backend architecture.

---

## Rules

Survey logic should:

- remain modular
- separate serializers/views/models
- avoid business logic in views
- support reusable services

---

## API Design Rules

Endpoints should:

- remain RESTful
- use predictable naming
- return consistent structures

---

# Dependencies

# Backend Dependencies

No additional required dependencies beyond Units 2 and 6.

---

# Existing Dependencies Used

```txt
django
djangorestframework
psycopg2-binary
django-cors-headers
```

---

# Recommended Optional Dependencies

```bash
pip install django-filter
```

for future filtering support.

---

# Verification Checklist

# Survey Models

- [ ] Survey model created successfully
- [ ] Question model created successfully
- [ ] Relationships work correctly
- [ ] Database migrations run successfully

---

# Question Types

- [ ] Question type validation works
- [ ] Invalid types rejected correctly
- [ ] Metadata field stores JSON correctly

---

# Survey CRUD APIs

- [ ] Authenticated users can create surveys
- [ ] Users can retrieve their surveys
- [ ] Users can update surveys
- [ ] Users can delete surveys
- [ ] Unauthorized access blocked

---

# Question CRUD APIs

- [ ] Questions can be added to surveys
- [ ] Questions update correctly
- [ ] Questions delete correctly
- [ ] Question ownership enforced

---

# Authentication Integration

- [ ] Survey ownership linked to authenticated users
- [ ] Clerk-authenticated users recognized correctly
- [ ] Unauthorized requests rejected properly

---

# API Validation

- [ ] Invalid payloads rejected correctly
- [ ] Missing fields validated correctly
- [ ] Error responses standardized

---

# Routing Structure

- [ ] Survey routes registered correctly
- [ ] API namespace consistent
- [ ] REST endpoints accessible

---

# Database Integrity

- [ ] Cascading deletes work correctly
- [ ] Survey-question relationships preserved
- [ ] Timestamps generated correctly

---

# Security

- [ ] Users cannot access others’ surveys
- [ ] Protected APIs require authentication
- [ ] Ownership permissions enforced

---

# Developer Experience

- [ ] Models modularized correctly
- [ ] Serializers reusable
- [ ] Views remain clean and maintainable
- [ ] Architecture scalable for future features

---

# Visible Result

By the end of Unit 8:

- survey data can be stored and managed successfully
- authenticated users can create and manage surveys
- question schemas support multiple question types
- secure CRUD APIs exist for surveys and questions
- survey ownership is enforced through authentication
- InsightFlow has a scalable survey data foundation ready for response collection, analytics, AI augmentation, and distribution workflows