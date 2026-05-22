## Goal

Design and implement the backend infrastructure required to collect, validate, store, and manage survey responses and answers within InsightFlow.  
The outcome of this unit is a scalable response system where submitted survey responses are persistently stored, linked to surveys/questions, and accessible through secure submission APIs.

---

# Design

## Response Infrastructure Philosophy

The survey response system should prioritize:

- scalability
- normalized relational design
- analytics readiness
- flexible answer structures
- secure submission handling
- future AI-processing compatibility

The architecture should support both anonymous and authenticated survey participation while maintaining structured and query-efficient response storage.

---

## Response Architecture Philosophy

The response system should separate:

| Entity | Responsibility |
|---|---|
| Response | Submission-level metadata |
| Answer | Individual question responses |
| Survey | Survey ownership and structure |
| Question | Question definitions |

---

## High-Level Data Relationships

```txt
Survey
  ↓
Question

Survey
  ↓
Response
  ↓
Answer
  ↓
Question
```

---

## Submission Workflow Philosophy

The system should support:

```txt
Survey Submission
→ Validation
→ Response Creation
→ Answer Persistence
→ Completion Tracking
```

---

## Data Integrity Philosophy

The response infrastructure should ensure:

- answers belong to valid questions
- responses belong to valid surveys
- question ordering consistency
- supported answer formats
- future analytics compatibility

---

## Supported Submission Scope (Initial Version)

The initial implementation should support:

| Question Type | Supported |
|---|---|
| short_text | Yes |
| long_text | Yes |
| multiple_choice | Yes |
| checkbox | Yes |
| rating | Yes |

---

## Deferred Features

The following should be postponed for future units:

- file upload answers
- draft responses
- response editing
- partial submissions
- collaborative responses
- conditional branching validation
- offline synchronization

---

# Implementation

# 1. Response App Structure

## Objective

Create modular response infrastructure architecture.

---

## Recommended Structure

```txt
/backend/apps/responses
├── migrations
├── models
│   ├── response.py
│   └── answer.py
│
├── serializers
│   ├── submission_serializer.py
│   ├── response_serializer.py
│   └── answer_serializer.py
│
├── views
│   └── submission_views.py
│
├── services
│   ├── submission_service.py
│   ├── validation_service.py
│   └── answer_normalization_service.py
│
├── permissions.py
├── urls.py
├── constants.py
├── exceptions.py
└── utils.py
```

---

# 2. Response Model Design

## Objective

Store submission-level survey response metadata.

---

## File

```txt
apps/responses/models/response.py
```

---

## Response Responsibilities

The response model should store:

- survey relationship
- respondent information
- submission timestamps
- submission metadata

---

## Suggested Response Fields

| Field | Purpose |
|---|---|
| survey | Related survey |
| respondent | Optional authenticated user |
| submitted_at | Submission timestamp |
| metadata | Flexible submission metadata |

---

## Recommended Model Example

```python
class Response(models.Model):
    survey = models.ForeignKey(
        Survey,
        related_name="responses",
        on_delete=models.CASCADE
    )

    respondent = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    metadata = models.JSONField(
        default=dict,
        blank=True
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True
    )
```

---

# 3. Answer Model Design

## Objective

Store individual answers for each response.

---

## File

```txt
apps/responses/models/answer.py
```

---

## Answer Relationships

Each answer should belong to:

```txt
One Response
One Question
```

---

## Suggested Answer Fields

| Field | Purpose |
|---|---|
| response | Parent response |
| question | Related question |
| value | Normalized answer value |
| metadata | Flexible answer metadata |

---

## Recommended Model Example

```python
class Answer(models.Model):
    response = models.ForeignKey(
        Response,
        related_name="answers",
        on_delete=models.CASCADE
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE
    )

    value = models.JSONField()

    metadata = models.JSONField(
        default=dict,
        blank=True
    )
```

---

# 4. Answer Normalization Strategy

## Objective

Standardize answer storage across question types.

---

## Storage Philosophy

Use:

```txt
JSONField
```

for answer values to support flexible response formats.

---

## Example Answer Structures

### Short Text

```json
{
  "value": "Great experience"
}
```

---

### Multiple Choice

```json
{
  "value": "Option A"
}
```

---

### Checkbox

```json
{
  "value": ["Option A", "Option B"]
}
```

---

### Rating

```json
{
  "value": 5
}
```

---

## Why JSONField

This supports:

- future extensibility
- analytics normalization
- flexible answer structures
- AI processing pipelines

---

# 5. Submission Serializer Architecture

## Objective

Validate incoming survey submissions.

---

## File

```txt
serializers/submission_serializer.py
```

---

## Responsibilities

The serializer should validate:

- survey existence
- required questions
- supported answer formats
- valid question references

---

## Suggested Submission Payload

```json
{
  "survey_id": 1,
  "answers": [
    {
      "question_id": 10,
      "value": "Example"
    }
  ]
}
```

---

# 6. Submission Validation Service

## Objective

Centralize survey answer validation logic.

---

## File

```txt
services/validation_service.py
```

---

## Responsibilities

The validation layer should verify:

- required questions answered
- answer types valid
- question belongs to survey
- supported value structure

---

## Validation Examples

### Rating Validation

Ensure:

```txt
value is numeric
```

---

### Checkbox Validation

Ensure:

```txt
value is array
```

---

### Required Question Validation

Reject submissions missing required answers.

---

# 7. Answer Normalization Service

## Objective

Normalize frontend answers before persistence.

---

## File

```txt
services/answer_normalization_service.py
```

---

## Responsibilities

The normalization layer should:

- sanitize values
- normalize types
- standardize structures
- prepare analytics-ready data

---

## Example Workflow

```txt
Frontend Payload
→ Normalize Structure
→ Validate
→ Persist
```

---

# 8. Submission Service Orchestration

## Objective

Centralize submission persistence workflows.

---

## File

```txt
services/submission_service.py
```

---

## Responsibilities

The submission service should:

- create response records
- create answer records
- validate submission integrity
- manage transactions

---

## Suggested Workflow

```txt
Validate Submission
→ Create Response
→ Create Answers
→ Persist Database State
→ Return Success Response
```

---

# 9. Submission API Design

## Objective

Expose secure response submission endpoints.

---

## Primary Endpoint

```txt
POST /api/v1/surveys/:id/submit/
```

---

## Optional Future Endpoints

| Endpoint | Purpose |
|---|---|
| GET `/responses/:id/` | Response detail |
| GET `/surveys/:id/responses/` | Survey analytics |
| DELETE `/responses/:id/` | Admin deletion |

---

## Authentication Philosophy

The system should support:

| Submission Type | Supported |
|---|---|
| Anonymous | Yes |
| Authenticated | Yes |

---

# 10. Submission View Architecture

## Objective

Create scalable DRF submission views.

---

## File

```txt
views/submission_views.py
```

---

## Recommended Approach

Use:

```txt
APIView
```

or

```txt
GenericAPIView
```

---

## Responsibilities

Views should:

- validate payloads
- call submission service
- return structured responses
- handle validation failures

---

# 11. Database Transaction Safety

## Objective

Prevent partial response persistence.

---

## Required Strategy

Use:

```txt
Database transactions
```

for all submissions.

---

## Transaction Philosophy

If any answer fails validation:

```txt
Rollback entire submission
```

---

## Integrity Goals

Prevent:

- orphaned answers
- incomplete responses
- inconsistent survey state

---

# 12. Response Metadata Management

## Objective

Support extensible response metadata storage.

---

## Suggested Metadata Examples

```json
{
  "completion_time_seconds": 120,
  "source": "web",
  "device": "mobile"
}
```

---

## Future Metadata Possibilities

Support:

- geographic metadata
- AI scoring
- engagement metrics
- synthetic-response indicators

---

# 13. Response Security Standards

## Objective

Protect response infrastructure from invalid or malicious submissions.

---

## Security Requirements

The backend should:

- validate all payloads
- reject invalid question references
- sanitize answers
- limit payload sizes

---

## Validation Rules

Reject:

- unsupported answer structures
- invalid question IDs
- malformed payloads
- oversized submissions

---

# 14. Query Optimization Preparation

## Objective

Prepare response system for analytics workloads.

---

## Recommended Database Indexes

Add indexes for:

```python
survey
submitted_at
question
```

---

## Optimization Goals

Optimize for:

- analytics queries
- response aggregation
- dashboard reporting
- AI processing pipelines

---

# 15. Future Extensibility Preparation

## Objective

Prepare response infrastructure for advanced analytics.

---

## Future Features Supported

Architecture should support:

- response analytics
- AI-generated insights
- response scoring
- synthetic responses
- partial submissions
- autosave drafts
- collaborative surveys
- response exports

---

## Extensibility Philosophy

Keep:

- validation modular
- normalization isolated
- answer storage flexible

---

# 16. API Response Standardization

## Objective

Ensure predictable frontend integration.

---

## Success Response Example

```json
{
  "success": true,
  "data": {
    "response_id": 15
  }
}
```

---

## Error Response Example

```json
{
  "success": false,
  "error": {
    "message": "Required question missing"
  }
}
```

---

# 17. Developer Experience Standards

## Objective

Maintain scalable backend architecture.

---

## Rules

Response infrastructure should:

- isolate services
- separate validation logic
- centralize normalization
- avoid business logic in views

---

## Architectural Principles

Prefer:

- reusable validation services
- modular serializers
- transaction-safe workflows

Avoid:

- direct model persistence inside views
- duplicated validation logic
- tightly coupled answer handling

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

for future analytics filtering support.

---

# Existing Related Units

This unit depends on:

```txt
Unit 8 — Survey Data Architecture
```

---

# Verification Checklist

# Response Models

- [ ] Response model created successfully
- [ ] Answer model created successfully
- [ ] Relationships configured correctly
- [ ] Database migrations run successfully

---

# Submission APIs

- [ ] Survey submission endpoint works
- [ ] Valid submissions persist correctly
- [ ] Invalid submissions rejected properly
- [ ] Structured responses returned

---

# Validation

- [ ] Required questions validated
- [ ] Invalid question references rejected
- [ ] Unsupported answer formats rejected
- [ ] Question-survey relationships enforced

---

# Persistence

- [ ] Responses persist successfully
- [ ] Answers persist successfully
- [ ] Database transactions rollback properly
- [ ] No partial submissions occur

---

# Answer Normalization

- [ ] Text answers normalize correctly
- [ ] Checkbox arrays normalize correctly
- [ ] Rating values normalize correctly
- [ ] Metadata structures preserved

---

# Security

- [ ] Invalid payloads rejected
- [ ] Payload size validation works
- [ ] Sanitization applied correctly
- [ ] Malicious submissions blocked

---

# Database Integrity

- [ ] Foreign key relationships valid
- [ ] Cascade behavior works correctly
- [ ] Timestamps generated correctly
- [ ] Indexes applied successfully

---

# Developer Experience

- [ ] Services modularized correctly
- [ ] Validation isolated
- [ ] Normalization reusable
- [ ] Architecture scalable for analytics

---

# Visible Result

By the end of Unit 14:

- survey responses can be stored successfully
- answer persistence infrastructure is operational
- survey submission APIs function correctly
- responses validate against survey structures
- scalable response storage architecture is established
- InsightFlow has a production-ready foundation for analytics, AI processing, response intelligence, and future survey participation workflows
