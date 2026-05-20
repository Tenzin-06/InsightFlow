# Unit 2 Specification — Backend API Foundation

## Goal

Establish the foundational backend architecture for InsightFlow using Django, Django REST Framework, and PostgreSQL, including scalable API configuration, environment management, and modular backend structure.  
The outcome of this unit is a production-ready backend foundation capable of serving REST APIs for authentication, survey management, analytics, AI processing, and future platform services.

---

# Design

## Backend Architecture Philosophy

The backend should follow a modular and scalable service-oriented architecture using Django apps for domain separation.

The architecture should prioritize:

- maintainability
- scalability
- clean API structure
- security best practices
- environment isolation
- future AI service integration
- PostgreSQL optimization

---

## Architectural Principles

### Modular App Structure

Each major business domain should exist as an isolated Django app.

Examples:

| App              | Responsibility                      |
| ---------------- | ----------------------------------- |
| `authentication` | Login, registration, JWT handling   |
| `users`          | User profile management             |
| `surveys`        | Survey creation and management      |
| `analytics`      | AI insights and metrics             |
| `campaigns`      | Survey distribution                 |
| `core`           | Shared utilities and configurations |

---

## API Design Philosophy

The API should follow RESTful principles:

- resource-based endpoints
- versioned APIs
- consistent response formatting
- centralized error handling
- stateless authentication readiness
- JSON-only communication

---

## Initial API Structure

Base API namespace:

```txt
/api/v1/
```

Examples:

```txt
/api/v1/auth/
/api/v1/users/
/api/v1/surveys/
/api/v1/analytics/
```

---

## Database Design Direction

PostgreSQL is selected because:

- excellent Django support
- scalability
- JSON field support
- analytics compatibility
- strong indexing capabilities
- future AI/vector search compatibility

The backend should be structured to support future:

- Redis integration
- Celery background jobs
- AI pipelines
- WebSocket services
- multi-tenant architecture

---

# Implementation

# 1. Backend Project Initialization

## Framework Stack

Use:

- Python 3.12+
- Django
- Django REST Framework
- PostgreSQL

---

## Project Creation

### Create Virtual Environment

```bash
python -m venv venv
```

---

### Activate Environment

#### Windows

```bash
venv\Scripts\activate
```

#### macOS/Linux

```bash
source venv/bin/activate
```

---

### Install Django

```bash
pip install django
```

---

### Create Backend Project

```bash
django-admin startproject config .
```

---

## Why `config`

The `config` project acts as the centralized configuration layer for:

- settings
- URL routing
- middleware
- ASGI/WSGI entrypoints
- environment loading

---

# 2. Backend Folder Structure

The backend should use a scalable modular structure.

## Base Structure

```txt
/backend
├── apps
│   ├── authentication
│   ├── users
│   ├── surveys
│   ├── analytics
│   ├── campaigns
│   └── core
│
├── config
│   ├── settings
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   │
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── requirements
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
│
├── scripts
├── static
├── media
├── .env
├── manage.py
└── README.md
```

---

# 3. Django REST Framework Setup

## Objective

Provide a scalable API layer for all frontend communication.

---

## Install DRF

```bash
pip install djangorestframework
```

---

## Add to Installed Apps

In:

```txt
config/settings/base.py
```

Add:

```python
INSTALLED_APPS = [
    "rest_framework",
]
```

---

## DRF Global Configuration

Create centralized REST framework settings.

Example:

```python
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}
```

---

## API Response Standardization

All APIs should return:

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Request successful"
}
```

---

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Validation failed"
  }
}
```

---

# 4. PostgreSQL Integration

## Objective

Configure PostgreSQL as the primary database.

---

## Install PostgreSQL Driver

```bash
pip install psycopg2-binary
```

---

## Database Configuration

Environment variables should manage all credentials.

Example `.env`:

```env
DB_NAME=insightflow
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

---

## Django Database Setup

In:

```txt
config/settings/base.py
```

Configure:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
    }
}
```

---

# 5. Environment Variable Management

## Objective

Prevent secrets from being hardcoded.

---

## Install Environment Loader

```bash
pip install django-environ
```

---

## Configure Environment Loading

Inside:

```txt
config/settings/base.py
```

Example:

```python
import environ

env = environ.Env()

environ.Env.read_env()
```

---

## Required Environment Variables

```env
DEBUG=True
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

# 6. Settings Modularization

## Objective

Separate development and production configurations.

---

## Base Settings

Contains:

- installed apps
- middleware
- templates
- DRF config
- shared configuration

---

## Development Settings

Contains:

- DEBUG=True
- local database config
- development middleware

---

## Production Settings

Contains:

- security hardening
- HTTPS settings
- production logging
- optimized static file settings

---

# 7. Base API Configuration

## Objective

Create a clean API entry structure.

---

## Main URL Configuration

Inside:

```txt
config/urls.py
```

Add:

```python
urlpatterns = [
    path("api/v1/", include("apps.core.urls")),
]
```

---

## Health Check Endpoint

Create:

```txt
/api/v1/health/
```

Purpose:

- deployment verification
- API monitoring
- infrastructure health testing

---

## Example Health Response

```json
{
  "status": "ok",
  "service": "InsightFlow API"
}
```

---

# 8. Core App Setup

## Objective

Provide shared utilities and foundational backend logic.

---

## Create Core App

```bash
python manage.py startapp core apps/core
```

---

## Core Responsibilities

The core app should manage:

- shared responses
- utility helpers
- health checks
- base permissions
- pagination
- exception handlers

---

# 9. CORS Configuration

## Objective

Allow frontend-backend communication.

---

## Install CORS Package

```bash
pip install django-cors-headers
```

---

## Middleware Configuration

Add:

```python
"corsheaders.middleware.CorsMiddleware",
```

before:

```python
"django.middleware.common.CommonMiddleware",
```

---

## Development CORS Setup

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

This supports the Vite frontend server.

---

# 10. Static and Media Configuration

## Objective

Prepare backend for future uploads and assets.

---

## Static Configuration

```python
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
```

---

## Media Configuration

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

---

# 11. Logging Foundation

## Objective

Prepare centralized backend logging.

---

## Logging Requirements

The backend should support:

- API error logging
- database errors
- authentication failures
- debugging logs
- production monitoring

---

## Initial Logging Setup

Configure console logging in development mode.

Future integrations may include:

- Sentry
- ELK stack
- Grafana
- Prometheus

---

# 12. API Versioning Strategy

## Objective

Ensure future API evolution without breaking clients.

---

## API Namespace Standard

```txt
/api/v1/
```

Future versions:

```txt
/api/v2/
/api/v3/
```

This allows non-breaking API evolution.

---

# 13. Development Workflow Standards

## Code Organization

Apps should contain:

```txt
models.py
views.py
serializers.py
urls.py
services.py
selectors.py
tests/
```

---

## Service Layer Pattern

Business logic should eventually move into:

```txt
services.py
```

This prevents oversized views and models.

---

## Selector Pattern

Read/query logic should eventually move into:

```txt
selectors.py
```

This improves maintainability.

---

# Dependencies

## Core Dependencies

```bash
pip install django
pip install djangorestframework
pip install psycopg2-binary
pip install django-environ
pip install django-cors-headers
```

---

## Optional Recommended Dependencies

```bash
pip install drf-spectacular
pip install django-filter
pip install Pillow
```

---

## Development Dependencies

```bash
pip install black
pip install flake8
pip install isort
```

---

# Verification Checklist

# Django Setup

- [ ] Virtual environment created successfully
- [ ] Django installed successfully
- [ ] Django project initializes correctly
- [ ] Development server runs without errors

---

# Django REST Framework

- [ ] DRF installed correctly
- [ ] REST framework added to installed apps
- [ ] JSON responses working correctly
- [ ] Base API routes accessible

---

# PostgreSQL

- [ ] PostgreSQL database created
- [ ] Django connects successfully to PostgreSQL
- [ ] Migrations run successfully
- [ ] Database credentials loaded from environment variables

---

# Environment Configuration

- [ ] `.env` variables load correctly
- [ ] Secret key not hardcoded
- [ ] Debug settings configurable per environment

---

# API Foundation

- [ ] `/api/v1/` namespace configured
- [ ] Health check endpoint functional
- [ ] Standard JSON response structure implemented
- [ ] Error responses handled correctly

---

# CORS Configuration

- [ ] Frontend can access backend APIs
- [ ] CORS errors resolved in development
- [ ] Allowed origins configurable

---

# Project Structure

- [ ] Modular app structure created
- [ ] Settings split into multiple files
- [ ] Core app configured successfully
- [ ] Imports resolve correctly

---

# Static & Media

- [ ] Static configuration works
- [ ] Media directory configured
- [ ] File paths resolve correctly

---

# Developer Experience

- [ ] Black formatting works
- [ ] Flake8 linting works
- [ ] Project structure scalable for future modules

---

# Visible Result

By the end of Unit 2:

- Django backend runs successfully
- PostgreSQL is connected
- Django REST Framework is configured
- versioned API routes exist
- frontend can communicate with backend
- health check endpoint works
- scalable backend architecture is established
- InsightFlow backend is ready for authentication, survey APIs, analytics, and AI services
