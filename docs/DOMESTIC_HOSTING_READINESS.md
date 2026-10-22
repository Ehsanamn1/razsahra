# Domestic Hosting Readiness — Raz Sahra

## Current purpose
This branch prepares a safe migration from Cloudflare Pages/Functions + Neon PostgreSQL to the Iranian shared host. It does not switch production traffic and must not be treated as a finished MySQL port.

## CI
`.github/workflows/domestic-ci.yml` runs repository checks, applies the MySQL schema and optional seed to a disposable MySQL 8.4 service, checks required tables and connection assumptions, and creates a review artifact. It deliberately does not deploy to the host because the provider's supported deployment protocol, Node runtime/process model, HTTPS and MySQL details have not been verified.

## Confirmed source facts
- Current API: `functions/api/[[path]].js`, built for a Cloudflare Pages Function runtime.
- Current database client: `@neondatabase/serverless`.
- Current SQL uses PostgreSQL placeholders, JSONB, intervals, casts and data-modifying CTEs. A MySQL schema file alone does not make the API compatible.
- `db/schema.mysql.sql` and `db/seed.mysql.sql` are exercised against disposable MySQL 8.4 in CI. `server/cms-api.mjs` now provides a separate Node/MySQL implementation of the CMS routes, and `server/index.mjs` serves static files plus `/api/*` for a domestic Node process. The integration test exercises health, one-time admin bootstrap, sessions, admin overview, page updates, article/app/settings upserts, registration, inquiries and public app listing against MySQL 8.4. This implementation is staged only; the live Cloudflare Pages Function remains Neon/PostgreSQL.

## Required migration work before a host deployment
1. Harden the Node/MySQL adapter with broader negative/security tests, error mapping and query coverage; the current MySQL 8.4 integration tests cover the main CMS write paths but are not a full production soak test.
2. Finish route-by-route equivalence checks for every CMS endpoint and test malformed inputs, rate limits, database failures, session expiry and bootstrap replay attempts.
3. Exercise the guarded Neon-to-MySQL importer with a real staging export, compare every table count and relationships, and rehearse a restore/rollback.
4. Complete the Madar API/database port before claiming the combined Raz Sahra + Madar platform is domestic/offline-capable. The current Node proxy can be configured via `MEDAR_API_URL`, but the Madar upstream is still not fully migrated.
5. Verify HostMizbanFa Node version, process manager, SSH/SFTP/FTP or webhook, environment variables, cron, file permissions, HTTPS and domain routing.
6. Only after those pass, add and run a production deployment workflow using host credentials stored as GitHub Actions secrets. Deployment must publish to a staging directory first, health-check it, then atomically switch the release where the host supports that model.

## GitHub Actions secret names reserved for a later deploy workflow
Do not create these as plaintext files or commit them:
- `HOST_SSH_HOST`
- `HOST_SSH_USER`
- `HOST_SSH_KEY` (preferred over a password where SSH is supported)
- `HOST_DEPLOY_PATH`
- `HOST_HEALTHCHECK_URL`
- `MYSQL_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` (only if the application needs runtime configuration in the deployment process; application secrets should preferably be configured in the hosting panel)

Never paste secret values into chat or logs.

## Release gate
No production deployment is authorized by this CI workflow. Keep the existing Cloudflare/Neon production service and data intact until staging tests, backup restoration and cutover/rollback rehearsals pass.
