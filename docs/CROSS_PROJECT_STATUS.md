# Raz Sahra × Medar — Cross-Project Status

**Last reconciled:** 2026-10-21  
**Canonical architecture contract:** [docs/INTEGRATION_CONTRACT.md](./INTEGRATION_CONTRACT.md)  
**Status vocabulary:** planned, in_progress, blocked, implemented, tested, deployed, verified. A status must not be promoted without its evidence.

## Current repository and release pointers

| Item | Current evidence |
|---|---|
| Current Raz Sahra main release commit | `908b34d73ae6830e4013533e733641cd204cedb4` |
| Current Medar main and integrated source pin | `70329106d6cd921e1c036714157986b72e0ea201` |
| Canonical source-pin manifest | `integration/medar-source.json` |
| Latest verified Raz Sahra Pages release | [Run 39654966982](https://github.com/Ehsanamn1/razsahra/actions/runs/39654966982), conclusion: success |
| Unique deployment URL | [4f4b5b9a.razsahra.pages.dev](https://4f4b5b9a.razsahra.pages.dev/) |
| Medar Worker deployment and live security smoke | [Run 39653283449](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283449), conclusion: success |
| Medar main CI | [Run 39653283320](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283320), conclusion: success |
| Android build | [Run 39653283373](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283373), conclusion: success |
| iOS Simulator build | [Run 39653283318](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283318), conclusion: success |
| Complete Medar source archive | [Run 39653283462](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283462), conclusion: success |
| Canonical contract reference in Medar | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117), merged at `3856a65a553e365114269cb0be35242e62220472` |

## Task register

| ID | Task | Owner | Status | Evidence / next action |
|---|---|---|---|---|
| INT-001 | Publish Medar at `/madar/`, support deep-link refresh, and proxy the operational API through the parent origin | Raz Sahra + Medar | verified | Parent release 39654966982 returned HTTP 200 for `/`, `/madar/`, and `/madar/app/home` at the canonical and unique deployment origins; CMS and upstream Medar database-health probes passed. |
| INT-002 | Pin the embedded Medar source to the latest verified operational revision | Raz Sahra | verified | PR [#9](https://github.com/Ehsanamn1/razsahra/pull/9) merged. Manifest pins `70329106d6cd921e1c036714157986b72e0ea201`. Parent build log for run 39654966982 confirmed `PARENT_SOURCE_SHA=908b34d73ae6830e4013533e733641cd204cedb4` and `MEDAR_SOURCE_SHA=70329106d6cd921e1c036714157986b72e0ea201`; the combined marker was found in generated JS, then deployment and live smoke tests passed. |
| SEC-001 | Verify unauthenticated CMS administration is denied | Raz Sahra | verified | Run 39654966982 received HTTP 401 for unauthenticated GET `/api/admin/pages` at both `razsahra.pages.dev` and `4f4b5b9a.razsahra.pages.dev`. |
| MED-SEC-001 | Keep the operational Worker separated from public demo mode | Medar | verified | Run 39653283449 confirmed health response `service: "medar-ops"`, `database: true`, username/password auth; public signup and invite signup were denied, unauthorized workspace access was rejected, hostile-origin mutations returned 403, native credentialed CORS preflights passed, and public `medar-api` remained read-only and redirected to operational Medar. |
| MED-OPS-001 | Keep order/account administration limited to operational roles | Medar | verified | PR [#123](https://github.com/Ehsanamn1/simorgh/pull/123) merged to `70329106d6cd921e1c036714157986b72e0ea201`; new roles are admin/staff/supplier/driver only, customer-commerce routes are hidden, and the API blocks customer-authored orders/order items while retaining legacy customer data for scoped read compatibility. Main CI [39653283320](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283320) and Worker release [39653283449](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283449) passed. |
| REL-001 | Prevent PR validation from cancelling the production Pages release | Raz Sahra | verified | PR #5 made pull-request concurrency PR-specific; its assertion passed and the current main release 39654966982 completed successfully. |
| PR-002 | Reconcile the older flagship-branding pull request | Raz Sahra | verified | [PR #2](https://github.com/Ehsanamn1/razsahra/pull/2) was closed without merging because it was divergent and duplicated the current product section. |
| PR-097 | Reconcile stale member-provisioning/help UI implementation | Medar | verified | [PR #97](https://github.com/Ehsanamn1/simorgh/pull/97) was closed without merging because its branch was 111 commits ahead and 31 behind current main; the intended help/member behavior already existed on current main. |
| DOC-001 | Keep Medar's deployment guide linked to the canonical integration contract | Medar | verified | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117) merged; Medar's deployment guide links to this canonical contract. |

## Confirmed limitations and safeguards

- The latest parent release [39654966982](https://github.com/Ehsanamn1/razsahra/actions/runs/39654966982) verified the exact parent/Medar source marker, HTTP 200 for the root and Medar routes/deep link at both origins, CMS database health, Medar upstream health, and HTTP 401 for unauthenticated CMS administration.
- Medar main CI [39653283320](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283320) and live deployment [39653283449](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283449) passed the PostgreSQL migration/account SQL checks, desktop/mobile operational and public-demo browser suites, live runtime-mode identity, database health, signup denial, route protection, CORS, and public-demo redirect.
- Automated tests still do not fully prove a real authorized owner can provision a real staff/supplier/driver account and that each resulting user can log in with the intended permissions. That final owner-session acceptance remains unverified; complete it through the authorized owner interface. Do not create production fixture accounts or expose passwords in chat.
- Web Push credentials are configured and secret presence is checked at deployment, but an authorized signed-in owner session has not yet verified the live `/api/push/config` response with a real company session. Do not claim push-delivery acceptance until that session-gated check is completed.
- No data was migrated from the legacy application database into Medar as part of these integration changes. No production CMS business records or Medar member/account rows were intentionally changed by the pin update. Medar-owned auth and operational data remain isolated from Raz Sahra CMS.
- Public/demo URLs and seeded example records are not proof of live operational business records.

## Immediate next actions

1. Complete an authorized owner-session test for member provisioning and each operational role's permissions, without exposing credentials or creating synthetic production fixtures.
2. Verify the authenticated `/api/push/config` response in an authorized owner session before describing Web Push as acceptance-tested.
3. Reassess commercial pilot gates after the real owner-session workflows and any required storage/data-migration checks are completed.
