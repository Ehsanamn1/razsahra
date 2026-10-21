# Raz Sahra × Medar — Cross-Project Status

**Last reconciled:** 2026-10-21  
**Canonical architecture contract:** [docs/INTEGRATION_CONTRACT.md](./INTEGRATION_CONTRACT.md)  
**Status vocabulary:** planned, in_progress, blocked, implemented, tested, deployed, verified. A status must not be promoted without its evidence.

## Current repository and release pointers

| Item | Current evidence |
|---|---|
| Raz Sahra main | `7b6f8198ddec29d45e437441d8ca87fc2c13a865` |
| Medar main | `3856a65a553e365114269cb0be35242e62220472` |
| Medar source pin proposed for the next Raz Sahra release | `6fa62e1826d8f4a3ebbd8ef137b043fecda646ab`, from `integration/medar-source.json`; parent deployment pending this change |
| Latest verified Raz Sahra Pages release | [Run 39641856036](https://github.com/Ehsanamn1/razsahra/actions/runs/39641856036), conclusion: success |
| Deployment URL reported by that run | [5da63e20.razsahra.pages.dev](https://5da63e20.razsahra.pages.dev/) |
| Medar Worker deploy for the proposed next pin | [Run 39641706299](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706299), conclusion: success |
| Medar main CI for the proposed next pin | [Run 39641706342](https://github.com/Ehsanamn1/simorgh/actions/runs/39641706342), conclusion: success |
| Canonical Medar integration-doc reference | [Medar PR #117](https://github.com/Ehsanamn1/simorgh/pull/117), merged at `3856a65a553e365114269cb0be35242e62220472` |

## Task register

| ID | Task | Owner | Status | Evidence / next action |
|---|---|---|---|---|
| INT-001 | Publish Medar at `/madar/`, support deep-link refresh, and proxy the operational API through the parent origin | Raz Sahra + Medar | verified | Run 39641856036 returned HTTP 200 for `/`, `/madar/`, and `/madar/app/home` at the canonical and unique deployment origins; both independent database-health probes passed. |
| INT-002 | Pin the embedded Medar source to the latest verified operational revision | Raz Sahra | tested | Manifest proposes `6fa62e1826d8f4a3ebbd8ef137b043fecda646ab`. Medar CI, Worker deploy, Android, and iOS builds succeeded for this revision; the parent PR must build/verify the exact combined marker and its post-merge live smoke test must pass before this pin is considered deployed. |
| SEC-001 | Verify unauthenticated CMS administration is denied | Raz Sahra | verified | Run 39641856036 received HTTP 401 for unauthenticated GET `/api/admin/pages` at `razsahra.pages.dev` and the unique deployment origin. |
| REL-001 | Prevent PR validation from cancelling the production Pages release | Raz Sahra | tested | PR #5 changed concurrency groups to be PR-specific while main uses a separate non-cancelling production group; the workflow assertion passed in [PR check 39640043418](https://github.com/Ehsanamn1/razsahra/actions/runs/39640043418) and main release 39641032144 completed successfully. |
| PR-002 | Reconcile the older flagship-branding pull request | Raz Sahra | verified | [PR #2](https://github.com/Ehsanamn1/razsahra/pull/2) was closed without merging because it had diverged and duplicated the existing product section. The closing comment records the rationale. |
| DOC-001 | Keep Medar's deployment guide linked to the canonical integration contract | Medar | verified | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117) merged; the Medar guide links to Raz Sahra's canonical contract. |

## Confirmed limitations and safeguards

- The latest production run [39641856036](https://github.com/Ehsanamn1/razsahra/actions/runs/39641856036) independently verified public routes, CMS health, Medar upstream health, and HTTP 401 for unauthenticated CMS administration at both deployment origins. It still used the prior Medar source pin `426889daa35c5520b4572531f2866cfd26900931`.
- Automated smoke tests do not replace an authorized owner-session test for account provisioning and actual business workflows. No production test accounts should be created just to complete a report.
- No production database data, schema, member accounts, or secrets were changed while reconciling these integration issues.
- Public/demo compatibility URLs must not be used as proof of live operational business records.
- The current follow-up strengthens the bundle-marker assertion and refreshes these documents. Its own CI and post-merge live release must pass before claiming that additional gate is deployed and verified.

## Immediate next actions

1. Pass parent PR CI while building the newly pinned Medar revision.
2. Verify the post-merge Pages release, combined version marker, route health, database health, and CMS access-denial smoke test.
3. Complete an authorized owner-session test of member provisioning and priority business workflows when an owner can safely perform it; do not ask for passwords in chat or manufacture production fixtures.
