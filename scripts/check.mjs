import { readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
const read = (file) => readFile(file, "utf8");
const html = await read("index.html");
const api = await read("functions/api/[[path]].js");
const schema = await read("db/schema.sql");
const css = await read("assets/raz-sahra-premium.css");
const interactive = await read("assets/raz-sahra-interactions.js");
const cmsRuntime = await read("assets/raz-sahra-cms-runtime.js");
const headers = await read("_headers");
const cloudflareWorkflow = await read(".github/workflows/pages.yml");
const medarSourcePin = JSON.parse(await read("integration/medar-source.json"));
const madarRouteFallback = await read("functions/madar/[[path]].js");
const integrationContract = await read("docs/INTEGRATION_CONTRACT.md");
const build = await read("scripts/build.mjs");
const views = ["home","about","business","supply","partnerships","contact","insights","privacy","login","register","setup-admin","account","admin"];
for (const view of views) assert.ok(html.includes('data-page="' + view + '"'), "Missing page: " + view);
for (const route of ["auth/register","auth/login","auth/me","auth/logout","auth/bootstrap-admin","admin/overview","admin/pages","admin/articles","admin/users","admin/inquiries","admin/apps","admin/settings","admin/audit","inquiries"]) assert.ok(api.includes(route), "Missing API route: " + route);
for (const table of ["users","sessions","auth_attempts","site_pages","articles","site_settings","inquiries","audit_logs","app_catalog"]) assert.ok(schema.includes("CREATE TABLE IF NOT EXISTS " + table), "Missing database table: " + table);
assert.ok(html.includes('id="rs-login-form"'), "Login form missing");
assert.ok(html.includes('id="rs-register-form"'), "Register form missing");
const authRuntime = html.slice(html.indexOf('<script id="rs-auth-runtime">'), html.indexOf("</script>", html.indexOf('<script id="rs-auth-runtime">')));
for (const handler of ["submitLogin","submitRegister"]) {
  const start = authRuntime.indexOf("async function " + handler + "(event){");
  assert.ok(start >= 0, "Missing form handler: " + handler);
  const next = authRuntime.indexOf("\n  async function ", start + 1);
  const body = authRuntime.slice(start, next < 0 ? authRuntime.length : next);
  assert.ok(body.includes("const form = event.target;"), handler + " must read the submitted form from event.target");
  assert.ok(!body.includes("event.currentTarget"), handler + " must not use currentTarget inside a delegated listener");
}
assert.ok(html.includes('data-page="setup-admin"') && html.includes('data-route="login"'), "Admin setup route must point to the normal login page");
assert.ok(!html.includes('id="rs-bootstrap-form"') && !html.includes("x-admin-bootstrap-secret"), "Complex admin setup form must not be exposed in the public UI");
assert.ok(html.includes('id="admin-panel-content"'), "Admin dashboard mount missing");
assert.ok(html.includes("raz-sahra-cms-runtime.js"), "CMS inquiry runtime is not loaded");
assert.ok(cmsRuntime.includes('fetch("/api/inquiries"'), "Inquiry forms must use the backend endpoint");
assert.ok(cmsRuntime.includes("downloadFallback"), "Inquiry forms must have an honest local fallback");
assert.ok(api.includes("ADMIN_BOOTSTRAP_SECRET") && api.includes("admin.bootstrap.claimed"), "One-time admin bootstrap must be protected and single-use");
assert.ok(!api.includes('path === "setup/admin"'), "Legacy insecure admin bootstrap route must not be present");
assert.ok(api.includes('rateOkay(sql, request, "inquiry")'), "Public inquiry submissions must be rate limited");
assert.ok(headers.includes("X-Content-Type-Options: nosniff"), "Baseline security headers missing");
assert.ok(cloudflareWorkflow.includes("wrangler pages deploy dist"), "Cloudflare Pages deployment step missing");
assert.ok(cloudflareWorkflow.includes("Smoke-test deployed site, Madar route and backend"), "Post-deployment live smoke test missing");
assert.ok(cloudflareWorkflow.includes("/api/health") && cloudflareWorkflow.includes("database!==\"connected\""), "Live health test must verify Neon database connectivity");
assert.ok(cloudflareWorkflow.includes("/api/medar/api/health") && cloudflareWorkflow.includes("d.database!==true"), "Live smoke test must verify the separate operational Madar API");
assert.ok(cloudflareWorkflow.includes("Ensure CMS database secret is configured before deployment"), "Production deploy must fail fast when the dedicated CMS database secret is missing");
assert.ok(cloudflareWorkflow.includes("pages secret put DATABASE_URL") && cloudflareWorkflow.includes("RAZ_SAHRA_DATABASE_URL"), "Deployment must support secure provisioning of the Pages CMS database secret");
assert.ok(cloudflareWorkflow.includes("/madar/app/home"), "Production smoke test must verify a nested Madar route refresh");
assert.ok(madarRouteFallback.includes("context.env.ASSETS.fetch") && madarRouteFallback.includes('text/html'), "Madar deep-link fallback must serve the application shell for HTML navigations");
assert.ok(html.includes('class="section compact madar-product-section"') && html.includes('id="madar-product-title"'), "Public homepage must expose the integrated Madar product section");

assert.ok(cloudflareWorkflow.includes("SITE_BUILD_VERSION"), "Deployment build version must be supplied for cache busting");
assert.ok(build.includes("process.env.SITE_BUILD_VERSION") && build.includes("${buildVersion}"), "Build must bust CSS/JS caches on each deployment");

assert.ok(api.includes('path.startsWith("medar/")') && api.includes("proxyMedar(request, path)"), "Same-origin Medar API proxy missing");
assert.ok(html.includes('href="/madar/"'), "Same-origin Medar entry point missing");
assert.ok(html.includes("madar-product-section") && html.includes('id="madar-product-title"'), "Homepage must introduce Madar as a Raz Sahra product");
assert.ok(html.includes('class="mobile-product-link"'), "Mobile navigation must expose the Madar entry point");
assert.ok(html.includes('class="nav-link nav-link-madar"'), "Desktop navigation must expose the Madar entry point");
assert.ok(!html.includes("در انتظار فایل PWA") && !html.includes("پس از اتصال بسته وب/PWA نهایی فعال می‌شود"), "Stale Madar pending-bundle copy must not return");
assert.ok(schema.includes("'/madar/','',true"), "New installs must seed Madar as an active integrated web app");
assert.ok((await read("_redirects")).includes("/madar /madar/ 301"), "Madar path normalization redirect missing");
assert.ok(cloudflareWorkflow.includes("repository: Ehsanamn1/simorgh") && cloudflareWorkflow.includes("dist/madar"), "Madar app bundle build is not part of the deployment");
assert.equal(medarSourcePin.repository, "Ehsanamn1/simorgh", "Canonical Medar source pin must point to the operational repository");
assert.match(medarSourcePin.commit, /^[0-9a-f]{40}$/, "Canonical Medar source pin must use an immutable full commit SHA");
assert.equal(medarSourcePin.mountPath, "/madar/", "Medar integration mount path mismatch");
assert.equal(medarSourcePin.apiBasePath, "/api/medar", "Medar same-origin API base path mismatch");
assert.ok(cloudflareWorkflow.includes("integration/medar-source.json"), "Pages workflow must load the canonical Medar source pin");
assert.ok(cloudflareWorkflow.includes("ref: ${{ steps.medar-source.outputs.ref }}"), "Pages workflow must checkout the pinned Medar commit, not a moving branch");
assert.ok(cloudflareWorkflow.includes("VITE_APP_VERSION: ${{ github.sha }}-${{ steps.medar-source.outputs.ref }}"), "Integrated asset version must identify both parent and Medar commits");

assert.ok(cloudflareWorkflow.includes("VITE_API_BASE_URL: /api/medar"), "Madar API must use the same-origin proxy");
const medarSourceRef = cloudflareWorkflow.match(/ref:\\s*\\$\\{\\{\\s*steps\\.medar-source\\.outputs\\.ref\\s*\\}\\}/);
assert.ok(medarSourceRef, "Integrated Medar checkout must use the output resolved from the canonical source pin");
assert.ok(cloudflareWorkflow.includes("integration/medar-source.json"), "Pages workflow must resolve Medar source from the canonical manifest");
assert.ok(integrationContract.includes(medarSourcePin.commit), "The integration contract must record the exact pinned Medar source revision");
assert.ok(cloudflareWorkflow.includes("Public Medar entry point") && cloudflareWorkflow.includes("api/admin/pages") && cloudflareWorkflow.includes("401|403"), "Production smoke tests must check the public Medar entry point and deny unauthenticated CMS admin access");
assert.ok(integrationContract.includes("/api/medar/api/health") && integrationContract.includes("No shared database or an authenticated session"), "Integration contract must document routes and identity/data isolation");
for (const fragment of html.split("<script").slice(1)) {
  const open = fragment.indexOf(">");
  const close = fragment.indexOf("</script>");
  if (open >= 0 && close > open) {
    const openingTag = fragment.slice(0, open);
    const inlineScript = fragment.slice(open + 1, close).trim();
    if (!/\bsrc\s*=/.test(openingTag) && !/type=["']application\/(?:ld\+)?json["']/.test(openingTag) && inlineScript) {
      new Function(inlineScript);
    }
  }
}

assert.ok(html.includes('data-route="register"'), "Footer registration link missing");
assert.ok(html.includes('class="brand footer-brand-lockup"'), "Footer must reuse the approved header brand lockup");
assert.ok(!html.includes('class="footer-lockup-image"'), "Obsolete square footer lockup must not return");
assert.ok(css.includes("@keyframes rs-fireball-breathe") && css.includes(".hero-slide::before") && css.includes("opacity:.2"), "Subtle responsive hero fireball treatment missing");
assert.ok(css.includes("height:clamp(430px,39vw,540px)") && css.includes("height:470px;min-height:470px"), "Compact responsive hero carousel sizing missing");
assert.ok(interactive.includes("interval:4800"), "Hero carousel rotation interval missing");
assert.ok(css.includes("Mobile performance and editor-reader fix"), "Responsive fix missing");
assert.ok(interactive.includes("window.matchMedia('(max-width: 850px)').matches"), "Mobile particle budget missing");
await access("db/schema.sql");
await access("assets/raz-sahra-cms-runtime.js");
await access("_headers");
await access(".github/workflows/pages.yml");
await access("docs/INTEGRATION_CONTRACT.md");
await access("docs/CROSS_PROJECT_STATUS.md");
console.log("Checks passed: public and protected routes, simple role-based login, inquiry persistence/fallback, database schema, security headers and Cloudflare Pages workflow.");
