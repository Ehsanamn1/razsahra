# Domestic Host Deployment — Raz Sahra × Madar

This runbook describes the controlled Node.js + MySQL deployment path. It does **not** claim that a package upload equals a production release.

## Runtime boundary

- Node.js 22 LTS runtime.
- MySQL 8.x database, UTF-8 (`utf8mb4`), with a dedicated application user.
- `server/index.mjs` serves the built Raz Sahra site and CMS API.
- `server/medar-api.mjs` provides the domestic Medar API.
- `server/start-domestic.mjs` supervises both services and routes Medar through the local process.
- Keep Cloudflare/Neon production services intact until the domestic acceptance gate passes.

## Build a reproducible host package

1. Open GitHub Actions and run **Domestic host release package** on `feat/mysql-domestic-hosting`, or push a change to the workflow's watched paths.
2. Download the artifact named `raz-sahra-domestic-host-<commit>`.
3. Verify the archive checksum using the accompanying `.sha256` file before extracting.
4. Confirm the metadata commit matches the reviewed commit. The workflow builds and packages files; it does not deploy or migrate production data.

## Host environment

Configure these values in the hosting panel, not in Git:

- `NODE_ENV=production`
- `HOST=0.0.0.0` (the static/CMS server binds to all interfaces)
- `PORT=<port assigned by host>`
- `APP_ORIGIN=https://<exact-production-hostname>`
- `MYSQL_URL=mysql://<app-user>:<URL-encoded-password>@<db-host>:3306/<database>?ssl=true` when TLS is supported and required by the provider
- `ADMIN_BOOTSTRAP_SECRET=<temporary random secret of at least 32 characters>` only during first-owner bootstrap
- `TRUST_PROXY_HEADERS=false` unless a trusted reverse proxy is configured to replace the client-IP headers

Use the host's supported process manager to start `node server/start-domestic.mjs`. Install production dependencies from the included lockfile with `npm ci --omit=dev` where the package layout supports it. Never expose MySQL publicly if a private network or host-local database connection is available.

## Database and migration gates

1. Create a **new, dedicated staging database** first; never test migration against the production database.
2. Run the schema validator and the guarded migration dry run from the repository's documented scripts.
3. Take a recoverable backup before any apply operation.
4. Only run an apply command after confirming the destination is staging and the import/migration confirmation matches the script's exact required value.
5. Compare table counts, foreign-key relationships, identities, memberships, financial ledgers, file metadata, and representative business records.
6. Verify the backup by restoring it to a separate disposable database.

Do not run a PostgreSQL-to-MySQL conversion by simply replaying PostgreSQL SQL. Use the dedicated MySQL migration scripts and review their mapping report.

## Post-deploy smoke tests

- `GET /api/health` returns HTTP 200 and `database: "connected"`.
- `GET /api/medar/api/health` returns HTTP 200 and `service: "medar-domestic-api"`.
- `/`, `/madar/`, and a Madar deep link return the correct app shell.
- Missing static assets return 404, not HTML.
- Anonymous CMS admin calls are denied.
- Anonymous operational workspace calls are denied.
- Owner-created test account can log in, retain a session, change its password, log out, and lose access after revocation.
- Two authorized workspaces cannot read or mutate each other's data.
- Authorized file upload/download works; unauthorized download is denied; deletion and recovery are tested.
- Inventory, order, quality, task, partner-finance, and settlement workflows persist correct records and do not duplicate writes under retries.

## Rollback

- Keep the previous application package and database backup.
- If health checks or authorization fail, stop traffic to the new runtime and restore the prior application/runtime configuration.
- Restore data only using the rehearsed database recovery plan. Never roll back by deleting production tables or blindly replaying schema files.

## Release status policy

A green package workflow proves the artifact can be assembled from that commit. It does not prove production credentials, the live host, migrated data, owner acceptance, tenant isolation, or business workflows. Broad commercial readiness remains **NO-GO** until those live gates have evidence and are signed off by an authorized owner.
