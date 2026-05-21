## Goal

Integrate Clerk authentication into InsightFlow to provide secure user authentication, session management, protected frontend routes, and backend user association between Clerk identities and Django resources.  
The outcome of this unit is a fully functional authentication system where users can sign up, log in, maintain sessions, and securely access authenticated platform features.

---

# Design

## Authentication Architecture Philosophy

The authentication system should prioritize:

- security
- scalability
- developer productivity
- modern session handling
- seamless frontend-backend integration
- low authentication maintenance overhead

Clerk is selected to avoid building and maintaining custom authentication infrastructure while enabling enterprise-ready identity management.

---

## Authentication System Architecture

### Authentication Flow

```txt
User
  ↓
Frontend Authentication UI
  ↓
Clerk Authentication Service
  ↓
Authenticated Session Token
  ↓
Frontend Protected Routes
  ↓
Backend API Authorization
  ↓
Django User Association
```

---

## Authentication Responsibilities

| Layer | Responsibility |
|---|---|
| Clerk | Authentication provider |
| React Frontend | Session-aware UI & protected routing |
| Django Backend | User association & API authorization |
| Database | Internal user metadata storage |

---

## Authentication Strategy

Use:

```txt
Clerk Hosted Authentication + Clerk React SDK
```

This provides:

- secure session management
- OAuth support readiness
- multi-device session support
- secure token handling
- production-grade authentication flows

---

## Session Management Philosophy

The application should support:

- persistent login sessions
- automatic session restoration
- secure logout handling
- route protection
- auth-aware navigation
- future RBAC support

---

## User Identity Design

The system should maintain:

### Clerk User Identity

Managed by Clerk.

Contains:

- email
- password
- external auth providers
- session data

---

### Internal Application User

Managed by Django.

Contains:

- application metadata
- survey ownership
- analytics history
- user preferences
- future billing metadata

---

## Protected Route Philosophy

Protected pages should only be accessible when authenticated.

Examples:

| Route | Protection |
|---|---|
| `/dashboard` | Protected |
| `/surveys` | Protected |
| `/analytics` | Protected |
| `/campaigns` | Protected |
| `/settings` | Protected |

Public routes:

| Route | Access |
|---|---|
| `/` | Public |
| `/login` | Public |
| `/register` | Public |

---

# Implementation

# 1. Clerk Project Setup

## Objective

Initialize Clerk authentication infrastructure.

---

## Clerk Dashboard Setup

Create:

- Clerk account
- InsightFlow Clerk application

---

## Enable Authentication Methods

Initially enable:

- Email/password authentication

Future-ready support:

- Google OAuth
- GitHub OAuth
- Microsoft OAuth

---

## Configure Allowed Domains

Development:

```txt
http://localhost:5173
```

Production:

```txt
https://your-frontend.vercel.app
```

---

# 2. Frontend Clerk Integration

## Objective

Integrate Clerk into the React frontend.

---

## Install Clerk SDK

```bash
npm install @clerk/clerk-react
```

---

## Clerk Provider Setup

Wrap application root with:

```tsx
<ClerkProvider>
```

---

## File

```txt
src/main.tsx
```

---

## Example Structure

```tsx
<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
</ClerkProvider>
```

---

# 3. Frontend Environment Variables

## Objective

Securely manage Clerk frontend credentials.

---

## Required Frontend Variables

```env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_BASE_URL=
```

---

## Environment Utility Integration

Add Clerk variables into:

```txt
src/lib/env/index.ts
```

---

## Example

```ts
export const ENV = {
  CLERK_PUBLISHABLE_KEY:
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
};
```

---

# 4. Authentication UI Integration

## Objective

Connect Unit 5 authentication UI with Clerk.

---

## Replace Mock Logic

Authentication forms should now:

- create real accounts
- authenticate users
- manage real sessions
- handle Clerk errors

---

## Login Integration

Use Clerk hooks:

```txt
useSignIn()
```

---

## Signup Integration

Use Clerk hooks:

```txt
useSignUp()
```

---

## Authentication State Hook

Use:

```txt
useAuth()
```

for session state management.

---

# 5. Session Management

## Objective

Provide persistent authenticated user sessions.

---

## Session Features

The system should support:

- automatic session restoration
- secure logout
- session persistence on refresh
- auth-aware rendering

---

## Logout Integration

Use:

```txt
signOut()
```

---

## Session State Sources

Use Clerk session hooks instead of local storage authentication.

---

# 6. Session-Aware Navigation Integration

## Objective

Connect navigation state to real authentication sessions.

---

## Guest Navigation

When unauthenticated:

```txt
Login
Signup
```

---

## Authenticated Navigation

When authenticated:

```txt
Dashboard
Avatar Menu
Logout
```

---

## Clerk Components

Recommended:

```txt
<UserButton />
```

for account management.

---

## Navigation Logic

Use:

```txt
SignedIn
SignedOut
```

components for conditional rendering.

---

# 7. Protected Route System

## Objective

Restrict access to authenticated routes.

---

## Create Route Guard

File:

```txt
src/routes/protected-route.tsx
```

---

## Responsibilities

The route guard should:

- verify session existence
- redirect unauthenticated users
- prevent unauthorized dashboard access

---

## Example Behavior

### Authenticated User

```txt
/dashboard → allowed
```

---

### Guest User

```txt
/dashboard → redirect to /login
```

---

## Recommended Clerk Helpers

Use:

```txt
<Protect />
```

or custom wrappers.

---

# 8. Protected Dashboard Layout

## Objective

Ensure dashboard sections require authentication.

---

## Layout Protection

Wrap dashboard layout with:

```txt
ProtectedRoute
```

---

## Protected Areas

All authenticated pages should require valid session state.

---

# 9. Backend Clerk Integration

## Objective

Allow Django backend to identify authenticated users.

---

## Authentication Strategy

Frontend sends Clerk JWT token to backend.

---

## Request Flow

```txt
Frontend Request
  ↓
Authorization Header
  ↓
Bearer Clerk JWT
  ↓
Django Verification
```

---

## Example Header

```http
Authorization: Bearer <token>
```

---

# 10. Frontend API Token Injection

## Objective

Automatically attach Clerk tokens to API requests.

---

## Axios Interceptor Integration

Update:

```txt
src/lib/api/interceptors.ts
```

---

## Responsibilities

Interceptors should:

- retrieve Clerk token
- attach authorization header
- handle expired sessions

---

## Example Header Injection

```ts
headers.Authorization = `Bearer ${token}`;
```

---

# 11. Backend JWT Verification

## Objective

Validate Clerk authentication tokens in Django.

---

## Recommended Backend Library

Use:

```txt
clerk-backend-api
```

or JWT verification middleware.

---

## Backend Verification Flow

```txt
Incoming Request
  ↓
Extract JWT
  ↓
Verify Clerk Signature
  ↓
Extract User Identity
  ↓
Attach User Context
```

---

# 12. Backend User Association

## Objective

Associate Clerk users with internal Django users.

---

## User Model Strategy

Django should maintain internal user records linked to Clerk IDs.

---

## Example Fields

```python
clerk_user_id
email
full_name
created_at
```

---

## Association Flow

### First Authenticated Request

If user does not exist:

```txt
Create Internal User Record
```

---

### Existing User

```txt
Load Existing User
```

---

# 13. Backend Authentication Middleware

## Objective

Attach authenticated user context to backend requests.

---

## Middleware Responsibilities

Should:

- verify JWT
- extract Clerk user ID
- load internal user
- attach request user context

---

## Example

```python
request.user
request.clerk_user
```

---

# 14. API Authorization Foundation

## Objective

Prepare backend APIs for authenticated access.

---

## API Security Philosophy

Public APIs:

- health checks
- landing content

Protected APIs:

- surveys
- analytics
- campaigns
- user data

---

## DRF Permission Strategy

Recommended:

```python
IsAuthenticated
```

for protected endpoints.

---

# 15. Authentication Error Handling

## Objective

Provide resilient auth UX.

---

## Frontend Error Handling

Should handle:

- invalid credentials
- weak passwords
- expired sessions
- unauthorized access
- network failures

---

## Backend Error Handling

Should return:

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized"
  }
}
```

---

# 16. Authentication Loading States

## Objective

Prevent UI flickering during auth resolution.

---

## Session Loading Strategy

During session initialization:

- show loading screen
- avoid flashing protected content

---

## Recommended UX

Use:

```txt
Full-page auth loading state
```

before rendering protected routes.

---

# 17. Future Authentication Readiness

## Objective

Prepare authentication system for future expansion.

---

## Future Features

Architecture should support:

- OAuth providers
- MFA
- RBAC
- organization/team accounts
- admin dashboards
- invitation systems
- session analytics
- audit logs

---

# 18. Security Standards

## Objective

Ensure secure authentication implementation.

---

## Security Requirements

### Frontend

- never store tokens manually
- use Clerk-managed sessions
- avoid exposing secret keys

---

### Backend

- always verify JWTs
- never trust frontend user IDs
- secure protected endpoints

---

## Secret Management

Never expose:

```env
CLERK_SECRET_KEY
```

to frontend code.

---

# Dependencies

# Frontend Dependencies

```bash
npm install @clerk/clerk-react
```

---

# Backend Dependencies

Recommended:

```bash
pip install pyjwt
pip install cryptography
```

Optional Clerk backend integration libraries may be added depending on verification strategy.

---

# Existing Dependencies Used

From previous units:

```txt
axios
react-query
react-router-dom
react-hook-form
zod
```

---

# Verification Checklist

# Clerk Integration

- [ ] Clerk project created successfully
- [ ] Clerk frontend SDK installed
- [ ] ClerkProvider configured correctly
- [ ] Clerk environment variables load correctly

---

# Authentication UI Integration

- [ ] Login form authenticates successfully
- [ ] Signup form creates accounts successfully
- [ ] Clerk validation errors display correctly
- [ ] Authentication loading states work correctly

---

# Session Management

- [ ] Sessions persist after refresh
- [ ] Logout works correctly
- [ ] Session restoration works correctly
- [ ] Auth-aware navigation updates correctly

---

# Protected Routes

- [ ] Protected routes block unauthenticated users
- [ ] Guests redirected to login page
- [ ] Authenticated users access dashboard successfully
- [ ] Route guard logic works correctly

---

# Navigation States

- [ ] Guest navigation renders correctly
- [ ] Authenticated navigation renders correctly
- [ ] User avatar component works
- [ ] Logout action accessible

---

# Frontend ↔ Backend Authentication

- [ ] Clerk JWT attached to API requests
- [ ] Authorization headers injected correctly
- [ ] Backend receives valid tokens
- [ ] Unauthorized requests rejected properly

---

# Backend User Association

- [ ] Clerk user IDs stored correctly
- [ ] Internal Django user records created
- [ ] Existing users load correctly
- [ ] Request user context available in APIs

---

# API Security

- [ ] Protected endpoints require authentication
- [ ] Public endpoints remain accessible
- [ ] JWT verification works correctly
- [ ] Invalid tokens rejected correctly

---

# Error Handling

- [ ] Invalid credentials handled gracefully
- [ ] Expired sessions handled correctly
- [ ] Unauthorized API responses handled properly
- [ ] Loading states prevent UI flickering

---

# Security

- [ ] Clerk secret keys never exposed
- [ ] Tokens not stored insecurely
- [ ] Backend verifies all JWTs
- [ ] Sensitive routes protected correctly

---

# Visible Result

By the end of Unit 6:

- users can sign up and log in successfully
- Clerk authentication is fully integrated
- authenticated sessions persist correctly
- protected routes restrict unauthorized access
- frontend navigation reflects authentication state
- backend APIs recognize authenticated users
- Clerk users are associated with internal Django user records
- InsightFlow has a secure, scalable, production-ready authentication system