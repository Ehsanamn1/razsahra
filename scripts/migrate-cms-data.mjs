import { neon } from '@neondatabase/serverless';
import mysql from 'mysql2/promise';

const TABLES = [
  'users',
  'sessions',
  'auth_attempts',
  'site_pages',
  'articles',
  'site_settings',
  'inquiries',
  'audit_logs',
  'app_catalog',
];
const APPLY = process.argv.includes('--apply');
const sourceUrl = process.env.SOURCE_DATABASE_URL || process.env.RAZ_SAHRA_DATABASE_URL;
const targetUrl = process.env.TARGET_MYSQL_URL;
if (!sourceUrl || !targetUrl) {
  console.error('Required environment variables: SOURCE_DATABASE_URL (or RAZ_SAHRA_DATABASE_URL) and TARGET_MYSQL_URL.');
  process.exit(2);
}
if (!/^mysql:\/\//i.test(targetUrl)) {
  console.error('TARGET_MYSQL_URL must be a mysql:// connection URL.');
  process.exit(2);
}
if (!APPLY) {
  console.log('DRY RUN ONLY. No target rows will be written. Add --apply to execute the import.');
}
const source = neon(sourceUrl);
const target = await mysql.createConnection(targetUrl);
await target.query("SET NAMES utf8mb4");
await target.query("SET time_zone = '+00:00'");
const sourceCounts = {};
const targetCounts = {};
function encode(value) {
  if (value === undefined) return null;
  if (value && typeof value === 'object' && !(value instanceof Date) && !Buffer.isBuffer(value)) {
    return JSON.stringify(value);
  }
  return value;
}
try {
  await target.query("SET time_zone = '+00:00'");
  for (const table of TABLES) {
    const srcRows = await source.query('SELECT * FROM "' + table + '"');
    const [targetResult] = await target.query('SELECT COUNT(*) AS count FROM `' + table + '`');
    sourceCounts[table] = srcRows.length;
    targetCounts[table] = Number(targetResult[0].count);
    console.log(table + ': source=' + sourceCounts[table] + ', target=' + targetCounts[table]);
  }
  if (!APPLY) {
    console.log('\nDry run finished. Review counts, run the MySQL schema first, and use a verified backup before applying.');
    process.exitCode = 0;
  } else {
    const nonEmpty = TABLES.filter(table => targetCounts[table] !== 0);
    if (nonEmpty.length) {
      throw new Error('Refusing to import into non-empty target tables: ' + nonEmpty.join(', ') + '. Use a clean staging database; this importer does not merge production records.');
    }
    await target.beginTransaction();
    try {
      for (const table of TABLES) {
        const rows = await source.query('SELECT * FROM "' + table + '"');
        if (!rows.length) continue;
        const columns = Object.keys(rows[0]);
        if (!columns.length) continue;
        const colSql = columns.map(column => '`' + column.replace(/`/g, '``') + '`').join(',');
        const placeholders = '(' + columns.map(() => '?').join(',') + ')';
        // Keep each statement modest to avoid max_allowed_packet failures on shared hosting.
        const chunkSize = 100;
        for (let offset = 0; offset < rows.length; offset += chunkSize) {
          const chunk = rows.slice(offset, offset + chunkSize);
          const chunkSql = 'INSERT INTO `' + table + '` (' + colSql + ') VALUES ' +
            chunk.map(() => placeholders).join(',');
          const chunkParams = [];
          for (const row of chunk) for (const column of columns) chunkParams.push(encode(row[column]));
          await target.query(chunkSql, chunkParams);
        }
        console.log('Imported ' + rows.length + ' rows into ' + table);
      }
      for (const table of TABLES) {
        const [result] = await target.query('SELECT COUNT(*) AS count FROM `' + table + '`');
        const actual = Number(result[0].count);
        if (actual !== sourceCounts[table]) {
          throw new Error('Row-count verification failed for ' + table + ': expected ' + sourceCounts[table] + ', got ' + actual);
        }
      }
      await target.commit();
      console.log('\nIMPORT SUCCEEDED. All allowlisted CMS table counts match.');
      console.log('Next: test login, session expiry, admin permissions, CMS CRUD and inquiry submissions against staging before cutover.');
    } catch (error) {
      await target.rollback();
      throw error;
    }
  }
} finally {
  await target.end();
}
