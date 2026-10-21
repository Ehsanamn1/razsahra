# Raz Sahra — backend and migration notes

## Architecture

- Frontend: current Persian/English HTML, CSS, and JavaScript.
- Runtime/API: Cloudflare Pages Functions under /api/*.
- Database: portable PostgreSQL on Neon; source schema is db/schema.sql.
- Security: HttpOnly SameSite=Lax cookie sessions, 14-day expiry, PBKDF2-SHA-256 password hashes, basic authentication throttling, admin-only APIs, and audit logs.
- Madar: the current `Ehsanamn1/simorgh` web/PWA source is built and published under `/madar/` as Raz Sahra's integrated digital product. Its API calls use the same-origin `/api/medar/*` route, proxied by Pages Functions to the operational Medar Worker. No signed Android/iOS release binary is published; do not present a native download as available until a real signed artifact exists.

## Deployment prerequisites

The legacy public preview remains on GitHub Pages, but GitHub Pages does not execute the Functions backend. The Cloudflare Pages production deployment is configured at `https://razsahra.pages.dev/`. The GitHub Actions workflow builds and deploys the site and the Madar web app, then smoke-tests `/`, `/madar/`, and `/api/health`. Authentication and stored form submissions require the production `DATABASE_URL` secret in Cloudflare Pages → Settings → Variables and Secrets. Never commit real connection strings or `.dev.vars`.

A new Neon project called raz-sahra-site has been created. Its initial schema and the first administrator record have been applied to its default branch. Retrieve the database connection string from the Neon console and keep it secret. For production, prefer a least-privilege Postgres role rather than using the database owner role.

## Cloudflare Pages setup

1. The GitHub Actions workflow creates a Pages project named `razsahra` on the configured Cloudflare account if it is absent, but only after authenticated project listing succeeds. The current deployment is published at `https://razsahra.pages.dev/`; configure a custom domain separately if desired.
2. Add repository secret CLOUDFLARE_API_TOKEN with Pages deployment permission and CLOUDFLARE_ACCOUNT_ID. Add repository variable SITE_URL with the real public HTTPS origin, including the trailing slash if desired.
3. In Cloudflare Pages production variables/secrets, set DATABASE_URL from Neon as an encrypted secret. Do not put it in frontend code or Git.
4. Push validated changes to `main` or run the workflow manually. Its post-deploy smoke test verifies HTTP 200 for `/` and `/madar/` and requires `GET /api/health` to report `ok: true` and `database: "connected"`. Separately verify registration, login/logout, admin authorization, CMS edits, and inquiry storage before treating the full account lifecycle as accepted.
5. Attach the domain in Cloudflare Pages. Keep /api/* routed to Functions and reserve /madar/* for the Madar web app.

The workflow runs on pushes to `main` and can also be started manually. Pull requests run validation/build checks only and never publish production. The legacy GitHub Pages preview is a separate static site and does not provide the production API.

## Administrator account

The admin bootstrap endpoint is protected by the one-time `ADMIN_BOOTSTRAP_SECRET` host secret. Do not commit that secret, a production password, or the database URL. Complete the bootstrap only after production secrets are set, then save the generated credentials in a password manager and change them if exposed.

## API routes

- POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout.
- GET /api/admin/overview — management dashboard metrics.
- GET/PUT /api/admin/pages — page metadata and JSON content configuration.
- GET/PUT /api/admin/articles — bilingual article content and publishing status.
- GET/PATCH /api/admin/users and PATCH /api/admin/users/role — account access management.
- GET/PATCH /api/admin/inquiries and PATCH /api/admin/inquiries/status — contact messages.
- GET/PUT /api/admin/apps — app catalogue, including the integrated Madar web entry at `/madar/`.
- GET/PUT /api/admin/settings and GET /api/admin/audit.
- POST /api/inquiries — securely stores an inquiry in the database.
- GET /api/public/pages, /api/public/articles, /api/public/apps — public CMS APIs.

Content edits are stored in PostgreSQL. Public articles can be hydrated from published DB records when Pages Functions are deployed. Page metadata is editable in the CMS; the existing layout remains the visual source of truth for fixed homepage sections until each section is wired to CMS content keys.

## Migration

The data layer is plain PostgreSQL. Later, use pg_dump/restore to move data to another PostgreSQL host, set DATABASE_URL in the new runtime, and point the same domain to the new host. The current HTML front end does not need a framework migration just to move the database.

## Current limitations

- Email verification and password recovery are not enabled because no verified email/SMTP provider has been configured.
- The Madar web/PWA bundle is built into the Cloudflare Pages release at `/madar/`; no signed Android/iOS install package is published yet.
- Public Cloudflare Pages deployment has succeeded. The latest workflow's post-deployment smoke-test outcome is the source of truth for live site and Neon health; the legacy GitHub Pages URL remains static-only.
