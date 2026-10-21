import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';
import assert from 'node:assert/strict';

const url = process.env.TARGET_MYSQL_URL;
if (!url) throw new Error('TARGET_MYSQL_URL is required for the disposable MySQL integration test.');

const schema = await readFile(new URL('../db/schema.mysql.sql', import.meta.url), 'utf8');
const seed = await readFile(new URL('../db/seed.mysql.sql', import.meta.url), 'utf8');
const statements = schema
  .split(';')
  .map(statement => statement.split('\n').filter(line => !/^\s*--/.test(line)).join('\n').trim())
  .filter(Boolean);

const db = await mysql.createConnection(url);
try {
  await db.query("SET NAMES utf8mb4");
  await db.query("SET time_zone = '+00:00'");
  const [[server]] = await db.query('SELECT VERSION() AS version');
  console.log('Applying schema to disposable MySQL server:', server.version);
  for (let index = 0; index < statements.length; index += 1) {
    try {
      await db.query(statements[index]);
    } catch (error) {
      const preview = statements[index].replace(/\s+/g, ' ').slice(0, 180);
      throw new Error('Schema statement ' + (index + 1) + '/' + statements.length + ' failed: ' + preview + '\n' + error.message);
    }
  }
  const requiredTables = [
    'users', 'sessions', 'auth_attempts', 'site_pages', 'articles',
    'site_settings', 'inquiries', 'audit_logs', 'app_catalog',
  ];
  const [tables] = await db.query(
    'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = \'BASE TABLE\'',
  );
  const names = new Set(tables.map(row => String(row.TABLE_NAME).toLowerCase()));
  for (const table of requiredTables) assert(names.has(table), 'Missing table after schema apply: ' + table);
  const [[uuid]] = await db.query('SELECT UUID() AS id');
  assert.match(uuid.id, /^[0-9a-f-]{36}$/i);
  for (const statement of seed.split(';').map(part => part.split('\\n').filter(line => !/^\\s*--/.test(line)).join('\\n').trim()).filter(Boolean)) {
    await db.query(statement);
  }
  const [[seedCounts]] = await db.query(
    "SELECT (SELECT COUNT(*) FROM site_pages) AS pages, (SELECT COUNT(*) FROM site_settings) AS settings, (SELECT COUNT(*) FROM app_catalog) AS apps",
  );
  assert(Number(seedCounts.pages) >= 16, 'Optional seed must populate Persian and English CMS page rows.');
  assert(Number(seedCounts.settings) >= 2, 'Optional seed must populate base site settings.');
  assert(Number(seedCounts.apps) >= 1, 'Optional seed must populate the Madar catalogue entry.');
  console.log('Schema + optional seed integration test passed:', statements.length, 'schema statements,', requiredTables.length, 'tables.');
} finally {
  await db.end();
}
