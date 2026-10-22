# HostMizbanFa release gate

## Current state

This repository has a staging workflow for the combined Raz Sahara website and Madar web frontend. The staging package includes the Node.js/MySQL CMS baseline and proxies Madar API requests to the existing operational Medar Worker.

**This is not a standalone production release.** The Madar operational API has not been ported to Node.js/MySQL. Do not describe deployment as complete until the target-host acceptance checklist below passes.

## Before deployment

1. Confirm the HostMizbanFa plan supports a persistent Node.js 20+ application, the required start command, environment variables, and MySQL access from the application.
2. Configure secrets only in the hosting control panel: database credentials and a long random `ADMIN_BOOTSTRAP_SECRET`. Never commit them.
3. Set `MEDAR_API_ORIGIN` to the verified operational Medar API origin.
4. Run the GitHub Actions workflow **Build domestic host bundle (staging)** and download the artifact named `raz-sahra-host-package-staging`. Confirm the run is successful and the artifact exists before using it.
5. Run the host preflight workflow after the SSH host, port, user, private key, pinned known-hosts entry, and absolute app directory are configured. Verify the SSH host key with the hosting provider; do not disable strict host-key checking.

## Target-host acceptance checklist

- [ ] `GET /api/health` returns `ok: true` and `database: "connected"`.
- [ ] First administrator bootstrap succeeds once; a second attempt is rejected.
- [ ] Administrator login/logout and session invalidation work.
- [ ] Non-admin accounts are denied access to admin APIs.
- [ ] CMS edits and contact inquiries persist in MySQL after application restart.
- [ ] `/madar/` and a deep link such as `/madar/app/home` load after refresh.
- [ ] Same-origin `/api/medar/*` proxy works and authenticated Madar operations are tested.
- [ ] HTTPS, cookie security, logs, restart behavior, and backup/restore are verified on the real domain.
- [ ] Remove `ADMIN_BOOTSTRAP_SECRET` immediately after the initial administrator is provisioned.

## Remaining external dependency

The real HostMizbanFa account and domain are not accessible to CI. Therefore the actual Node application configuration, DNS/HTTPS, and end-to-end acceptance must be verified on the purchased account. The Madar backend remains hosted on the existing operational Worker until a separately tested migration is completed.
