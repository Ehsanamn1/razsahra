# Raz Sahra × Medar — Cross-Project Status

**Last reconciled:** 2026-10-21  
**Canonical architecture contract:** [docs/INTEGRATION_CONTRACT.md](./INTEGRATION_CONTRACT.md)  
**Status vocabulary:** planned, in_progress, blocked, implemented, tested, deployed, verified. A status must not be promoted without its evidence.

## Current repository and release pointers

| Item | Current evidence |
|---|---|
| Raz Sahra main at the start of this pin update | `ce18fbad7f32655ecc92ef36bc71c1cbe92457d1` |
| Latest Medar main and verified operational release | `70329106d6cd921e1c036714157986b72e0ea201` |
| Proposed embedded Medar pin in this change | `70329106d6cd921e1c036714157986b72e0ea201` in `integration/medar-source.json`; the parent release is still pending |
| Last verified Raz Sahra Pages release | [Run 39642992636](https://github.com/Ehsanamn1/razsahra/actions/runs/39642992636), conclusion: success |
| Last verified parent deployment URL | [8c1c3e64.razsahra.pages.dev](https://8c1c3e64.razsahra.pages.dev/) |
| Current Medar Worker deployment and live smoke tests | [Run 39653283449](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283449), conclusion: success |
| Current Medar main CI | [Run 39653283320](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283320), conclusion: success |
| Android build for the current Medar pin | [Run 39653283373](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283373), conclusion: success |
| iOS Simulator build for the current Medar pin | [Run 39653283318](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283318), conclusion: success |
| Complete Medar source archive | [Run 39653283462](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283462), conclusion: success |
| Canonical contract reference in Medar | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117), merged at `3856a65a553e365114269cb0be35242e62220472` |

## Task register

| ID | Task | Owner | Status | Evidence / next action |
|---|---|---|---|---|
| INT-001 | Publish Medar at `/madar/`, support deep-link refresh, and proxy the operational API through the parent origin | Raz Sahra + Medar | verified for the previous pin | Run 39642992636 returned HTTP 200 for `/`, `/madar/`, and `/madar/app/home` at the canonical and unique deployment origins; both database-health probes passed. This run embedded the older Medar pin `6fa62e1826d8f4a3ebbd8ef137b043fecda646ab`; re-run parent smoke after this pin update. |
| INT-002 | Pin the embedded Medar source to the latest verified operational revision | Raz Sahra | tested; parent deploy pending | This change sets the manifest to `70329106d6cd921e1c036714157986b72e0ea201`. Medar CI, Worker release/live auth smoke, Android, and iOS all passed for the exact revision. Parent CI must find the combined `ce18fbad7f32655ecc92ef36bc71c1cbe92457d1-70329106d6cd921e1c036714157986b72e0ea201` marker in the built JS; only the post-merge live Pages smoke can promote this to verified. |
| SEC-001 | Verify unauthenticated CMS administration is denied | Raz Sahra | verified for the previous parent release | Run 39642992636 observed HTTP 401 for unauthenticated GET `/api/admin/pages` at `razsahra.pages.dev` and the unique deployment origin. Reconfirm in the parent deployment triggered by this pin update. |
| MED-SEC-001 | Keep the operational Worker separated from public demo mode | Medar | verified | Run 39653283449 confirmed `service: "medar-ops"`, `database: true`, username/password authentication, public signup/invite signup disabled, unauthorized workspace denial, hostile-origin mutation rejection, native credentialed CORS preflights, and a public demo redirect to operational Medar. |
| MED-OPS-001 | Keep order/account administration limited to operational roles | Medar | verified in main | PR [#123](https://github.com/Ehsanamn1/simorgh/pull/123) merged to commit `70329106d6cd921e1c036714157986b72e0ea201`; the accepted code restricts new roles to admin/staff/supplier/driver, hides customer-commerce routes, blocks customer order and order-item creation, and preserves legacy data rather than deleting it. Main CI [39653283320](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283320) and release [39653283449](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283449) passed. |
| REL-001 | Prevent PR validation from cancelling the production Pages release | Raz Sahra | verified | PR #5 made pull-request concurrency PR-specific; the concurrency check passed and main release 39641032144 completed successfully. |
| PR-002 | Reconcile the older flagship-branding pull request | Raz Sahra | verified | [PR #2](https://github.com/Ehsanamn1/razsahra/pull/2) was closed without merging because it was divergent and duplicated the current product section. |
| PR-097 | Reconcile stale member-provisioning/help UI implementation | Medar | verified | [PR #97](https://github.com/Ehsanamn1/simorgh/pull/97) was closed without merging because it was 111 commits ahead and 31 behind current main; intended help/member behaviors already existed on current main. |
| DOC-001 | Keep Medar's deployment guide linked to the canonical integration contract | Medar | verified | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117) merged; the Medar guide links to this repository's canonical contract. |

## Confirmed limitations and safeguards

- The last parent release [39642992636](https://github.com/Ehsanamn1/razsahra/actions/runs/39642992636) verified routes, the combined marker for the old pin, CMS health, upstream Medar health, and HTTP 401 for unauthenticated CMS administration at both origins. It does **not** prove the new pin is live in Raz Sahra.
- Medar CI [39653283320](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283320) and live deployment [39653283449](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283449) passed the clean PostgreSQL migration/account SQL checks, desktop/mobile operational and demo browser suites, live runtime-mode identity, database health, signup denial, route protection, CORS, and public-demo redirect.
- The customer account/order boundary is now enforced in the API as well as in navigation: new accounts are limited to operational roles and customer memberships cannot create order/order-item records or submit/cancel an order. Historical customer records/memberships are retained for scoped read compatibility.
- Automated tests still do not fully prove a real owner can provision a real staff/supplier/driver account and then log in with intended permissions. That final owner-session acceptance remains unverified; it must be done via the authorized owner interface. Do not create production fixture accounts or expose passwords in chat.
- Web Push credentials are configured and secret presence is checked by the Worker release, but a signed-in owner session has not yet confirmed the live `/api/push/config` response through a real authorized account. Do not claim push delivery acceptance until that session-gated check is performed.
- No production schema, business data, member accounts, or secrets were changed by the source-pin/docs update. Medar release migrations were versioned and CI verified; the parent CMS database remains isolated from Medar operational data.
- Public/demo URLs and seeded example records are not proof of live operational business records.

## Immediate next actions

1. Pass parent PR CI with the new source pin and verify the combined parent/Medar commit marker in the generated JS.
2. Verify the post-merge Pages release and live route, deep-link, CMS health, upstream health, and unauthenticated CMS-admin denial smoke checks.
3. After the parent release succeeds, update this register with the exact parent release commit, run ID, unique deployment URL, and marker.
4. Complete an authorized owner-session test for member provisioning/role permissions and the authenticated Web Push config endpoint; do not create synthetic production fixtures.
