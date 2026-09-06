# Watchlistr web

Watchlistr is a Nuxt 4 web app for discovering movies, shows, and books and saving them to a personal library.

## Stack

- Nuxt 4
- Nuxt UI 4
- Convex
- Auth0
- TMDB and Google Books search

## Shared Convex backend

This repository owns the shared Watchlistr Convex backend in `convex/`. The website and Chrome extension are separate clients that connect directly to the same Convex deployment.

```text
Watchlistr website          ─────► shared Convex deployment
Watchlistr Chrome extension ─────► shared Convex deployment
```

The extension does not call a Nuxt API route for library synchronization, and website availability does not affect extension-to-Convex sync.

All shared schema, Auth0 provider, library, admin, and Discover function changes must be made and validated in this repository. Do not deploy a second backend from the extension project.

Website hosting and Convex deployment are separate operations. Building or deploying the Nuxt app does not publish Convex functions automatically.

## Local setup

1. Run `npm ci`.
2. Copy `.env.example` to `.env.local`.
3. Configure the web Auth0 SPA application and the shared Convex deployment.
4. Add the web app's local and production origins to the SPA application's allowed callback, logout, and web-origin settings.
5. Run `npm run dev`.

For local development, the web URL is normally `http://localhost:3000`. The Chrome extension uses its own Auth0 native application and its exact `https://<extension-id>.chromiumapp.org/auth` callback. Both applications must use the same Auth0 tenant so the same account receives the same Auth0 subject.

The Convex deployment's `AUTH0_CLIENT_ID` value accepts a comma-separated list containing the web SPA and extension native application IDs. `AUTH0_JWT_ISSUER_DOMAIN` identifies their shared tenant.

Convex code generation requires `CONVEX_DEPLOYMENT`. The generated files are intentionally checked in because the app and backend tests typecheck against them.

## Validation

Run before delivering a web or backend change:

```bash
npm run typecheck
npm run typecheck:convex
npm run lint
npm run test
```

`npm run test` runs the Node architecture tests and the Convex behavior tests migrated from the extension repository.

For a web release or build-related change, also run:

```bash
npm run build
```

## Convex deployment

Only deploy Convex from this repository, and only after confirming the intended deployment and receiving authorization for the external change.

```bash
npm run convex:codegen
npx convex dev
```

Use the production Convex deployment command only as part of an approved production release. A successful local test, website build, or Git push does not prove that Convex was deployed.

There is no Firebase or legacy content API in this app. Curated content comes from Convex, and provider search is limited to server-side provider routes.
