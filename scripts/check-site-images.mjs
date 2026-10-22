import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const articleFa = await readFile(new URL('../assets/raz-sahra-articles.html', import.meta.url), 'utf8');
const articleEn = await readFile(new URL('../assets/raz-sahra-articles-en.html', import.meta.url), 'utf8');
const allMarkup = [html, articleFa, articleEn].join('\n');
for (const [label, markup] of [['Persian article library', articleFa], ['English article library', articleEn]]) {
  const covers = [...markup.matchAll(/<img class="article-cover"[^>]*>/g)].map(match => match[0]);
  if (covers.length !== 8) throw new Error(label + ' must provide eight article covers; found ' + covers.length);
  if (covers.some(tag => !/src="assets\/raz-sahra-article-[a-z-]+\.svg"/.test(tag))) {
    throw new Error(label + ' contains a non-local or unapproved article cover.');
  }
  if (covers.some(tag => !tag.includes('width="1200"') || !tag.includes('height="800"') || !tag.includes('loading="lazy"') || !tag.includes('decoding="async"'))) {
    throw new Error(label + ' covers need intrinsic dimensions and lazy asynchronous decoding.');
  }
}
const interactions = await readFile(new URL('../assets/raz-sahra-interactions.js', import.meta.url), 'utf8');
if (!interactions.includes("document.querySelectorAll('[data-hero-slider]')") ||
    !interactions.includes('data-hero-next') ||
    !interactions.includes('data-hero-prev') ||
    !interactions.includes('visibilitychange') ||
    !interactions.includes('prefers-reduced-motion') ||
    !interactions.includes('swipeStart')) {
  throw new Error('Hero carousel runtime must initialize controls, support touch swipe, pause in background tabs and respect reduced motion.');
}
if (!html.includes('زنجیره‌ای منسجم؛') || !html.includes('ارزش‌آفرینی پایدار')) {
  throw new Error('Opening hero copy has not been refreshed to the current value-chain message.');
}
const remoteImageReferences = allMarkup.match(/(?:src|srcset|url\()\s*=?\s*["']?https:\/\/[^\s"'<>)]*/gi) ?? [];
if (remoteImageReferences.length) {
  throw new Error('Remote image dependencies remain in index.html: ' + remoteImageReferences.slice(0, 5).join(' | '));
}
if (/https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com)/i.test(html)) {
  throw new Error('Remote Google Fonts dependency remains in index.html.');
}
const heroImages = [...html.matchAll(/<img class="hero-slide-bg[^"]*" src="([^"]+)"/g)].map(match => match[1].split("?")[0]);
if (heroImages.length !== 4 || new Set(heroImages).size !== 4 || heroImages.some(path => !path.endsWith('.svg'))) {
  throw new Error('Hero slider must use four distinct local SVG illustrations; found: ' + heroImages.join(', '));
}
const localAssets = [...allMarkup.matchAll(/(?:src|href|url\()\s*=?\s*["']?(assets\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|avif|svg)(?:\?[^"')\s>]*)?)["')\s>]?/g)]
  .map(match => match[1].split("?")[0]);
const uniqueAssets = [...new Set(localAssets)];
for (const asset of uniqueAssets) {
  const assetPath = resolve(process.cwd(), asset);
  try { await access(assetPath); }
  catch { throw new Error('Referenced local visual asset does not exist: ' + asset); }
  if (asset.endsWith('.svg')) {
    const svg = await readFile(assetPath, 'utf8');
    if (!/<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/i.test(svg) || !/<\/svg>\s*$/i.test(svg)) {
      throw new Error('Malformed local SVG visual asset: ' + asset);
    }
    if (/(?:href|src)\s*=\s*["']https?:\/\//i.test(svg) || /url\(\s*["']?https?:\/\//i.test(svg) || /<script\b/i.test(svg)) {
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
console.log('Site image integrity passed:', uniqueAssets.length, 'local assets,', slides, 'hero slides, bilingual article imagery is local, no remote image dependencies.');
