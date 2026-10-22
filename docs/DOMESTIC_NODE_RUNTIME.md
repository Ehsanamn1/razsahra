# Domestic Node Runtime — Raz Sahra

This document describes the staged Node.js + MySQL runtime. It is **not** a production cutover approval.

## Runtime files

- `server/index.mjs`: Node HTTP entrypoint; serves the built site, routes `/api/*` to the CMS handler, preserves the separate `/madar/` app shell for deep links, and closes the MySQL pool on shutdown.
- `server/cms-api.mjs`: Node/MySQL CMS implementation. It uses `mysql2/promise` and `MYSQL_URL`; it is separate from the Cloudflare Pages Function so the Cloudflare runtime is not forced to bundle a TCP database driver.
- `scripts/test-mysql-cms-api.mjs`: integration coverage against disposable MySQL.
- `scripts/test-domestic-node-server.mjs`: real HTTP smoke test for static assets, the Madar deep-link fallback, missing-asset 404s, HEAD requests and database health.

## Required environment

Configure these in the host's protected environment settings, never in committed files:

- `MYSQL_URL`: MySQL connection URL, for example `mysql://USER:PASSWORD@DB_HOST:3306/DATABASE`. Percent-encode special characters in the username/password. Add `?ssl=true` only if the provider confirms TLS support and certificate validation requirements.
- `ADMIN_BOOTSTRAP_SECRET`: high-entropy secret of at least 32 characters, used only for one-time initial administrator bootstrap.
- `MEDAR_API_URL`: optional Madar upstream origin. Until the Madar backend is ported, the default remains the existing Worker API; that is **not** domestic/offline operation.
- `PORT`: the port assigned by the host's Node process manager.
- `STATIC_DIR`: optional static root; defaults to `dist`.

## Local/staging run

1. Install the repository dependencies using the lockfile-supported install command.
2. Build the static site: `npm run build`.
3. Start the Node server with the protected staging `MYSQL_URL`, `ADMIN_BOOTSTRAP_SECRET`, `PORT` and `STATIC_DIR=dist`.
4. Verify `GET /api/health` returns HTTP 200 and reports the database as connected.
5. Run the CMS API and Node server integration tests against a **disposable staging database**, not a production database.
6. Before importing real CMS records, run `scripts/migrate-cms-data.mjs` in dry-run mode. The importer is designed for an empty target and must not be used against a populated database.

## Current verified scope

The MySQL 8.4 CI path exercises health, first-admin bootstrap and replay rejection, sessions, logout, admin overview, CMS page update, article upsert, app catalog upsert, settings upsert, inquiry status update, registration, public article/app listing and the HTTP server's static/deep-link behavior.

## Explicit release blockers

- Madar still has a PostgreSQL/Neon operational API and only its MySQL identity/tenant foundation has been converted. Pointing `MEDAR_API_URL` at the Worker is a temporary compatibility path, not a domestic cutover.
- No HostMizbanFa SSH/SFTP credentials, database connection details, process-manager confirmation, HTTPS/domain configuration or staging environment have been supplied to the deployment workflow.
- No production data import, restore drill, traffic cutover or rollback rehearsal has been performed.

Do not merge this branch as a completed domestic migration or remove the existing Cloudflare/Neon production service until the blockers above are resolved.
