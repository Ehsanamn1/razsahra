# Raz Sahra × Medar — Cross-Project Status

**Last reconciled:** 2026-10-21  
**Canonical architecture contract:** [docs/INTEGRATION_CONTRACT.md](./INTEGRATION_CONTRACT.md)  
**Status vocabulary:** planned, in_progress, blocked, implemented, tested, deployed, verified. A status must not be promoted without its evidence.

## Current repository and release pointers

| Item | Current evidence |
|---|---|
| Raz Sahra main | `7b6f8198ddec29d45e437441d8ca87fc2c13a865` |
| Medar main | `3856a65a553e365114269cb0be35242e62220472` |
| Medar source pin embedded in Raz Sahra | `426889daa35c5520b4572531f2866cfd26900931`, from `integration/medar-source.json` |
| Latest verified Raz Sahra Pages release | [Run 39641032144](https://github.com/Ehsanamn1/razsahra/actions/runs/39641032144), conclusion: success |
| Deployment URL reported by that run | [7f1ac571.razsahra.pages.dev](https://7f1ac571.razsahra.pages.dev/) |
| Medar Worker deploy for the pinned operational revision | [Run 39631181645](https://github.com/Ehsanamn1/simorgh/actions/runs/39631181645), conclusion: success |
| Medar CI for the pinned operational revision | [Run 39631181984](https://github.com/Ehsanamn1/simorgh/actions/runs/39631181984), conclusion: success |
| Canonical Medar integration-doc reference | [Medar PR #117](https://github.com/Ehsanamn1/simorgh/pull/117), merged at `3856a65a553e365114269cb0be35242e62220472` |

## Task register

| ID | Task | Owner | Status | Evidence / next action |
|---|---|---|---|---|
| INT-001 | Publish Medar at `/madar/`, support deep-link refresh, and proxy the operational API through the parent origin | Raz Sahra + Medar | verified | Run 39641032144 returned HTTP 200 for `/`, `/madar/`, and `/madar/app/home` at the canonical and unique deployment origins; both independent database-health probes passed. |
| INT-002 | Pin the embedded Medar source to an immutable reviewed commit in the parent build | Raz Sahra | verified | PR #5 merged. The production release used manifest pin `426889daa35c5520b4572531f2866cfd26900931`; generated-artifact verification of the combined parent/Medar version marker is included in the follow-up gate. |
| SEC-001 | Verify unauthenticated CMS administration is denied | Raz Sahra | verified | Run 39641032144 received HTTP 401 for unauthenticated GET `/api/admin/pages` at `razsahra.pages.dev` and the unique deployment origin. |
| REL-001 | Prevent PR validation from cancelling the production Pages release | Raz Sahra | tested | PR #5 changed concurrency groups to be PR-specific while main uses a separate non-cancelling production group; the workflow assertion passed in [PR check 39640043418](https://github.com/Ehsanamn1/razsahra/actions/runs/39640043418) and main release 39641032144 completed successfully. |
| PR-002 | Reconcile the older flagship-branding pull request | Raz Sahra | verified | [PR #2](https://github.com/Ehsanamn1/razsahra/pull/2) was closed without merging because it had diverged and duplicated the existing product section. The closing comment records the rationale. |
| DOC-001 | Keep Medar's deployment guide linked to the canonical integration contract | Medar | verified | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117) merged; the Medar guide links to Raz Sahra's canonical contract. |

## Confirmed limitations and safeguards

- The latest production run [39641032144](https://github.com/Ehsanamn1/razsahra/actions/runs/39641032144) independently verified public routes, CMS health, Medar upstream health, and HTTP 401 for unauthenticated CMS administration at both deployment origins.
- Automated smoke tests do not replace an authorized owner-session test for account provisioning and actual business workflows. No production test accounts should be created just to complete a report.
- No production database data, schema, member accounts, or secrets were changed while reconciling these integration issues.
- Public/demo compatibility URLs must not be used as proof of live operational business records.
- The current follow-up strengthens the bundle-marker assertion and refreshes these documents. Its own CI and post-merge live release must pass before claiming that additional gate is deployed and verified.

## Immediate next actions

1. Pass the PR validation for the combined parent/Medar version marker.
2. Verify the post-merge release and live smoke checks.
3. Complete an authorized owner-session test of member provisioning and the priority business workflows when an owner can safely perform it; do not ask for passwords in chat or manufacture production fixtures.
