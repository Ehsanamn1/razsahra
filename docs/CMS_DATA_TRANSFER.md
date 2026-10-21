# Raz Sahra CMS data transfer utility

The script `scripts/migrate-cms-data.mjs` transfers the allowlisted CMS tables from the current Neon/PostgreSQL source into a **clean, already-created MySQL staging database**. It is intentionally separate from the runtime migration: it does not convert the API and does not make the application MySQL-compatible.

## Requirements
- Node.js 22+
- Install project dependencies with `npm install`
- Run `db/schema.mysql.sql` on a dedicated empty staging database using MySQL 8.0.13+. Do not run `db/seed.mysql.sql` before importing; the optional seed is only for a brand-new installation without source CMS data.
- Create a restorable backup of the source and target before any real import.
- Ensure the machine running the script can reach both the source database and the MySQL target. A shared-host database may reject remote connections; if so, use an approved SSH tunnel or run from a host environment that can reach both systems.
- Keep connection strings in environment variables, never in the repository or command history.

## Dry run (default; writes nothing)
Set:
- `SOURCE_DATABASE_URL` (or `RAZ_SAHRA_DATABASE_URL`) — current Neon connection string.
- `TARGET_MYSQL_URL` — MySQL connection string.

Then run `npm run migrate:cms:dry-run`. It reports source and target row counts for the allowlisted tables.

## Apply to a clean staging database
After applying only the schema (not the optional seed), verifying backups and row counts, run `npm run migrate:cms:apply`. The script refuses to run if any target table is non-empty, imports within a transaction, and verifies per-table row counts before commit. On failure it rolls back the transaction.

## Important limits
- This is a first-load staging importer, not a bidirectional sync, merge tool, or live cutover mechanism.
- It does not transform PostgreSQL JSON/data semantics beyond serializing JSON values for MySQL JSON columns.
- Row-count parity is necessary but not sufficient. Validate foreign-key relationships, JSON values, timestamps, login/password compatibility, CMS behavior, audit events and a restore drill.
- The runtime API still needs a complete, tested Node.js/MySQL port. Do not point the live site at MySQL until that is deployed and accepted.


## Brand-new installation without a source database
If the site is being initialized with no existing CMS data to import, run `db/seed.mysql.sql` once after applying `db/schema.mysql.sql`. Do not run the seed on an import target: seeded rows intentionally make the target non-empty and cause the importer to refuse execution.
