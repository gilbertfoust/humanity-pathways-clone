# Humanity Pathways Global

This repository contains the Humanity Pathways Global marketing site built with Vite, React, and TypeScript, now prepared for production deployment on GitHub Pages.

## What was added for production readiness

- GitHub Pages deployment workflow using GitHub Actions
- Dynamic Vite base-path handling for repo sites and user/org sites
- BrowserRouter-compatible SPA fallback for direct route loads and refreshes on Pages
- npm-only package manager standardization
- Generated Pages support files (`404.html` and `.nojekyll`) during production builds
- Deployment and maintenance documentation for future updates

## Stack

- React 18
- TypeScript
- Vite 8
- React Router 6
- Tailwind CSS
- Vitest

## Package manager

This repo is standardized on **npm**.

```bash
npm ci
```

## Local development

```bash
npm run dev
```

The local dev server uses the root base path `/`, so routes behave normally at `http://localhost:8080/`.

## Build for production

```bash
npm run build
```

The production build:

1. Generates GitHub Pages support files in `public/`
2. Applies the correct Vite base path
3. Writes the final static site to `dist/`

## How Pages base paths are resolved

Production builds use the following priority:

1. `VITE_BASE_PATH` if explicitly provided
2. `GITHUB_REPOSITORY` if running in GitHub Actions
3. `/` as the safe local fallback

For GitHub Actions, you can optionally define a repository or organization variable named `PAGES_BASE_PATH` to override the workflow default without editing code.

Examples:

```bash
VITE_BASE_PATH=/humanity-pathways-clone/ npm run build
VITE_BASE_PATH=/ npm run build
```

## GitHub Pages workflow

The workflow at `.github/workflows/deploy-pages.yml`:

1. Runs on pushes to `main`
2. Installs dependencies with `npm ci`
3. Detects whether the repo is a user/org Pages site or a project Pages site
4. Builds the app
5. Uploads `dist/`
6. Deploys to GitHub Pages

## BrowserRouter support on GitHub Pages

GitHub Pages does not natively rewrite arbitrary routes to `index.html`. To keep clean URLs with `BrowserRouter`, this repo uses the standard SPA fallback approach:

- `npm run build` generates `public/404.html` with the correct path-segment depth
- `index.html` restores the intended route before React hydrates
- `BrowserRouter` reads its `basename` from Vite's resolved `BASE_URL`

That allows direct visits and refreshes for nested routes on GitHub Pages without switching the app to hash-based URLs.

## Manual GitHub settings still required

After pushing to GitHub, configure the repository once:

1. Open **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Ensure the deployment branch is the branch that contains this workflow, typically `main`
4. If your organization restricts Actions or Pages deployments, allow the required permissions for this workflow
5. If you use a custom domain or need a nonstandard path, add a repository variable named `PAGES_BASE_PATH` (use `/` for a custom domain root)
6. If you use a custom domain, set it in **Settings → Pages**

## Maintenance notes

- If the repository name changes, the workflow will automatically adapt for standard repo-site deployments
- If you move to a custom domain or a user/org site, use `VITE_BASE_PATH=/`
- Keep route changes in sync with `src/App.tsx` and smoke-test direct route loads after deployment
