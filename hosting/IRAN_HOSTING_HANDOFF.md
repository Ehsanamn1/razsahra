# Iranian Shared Hosting Handoff — Raz Sahra

## Goal
Deliver a tested, upload-ready package for HostMizbanFa shared hosting so the owner does not need to understand code or manually port services.

## Non-negotiable delivery requirements
- Domestic runtime for essential site, CMS and Madar operations; no essential request may depend on Cloudflare Workers, Neon, Supabase, or a foreign API during an international outage.
- MySQL-compatible schemas and migrations. Raz Sahra CMS and Madar operational data remain logically separate databases/prefixes.
- Prebuilt production frontend assets where feasible; no build toolchain required on the host for the final static assets.
- A guided first-run setup screen or documented minimal setup flow; never expose secrets in the browser or commit them.
- Idempotent database installer/migrations, health checks, deployment diagnostics, backup/export instructions, and rollback procedure.
- No hard-coded passwords, admin credentials, production secrets, or real customer data.
- Upload package must include every required runtime file, lockfiles, migrations, and Persian step-by-step instructions.
- Clear separation between features that work domestically and optional integrations that may fail during an international outage.

## Host assumptions to verify before calling the package ready
HostMizbanFa support has reportedly stated: Node.js apps, terminal activation, MySQL only, 5GB NVMe, and process persistence via an internal process manager. These are not yet independently verified. Confirm supported Node version, app startup command, environment-variable configuration, port/proxy mapping, HTTPS, MySQL version/limits, outbound network restrictions, writable paths, and whether the app manager restarts the process after reboot.

## Acceptance tests
1. Clean install on an empty MySQL database.
2. Re-running installer/migrations does not destroy data.
3. Login/session/password reset and role checks work; no default production password.
4. CMS pages, articles, settings, inquiries and audit trail work.
5. Madar order/farm/partner/driver/finance workflows preserve transactions and access controls.
6. Uploads and static assets resolve locally; external fonts/scripts are not required for core UI.
7. Health endpoint reports database connectivity and migration state without revealing credentials.
8. Export/backup restore is tested.
9. Simulated foreign-service outage: core routes and writes continue to work.
10. A non-technical operator can follow the Persian setup guide without editing source code.

## Release gate
Do not label the ZIP production-ready until both repositories' actual code paths have been ported, automated tests pass, and the deployment has been tested against the host's real Node/MySQL limits. Draft migration PRs are planning work, not a completed migration.
