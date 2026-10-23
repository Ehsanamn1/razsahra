# MySQL domestic-hosting migration — status

## Scope

This migration is intended to make the Raz Sahra public website and CMS usable from Iranian hosting when international connectivity is interrupted. The first target is the host's MySQL 8-compatible service. The existing Cloudflare Pages/Neon deployment must remain available until the domestic stack passes acceptance tests.

## Current status

- [x] Add the MySQL CMS schema in `db/schema.mysql.sql`; keep optional first-install rows separate in `db/seed.mysql.sql` so imports start with empty target tables.
- [x] Add static source/target column parity checks for all nine CMS tables.
- [x] Add a disposable MySQL 8.4 integration check that applies the schema and optional seed.
- [x] Add connection preflight for server version, required tables, InnoDB, utf8mb4, and UUID support.
- [x] Add a guarded first-load CMS importer with source/target column compatibility checks, row counts, transaction, and rollback.
- [ ] Implement a Node.js HTTP runtime for the CMS API on the Iranian host.
- [ ] Port every CMS query from PostgreSQL syntax to parameterized MySQL queries.
- [ ] Preserve session security, admin authorization, rate limits, audit logging, and inquiry validation.
- [ ] Create the actual separate MySQL staging database and run the guarded import against the real source and target; disposable CI does not migrate production data.
- [ ] Test registration, login/logout, bootstrap, article editing, page/settings editing, app catalogue, inquiry submission/status changes, and admin role checks.
- [ ] Publish the static site and Node.js API to the Iranian host and test from an Iranian network.
- [ ] Keep Cloudflare/Neon as the external deployment until the domestic deployment is verified.

## Important: this branch is not a completed database switch

The current production API in `functions/api/[[path]].js` still uses `@neondatabase/serverless` and PostgreSQL-specific SQL. The MySQL schema file alone does not make the API work against MySQL. Do not set the current `DATABASE_URL` to a MySQL connection string, and do not remove the Neon project.

## Madar is a separate migration

Madar's operational API is in `Ehsanamn1/simorgh/worker/index.ts` and uses Neon PostgreSQL. Its 31 numbered migrations and server-side functions include PostgreSQL-specific JSONB, enums, partial indexes, PL/pgSQL functions/RPCs, and concurrency controls. It needs its own staged MySQL port and equivalence tests. It must not be pointed at the Raz Sahra CMS database; the two data domains remain isolated.

## Hosting/runtime requirements to confirm

Before production cutover, verify with the provider:
- supported Node.js version and process manager behavior;
- whether a long-running Node.js HTTP application is supported on the selected plan;
- ability to set encrypted environment variables;
- HTTPS/custom-domain routing to the Node.js app;
- MySQL version, charset/collation, transaction and foreign-key support;
- outbound access needed for any remaining integrations.

## Safety and cutover

1. Create a separate staging MySQL database.
2. Apply `db/schema.mysql.sql` only to that empty staging database. Do not apply `db/seed.mysql.sql` before importing existing content.
3. Implement and test the MySQL API before importing production records.
4. Take and test a restorable Neon backup before data migration.
5. Compare table row counts and representative records after import.
6. Keep the external production deployment untouched until all acceptance tests pass.
7. Cut over DNS only after the domestic site and API work without Cloudflare Workers/Neon dependencies.
