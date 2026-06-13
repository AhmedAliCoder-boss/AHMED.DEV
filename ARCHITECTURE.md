# Project Architecture — AHMED.portfolio

This document outlines the production-ready architecture, folder structure, and development conventions for the premium personal portfolio project.

Goals
- Editorial, high-end UI/UX with strong motion and polish.
- Scalable, modular React app with clear separation of concerns.
- Supabase-backed CMS for blog and projects with secure RLS policies.
- PWA-ready and deployable to Vercel/Netlify.

High-level Layers
- Public UI (React + Vite + Tailwind) — pages and components
- Admin UI (React, route-protected) — management console for content
- API / Backend (Supabase) — auth, storage, Postgres
- Build & CI — Vite, PWA plugin, linting, tests

Folder Structure (canonical)

- src/
  - admin/                 # Admin pages & dashboard UI
  - assets/                # Static images, fonts, icons
  - components/           # Reusable UI components
    - layout/              # Header, Footer, Page shells
    - blog/                # Blog-specific components
    - projects/            # Project-specific components
    - ui/                  # Buttons, Inputs, Modals, Skeletons
  - contexts/              # `AuthContext`, `ThemeContext`, ...
  - hooks/                 # `useAuth`, `useBlogs`, `useProjects`, `useTheme`
  - lib/                   # 3rd-party clients (e.g. `supabaseClient.js`)
  - pages/                 # Page-level components (Home, About, Projects...)
  - services/              # Data access layer / supabase wrappers
  - styles/                # Tailwind config overrides, global styles
  - utils/                 # small pure helpers (formatting, seo, reading time)
  - routes/                # route definitions and protected-route helpers

Key Files
- src/lib/supabaseClient.js — single exported Supabase client using env vars
- src/contexts/AuthContext.jsx — auth state, login/logout, session persistence
- src/contexts/ThemeContext.jsx — theme toggle, localStorage persistence
- src/hooks/useBlogs.jsx — encapsulates blog queries + caching
- src/components/layout/Header.jsx — accessible navigation + theme toggle
- src/components/ui/ProtectedRoute.jsx — route guard using `useAuth`
- src/pages/admin/* — blog/project CRUD + live preview editor

Design & Patterns
- Presentational + container split for complex UIs.
- Centralized data layer in `services/` wrapping Supabase queries.
- Keep DB types and mappings in `services/types.js`.
- Favor small, composable components and Tailwind utility classes.
- Use Framer Motion for page transitions and component micro-interactions.
- Lazy-load heavy components (editor, charts) with React.lazy + Suspense.

Accessibility
- Semantic HTML and ARIA roles for interactive components.
- Focus management for dialogs and routing transitions.
- Keyboard-first UX for admin dashboard and forms.

Performance
- Image optimization via srcset and Next-gen formats in `assets/`.
- PWA caching strategies (network-first for API, cache-first for static assets).
- Memoization for expensive render steps and lists.
- Code-splitting: split admin/editor bundle from public site.

Testing & Quality
- Linting with ESLint + recommended rules
- Formatting with Prettier
- Unit tests for core hooks and services (Jest / Vitest)

Deployment
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (for server-side scripts only)
- CI: build artifacts and preview deploys for PRs; production deploy to Vercel/Netlify

Next Steps
1. Create SQL schema and RLS policies for `posts` and `projects`.
2. Implement `src/lib/supabaseClient.js` and `services/*` wrappers.
3. Scaffold pages and core contexts (`AuthContext`, `ThemeContext`).

Notes
- This repo already contains initial source files; new work should refactor and replace where necessary to meet the production-ready rules.
- Keep commits focused and atomic per phase.

---
Generated: Phase 1 — Architecture & Folder Structure
