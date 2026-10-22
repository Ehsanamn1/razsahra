# HostMizbanFa release automation

Workflow: `.github/workflows/deploy-hostmizbanfa.yml`

This is a prepared, manual, guarded deployment workflow. It does not run on every push and cannot deploy until a real host is configured. It downloads the prepared `raz-sahra-host-package-staging` artifact from a successful GitHub Actions run, validates the archive, checks SSH and Node.js, backs up the target directory, uploads the package, installs production dependencies, requests a Passenger-style restart, and checks the HTTPS health endpoint. If health fails, it attempts to restore the previous files.

## GitHub configuration after buying compatible hosting

Repository **Settings → Secrets and variables → Actions**:

Secrets:
- `HOST_SSH_HOST`: real SSH host name or IP from the host.
- `HOST_SSH_PORT`: SSH port, usually 22 only if the host confirms it.
- `HOST_SSH_USER`: dedicated deployment user.
- `HOST_SSH_PRIVATE_KEY`: private key for that user; never commit it.
- `HOST_SSH_KNOWN_HOSTS`: verified host-key line supplied/verified using the host's official fingerprint. Do not blindly trust a newly scanned key.

Variables:
- `HOST_APP_DIR`: absolute application root, writable by the deployment user.
- `HOST_HEALTH_URL`: HTTPS URL for the Node app's `/api/health`.

The host must confirm Node.js >=20, npm, SSH, `unzip`, `rsync`, writable application root, outgoing HTTPS, MySQL credentials via environment variables, and that touching `tmp/restart.txt` restarts the application. If its documented restart mechanism differs, change and test the workflow before production use.

## Run

1. Identify a successful CI run that uploaded artifact `raz-sahra-host-package-staging`.
2. Open Actions → **HostMizbanFa manual deployment** → Run workflow.
3. Enter that run ID and type exactly `DEPLOY`.
4. Review the job output and verify the public site and application flows.

## Safety boundaries

- The workflow intentionally does not run database schema installation or bootstrap an admin account automatically.
- `.env` is excluded from sync and must be managed in the hosting control panel or the host's secure environment mechanism.
- A timestamped backup is retained on the host. Rollback is file-based and does not reverse database migrations.
- The workflow is not considered production-ready until tested on the actual host. It is not possible to validate credentials, restart behavior, filesystem permissions, or the real health endpoint before hosting exists.
- Medar's operational API still uses the configured upstream Cloudflare Worker unless its backend is separately migrated.
