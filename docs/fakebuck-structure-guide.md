# Project Structure Guideline (Fakebuck Conventions)

This document defines the folder structure and architectural design conventions for **PNProject**, modeled after `earth824/dnc02-fakebuck-web`. 

Adopt this structure going forward to maintain clean, modular, and consistent code throughout the application.

---

## 1. Directory Tree Overview

```text
src/
├── @types/          # Global TypeScript interfaces and custom declarations (.d.ts)
├── app/             # Next.js App Router (Layouts, Pages, APIs, Routing Groups)
│   ├── (auth)/      # Route Group for authentication (Login, Register, etc.)
│   ├── (main)/      # Route Group for the main application (Dashboard, Profile, etc.)
│   └── layout.tsx   # Root Layout (Theme injection, font variables, global wrappers)
├── assets/          # Static assets (images, svg vector icons, static logos)
├── components/      # React Components
│   ├── features/    # Page-specific features, grouped by business domain (e.g., dashboard, auth, friends)
│   ├── layout/      # Layout components shared across pages (Sidebar, Header, MainNavigation)
│   ├── shared/      # Shared complex elements (Custom inputs, DatePickers, ChartWrappers)
│   └── ui/          # Atomic, reusable UI primitives (Button, DropdownMenu, Dialog, Avatar)
├── lib/             # Application logic, helpers, and middleware config
│   ├── actions/     # Server Actions (Auth actions, data mutation triggers)
│   ├── services/    # Business services (Database access, external fetch functions)
│   └── utils.ts     # Global utilities (CN class merger, formatting helpers)
└── styles/          # Styling configurations (Globals CSS, custom fonts)
```

---

## 2. Key Structure Rules

### A. Layout vs. Feature Components
- **Layout components** (`src/components/layout/`) manage the skeletal structure of the page (like a header, footer, navigation bar, or sidebar). They must be generic and reuse-oriented across multiple routes.
- **Feature components** (`src/components/features/`) contain custom content and business logic for a specific domain. For instance, the metrics grid, activity log, or charts for the dashboard should live in `src/components/features/dashboard/`.

### B. Route Groups
- Route groups such as `(main)` and `(auth)` group routes logically without affecting the URL path.
- Pages in `(main)` automatically inherit the application shell (Sidebar + Top Headbar) via `src/app/(main)/layout.tsx`.
- Pages in `(auth)` have independent styling (e.g., grid login screens) via `src/app/(auth)/layout.tsx` (if defined).

### C. Low-Level UI Components
- Low-level elements (`src/components/ui/`) like `Button` or `DropdownMenu` must be stateless or simple, serving as the building blocks for more complex widgets.

### D. Separation of Concerns
- Try to isolate presentation components from API logic. Let page controllers (`page.tsx`) or server action structures handle fetching data, then pass that data as props to feature components.
