# Raz Sahra — backend and migration notes

## Architecture

- Frontend: current Persian/English HTML, CSS, and JavaScript.
- Runtime/API: Cloudflare Pages Functions under /api/*.
- Database: portable PostgreSQL on Neon; source schema is db/schema.sql.
- Security: HttpOnly SameSite=Lax cookie sessions, 14-day expiry, PBKDF2-SHA-256 password hashes, basic authentication throttling, admin-only APIs, and audit logs.
- Future Madar route: /madar/ is reserved. The app catalogue and admin API are present; the actual Madar web/PWA bundle has not yet been copied into this repository.

## Deployment prerequisites

The public preview remains on GitHub Pages; GitHub Pages does not execute the Functions backend. Authentication becomes live after this repository is deployed to Cloudflare Pages and the production secret DATABASE_URL is set in Cloudflare Pages → Settings → Variables and Secrets. Never commit real connection strings or .dev.vars.

A new Neon project called raz-sahra-site has been created. Its initial schema and the first administrator record have been applied to its default branch. Retrieve the database connection string from the Neon console and keep it secret. For production, prefer a least-privilege Postgres role rather than using the database owner role.

## Cloudflare Pages setup

1. Create or select a Cloudflare Pages project named razsahra and connect this GitHub repository.
2. Add repository secret CLOUDFLARE_API_TOKEN with Pages deployment permission and CLOUDFLARE_ACCOUNT_ID. Add repository variable SITE_URL with the real public HTTPS origin, including the trailing slash if desired.
3. In Cloudflare Pages production variables/secrets, set DATABASE_URL from Neon as an encrypted secret. Do not put it in frontend code or Git.
4. Run the manual GitHub Actions workflow named Deploy to Cloudflare Pages. Verify /api/health, then test registration, login/logout, admin permissions, content edits, and inquiry storage.
5. Attach the domain in Cloudflare Pages. Keep /api/* routed to Functions and reserve /madar/* for the Madar web app.

The deployment workflow is manual by design while Cloudflare credentials and the real domain are not configured; it does not interrupt the currently live GitHub Pages preview.

## Administrator account

The first administrator account is present in the new Neon database. Its initial login username and one-time password are included in the completion report. Save them in a password manager and change the password after the backend is deployed. No password or database URL has been stored in this repository.

## API routes

- POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout.
- GET /api/admin/overview — management dashboard metrics.
- GET/PUT /api/admin/pages — page metadata and JSON content configuration.
- GET/PUT /api/admin/articles — bilingual article content and publishing status.
- GET/PATCH /api/admin/users and PATCH /api/admin/users/role — account access management.
- GET/PATCH /api/admin/inquiries and PATCH /api/admin/inquiries/status — contact messages.
- GET/PUT /api/admin/apps — app catalogue, including the planned Madar entry.
- GET/PUT /api/admin/settings and GET /api/admin/audit.
- POST /api/inquiries — securely stores an inquiry in the database.
- GET /api/public/pages, /api/public/articles, /api/public/apps — public CMS APIs.

Content edits are stored in PostgreSQL. Public articles can be hydrated from published DB records when Pages Functions are deployed. Page metadata is editable in the CMS; the existing layout remains the visual source of truth for fixed homepage sections until each section is wired to CMS content keys.

## Migration

The data layer is plain PostgreSQL. Later, use pg_dump/restore to move data to another PostgreSQL host, set DATABASE_URL in the new runtime, and point the same domain to the new host. The current HTML front end does not need a framework migration just to move the database.

## Current limitations

- Email verification and password recovery are not enabled because no verified email/SMTP provider has been configured.
- Madar is registered as a planned app but is inactive until its actual web/PWA release bundle is supplied.
- The API is committed but not live on the current GitHub Pages URL; a Cloudflare deployment and DATABASE_URL secret are still required.
