import mysql from "mysql2/promise";

const enc = new TextEncoder();
const SESSION_DAYS = 14;
const PASSWORD_ITERATIONS = 310000;

let cachedPool = null;
let cachedPoolUrl = null;
function mysqlPool(url) {
  if (!url) throw new Error("mysql_url_missing");
  if (!cachedPool || cachedPoolUrl !== url) {
    if (cachedPool) void cachedPool.end().catch(() => undefined);
    cachedPoolUrl = url;
    cachedPool = mysql.createPool({
      uri: url,
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_POOL_SIZE || 8),
      queueLimit: 0,
      enableKeepAlive: true,
      timezone: "Z",
      charset: "utf8mb4",
      decimalNumbers: true,
    });
  }
  return cachedPool;
}
function normalizeMysqlSql(input) {
  let sql = String(input)
    .replace(/::jsonb\\b/gi, "")
    .replace(/::int\\b/gi, "")
    .replace(/jsonb_build_object\\s*\\(/gi, "JSON_OBJECT(")
    .replace(/now\\(\\)\\s*\\+\\s*\\(\\$(\\d+)\\s*\\*\\s*interval\\s*'1 day'\\)/gi, "DATE_ADD(CURRENT_TIMESTAMP(3), INTERVAL $$1 DAY)")
    .replace(/now\\(\\)\\s*-\\s*interval\\s*'(\\d+)\\s+minutes?'/gi, "DATE_SUB(CURRENT_TIMESTAMP(3), INTERVAL $1 MINUTE)")
    .replace(/now\\(\\)\\s*-\\s*interval\\s*'(\\d+)\\s+hours?'/gi, "DATE_SUB(CURRENT_TIMESTAMP(3), INTERVAL $1 HOUR)")
    .replace(/now\\(\\)\\s*-\\s*interval\\s*'(\\d+)\\s+days?'/gi, "DATE_SUB(CURRENT_TIMESTAMP(3), INTERVAL $1 DAY)")
    .replace(/now\\(\\)/gi, "CURRENT_TIMESTAMP(3)")
    .replace(/published_at\\s+DESC\\s+NULLS\\s+LAST/gi, "(published_at IS NULL), published_at DESC")
    .replace(/site_settings\\s*\\(\\s*key\\s*,/gi, "site_settings (`key`,")
    .replace(/\\bWHERE\\s+key\\s*=/gi, "WHERE `key` =")
    .replace(/\\bAND\\s+key\\s*=/gi, "AND `key` =")
    .replace(/\\bSELECT\\s+key\\s*,/gi, "SELECT `key`,")
    .replace(/\\bORDER BY\\s+key\\b/gi, "ORDER BY `key`");
  if (/ON CONFLICT\\s*\\([^)]*\\)\\s*DO NOTHING/i.test(sql)) {
    sql = sql.replace(/ON CONFLICT\\s*\\([^)]*\\)\\s*DO NOTHING/ig, "");
    sql = sql.replace(/^\\s*INSERT\\s+INTO\\b/i, "INSERT IGNORE INTO");
  } else {
    sql = sql.replace(/ON CONFLICT\\s*\\([^)]*\\)\\s*DO UPDATE SET/ig, "ON DUPLICATE KEY UPDATE");
    sql = sql.replace(/EXCLUDED\\.([a-z_][a-z0-9_]*)/ig, "VALUES($1)");
  }
  return sql;
}
async function q(sql, text, params = []) {
  const returningMatch = String(text).match(/\\s+RETURNING\\s+([\\s\\S]+)$/i);
  const returning = returningMatch?.[1]?.trim() || "";
  let statement = normalizeMysqlSql(returningMatch ? String(text).slice(0, returningMatch.index) : text);
  const values = [];
  statement = statement.replace(/\\$(\\d+)/g, (_match, position) => {
    values.push(params[Number(position) - 1]);
    return "?";
  });
  const tableMatch = statement.match(/^\\s*(INSERT\\s+(?:IGNORE\\s+)?INTO|UPDATE|DELETE\\s+FROM)\\s+`?([a-z_][a-z0-9_]*)`?/i);
  const table = tableMatch?.[2]?.toLowerCase() || "";
  let priorRows = null;
  if (returning && /^\\s*DELETE\\s+FROM\\s+sessions\\b/i.test(statement)) {
    const hash = params[0];
    const [found] = await sql.execute("SELECT " + returning + " FROM sessions WHERE token_hash = ? LIMIT 1", [hash]);
    priorRows = found;
  }
  try {
    const [result] = await sql.execute(statement, values);
    if (!returning) return Array.isArray(result) ? result : result;
    if (/^\\s*DELETE\\s+FROM\\s+sessions\\b/i.test(statement)) return priorRows || [];
    let where = "";
    let lookup = [];
    if (table === "users") {
      if (/^\\s*INSERT/i.test(statement) || /WHERE\\s+username\\s*=\\s*'ehsan-admin'/i.test(statement)) {
        where = "username = ?"; lookup = [params[0]];
      } else {
        where = "id = ?"; lookup = [params[2]];
      }
    } else if (table === "site_pages") {
      where = "slug = ? AND language = ?"; lookup = [params[5], params[6]];
    } else if (table === "articles") {
      where = "slug = ? AND language = ?"; lookup = [params[0], params[1]];
    } else if (table === "inquiries") {
      where = "id = ?"; lookup = /^\\s*INSERT/i.test(statement) ? [params[7]] : [params[1]];
    } else if (table === "app_catalog") {
      where = "slug = ?"; lookup = [params[0]];
    } else if (table === "site_settings") {
      where = "`key` = ?"; lookup = [params[0]];
    }
    if (!where) throw new Error("mysql_returning_adapter_missing_for_" + table);
    const [rows] = await sql.execute("SELECT " + returning + " FROM `" + table + "` WHERE " + where + " LIMIT 1", lookup);
    return rows;
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") error.code = "23505";
    throw error;
  }
}
async function createFirstAdmin(pool, params) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // A unique, locked settings row serializes concurrent first-admin claims.
    await connection.execute("INSERT IGNORE INTO site_settings (`key`, value_json, updated_at) VALUES ('admin.bootstrap.lock', JSON_OBJECT(), CURRENT_TIMESTAMP(3))");
    await connection.execute("SELECT `key` FROM site_settings WHERE `key` = 'admin.bootstrap.lock' FOR UPDATE");
    const [claims] = await connection.execute("SELECT `key` FROM site_settings WHERE `key` = 'admin.bootstrap.claimed' LIMIT 1");
    const [admins] = await connection.execute("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (claims.length || admins.length) {
      await connection.rollback();
      return [];
    }
    await connection.execute("INSERT INTO users (username,email,display_name,password_hash,role,status) VALUES (?,?,?,?, 'admin','active')", params);
    await connection.execute("INSERT INTO site_settings (`key`,value_json,updated_at) VALUES ('admin.bootstrap.claimed',JSON_OBJECT('claimed_at',CURRENT_TIMESTAMP(3)),CURRENT_TIMESTAMP(3)) ON DUPLICATE KEY UPDATE value_json=VALUES(value_json),updated_at=CURRENT_TIMESTAMP(3)");
    const [rows] = await connection.execute("SELECT id,username,email,display_name,role,status,created_at,last_login_at FROM users WHERE username = ? LIMIT 1", [params[0]]);
    await connection.commit();
    return rows;
  } catch (error) {
    await connection.rollback();
    if (error && error.code === "ER_DUP_ENTRY") error.code = "23505";
    throw error;
  } finally {
    connection.release();
  }
}


function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin",
      "x-frame-options": "DENY",
      ...extra
    }
  });
}
function fail(message, status = 400, code = "bad_request") {
  return json({ ok: false, error: { code, message } }, status);
}
function b64url(bytes) {
  let raw = "";
  for (let i = 0; i < bytes.length; i++) raw += String.fromCharCode(bytes[i]);
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromB64url(value) {
  const text = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(text + "=".repeat((4 - text.length % 4) % 4));
  return Uint8Array.from(raw, (ch) => ch.charCodeAt(0));
}
async function digest(value) {
  return b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(value))));
}
function randomToken(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return b64url(bytes);
}
function constantTimeEqual(left, right) {
  const a = enc.encode(String(left == null ? "" : left));
  const b = enc.encode(String(right == null ? "" : right));
  let mismatch = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) mismatch |= (a[i] || 0) ^ (b[i] || 0);
  return mismatch === 0;
}
async function bootstrapSecretMatches(provided, configured) {
  if (!provided || !configured || provided.length > 512 || configured.length < 32) return false;
  const [providedHash, configuredHash] = await Promise.all([digest(provided), digest(configured)]);
  return constantTimeEqual(providedHash, configuredHash);
}
async function verifyPassword(password, encoded) {
  try {
    const [algorithm, count, saltText, hashText] = String(encoded || "").split("$");
    const iterations = Number(count);
    if (algorithm !== "pbkdf2" || !Number.isInteger(iterations) || iterations < 100000 || iterations > 1000000) return false;
    const salt = fromB64url(saltText);
    const expected = fromB64url(hashText);
    const material = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, material, expected.length * 8));
    if (actual.length !== expected.length) return false;
    let mismatch = 0;
    for (let i = 0; i < actual.length; i++) mismatch |= actual[i] ^ expected[i];
    return mismatch === 0;
  } catch { return false; }
}
function cookies(request) {
  const found = {};
  (request.headers.get("cookie") || "").split(";").forEach((part) => {
    const index = part.indexOf("=");
    if (index > 0) found[part.slice(0, index).trim()] = part.slice(index + 1).trim();
  });
  return found;
}
function sessionCookie(token, request, clear = false) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return clear
    ? "rs_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" + secure
    : "rs_session=" + token + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + (SESSION_DAYS * 86400) + secure;
}
function userPublic(row) {
  return { id: row.id, username: row.username, email: row.email, display_name: row.display_name, role: row.role, status: row.status, created_at: row.created_at, last_login_at: row.last_login_at };
}
function text(value, max = 5000) { return String(value == null ? "" : value).trim().slice(0, max); }
function object(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value === "string") { try { const parsed = JSON.parse(value); if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed; } catch {} }
  return {};
}
async function bodyJson(request) {
  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > 65536) throw new Error("too_large");
  const raw = await request.text();
  if (enc.encode(raw).byteLength > 65536) throw new Error("too_large");
  let result;
  try { result = JSON.parse(raw); } catch { throw new Error("invalid_body"); }
  if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error("invalid_body");
  return result;
}
function originOkay(request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
function cleanArticleHtml(value) {
  return text(value, 50000)
    .replace(/<(script|style|iframe|object|embed|svg|math|form)[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(?!\/?(?:p|h3|h4|ul|ol|li|strong|b|em|i|blockquote|br)\b)[^>]*>/gi, "")
    .replace(/<(\/?)(p|h3|h4|ul|ol|li|strong|b|em|i|blockquote|br)\b[^>]*>/gi, "<$1$2>");
}
async function getActor(request, sql) {
  const token = cookies(request).rs_session;
  if (!token || token.length > 128) return null;
  const tokenHash = await digest(token);
  const rows = await q(sql, "SELECT u.id,u.username,u.email,u.display_name,u.role,u.status,u.created_at,u.last_login_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now() AND u.status='active' LIMIT 1", [tokenHash]);
  return rows[0] || null;
}
async function mustAdmin(request, sql) {
  const actor = await getActor(request, sql);
  if (!actor) return { error: fail("برای ادامه وارد حساب خود شوید.", 401, "unauthenticated") };
  if (actor.role !== "admin") return { error: fail("این بخش فقط برای مدیر سایت در دسترس است.", 403, "forbidden") };
  return { actor };
}
async function logEvent(sql, actorId, action, targetType = "", targetId = "", metadata = {}, request = null) {
  const ip = request && request.headers.get("CF-Connecting-IP");
  const hash = ip ? await digest(ip) : null;
  await q(sql, "INSERT INTO audit_logs(actor_id,action,target_type,target_id,metadata,ip_hash) VALUES ($1,$2,$3,$4,$5::jsonb,$6)", [actorId || null, action, targetType, targetId, JSON.stringify(metadata), hash]);
}
async function newSession(sql, user, request) {
  const token = randomToken(32);
  const hash = await digest(token);
  const ip = request.headers.get("CF-Connecting-IP");
  const ipHash = ip ? await digest(ip) : null;
  await q(sql, "INSERT INTO sessions(token_hash,user_id,expires_at,ip_hash,user_agent) VALUES ($1,$2,now()+($3 * interval '1 day'),$4,$5)", [hash, user.id, SESSION_DAYS, ipHash, text(request.headers.get("user-agent"), 512)]);
  await q(sql, "DELETE FROM sessions WHERE expires_at<now()");
  return token;
}
async function rateOkay(sql, request, identifier) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const bucket = await digest(ip + "|" + identifier.toLowerCase());
  const rows = await q(sql, "SELECT count(*)::int AS attempts FROM auth_attempts WHERE bucket_hash=$1 AND happened_at>now()-interval '15 minutes'", [bucket]);
  await q(sql, "INSERT INTO auth_attempts(bucket_hash) VALUES ($1)", [bucket]);
  await q(sql, "DELETE FROM auth_attempts WHERE happened_at<now()-interval '2 days'");
  return Number(rows[0]?.attempts || 0) < 8;
}


async function proxyMedar(request, path) {
  if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.", 403, "origin_denied");
  const upstream = new URL("https://medar-ops.dengxiao445.workers.dev");
  const forwardedPath = path.slice("medar/".length);
  if (!forwardedPath.startsWith("api/")) return fail("مسیر مدار پیدا نشد.", 404, "not_found");
  const target = new URL("/" + forwardedPath, upstream);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("cf-connecting-ip");
  if (request.headers.has("origin")) headers.set("origin", upstream.origin);
  const method = request.method.toUpperCase();
  const init = { method, headers, redirect: "manual" };
  if (method !== "GET" && method !== "HEAD") init.body = request.body;
  const proxiedRequest = new Request(target.toString(), init);
  const upstreamResponse = await fetch(proxiedRequest);
  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete("content-length");
  responseHeaders.set("cache-control", "no-store");
  responseHeaders.set("x-content-type-options", "nosniff");
  responseHeaders.set("referrer-policy", "same-origin");
  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders
  });
}

async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, "").replace(/\/+$/, "");
  const method = request.method.toUpperCase();
  if (path.startsWith("medar/") && method !== "OPTIONS") return await proxyMedar(request, path);
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-methods": "GET,POST,PUT,PATCH,OPTIONS", "access-control-allow-headers": "content-type" } });
  if (!env.MYSQL_URL) return fail("سرویس حساب کاربری هنوز در محیط میزبانی پیکربندی نشده است.", 503, "backend_not_configured");
  let sql;
  try { sql = mysqlPool(env.MYSQL_URL); } catch { return fail("اتصال پایگاه‌داده پیکربندی نشده است.", 503, "database_not_configured"); }

  if (path === "health" && method === "GET") {
    try {
      const rows = await q(sql, "SELECT now() AS server_time,(SELECT count(*)::int FROM users) AS registered_users");
      return json({ ok: true, service: "raz-sahra-api", database: "connected", registered_users: rows[0].registered_users, time: rows[0].server_time });
    } catch { return fail("ساختار دیتابیس اجرا نشده یا اتصال ناموفق است.", 503, "database_unavailable"); }
  }


  if (path === "auth/bootstrap-admin" && method === "POST") {
    if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.", 403, "origin_denied");
    const configuredSecret = String(env.ADMIN_BOOTSTRAP_SECRET || "");
    if (configuredSecret.length < 32) return fail("راه‌اندازی اولیه مدیر در تنظیمات میزبان فعال نشده است.", 503, "bootstrap_not_configured");
    if (!(await rateOkay(sql, request, "bootstrap-admin"))) return fail("تعداد تلاش‌ها زیاد است. ۱۵ دقیقه دیگر دوباره امتحان کنید.", 429, "rate_limited");
    const providedSecret = request.headers.get("x-admin-bootstrap-secret") || "";
    if (!(await bootstrapSecretMatches(providedSecret, configuredSecret))) return fail("کلید راه‌اندازی معتبر نیست.", 403, "bootstrap_secret_invalid");

    let data;
    try { data = await bodyJson(request); } catch { return fail("اطلاعات راه‌اندازی معتبر نیست.", 400, "invalid_body"); }
    const username = text(data.username, 48).toLowerCase();
    const emailValue = text(data.email, 254).toLowerCase();
    const email = emailValue || null;
    const displayName = text(data.display_name, 120);
    const password = String(data.password || "");
    if (!/^[a-z0-9][a-z0-9_.-]{2,47}$/.test(username)) return fail("نام کاربری باید ۳ تا ۴۸ نویسه انگلیسی، عدد، نقطه، خط تیره یا زیرخط باشد.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("نشانی ایمیل معتبر وارد کنید.");
    if (password.length < 6 || password.length > 128) return fail("رمز عبور مدیر باید ۶ تا ۱۲۸ نویسه داشته باشد.");
    const salt = randomToken(16);
    const material = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const hash = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromB64url(salt), iterations: PASSWORD_ITERATIONS }, material, 256));
    const passwordHash = "pbkdf2$" + PASSWORD_ITERATIONS + "$" + salt + "$" + b64url(hash);
    const seedPasswordHash = "pbkdf2$310000$6PwV9dRi58j7JAYz4QQv2g$InSIbvodVbZTduNAidXXNP0uocaMCfgCO3OonhyMJzo";
    let rows;
    let bootstrapPath = "seed_reset";
    try {
      // Prefer resetting the known, untouched seed admin. Keep this as one UPDATE,
      // rather than mixing multiple writes to users in sibling data-modifying CTEs.
      rows = await q(sql,
        "UPDATE users SET username=$1,email=$2,display_name=$3,password_hash=$4,status='active',updated_at=now() WHERE username='ehsan-admin' AND role='admin' AND password_hash=$5 AND NOT EXISTS (SELECT 1 FROM site_settings WHERE key='admin.bootstrap.claimed') RETURNING id,username,email,display_name,role,status,created_at,last_login_at",
        [username, email, displayName || username, passwordHash, seedPasswordHash]);

      if (!rows[0]) {
        bootstrapPath = "first_admin";
        // On a clean database, claim bootstrap and create the first admin in one
        // statement. This path deliberately cannot run while any admin already exists.
        rows = await createFirstAdmin(sql, [username, email, displayName || username, passwordHash]);
      }
    } catch (error) {
      console.error("Raz Sahra admin bootstrap database step failed", {
        step: bootstrapPath,
        code: String(error?.code || "unknown"),
        message: String(error?.message || "unknown").slice(0, 180)
      });
      if (String(error?.code) === "23505") return fail("این نام کاربری یا ایمیل قبلاً ثبت شده است.", 409, "account_exists");
      return fail("ذخیره حساب مدیر در پایگاه‌داده انجام نشد. کد خطا: bootstrap_database_failed", 500, "bootstrap_database_failed");
    }

    const user = rows[0];
    if (!user) return fail("راه‌اندازی مدیر قبلاً انجام شده یا حساب مدیر از قبل وجود دارد. از صفحه ورود استفاده کنید.", 409, "bootstrap_already_used");

    // Mark a seed-admin reset as claimed after its password hash and username have
    // changed. The changed hash means it cannot be reset through this route again.
    try {
      await q(sql,
        "INSERT INTO site_settings(key,value_json,updated_at) VALUES ('admin.bootstrap.claimed',jsonb_build_object('claimed_at',now()),now()) ON CONFLICT (key) DO NOTHING");
    } catch (error) {
      console.error("Raz Sahra admin bootstrap claim marker failed", {
        code: String(error?.code || "unknown"),
        message: String(error?.message || "unknown").slice(0, 180)
      });
      // The account itself has already been updated, so don't obscure the next
      // step with an internal-server error. Its old seed hash no longer matches.
    }

    let token;
    try {
      token = await newSession(sql, user, request);
    } catch (error) {
      console.error("Raz Sahra admin bootstrap session step failed", {
        code: String(error?.code || "unknown"),
        message: String(error?.message || "unknown").slice(0, 180)
      });
      return fail("حساب مدیر ذخیره شد، اما ساخت نشست ورود کامل نشد. از صفحه ورود وارد شوید.", 500, "bootstrap_session_failed");
    }
    try {
      await logEvent(sql, user.id, "auth.bootstrap_admin", "user", user.id, { username }, request);
    } catch (error) {
      console.error("Raz Sahra admin bootstrap audit log failed", {
        code: String(error?.code || "unknown"),
        message: String(error?.message || "unknown").slice(0, 180)
      });
    }
    return json({ ok: true, user: userPublic(user), redirect: "admin" }, 201, { "set-cookie": sessionCookie(token, request) });
  }

  if (path === "auth/register" && method === "POST") {
    if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.", 403, "origin_denied");
    let data;
    try { data = await bodyJson(request); } catch { return fail("اطلاعات ثبت‌نام معتبر نیست.", 400, "invalid_body"); }
    const username = text(data.username, 48).toLowerCase();
    const email = text(data.email, 254).toLowerCase();
    const displayName = text(data.display_name, 120);
    const password = String(data.password || "");
    if (!/^[a-z0-9][a-z0-9_.-]{2,47}$/.test(username)) return fail("نام کاربری باید ۳ تا ۴۸ نویسه انگلیسی، عدد، نقطه، خط تیره یا زیرخط باشد.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("نشانی ایمیل معتبر وارد کنید.");
    if (password.length < 12 || password.length > 128) return fail("رمز عبور باید حداقل ۱۲ نویسه داشته باشد.");
    if (!(await rateOkay(sql, request, "register:" + username))) return fail("تعداد تلاش‌ها زیاد است. کمی بعد دوباره امتحان کنید.", 429, "rate_limited");
    const salt = randomToken(16);
    const material = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const hash = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromB64url(salt), iterations: PASSWORD_ITERATIONS }, material, 256));
    const passwordHash = "pbkdf2$" + PASSWORD_ITERATIONS + "$" + salt + "$" + b64url(hash);
    try {
      const rows = await q(sql, "INSERT INTO users(username,email,display_name,password_hash,role,status) VALUES ($1,$2,$3,$4,'user','active') RETURNING id,username,email,display_name,role,status,created_at,last_login_at", [username,email,displayName || username,passwordHash]);
      const user = rows[0];
      const token = await newSession(sql, user, request);
      await logEvent(sql, user.id, "auth.register", "user", user.id, { username }, request);
      return json({ ok: true, user: userPublic(user), redirect: "account" }, 201, { "set-cookie": sessionCookie(token, request) });
    } catch (error) {
      if (String(error?.code) === "23505") return fail("این نام کاربری یا ایمیل قبلاً ثبت شده است.", 409, "account_exists");
      return fail("ثبت‌نام انجام نشد؛ ورودی‌ها را بررسی و دوباره تلاش کنید.", 500, "registration_failed");
    }
  }

  if (path === "auth/login" && method === "POST") {
    if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.", 403, "origin_denied");
    let data;
    try { data = await bodyJson(request); } catch { return fail("اطلاعات ورود معتبر نیست.", 400, "invalid_body"); }
    const identifier = text(data.identifier || data.username || data.email, 254).toLowerCase();
    const password = String(data.password || "");
    if (!identifier || !password || password.length > 128) return fail("نام کاربری و رمز عبور را وارد کنید.");
    if (!(await rateOkay(sql, request, "login:" + identifier))) return fail("تعداد تلاش‌های ناموفق زیاد است. ۱۵ دقیقه دیگر دوباره تلاش کنید.", 429, "rate_limited");
    const rows = await q(sql, "SELECT id,username,email,display_name,password_hash,role,status,created_at,last_login_at FROM users WHERE username=$1 OR email=$1 LIMIT 1", [identifier]);
    const user = rows[0];
    const valid = user ? await verifyPassword(password, user.password_hash) : await verifyPassword(password, "pbkdf2$310000$Y3lqQV9TdG9yZU5vdEFSZWFsU2FsdA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    if (!user || !valid || user.status !== "active") return fail("نام کاربری یا رمز عبور نادرست است.", 401, "invalid_credentials");
    await q(sql, "UPDATE users SET last_login_at=now(),updated_at=now() WHERE id=$1", [user.id]);
    const token = await newSession(sql, user, request);
    await logEvent(sql, user.id, "auth.login", "user", user.id, { role: user.role }, request);
    return json({ ok: true, user: userPublic(user), redirect: user.role === "admin" ? "admin" : "account" }, 200, { "set-cookie": sessionCookie(token, request) });
  }

  if (path === "auth/me" && method === "GET") {
    const actor = await getActor(request, sql);
    return json({ ok: true, user: actor ? userPublic(actor) : null });
  }
  if (path === "auth/logout" && method === "POST") {
    if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.", 403, "origin_denied");
    const token = cookies(request).rs_session;
    if (token) {
      const hash = await digest(token);
      const rows = await q(sql, "DELETE FROM sessions WHERE token_hash=$1 RETURNING user_id", [hash]);
      if (rows[0]) await logEvent(sql, rows[0].user_id, "auth.logout", "user", rows[0].user_id, {}, request);
    }
    return json({ ok: true }, 200, { "set-cookie": sessionCookie("", request, true) });
  }

  if (path === "public/pages" && method === "GET") {
    const slug = text(url.searchParams.get("slug"), 100);
    const language = url.searchParams.get("lang") === "en" ? "en" : "fa";
    if (!slug) return fail("شناسه صفحه لازم است.");
    const rows = await q(sql, "SELECT slug,language,title,description,content_json FROM site_pages WHERE slug=$1 AND language=$2 AND status='published' LIMIT 1", [slug,language]);
    return json({ ok: true, page: rows[0] || null });
  }
  if (path === "public/articles" && method === "GET") {
    const language = url.searchParams.get("lang") === "en" ? "en" : "fa";
    const rows = await q(sql, "SELECT slug,language,title,excerpt,content,cover_image,status,published_at FROM articles WHERE language=$1 AND status='published' ORDER BY published_at DESC NULLS LAST,created_at DESC", [language]);
    return json({ ok: true, articles: rows.map((item) => ({ ...item, content: cleanArticleHtml(item.content) })) });
  }
  if (path === "public/apps" && method === "GET") {
    const rows = await q(sql, "SELECT slug,name,description,app_url,download_url,icon_url,sort_order FROM app_catalog WHERE active=true ORDER BY sort_order,name");
    return json({ ok: true, apps: rows });
  }
  if (path === "inquiries" && method === "POST") {
    if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.", 403, "origin_denied");
    if (!(await rateOkay(sql, request, "inquiry"))) return fail("تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.", 429, "rate_limited");
    let data;
    try { data = await bodyJson(request); } catch { return fail("اطلاعات فرم معتبر نیست.", 400, "invalid_body"); }
    const name=text(data.name,160), email=text(data.email,254), phone=text(data.phone,60), company=text(data.company,180), message=text(data.message,8000);
    if (name.length < 2 || (!email && !phone) || message.length < 8) return fail("نام، راه ارتباطی و توضیح درخواست را کامل کنید.");
    const rows = await q(sql, "INSERT INTO inquiries(id,kind,name,email,phone,company,message,payload_json) VALUES ($8,$1,$2,$3,$4,$5,$6,$7::jsonb) RETURNING id,created_at", [text(data.kind || "contact",40),name,email,phone,company,message,JSON.stringify(object(data.payload)),crypto.randomUUID()]);
    return json({ ok: true, inquiry: rows[0] }, 201);
  }

  if (path.startsWith("admin/")) {
    const auth = await mustAdmin(request, sql);
    if (auth.error) return auth.error;
    const actor = auth.actor;

    if (path === "admin/overview" && method === "GET") {
      const results = await Promise.all([
        q(sql, "SELECT count(*)::int AS count FROM users"),
        q(sql, "SELECT count(*)::int AS count FROM site_pages"),
        q(sql, "SELECT count(*)::int AS count FROM articles"),
        q(sql, "SELECT count(*)::int AS count FROM inquiries WHERE status='new'"),
        q(sql, "SELECT count(*)::int AS count FROM sessions WHERE expires_at>now()"),
        q(sql, "SELECT id,action,target_type,target_id,metadata,created_at FROM audit_logs ORDER BY created_at DESC LIMIT 8")
      ]);
      return json({ ok: true, stats: { users: results[0][0].count, pages: results[1][0].count, articles: results[2][0].count, new_inquiries: results[3][0].count, active_sessions: results[4][0].count }, recent_activity: results[5] });
    }
    if (path === "admin/pages" && method === "GET") {
      const rows = await q(sql, "SELECT slug,language,title,description,content_json,status,updated_at,updated_by FROM site_pages ORDER BY language,slug");
      return json({ ok: true, pages: rows });
    }
    if (path === "admin/pages" && method === "PUT") {
      if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.",403,"origin_denied");
      let data; try { data = await bodyJson(request); } catch { return fail("محتوا معتبر نیست."); }
      const slug=text(data.slug,100), language=data.language === "en" ? "en" : "fa", title=text(data.title,220), description=text(data.description,5000), content=object(data.content_json), status=data.status === "draft" ? "draft" : "published";
      if (!slug || !title) return fail("شناسه و عنوان صفحه الزامی است.");
      const rows = await q(sql, "UPDATE site_pages SET title=$1,description=$2,content_json=$3::jsonb,status=$4,updated_at=now(),updated_by=$5 WHERE slug=$6 AND language=$7 RETURNING slug,language,title,description,content_json,status,updated_at", [title,description,JSON.stringify(content),status,actor.id,slug,language]);
      if (!rows[0]) return fail("صفحه موردنظر پیدا نشد.",404,"not_found");
      await logEvent(sql,actor.id,"content.page.update","page",slug,{language,status},request);
      return json({ok:true,page:rows[0]});
    }
    if (path === "admin/articles" && method === "GET") {
      const rows = await q(sql, "SELECT id,slug,language,title,excerpt,content,cover_image,status,published_at,created_at,updated_at FROM articles ORDER BY language,updated_at DESC");
      return json({ok:true,articles:rows});
    }
    if (path === "admin/articles" && method === "PUT") {
      if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.",403,"origin_denied");
      let data; try { data = await bodyJson(request); } catch { return fail("مقاله معتبر نیست."); }
      const slug=text(data.slug,140), language=data.language === "en" ? "en" : "fa", title=text(data.title,240), excerpt=text(data.excerpt,3000), content=text(data.content,50000), cover=text(data.cover_image,1000), status=data.status === "published" ? "published" : "draft";
      if (!/^[a-z0-9][a-z0-9-]{1,139}$/.test(slug) || !title) return fail("شناسه انگلیسی و عنوان مقاله معتبر نیست.");
      if (cover && !/^https:\/\//i.test(cover) && !/^\/assets\//.test(cover)) return fail("نشانی تصویر باید HTTPS یا مسیر داخلی /assets باشد.");
      const rows = await q(sql, "INSERT INTO articles(slug,language,title,excerpt,content,cover_image,status,published_at,updated_at,updated_by) VALUES ($1,$2,$3,$4,$5,$6,$7,CASE WHEN $7='published' THEN now() ELSE NULL END,now(),$8) ON CONFLICT(slug,language) DO UPDATE SET title=EXCLUDED.title,excerpt=EXCLUDED.excerpt,content=EXCLUDED.content,cover_image=EXCLUDED.cover_image,status=EXCLUDED.status,published_at=CASE WHEN EXCLUDED.status='published' THEN COALESCE(articles.published_at,now()) ELSE NULL END,updated_at=now(),updated_by=EXCLUDED.updated_by RETURNING id,slug,language,title,excerpt,content,cover_image,status,published_at,updated_at", [slug,language,title,excerpt,content,cover,status,actor.id]);
      await logEvent(sql,actor.id,"content.article.save","article",slug,{language,status},request);
      return json({ok:true,article:rows[0]});
    }
    if (path === "admin/users" && method === "GET") {
      const rows = await q(sql, "SELECT id,username,email,display_name,role,status,created_at,last_login_at FROM users ORDER BY created_at DESC LIMIT 500");
      return json({ok:true,users:rows});
    }
    if (path === "admin/users/role" && method === "PATCH") {
      if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.",403,"origin_denied");
      let data; try { data = await bodyJson(request); } catch { return fail("درخواست نامعتبر است."); }
      const id=text(data.user_id,80), role=data.role === "admin" ? "admin" : "user", status=data.status === "suspended" ? "suspended" : "active";
      if (!id) return fail("شناسه کاربر لازم است.");
      if (id === actor.id && (role !== "admin" || status !== "active")) return fail("برای جلوگیری از قفل شدن پنل، نمی‌توانید دسترسی یا وضعیت حساب خود را کاهش دهید.",409,"self_lockout_denied");
      if (role !== "admin" || status !== "active") {
        const target=await q(sql,"SELECT role,status FROM users WHERE id=$1 LIMIT 1",[id]);
        if (target[0]?.role === "admin" && target[0]?.status === "active") {
          const counts=await q(sql,"SELECT count(*)::int AS count FROM users WHERE role='admin' AND status='active'");
          if (counts[0].count <= 1) return fail("حداقل یک مدیر فعال باید باقی بماند.",409,"last_admin");
        }
      }
      const rows=await q(sql,"UPDATE users SET role=$1,status=$2,updated_at=now() WHERE id=$3 RETURNING id,username,email,display_name,role,status,created_at,last_login_at",[role,status,id]);
      if (!rows[0]) return fail("کاربر پیدا نشد.",404,"not_found");
      await logEvent(sql,actor.id,"user.access.update","user",id,{role,status},request);
      return json({ok:true,user:rows[0]});
    }
    if (path === "admin/inquiries" && method === "GET") {
      const rows=await q(sql,"SELECT id,kind,name,email,phone,company,message,status,created_at,updated_at FROM inquiries ORDER BY CASE status WHEN 'new' THEN 0 WHEN 'reviewing' THEN 1 ELSE 2 END,created_at DESC LIMIT 500");
      return json({ok:true,inquiries:rows});
    }
    if (path === "admin/inquiries/status" && method === "PATCH") {
      if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.",403,"origin_denied");
      let data; try { data=await bodyJson(request); } catch { return fail("درخواست نامعتبر است."); }
      const id=text(data.id,80), status=["new","reviewing","answered","archived"].includes(data.status) ? data.status : "new";
      const rows=await q(sql,"UPDATE inquiries SET status=$1,updated_at=now() WHERE id=$2 RETURNING id,status",[status,id]);
      if (!rows[0]) return fail("درخواست پیدا نشد.",404,"not_found");
      await logEvent(sql,actor.id,"inquiry.status.update","inquiry",id,{status},request);
      return json({ok:true,inquiry:rows[0]});
    }
    if (path === "admin/apps" && method === "GET") {
      const rows=await q(sql,"SELECT slug,name,description,app_url,download_url,icon_url,active,sort_order,metadata,updated_at FROM app_catalog ORDER BY sort_order,name");
      return json({ok:true,apps:rows});
    }
    if (path === "admin/apps" && method === "PUT") {
      if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.",403,"origin_denied");
      let data; try { data=await bodyJson(request); } catch { return fail("اطلاعات اپ معتبر نیست."); }
      const slug=text(data.slug,80), name=text(data.name,180), description=text(data.description,3000), appUrl=text(data.app_url,1000), downloadUrl=text(data.download_url,1000), icon=text(data.icon_url,1000), active=data.active === true;
      if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(slug) || !name) return fail("شناسه یا نام اپ معتبر نیست.");
      for (const link of [appUrl,downloadUrl,icon]) if (link && !/^https:\/\//i.test(link) && !/^\/[a-z0-9/_\-.?=&%]*$/i.test(link)) return fail("پیوند اپ باید HTTPS یا مسیر داخلی باشد.");
      const sort=Number.isFinite(Number(data.sort_order)) ? Number(data.sort_order) : 100;
      const rows=await q(sql,"INSERT INTO app_catalog(slug,name,description,app_url,download_url,icon_url,active,sort_order,metadata,updated_at,updated_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,now(),$10) ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,description=EXCLUDED.description,app_url=EXCLUDED.app_url,download_url=EXCLUDED.download_url,icon_url=EXCLUDED.icon_url,active=EXCLUDED.active,sort_order=EXCLUDED.sort_order,metadata=EXCLUDED.metadata,updated_at=now(),updated_by=EXCLUDED.updated_by RETURNING slug,name,description,app_url,download_url,icon_url,active,sort_order,metadata,updated_at",[slug,name,description,appUrl,downloadUrl,icon,active,sort,JSON.stringify(object(data.metadata)),actor.id]);
      await logEvent(sql,actor.id,"app.catalog.update","app",slug,{active},request);
      return json({ok:true,app:rows[0]});
    }
    if (path === "admin/settings" && method === "GET") {
      const rows=await q(sql,"SELECT key,value_json,updated_at FROM site_settings WHERE key NOT LIKE 'admin.%' ORDER BY key");
      return json({ok:true,settings:rows});
    }
    if (path === "admin/settings" && method === "PUT") {
      if (!originOkay(request)) return fail("درخواست از مبدأ نامعتبر رد شد.",403,"origin_denied");
      let data; try { data=await bodyJson(request); } catch { return fail("تنظیمات معتبر نیست."); }
      const key=text(data.key,120);
      if (!/^(site\.identity|site\.features|public\.[a-z0-9._-]+)$/.test(key)) return fail("این کلید تنظیمات قابل ویرایش نیست.",403,"setting_denied");
      const rows=await q(sql,"INSERT INTO site_settings(key,value_json,updated_at,updated_by) VALUES ($1,$2::jsonb,now(),$3) ON CONFLICT(key) DO UPDATE SET value_json=EXCLUDED.value_json,updated_at=now(),updated_by=EXCLUDED.updated_by RETURNING key,value_json,updated_at",[key,JSON.stringify(object(data.value_json)),actor.id]);
      await logEvent(sql,actor.id,"site.setting.update","setting",key,{},request);
      return json({ok:true,setting:rows[0]});
    }
    if (path === "admin/audit" && method === "GET") {
      const rows=await q(sql,"SELECT a.id,a.action,a.target_type,a.target_id,a.metadata,a.created_at,u.username FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_id ORDER BY a.created_at DESC LIMIT 300");
      return json({ok:true,logs:rows});
    }
    return fail("مسیر مدیریتی پیدا نشد.",404,"not_found");
  }

  return fail("مسیر API پیدا نشد.",404,"not_found");
}

export async function onRequest(context) {
  try { return await handle(context.request, context.env); }
  catch (error) {
    const status = error?.message === "too_large" ? 413 : 500;
    return fail(status === 413 ? "درخواست بیش از حد بزرگ است." : "خطای داخلی رخ داد. دوباره تلاش کنید.", status, status === 413 ? "request_too_large" : "internal_error");
  }
}
