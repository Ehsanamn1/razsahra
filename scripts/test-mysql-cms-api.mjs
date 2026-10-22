import assert from 'node:assert/strict';
import { onRequest, closeMysqlPool } from '../server/cms-api.mjs';

const MYSQL_URL = process.env.TARGET_MYSQL_URL;
const ADMIN_BOOTSTRAP_SECRET = process.env.TEST_ADMIN_BOOTSTRAP_SECRET;
if (!MYSQL_URL) throw new Error('TARGET_MYSQL_URL is required for the domestic CMS API integration test.');
if (!ADMIN_BOOTSTRAP_SECRET || ADMIN_BOOTSTRAP_SECRET.length < 32) throw new Error('TEST_ADMIN_BOOTSTRAP_SECRET must contain at least 32 characters.');

const env = { MYSQL_URL, ADMIN_BOOTSTRAP_SECRET };
const origin = 'http://cms-test.local';
async function request(path, { method = 'GET', body, cookie, headers = {} } = {}) {
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set('content-type', 'application/json');
  if (cookie) requestHeaders.set('cookie', cookie);
  const response = await onRequest({
    request: new Request(origin + path, {
      method,
      headers: requestHeaders,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }),
    env,
  });
  const text = await response.text();
  let payload = {};
  try { payload = JSON.parse(text); } catch { throw new Error('Expected JSON response for ' + path + ', got: ' + text.slice(0, 120)); }
  return { response, payload };
}
try {
  const health = await request('/api/health');
  assert.equal(health.response.status, 200, 'MySQL API health must return 200');
  assert.equal(health.payload.database, 'connected');

  const username = 'ci-admin-' + Date.now().toString(36);
  const password = 'Test-Only-Strong-Password-1405!';
  const boot = await request('/api/auth/bootstrap-admin', {
    method: 'POST',
    headers: { 'x-admin-bootstrap-secret': ADMIN_BOOTSTRAP_SECRET },
    body: { username, email: username + '@example.invalid', display_name: 'CI Admin', password },
  });
  assert.equal(boot.response.status, 201, 'first-admin bootstrap should work on a fresh disposable schema: ' + JSON.stringify(boot.payload));
  assert.equal(boot.payload.user.role, 'admin');
  const cookie = (boot.response.headers.get('set-cookie') || '').split(';')[0];
  assert.match(cookie, /^rs_session=/);

  const me = await request('/api/auth/me', { cookie });
  assert.equal(me.response.status, 200);
  assert.equal(me.payload.user.username, username);

  const overview = await request('/api/admin/overview', { cookie });
  assert.equal(overview.response.status, 200, 'authenticated admin overview must work: ' + JSON.stringify(overview.payload));

  const logout = await request('/api/auth/logout', { method: 'POST', cookie, body: {} });
  assert.equal(logout.response.status, 200);
  const meAfterLogout = await request('/api/auth/me', { cookie });
  assert.equal(meAfterLogout.payload.user, null, 'logout must revoke the database session');

  const registrationName = 'ci-user-' + Date.now().toString(36);
  const register = await request('/api/auth/register', {
    method: 'POST',
    body: { username: registrationName, email: registrationName + '@example.invalid', display_name: 'CI User', password },
  });
  assert.equal(register.response.status, 201, 'registration should persist a user: ' + JSON.stringify(register.payload));
  assert.equal(register.payload.user.username, registrationName);

  const inquiry = await request('/api/inquiries', {
    method: 'POST',
    body: { kind: 'contact', name: 'CI Test', email: 'ci-inquiry@example.invalid', phone: '', company: 'CI', message: 'Integration test inquiry for domestic MySQL API.' },
  });
  assert.equal(inquiry.response.status, 201, 'inquiry should persist: ' + JSON.stringify(inquiry.payload));
  assert.match(inquiry.payload.inquiry.id, /^[0-9a-f-]{36}$/i);

  const apps = await request('/api/public/apps');
  assert.equal(apps.response.status, 200);
  assert.ok(Array.isArray(apps.payload.apps));
  console.log('Raz Sahra Node/MySQL CMS API integration passed: health, bootstrap, sessions, admin overview, registration, inquiry, public apps.');
} finally {
  await closeMysqlPool();
}
