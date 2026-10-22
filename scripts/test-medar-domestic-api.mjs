import test from 'node:test';
import process from 'node:process';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes, createHash } from 'node:crypto';
import mysql from 'mysql2/promise';
import { app, hashPassword, closePool } from '../server/medar-api.mjs';

test('domestic API authenticates a provisioned MySQL user and revokes the session on logout', { skip: !process.env.MYSQL_URL }, async () => {
  const db = await mysql.createConnection(process.env.MYSQL_URL);
  const userId = randomUUID();
  const companyId = randomUUID();
  const membershipId = randomUUID();
  const username = 'ci_' + randomBytes(5).toString('hex');
  const phone = '+989' + randomBytes(5).toString('hex').slice(0, 9);
  const provisionedUserIds = [];
  const provisionedMembershipIds = [];
  const provisionedSupplierIds = [];
  const provisionedUsernames = [];

  const password = 'Domestic-CI-Password-2026!';
  const passwordHash = await hashPassword(password);
  const usernameKey = createHash('sha256').update('username:' + username).digest('hex');
  try {
    await db.execute(
      'INSERT INTO medar_users (id, username, username_normalized, phone_e164, display_name, password_hash, account_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, username, username, phone, 'Domestic CI User', passwordHash, 'active'],
    );
    await db.execute(
      'INSERT INTO companies (id, name, province, timezone) VALUES (?, ?, ?, ?)',
      [companyId, 'Domestic CI ' + username, 'Golestan', 'Asia/Tehran'],
    );
    await db.execute(
      'INSERT INTO memberships (id, company_id, user_id, role, active, created_by) VALUES (?, ?, ?, ?, TRUE, ?)',
      [membershipId, companyId, userId, 'owner', userId],
    );

    const health = await app.request('http://localhost/api/health');
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { ok: true, service: 'medar-domestic-api', database: true, auth: 'mysql' });

    const login = await app.request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    assert.equal(login.status, 200);
    const loginBody = await login.json();
    assert.equal(loginBody.user.id, userId);
    assert.equal(loginBody.memberships.length, 1);
    assert.equal(loginBody.memberships[0].company_id, companyId);
    assert.equal(loginBody.memberships[0].company.name, 'Domestic CI ' + username);
    const setCookie = login.headers.get('set-cookie');
    assert.ok(setCookie?.startsWith('medar_session='));
    const cookie = setCookie.split(';')[0];

    const me = await app.request('http://localhost/api/auth/me', { headers: { cookie } });
    assert.equal(me.status, 200);
    const meBody = await me.json();
    assert.equal(meBody.user.id, userId);
    assert.equal(meBody.memberships[0].id, membershipId);

    const memberSuffix = randomBytes(5).toString('hex');
    const provisionedUsername = 'ci_created_supplier_' + memberSuffix;
    const provisionedFullName = 'Domestic CI Provisioned Supplier ' + memberSuffix;
    const provisionedPassword = 'Domestic-Provisioned-Supplier-1405!';
    const adminUsername = 'ci_created_admin_' + memberSuffix;
    const adminPassword = 'Domestic-Provisioned-Admin-1405!';
    const escalationUsername = 'ci_forbidden_admin_' + memberSuffix;
    const invalidSupplierUsername = 'ci_invalid_supplier_' + memberSuffix;
    const customerRoleUsername = 'ci_customer_role_' + memberSuffix;
    provisionedUsernames.push(provisionedUsername, adminUsername, escalationUsername, invalidSupplierUsername, customerRoleUsername);
    const memberRequest = (memberCookie, payload) => app.request('http://localhost/api/workspace/members/create', {
      method: 'POST',
      headers: { ...(memberCookie ? { cookie: memberCookie } : {}), 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const unauthenticatedMemberCreate = await memberRequest(null, {
      companyId, username: 'ci_unauth_' + memberSuffix, fullName: 'Unauthenticated Member',
      password: provisionedPassword, role: 'staff',
    });
    assert.equal(unauthenticatedMemberCreate.status, 401, 'Only a valid session may provision a member account.');

    const createdSupplierResponse = await memberRequest(cookie, {
      companyId, username: provisionedUsername, fullName: provisionedFullName,
      password: provisionedPassword, role: 'supplier',
    });
    assert.equal(createdSupplierResponse.status, 201, 'An owner can create a supplier and its linked account.');
    const createdSupplier = (await createdSupplierResponse.json()).member;
    assert.ok(createdSupplier?.id && createdSupplier?.membership_id && createdSupplier?.supplier_id);
    assert.equal(createdSupplier.username, provisionedUsername);
    assert.equal(createdSupplier.role, 'supplier');
    assert.equal(createdSupplier.company_id, companyId);
    provisionedUserIds.push(createdSupplier.id);
    provisionedMembershipIds.push(createdSupplier.membership_id);
    provisionedSupplierIds.push(createdSupplier.supplier_id);

    const [[createdSupplierUser]] = await db.query(
      'SELECT username, username_normalized, display_name, password_hash, account_status FROM medar_users WHERE id=?',
      [createdSupplier.id],
    );
    assert.equal(createdSupplierUser.username, provisionedUsername);
    assert.equal(createdSupplierUser.username_normalized, provisionedUsername);
    assert.equal(createdSupplierUser.display_name, provisionedFullName);
    assert.equal(createdSupplierUser.account_status, 'active');
    assert.notEqual(createdSupplierUser.password_hash, provisionedPassword, 'Plaintext passwords must never be stored.');
    assert.match(createdSupplierUser.password_hash, /^pbkdf2_sha256\\$100000\\$/);
    const [[createdProfile]] = await db.query('SELECT full_name, phone FROM profiles WHERE id=?', [createdSupplier.id]);
    assert.equal(createdProfile.full_name, provisionedFullName);
    const [[createdMembership]] = await db.query('SELECT company_id, user_id, role, supplier_id, active, created_by FROM memberships WHERE id=?', [createdSupplier.membership_id]);
    assert.equal(createdMembership.company_id, companyId);
    assert.equal(createdMembership.user_id, createdSupplier.id);
    assert.equal(createdMembership.role, 'supplier');
    assert.equal(createdMembership.supplier_id, createdSupplier.supplier_id);
    assert.equal(Number(createdMembership.active), 1);
    assert.equal(createdMembership.created_by, userId);
    const [[createdSupplierRow]] = await db.query('SELECT company_id, name FROM suppliers WHERE id=?', [createdSupplier.supplier_id]);
    assert.equal(createdSupplierRow.company_id, companyId);
    assert.equal(createdSupplierRow.name, provisionedFullName);
    const [[createdAudit]] = await db.query(
      `SELECT action, entity_id, JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.username')) AS username FROM medar_audit_log WHERE action='membership.account_created' AND entity_id=? LIMIT 1`,
      [createdSupplier.membership_id],
    );
    assert.equal(createdAudit.action, 'membership.account_created');
    assert.equal(createdAudit.username, provisionedUsername);

    const duplicateMember = await memberRequest(cookie, {
      companyId, username: provisionedUsername, fullName: provisionedFullName,
      password: provisionedPassword, role: 'supplier',
    });
    assert.equal(duplicateMember.status, 409, 'Duplicate usernames must fail without partially creating another supplier or membership.');
    const [[duplicateUserCount]] = await db.query('SELECT COUNT(*) AS count FROM medar_users WHERE username_normalized=?', [provisionedUsername]);
    const [[duplicateProfileCount]] = await db.query('SELECT COUNT(*) AS count FROM profiles WHERE id=?', [createdSupplier.id]);
    const [[duplicateMembershipCount]] = await db.query('SELECT COUNT(*) AS count FROM memberships WHERE user_id=? AND company_id=?', [createdSupplier.id, companyId]);
    const [[duplicateSupplierCount]] = await db.query('SELECT COUNT(*) AS count FROM suppliers WHERE company_id=? AND name LIKE ?', [companyId, provisionedFullName + '%']);
    assert.equal(Number(duplicateUserCount.count), 1);
    assert.equal(Number(duplicateProfileCount.count), 1);
    assert.equal(Number(duplicateMembershipCount.count), 1);
    assert.equal(Number(duplicateSupplierCount.count), 1, 'A rolled-back duplicate must not leave an orphan supplier row.');

    const invalidSupplierLink = await memberRequest(cookie, {
      companyId, username: invalidSupplierUsername, fullName: 'Invalid Supplier Link',
      password: provisionedPassword, role: 'supplier', supplierId: randomUUID(),
    });
    assert.equal(invalidSupplierLink.status, 422, 'A supplier from another company or a nonexistent supplier ID must be rejected.');
    const invalidCustomerRole = await memberRequest(cookie, {
      companyId, username: customerRoleUsername, fullName: 'Forbidden Customer Role',
      password: provisionedPassword, role: 'customer',
    });
    assert.equal(invalidCustomerRole.status, 422, 'The private supply-chain release must not provision customer-ordering accounts.');

    const adminCreate = await memberRequest(cookie, {
      companyId, username: adminUsername, fullName: 'Domestic CI Admin', password: adminPassword, role: 'admin',
    });
    assert.equal(adminCreate.status, 201, 'The owner may create a manager/admin account.');
    const adminCreatedMember = (await adminCreate.json()).member;
    provisionedUserIds.push(adminCreatedMember.id);
    provisionedMembershipIds.push(adminCreatedMember.membership_id);
    assert.equal(adminCreatedMember.role, 'admin');
    const supplierLogin = await app.request('http://localhost/api/auth/login', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: provisionedUsername, password: provisionedPassword }),
    });
    assert.equal(supplierLogin.status, 200);
    const supplierCookie = supplierLogin.headers.get('set-cookie')?.split(';')[0];
    assert.ok(supplierCookie?.startsWith('medar_session='));
    const supplierCannotCreateStaff = await memberRequest(supplierCookie, {
      companyId, username: 'ci_supplier_forbidden_' + memberSuffix, fullName: 'Forbidden Staff',
      password: provisionedPassword, role: 'staff',
    });
    assert.equal(supplierCannotCreateStaff.status, 403, 'A supplier cannot provision users.');

    const adminLogin = await app.request('http://localhost/api/auth/login', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: adminUsername, password: adminPassword }),
    });
    assert.equal(adminLogin.status, 200);
    const adminCookie = adminLogin.headers.get('set-cookie')?.split(';')[0];
    assert.ok(adminCookie?.startsWith('medar_session='));
    const adminEscalation = await memberRequest(adminCookie, {
      companyId, username: escalationUsername, fullName: 'Forbidden Second Admin',
      password: adminPassword, role: 'admin',
    });
    assert.equal(adminEscalation.status, 403, 'Only the owner may provision an admin account.');
    const [[escalatedCount]] = await db.query('SELECT COUNT(*) AS count FROM medar_users WHERE username_normalized=?', [escalationUsername]);
    assert.equal(Number(escalatedCount.count), 0, 'A denied role escalation must leave no user row.');

    const insertCustomer = await app.request('http://localhost/api/data/customers', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'insert', values: { company_id: companyId, name: 'Domestic CI Customer' } }),
    });
    assert.equal(insertCustomer.status, 200);
    const inserted = await insertCustomer.json();
    assert.equal(inserted.count, 1);
    assert.match(inserted.data[0].id, /^[0-9a-f-]{36}$/i);
    assert.equal(inserted.data[0].company_id, companyId);

    const selectCustomers = await app.request('http://localhost/api/data/customers', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'select', filters: [{ column: 'name', op: 'eq', value: 'Domestic CI Customer' }], count: true }),
    });
    assert.equal(selectCustomers.status, 200);
    const selected = await selectCustomers.json();
    assert.equal(selected.count, 1);
    assert.equal(selected.data[0].name, 'Domestic CI Customer');

    const atomicInsert = await app.request('http://localhost/api/data/customers', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'insert', values: [
        { company_id: companyId, name: 'Atomic CI Customer' },
        { company_id: companyId, name: 'Invalid Atomic Customer', unknown_column: 'must-fail' },
      ] }),
    });
    assert.equal(atomicInsert.status, 422);
    const [[atomicCount]] = await db.query('SELECT COUNT(*) AS count FROM customers WHERE company_id=? AND name=?', [companyId, 'Atomic CI Customer']);
    assert.equal(Number(atomicCount.count), 0, 'A failed bulk insert must roll back all earlier rows in the same batch.');

    const projectedSelect = await app.request('http://localhost/api/data/customers', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'select',
        selection: 'id,name',
        filters: [{ column: 'name', op: 'not_in', value: '(Nobody,Other)' }],
        orFilters: [{ column: 'name', op: 'eq', value: 'Domestic CI Customer' }],
      }),
    });
    assert.equal(projectedSelect.status, 200);
    const projected = await projectedSelect.json();
    assert.ok(projected.data.some((row) => row.name === 'Domestic CI Customer'));
    assert.deepEqual(Object.keys(projected.data[0]).sort(), ['id','name']);

    const crossTenantInsert = await app.request('http://localhost/api/data/customers', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'insert', values: { company_id: randomUUID(), name: 'Cross Tenant Customer' } }),
    });
    assert.equal(crossTenantInsert.status, 403, 'Generic writes must not allow users to target a company they do not belong to.');

    const deniedTable = await app.request('http://localhost/api/data/medar_users', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'select' }),
    });
    assert.equal(deniedTable.status, 404, 'Authentication tables must not be exposed through the generic data API.');

    const taskId = randomUUID();
    await db.execute(
      "INSERT INTO operational_tasks (id,company_id,assignee_user_id,assigned_by,title,status) VALUES (?,?,?,?,?,'pending')",
      [taskId, companyId, userId, userId, 'Domestic CI task lifecycle'],
    );
    const rpc = async (name, args) => app.request('http://localhost/api/rpc/' + name, {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ args }),
    });
    const startTask = await rpc('start_operational_task', { _task: taskId });
    assert.equal(startTask.status, 200);
    const submitTask = await rpc('submit_operational_task', { _task: taskId, _completion_note: 'Completed by CI' });
    assert.equal(submitTask.status, 200);
    const reviewTask = await rpc('review_operational_task', { _task: taskId, _decision: 'approved', _review_note: 'Verified by CI' });
    assert.equal(reviewTask.status, 200);
    const [[taskAfterReview]] = await db.query('SELECT status,reviewed_by,reviewed_at,completion_note FROM operational_tasks WHERE id=?', [taskId]);
    assert.equal(taskAfterReview.status, 'approved');
    assert.equal(taskAfterReview.reviewed_by, userId);
    assert.ok(taskAfterReview.reviewed_at);
    assert.equal(taskAfterReview.completion_note, 'Completed by CI');
    const invalidReview = await rpc('review_operational_task', { _task: taskId, _decision: 'rejected', _review_note: 'Too late' });
    assert.equal(invalidReview.status, 422, 'A reviewed task cannot be transitioned a second time.');

    const supplierId = randomUUID();
    const agreementId = randomUUID();
    await db.execute('INSERT INTO suppliers (id,company_id,name) VALUES (?,?,?)', [supplierId, companyId, 'Domestic CI Partner']);
    await db.execute(
      "INSERT INTO partnership_agreements (id,company_id,supplier_id,agreement_code,status,effective_from,company_profit_share_pct,partner_profit_share_pct,shared_expense_categories,signed_document_path,signed_at,approved_by,approved_at,created_by) VALUES (?,?,?,?,'active','2025-01-01',50,50,?,'ci/signed-agreement.pdf',NOW(3),?,NOW(3),?)",
      [agreementId, companyId, supplierId, 'CI-SETTLEMENT-' + username, JSON.stringify({ feed: true }), userId, userId],
    );
    await db.execute(
      "INSERT INTO partner_financial_entries (id,company_id,supplier_id,agreement_id,entry_type,status,direction,amount,paid_amount,currency,paid_by,payment_status,recognized_on,external_reference,created_by,submitted_by,submitted_at,approved_by,approved_at,posted_by,posted_at) VALUES (?,?,?,?,'sale_collection','posted','inflow_to_company',10000,10000,'TOMAN','customer','paid','2026-01-15',?,?,?,NOW(3),?,NOW(3),?,NOW(3))",
      [randomUUID(), companyId, supplierId, agreementId, 'CI-SETTLEMENT-COLLECTION-' + username, userId, userId, userId, userId],
    );
    const createPeriod = await rpc('create_partner_settlement_period', {
      _agreement: agreementId, _period_start: '2026-01-01', _period_end: '2026-01-31',
    });
    assert.equal(createPeriod.status, 200);
    const createdPeriodBody = await createPeriod.json();
    const periodId = createdPeriodBody.data.id;
    assert.match(periodId, /^[0-9a-f-]{36}$/i);
    const [[createdPeriod]] = await db.query(
      'SELECT collected_revenue,partner_share_amount,balance_due_to_partner,recorded_cash_available,status FROM partner_settlement_periods WHERE id=?',
      [periodId],
    );
    assert.equal(String(createdPeriod.collected_revenue), '10000');
    assert.equal(String(createdPeriod.partner_share_amount), '5000');
    assert.equal(String(createdPeriod.balance_due_to_partner), '5000');
    assert.equal(String(createdPeriod.recorded_cash_available), '10000');
    assert.equal(createdPeriod.status, 'draft');

    const overlapPeriod = await rpc('create_partner_settlement_period', {
      _agreement: agreementId, _period_start: '2026-01-15', _period_end: '2026-02-15',
    });
    assert.equal(overlapPeriod.status, 422, 'Settlement periods must not overlap for the same agreement.');
    const approvePeriod = await rpc('approve_partner_settlement_period', { _period: periodId });
    assert.equal(approvePeriod.status, 200);
    const payPeriod = await rpc('record_partner_settlement_payment', {
      _period: periodId, _amount: 3000, _payment_reference: 'CI-PAYMENT-' + username,
    });
    assert.equal(payPeriod.status, 200);
    const partialPeriod = await rpc('record_partner_settlement_payment', {
      _period: periodId, _amount: 2000, _payment_reference: 'CI-PAYMENT-FINAL-' + username,
    });
    assert.equal(partialPeriod.status, 200);
    const [[settledPeriod]] = await db.query('SELECT status,settled_amount,settled_by,settled_at FROM partner_settlement_periods WHERE id=?', [periodId]);
    assert.equal(settledPeriod.status, 'settled');
    assert.equal(String(settledPeriod.settled_amount), '5000');
    assert.equal(settledPeriod.settled_by, userId);
    assert.ok(settledPeriod.settled_at);

    const logout = await app.request('http://localhost/api/auth/logout', { method: 'POST', headers: { cookie } });
    assert.equal(logout.status, 200);
    const afterLogout = await app.request('http://localhost/api/auth/me', { headers: { cookie } });
    assert.deepEqual(await afterLogout.json(), { user: null, memberships: [] });
  } finally {
    await db.execute('DELETE FROM medar_rate_limits WHERE key_hash=?', [usernameKey]);
    await db.execute('DELETE FROM medar_login_attempts WHERE username_normalized=?', [username]);
    for (const provisionedMembershipId of provisionedMembershipIds) {
      await db.execute('DELETE FROM medar_audit_log WHERE entity_id=?', [provisionedMembershipId]);
      await db.execute('DELETE FROM medar_sessions WHERE user_id IN (SELECT user_id FROM memberships WHERE id=?)', [provisionedMembershipId]);
      await db.execute('DELETE FROM memberships WHERE id=?', [provisionedMembershipId]);
    }
    for (const provisionedSupplierId of provisionedSupplierIds) await db.execute('DELETE FROM suppliers WHERE id=? AND company_id=?', [provisionedSupplierId, companyId]);
    for (const provisionedUserId of provisionedUserIds) {
      await db.execute('DELETE FROM medar_sessions WHERE user_id=?', [provisionedUserId]);
      await db.execute('DELETE FROM profiles WHERE id=?', [provisionedUserId]);
      await db.execute('DELETE FROM medar_users WHERE id=?', [provisionedUserId]);
    }
    for (const provisionedUsername of provisionedUsernames) {
      await db.execute('DELETE FROM medar_rate_limits WHERE key_hash=?', [createHash('sha256').update('username:' + provisionedUsername).digest('hex')]);
      await db.execute('DELETE FROM medar_login_attempts WHERE username_normalized=?', [provisionedUsername]);
    }
    await db.execute('DELETE FROM medar_audit_log WHERE actor_user_id=? AND action=\'membership.account_created\'', [userId]);
    await db.execute('DELETE FROM memberships WHERE id=?', [membershipId]);
    await db.execute('DELETE FROM companies WHERE id=?', [companyId]);
    await db.execute('DELETE FROM medar_users WHERE id=?', [userId]);
    await db.end();
    await closePool();
  }
});
