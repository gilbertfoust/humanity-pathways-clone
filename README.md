# Humanity Pathways Global

Production-ready Vite + React + TypeScript site for Humanity Pathways Global, prepared for deployment as a GitHub Pages **repository site** at `https://gilbertfoust.github.io/humanity-pathways-clone/`.

## Overview

This repository contains a multi-page marketing/informational website exported from Lovable and hardened for maintainable static hosting on GitHub Pages. The app includes organization pages, initiative landing pages, event information, sponsorship flows, and contact/volunteer routes.

## Tech stack

- React 18
- TypeScript
- Vite 8
- React Router 6
- Tailwind CSS
- shadcn/ui-style component primitives
- Vitest
- Playwright configuration scaffold

## Package manager

This repository is standardized on **npm**.

- Use `package-lock.json` for local development and CI.
- `bun.lock` was removed to avoid mixed lockfiles and inconsistent installs.

## Local development

### Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended

### Install dependencies

```bash
npm ci
```

### Start the development server

```bash
npm run dev
```

The Vite dev server runs with a root base path of `/`, so local routing behaves normally at `http://localhost:8080/`.

## Testing

Run the current automated test suite with:

```bash
npm run test
```

## Production build

Build the GitHub Pages-ready static site with:

```bash
npm run build
```

Vite outputs the production bundle to:

```text
dist/
```

## GitHub Pages deployment

A GitHub Actions workflow is included at `.github/workflows/deploy-pages.yml`.

### What the workflow does

On every push to `main`, it:

1. Checks out the repository
2. Installs dependencies with `npm ci`
3. Builds the app with `npm run build`
4. Uploads `dist/` as the Pages artifact
5. Deploys the artifact to GitHub Pages

### Required GitHub configuration

In the GitHub repository settings:

1. Open **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Ensure the default branch is `main`
4. Allow Actions permissions needed for Pages deployment if your org/repo policy restricts them

## Base path and environment variables

The Vite config uses a GitHub Pages-safe base path strategy:

- Development: `/`
- Production: `process.env.VITE_BASE_PATH ?? "/humanity-pathways-clone/"`

### Optional environment variable

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_BASE_PATH` | No | `/humanity-pathways-clone/` | Overrides the production base path used for asset URLs and router basename |

For example, to build the same site under a different repo-site path:

```bash
VITE_BASE_PATH=/my-other-repo/ npm run build
```

## Routing notes for GitHub Pages

This project keeps **`BrowserRouter`** so URLs remain clean.

Because GitHub Pages is a static host and does not natively rewrite arbitrary route requests back to `index.html`, the repository includes a Pages SPA fallback:

- `public/404.html` redirects direct route requests back into the SPA entry point
- `index.html` restores the original route before React boots
- `BrowserRouter` uses Vite's computed base URL as its `basename`

This avoids changing the app to hash-based URLs while still supporting direct loads and refreshes on nested routes for a GitHub Pages repo site.

## Project structure

```text
.github/workflows/      GitHub Actions deployment workflow
public/                 Static assets copied directly to the final build
src/                    React application source
vite.config.ts          Vite config, including Pages-aware base path handling
```

## Maintainer notes

- If the GitHub repository name changes, update the fallback default in `vite.config.ts` and the workflow's `VITE_BASE_PATH` value.
- If you migrate from a repo site to a custom domain or user/org Pages site, revisit the base path and SPA fallback assumptions.
- Keep route additions inside `src/App.tsx` aligned with the site's navigation and smoke-test them after deployment.
