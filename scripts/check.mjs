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
const views = ["home","about","business","supply","partnerships","contact","insights","privacy","login","register","account","admin"];
for (const view of views) assert.ok(html.includes('data-page="' + view + '"'), "Missing page: " + view);
for (const route of ["auth/register","auth/login","auth/me","auth/logout","auth/bootstrap-admin","admin/overview","admin/pages","admin/articles","admin/users","admin/inquiries","admin/apps","admin/settings","admin/audit","inquiries"]) assert.ok(api.includes(route), "Missing API route: " + route);
for (const table of ["users","sessions","auth_attempts","site_pages","articles","site_settings","inquiries","audit_logs","app_catalog"]) assert.ok(schema.includes("CREATE TABLE IF NOT EXISTS " + table), "Missing database table: " + table);
assert.ok(html.includes('id="rs-login-form"'), "Login form missing");
assert.ok(html.includes('id="rs-register-form"'), "Register form missing");
assert.ok(html.includes('id="admin-panel-content"'), "Admin dashboard mount missing");
assert.ok(html.includes("raz-sahra-cms-runtime.js"), "CMS inquiry runtime is not loaded");
assert.ok(cmsRuntime.includes('fetch("/api/inquiries"'), "Inquiry forms must use the backend endpoint");
assert.ok(cmsRuntime.includes("downloadFallback"), "Inquiry forms must have an honest local fallback");
assert.ok(api.includes("ADMIN_BOOTSTRAP_SECRET") && api.includes("admin.bootstrap.claimed"), "One-time admin bootstrap must be protected and single-use");
assert.ok(!api.includes('path === "setup/admin"'), "Legacy insecure admin bootstrap route must not be present");
assert.ok(api.includes('rateOkay(sql, request, "inquiry")'), "Public inquiry submissions must be rate limited");
assert.ok(headers.includes("X-Content-Type-Options: nosniff"), "Baseline security headers missing");
assert.ok(cloudflareWorkflow.includes("wrangler pages deploy dist"), "Cloudflare Pages deployment step missing");

assert.ok(api.includes('path.startsWith("medar/")') && api.includes("proxyMedar(request, path)"), "Same-origin Medar API proxy missing");
assert.ok(html.includes('href="/madar/"'), "Same-origin Medar entry point missing");
assert.ok((await read("_redirects")).includes("/madar /madar/ 301"), "Madar path normalization redirect missing");
assert.ok(cloudflareWorkflow.includes("repository: Ehsanamn1/simorgh") && cloudflareWorkflow.includes("dist/madar"), "Madar app bundle build is not part of the deployment");
assert.ok(cloudflareWorkflow.includes("VITE_API_BASE_URL: /api/medar"), "Madar API must use the same-origin proxy");
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
assert.ok(css.includes("Hero ember sphere: keep the requested fireball"), "Subtle hero fireball treatment missing");
assert.ok(css.includes("Mobile performance and editor-reader fix"), "Responsive fix missing");
assert.ok(interactive.includes("window.matchMedia('(max-width: 850px)').matches"), "Mobile particle budget missing");
await access("db/schema.sql");
await access("assets/raz-sahra-cms-runtime.js");
await access("_headers");
await access(".github/workflows/pages.yml");
console.log("Checks passed: public and protected routes, one-time admin bootstrap, inquiry persistence/fallback, database schema, security headers and Cloudflare Pages workflow.");
