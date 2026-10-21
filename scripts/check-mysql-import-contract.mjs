import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const source = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
const target = await readFile(new URL('../db/schema.mysql.sql', import.meta.url), 'utf8');
const tables = [
  'users', 'sessions', 'auth_attempts', 'site_pages', 'articles',
  'site_settings', 'inquiries', 'audit_logs', 'app_catalog',
];

function tableColumns(sql, tableName) {
  const match = sql.match(new RegExp('CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+[`"]?' + tableName + '[`"]?\\s*\\(', 'i'));
  assert(match, 'Missing CREATE TABLE for ' + tableName);
  const start = match.index + match[0].length;
  let depth = 1;
  let quote = '';
  let end = start;
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
  const body = sql.slice(start, end - 1);
  const columns = new Set();
  for (const line of body.split(/\n/)) {
    const trimmed = line.trim().replace(/,$/, '');
    if (!trimmed || /^(PRIMARY|UNIQUE|CONSTRAINT|FOREIGN|CHECK|KEY|INDEX)\\b/i.test(trimmed)) continue;
    const col = trimmed.match(/^(?:`([^`]+)`|"([^"]+)"|([a-zA-Z_][a-zA-Z0-9_]*))\\s+/);
    if (col) columns.add((col[1] || col[2] || col[3]).toLowerCase());
  }
  return columns;
}

const problems = [];
for (const table of tables) {
  const src = tableColumns(source, table);
  const dst = tableColumns(target, table);
  for (const column of src) {
    if (!dst.has(column)) problems.push(table + '.' + column + ' exists in PostgreSQL source schema but not in MySQL target');
  }
}
assert.deepEqual(problems, [], problems.join('\n'));
console.log('CMS import contract passed: all source columns exist in the MySQL target for', tables.length, 'tables.');
