import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { onRequest, closeMysqlPool } from './cms-api.mjs';

const port = Number(process.env.PORT || 3000);
const root = resolve(process.env.STATIC_DIR || 'dist');
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

function writeResponse(res, status, headers, body) {
  const output = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin', 'x-frame-options': 'DENY', ...headers };
  res.writeHead(status, output);
  res.end(body);
}

async function serveStatic(url, res, method = "GET") {
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return writeResponse(res, 400, {}, 'Bad Request'); }
  let relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let file = resolve(root, relative);
  if (file !== root && !file.startsWith(root + sep)) return writeResponse(res, 403, {}, 'Forbidden');
  try {
    let info = await stat(file);
    if (info.isDirectory()) {
      file = resolve(file, 'index.html');
      info = await stat(file);
    }
    if (!info.isFile()) throw new Error('not_file');
  } catch {
    // Query-driven pages use index.html; never mask a missing static asset with HTML.
    if (extname(pathname)) return writeResponse(res, 404, { 'cache-control': 'no-store' }, 'Not Found');
    file = pathname.startsWith('/madar/') ? resolve(root, 'madar/index.html') : resolve(root, 'index.html');
  }
  try {
    const body = await readFile(file);
    const isHtml = extname(file).toLowerCase() === '.html';
    const headers = {
      'content-type': mime[extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': isHtml ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400',
      'content-length': String(body.byteLength),
    };
    return writeResponse(res, 200, headers, method === 'HEAD' ? Buffer.alloc(0) : body);
  } catch {
    return writeResponse(res, 404, { 'cache-control': 'no-store' }, 'Not Found');
  }
}

const server = createServer(async (incoming, outgoing) => {
  try {
    const protoHeader = String(incoming.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
    const protocol = protoHeader === 'https' ? 'https' : 'http';
    const host = incoming.headers.host || 'localhost:' + port;
    const url = new URL(incoming.url || '/', protocol + '://' + host);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      let body;
      if (!['GET', 'HEAD', 'OPTIONS'].includes((incoming.method || 'GET').toUpperCase())) {
        const chunks = [];
        let size = 0;
        for await (const chunk of incoming) {
          size += chunk.length;
          if (size > 1024 * 1024) return writeResponse(outgoing, 413, { 'content-type': 'application/json; charset=utf-8' }, JSON.stringify({ ok: false, error: { code: 'request_too_large', message: 'Request body too large' } }));
          chunks.push(chunk);
        }
        body = Buffer.concat(chunks);
      }
      const headers = new Headers();
      for (const [name, value] of Object.entries(incoming.headers)) {
        if (value == null || name === 'host' || name === 'connection') continue;
        headers.set(name, Array.isArray(value) ? value.join(', ') : String(value));
      }
      const request = new Request(url, {
        method: incoming.method || 'GET',
        headers,
        ...(body && body.length ? { body } : {}),
      });
      const env = {
        MYSQL_URL: process.env.MYSQL_URL,
        ADMIN_BOOTSTRAP_SECRET: process.env.ADMIN_BOOTSTRAP_SECRET,
        MEDAR_API_URL: process.env.MEDAR_API_URL,
      };
      const response = await onRequest({ request, env });
      const responseBody = Buffer.from(await response.arrayBuffer());
      const responseHeaders = Object.fromEntries(response.headers.entries());
      return writeResponse(outgoing, response.status, responseHeaders, responseBody);
    }
    if ((incoming.method || 'GET').toUpperCase() !== 'GET' && (incoming.method || 'GET').toUpperCase() !== 'HEAD') {
      return writeResponse(outgoing, 405, { allow: 'GET, HEAD' }, 'Method Not Allowed');
    }
    return await serveStatic(url, outgoing, (incoming.method || 'GET').toUpperCase());
  } catch (error) {
    console.error('Raz Sahra domestic runtime request failed:', error?.message || 'unknown');
    return writeResponse(outgoing, 500, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, JSON.stringify({ ok: false, error: { code: 'internal_error', message: 'خطای داخلی رخ داد. دوباره تلاش کنید.' } }));
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log('Raz Sahra Node/MySQL runtime listening on port ' + port + ' with static root ' + root);
});
function shutdown() {
  server.close(async () => {
    try { await closeMysqlPool(); } catch { /* Process is exiting; preserve graceful HTTP shutdown. */ }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
