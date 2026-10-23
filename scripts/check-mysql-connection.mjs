import mysql from 'mysql2/promise';

const url = process.env.TARGET_MYSQL_URL;
if (!url) {
  console.error('TARGET_MYSQL_URL is required. Set it as a protected environment variable; never pass credentials on the command line.');
  process.exit(2);
}
if (!/^mysql:\/\//i.test(url)) {
  console.error('TARGET_MYSQL_URL must use the mysql:// scheme.');
  process.exit(2);
}

const requiredTables = [
  'users', 'sessions', 'auth_attempts', 'site_pages', 'articles',
  'site_settings', 'inquiries', 'audit_logs', 'app_catalog',
];
const db = await mysql.createConnection(url);
try {
  const [[server]] = await db.query('SELECT VERSION() AS version, DATABASE() AS database_name');
  const version = String(server.version).split('-')[0].split('.').map(Number);
  const [major = 0, minor = 0, patch = 0] = version;
  if (major < 8 || (major === 8 && minor === 0 && patch < 13)) {
    throw new Error('MySQL 8.0.13+ is required for UUID expression defaults; detected ' + server.version);
  }
  if (!server.database_name) throw new Error('The connection URL does not select a database.');
  const [tables] = await db.query(
    'SELECT TABLE_NAME, ENGINE, TABLE_COLLATION FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = \'BASE TABLE\'',
  );
  const byName = new Map(tables.map(row => [String(row.TABLE_NAME).toLowerCase(), row]));
  const missing = requiredTables.filter(name => !byName.has(name));
  if (missing.length) throw new Error('Missing schema tables: ' + missing.join(', '));
  for (const name of requiredTables) {
    const table = byName.get(name);
    if (String(table.ENGINE).toUpperCase() !== 'INNODB') throw new Error(name + ' must use InnoDB.');
    if (!String(table.TABLE_COLLATION || '').toLowerCase().startsWith('utf8mb4_')) {
      throw new Error(name + ' must use utf8mb4 collation.');
    }
  }
  await db.query('CREATE TEMPORARY TABLE _razsahra_uuid_probe (id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY) ENGINE=InnoDB');
  await db.query('INSERT INTO _razsahra_uuid_probe () VALUES ()');
  const [[probe]] = await db.query('SELECT id FROM _razsahra_uuid_probe LIMIT 1');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(probe.id))) {
    throw new Error('UUID expression default did not generate a valid UUID.');
  }
  await db.query('DROP TEMPORARY TABLE _razsahra_uuid_probe');
  console.log('MySQL connection check passed.');
  console.log('Server:', server.version);
  console.log('Database selected: yes (name intentionally omitted).');
  console.log('Required CMS tables:', requiredTables.length + '/' + requiredTables.length);
  console.log('Storage engine, utf8mb4 collation, and UUID defaults: passed.');
} finally {
  await db.end();
}
