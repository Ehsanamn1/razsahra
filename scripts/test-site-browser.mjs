import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { chromium } from '../medar-src/node_modules/playwright/index.mjs';

const root = resolve('dist');
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2',
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://127.0.0.1:4178');
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end('Bad Request'); return; }
    let file = resolve(root, pathname.replace(/^\/+/, ''));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end('Forbidden'); return; }
    try {
      const info = await stat(file);
      if (info.isDirectory()) file = resolve(file, 'index.html');
    } catch {
      if (pathname.startsWith('/madar/')) file = resolve(root, 'madar/index.html');
      else if (!extname(pathname)) file = resolve(root, 'index.html');
      else { res.writeHead(404).end('Not Found'); return; }
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': mime[extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(500).end('Internal Server Error');
  }
});
await new Promise(resolveListen => server.listen(4178, '127.0.0.1', resolveListen));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4178/', { waitUntil: 'networkidle' });
  const slider = page.locator('[data-hero-slider]');
  await slider.hover(); // Pause autoplay so control assertions are deterministic.
  assert.equal(await slider.locator('[data-hero-slide]').count(), 4, 'homepage must contain four curated slides');
  await assert.doesNotReject(() => page.locator('[data-hero-slide].is-active').waitFor({ state: 'visible' }));
  assert.equal(await slider.locator('[data-hero-slide].is-active').count(), 1, 'exactly one slide must be active');
  async function assertActiveSlide(expected) {
    await page.waitForFunction((label) => {
      const active = document.querySelector('[data-hero-slide].is-active .slide-index');
      return active?.textContent?.replace(/\s+/g, ' ').trim() === label;
    }, expected, { timeout: 3000 });
    assert.equal(await slider.locator('[data-hero-slide].is-active .slide-index').textContent().then(text => text?.replace(/\s+/g, ' ').trim()), expected);
    assert.equal(await slider.locator('[data-hero-dot].is-active').getAttribute('data-hero-dot'), String(Number(expected.slice(0, 2)) - 1));
  }
  await slider.locator('[data-hero-next]').click();
  await assertActiveSlide('02 / 04');
  await slider.locator('[data-hero-dot="3"]').click();
  await assertActiveSlide('04 / 04');
  await slider.locator('[data-hero-prev]').click();
  await assertActiveSlide('03 / 04');
  const imageResults = await slider.locator('.hero-slide-bg').evaluateAll(images =>
    images.map(image => ({ src: image.getAttribute('src'), loaded: image.complete && image.naturalWidth > 0 }))
  );
  assert.ok(imageResults.every(image => image.loaded), 'all hero slide images must load: ' + JSON.stringify(imageResults));

  for (const width of [320, 360, 375, 390, 414, 430, 640, 768, 850, 1024, 1365]) {
    await page.setViewportSize({ width, height: width <= 430 ? 844 : 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
      hero: document.querySelector('[data-hero-slider]')?.getBoundingClientRect().width || 0,
    }));
    assert.ok(dimensions.document <= dimensions.viewport, 'document overflows at ' + width + 'px: ' + JSON.stringify(dimensions));
    assert.ok(dimensions.body <= dimensions.viewport, 'body overflows at ' + width + 'px: ' + JSON.stringify(dimensions));
    assert.ok(dimensions.hero <= dimensions.viewport, 'hero slider exceeds viewport at ' + width + 'px: ' + JSON.stringify(dimensions));
  }

  await page.setViewportSize({ width: 390, height: 844 });
  const sliderTapTargets = await slider.locator('.hero-slider-controls button').evaluateAll(buttons =>
    buttons.map(button => {
      const rect = button.getBoundingClientRect();
      return { label: button.getAttribute('aria-label'), width: rect.width, height: rect.height };
    })
  );
  assert.ok(sliderTapTargets.every(target => target.width >= 30 && target.height >= 40),
    'mobile slider controls need reliable touch targets: ' + JSON.stringify(sliderTapTargets));
  const mobileToggle = page.locator('.mobile-toggle');
  assert.equal(await mobileToggle.isVisible(), true, 'mobile menu toggle must be visible at 390px');
  await mobileToggle.click();
  assert.equal(await mobileToggle.getAttribute('aria-expanded'), 'true', 'mobile menu must expose expanded state');
  assert.equal(await page.locator('#mobile-menu').getAttribute('aria-hidden'), 'false');
  await page.locator('#mobile-menu a[data-route="about"]').click();
  await assert.doesNotReject(() => page.locator('.page-view.active').getByRole('heading', { name: /درباره/ }).waitFor({ state: 'visible' }));
  assert.equal(await mobileToggle.getAttribute('aria-expanded'), 'false', 'navigation must close the mobile menu');

  await page.route('**/api/medar/api/health', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ ok: true, database: true, service: 'medar-domestic-api' }),
  }));
  await page.route('**/api/medar/api/auth/me', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ user: null, memberships: [] }),
  }));
  await page.goto('http://127.0.0.1:4178/madar/', { waitUntil: 'domcontentloaded' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.simorgh-signin-layer').waitFor({ state: 'visible', timeout: 15000 });
  const appDimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert.ok(appDimensions.document <= appDimensions.viewport, 'Madar entry page overflows on mobile: ' + JSON.stringify(appDimensions));
  assert.ok(appDimensions.body <= appDimensions.viewport, 'Madar body overflows on mobile: ' + JSON.stringify(appDimensions));
  assert.deepEqual(errors, [], 'browser runtime errors: ' + errors.join('; '));
  console.log('Browser acceptance passed: 4-slide carousel controls/images, mobile navigation, 11 responsive widths, Madar entry shell, no horizontal overflow or page errors.');
} finally {
  await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
