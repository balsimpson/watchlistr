# Watchlistr Product Context

## Product Summary

Watchlistr is a shared place to find the next movie, TV show, or book worth remembering. People search across trusted catalog providers, save titles to a personal library, and return to that library wherever they use Watchlistr. The web app also gives editors a place to publish curated recommendations and editorial notes.

Product promise: **Keep the good ones close.**

## Problem

Interesting titles are scattered across search engines, streaming services, social posts, and conversations. A useful list should be quick to build, easy to revisit, and not tied to a single media provider or client. Watchlistr provides one normalized catalog and one account-backed library for that purpose.

## Users And Roles

- **Library user:** searches for movies, shows, and books and saves titles for later. Their library is private to their authenticated account.
- **Web and extension user:** can use the same Auth0 identity and shared library contract across Watchlistr clients.
- **Editor/admin:** creates, edits, orders, publishes, unpublishes, and deletes editorial content and adds catalog items to collections.

## Current User Journeys

### Discover And Search

- The home page is the public entry point.
- With no search term, it shows published editorial articles and curated catalog picks when available.
- Users can search everything or filter by movies, TV shows, or books.
- Search results are normalized from TMDB for movies and TV shows and Google Books for books.
- A provider can fail without hiding successful results from the other providers.
- Each result can be saved to the user's library. An unauthenticated save starts Auth0 sign-in.

### Personal Library

- Authenticated users open `/user/watchlist` to see their saved titles.
- The library contains one normalized list of movies, shows, and books rather than separate provider-specific lists.
- Users can remove saved entries, and library changes sync through Convex.
- The backend models `saved` and `completed` states, revisions, soft deletion, and idempotent operations. The current web UI does not yet provide a completed-state control.

### Editorial Discovery

- Published articles appear on the home page and are readable at `/discover/:slug`.
- Article content is stored in Convex and rendered as Markdown through the shared editor extension surface.
- Articles can include YouTube embeds and catalog cards for movies, TV shows, or books.
- Drafts remain private until an admin publishes them.

### Editorial Administration

- Authenticated admins use `/admin` as the editorial desk and `/admin/write` as the writing surface.
- The editorial desk lists drafts and published articles, supports status filtering and search, and provides publish/unpublish and draft deletion actions.
- The writing surface auto-saves to Convex when available and keeps a browser-local draft fallback when it is not.
- The first administrator is assigned through the protected Convex admin bootstrap flow; normal users must not gain admin access through client-side state.

## Product Principles

- **Low-friction capture:** finding and saving a title should take fewer steps than remembering where it was found.
- **One canonical library:** provider details can vary, but a saved title must have one stable identity across clients.
- **Public inspiration, private ownership:** editorial discovery is public; a user's library is account-scoped.
- **Provider-agnostic data:** provider responses are normalized into a common catalog model so the UI and library do not depend on one API's shape.
- **Safe publishing:** drafts are private, publication is explicit, and editor failures should not discard writing.
- **Editorial quality over volume:** curated collections and notes should help someone decide what deserves their time.

## Domain Model

- Catalog kinds are `movie`, `tv`, and `book`.
- Catalog sources are `tmdb` and `google-books`.
- A catalog UID is `${source}:${kind}:${sourceId}` and is the stable identity used by library operations.
- A library entry belongs to one authenticated user and references one catalog item.
- Library states are `saved` and `completed`; deleted entries remain soft-deleted for synchronization and revision handling.
- Discover collections have `draft` or `published` status and can contain ordered catalog entries and editorial notes.

## Access Model

- Search and published Discover content are public.
- Saving and viewing a personal library require Auth0 authentication.
- Editorial administration requires an authenticated Convex user with the `admin` role.
- Authorization is enforced in Convex in addition to client-side route middleware.

## Current Scope

- Cross-provider search for movies, TV shows, and books.
- Saving and removing titles from a shared personal library.
- Auth0-based identity shared with the browser extension contract.
- Public editorial articles and curated catalog collections.
- Admin drafting, autosave, publishing, unpublishing, ordering, and deletion of draft content.
- YouTube and catalog embeds inside editorial content.

## Not Implied By The Product

The current product does not provide in-app playback, streaming availability tracking, ratings or reviews, social following, collaborative lists, automated recommendations, or a general-purpose publishing CMS. Do not introduce these as implicit requirements when changing an existing flow.

## Change Guidance

- New providers must normalize into the existing catalog shape and preserve stable provider identity.
- New library states or synchronization behavior require coordinated changes to the Convex schema, validators, mutations, shared types, and user-facing controls.
- New public content must respect the draft/published boundary.
- Changes that affect the browser extension must preserve the shared Auth0 subject, catalog UID, library state, and operation semantics.
- Product copy should remain clear, practical, and editorial rather than promising features that are not implemented.
