## Goal

Establish a production-ready deployment infrastructure for InsightFlow using Render for the Django backend, Neon for managed PostgreSQL, and Vercel for the React frontend, including environment management and automated deployment workflows.  
The outcome of this unit is a publicly accessible InsightFlow application with stable frontend-backend connectivity, secure environment configuration, and scalable deployment architecture.

---

# Design

## Deployment Architecture Philosophy

The deployment architecture should prioritize:

- simplicity
- scalability
- reliability
- environment isolation
- rapid iteration
- developer-friendly deployment workflows
- production readiness

The deployment setup should support future scaling without major infrastructure rewrites.

---

## Platform Selection

| Service | Purpose |
|---|---|
| Render | Django backend hosting |
| Neon | Managed serverless PostgreSQL database |
| Vercel | React frontend hosting |
| GitHub | Source control + deployment integration |

---

## Infrastructure Architecture

### Frontend Deployment

Hosted on:

```txt
Vercel
```

Responsibilities:

- React application hosting
- static asset delivery
- CDN optimization
- automatic deployments

---

### Backend Deployment

Hosted on:

```txt
Render
```

Responsibilities:

- Django API hosting
- API runtime execution
- environment management
- database connectivity

---

### Database Hosting

Hosted using:

```txt
Neon (serverless PostgreSQL)
```

Responsibilities:

- persistent data storage
- production database management
- secure credentials via DATABASE_URL
- automatic backups (built-in)

---

## Deployment Flow

```txt
GitHub Push
    ↓
Vercel Build Trigger
    ↓
React Frontend Deployment

GitHub Push
    ↓
Render Build Trigger
    ↓
Django API Deployment
    ↓
Neon PostgreSQL Connection
```

---

## Environment Separation

The project should support:

| Environment | Purpose |
|---|---|
| Development | Local development |
| Production | Live deployment |

Future environments may include:

- staging
- testing
- preview deployments

---

# Implementation

# 1. Repository Structure Preparation

## Objective

Prepare the monorepo structure for deployment compatibility.

---

## Recommended Structure

```txt
/InsightFlow
├── frontend
├── backend
├── render.yaml
├── .gitignore
└── README.md
```

---

## Deployment Separation

### Frontend

Deployed independently to:

```txt
Vercel
```

### Backend

Deployed independently to:

```txt
Render
```

This separation improves scalability and deployment flexibility.

---

# 2. Render Backend Deployment Setup

## Objective

Deploy Django backend APIs to Render.

---

## Render Project Setup

Create:

- Render account
- Render web service (Python runtime)
- GitHub integration

---

## GitHub Integration

Connect Render directly to the GitHub repository.

Deployment strategy:

```txt
Automatic deployments on push to main branch
```

---

## Backend Root Directory

Configure Render root directory:

```txt
/backend
```

---

## render.yaml (Infrastructure as Code)

Located at project root:

```yaml
services:
  - type: web
    name: insightflow-backend
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements/production.txt && python manage.py collectstatic --noinput && python manage.py migrate
    startCommand: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
    envVars:
      - key: DJANGO_SETTINGS_MODULE
        value: config.settings.production
      - key: PYTHON_VERSION
        value: 3.11.0
```

---

# 3. Neon PostgreSQL Integration

## Objective

Connect production PostgreSQL database to Django via Neon.

---

## Neon Service

Create a serverless PostgreSQL project on Neon.

Neon provides a single `DATABASE_URL` connection string:

```txt
postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

---

## Django Database Configuration

Backend reads the connection string via `django-environ`:

```python
DATABASES = {
    "default": env.db("DATABASE_URL")
}
```

The `sslmode=require` in the Neon URL is parsed automatically.

---

# 4. Production Django Configuration

## Objective

Prepare Django for production deployment.

---

## Production Settings File

Use:

```txt
config/settings/production.py
```

---

## Required Production Settings

### Disable Debug Mode

```python
DEBUG = False
```

---

## Allowed Hosts

```python
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[".onrender.com"])
```

---

## CSRF Trusted Origins

```python
CSRF_TRUSTED_ORIGINS = [
    "https://*.onrender.com",
    "https://*.vercel.app",
]
```

---

## Secure Proxy SSL Header

```python
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
```

---

## Security Middleware

Enable:

- HTTPS redirects
- secure cookies
- XSS protection
- content type sniffing prevention

---

# 5. Gunicorn Production Server Setup

## Objective

Run Django using a production-grade WSGI server.

---

## Install Gunicorn

Already in `requirements/production.txt`:

```txt
gunicorn>=22.0,<23.0
```

---

## Render Start Command

Configured in `render.yaml`:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

---

## Why Gunicorn

Chosen because:

- production stability
- compatibility with Render
- lightweight deployment
- standard Django production server

---

# 6. Static File Handling

## Objective

Serve Django static assets correctly in production.

---

## WhiteNoise

Already in `requirements/production.txt`:

```txt
whitenoise>=6.0,<7.0
```

---

## Middleware Configuration

In `production.py`:

```python
"whitenoise.middleware.WhiteNoiseMiddleware",
```

placed after:

```python
"django.middleware.security.SecurityMiddleware",
```

---

## Static File Configuration

In `base.py`:

```python
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
```

In `production.py`:

```python
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

---

## Static File Collection

Render build process runs:

```bash
python manage.py collectstatic --noinput
```

---

# 7. Render Environment Variables

## Objective

Securely manage production secrets.

---

## Required Backend Variables

```env
SECRET_KEY=production_secret_key
DJANGO_SETTINGS_MODULE=config.settings.production
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
ALLOWED_HOSTS=.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

## Future Environment Variables

Planned future variables:

```env
OPENAI_API_KEY=
EMAIL_HOST=
EMAIL_PORT=
REDIS_URL=
JWT_SECRET=
```

---

# 8. Vercel Frontend Deployment Setup

## Objective

Deploy React frontend to Vercel.

---

## Vercel Project Setup

Create:

- Vercel account
- frontend project
- GitHub integration

---

## Frontend Root Directory

Configure:

```txt
/frontend
```

---

## Framework Preset

Use:

```txt
Vite
```

---

## Build Command

```bash
npm run build
```

---

## Output Directory

```txt
dist
```

---

# 9. Frontend Production Environment Configuration

## Objective

Connect frontend to deployed backend APIs.

---

## Required Frontend Variables

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
VITE_APP_NAME=InsightFlow
VITE_ENVIRONMENT=production
```

---

## API Base URL Strategy

Frontend should NEVER hardcode backend URLs.

Always use:

```ts
import.meta.env.VITE_API_BASE_URL
```

through centralized environment utilities at `src/lib/env/index.ts`.

---

# 10. Frontend Routing Configuration

## Objective

Ensure React Router works correctly in production.

---

## Vercel Rewrite Rules

Located at:

```txt
frontend/vercel.json
```

---

## Rewrite Configuration

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Purpose

Supports:

- SPA routing
- page refreshes
- nested frontend routes

---

# 11. Cross-Origin Configuration

## Objective

Allow secure frontend-backend communication in production.

---

## Backend CORS Configuration

In production environment variables:

```env
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

## Future Custom Domain Support

Architecture should support:

```txt
https://app.insightflow.ai
```

---

# 12. Deployment Pipeline Setup

## Objective

Enable automatic deployments from GitHub.

---

## CI/CD Workflow

### Frontend

```txt
GitHub Push → Vercel Deploy
```

### Backend

```txt
GitHub Push → Render Deploy
```

---

## Branch Strategy

Recommended:

| Branch | Purpose |
|---|---|
| `main` | Production |
| `develop` | Development |
| `feature/*` | Feature branches |

---

## Deployment Automation Goals

Each deployment should automatically:

- install dependencies
- build application
- run migrations
- collect static files
- restart services

---

# 13. Backend Deployment Commands

## Objective

Automate backend startup process.

---

## Render Build Command

```bash
pip install -r requirements/production.txt && python manage.py collectstatic --noinput && python manage.py migrate
```

---

## Render Start Command

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

---

# 14. Health Monitoring Endpoint

## Objective

Verify deployment health.

---

## Backend Health Endpoint

```txt
GET /api/v1/health/
```

---

## Frontend Connectivity Test

Frontend dashboard should verify:

- API accessibility
- response status
- deployment health

---

## Expected Response

```json
{
  "status": "ok",
  "service": "InsightFlow API"
}
```

---

# 15. Logging & Error Monitoring Foundation

## Objective

Prepare for production monitoring.

---

## Backend Logging

Django should support:

- console logs
- request logs
- error logs
- deployment debugging

---

## Future Monitoring Integrations

Planned support:

- Sentry
- Grafana
- Render metrics
- Vercel analytics

---

# 16. Deployment Security Foundation

## Objective

Ensure secure production deployment.

---

## Security Requirements

### Backend

- secure environment variables
- HTTPS-only communication
- debug disabled
- secure cookies
- restricted hosts

---

### Frontend

- environment isolation
- no secret exposure
- API-only communication

---

## Secret Handling Rule

Secrets should NEVER:

- exist in source code
- exist in GitHub repository
- be committed in `.env`

---

# Dependencies

# Backend Dependencies

Already in `requirements/production.txt`:

```txt
gunicorn>=22.0,<23.0
whitenoise>=6.0,<7.0
```

---

# Existing Dependencies Required

From previous units:

```txt
django
djangorestframework
psycopg2-binary
django-cors-headers
django-environ
```

---

# Frontend Dependencies

No additional required dependencies beyond Unit 3.

---

# Platform Dependencies

Required accounts/services:

- GitHub
- Render
- Neon
- Vercel

---

# Verification Checklist

# Render Backend Deployment

- [ ] Render project created successfully
- [ ] Django backend deploys without errors
- [ ] Gunicorn server runs correctly
- [ ] Neon PostgreSQL connected successfully via DATABASE_URL
- [ ] Environment variables load correctly

---

# PostgreSQL (Neon)

- [ ] Production database accessible
- [ ] Django migrations run successfully
- [ ] Database persists data correctly

---

# Static Files

- [ ] WhiteNoise configured correctly
- [ ] Static files served successfully
- [ ] `collectstatic` executes during deployment

---

# Vercel Frontend Deployment

- [ ] Frontend deploys successfully
- [ ] Vercel build passes
- [ ] React routes work correctly
- [ ] SPA refreshes work without 404 errors

---

# Frontend ↔ Backend Communication

- [ ] Frontend connects to deployed backend
- [ ] Production API requests succeed
- [ ] CORS configuration works correctly
- [ ] Health endpoint accessible publicly

---

# Environment Variables

- [ ] Production environment variables configured
- [ ] Secrets not exposed publicly
- [ ] Frontend environment variables resolve correctly
- [ ] Backend environment variables resolve correctly

---

# Deployment Pipeline

- [ ] GitHub integration works
- [ ] Automatic deployments trigger correctly
- [ ] Deployment failures visible in logs
- [ ] Rollback process possible if needed

---

# Security

- [ ] DEBUG disabled in production
- [ ] HTTPS enabled
- [ ] Allowed hosts configured correctly
- [ ] CSRF trusted origins configured
- [ ] Sensitive credentials protected

---

# Production Readiness

- [ ] Application accessible online
- [ ] Frontend loads successfully
- [ ] Backend APIs respond correctly
- [ ] Database operational
- [ ] Deployment architecture scalable for future growth

---

# Visible Result

By the end of Unit 4:

- InsightFlow is deployed online
- React frontend is hosted on Vercel
- Django backend is hosted on Render
- Neon PostgreSQL database is connected in production
- frontend and backend communicate successfully in production
- environment variables are securely managed
- automatic deployment pipelines are operational
- InsightFlow has a scalable production-ready deployment architecture
