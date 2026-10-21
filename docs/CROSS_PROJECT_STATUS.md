# Raz Sahra × Medar — Cross-Project Status

**Last reconciled:** 2026-10-21  
**Canonical architecture contract:** [docs/INTEGRATION_CONTRACT.md](./INTEGRATION_CONTRACT.md)  
**Status vocabulary:** planned, in_progress, blocked, implemented, tested, deployed, verified. A status must not be promoted without its evidence.

## Current repository and release pointers

| Item | Current evidence |
|---|---|
| Raz Sahra main | e0c603e237925acd546470341ff6755d30c80931 |
| Medar main / reviewed integrated bundle revision | 426889daa35c5520b4572531f2866cfd26900931 |
| Raz Sahra latest recorded Pages release | [Run 39635161486](https://github.com/Ehsanamn1/razsahra/actions/runs/39635161486), conclusion: success |
| Exact Raz Sahra deployment URL reported by that run | [680e57ec.razsahra.pages.dev](https://680e57ec.razsahra.pages.dev/) |
| Medar Worker deploy | [Run 39631181645](https://github.com/Ehsanamn1/simorgh/actions/runs/39631181645), conclusion: success |
| Medar main CI | [Run 39631181984](https://github.com/Ehsanamn1/simorgh/actions/runs/39631181984), conclusion: success |

## Task register

| ID | Task | Owner | Status | Evidence / next action |
|---|---|---|---|---|
| INT-001 | Publish Medar at /madar/, support deep-link refresh, and proxy the operational API through the parent origin | Raz Sahra + Medar | verified | Raz run 39635161486 returned HTTP 200 for /, /madar/, and /madar/app/home at the canonical and unique deployment origins; both database health probes passed. |
| MED-001 | Deploy the operational Worker and run authorization/browser smoke tests | Medar | verified | Worker run 39631181645 and CI run 39631181984 succeeded for commit 426889daa35c5520b4572531f2866cfd26900931. This is not a penetration test or proof of every role workflow. |
| INT-002 | Pin the embedded Medar source to an immutable reviewed commit in the parent build | Raz Sahra | implemented | Proposed in this change. It becomes tested only after the PR workflow passes, and deployed/verified only after merge and the new post-deploy run. |
| SEC-001 | Add a live negative smoke test proving unauthenticated CMS administration is denied | Raz Sahra | implemented | Proposed in this change. Expected status is HTTP 401 or 403 for /api/admin/pages; not yet live-verified by the new test. |
| PR-002 | Reconcile the older flagship-branding pull request with current main | Raz Sahra | blocked | [PR #2](https://github.com/Ehsanamn1/razsahra/pull/2) is 9 commits ahead and 31 behind current main, with divergent history and a false mergeable result. Its proposed additional product section overlaps the compact Medar product section already present in current main. Do not merge it as-is; after this release is accepted, close it with a note linking the replacement work or port only a specifically reviewed non-duplicate change. |

## Confirmed limitations and safeguards

- The latest cited production run checked the routes and independent API/database health. It did not yet run the new CMS admin-denial assertion; that gate is pending the change proposed here.
- Automated smoke tests do not replace a production owner-session test for member provisioning and real business workflows. Do not create a test account in production merely to complete this report.
- No production database data, schema, user accounts, or secrets were changed by the investigation that produced this status.
- Public/demo compatibility URLs must not be used as proof of live operational business records.
- The last recorded release evidence comes from GitHub Actions runner logs. Direct network probing from a separate restricted runtime can fail at DNS resolution; that is an observation about the probe environment, not proof the public service is down.

## Immediate next actions

1. Review and merge the source-pin and smoke-test change only after the pull-request workflow passes.
2. Verify the resulting Pages deployment and the new CMS authorization denial assertion in the post-merge workflow logs.
3. Reconcile/close stale PR #2 after the current-main replacement is reviewed.
4. Only then claim the new source pin and CMS authorization smoke test are deployed and verified.
