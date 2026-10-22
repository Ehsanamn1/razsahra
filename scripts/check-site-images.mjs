import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const remoteImageReferences = html.match(/(?:src|srcset|url\()\s*=?\s*["']?https:\/\/(?:images\.pexels\.com|upload\.wikimedia\.org|commons\.wikimedia\.org)[^\s"'<>)]*/gi) ?? [];
if (remoteImageReferences.length) {
  throw new Error('Remote image dependencies remain in index.html: ' + remoteImageReferences.slice(0, 5).join(' | '));
}
const localAssets = [...html.matchAll(/(?:src|href|url\()\s*=?\s*["']?(assets\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|avif|svg))["')\s>]?/g)]
  .map(match => match[1]);
const uniqueAssets = [...new Set(localAssets)];
for (const asset of uniqueAssets) {
  try { await access(resolve(process.cwd(), asset)); }
  catch { throw new Error('Referenced local visual asset does not exist: ' + asset); }
}
const slides = (html.match(/data-hero-slide/g) ?? []).length;
if (slides !== 4) throw new Error('Expected four hero slides; found ' + slides);
if (!html.includes('data-hero-slider') || !html.includes('data-hero-next') || !html.includes('data-hero-prev')) {
  throw new Error('Hero slider controls are incomplete.');
}
if (!html.includes('assets/raz-sahra-hero-banner.webp')) throw new Error('Local hero fallback asset is missing from markup.');
console.log('Site image integrity passed:', uniqueAssets.length, 'local assets,', slides, 'hero slides, no remote image dependencies.');
