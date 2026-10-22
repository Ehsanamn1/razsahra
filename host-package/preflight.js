import "dotenv/config";
import mysql from "mysql2/promise";

const errors = [];
const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 20) errors.push("Node.js 20+ is required.");
for (const key of ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"]) {
  if (!String(process.env[key] || "").trim()) errors.push(key + " is missing.");
}
const originRaw = String(process.env.MEDAR_API_ORIGIN || "").trim();
let origin = "";
try {
  const parsed = new URL(originRaw);
  if (parsed.protocol !== "https:" || parsed.pathname !== "/" || parsed.search || parsed.hash || parsed.username || parsed.password) {
    errors.push("MEDAR_API_ORIGIN must be an HTTPS origin only, without path, query, fragment, or credentials.");
  } else {
    origin = parsed.origin;
  }
} catch {
  errors.push("MEDAR_API_ORIGIN must be a valid HTTPS origin.");
}
if (errors.length) {
  console.error("Preflight failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}

let db;
try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000,
    charset: "utf8mb4"
  });
  const [tables] = await db.query(
    "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
    [process.env.DB_NAME]
  );
  const names = new Set(tables.map(row => row.TABLE_NAME));
  const required = ["users", "sessions", "auth_attempts", "site_pages", "articles", "site_settings", "inquiries", "audit_logs", "app_catalog"];
  const missing = required.filter(name => !names.has(name));
  if (missing.length) throw new Error("Database schema missing tables: " + missing.join(", ") + ". Run npm run install:db first.");
  await db.query("SELECT 1");
  console.log("PASS: MySQL connection and required schema tables.");
} catch (error) {
  console.error("FAIL: MySQL/schema check:", String(error?.message || error).slice(0, 250));
  process.exitCode = 1;
} finally {
  if (db) await db.end().catch(() => {});
}

try {
  const response = await fetch(origin + "/api/health", { signal: AbortSignal.timeout(12000), headers: { accept: "application/json" } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok !== true) throw new Error("health endpoint returned HTTP " + response.status + " or a non-healthy payload");
  console.log("PASS: Medar operational API reachable over HTTPS.");
} catch (error) {
  console.error("FAIL: Medar operational API health check:", String(error?.message || error).slice(0, 250));
  process.exitCode = 1;
}

if (process.exitCode) process.exit(process.exitCode);
console.log("Preflight passed. This verifies host configuration, not the hosting provider's Node.js support.");
