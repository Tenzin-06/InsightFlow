## Goal

Establish a robust communication layer between the React frontend and Django backend using centralized API utilities, shared environment configuration, and scalable request handling.  
The outcome of this unit is a fully connected frontend-backend foundation where the frontend can successfully consume backend APIs through a reusable and production-ready integration layer.

---

# Design

## Integration Architecture Philosophy

The frontend-backend communication layer should be:

- centralized
- scalable
- environment-aware
- type-safe
- reusable
- authentication-ready
- error-resilient

The architecture should avoid scattered API calls throughout components.

---

## Communication Flow

### Request Flow

```txt
Frontend Component
    ↓
API Service Layer
    ↓
HTTP Client Instance
    ↓
Django REST API
    ↓
JSON Response
    ↓
Frontend State/UI
```

---

## API Layer Design

The frontend should communicate with the backend using a centralized API client.

This structure enables:

- request reuse
- global error handling
- auth token injection
- retry logic
- request interceptors
- response normalization

---

## Environment Design

Frontend and backend environments should remain isolated but coordinated.

### Frontend Environment

Stores:

- API base URL
- frontend-specific feature flags
- analytics keys
- environment mode

### Backend Environment

Stores:

- database credentials
- secret keys
- CORS settings
- backend service configuration

---

## API Namespace Standard

Frontend should communicate only through:

```txt
/api/v1/
```

Example:

```txt
http://localhost:8000/api/v1/
```

This ensures version consistency across the application.

---

## Error Handling Philosophy

The communication layer should support:

- centralized error formatting
- automatic JSON parsing
- request timeout handling
- network failure handling
- future authentication token refresh
- backend validation error parsing

---

# Implementation

# 1. Integration Architecture Setup

## Objective

Create a reusable and scalable API communication foundation.

---

## Frontend Communication Stack

Use:

- Axios
- React Query (TanStack Query)
- centralized API services

---

## Why Axios

Chosen because it provides:

- interceptors
- request cancellation
- timeout handling
- cleaner configuration
- automatic JSON transformation

---

## Why React Query

Chosen because it provides:

- API caching
- background refetching
- loading states
- error management
- request deduplication
- server state synchronization

---

# 2. Frontend API Folder Structure

## Objective

Organize API communication cleanly.

---

## Recommended Structure

```txt
/src
├── lib
│   ├── api
│   │   ├── client.ts
│   │   ├── config.ts
│   │   ├── endpoints.ts
│   │   ├── types.ts
│   │   └── interceptors.ts
│   │
│   ├── env
│   │   └── index.ts
│
├── services
│   ├── auth
│   ├── surveys
│   ├── analytics
│   └── campaigns
│
├── hooks
│   ├── api
│   └── queries
```

---

# 3. Axios API Client Setup

## Objective

Create a centralized HTTP client.

---

## Create API Client

File:

```txt
src/lib/api/client.ts
```

Responsibilities:

- base URL configuration
- request timeout
- JSON headers
- interceptor attachment
- credential handling

---

## Base Axios Configuration

Example:

```ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## Timeout Strategy

Default timeout:

```txt
10 seconds
```

Purpose:

- prevent hanging requests
- improve frontend responsiveness

---

# 4. Shared Environment Handling

## Objective

Create consistent environment management between frontend and backend.

---

# Frontend Environment Variables

## Create

```txt
.env
.env.development
.env.production
```

---

## Frontend Variables

Example:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=InsightFlow
VITE_ENVIRONMENT=development
```

---

## Environment Utility

Create:

```txt
src/lib/env/index.ts
```

Responsibilities:

- validate environment variables
- centralize environment access
- prevent direct `import.meta.env` usage across app

---

## Example Utility

```ts
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
};
```

---

# Backend Environment Coordination

## Backend CORS Alignment

Backend must allow:

```txt
http://localhost:5173
```

---

## Shared API Namespace

Both frontend and backend must use:

```txt
/api/v1/
```

---

# 5. API Endpoint Management

## Objective

Centralize API route definitions.

---

## Create Endpoint Registry

File:

```txt
src/lib/api/endpoints.ts
```

---

## Example Structure

```ts
export const API_ENDPOINTS = {
  health: "/health/",
  auth: {
    login: "/auth/login/",
    register: "/auth/register/",
  },
};
```

---

## Benefits

- prevents hardcoded URLs
- easier API version migration
- improves maintainability

---

# 6. React Query Integration

## Objective

Provide scalable server-state management.

---

## Query Client Setup

Create:

```txt
src/app/providers/query-provider.tsx
```

Responsibilities:

- initialize QueryClient
- provide global caching
- configure retries
- manage stale times

---

## Base Query Configuration

Example:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## Provider Integration

Wrap root application:

```tsx
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

# 7. Base API Utilities

## Objective

Provide reusable API helper functions.

---

## Create Generic Request Utilities

File:

```txt
src/lib/api/utils.ts
```

---

## Utility Responsibilities

Should handle:

- GET requests
- POST requests
- PATCH requests
- DELETE requests
- response extraction
- error normalization

---

## Example Utility

```ts
export async function getRequest<T>(url: string) {
  const response = await apiClient.get<T>(url);
  return response.data;
}
```

---

# 8. API Service Layer

## Objective

Separate API logic from UI components.

---

## Service Structure

Each domain should have isolated services.

Example:

```txt
/services/auth
/services/surveys
/services/analytics
```

---

## Example Health Service

```ts
import { apiClient } from "@/lib/api/client";

export const getHealthStatus = async () => {
  const response = await apiClient.get("/health/");
  return response.data;
};
```

---

## Service Layer Responsibilities

Services should:

- call endpoints
- transform API data
- normalize responses
- isolate backend dependencies

---

# 9. Frontend API Hooks

## Objective

Encapsulate API calls into reusable hooks.

---

## Hook Structure

Create:

```txt
/hooks/api
/hooks/queries
```

---

## Example Query Hook

```ts
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealthStatus,
  });
};
```

---

## Benefits

- reusable frontend logic
- automatic loading states
- cleaner components
- cache sharing

---

# 10. Backend Health Endpoint Integration

## Objective

Verify frontend-backend connectivity.

---

## Backend Endpoint

```txt
GET /api/v1/health/
```

---

## Frontend Integration

The frontend dashboard should:

- fetch health status
- display API connection success
- handle loading/error states

---

## Example Success UI

```txt
Backend Connected Successfully
```

---

## Example Error UI

```txt
Unable to connect to API
```

---

# 11. Error Handling Strategy

## Objective

Centralize frontend API error handling.

---

## Interceptor Setup

Create:

```txt
src/lib/api/interceptors.ts
```

---

## Responsibilities

Should handle:

- 401 unauthorized
- 403 forbidden
- 500 server errors
- network failures
- request logging

---

## Example Error Shape

Normalized frontend error:

```ts
{
  message: string;
  status?: number;
}
```

---

# 12. Future Authentication Readiness

## Objective

Prepare API layer for JWT authentication.

---

## Token Injection Strategy

Axios interceptors should later support:

```txt
Authorization: Bearer <token>
```

---

## Storage Strategy

Future authentication tokens may use:

- HTTP-only cookies (preferred)
- secure storage fallback

---

## Refresh Token Readiness

Architecture should support:

- automatic token refresh
- silent session renewal
- expired session handling

---

# 13. Type Safety Foundation

## Objective

Ensure API responses are typed.

---

## Shared API Types

Create:

```txt
src/lib/api/types.ts
```

---

## Example API Response Type

```ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

---

## Benefits

- safer frontend logic
- autocomplete support
- compile-time validation

---

# 14. Development Workflow Standards

## Frontend API Rules

Components should NEVER:

- directly use axios
- hardcode URLs
- manage raw request state repeatedly

Instead, use:

- services
- query hooks
- shared utilities

---

## Backend API Rules

Backend APIs should:

- return JSON only
- use consistent response shapes
- support versioned endpoints
- provide meaningful HTTP status codes

---

# Dependencies

# Frontend Dependencies

## Core Integration Packages

```bash
npm install axios
npm install @tanstack/react-query
```

---

## Optional Recommended Packages

```bash
npm install zod
npm install react-hot-toast
```

---

# Backend Dependencies

No additional required dependencies beyond Unit 2.

Optional future additions:

```bash
pip install djangorestframework-simplejwt
```

---

# Verification Checklist

# Frontend API Setup

- [ ] Axios installed successfully
- [ ] Centralized API client configured
- [ ] API base URL loads from environment variables
- [ ] Request timeout configured correctly

---

# Environment Handling

- [ ] Frontend environment variables load correctly
- [ ] Backend environment variables load correctly
- [ ] API URL configurable per environment
- [ ] Development and production configs separated

---

# React Query

- [ ] QueryClient configured successfully
- [ ] Query provider wraps application
- [ ] API requests cache correctly
- [ ] Query retries work correctly

---

# API Communication

- [ ] Frontend successfully calls backend APIs
- [ ] Health endpoint accessible from frontend
- [ ] JSON responses parsed correctly
- [ ] Loading states handled properly
- [ ] Error states handled properly

---

# API Architecture

- [ ] Endpoint registry implemented
- [ ] API utilities reusable
- [ ] Services isolated by domain
- [ ] Components do not directly call axios

---

# Error Handling

- [ ] API errors normalized
- [ ] Network failures handled gracefully
- [ ] Backend validation errors display correctly
- [ ] Interceptors work correctly

---

# Type Safety

- [ ] Shared API types implemented
- [ ] API responses typed correctly
- [ ] TypeScript detects invalid API usage

---

# Frontend ↔ Backend Connectivity

- [ ] Django backend reachable from frontend
- [ ] CORS configuration works correctly
- [ ] Requests succeed without browser blocking
- [ ] API namespace consistency maintained

---

# Developer Experience

- [ ] API utilities easy to extend
- [ ] Environment variables centralized
- [ ] Query hooks reusable across features
- [ ] Architecture scalable for future modules

---

# Visible Result

By the end of Unit 3:

- the React frontend communicates successfully with the Django backend
- API requests work through a centralized communication layer
- environment variables are shared and managed correctly
- reusable API utilities exist
- frontend connectivity status can be verified visually
- scalable frontend-backend integration architecture is established
- InsightFlow is ready for authentication flows, survey APIs, analytics APIs, and AI-powered backend services