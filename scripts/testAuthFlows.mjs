/**
 * Karnataka Travel Diaries - Authentication Flow Test Suite
 * Tests Firebase ID Token Sync, Session State, Demo Access, and Protected APIs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000/api';

function createMockFirebaseIdToken({ uid, email, name, phone_number }) {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    iss: 'https://securetoken.google.com/karnataka-travel-diaries',
    aud: 'karnataka-travel-diaries',
    auth_time: now,
    user_id: uid,
    sub: uid,
    uid: uid,
    iat: now,
    exp: now + 3600,
    email: email || undefined,
    email_verified: true,
    name: name || undefined,
    phone_number: phone_number || undefined
  })).toString('base64url');

  return `${header}.${payload}.devSignature`;
}

async function run() {
  console.log('🧪 Starting Karnataka Travel Diaries Firebase Authentication Flow Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const timestamp = Date.now().toString().slice(-5);

  // 1. Unauthenticated access check
  console.log('1. Testing Protected Route Security...');
  const unauthRes = await fetch(`${BASE_URL}/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Unauthorized Trip' })
  });
  assert(unauthRes.status === 401, 'Rejects unauthenticated POST /api/trips with 401');

  // 2. Demo Login Support
  console.log('\n2. Testing Demo Login API...');
  const demoRes = await fetch(`${BASE_URL}/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'traveler' })
  });
  const demoCookie = demoRes.headers.get('set-cookie');
  const demoData = await demoRes.json();
  assert(demoRes.status === 200 && demoData.success && demoData.user.email === 'traveler@karnatakadiaries.com', 'Signs in with demo traveler account');
  assert(Boolean(demoCookie && demoCookie.includes('ktd_token')), 'Sets ktd_token cookie on demo login');

  // 3. Current User Verification via Cookie
  console.log('\n3. Testing Session Profile Retrieval (/api/auth/me)...');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { 'Cookie': demoCookie }
  });
  const meData = await meRes.json();
  assert(meRes.status === 200 && meData.user && meData.user.email === 'traveler@karnatakadiaries.com', 'Retrieves authenticated user profile via session');

  // 4. Token-Based Authentication via Bearer Header
  console.log('\n4. Testing Bearer Token Authentication...');
  const userToken = createMockFirebaseIdToken({
    uid: `user_flow_${timestamp}`,
    email: `flow_${timestamp}@karnatakadiaries.com`,
    name: 'Flow Tester'
  });

  const syncRes = await fetch(`${BASE_URL}/auth/sync-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ idToken: userToken, name: 'Flow Tester' })
  });
  const syncData = await syncRes.json();
  assert(syncRes.status === 200 && syncData.user.firebaseUid === `user_flow_${timestamp}`, 'Authenticates and provisions user via Bearer token');

  // 5. Trip creation with Bearer Token
  console.log('\n5. Testing Trip Creation with Bearer Token...');
  const tripRes = await fetch(`${BASE_URL}/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ name: 'Coorg Coffee Trail', description: 'Weekend getaway in Madikeri' })
  });
  const tripData = await tripRes.json();
  assert(tripRes.status === 200 && tripData.id, 'Successfully creates trip with Bearer token');

  // 6. User Journey Stats
  console.log('\n6. Testing User Journey Statistics...');
  const statsRes = await fetch(`${BASE_URL}/user/journey-stats`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  const statsData = await statsRes.json();
  assert(statsRes.status === 200 && statsData.stats && statsData.stats.tripsCreated >= 1, 'Calculates user journey stats accurately');

  console.log(`\n======================================================`);
  console.log(`🎯 Auth Flows Result: ${passed} passed, ${failed} failed.`);
  console.log(`======================================================\n`);

  await prisma.$disconnect();
  if (failed > 0) process.exit(1);
}

run().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
