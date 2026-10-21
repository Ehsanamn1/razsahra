import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const schema = await readFile(new URL('../db/schema.mysql.sql', import.meta.url), 'utf8');
const requiredTables = [
  'users', 'sessions', 'auth_attempts', 'site_pages', 'articles',
  'site_settings', 'inquiries', 'audit_logs', 'app_catalog',
];
const foundTables = [...schema.matchAll(/CREATE TABLE IF NOT EXISTS\s+`?([a-z_]+)`?\s*\(/gi)].map(match => match[1].toLowerCase());
for (const table of requiredTables) {
  assert(foundTables.includes(table), `Missing required MySQL table: ${table}`);
}
assert.equal(new Set(foundTables).size, foundTables.length, 'Duplicate CREATE TABLE declaration detected');

for (const table of ['users', 'articles', 'inquiries']) {
  const match = schema.match(new RegExp(`CREATE TABLE IF NOT EXISTS\\s+${table}\\s*\\(([\\s\\S]*?)\\) ENGINE=InnoDB`, 'i'));
  assert(match, `Missing table body for ${table}`);
  assert(/id CHAR\(36\) NOT NULL DEFAULT \(UUID\(\)\) PRIMARY KEY/i.test(match[1]), `${table}.id must generate a UUID for new runtime inserts`);
}

const forbidden = [
  [new RegExp('\\\\bJSONB\\\\b', 'i'), 'PostgreSQL JSONB type'],
  [new RegExp('\\\\bTIMESTAMPTZ\\\\b', 'i'), 'PostgreSQL TIMESTAMPTZ type'],
  [new RegExp('::(?:jsonb|int|text|uuid)\\\\b', 'i'), 'PostgreSQL cast syntax'],
  [new RegExp('\\\\bON CONFLICT\\\\b', 'i'), 'PostgreSQL ON CONFLICT clause'],
  [new RegExp('\\\\bRETURNING\\\\b', 'i'), 'PostgreSQL RETURNING clause'],
];
for (const [pattern, label] of forbidden) assert(!pattern.test(schema), `MySQL schema contains unsupported ${label}`);

for (const relation of [
  new RegExp('FOREIGN KEY \\\\(user_id\\\\) REFERENCES users\\\\(id\\\\)', 'i'),
  new RegExp('FOREIGN KEY \\\\(actor_id\\\\) REFERENCES users\\\\(id\\\\)', 'i'),
  new RegExp('FOREIGN KEY \\\\(updated_by\\\\) REFERENCES users\\\\(id\\\\)', 'i'),
]) assert(relation.test(schema), 'A required CMS foreign-key relation is missing');

console.log(`MySQL schema static check passed: ${requiredTables.length} tables, UUID defaults, and PostgreSQL syntax checks.`);
