# React CMS Dashboard

A modern, responsive Content Management System dashboard for managing articles, built with React 19, TypeScript, and Tailwind CSS 4. Designed for scalability and long-term maintainability using Atomic Design principles.

## Table of Contents

- [Design & Architecture Decisions](#design--architecture-decisions)
- [Code Documentation](#code-documentation)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment Guide](#deployment-guide)
- [Testing](#testing)
- [Folder Structure](#folder-structure)

---

## Design & Architecture Decisions

### Framework Selection

- **React 19** was chosen for its mature ecosystem, large community support, and component-based architecture that aligns well with the atomic design methodology. React's Context API provides sufficient state management for this scope without the overhead of external libraries like Redux.
- **TypeScript** is used with strict mode enabled (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`) to catch errors at compile time and improve code readability for the maintenance team.
- **Vite** serves as the build tool for its fast HMR (Hot Module Replacement) during development and optimized production builds.
- **Tailwind CSS 4** was selected for rapid UI development with utility-first classes and consistent design tokens defined as CSS custom properties, ensuring pixel-level adherence to the Figma mockups.

### Atomic Design Methodology

Components are organized following the atomic design pattern to ensure reusability and maintainability:

| Layer         | Purpose                              | Examples                                      |
|---------------|--------------------------------------|-----------------------------------------------|
| **Atoms**     | Smallest UI primitives               | Button, Input, Label, Switch, Textarea        |
| **Molecules** | Composed atoms with a single purpose | SearchBar, FormField, FilterDropdown, Pagination, TableRowActionMenu |
| **Organisms** | Complex, self-contained sections     | Sidebar, Drawer, ArticleDrawer, ArticleTable  |
| **Templates** | Page-level layout structures         | DashboardLayout                               |
| **Pages**     | Concrete instances of templates      | Dashboard                                     |

This approach ensures that any developer can quickly locate, understand, and modify components at the appropriate level of abstraction.

### State Management

- **React Context API** (`ArticleContext`) provides global access to the articles array and CRUD operations, avoiding prop-drilling across the component tree.
- **Custom `useLocalStorage` hook** persists article data to `localStorage` under the key `cms_articles`, so data survives page reloads without requiring a backend or database.
- **Local component state** in the Dashboard page manages UI concerns: search query, filter status, pagination, and drawer visibility.

### Data Storage

Data is stored in-memory via React state and persisted to `localStorage` as JSON. On first load, mock data is seeded automatically. There is no backend or database connection required — this was a deliberate project requirement.

### UI Fidelity to Figma Mockups

- All screens from the approved Figma mockups have been fully developed.
- Design tokens (colors, fonts, spacing) are defined as CSS custom properties in `src/index.css` and exposed as Tailwind theme extensions for consistent usage across all components.
- Icons are sourced from **Lucide React**, matching the Figma assets.
- Font family, sizes, weights, margins, paddings, borders, and colors follow the mockup specifications.

### Error Handling & Validation

- **Empty field prevention**: The article form disables the Save/Update button until all required fields (headline, author, body, publication date) are filled.
- **Delete confirmation**: A browser confirmation dialog prevents accidental article deletion.
- **Context safety**: The `useArticles` hook throws a descriptive error if used outside of an `ArticleProvider`, catching misuse early during development.

---

## Code Documentation

### How the Application Works

1. **Entry Point** (`src/main.tsx`): Mounts the React app into the `#root` DOM element wrapped in `StrictMode` for development warnings.

2. **App Component** (`src/App.tsx`): Wraps the entire application with `ArticleProvider` so all child components can access the global article state.

3. **ArticleContext** (`src/context/ArticleContext.tsx`): Manages the articles array with CRUD operations (add, update, delete, togglePublish). Uses `useLocalStorage` to persist data automatically.

4. **Dashboard Page** (`src/pages/Dashboard.tsx`): The main page that orchestrates:
   - **Search**: Filters articles by headline in real-time.
   - **Filter dropdown**: Filters by publish status (All / Published / Unpublished).
   - **Pagination**: Displays articles in pages of 10 rows.
   - **Drawer**: Opens a side panel for creating, viewing, or editing articles.

5. **ArticleDrawer** (`src/components/organisms/ArticleDrawer.tsx`): A form inside the generic `Drawer` component that operates in three modes:
   - `create`: Empty form for new articles, generates a UUID on save.
   - `view`: Read-only display with disabled inputs (publish toggle remains interactive).
   - `edit`: Pre-populated form for updating existing articles.

### Key Dependencies

| Package              | Purpose                                                    |
|----------------------|------------------------------------------------------------|
| `react` / `react-dom`| Core UI library (v19)                                     |
| `tailwindcss`        | Utility-first CSS framework (v4)                          |
| `lucide-react`       | Icon library matching Figma assets                        |
| `clsx`               | Conditional class name joining                            |
| `tailwind-merge`     | Resolves conflicting Tailwind utility classes              |
| `class-variance-authority` | Variant-based component styling (available for future use) |

### Non-Obvious Logic

- **`cn()` utility** (`src/utils/utils.ts`): Combines `clsx` and `tailwind-merge` so that conflicting Tailwind classes are resolved automatically (e.g., `px-2 px-4` becomes `px-4`).
- **`stopPropagation`** in `ArticleTable`: The Switch toggle and action menu cells call `e.stopPropagation()` to prevent triggering the row's `onClick` (which opens view mode).
- **Drawer body scroll lock**: When the Drawer opens, `document.body.style.overflow` is set to `hidden` to prevent background scrolling, and restored on close.
- **`TableRowActionMenu` outside-click**: Uses a `mousedown` event listener with a ref to detect clicks outside the menu and close it automatically.

---

## Tech Stack

| Category           | Technology                        |
|--------------------|-----------------------------------|
| Framework          | React 19                          |
| Language           | TypeScript 5.9 (strict mode)      |
| Build Tool         | Vite 7                            |
| Styling            | Tailwind CSS 4                    |
| Icons              | Lucide React                      |
| State Management   | React Context API + Custom Hooks  |
| Linting            | ESLint 9 (flat config)            |
| Data Persistence   | localStorage (no backend)         |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:amelmeneses/SeniropDevTest.git
   cd SeniropDevTest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` by default.

4. Lint the codebase:
   ```bash
   npm run lint
   ```

---

## Deployment Guide

### Build for Production

1. Run the production build:
   ```bash
   npm run build
   ```
   This executes TypeScript compilation (`tsc -b`) followed by Vite's optimized bundling. The output is generated in the `dist/` folder.

2. Preview the production build locally:
   ```bash
   npm run preview
   ```

### Vercel (Live)

The application is already deployed on Vercel and available at:

**https://senirop-dev-test.vercel.app**

Every push to the main branch triggers an automatic redeployment.

### Deploy to Any Static Host

Since this is a client-side SPA with no backend, the `dist/` folder can be served by any static hosting provider (Netlify, GitHub Pages, AWS S3 + CloudFront, etc.):

1. Run `npm run build`.
2. Upload the contents of the `dist/` folder to your hosting provider.
3. Configure URL rewrites to serve `index.html` for all routes (SPA fallback).

---

## Testing

The project uses **Vitest** + **React Testing Library** + **jsdom** for testing.

### Running Tests

```bash
npm run test              # Watch mode
npm run test -- --run     # Single run
npm run test:coverage     # Coverage report
```

### Test Suite Summary

**4 test files — 21 tests — all passing**

| File | Description | Tests |
|------|-------------|-------|
| `utils.test.ts` | `cn()` merging, Tailwind conflicts, edge cases | 4 |
| `useLocalStorage.test.ts` | Initial values, persistence, function updates, parse errors | 5 |
| `ArticleContext.test.tsx` | Add/update/delete/togglePublish, provider guard | 5 |
| `ArticleDrawer.test.tsx` | Form validation, disabled save, edit pre-fill | 7 |

---

## Folder Structure

```
src/
├── components/
│   ├── atoms/          # Button, Input, Label, Switch, Textarea
│   ├── molecules/      # SearchBar, FormField, FilterDropdown, Pagination, TableRowActionMenu
│   ├── organisms/      # Sidebar, Drawer, ArticleDrawer, ArticleTable
│   └── templates/      # DashboardLayout
├── context/            # ArticleContext (global state provider)
├── hooks/              # useLocalStorage (persistence hook)
├── pages/              # Dashboard (main application view)
├── types/              # Article interface definition
└── utils/              # cn() class merging utility
```

---

Built for Senirop Dev Test.
