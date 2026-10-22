# HostMizbanFa readiness automation

Workflow: `.github/workflows/hostmizbanfa-preflight.yml`

This workflow is prepared for the day hosting is purchased. It is manually triggered and **non-destructive**: it verifies SSH access, host key validation, Node.js 20+, npm, required archive/sync/HTTP utilities, and a writable application root. It does not deploy the current staging-only package and does not touch the database.

## GitHub configuration after buying compatible hosting

Repository **Settings → Secrets and variables → Actions**:

Secrets:
- `HOST_SSH_HOST`: real SSH host name or IP.
- `HOST_SSH_PORT`: SSH port confirmed by the host.
- `HOST_SSH_USER`: dedicated deployment user.
- `HOST_SSH_PRIVATE_KEY`: private key for that user; never commit it.
- `HOST_SSH_KNOWN_HOSTS`: verified host-key line, checked against the provider's official fingerprint.

Variable:
- `HOST_APP_DIR`: absolute application root writable by the deployment user.

Then open Actions → **HostMizbanFa connection preflight** → Run workflow. It will report missing configuration immediately or validate the actual host without changing application files or database.

## Production deployment is intentionally gated

The current host ZIP artifact is explicitly a **staging baseline**, not an approved standalone production release. A production deployment workflow must not consume it until the Node/MySQL backend and Medar API integration have passed parity and acceptance tests. After that, deployment automation should back up the existing release, preserve host-managed secrets, install production dependencies, use the host-confirmed restart method, check the real HTTPS health endpoint, and provide rollback. Database migrations and admin bootstrap must remain separate, explicit operations.

Host-dependent behavior cannot be truthfully marked tested until the host exists. Medar's operational API still uses the configured upstream Cloudflare Worker unless its backend is separately migrated.
