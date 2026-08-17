# Watchlistr Agent Instructions

## Project Overview

Watchlistr is a Nuxt 4 web application for discovering movies, TV shows, and books and saving them to a personal library. The web app shares its Convex backend contract with the Watchlistr browser extension. Auth0 subjects are the account identity across both clients.

The current application uses Convex and Auth0. Do not reintroduce Firebase or the removed legacy content APIs.

## Repository Layout

- `app/`: Nuxt application source, including pages, components, layouts, composables, middleware, plugins, utilities, styles, and app types.
- `convex/`: Convex schema, validators, helpers, queries, and mutations. The `_generated/` files are checked in intentionally.
- `server/api/`: server-only provider and embed endpoints. Provider API keys must remain server-side.
- `shared/`: contracts shared by editor code and other clients, including serialized editor payloads.
- `tests/`: Node architecture tests.
- `public/`: static assets and branding.
- `README.md`: local setup and environment configuration.
- `.env.example`: required environment variable names without secrets.

## Implementation Conventions

- Use strict TypeScript and the existing Vue `<script setup lang="ts">` style.
- Prefer the existing Nuxt UI components and Tailwind utility conventions before adding custom UI primitives or dependencies.
- Keep pages responsive and accessible. Preserve semantic headings, useful labels, keyboard access, loading states, empty states, and actionable error states.
- Keep provider integration normalized at the server boundary. The client should consume `CatalogItem` values rather than provider-specific response shapes.
- Use Nuxt auto-imports and existing composables where they are already established.
- Make the smallest compatible change. Do not restore deleted legacy files or add compatibility layers without a concrete consumer.
- Keep secrets out of source files, logs, generated docs, and commits. Never read or copy values from `.env` or `.env.local` into code or documentation.

## Auth And Data Boundaries

- Auth0 is the browser authentication layer. Convex receives the Auth0 ID token through the client plugin.
- Use the Auth0 `identity.subject` as the account identity. Do not use email, display name, or avatar URL as a durable user key.
- User-scoped Convex operations must use `requireUser` or `ensureUser` from `convex/helpers.ts`.
- Admin-only Convex operations must use `requireAdmin`. Do not rely on client middleware alone for authorization.
- Public Discover queries must return published content only. Draft articles and admin data must not be exposed through public queries.
- Provider API keys belong in runtime configuration and server routes, never in public runtime configuration or browser code.
- Catalog UIDs are canonical provider identities in the form `${source}:${kind}:${sourceId}`. Preserve this format when adding or changing providers.
- Library mutations use operation IDs for idempotency and revisions for conflict handling. Preserve these semantics when changing synchronization behavior.
- Treat `convex/_generated/` as generated output. After schema or Convex API changes, run `npm run convex:codegen` when `CONVEX_DEPLOYMENT` is configured, then typecheck the generated contract.

## Product And UX Boundaries

- The public home page combines provider search with published editorial picks and articles.
- Saving a result requires authentication; the user is redirected to Auth0 when needed.
- The library is private to the authenticated account and is backed by the shared Convex library contract.
- Admin content is edited at `/admin` and `/admin/write`. Drafts are private, published articles appear on Discover, and the editor supports Markdown content plus YouTube and catalog embeds.
- The writing editor has a browser-local draft fallback. Do not remove local persistence without providing an equivalent loss-prevention path.
- The backend supports `saved` and `completed` library states, but the current web watchlist UI primarily exposes saving and removal. Do not claim a completed-state control exists unless the UI is also implemented.

## Validation

Run the checks relevant to the change before reporting completion:

```bash
npm run typecheck
npm run typecheck:convex
npm run lint
npm run test
```

For release or build-related changes, also run:

```bash
npm run build
```

`npm run convex:codegen` requires `CONVEX_DEPLOYMENT`. If it cannot run locally, report that limitation explicitly rather than hand-editing generated files.

## Change Review Checklist

- Confirm the change preserves the Auth0 subject and Convex ownership boundaries.
- Confirm public queries do not expose drafts, private library data, or provider secrets.
- Confirm new catalog data follows `CatalogItem` and canonical UID validation.
- Confirm loading, empty, error, responsive, and authenticated states remain usable when changing UI.
- Update tests when an architectural dependency or contract changes.
- Report validation commands and any environment-dependent checks that could not run.
