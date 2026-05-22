## Goal

Implement the backend infrastructure and processing pipeline required to import Google Forms into InsightFlow, including Google Forms parsing, question normalization, and import API workflows.  
The outcome of this unit is a production-ready import system capable of converting supported Google Forms into fully functional InsightFlow survey structures.

---

# Design

## Import System Philosophy

The Google Forms import system should prioritize:

- reliability
- normalization consistency
- extensibility
- fault tolerance
- secure parsing
- scalable import architecture

The system should transform external Google Forms data into standardized internal survey structures without compromising survey integrity.

---

## Import Pipeline Philosophy

The import system should follow a staged processing pipeline:

```txt
Google Form URL
  ↓
Validation
  ↓
Form Retrieval
  ↓
Form Parsing
  ↓
Question Extraction
  ↓
Question Normalization
  ↓
Survey Creation
  ↓
Database Persistence
```

---

## System Architecture

### High-Level Import Architecture

```txt
Frontend Import UI
  ↓
Import API Endpoint
  ↓
Google Forms Parser Service
  ↓
Normalization Layer
  ↓
Survey Builder Service
  ↓
PostgreSQL Persistence
```

---

## Normalization Philosophy

Google Forms data should be transformed into:

```txt
InsightFlow-standard survey schema
```

This ensures:

- consistent analytics
- reusable survey architecture
- future AI processing compatibility
- standardized response collection

---

## Supported Import Scope (Initial Version)

The initial implementation should support:

| Google Forms Feature | Supported |
|---|---|
| Short Answer | Yes |
| Paragraph | Yes |
| Multiple Choice | Yes |
| Checkboxes | Yes |
| Linear Scale | Yes |
| Question Titles | Yes |
| Required Questions | Yes |

---

## Deferred Features

The following should be postponed for future units:

- file uploads
- images
- sections/pages
- branching logic
- quizzes
- response imports
- conditional navigation
- embedded media

---

# Implementation

# 1. Google Forms Import App Structure

## Objective

Create isolated backend import architecture.

---

## Recommended Structure

```txt
/backend/apps/google_forms_import
├── migrations
├── services
│   ├── parser_service.py
│   ├── normalization_service.py
│   ├── import_service.py
│   ├── survey_builder_service.py
│   └── validation_service.py
│
├── serializers
│   └── import_serializer.py
│
├── views
│   └── import_views.py
│
├── utils
│   ├── html_parser.py
│   ├── question_mapper.py
│   └── url_utils.py
│
├── urls.py
├── exceptions.py
├── constants.py
└── types.py
```

---

# 2. Google Forms URL Validation

## Objective

Validate submitted Google Forms URLs before processing.

---

## Supported URL Pattern

```txt
https://docs.google.com/forms/
```

---

## Validation Rules

The system should validate:

- valid Google Forms domain
- supported URL format
- publicly accessible forms
- non-empty input

---

## Invalid URL Handling

Reject:

- malformed URLs
- unsupported domains
- private forms
- unsupported Google Forms variants

---

## Validation Response Example

```json
{
  "success": false,
  "error": {
    "message": "Invalid Google Forms URL"
  }
}
```

---

# 3. Google Forms Retrieval System

## Objective

Retrieve raw Google Forms data for parsing.

---

## Retrieval Strategy

The backend should:

- fetch form HTML
- extract embedded form data
- sanitize retrieved content

---

## Suggested Workflow

```txt
URL
→ HTTP Request
→ HTML Retrieval
→ Embedded Data Extraction
```

---

## Security Requirements

The retrieval layer should:

- sanitize responses
- limit request sizes
- reject suspicious payloads
- prevent SSRF vulnerabilities

---

# 4. Parser Service

## Objective

Extract survey structure from Google Forms data.

---

## File

```txt
services/parser_service.py
```

---

## Responsibilities

The parser should extract:

- form title
- form description
- questions
- question types
- options
- required state

---

## Parsing Workflow

```txt
Raw Google Form
→ Parse Embedded Data
→ Extract Questions
→ Convert to Intermediate Structure
```

---

## Intermediate Structure Example

```json
{
  "title": "Research Survey",
  "questions": []
}
```

---

# 5. Question Type Mapping

## Objective

Map Google Forms question types to InsightFlow schema types.

---

## Mapping Table

| Google Forms Type | InsightFlow Type |
|---|---|
| Short Answer | short_text |
| Paragraph | long_text |
| Multiple Choice | multiple_choice |
| Checkboxes | checkbox |
| Linear Scale | rating |

---

## Unknown Type Handling

Unsupported question types should:

- be skipped safely
or
- generate structured warnings

---

## Warning Example

```json
{
  "warning": "Unsupported question type skipped"
}
```

---

# 6. Question Normalization Service

## Objective

Transform parsed questions into normalized InsightFlow schema.

---

## File

```txt
services/normalization_service.py
```

---

## Responsibilities

The normalization layer should:

- standardize question structures
- normalize metadata
- validate supported question types
- ensure consistent ordering

---

## Normalized Question Example

```json
{
  "question_text": "How satisfied are you?",
  "question_type": "rating",
  "is_required": true,
  "order": 1,
  "metadata": {
    "min_rating": 1,
    "max_rating": 5
  }
}
```

---

# 7. Survey Builder Service

## Objective

Convert normalized data into database survey entities.

---

## File

```txt
services/survey_builder_service.py
```

---

## Responsibilities

The service should:

- create survey records
- create question records
- associate ownership
- preserve ordering

---

## Workflow

```txt
Normalized Questions
→ Create Survey
→ Create Questions
→ Persist Relationships
```

---

# 8. Import Service Orchestration

## Objective

Centralize the entire import workflow.

---

## File

```txt
services/import_service.py
```

---

## Responsibilities

The import service should orchestrate:

- URL validation
- form retrieval
- parsing
- normalization
- database persistence
- response formatting

---

## Suggested Workflow

```txt
Validate URL
→ Fetch Form
→ Parse Questions
→ Normalize Data
→ Create Survey
→ Return Response
```

---

# 9. Import API Design

## Objective

Expose secure import endpoints.

---

## Endpoint

```txt
POST /api/v1/import/google-forms/
```

---

## Authentication Requirement

All import endpoints must require:

```python
IsAuthenticated
```

---

## Request Payload

```json
{
  "url": "https://docs.google.com/forms/..."
}
```

---

## Success Response

```json
{
  "success": true,
  "data": {
    "survey_id": 1,
    "title": "Imported Survey"
  }
}
```

---

# 10. Import Serializer

## Objective

Validate import API payloads.

---

## File

```txt
serializers/import_serializer.py
```

---

## Responsibilities

The serializer should validate:

- URL format
- required fields
- supported import source

---

## Suggested Serializer Fields

```python
url
```

---

# 11. Import View Architecture

## Objective

Create scalable DRF import views.

---

## File

```txt
views/import_views.py
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

- authenticate users
- validate payloads
- call import service
- return structured responses

---

# 12. Import Error Handling

## Objective

Provide resilient import behavior.

---

## Error Categories

### Invalid URL

```txt
Unsupported Google Forms URL
```

---

### Parsing Failure

```txt
Unable to parse form structure
```

---

### Unsupported Questions

```txt
Some question types were skipped
```

---

### Network Failure

```txt
Unable to retrieve Google Form
```

---

## Error Response Standardization

All errors should follow:

```json
{
  "success": false,
  "error": {
    "message": "Import failed"
  }
}
```

---

# 13. Import Logging & Debugging

## Objective

Support troubleshooting and monitoring.

---

## Recommended Logging Events

Log:

- import attempts
- parsing failures
- unsupported question types
- successful imports

---

## Logging Goals

Enable:

- debugging
- monitoring
- future analytics

---

# 14. Security Requirements

## Objective

Ensure safe external content processing.

---

## Security Risks to Prevent

The system must protect against:

- SSRF attacks
- malformed HTML
- malicious payloads
- oversized responses

---

## Validation Rules

The backend should:

- whitelist Google Forms domains
- sanitize content
- limit request timeouts
- reject unsupported sources

---

# 15. Database Persistence Rules

## Objective

Ensure reliable survey creation.

---

## Persistence Requirements

Imported surveys should:

- belong to authenticated users
- preserve question ordering
- maintain normalized schema consistency

---

## Atomic Import Strategy

Use:

```txt
Database transactions
```

to avoid partial imports.

---

## Suggested Behavior

If import fails:

```txt
Rollback entire transaction
```

---

# 16. Future Extensibility Preparation

## Objective

Prepare import system for future integrations.

---

## Future Import Sources

Architecture should support:

- Typeform
- SurveyMonkey
- CSV surveys
- JSON imports
- AI-generated imports

---

## Future Parsing Enhancements

Potential future support:

- branching logic
- sections/pages
- images
- quizzes
- response imports
- collaborative migration workflows

---

## Extensibility Philosophy

Keep:

- parsers modular
- normalization isolated
- import sources pluggable

---

# 17. Developer Experience Standards

## Objective

Maintain scalable backend engineering practices.

---

## Rules

Import logic should:

- remain service-oriented
- isolate parsing from persistence
- centralize normalization logic
- avoid business logic inside views

---

## Architecture Principles

Prefer:

- reusable services
- typed intermediate structures
- isolated validation layers

Avoid:

- monolithic import functions
- parser logic inside views
- tightly coupled import workflows

---

# Dependencies

# Existing Backend Dependencies

```txt
django
djangorestframework
psycopg2-binary
requests
beautifulsoup4
```

---

# Recommended Additional Dependencies

```bash
pip install lxml
```

for improved HTML parsing performance.

---

# Recommended Optional Dependencies

```bash
pip install python-dotenv
```

for environment configuration management.

---

# Verification Checklist

# URL Validation

- [ ] Valid Google Forms URLs accepted
- [ ] Invalid URLs rejected
- [ ] Unsupported domains blocked
- [ ] Private forms handled correctly

---

# Form Retrieval

- [ ] Google Forms fetched successfully
- [ ] HTML retrieval works reliably
- [ ] Suspicious payloads rejected
- [ ] Request failures handled correctly

---

# Parsing

- [ ] Form titles extracted correctly
- [ ] Question structures parsed correctly
- [ ] Required fields parsed correctly
- [ ] Supported question types detected

---

# Question Normalization

- [ ] Question types mapped correctly
- [ ] Metadata normalized correctly
- [ ] Ordering preserved
- [ ] Unsupported types handled safely

---

# Survey Persistence

- [ ] Surveys created successfully
- [ ] Questions persist correctly
- [ ] Ownership assigned correctly
- [ ] Transactions rollback on failure

---

# Import APIs

- [ ] Authenticated requests succeed
- [ ] Structured responses returned
- [ ] Error responses standardized
- [ ] Import endpoint secured properly

---

# Security

- [ ] SSRF protections implemented
- [ ] Domain whitelisting works
- [ ] Content sanitized correctly
- [ ] Request limits enforced

---

# Developer Experience

- [ ] Services modularized correctly
- [ ] Parser isolated from persistence
- [ ] Normalization reusable
- [ ] Import architecture scalable

---

# Visible Result

By the end of Unit 13:

- Google Forms import works successfully
- users can import supported Google Forms into InsightFlow
- Google Forms questions normalize into InsightFlow survey schemas
- imported surveys persist correctly in PostgreSQL
- secure import APIs are operational
- scalable import architecture is established for future survey platform integrations
- InsightFlow has a production-ready external survey migration system ready for advanced import workflows and future AI-powered survey transformation capabilities