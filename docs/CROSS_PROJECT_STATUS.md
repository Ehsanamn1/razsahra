# Raz Sahra × Medar — Cross-Project Status

**Last reconciled:** 2026-10-22  
**Canonical architecture contract:** [docs/INTEGRATION_CONTRACT.md](./INTEGRATION_CONTRACT.md)  
**Status vocabulary:** planned, in_progress, blocked, implemented, tested, deployed, verified. A status must not be promoted without its evidence.

## Current repository and release pointers

| Item | Current evidence |
|---|---|
| Current Raz Sahra main release commit | `49b773d10bb142bd4c9df0cd82127d250a971236` |
| Current Medar main commit | `1c00cb216d73137ff5c254648d96f5be5ee38acf` (latest main CI passed; latest Worker runtime deployment is from `e079388eb4e682d1d94d6d70f72d8ed9c25d97af`) |
| Integrated Medar app-source pin | `70329106d6cd921e1c036714157986b72e0ea201` |
| Canonical source-pin manifest | `integration/medar-source.json` |
| Latest verified Raz Sahra Pages release | [Run 39659265140](https://github.com/Ehsanamn1/razsahra/actions/runs/39659265140), conclusion: success |
| Unique deployment URL | [aa192a68.razsahra.pages.dev](https://aa192a68.razsahra.pages.dev/) |
| Latest completed Medar Worker deployment and live security smoke | [Run 39662243920](https://github.com/Ehsanamn1/simorgh/actions/runs/39662243920), conclusion: success; deployed source `e079388eb4e682d1d94d6d70f72d8ed9c25d97af` |
| Current Medar main CI | [Run 39667115382](https://github.com/Ehsanamn1/simorgh/actions/runs/39667115382), conclusion: success |
| Latest completed Android build | [Run 39662243787](https://github.com/Ehsanamn1/simorgh/actions/runs/39662243787), conclusion: success; exact current-main Android run `39667115414` was still in progress at reconciliation |
| iOS Simulator build | [Run 39667115477](https://github.com/Ehsanamn1/simorgh/actions/runs/39667115477), conclusion: success |
| Complete Medar source archive | [Run 39667115205](https://github.com/Ehsanamn1/simorgh/actions/runs/39667115205), conclusion: success |
| Canonical contract reference in Medar | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117), merged at `3856a65a553e365114269cb0be35242e62220472` |

## Domestic hosting workstream — 2026-10-22

- **Raz Sahra branch:** `feat/mysql-domestic-hosting`, current validated commit `b646d1d9072d18f62a250610f3adcc968d8b600d`. Domestic CI run [39775602761](https://github.com/Ehsanamn1/razsahra/actions/runs/39775602761) passed. It checks local image integrity, MySQL 8.4 schema, CMS API integration, Node HTTP static/deep-link behavior and the static build. The paired Pages workflow [39775602907](https://github.com/Ehsanamn1/razsahra/actions/runs/39775602907) passed build/validation, but actual Cloudflare deployment and live smoke tests were **skipped** because this was a feature branch and deployment gates were not satisfied.
- **Raz Sahra visuals/performance:** the hero now uses four local SVG illustrations for supply, chain, capacity and partnership; collaboration/insight cards use local illustrations rather than remote image hosts. Remote Google Fonts and external image dependencies were removed from the page shell. Carousel timers pause outside the viewport. The image-integrity check rejects the previously used external image hosts.
- **Raz Sahra domestic CMS:** a separate Node/MySQL CMS handler and static server are present under `server/`. MySQL 8.4 CI integration tests cover one-time bootstrap and replay rejection, sessions/logout, admin overview, page/article/app/settings writes, inquiry status, registration and public listing. The Cloudflare Pages Function remains the existing Neon/PostgreSQL runtime; no production switch has occurred.
- **Madar branch:** `feat/mysql-domestic-hosting`. The first MySQL identity/tenant foundation migration and guarded idempotent staging runner have passed CI in prior runs. The latest foundation test has been strengthened to verify one-owner-per-company while allowing one user to own multiple companies, plus one pending access request per company/user. The newest CI run is still queued/in progress at the time of this reconciliation.
- **Madar mobile/performance:** the quick-access cards are compact and two-column on phones, the persistent compositor-layer hint was removed to avoid excess memory use, Google Fonts dependencies were removed, and fleet polling now pauses while the page is hidden and runs less often on narrow screens without overlapping slow requests.
- **Release blockers:** the complete 31-migration Madar operational schema/API is **not** ported to MySQL; only the initial identity/tenant foundation exists. No production data import, HostMizbanFa deployment, backup restore drill or traffic cutover has happened. Hosting credentials, exact MySQL connection details, Node process manager and HTTPS/domain routing are not available in this repository context. Keep both existing production services intact.

## Task register

| ID | Task | Owner | Status | Evidence / next action |
|---|---|---|---|---|
| INT-001 | Publish Medar at `/madar/`, support deep-link refresh, and proxy the operational API through the parent origin | Raz Sahra + Medar | verified | Parent release 39659265140 returned HTTP 200 for `/`, `/madar/`, and `/madar/app/home` at `razsahra.pages.dev` and `aa192a68.razsahra.pages.dev`; CMS and upstream Medar health probes passed. |
| INT-002 | Pin the embedded Medar source to the latest verified operational revision | Raz Sahra | verified | PR [#9](https://github.com/Ehsanamn1/razsahra/pull/9) merged. Manifest pins `70329106d6cd921e1c036714157986b72e0ea201`. Parent build log for run 39659265140 confirmed `PARENT_SOURCE_SHA=49b773d10bb142bd4c9df0cd82127d250a971236` and `MEDAR_SOURCE_SHA=70329106d6cd921e1c036714157986b72e0ea201`; the exact combined marker was present in generated JS and deployment/live smoke tests passed. |
| SEC-001 | Verify unauthenticated CMS administration is denied | Raz Sahra | verified | Run 39659265140 received HTTP 401 for unauthenticated GET `/api/admin/pages` at both `razsahra.pages.dev` and `aa192a68.razsahra.pages.dev`. |
| MED-SEC-001 | Keep the operational Worker separated from public demo mode | Medar | verified | Run 39653283449 confirmed health response `service: "medar-ops"`, `database: true`, username/password auth; public signup and invite signup were denied, unauthorized workspace access was rejected, hostile-origin mutations returned 403, native credentialed CORS preflights passed, and public `medar-api` remained read-only and redirected to operational Medar. |
| MED-OPS-001 | Keep order/account administration limited to operational roles | Medar | verified | PR [#123](https://github.com/Ehsanamn1/simorgh/pull/123) merged to `70329106d6cd921e1c036714157986b72e0ea201`; new roles are admin/staff/supplier/driver only, customer-commerce routes are hidden, and the API blocks customer-authored orders/order items while retaining legacy customer data for scoped read compatibility. Main CI [39653283320](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283320) and Worker release [39653283449](https://github.com/Ehsanamn1/simorgh/actions/runs/39653283449) passed. |
| REL-001 | Prevent PR validation from cancelling the production Pages release | Raz Sahra | verified | PR #5 made pull-request concurrency PR-specific; its assertion passed and main Pages release 39659265140 completed successfully. |
| PR-002 | Reconcile the older flagship-branding pull request | Raz Sahra | verified | [PR #2](https://github.com/Ehsanamn1/razsahra/pull/2) was closed without merging because it was divergent and duplicated the current product section. |
| PR-097 | Reconcile stale member-provisioning/help UI implementation | Medar | verified | [PR #97](https://github.com/Ehsanamn1/simorgh/pull/97) was closed without merging because its branch was 111 commits ahead and 31 behind current main; the intended help/member behavior already existed on current main. |
| DOC-001 | Keep Medar's deployment guide linked to the canonical integration contract | Medar | verified | [PR #117](https://github.com/Ehsanamn1/simorgh/pull/117) merged; Medar's deployment guide links to this canonical contract. |
| DOM-001 | Build a separate Node/MySQL CMS runtime for Raz Sahra | Raz Sahra | tested (staging CI) | Node HTTP + CMS API integration passed on disposable MySQL 8.4; production cutover remains blocked on full Madar port and host verification. |
| DOM-002 | Port Madar operational API and all 31 PostgreSQL migrations to MySQL | Madar | in_progress | Only `worker/migrations/mysql/0001_foundation.sql` exists; do not treat the foundation as a complete operational database. |
| UX-001 | Replace broken Raz Sahra slide imagery and remove remote image/font dependencies | Raz Sahra | tested (build/CI) | Four local SVG hero illustrations, local collaboration/insight artwork, image integrity check and static build passed in run 39775602761. |
| UX-002 | Compact Madar mobile quick-access cards and reduce hidden-page fleet polling | Madar | in_progress | Changes are on `feat/mysql-domestic-hosting`; newest domestic CI is queued and must pass before marking tested. |
| HOST-001 | Deploy combined Raz Sahra + Madar to HostMizbanFa with verified rollback | Shared | blocked | No verified host access/process-manager details or deployment secrets; Madar's MySQL operational port is incomplete. |


## Confirmed limitations and safeguards

- The latest parent release [39659265140](https://github.com/Ehsanamn1/razsahra/actions/runs/39659265140) verified the exact parent/Medar source marker, HTTP 200 for the homepage and Medar routes/deep link at both origins, CMS and upstream Medar database health, and HTTP 401 for unauthenticated CMS administration.
- Current main CI [39667115382](https://github.com/Ehsanamn1/simorgh/actions/runs/39667115382) passed; the latest completed operational Worker deployment [39662243920](https://github.com/Ehsanamn1/simorgh/actions/runs/39662243920) passed runtime-mode, database health, signup/invitation denial, route protection, CORS, anonymous Push/private-file denial, and public-demo redirect. Changes after the embedded app-source pin have been workflow/documentation/test changes; no app runtime changes were introduced by those commits.
- Automated tests still do not fully prove a real authorized owner can provision a real staff/supplier/driver account and that each resulting user can log in with the intended permissions. That final owner-session acceptance remains unverified; complete it through the authorized owner interface. Do not create production fixture accounts or expose passwords in chat.
- Web Push credentials are configured and secret presence is checked at deployment, but an authorized signed-in owner session has not yet verified the live `/api/push/config` response with a real company session. Do not claim push-delivery acceptance until that session-gated check is completed.
- No data was migrated from the legacy application database into Medar as part of these integration changes. No production CMS business records or Medar member/account rows were intentionally changed by the pin update. Medar-owned auth and operational data remain isolated from Raz Sahra CMS.
- Public/demo URLs and seeded example records are not proof of live operational business records.

## Immediate next actions

1. Complete an authorized owner-session test for member provisioning and each operational role's permissions, without exposing credentials or creating synthetic production fixtures.
2. Verify the authenticated `/api/push/config` response in an authorized owner session before describing Web Push as acceptance-tested.
3. Reassess commercial pilot gates after the real owner-session workflows and any required storage/data-migration checks are completed.
