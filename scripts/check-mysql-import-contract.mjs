import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const source = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
const target = await readFile(new URL('../db/schema.mysql.sql', import.meta.url), 'utf8');
const tables = ['users', 'sessions', 'auth_attempts', 'site_pages', 'articles', 'site_settings', 'inquiries', 'audit_logs', 'app_catalog'];

function tableColumns(sql, tableName) {
  const lower = sql.toLowerCase();
  const needle = 'create table if not exists ' + tableName.toLowerCase();
  const tableStart = lower.indexOf(needle);
  assert(tableStart >= 0, 'Missing CREATE TABLE for ' + tableName);
  const start = sql.indexOf('(', tableStart + needle.length);
  assert(start >= 0, 'Missing column list for ' + tableName);
  let depth = 1;
  let quote = '';
  let end = start + 1;
  for (; end < sql.length && depth > 0; end += 1) {
    const ch = sql[end];
    if (quote) {
      if (ch === quote && sql[end - 1] !== '\\\\') quote = '';
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
  }
  assert.equal(depth, 0, 'Unclosed table definition: ' + tableName);
  const body = sql.slice(start + 1, end - 1);
  const columns = new Set();
  const structural = new Set(['PRIMARY', 'UNIQUE', 'CONSTRAINT', 'FOREIGN', 'CHECK', 'KEY', 'INDEX']);
  for (const line of body.split('\n')) {
    const trimmed = line.trim().replace(/,$/, '');
    if (!trimmed) continue;
    const rawName = trimmed.split(/\s+/, 1)[0];
    const name = rawName.replace(/^[`"]|[`"]$/g, '');
    if (structural.has(name.toUpperCase())) continue;
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) columns.add(name.toLowerCase());
  }
  return columns;
}

const problems = [];
for (const table of tables) {
  const src = tableColumns(source, table);
  const dst = tableColumns(target, table);
  for (const column of src) if (!dst.has(column)) problems.push(table + '.' + column + ' is missing from MySQL target schema');
}
assert.deepEqual(problems, [], problems.join('\n'));
console.log('CMS import contract passed: all source columns exist in the MySQL target for', tables.length, 'tables.');
