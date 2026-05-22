## Goal

Design and implement the primary authenticated application shell for InsightFlow, including sidebar navigation, responsive dashboard layouts, and scalable routing structures for all core platform modules.  
The outcome of this unit is a fully functional dashboard UI framework that serves as the foundation for all authenticated application experiences.

---

# Design

## Dashboard UX Philosophy

The dashboard should feel:

- modern
- professional
- analytics-focused
- spacious
- responsive
- productivity-oriented
- scalable for enterprise workflows

The design should prioritize usability and clarity over excessive visual complexity.

---

## Dashboard Architecture Philosophy

The dashboard shell should act as:

- the central authenticated application container
- the navigation hub for all modules
- the reusable layout wrapper for future features
- the consistent user experience layer across the platform

---

## Dashboard Layout Structure

### High-Level Structure

```txt
DashboardLayout
├── Sidebar Navigation
├── Top Header
├── Main Content Area
└── Mobile Navigation Layer
```

---

## Sidebar Navigation Design

The sidebar should provide:

- clear module organization
- persistent navigation
- active route visibility
- scalable expansion support
- responsive collapse behavior

---

## Primary Navigation Sections

### Core Modules

| Module | Route |
|---|---|
| Dashboard | `/dashboard` |
| Surveys | `/surveys` |
| Analytics | `/analytics` |
| Campaigns | `/campaigns` |
| Settings | `/settings` |

---

## Sidebar UX Principles

The sidebar should support:

- icon + label navigation
- active route highlighting
- hover interaction states
- smooth transitions
- collapsible mobile behavior
- future nested navigation support

---

## Top Header Design

The header should contain:

- page title
- breadcrumb placeholder
- search placeholder
- notification placeholder
- user profile controls
- theme toggle

---

## Responsive Design Philosophy

The dashboard must support:

| Device | Support |
|---|---|
| Mobile | Yes |
| Tablet | Yes |
| Desktop | Yes |

---

## Mobile Dashboard Behavior

On mobile:

- sidebar becomes drawer/sheet
- header includes menu toggle
- content becomes full-width
- navigation remains touch-friendly

---

## Desktop Dashboard Behavior

On desktop:

- persistent sidebar
- fixed navigation area
- large content workspace
- optimized analytics layout spacing

---

## Routing Philosophy

The routing system should support:

- scalable module expansion
- protected routes
- nested layouts
- lazy-loaded pages (future-ready)
- centralized route management

---

# Implementation

# 1. Dashboard Feature Structure

## Objective

Create isolated dashboard layout architecture.

---

## Recommended Structure

```txt
/src
├── components
│   ├── layout
│   │   ├── sidebar.tsx
│   │   ├── sidebar-item.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── mobile-sidebar.tsx
│   │   ├── page-container.tsx
│   │   └── user-nav.tsx
│
├── layouts
│   └── dashboard-layout.tsx
│
├── routes
│   ├── protected-route.tsx
│   └── route-config.ts
│
├── features
│   ├── dashboard
│   ├── surveys
│   ├── analytics
│   ├── campaigns
│   └── settings
```

---

# 2. Dashboard Layout Shell

## Objective

Create reusable authenticated dashboard layout.

---

## File

```txt
src/layouts/dashboard-layout.tsx
```

---

## Responsibilities

The layout should manage:

- sidebar rendering
- header rendering
- page spacing
- responsive behavior
- authenticated shell structure

---

## Layout Structure

```txt
DashboardLayout
├── Sidebar
├── Header
└── Main Content
```

---

## Content Area Rules

The main content area should:

- support scrolling
- maintain responsive padding
- support future analytics grids
- avoid layout overflow

---

# 3. Sidebar Navigation

## Objective

Create scalable primary navigation system.

---

## File

```txt
src/components/layout/sidebar.tsx
```

---

## Sidebar Sections

### Branding Area

Contains:

- InsightFlow logo
- application name

---

### Navigation Area

Contains navigation links.

---

### Footer Area

Contains:

- user controls
- settings shortcut
- logout action

---

## Navigation Item Structure

Each item should contain:

- icon
- label
- active state
- hover state

---

## Recommended Icons

Use:

```txt
lucide-react
```

---

## Suggested Icons

| Module | Icon |
|---|---|
| Dashboard | LayoutDashboard |
| Surveys | ClipboardList |
| Analytics | BarChart3 |
| Campaigns | Send |
| Settings | Settings |

---

# 4. Sidebar Active Route Handling

## Objective

Provide clear navigation state awareness.

---

## Active Route Logic

Current route should:

- highlight active item
- visually distinguish active section
- support nested route matching

---

## Example Active States

### Active Item

```txt
Highlighted background + accent border
```

---

### Inactive Item

```txt
Muted hover state
```

---

# 5. Mobile Sidebar System

## Objective

Provide responsive navigation on smaller devices.

---

## Mobile Navigation Strategy

On mobile:

- sidebar hidden by default
- opens via menu button
- overlays content
- closes on route change

---

## Recommended Component

Use:

```txt
shadcn/ui Sheet
```

---

## File

```txt
src/components/layout/mobile-sidebar.tsx
```

---

# 6. Dashboard Header

## Objective

Create reusable dashboard top navigation bar.

---

## File

```txt
src/components/layout/dashboard-header.tsx
```

---

## Header Responsibilities

Should contain:

- mobile menu toggle
- page title
- search placeholder
- notification placeholder
- theme toggle
- user navigation

---

## Desktop Layout

```txt
[ Page Title ]          [ Search ] [ Theme ] [ User ]
```

---

## Mobile Layout

```txt
[ Menu ] [ Title ] [ User ]
```

---

# 7. User Navigation Component

## Objective

Provide authenticated user controls.

---

## File

```txt
src/components/layout/user-nav.tsx
```

---

## Features

Should include:

- user avatar
- account dropdown
- logout action
- settings shortcut

---

## Recommended Clerk Component

Use:

```txt
<UserButton />
```

where appropriate.

---

# 8. Navigation Routing Structure

## Objective

Create scalable dashboard route architecture.

---

## Protected Dashboard Routes

```txt
/dashboard
/surveys
/analytics
/campaigns
/settings
```

---

## Route Configuration File

Create:

```txt
src/routes/route-config.ts
```

---

## Route Metadata Example

```ts
{
  label: "Dashboard",
  path: "/dashboard",
  icon: LayoutDashboard,
}
```

---

## Benefits

- centralized route management
- reusable navigation generation
- scalable future route additions

---

# 9. Dashboard Page Containers

## Objective

Standardize page layout spacing and structure.

---

## File

```txt
src/components/layout/page-container.tsx
```

---

## Responsibilities

Should manage:

- responsive width
- consistent spacing
- content alignment
- page-level layout consistency

---

## Recommended Layout Rules

### Max Width

```txt
max-w-7xl
```

---

### Padding

Responsive padding using Tailwind utilities.

---

# 10. Placeholder Dashboard Pages

## Objective

Establish navigable application structure.

---

## Required Pages

Create placeholder pages for:

```txt
/dashboard
/surveys
/analytics
/campaigns
/settings
```

---

## Placeholder Content

Each page should contain:

- page title
- module description
- future content placeholder

---

# 11. Responsive Layout Standards

## Objective

Ensure production-quality responsive dashboard behavior.

---

## Mobile Requirements

### Sidebar

- collapsible
- overlay-based

---

### Content

- full-width
- reduced spacing
- touch-friendly UI

---

## Desktop Requirements

### Sidebar Width

Recommended:

```txt
240px–280px
```

---

### Content Layout

Should support:

- large data tables
- analytics cards
- future charts
- multi-column layouts

---

# 12. Theme Integration

## Objective

Ensure dashboard fully supports global theme system.

---

## Theme Areas

The following should support theme variables:

- sidebar background
- header background
- content surfaces
- borders
- active navigation
- hover states

---

## Dark Mode Support

Dark mode should maintain:

- readable contrast
- muted backgrounds
- clear active indicators

---

# 13. Navigation Accessibility

## Objective

Ensure accessible dashboard navigation.

---

## Accessibility Requirements

Navigation should support:

- keyboard navigation
- focus visibility
- semantic navigation structure
- screen reader labels

---

## Required Semantic Structure

Use:

```html
<nav>
<aside>
<header>
<main>
```

appropriately.

---

# 14. Animation & Interaction Design

## Objective

Provide polished navigation experience.

---

## Recommended Animations

### Sidebar

- smooth open/close transitions
- hover animations
- active state transitions

---

### Mobile Drawer

- slide animation
- backdrop fade

---

### Navigation Items

- subtle hover transitions
- active state animations

---

## Animation Philosophy

Animations should be:

- subtle
- performant
- non-distracting

---

# 15. Future Scalability Preparation

## Objective

Prepare dashboard architecture for future feature expansion.

---

## Future Features Supported

Architecture should support:

- nested routes
- role-based navigation
- organization switching
- analytics widgets
- dynamic permissions
- workspace layouts
- plugin modules

---

## Future Sidebar Enhancements

Potential future additions:

- collapsible groups
- favorites
- recent activity
- workspace switcher

---

# 16. Developer Experience Standards

## Objective

Maintain scalable frontend architecture.

---

## Rules

Dashboard components should:

- remain reusable
- avoid duplicated layout logic
- isolate navigation configuration
- use shared UI primitives

---

## Styling Rules

Prefer:

- Tailwind utilities
- shadcn/ui components

Avoid:

- duplicated layout styles
- inline CSS
- hardcoded spacing

---

# Dependencies

# Existing Dependencies Used

From previous units:

```txt
react-router-dom
@clerk/clerk-react
lucide-react
tailwindcss
shadcn/ui
next-themes
```

---

# Recommended shadcn/ui Components

```bash
npx shadcn@latest add sheet
npx shadcn@latest add dropdown-menu
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
npx shadcn@latest add tooltip
```

---

# Optional Recommended Dependencies

```bash
npm install clsx
npm install tailwind-merge
```

if not already installed.

---

# Verification Checklist

# Dashboard Layout

- [ ] Dashboard layout renders correctly
- [ ] Sidebar displays correctly
- [ ] Header displays correctly
- [ ] Main content area scrolls correctly

---

# Sidebar Navigation

- [ ] Navigation items render correctly
- [ ] Active route highlighting works
- [ ] Icons display correctly
- [ ] Navigation links route correctly

---

# Mobile Responsiveness

- [ ] Mobile sidebar opens correctly
- [ ] Mobile drawer closes correctly
- [ ] Layout responsive on tablet/mobile
- [ ] No horizontal overflow issues

---

# Routing Structure

- [ ] Protected routes accessible when authenticated
- [ ] Guests redirected appropriately
- [ ] Route configuration centralized
- [ ] Placeholder pages accessible

---

# User Navigation

- [ ] User avatar renders correctly
- [ ] Dropdown menu works
- [ ] Logout action works
- [ ] Settings shortcut accessible

---

# Theme Compatibility

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Sidebar adapts to theme changes
- [ ] Header adapts to theme changes

---

# Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Semantic navigation structure implemented
- [ ] Screen reader labels present

---

# Developer Experience

- [ ] Navigation configuration reusable
- [ ] Layout components isolated correctly
- [ ] Shared page container works
- [ ] Architecture scalable for future modules

---

# Visible Result

By the end of Unit 7:

- the main authenticated dashboard UI exists
- responsive sidebar navigation is implemented
- protected dashboard routing works
- mobile and desktop dashboard layouts function correctly
- scalable navigation architecture is established
- authenticated users can navigate between platform modules
- InsightFlow has a production-ready application shell for future survey, analytics, and campaign features