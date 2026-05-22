Implement the complete functional backend and frontend workflows for InsightFlow’s audience management system, including audience CRUD logic, upload processing, and persistent audience/contact management.  
The outcome of this unit is a fully operational audience management system where users can create audiences, upload recipients, manage contacts, and persist audience data reliably across campaign workflows.

---

# Design

## Audience Functionality Philosophy

The audience functionality layer should prioritize:

- reliability
- scalability
- safe bulk operations
- data integrity
- operational efficiency
- future campaign compatibility

The system should support both lightweight academic studies and enterprise-scale survey distribution workflows.

---

## Functional Workflow Philosophy

The audience management lifecycle should support:

```txt
Create Audience
→ Upload Contacts
→ Validate Data
→ Persist Recipients
→ Manage Audience
→ Connect to Campaigns
```

---

## Data Integrity Philosophy

The system should enforce:

- validated recipient data
- deduplication safeguards
- transactional persistence
- recoverable upload workflows

---

## High-Level Architecture

```txt
Frontend Upload UI
        ↓
Upload Processing Service
        ↓
Validation Layer
        ↓
Audience Persistence
        ↓
Recipient Association
```

---

## Initial Scope

This unit should implement:

| Feature | Included |
|---|---|
| Audience CRUD functionality | Yes |
| Contact upload processing | Yes |
| Recipient persistence | Yes |
| Validation workflows | Yes |
| API integration | Yes |

---

## Deferred Features

The following should be postponed for future units:

- AI segmentation
- engagement scoring
- deduplication intelligence
- CRM synchronization
- advanced tagging
- automated enrichment
- behavioral targeting
- real-time collaboration

---

# Implementation

# 1. Functional Architecture

## Objective

Create scalable audience management functionality infrastructure.

---

## Recommended Frontend Structure

```txt
/src/features/audiences
├── hooks
│   ├── use-create-audience.ts
│   ├── use-update-audience.ts
│   ├── use-delete-audience.ts
│   ├── use-upload-contacts.ts
│   ├── use-audience-contacts.ts
│   └── use-contact-validation.ts
│
├── services
│   ├── audience-api.ts
│   ├── upload-service.ts
│   └── validation-service.ts
│
├── state
│   └── audience-store.ts
│
├── utils
│   ├── csv-parser.ts
│   ├── upload-utils.ts
│   └── recipient-normalizer.ts
│
└── types
```

---

## Recommended Backend Structure

```txt
/backend/apps/campaigns
├── services
│   ├── audience_service.py
│   ├── upload_service.py
│   ├── recipient_service.py
│   └── validation_service.py
│
├── views
│   ├── audience_views.py
│   └── upload_views.py
│
├── serializers
│   ├── audience_serializer.py
│   ├── recipient_serializer.py
│   └── upload_serializer.py
│
├── validators.py
├── permissions.py
└── utils.py
```

---

# 2. Audience CRUD Functionality

## Objective

Implement full audience lifecycle management.

---

## CRUD Responsibilities

The system should support:

- create audiences
- update audience metadata
- delete audiences
- fetch audience details
- list user audiences

---

## Suggested Frontend Hooks

| Hook | Responsibility |
|---|---|
| useCreateAudience() | Create audience |
| useUpdateAudience() | Update audience |
| useDeleteAudience() | Delete audience |
| useAudienceContacts() | Load contacts |

---

## Suggested Backend Endpoints

| Method | Endpoint |
|---|---|
| GET | `/api/v1/audiences/` |
| POST | `/api/v1/audiences/` |
| GET | `/api/v1/audiences/:id/` |
| PATCH | `/api/v1/audiences/:id/` |
| DELETE | `/api/v1/audiences/:id/` |

---

# 3. Audience Creation Logic

## Objective

Persist new audiences reliably.

---

## Required Fields

| Field | Required |
|---|---|
| name | Yes |
| description | No |

---

## Suggested Workflow

```txt
Create Form
→ Validate Input
→ Submit API Request
→ Persist Audience
→ Refresh Audience List
```

---

## Validation Rules

Validate:

- non-empty audience name
- unique audience names per user
- length constraints

---

# 4. Audience Update Logic

## Objective

Allow editable audience metadata.

---

## Editable Fields

| Field | Editable |
|---|---|
| name | Yes |
| description | Yes |
| metadata | Future |

---

## UX Requirements

Updates should:

- feel instant
- preserve UI state
- handle optimistic updates safely

---

# 5. Audience Deletion Logic

## Objective

Safely remove audiences and associated recipients.

---

## Deletion Rules

Deleting an audience should:

- remove audience associations
- remove recipients (initial scope)
- prevent orphaned records

---

## Suggested UX Flow

```txt
Delete Action
→ Confirmation Modal
→ API Request
→ Refresh UI
```

---

## Confirmation Example

```txt
This action permanently deletes the audience and all contacts.
```

---

# 6. Contact Upload Processing

## Objective

Implement scalable recipient upload workflows.

---

## Supported Upload Type

Initial implementation:

| File Type | Supported |
|---|---|
| CSV | Yes |

---

## Upload Workflow

```txt
Upload CSV
→ Parse File
→ Validate Rows
→ Normalize Data
→ Persist Contacts
→ Return Summary
```

---

## Upload Philosophy

Uploads should:

- fail gracefully
- preserve valid rows
- provide detailed feedback
- remain scalable

---

# 7. CSV Parsing System

## Objective

Transform CSV files into normalized recipient records.

---

## Suggested Frontend Utility

```txt
csv-parser.ts
```

---

## Suggested Backend Utility

```txt
upload_service.py
```

---

## Required CSV Column

```txt
email
```

---

## Optional Columns

| Column | Optional |
|---|---|
| first_name | Yes |
| last_name | Yes |

---

# 8. Recipient Normalization

## Objective

Standardize uploaded recipient data.

---

## Responsibilities

Normalization should:

- trim whitespace
- normalize email casing
- remove invalid values
- standardize structures

---

## Example

### Input

```txt
 John@example.com
```

---

### Normalized

```txt
john@example.com
```

---

# 9. Upload Validation System

## Objective

Prevent invalid recipient persistence.

---

## Validation Rules

Validate:

- email format
- duplicate emails
- malformed rows
- missing required fields

---

## Validation Layers

| Layer | Responsibility |
|---|---|
| Frontend Validation | Immediate UX feedback |
| Backend Validation | Data integrity enforcement |

---

## Validation Response Example

```json
{
  "valid_rows": 120,
  "invalid_rows": 3
}
```

---

# 10. Deduplication Strategy

## Objective

Prevent duplicate recipient creation.

---

## Deduplication Rules

Within an audience:

```txt
Email addresses must remain unique
```

---

## Suggested Database Constraint

```python
UniqueConstraint(
    fields=["audience", "email"],
    name="unique_recipient_per_audience"
)
```

---

## Duplicate Handling Philosophy

Duplicates should:

- skip insertion
- generate warnings
- preserve valid rows

---

# 11. Bulk Recipient Persistence

## Objective

Optimize recipient insertion performance.

---

## Suggested Backend Strategy

Use:

```txt
bulk_create()
```

for scalable insertion.

---

## Performance Goals

The system should support:

- large CSV uploads
- efficient transactions
- minimal database overhead

---

# 12. Transaction Management

## Objective

Ensure upload consistency and recoverability.

---

## Suggested Strategy

Wrap upload processing in:

```python
transaction.atomic()
```

---

## Transaction Philosophy

Uploads should either:

- succeed predictably
- fail safely

---

# 13. Upload Summary Responses

## Objective

Provide transparent upload feedback.

---

## Suggested Summary Structure

```json
{
  "uploaded": 120,
  "duplicates": 4,
  "invalid": 2
}
```

---

## UX Philosophy

Users should always know:

- what succeeded
- what failed
- why rows were skipped

---

# 14. Audience Persistence Layer

## Objective

Ensure reliable long-term audience storage.

---

## Persistence Responsibilities

The system should persist:

- audiences
- recipients
- upload metadata
- timestamps

---

## Future Expansion Support

Architecture should support:

- tagging
- segmentation
- engagement metadata
- campaign participation

---

# 15. Contact Retrieval Logic

## Objective

Efficiently load audience recipients.

---

## Suggested Features

Support:

- pagination
- sorting
- searching
- filtering

---

## Suggested Endpoint

```txt
GET /api/v1/audiences/:id/recipients/
```

---

## Query Optimization Goals

Optimize for:

- large contact lists
- dashboard rendering
- filtering workflows

---

# 16. Search Functionality

## Objective

Enable scalable contact management.

---

## Supported Search Fields

Search by:

- email
- first name
- last name

---

## Suggested Query Parameters

```txt
?q=john
```

---

# 17. Upload Error Recovery

## Objective

Handle upload failures gracefully.

---

## Supported Failure Types

| Failure Type | Example |
|---|---|
| Invalid CSV | Broken formatting |
| Invalid Emails | Malformed addresses |
| Duplicate Rows | Existing contacts |
| API Failure | Network issue |

---

## Recovery Rules

Users should always be able to:

- retry uploads
- download error summaries
- preserve successful rows

---

# 18. Frontend State Synchronization

## Objective

Keep audience UI synchronized with backend state.

---

## Suggested Strategy

Use:

```txt
TanStack Query invalidation
```

after mutations.

---

## Suggested Invalidations

Invalidate:

```txt
audiences
audience-detail
audience-contacts
```

---

# 19. Security & Permission Enforcement

## Objective

Protect audience ownership integrity.

---

## Access Rules

Users may:

- manage their own audiences
- upload their own contacts

Users may not:

- access external audiences
- modify foreign contacts

---

## Suggested Backend Permission Classes

```txt
IsAudienceOwner
```

---

# 20. API Response Standardization

## Objective

Ensure predictable frontend/backend communication.

---

## Success Response Example

```json
{
  "success": true,
  "data": {
    "audience_id": 12
  }
}
```

---

## Error Response Example

```json
{
  "success": false,
  "error": {
    "message": "Invalid email detected"
  }
}
```

---

# 21. Accessibility Requirements

## Objective

Ensure accessible audience management workflows.

---

## Accessibility Standards

The functionality layer should support:

- accessible upload feedback
- keyboard upload workflows
- screen-reader error announcements

---

## Required Behaviors

### Upload Errors

Validation errors should:

- announce clearly
- identify problematic rows

---

# 22. Mobile Optimization

## Objective

Ensure mobile-compatible upload workflows.

---

## Mobile UX Rules

The upload system should support:

- mobile file selection
- responsive upload summaries
- touch-friendly management

---

## Performance Goals

Mobile uploads should remain:

- responsive
- recoverable
- memory-efficient

---

# 23. Performance Optimization Strategy

## Objective

Maintain scalability for large audience operations.

---

## Optimization Goals

The system should:

- batch database writes
- minimize unnecessary re-renders
- paginate large contact lists
- optimize upload processing

---

## Recommended Backend Optimizations

Use:

- select_related()
- prefetch_related()
- indexed email lookups
- bulk operations

---

# 24. Future Extensibility Preparation

## Objective

Prepare audience functionality for advanced campaign systems.

---

## Future Features Supported

Architecture should support:

- CRM synchronization
- AI segmentation
- smart deduplication
- audience tagging
- campaign engagement tracking
- enrichment pipelines
- automated imports

---

## Extensibility Philosophy

Keep:

- upload workflows modular
- validation reusable
- persistence centralized
- recipient models extensible

---

# 25. Developer Experience Standards

## Objective

Maintain scalable audience engineering practices.

---

## Rules

Audience functionality should:

- isolate upload logic
- centralize validation
- separate parsing from persistence
- avoid duplicated workflows

---

## Architectural Principles

Prefer:

- reusable services
- centralized upload processors
- modular validation systems
- scalable bulk operations

Avoid:

- upload logic in views
- duplicated CSV parsing
- tightly coupled persistence workflows

---

# Dependencies

# Existing Frontend Dependencies

```txt
@tanstack/react-query
axios
react-dropzone
papaparse
react-hook-form
zod
```

---

# Existing Backend Dependencies

```txt
django
djangorestframework
psycopg2-binary
```

---

# Optional Recommended Backend Dependencies

```bash
pip install django-filter
```

for recipient filtering support.

---

```bash
pip install pandas
```

for future advanced import processing.

---

# Existing Related Units

This unit depends on:

```txt
Unit 19 — Campaign & Distribution Data Layer
Unit 21 — Audience Management UI
```

---

# Verification Checklist

# Audience CRUD

- [ ] Audience creation works
- [ ] Audience updates persist correctly
- [ ] Audience deletion functions safely
- [ ] Audience listing loads properly

---

# Upload Processing

- [ ] CSV parsing works correctly
- [ ] Upload validation functions
- [ ] Invalid rows detected
- [ ] Duplicate emails prevented

---

# Recipient Persistence

- [ ] Recipients persist successfully
- [ ] Bulk inserts function efficiently
- [ ] Relationships saved correctly
- [ ] Transactions behave safely

---

# Validation

- [ ] Email validation enforced
- [ ] Required field validation works
- [ ] Duplicate detection operational
- [ ] Malformed CSV handling works

---

# API Integration

- [ ] Frontend mutations work
- [ ] Query invalidation functions
- [ ] Backend responses standardized
- [ ] Upload endpoints operational

---

# Permissions & Security

- [ ] Audience ownership enforced
- [ ] Unauthorized access blocked
- [ ] Foreign audience access prevented
- [ ] Upload permissions validated

---

# Accessibility

- [ ] Upload accessibility implemented
- [ ] Error announcements accessible
- [ ] Keyboard workflows functional
- [ ] Screen reader compatibility verified

---

# Mobile Optimization

- [ ] Mobile uploads work
- [ ] Upload summaries responsive
- [ ] File selection compatible
- [ ] Touch interactions optimized

---

# Performance

- [ ] Bulk uploads performant
- [ ] Contact pagination efficient
- [ ] Database queries optimized
- [ ] Large audience rendering stable

---

# Developer Experience

- [ ] Upload services modularized
- [ ] Validation centralized
- [ ] Persistence workflows reusable
- [ ] Architecture scalable for campaign automation

---

# Visible Result

By the end of Unit 22:

- audience management becomes fully functional
- audience CRUD operations operate reliably
- CSV upload processing works successfully
- recipient persistence infrastructure is operational
- scalable contact management workflows are established
- InsightFlow has a production-ready audience management system ready for campaign orchestration, survey distribution, AI-driven segmentation, and future outreach automation systems