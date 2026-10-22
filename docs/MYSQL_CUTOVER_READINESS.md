# Raz Sahra — MySQL cutover readiness gate

Status: **NOT READY TO CUT OVER**. This document is an execution gate, not evidence that migration has happened.

## Current architecture and no-regression rule
The production CMS currently runs as Cloudflare Pages Functions with `@neondatabase/serverless` and PostgreSQL. Do not point the production site at MySQL, remove Neon secrets, or change the production database until every gate below passes. Keep Madar's operational database separate from the Raz Sahra CMS database.

## Required implementation gates
1. **Runtime adapter:** implement a Node.js HTTP adapter for the complete existing CMS API contract. Preserve request limits, same-origin checks, rate limiting, session hashing, secure HttpOnly cookies, password hashing, role checks, audit logs, and error response shapes. Never port only the happy path.
2. **Schema parity:** compare every PostgreSQL table, index, constraint, default, JSON field, and timestamp behavior against the MySQL 8 schema. Explicitly map `$1` parameters, `RETURNING`, `ON CONFLICT`, `::jsonb`, `now()`, transaction behavior, and generated identifiers. No string interpolation for user input.
3. **Automated compatibility suite:** run the same API contract tests against the existing PostgreSQL adapter and new MySQL adapter. Cover login/logout/session expiry, bootstrap one-time behavior, admin authorization, rate limits, inquiries, CRUD, audit records, malformed/oversized bodies, CSRF/origin rejection, and concurrent writes.
4. **Data export and dry run:** take a consistent, encrypted, restorable source backup. Export each table with stable ordering and explicit type conversion. Import into a disposable MySQL database; compare per-table row counts, primary keys, foreign-key relationships, null counts, and canonicalized row hashes. Never use production credentials in CI.
5. **Rollback rehearsal:** document and rehearse the exact DNS/runtime rollback and freeze write operations during cutover. Define a maximum acceptable write-loss window; if dual-write is not designed and verified, do not allow writes during the switch.
6. **Host acceptance:** verify the target host's supported Node version, process manager, TLS, environment-secret configuration, database network access, scheduled backups, restore access, logs, and health checks. A hosting dashboard existing is not proof the app is deployed.
7. **Live acceptance:** test public routes, CMS login and admin routes, unauthorized denial, inquiry submission, audit trail, database health, session cookie flags, restart persistence, and a restore from backup. Only then make a human-approved go/no-go decision.

## Cutover rules
- Keep current Cloudflare Pages + Neon deployment live until all gates pass.
- Do not copy passwords or secrets into issues, commits, chat, or browser-visible variables.
- Do not delete or overwrite source records during a first import. Prefer a new destination database and repeatable import.
- Any mismatch in counts, relationships, hashes, auth behavior, or permissions is a hard stop.
- Production cutover requires explicit owner approval after the evidence is reviewed.

## Evidence ledger
Record the commit SHA, source/destination database identifiers (not credentials), backup checksum, per-table reconciliation report, test run URLs, rollback test result, target host health URL, and owner acceptance date here before cutover.

| Gate | Required evidence | Status |
|---|---|---|
| Node.js API adapter parity | Automated contract suite against MySQL | BLOCKED |
| MySQL schema parity | Schema and constraint diff | BLOCKED |
| Data backup/export | Restorable encrypted backup + checksum | BLOCKED |
| Dry-run import/reconciliation | Counts, relationships, canonical hashes | BLOCKED |
| Rollback rehearsal | Recorded successful rehearsal | BLOCKED |
| Host deployment | Actual host URL and health evidence | BLOCKED |
| Live acceptance | Auth, authorization, writes, audit, restart, restore | BLOCKED |
