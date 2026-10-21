# Domestic Hosting Readiness — Raz Sahra

## Current purpose
This branch prepares a safe migration from Cloudflare Pages/Functions + Neon PostgreSQL to the Iranian shared host. It does not switch production traffic and must not be treated as a finished MySQL port.

## CI
`.github/workflows/domestic-ci.yml` runs repository checks and creates a review artifact. It deliberately does not deploy to the host because the provider's supported deployment protocol, Node runtime/process model, HTTPS and MySQL details have not been verified.

## Confirmed source facts
- Current API: `functions/api/[[path]].js`, built for a Cloudflare Pages Function runtime.
- Current database client: `@neondatabase/serverless`.
- Current SQL uses PostgreSQL placeholders, JSONB, intervals, casts and data-modifying CTEs. A MySQL schema file alone does not make the API compatible.
- The existing `db/schema.mysql.sql` is a draft. The live API still uses PostgreSQL and must not be pointed at MySQL.

## Required migration work before a host deployment
1. Implement a Node.js HTTP API adapter for the existing routes without weakening origin checks, password hashing, session cookies, one-time admin bootstrap, rate limits, authorization or audit logging.
2. Replace PostgreSQL SQL with parameterized MySQL queries and validate all schema/column/constraint semantics.
3. Add automated tests for registration/login/logout/session expiry, bootstrap single-use, roles, CMS CRUD, inquiry submission, audit logs, rate limits, malformed inputs and database failures.
4. Add migration/import scripts with dry-run mode, repeatable execution, row-count and relationship checks, and a tested rollback path.
5. Add health/readiness endpoints that check the actual MySQL connection and required schema version without exposing secrets or private user data.
6. Verify host-supported Node version, process manager, SSH/SFTP/FTP or webhook, environment variables, cron, file permissions, HTTPS and domain routing.
7. Only after those pass, add a production deployment workflow using host credentials stored as GitHub Actions secrets. Deployment must publish to a staging directory first, health-check it, then atomically switch the release where the host supports that model.

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
