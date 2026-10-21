import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const out = path.join(root, "dist");
const files = ["index.html", "404.html", "manifest.webmanifest", "robots.txt", "sitemap.xml", "_headers", "_redirects", ".nojekyll"];
const oldBase = "https://ehsanamn1.github.io/razsahra/";
const cloudflareBase = "https://razsahra.pages.dev/";
let siteUrl = process.env.SITE_URL || cloudflareBase;
if (!/^https?:\/\//i.test(siteUrl)) throw new Error("SITE_URL must be an absolute HTTPS URL");
siteUrl = siteUrl.replace(/\/+$/, "") + "/";
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of files) {
  try { await cp(path.join(root, file), path.join(out, file)); }
  catch (error) { if (file !== ".nojekyll") throw error; }
}
await cp(path.join(root, "assets"), path.join(out, "assets"), { recursive: true });
let html = await readFile(path.join(out, "index.html"), "utf8");
html = html.split(oldBase).join(siteUrl);
html = html.replaceAll("raz-sahra-premium.css?v=20261021-05", "raz-sahra-premium.css?v=20261021-04");
html = html.replaceAll("raz-sahra-interactions.js?v=20261021-05", "raz-sahra-interactions.js?v=20261021-05");
html = html.replaceAll("raz-sahra-language.js?v=20261021-05", "raz-sahra-language.js?v=20261021-05");
await writeFile(path.join(out, "index.html"), html);
let manifest = await readFile(path.join(out, "manifest.webmanifest"), "utf8");
manifest = manifest.replaceAll("/razsahra/assets/", "/assets/").replaceAll('"/razsahra/"', '"/"').replaceAll('"/razsahra/?source=pwa"', '"/?source=pwa"');
await writeFile(path.join(out, "manifest.webmanifest"), manifest);
let sitemap = await readFile(path.join(out, "sitemap.xml"), "utf8");
sitemap = sitemap.split(oldBase).join(siteUrl);
await writeFile(path.join(out, "sitemap.xml"), sitemap);
let robots = await readFile(path.join(out, "robots.txt"), "utf8");
robots = robots.split(oldBase).join(siteUrl);
await writeFile(path.join(out, "robots.txt"), robots);
console.log("Cloudflare Pages build ready:", out);
console.log("Site origin:", siteUrl);
