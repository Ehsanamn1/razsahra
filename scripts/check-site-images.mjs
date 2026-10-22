import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const remoteImageReferences = html.match(/(?:src|srcset|url\()\s*=?\s*["']?https:\/\/(?:images\.pexels\.com|upload\.wikimedia\.org|commons\.wikimedia\.org)[^\s"'<>)]*/gi) ?? [];
if (remoteImageReferences.length) {
  throw new Error('Remote image dependencies remain in index.html: ' + remoteImageReferences.slice(0, 5).join(' | '));
}
if (/https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com)/i.test(html)) {
  throw new Error('Remote Google Fonts dependency remains in index.html.');
}
const heroImages = [...html.matchAll(/<img class="hero-slide-bg[^"]*" src="([^"]+)"/g)].map(match => match[1]);
if (heroImages.length !== 4 || new Set(heroImages).size !== 4 || heroImages.some(path => !path.endsWith('.svg'))) {
  throw new Error('Hero slider must use four distinct local SVG illustrations; found: ' + heroImages.join(', '));
}
const localAssets = [...html.matchAll(/(?:src|href|url\()\s*=?\s*["']?(assets\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|avif|svg))["')\s>]?/g)]
  .map(match => match[1]);
const uniqueAssets = [...new Set(localAssets)];
for (const asset of uniqueAssets) {
  const assetPath = resolve(process.cwd(), asset);
  try { await access(assetPath); }
  catch { throw new Error('Referenced local visual asset does not exist: ' + asset); }
  if (asset.endsWith('.svg')) {
    const svg = await readFile(assetPath, 'utf8');
    if (!/<svg\\b[^>]*xmlns="http:\\/\\/www\\.w3\\.org\\/2000\\/svg"/i.test(svg) || !/<\\/svg>\\s*$/i.test(svg)) {
      throw new Error('Malformed local SVG visual asset: ' + asset);
    }
    if (/https?:\\/\\//i.test(svg) || /<script\\b/i.test(svg)) {
      throw new Error('Local SVG must not depend on external resources or scripts: ' + asset);
    }
  }
}
const slides = (html.match(/<article\b[^>]*class=\"[^\"]*\bhero-slide\b[^\"]*\"[^>]*data-hero-slide/g) ?? []).length;
if (slides !== 4) throw new Error('Expected four hero slides; found ' + slides);
if (!html.includes('data-hero-slider') || !html.includes('data-hero-next') || !html.includes('data-hero-prev')) {
  throw new Error('Hero slider controls are incomplete.');
}
if (!html.includes('assets/raz-sahra-hero-banner.webp')) throw new Error('Local hero fallback asset is missing from markup.');
console.log('Site image integrity passed:', uniqueAssets.length, 'local assets,', slides, 'hero slides, no remote image dependencies.');
