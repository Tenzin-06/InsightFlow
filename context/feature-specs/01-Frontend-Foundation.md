Read `AGENTS.md` and `context/ui-context.md` before starting.

## Goal

Establish the foundational frontend architecture for InsightFlow using React, Tailwind CSS, and shadcn/ui, including a scalable routing system, global theming, and reusable UI structure.  
The outcome of this unit is a production-ready frontend shell that supports future feature development across dashboards, surveys, analytics, authentication, and AI-driven interfaces.

---

# Design

## Visual Direction

The frontend should follow a modern SaaS dashboard aesthetic inspired by:

- clean spacing
- soft rounded corners
- subtle shadows
- minimal but professional UI
- dark/light theme support
- analytics-first layout structure

The design language should support:

- academic researchers
- students
- government users
- enterprise-like dashboard workflows

### Primary Design Principles

- Minimal clutter
- High readability
- Consistent spacing system
- Mobile responsiveness from the start
- Component-driven UI
- Accessible interaction states
- Fast navigation and layout stability

---

## Layout Structure

### Application Shell

The application shell should include:

- Global layout wrapper
- Sidebar navigation
- Top navigation/header
- Main content container
- Theme provider
- Toast/notification provider

### Initial Route Structure

The routing foundation should support future modular expansion.

Planned route groups:

| Route        | Purpose                |
| ------------ | ---------------------- |
| `/`          | Landing page           |
| `/login`     | Authentication page    |
| `/register`  | Signup page            |
| `/dashboard` | Main user dashboard    |
| `/surveys`   | Survey management      |
| `/analytics` | Analytics dashboard    |
| `/campaigns` | Distribution campaigns |
| `/settings`  | User settings          |

---

## Component Design Philosophy

Components should be:

- reusable
- feature-isolated
- composable
- accessible
- easy to extend

shadcn/ui components will act as the design system foundation.

---

# Implementation

# 1. Frontend Project Initialization

## Framework

Use:

- React
- Vite
- TypeScript

### Project Creation

```bash
npm create vite@latest frontend -- --template react-ts
```

### Why Vite

Chosen because:

- fast development server
- optimized build pipeline
- modern React support
- simpler configuration than CRA

---

# 2. Folder Structure

The frontend should follow a scalable feature-oriented structure.

## Base Structure

```txt
/frontend
├── public
├── src
│   ├── app
│   │   ├── providers
│   │   ├── router
│   │   └── layouts
│   │
│   ├── components
│   │   ├── ui
│   │   ├── common
│   │   └── layout
│   │
│   ├── features
│   │   ├── auth
│   │   ├── dashboard
│   │   ├── surveys
│   │   ├── analytics
│   │   └── campaigns
│   │
│   ├── hooks
│   ├── lib
│   │   ├── utils
│   │   ├── api
│   │   └── constants
│   │
│   ├── styles
│   ├── routes
│   ├── types
│   └── main.tsx
│
├── index.html
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

# 3. Tailwind CSS Integration

## Objective

Establish a utility-first styling system compatible with shadcn/ui.

## Setup Requirements

Install Tailwind CSS with:

- PostCSS
- Autoprefixer

### Configure

Files to configure:

- `tailwind.config.ts`
- `postcss.config.js`
- `src/index.css`

---

## Tailwind Content Paths

Must include:

```ts
content: ["./index.html", "./src/**/*.{ts,tsx}"];
```

---

## Global Styles

`src/index.css` should include:

- Tailwind base layers
- CSS variables
- typography defaults
- scrollbar styles
- body background setup

---

# 4. shadcn/ui Integration

## Objective

Introduce a reusable component system with accessible primitives.

## Initialization

Run:

```bash
npx shadcn@latest init
```

### Configuration

Recommended setup:

| Setting         | Value               |
| --------------- | ------------------- |
| Style           | Default             |
| Base Color      | Slate               |
| CSS Variables   | Yes                 |
| Tailwind Config | tailwind.config.ts  |
| Components Path | `src/components/ui` |
| Utilities Path  | `src/lib/utils.ts`  |

---

## Initial Components to Install

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add separator
npx shadcn@latest add toast
```

These components form the minimum viable design system.

---

# 5. Base Routing Structure

## Objective

Create scalable route management for future feature modules.

## Router Library

Use:

```txt
react-router-dom
```

---

## Router Structure

Create:

```txt
src/app/router/index.tsx
```

---

## Route Layouts

### Public Layout

Used for:

- landing page
- login
- register

### Dashboard Layout

Used for authenticated areas.

Includes:

- sidebar
- header
- content wrapper

---

## Initial Route Definitions

```tsx
/
 /login
 /register
 /dashboard
```

Each route should render placeholder pages.

---

# 7. Application Layout System

## Dashboard Shell

The dashboard layout should include:

### Sidebar

Contains:

- logo
- navigation links
- active route state
- collapsible support (future-ready)

### Header

Contains:

- theme toggle
- user avatar placeholder
- page title region

### Main Content Area

Responsive content container with:

- max-width controls
- padding system
- scroll support

---

# 8. Shared Utility Layer

## Utility Functions

Create:

```txt
src/lib/utils.ts
```

Should contain:

- `cn()` utility using:
  - clsx
  - tailwind-merge

Required for shadcn/ui compatibility.

---

# 9. TypeScript Standards

## tsconfig Requirements

Enable:

- strict mode
- path aliases
- module resolution for Vite

---

## Path Alias

Add:

```txt
@
```

Mapped to:

```txt
/src
```

Example:

```tsx
import { Button } from "@/components/ui/button";
```

---

# 10. Responsive Design Foundation

The frontend must support:

| Device  | Support |
| ------- | ------- |
| Mobile  | Yes     |
| Tablet  | Yes     |
| Desktop | Yes     |

---

## Breakpoint Strategy

Use Tailwind default breakpoints initially.

Important layouts must avoid:

- horizontal overflow
- fixed-width containers
- non-responsive spacing

---

# 11. Developer Experience Setup

## Recommended Tooling

### ESLint

For:

- code quality
- React hooks rules
- TypeScript consistency

### Prettier

For formatting consistency.

### Optional

- Husky
- lint-staged

Can be added later.

---

# Dependencies

## Core Dependencies

```bash
npm install react-router-dom
npm install next-themes
npm install clsx
npm install tailwind-merge
npm install lucide-react
```

---

## Tailwind Dependencies

```bash
npm install -D tailwindcss postcss autoprefixer
```

---

## shadcn/ui Dependencies

Installed automatically during initialization, but expected libraries include:

```bash
npm install class-variance-authority
npm install tailwindcss-animate
```

---

## Optional Recommended Dependencies

```bash
npm install sonner
npm install react-hook-form
npm install zod
```

These are not required immediately but align with future architecture.

---

# Verification Checklist

# Project Setup

- [ ] React + Vite + TypeScript project initializes successfully
- [ ] Development server runs without errors
- [ ] TypeScript strict mode enabled

---

# Tailwind CSS

- [ ] Tailwind styles compile correctly
- [ ] Utility classes work in components
- [ ] Global CSS variables load properly

---

# shadcn/ui

- [ ] shadcn initialized successfully
- [ ] UI components render correctly
- [ ] Button/Card/Input components functional
- [ ] `cn()` utility works correctly

---

# Routing

- [ ] React Router configured correctly
- [ ] Public routes render
- [ ] Dashboard route renders
- [ ] Route navigation works without reloads

---

# Layout System

- [ ] Sidebar renders correctly
- [ ] Header renders correctly
- [ ] Layout responsive on mobile/tablet/desktop
- [ ] Main content area scrolls correctly

---

# Developer Experience

- [ ] ESLint passes
- [ ] No TypeScript errors
- [ ] Imports using `@/` alias work
- [ ] Project builds successfully

---

# Visible Result

By the end of Unit 1:

- the frontend application runs locally
- the global layout system exists
- the design system is initialized
- routing structure is functional
- reusable UI foundations are ready for future modules
- InsightFlow has a scalable frontend architecture ready for feature implementation
