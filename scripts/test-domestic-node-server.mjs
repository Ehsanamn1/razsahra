import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const mysqlUrl = process.env.TARGET_MYSQL_URL;
if (!mysqlUrl) throw new Error('TARGET_MYSQL_URL is required for the Node server smoke test.');
const root = await mkdtemp(join(tmpdir(), 'raz-domestic-server-'));
await mkdir(join(root, 'madar'), { recursive: true });
await mkdir(join(root, 'assets'), { recursive: true });
await writeFile(join(root, 'index.html'), '<!doctype html><title>raz-shell</title>');
await writeFile(join(root, 'madar', 'index.html'), '<!doctype html><title>medar-shell</title>');
await writeFile(join(root, 'assets', 'test.css'), 'body{margin:0}');
const port = 31983;
const medarPort = 31984;
let output = '';
const medarChild = spawn(process.execPath, ['server/medar-api.mjs'], {
  cwd: process.cwd(),
  env: { ...process.env, MYSQL_URL: mysqlUrl, MEDAR_PORT: String(medarPort), MEDAR_HOST: '127.0.0.1', APP_ORIGIN: 'http://127.0.0.1:' + port },
  stdio: ['ignore', 'pipe', 'pipe'],
});
const child = spawn(process.execPath, ['server/index.mjs'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port), STATIC_DIR: root, MYSQL_URL: mysqlUrl, MEDAR_API_URL: 'http://127.0.0.1:' + medarPort },
  stdio: ['ignore', 'pipe', 'pipe'],
});
for (const processChild of [child, medarChild]) {
  processChild.stdout.on('data', chunk => { output += chunk.toString(); });
  processChild.stderr.on('data', chunk => { output += chunk.toString(); });
}
async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (child.exitCode !== null) throw new Error('Node server exited early: ' + output);
    try {
      const response = await fetch('http://127.0.0.1:' + port + '/');
      if (response.status === 200) return response;
    } catch { /* Wait for listen() to finish. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Node server did not start in time: ' + output);
}
async function waitForMedar() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (medarChild.exitCode !== null) throw new Error('Medar API exited early: ' + output);
    try {
      const response = await fetch('http://127.0.0.1:' + medarPort + '/api/health');
      if (response.status === 200) return response;
    } catch { /* Wait for listen() to finish. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Medar API did not start in time: ' + output);
}
async function stopChild(processChild) {
  if (processChild.exitCode !== null) return;
  processChild.kill('SIGTERM');
  await new Promise(resolve => {
    if (processChild.exitCode !== null) return resolve();
    const timer = setTimeout(() => { processChild.kill('SIGKILL'); resolve(); }, 3000);
    processChild.once('exit', () => { clearTimeout(timer); resolve(); });
  });
}
try {
  const medarHealth = await waitForMedar();
  assert.equal((await medarHealth.json()).service, 'medar-domestic-api');
  const home = await waitForServer();
  assert.match(await home.text(), /raz-shell/);
  const deepLink = await fetch('http://127.0.0.1:' + port + '/madar/app/home');
  assert.equal(deepLink.status, 200);
  assert.match(await deepLink.text(), /medar-shell/, 'Madar deep links must use the Madar app shell, not the Raz Sahra home page.');
  const asset = await fetch('http://127.0.0.1:' + port + '/assets/test.css');
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get('content-type') || '', /text\/css/);
  assert.equal(await asset.text(), 'body{margin:0}');
  const missingAsset = await fetch('http://127.0.0.1:' + port + '/assets/missing.webp');
  assert.equal(missingAsset.status, 404, 'Missing images must not be masked by an HTML fallback.');
  const head = await fetch('http://127.0.0.1:' + port + '/', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  const health = await fetch('http://127.0.0.1:' + port + '/api/health');
  const healthPayload = await health.json();
  assert.equal(health.status, 200);
  assert.equal(healthPayload.database, 'connected');
  const medarHealthResponse = await fetch('http://127.0.0.1:' + port + '/api/medar/api/health');
  assert.equal(medarHealthResponse.status, 200);
  const medarHealthPayload = await medarHealthResponse.json();
  assert.equal(medarHealthPayload.service, 'medar-domestic-api');
  assert.equal(medarHealthPayload.database, true);
  console.log('Combined domestic server smoke test passed: Raz CMS, Medar local proxy, static root, deep links, asset 404 and MySQL health.');
} finally {
  await Promise.all([stopChild(child), stopChild(medarChild)]);
  await rm(root, { recursive: true, force: true });
}
