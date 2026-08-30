# Shared Convex backend ownership design

Date: 2026-08-30

Status: Approved in chat for specification. Implementation remains pending specification review.

## Context

Watchlistr has two independent clients:

- the WXT Chrome extension in `Watchlistr Chrome_extension`;
- the Nuxt website in `Watchlistr_web`.

Both clients authenticate through the same Auth0 tenant and connect directly to the same Convex deployment. The website is not a runtime dependency of the extension. The shared Convex service continues to run if either client deployment is unavailable.

Both repositories currently contain a deployable `convex/` implementation. Those copies have diverged. The web copy accepts both Auth0 application IDs and contains article functions used by the website. The extension copy lacks some of those functions and retains older backend details. Running Convex development or deployment from the extension can therefore publish an older definition over the shared deployment.

The extension runtime does not import its local Convex implementation or generated bindings. It calls the deployed API by function name from `Watchlistr/lib/sync/convex.ts`. The extension's local `convex/` directory currently exists for backend source, backend typechecking, generated bindings, and seven `convex-test` tests.

## Goals

- Keep the website and Chrome extension as separate projects, builds, deployments, and release processes.
- Make `Watchlistr_web/convex` the only source that can define or deploy the shared Convex backend.
- Preserve the existing Auth0 subject identity and private per-owner library behavior across both clients.
- Preserve the extension backend test coverage by moving it to the repository that owns the backend.
- Remove the accidental Convex deployment path from the extension repository.
- Document the runtime and deployment boundaries in both repositories.
- Update the extension audit report to record the decision and completed work accurately.

## Non-goals

- Do not combine the website and extension repositories.
- Do not route extension traffic through a Nuxt server endpoint or require the website to be online.
- Do not create a third backend repository.
- Do not deploy Convex, the website, or the extension as part of the ownership change.
- Do not change the Convex schema, stored data, authentication behavior, library synchronization contract, Discover behavior, or provider metadata write rules.
- Do not remove the pre-v2 extension storage migration.
- Do not clean up Web Store screenshots or promotional assets.
- Do not implement the catalogue-integrity recommendation in this change.

## Architecture decision

`Watchlistr_web/convex` will own the shared Convex schema, functions, generated bindings, backend tests, typechecking, code generation, environment documentation, and deployment commands.

The Chrome extension will remain a direct Convex client. It will retain:

- the `convex` runtime dependency;
- `ConvexClient`, `ConvexHttpClient`, and `makeFunctionReference` usage;
- its local account cache, retry queue, optimistic updates, and realtime subscriptions;
- the configured Convex deployment URL and Auth0 native application flow.

The Chrome extension will no longer contain a deployable `convex/` implementation or a Convex deployment command.

The runtime remains:

```text
Chrome extension  ───────► shared Convex deployment
Website           ───────► shared Convex deployment
```

There is no extension-to-website API dependency.

## Web repository changes

The implementation will:

1. Keep the existing `Watchlistr_web/convex` implementation as the backend base. Extension files must not overwrite the newer web schema, Auth0 provider list, article fields, admin functions, or Discover article functions.
2. Move the extension's `convex/backend.test.ts` coverage into `Watchlistr_web/convex/backend.test.ts`.
3. Adapt those tests to the current web backend contract where the web API intentionally extends the older extension API.
4. Add the test-only dependencies required by `convex-test` and its Edge runtime to `Watchlistr_web`.
5. Add a focused Vitest configuration and scripts so the normal web test command runs both the existing Node architecture tests and the Convex backend tests.
6. Keep `npm run typecheck:convex` and `npm run convex:codegen` in the web repository.
7. Update `Watchlistr_web/AGENTS.md` and `README.md` to state that this repository owns the independent shared Convex service for both clients.
8. Document that website deployment and Convex deployment are separate operations.

The moved tests must continue to cover:

- anonymous private reads are rejected;
- two authenticated subjects cannot read each other's libraries;
- source URLs remain owner-scoped;
- repeated operation IDs remain idempotent;
- completed-state precedence remains stable during import;
- tombstones remain visible to synchronization and stale restoration is rejected;
- normal users cannot call admin functions;
- public Discover queries expose only published data;
- catalogue URLs reject executable schemes.

If a moved test reveals a real contract difference rather than a test fixture mismatch, implementation must stop and report it. This ownership change must not silently alter backend behavior.

## Extension repository changes

The implementation will:

1. Remove `Watchlistr/convex`, including the duplicate schema, functions, generated bindings, TypeScript configuration, and the test after its coverage exists in the web repository.
2. Remove the extension's `typecheck:convex` script.
3. Remove `convex-test` and `@edge-runtime/vm` from the extension development dependencies after confirming no extension unit test uses them.
4. Simplify the extension Vitest configuration so it runs only extension unit and integration tests under `Watchlistr/tests`.
5. Remove the stale `convex/_generated` lint ignore.
6. Keep the production `convex` dependency and all code in `Watchlistr/lib/sync/convex.ts`.
7. Add an extension architecture test that confirms the package exposes no Convex deployment or backend-typecheck script and the sync client does not import local generated bindings.
8. Update the root `AGENTS.md`, `Watchlistr/README.md`, and `Watchlistr/docs/BASELINE_AND_DEVELOPMENT.md` to describe the extension as a direct client of the shared Convex deployment.
9. Delete `Watchlistr/docs/CLERK_CONVEX_DEVELOPMENT_SETUP.md` and `Watchlistr/docs/IMPLEMENTATION_STATUS.md`. They describe retired Clerk configuration and the extension as a backend deployment source.
10. Update `EXTENSION_AUDIT_RECOMMENDATIONS.md` to mark backend ownership resolved, keep the catalogue-integrity work open, keep Discover as a future extension capability, keep the legacy migration, and defer store-asset cleanup.

## Documentation rules

Both `AGENTS.md` files must state the same ownership rule in plain language:

> `Watchlistr_web/convex` is the only source and deployment location for the shared Watchlistr Convex backend. The Chrome extension is a direct client of that service and must not contain or deploy a second backend implementation.

The extension documentation must also say that website availability does not affect extension synchronization. Both clients connect directly to Convex.

The web documentation must list backend validation and deployment commands separately from Nuxt build and hosting commands. It must not imply that deploying the website deploys Convex automatically.

## Deployment safety

Removing the extension's `convex/` directory is the main enforcement mechanism. Documentation alone is not considered sufficient because it can be missed and does not prevent the Convex CLI from publishing a duplicate backend.

The extension must not gain a replacement `convex dev`, `convex deploy`, or backend code-generation script. Any future shared schema or function change must begin in `Watchlistr_web`.

The implementation must not read, print, copy, or edit secret values from either repository's ignored environment files. Existing clients will continue using their configured public Convex URLs and Auth0 settings.

## Validation

Before delivery, run these checks in `Watchlistr_web`:

```bash
npm run typecheck
npm run typecheck:convex
npm run lint
npm run test
```

Run these checks in `Watchlistr Chrome_extension/Watchlistr`:

```bash
npm run typecheck
npm run lint
npm test
```

The extension's `typecheck:convex` command will no longer exist because the extension no longer owns backend source.

Because the extension package and tracked source structure will change, follow its release rules after validation:

1. bump the patch version;
2. remove the existing `.output` directory;
3. run the production build;
4. recreate `Watchlistr.zip` from `.output/chrome-mv3`;
5. verify ZIP integrity;
6. verify package, unpacked manifest, and zipped manifest version parity.

No browser acceptance test is required for a user-facing behavior change because runtime extension behavior is not changing. The final report must still distinguish static checks and artifact verification from a live Chrome reload.

## Data and rollback safety

This change has no Convex schema migration and does not write deployment data. User libraries remain in the existing Convex deployment.

The web backend source and moved tests must pass before the extension backend copy is removed. If the web test migration cannot reproduce the current ownership, source URL, sync, admin, and publication guarantees, stop before deleting the extension copy.

Git history remains the rollback mechanism for deleted duplicate source and retired documentation. No ignored environment file, tracked historical build snapshot, or user library data will be deleted. The ignored current `.output` directory will be replaced only as part of the extension's required clean release build.

## Acceptance criteria

The change is complete when:

- `Watchlistr_web/convex` is the only deployable backend implementation in the two repositories;
- the extension continues to reference the same deployed Convex functions through its client module;
- the backend tests run and pass from `Watchlistr_web`;
- the extension test suite no longer loads a local backend project;
- both repositories clearly document independent client deployment and shared Convex runtime ownership;
- the retired Clerk backend setup and stale implementation-status document are gone;
- the audit report records the completed ownership decision without claiming that catalogue integrity is fixed;
- all required checks pass;
- the extension package, unpacked build, and ZIP share the new patch version;
- no Convex, website, Git remote, or Chrome Web Store deployment occurs.
