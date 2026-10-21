# Raz Sahra × Medar — Cross-Project Status

**Last reconciled:** 2026-10-21  
**Canonical architecture contract:** [docs/INTEGRATION_CONTRACT.md](./INTEGRATION_CONTRACT.md)  
**Status vocabulary:** planned, in_progress, blocked, implemented, tested, deployed, verified. A status must not be promoted without its evidence.

## Current repository and release pointers

| Item | Current evidence |
|---|---|
| Raz Sahra main | `dcfb31ecfb453feace85b1795bacd78a1903b709` |
| Medar main / reviewed integrated bundle revision | 426889daa35c5520b4572531f2866cfd26900931 |
| Raz Sahra latest recorded Pages release | [Run 39637808854](https://github.com/Ehsanamn1/razsahra/actions/runs/39637808854), conclusion: success |
| Exact Raz Sahra deployment URL reported by that run | [ff0d1414.razsahra.pages.dev](https://ff0d1414.razsahra.pages.dev/) |
| Medar Worker deploy | [Run 39631181645](https://github.com/Ehsanamn1/simorgh/actions/runs/39631181645), conclusion: success |
| Medar main CI | [Run 39631181984](https://github.com/Ehsanamn1/simorgh/actions/runs/39631181984), conclusion: success |

## Task register

| ID | Task | Owner | Status | Evidence / next action |
|---|---|---|---|---|
| INT-001 | Publish Medar at /madar/, support deep-link refresh, and proxy the operational API through the parent origin | Raz Sahra + Medar | verified | Raz run 39635161486 returned HTTP 200 for /, /madar/, and /madar/app/home at the canonical and unique deployment origins; both database health probes passed. |
| MED-001 | Deploy the operational Worker and run authorization/browser smoke tests | Medar | verified | Worker run 39631181645 and CI run 39631181984 succeeded for commit 426889daa35c5520b4572531f2866cfd26900931. This is not a penetration test or proof of every role workflow. |
| INT-002 | Pin the embedded Medar source to an immutable reviewed commit in the parent build | Raz Sahra | verified | PR #3 merged; the Pages build checked out Medar commit `426889daa35c5520b4572531f2866cfd26900931`; live release run 39637808854 succeeded. |
| SEC-001 | Add a live negative smoke test proving unauthenticated CMS administration is denied | Raz Sahra | verified | Live release run 39637808854 observed HTTP 401 for an unauthenticated GET to `/api/admin/pages` at both `razsahra.pages.dev` and the unique deployment origin. |
| PR-002 | Reconcile the older flagship-branding pull request with current main | Raz Sahra | verified | [PR #2](https://github.com/Ehsanamn1/razsahra/pull/2) was closed without merging after current main was verified; it was 9 commits ahead and 31 behind and duplicated the existing compact product section. The rationale and replacement release evidence are recorded in its closing comment. |

## Confirmed limitations and safeguards

- The latest production run [39637808854](https://github.com/Ehsanamn1/razsahra/actions/runs/39637808854) verified the homepage entry point, `/madar/`, `/madar/app/home`, both independent database health checks, and HTTP 401 for unauthenticated CMS administration at both deployment origins.
- Automated smoke tests do not replace a production owner-session test for member provisioning and real business workflows. Do not create a test account in production merely to complete this report.
- No production database data, schema, user accounts, or secrets were changed by the investigation that produced this status.
- Public/demo compatibility URLs must not be used as proof of live operational business records.
- The last recorded release evidence comes from GitHub Actions runner logs. Direct network probing from a separate restricted runtime can fail at DNS resolution; that is an observation about the probe environment, not proof the public service is down.

## Immediate next actions

1. Review the documentation-only Medar summary PR #117 and merge it if its checks and diff remain clean.
2. Perform an authorized real owner-session test of account provisioning and the priority business workflows when an owner can safely do so; do not create test accounts in production merely for a smoke test.
3. Keep the integration contract and status register current with each release.
