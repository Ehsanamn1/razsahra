# Raz Sahra × Medar Integration Contract

## Canonical source pin

integration/medar-source.json is the source of truth for which Medar commit is embedded in a Raz Sahra Pages deployment. It identifies an immutable 40-character Git commit SHA in Ehsanamn1/simorgh; the Pages workflow must never silently substitute main or another moving branch.

To release a newer Medar build on the parent site:

1. Confirm the desired Medar commit is merged into main and its required CI and deployment checks have passed.
2. Update the commit field in integration/medar-source.json to that exact SHA.
3. Run the Raz Sahra workflow. It checks out that pinned revision, executes Medar typecheck/lint/unit tests, builds the app, and runs the parent-site live smoke tests after deployment.
4. Record the combined release's parent SHA and pinned Medar SHA in the release report.

A Medar Worker deploy and a Medar static bundle embedded in Cloudflare Pages are separate releases. The manifest pin tells us exactly which frontend source was bundled; it does not change the operational Worker version by itself.

## Runtime contract

- Parent website and CMS: https://razsahra.pages.dev/, Cloudflare Pages Functions, and the dedicated Raz Sahra CMS Neon database.
- Integrated Medar entry point: /madar/; application deep links such as /madar/app/home must survive direct navigation and refresh.
- Same-origin Medar API proxy: browser requests under /api/medar/api/* are forwarded to the Medar operational Worker, retaining the API's expected path and request semantics.
- Build-time Medar API base path: /api/medar; this must be validated along with the generated artifact and live health endpoint.
- CMS health: /api/health must confirm ok: true and database: connected.
- Medar upstream health through the parent: /api/medar/api/health must confirm ok: true and database: true.

## Security and data boundaries

- Raz Sahra CMS and Medar operational data use separate database environments and migration ledgers. Do not merge them or share their credentials.
- Medar owns its operational authorization and workspace membership checks. A parent-site login does not imply Medar permission.
- Do not create artificial SSO by copying access tokens into browser storage, accepting identity in URL parameters, or bypassing Worker authorization.
- The proxy must not convert private Medar endpoints into public CMS endpoints. Unauthorized requests must remain unauthorized.
- Secrets belong in Cloudflare/GitHub secret stores; never commit real values or include them in test logs.
- Database migrations and production-data changes must follow each system's own safety and review policy.

## Ownership

- Raz Sahra agent: parent-site layout/content, CMS, Pages Functions, /madar/ routing/proxy, integration manifest and parent Pages deployment.
- Medar agent: operational app, member/account provisioning, role permissions, Medar UI, APIs, Worker and mobile builds.
- Cross-repository contract changes require a reviewed commit SHA, tests on both repositories, and a deployment smoke test for the combined route.

## Minimum acceptance checks

1. Parent homepage and /madar/ return HTTP 200.
2. /madar/app/home returns the app shell on a direct refresh.
3. Generated Medar assets use /api/medar and no direct browser-to-Neon connection.
4. Both CMS and Medar health checks pass through their intended boundaries.
5. Unauthenticated CMS-admin and Medar workspace requests are rejected.
6. Desktop and mobile layouts have no unintended horizontal overflow.
7. Deployment report includes parent commit SHA, pinned Medar SHA, workflow status, and live smoke-test outcomes.

A successful build alone is not proof of database connectivity, authorization, or correct live integration.
