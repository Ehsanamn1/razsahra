# Raz Sahra × Medar — Cross-Project Status

**Last reconciled:** 2026-10-21  
**Canonical architecture contract:** [docs/INTEGRATION_CONTRACT.md](./INTEGRATION_CONTRACT.md)  
**Status vocabulary:** planned, in_progress, blocked, implemented, tested, deployed, verified. A status must not be promoted without its evidence.

## Current repository and release pointers

| Item | Current evidence |
|---|---|
| Raz Sahra main release commit | `73f452ea20e06c892b021091a7e95f4d7662c2f5` |
| Medar main / integrated source pin | `6fa62e1826d8f4a3ebbd8ef137b043fecda646ab` |
| Canonical source-pin manifest | `integration/medar-source.json` |
| Latest verified Raz Sahra Pages release | [Run 39642992636](https://github.com/Ehsanamn1/razsahra/actions/runs/39642992636), conclusion: success |
| Unique deployment URL | [8c1c3e64.razsahra.pages.dev](https://8c1c3e64.razsahra.pages.dev/) |
| Medar Worker deployment for current pin | [Run 39641706299](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706299), conclusion: success |
| Medar main CI for current pin | [Run 39641706342](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706342), conclusion: success |
| Android build | [Run 39641706082](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706082), conclusion: success |
| iOS Simulator build | [Run 39641706298](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706298), conclusion: success |
| Canonical contract reference in Medar | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117), merged at `3856a65a553e365114269cb0be35242e62220472` |

## Task register

| ID | Task | Owner | Status | Evidence / next action |
|---|---|---|---|---|
| INT-001 | Publish Medar at `/madar/`, support deep-link refresh, and proxy the operational API through the parent origin | Raz Sahra + Medar | verified | Run 39642992636 returned HTTP 200 for `/`, `/madar/`, and `/madar/app/home` at the canonical and unique deployment origins; both independent database-health probes passed. |
| INT-002 | Pin the embedded Medar source to the latest verified operational revision | Raz Sahra | verified | PR #7 merged. Current manifest pin is `6fa62e1826d8f4a3ebbd8ef137b043fecda646ab`; run 39642992636 built the bundle, checked the combined `73f452ea20e06c892b021091a7e95f4d7662c2f5-6fa62e1826d8f4a3ebbd8ef137b043fecda646ab` marker, deployed it, and passed the live smoke test. |
| SEC-001 | Verify unauthenticated CMS administration is denied | Raz Sahra | verified | Run 39642992636 observed HTTP 401 for unauthenticated GET `/api/admin/pages` at `razsahra.pages.dev` and the unique deployment origin. |
| REL-001 | Prevent PR validation from cancelling the production Pages release | Raz Sahra | verified | PR #5 made pull-request concurrency PR-specific; the concurrency check passed and main release 39642992636 completed with conclusion success. |
| PR-002 | Reconcile the older flagship-branding pull request | Raz Sahra | verified | [PR #2](https://github.com/Ehsanamn1/razsahra/pull/2) was closed without merging because it was divergent and duplicated the current product section. |
| PR-097 | Reconcile stale member-provisioning/help UI implementation | Medar | verified | [PR #97](https://github.com/Ehsanamn1/simorgh/pull/97) was closed without merging because its branch was 111 commits ahead and 31 behind current main. Current main contains the normalized-username account insert, schema-generated-column fallback, profile completion endpoint, customer role, help guide, and tests; CI for current main ran those SQL and E2E checks. |
| DOC-001 | Keep Medar's deployment guide linked to the canonical integration contract | Medar | verified | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117) merged; the Medar guide links to this repository's canonical contract. |

## Confirmed limitations and safeguards

- The latest production run [39642992636](https://github.com/Ehsanamn1/razsahra/actions/runs/39642992636) verified the live routes, exact combined source marker, CMS health, Medar upstream health, and HTTP 401 for unauthenticated CMS administration at both origins.
- Medar CI [39641706342](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706342) passed the schema migration chain and exact member-provisioning SQL against disposable PostgreSQL test databases and ran desktop/mobile/auth/operations browser checks. These are not a substitute for an authorized owner-session test against the actual business workflow.
- Automated tests do not fully prove an actual owner can provision a real staff/supplier/driver/customer account and that the resulting user can log in with the intended permissions. That final owner-session validation remains unverified; it must be performed through the authorized owner interface. Do not create production fixture accounts or ask for account passwords in chat.
- No production schema, business data, member accounts, or secrets were changed by the integration and release fixes documented here.
- Public/demo compatibility URLs are not proof of live operational business records.

## Immediate next action

Complete one authorized end-to-end owner-session test of member provisioning and role permissions, without exposing credentials in chat or creating synthetic production data. The repository, deployment, routing, source pin, version marker, health probes, and unauthenticated CMS denial gates are now verified.
