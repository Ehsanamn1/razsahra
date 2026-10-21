# Raz Sahra × Medar Integration Contract

**Canonical source:** Ehsanamn1/razsahra → docs/INTEGRATION_CONTRACT.md  
**Last reconciled:** 2026-10-21  
**Scope:** Production web routing, API proxying, identity boundaries, data ownership, and release coordination.

This document describes the checked-in implementation and the last recorded release evidence. It is not a guarantee that later deployments remain healthy; the linked workflows are the operational source of truth for each release.

## 1. Systems and ownership

| Concern | Owner | Production responsibility |
|---|---|---|
| Public brand, public pages, CMS and CMS APIs | Raz Sahra (Ehsanamn1/razsahra) | Cloudflare Pages project razsahra and its Pages Functions |
| Medar web/PWA bundle served under the parent domain | Raz Sahra release workflow, sourcing Medar code | Built into dist/madar/ with Vite base path /madar/ |
| Operational application, authorization and operational API | Medar (Ehsanamn1/simorgh) | Cloudflare Worker medar-ops |
| Raz Sahra CMS data | Raz Sahra runtime | Its own Neon PostgreSQL connection configured as the Pages DATABASE_URL secret |
| Medar operational data | Medar Worker | Its own Neon PostgreSQL connection configured as the Worker DATABASE_URL secret |

## 2. No shared database or an authenticated session

Raz Sahra and Medar share a brand and a public origin; they do not share a database or an authenticated session.

| Route / endpoint | Owner and contract |
|---|---|
| https://razsahra.pages.dev/ | Raz Sahra public website. The homepage exposes an entry to Medar at /madar/. |
| /madar | Normalizes to /madar/ with the Cloudflare Pages redirect defined in _redirects. |
| /madar/ | Medar React/Vite web app built from the reviewed Medar source revision. |
| /madar/* | Pages serves real assets normally. For GET/HEAD browser navigations to extensionless routes that accept HTML, functions/madar/[[path]].js serves the app shell so a nested-route refresh works. |
| /api/health | Raz Sahra CMS/API health. A healthy response is HTTP 200 JSON with ok: true and database: "connected". |
| /api/medar/api/* | Same-origin proxy. For example, /api/medar/api/health forwards to the Medar Worker's /api/health. |
| /api/admin/* | Raz Sahra CMS administration API. A request without a valid Raz Sahra admin session must be rejected (normally HTTP 401 or 403). |
| https://medar-ops.dengxiao445.workers.dev/ | Direct operational Medar application origin. The Worker remains the authorization authority for operational data. |
| https://medar-api.dengxiao445.workers.dev/ | Compatibility/public-demo Worker hostname; do not treat it as the operational application origin or as a source of live business data. |

### API proxy behavior

The implementation lives in functions/api/[[path]].js. Browser requests under /api/medar/api/* map to the corresponding /api/* path on https://medar-ops.dengxiao445.workers.dev.

The proxy forwards the request method, body, and applicable headers; it removes request headers such as host and content-length, preserves the upstream HTTP status, status text, and response body, removes stale response content-length, and enforces no-store plus baseline response-security headers. Non-OPTIONS proxy requests reject an unexpected Origin. Keep upstream errors and authorization decisions intact; do not translate an upstream failure into a fake success response.

## 3. Identity and authorization boundaries

- Raz Sahra uses its own rs_session cookie and its own CMS users/sessions records. CMS administration is enforced server-side by the Pages Function.
- Medar uses its own medar_session cookie and operational memberships/permissions enforced by the Medar Worker.
- Logging into Raz Sahra does not log a user into Medar. A Raz Sahra session does not authorize Medar API requests, and a Medar session does not authorize CMS administration.
- Never implement SSO by sharing local storage, copying cookies/tokens, trusting a URL parameter, or assuming same-origin means same identity.
- Do not weaken server authorization to make navigation or proxying work. Role-specific UI is not an authorization boundary.
- The post-deployment smoke test must check that unauthenticated CMS administration is denied as well as checking the two independent health endpoints.

If unified sign-in is later approved, it requires an explicit identity/session design, threat review, and tests; it is not part of this contract.

## 4. Database and secrets

- Raz Sahra CMS and Medar operational data remain in independent Neon projects/branches and use separate connection secrets.
- In the GitHub workflow, RAZ_SAHRA_DATABASE_URL is the dedicated source for provisioning the Pages secret when configured; the resulting Pages DATABASE_URL belongs only to Raz Sahra. Medar's Worker DATABASE_URL belongs only to Medar.
- Project IDs muddy-sky-93252630 (Raz Sahra CMS) and weathered-shadow-56159151 (Medar) are discovery hints, not proof of the active production branch. Verify the actual Neon project, branch, and schema before a migration or data operation.
- Never place database URLs, Cloudflare tokens, session-signing secrets, passwords, or private credentials in source files, browser bundles, screenshots, or logs.
- Do not query or mutate the other product's database directly. Any future exchange of business data must use a reviewed, narrow API with explicit authorization.

## 5. Release contract

### Current reviewed Medar source

The exact integrated frontend revision is kept in the canonical manifest at `integration/medar-source.json`. Its `repository` must remain `Ehsanamn1/simorgh`, and `commit` must be a full 40-character lowercase Git SHA. The Pages workflow reads and validates the manifest, checks out that immutable commit, runs the Medar typecheck/lint/unit tests, and builds the bundle under `/madar/`.

The current pin is:

6fa62e1826d8f4a3ebbd8ef137b043fecda646ab

This pinned Medar main revision (`6fa62e1826d8f4a3ebbd8ef137b043fecda646ab`) passed Medar CI [run 39641706342](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706342), operational Worker deployment [run 39641706299](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706299), Android build [run 39641706082](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706082), and iOS simulator build [run 39641706298](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706298). The last completed parent release [run 39641856036](https://github.com/Ehsanamn1/razsahra/actions/runs/39641856036) still embedded the previous pin; the current PR's validation and the next post-merge parent release must confirm this new pin is built and live before it is marked deployed. The standalone Worker release and the embedded `/madar/` bundle are separate artifacts and must be verified separately.

To upgrade the integrated bundle, first identify a specific Medar commit merged into `main`, verify its required Medar CI and Worker deployment results, then update `integration/medar-source.json` in a reviewed parent-site change. Do not change the source back to a moving branch, and do not duplicate the pin in the workflow. The workflow embeds both the parent-site SHA and Medar SHA in the app version marker so deployed assets can be attributed to the exact pair.

### Deployment gates

The parent release workflow must complete all of the following before the run can succeed:

1. Validate the Raz Sahra API, schema, frontend, and build.
2. Check out the pinned Medar source and pass its typecheck, lint, and tests.
3. Build Medar under /madar/ with VITE_API_BASE_URL=/api/medar.
4. Publish through the authorized Cloudflare Pages workflow.
5. Check HTTP 200 for the canonical site, /madar/, and a nested app route such as /madar/app/home.
6. Confirm Raz Sahra CMS health and Medar operational API health independently.
7. Confirm the public homepage contains a working same-origin Medar entry point.
8. Confirm an unauthenticated request to /api/admin/pages is denied with HTTP 401 or 403.

The Medar Worker's own deployment and authorization checks remain separately required. Green build, green deploy, and verified user workflow are distinct claims.

## 6. Last verified release evidence

- **Latest parent production release actually verified:** Raz Sahra parent commit `73f452ea20e06c892b021091a7e95f4d7662c2f5`, workflow run [39642992636](https://github.com/Ehsanamn1/razsahra/actions/runs/39642992636), conclusion: **success**. Cloudflare reported deployment URL https://8c1c3e64.razsahra.pages.dev; canonical origin: https://razsahra.pages.dev/.
- **Medar source actually embedded in that last verified parent release:** `6fa62e1826d8f4a3ebbd8ef137b043fecda646ab`. Its combined marker with parent `73f452ea20e06c892b021091a7e95f4d7662c2f5` was found in generated JS. The routes `/`, `/madar/`, and `/madar/app/home` returned HTTP 200; Raz Sahra CMS health returned `ok: true, database: "connected"`; Medar upstream health returned `ok: true, database: true`; unauthenticated GET `/api/admin/pages` returned HTTP 401 at both canonical and deployment origins.
- **Proposed replacement Medar pin in this change:** `70329106d6cd921e1c036714157986b72e0ea201`, from `integration/medar-source.json`. Medar main CI [run 39653283320](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283320), operational Worker release and live smoke tests [run 39653283449](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283449), Android build [run 39653283373](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283373), iOS simulator build [run 39653283318](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283318), and full source bundle [run 39653283462](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283462) all passed.
- Medar release [run 39653283449](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283449) independently confirmed that health reports `service: "medar-ops"`, `database: true`, and username/password authentication; public signup and invitation signup are disabled, unauthorized workspace access is denied, hostile-origin mutations are rejected, native credentialed CORS preflights pass, the desktop/mobile sign-in UI works, and the public `medar-api` demo remains read-only and redirects to operational Medar.
- **The new pin is not considered deployed through Raz Sahra yet.** Parent CI must prove the generated Medar JavaScript contains the combined marker formed from the parent source SHA selected by that workflow and `70329106d6cd921e1c036714157986b72e0ea201`; do not assume the pre-merge base SHA is the build SHA. After merge, the next Pages production release must independently pass route, deep-link, CMS health, Medar upstream health, and unauthenticated CMS-admin HTTP 401 smoke tests before this pin is marked verified.
- Pull-request validation uses PR-specific concurrency and cannot cancel production releases. Production releases do not cancel each other; the static concurrency assertion and a successful release are recorded in [PR #5](https://github.com/Ehsanamn1/razsahra/pull/5) and [run 39641032144](https://github.com/Ehsanamn1/razsahra/actions/runs/39641032144).


## 7. Out of scope

This contract does not authorize destructive database changes, production fixture accounts, public customer ordering, cross-database joins, payments/bank access, or SSO. It does not claim every finance, GPS, offline-sync, AI-provider, or role-specific workflow is commercially ready. Those capabilities require their own acceptance criteria and verification evidence.
