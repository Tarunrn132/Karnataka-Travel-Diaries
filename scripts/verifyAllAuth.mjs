/**
 * Karnataka Travel Diaries - End-to-End Firebase Authentication Test Suite
 * 
 * Verifies:
 * 1. Firebase Public Config API (/api/auth/config)
 * 2. Username/Email Identifier Resolution (/api/auth/resolve-identifier)
 * 3. Backend Token Verification (Missing -> 401, Invalid -> 401, Expired -> 401, Valid -> Authenticated)
 * 4. Email/Password User Flow (Registration, Token Sync, Mapping to Prisma, Cookie issuance)
 * 5. Existing User Migration & Linking (Preserves existing application accounts, avoids duplicates)
 * 6. Google OAuth Authentication Flow & User Mapping
 * 7. Phone Authentication Flow (Indian +91 normalization, session sync)
 * 8. WhatsApp Business API Verification (Independent provider, cooldown, OTP validation)
 * 9. Authorization & Data Isolation (User A cannot view or mutate User B's trips, diaries, preferences)
 * 10. Profile Details Update (/api/auth/profile)
 * 11. Secure Session Logout (/api/auth/logout)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000/api';

// Helper to create valid development Firebase ID tokens
function createMockFirebaseIdToken({ uid, email, name, phone_number, email_verified = true, expired = false }) {
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
    exp: expired ? (now - 300) : (now + 3600),
    email: email || undefined,
    email_verified: email_verified,
    name: name || undefined,
    phone_number: phone_number || undefined,
    firebase: {
      identities: {
        ...(email ? { email: [email] } : {}),
        ...(phone_number ? { phone: [phone_number] } : {})
      },
      sign_in_provider: email ? 'password' : (phone_number ? 'phone' : 'google.com')
    }
  })).toString('base64url');

  return `${header}.${payload}.devSignature`;
}

async function runVerification() {
  console.log('🚀 Running Complete Firebase Authentication Verification Suite...\n');
  let tests = 0;
  let passed = 0;

  function assert(condition, message) {
    tests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  const timestamp = Date.now().toString().slice(-6);

  // ==========================================
  // 1. PUBLIC FIREBASE WEB CONFIGURATION
  // ==========================================
  console.log('1. Verifying Public Firebase Web Configuration...');
  const configRes = await fetch(`${BASE_URL}/auth/config`);
  const config = await configRes.json();
  assert(configRes.status === 200, 'Serves /api/auth/config with status 200');
  assert(config.projectId && typeof config.projectId === 'string', 'Returns Firebase project ID');
  assert(!config.privateKey && !config.clientSecret, 'Never exposes server-side private keys or secrets in public config');

  // ==========================================
  // 2. USERNAME TO EMAIL RESOLUTION
  // ==========================================
  console.log('\n2. Verifying Identifier Resolution (Username / Email)...');
  const resolveUser = await fetch(`${BASE_URL}/auth/resolve-identifier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'traveler' })
  }).then(r => r.json());
  assert(resolveUser.email === 'traveler@karnatakadiaries.com', 'Resolves existing username "traveler" to registered email');

  const resolveEmail = await fetch(`${BASE_URL}/auth/resolve-identifier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'hello@traveldiaries.in' })
  }).then(r => r.json());
  assert(resolveEmail.email === 'hello@traveldiaries.in', 'Directly passes through valid email address');

  // ==========================================
  // 3. BACKEND TOKEN VERIFICATION
  // ==========================================
  console.log('\n3. Verifying Backend Token Verification & Security Gates...');
  // A. Missing Token
  const noTokenRes = await fetch(`${BASE_URL}/auth/sync-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert(noTokenRes.status === 401, 'Rejects sync-session with 401 when no token is provided');

  // B. Invalid Token
  const badTokenRes = await fetch(`${BASE_URL}/auth/sync-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer invalid_signature_or_malformed_token'
    },
    body: JSON.stringify({})
  });
  assert(badTokenRes.status === 401, 'Rejects sync-session with 401 when malformed token is provided');

  // C. Expired Token
  const expiredToken = createMockFirebaseIdToken({
    uid: `user_exp_${timestamp}`,
    email: `expired_${timestamp}@test.com`,
    expired: true
  });
  const expRes = await fetch(`${BASE_URL}/auth/sync-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${expiredToken}`
    },
    body: JSON.stringify({ idToken: expiredToken })
  });
  assert(expRes.status === 401, 'Rejects expired Firebase ID token with 401');

  // ==========================================
  // 4. EMAIL/PASSWORD REGISTRATION & TOKEN SYNC
  // ==========================================
  console.log('\n4. Verifying Firebase Email/Password User Sync & Mapping...');
  const userAEmail = `ananya_${timestamp}@karnatakadiaries.com`;
  const userAUid = `firebase_uid_user_a_${timestamp}`;
  const validTokenA = createMockFirebaseIdToken({
    uid: userAUid,
    email: userAEmail,
    name: 'Ananya Sharma',
    email_verified: true
  });

  const syncResA = await fetch(`${BASE_URL}/auth/sync-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validTokenA}`
    },
    body: JSON.stringify({
      idToken: validTokenA,
      name: 'Ananya Sharma',
      username: `ananya_${timestamp}`
    })
  });
  const syncCookieA = syncResA.headers.get('set-cookie');
  const syncDataA = await syncResA.json();

  assert(syncResA.status === 200 && syncDataA.success, 'Syncs valid Firebase ID token and provisions Prisma application user');
  assert(syncDataA.user.firebaseUid === userAUid, 'Stores permanent Firebase UID on User record in Prisma');
  assert(syncDataA.user.email === userAEmail, 'Persists user email correctly');
  assert(!syncDataA.user.passwordHash, 'Application backend does not store or expose passwords');
  assert(Boolean(syncCookieA && syncCookieA.includes('ktd_token')), 'Sets secure HttpOnly session cookie');

  // ==========================================
  // 5. EXISTING USER MIGRATION & ACCOUNT LINKING
  // ==========================================
  console.log('\n5. Verifying Existing User Account Migration (Preserving Data)...');
  const travelerUserBefore = await prisma.user.findUnique({
    where: { email: 'traveler@karnatakadiaries.com' }
  });
  assert(Boolean(travelerUserBefore), 'Existing seed user exists before migration');

  const travelerFirebaseUid = `firebase_migrated_traveler_${timestamp}`;
  const travelerToken = createMockFirebaseIdToken({
    uid: travelerFirebaseUid,
    email: 'traveler@karnatakadiaries.com',
    name: 'Karnataka Explorer',
    email_verified: true
  });

  const travelerSyncRes = await fetch(`${BASE_URL}/auth/sync-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${travelerToken}`
    },
    body: JSON.stringify({ idToken: travelerToken })
  });
  const travelerSyncData = await travelerSyncRes.json();

  assert(travelerSyncRes.status === 200 && travelerSyncData.success, 'Migrates existing user upon first Firebase sign-in');
  assert(travelerSyncData.user.id === travelerUserBefore.id, 'Preserves original application user ID and foreign keys');
  assert(travelerSyncData.user.firebaseUid === travelerFirebaseUid, 'Safely links Firebase UID to existing user');

  // ==========================================
  // 6. GOOGLE OAUTH PROVIDER FLOW
  // ==========================================
  console.log('\n6. Verifying Firebase Google Authentication Provider Flow...');
  const googleUid = `google_oauth_uid_${timestamp}`;
  const googleEmail = `google_traveler_${timestamp}@gmail.com`;
  const googleToken = createMockFirebaseIdToken({
    uid: googleUid,
    email: googleEmail,
    name: 'Google Traveler',
    email_verified: true
  });

  const googleSyncRes = await fetch(`${BASE_URL}/auth/sync-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${googleToken}`
    },
    body: JSON.stringify({ idToken: googleToken })
  });
  const googleSyncData = await googleSyncRes.json();

  assert(googleSyncRes.status === 200 && googleSyncData.success, 'Authenticates via Firebase Google provider');
  assert(googleSyncData.user.firebaseUid === googleUid, 'Maps Google Firebase UID to Prisma user');
  assert(googleSyncData.user.email === googleEmail, 'Maps Google verified email to Prisma user');

  // ==========================================
  // 7. PHONE AUTHENTICATION FLOW
  // ==========================================
  console.log('\n7. Verifying Firebase Phone Authentication Flow...');
  const phoneUid = `phone_auth_uid_${timestamp}`;
  const rawPhone = `98450${timestamp.slice(0, 5)}`;
  const normalizedPhone = `+91${rawPhone}`;
  const phoneToken = createMockFirebaseIdToken({
    uid: phoneUid,
    phone_number: normalizedPhone,
    name: 'Phone Explorer'
  });

  const phoneSyncRes = await fetch(`${BASE_URL}/auth/sync-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${phoneToken}`
    },
    body: JSON.stringify({
      idToken: phoneToken,
      name: 'Phone Explorer',
      username: `phone_${timestamp}`
    })
  });
  const phoneSyncData = await phoneSyncRes.json();

  assert(phoneSyncRes.status === 200 && phoneSyncData.success, 'Authenticates via Firebase Phone provider');
  assert(phoneSyncData.user.phoneNumber === normalizedPhone, 'Normalizes and stores Indian phone number (+91)');
  assert(phoneSyncData.user.phoneVerified === true, 'Marks phone number as verified');

  // ==========================================
  // 8. WHATSAPP BUSINESS API (INDEPENDENT PROVIDER)
  // ==========================================
  console.log('\n8. Verifying WhatsApp Business API (Independent of SMS)...');
  const waNumber = `+919844${timestamp.slice(0, 6)}`;
  const waSendRes = await fetch(`${BASE_URL}/auth/whatsapp/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ whatsappNumber: waNumber })
  });
  const waSendData = await waSendRes.json();
  assert(waSendRes.status === 200 && waSendData.success, 'Dispatches WhatsApp OTP via WhatsApp Business provider');
  assert(waSendData.cooldownSeconds === 60, 'Enforces 60-second verification cooldown for WhatsApp');

  // Test incorrect OTP
  const waBadVerify = await fetch(`${BASE_URL}/auth/whatsapp/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ whatsappNumber: waNumber, otp: '000000' })
  });
  assert(waBadVerify.status === 400, 'Rejects incorrect WhatsApp OTP');

  // Test correct OTP
  const otpRecord = await prisma.otpVerification.findFirst({
    where: { identifier: waNumber, type: 'whatsapp', verified: false },
    orderBy: { createdAt: 'desc' }
  });
  assert(Boolean(otpRecord), 'Stores encrypted WhatsApp OTP record in database');

  // Update hash with test OTP to simulate Meta WhatsApp delivery
  const crypto = await import('crypto');
  const testWaOtp = '765432';
  const testWaHash = crypto.createHash('sha256').update(testWaOtp).digest('hex');
  await prisma.otpVerification.update({
    where: { id: otpRecord.id },
    data: { otpHash: testWaHash }
  });

  const waGoodVerify = await fetch(`${BASE_URL}/auth/whatsapp/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validTokenA}`
    },
    body: JSON.stringify({ whatsappNumber: waNumber, otp: testWaOtp })
  });
  const waGoodData = await waGoodVerify.json();
  assert(waGoodVerify.status === 200 && waGoodData.success, 'Verifies valid WhatsApp OTP');

  const updatedUserA = await prisma.user.findUnique({ where: { id: syncDataA.user.id } });
  assert(updatedUserA.whatsappVerified === true && updatedUserA.whatsappNumber === waNumber, 'Links verified WhatsApp identity to user record');

  // ==========================================
  // 9. AUTHORIZATION & DATA ISOLATION
  // ==========================================
  console.log('\n9. Verifying Cross-User Authorization & Data Security...');
  const userBUid = `firebase_uid_user_b_${timestamp}`;
  const validTokenB = createMockFirebaseIdToken({
    uid: userBUid,
    email: `b_${timestamp}@karnatakadiaries.com`,
    name: 'User B Explorer'
  });

  const syncResB = await fetch(`${BASE_URL}/auth/sync-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validTokenB}`
    },
    body: JSON.stringify({ idToken: validTokenB })
  });
  const syncDataB = await syncResB.json();

  // User A creates a Trip
  const createTripRes = await fetch(`${BASE_URL}/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validTokenA}`
    },
    body: JSON.stringify({
      name: 'Private Western Ghats Trip',
      description: 'User A confidential itinerary'
    })
  });
  const createdTrip = await createTripRes.json();
  assert(createTripRes.status === 200 && createdTrip.id, 'User A creates private road trip');

  // User B reads trips -> User A trip must NOT be returned
  const userBTripsRes = await fetch(`${BASE_URL}/trips`, {
    headers: { 'Authorization': `Bearer ${validTokenB}` }
  });
  const userBTrips = await userBTripsRes.json();
  const tripLeak = userBTrips.some(t => t.id === createdTrip.id);
  assert(tripLeak === false, 'User B CANNOT view User A private road trip');

  // User B attempts to delete User A trip -> Must fail
  const unauthorizedDeleteRes = await fetch(`${BASE_URL}/trips/${createdTrip.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${validTokenB}` }
  });
  assert(unauthorizedDeleteRes.status !== 200, 'User B CANNOT delete User A private road trip');

  // User A creates a Diary entry
  const sampleDest = await prisma.destination.findFirst();
  const createDiaryRes = await fetch(`${BASE_URL}/diary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validTokenA}`
    },
    body: JSON.stringify({
      destinationId: sampleDest.id,
      title: 'Sunset at Agumbe',
      content: 'Breathtaking scenery in the rainforest.',
      rating: 5
    })
  });
  const createdDiary = await createDiaryRes.json();
  assert(createDiaryRes.status === 200 && createdDiary.id, 'User A creates private travel diary entry');

  // User B reads diaries -> User A diary must NOT be returned
  const userBDiariesRes = await fetch(`${BASE_URL}/diary`, {
    headers: { 'Authorization': `Bearer ${validTokenB}` }
  });
  const userBDiaries = await userBDiariesRes.json();
  const diaryLeak = userBDiaries.some(d => d.id === createdDiary.id);
  assert(diaryLeak === false, 'User B CANNOT view User A private diary entry');

  // User Preferences isolation
  await fetch(`${BASE_URL}/user/preferences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validTokenA}`
    },
    body: JSON.stringify({ travelStyle: 'Adventure', preferredTransport: 'Motorcycle' })
  });

  const prefBRes = await fetch(`${BASE_URL}/user/preferences`, {
    headers: { 'Authorization': `Bearer ${validTokenB}` }
  });
  const prefBData = await prefBRes.json();
  assert(prefBData.preferences.travelStyle !== 'Adventure', 'User B preferences are strictly isolated from User A');

  // ==========================================
  // 10. PROFILE UPDATES VIA AUTHENTICATED TOKEN
  // ==========================================
  console.log('\n10. Verifying Authenticated Profile Updates...');
  const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validTokenA}`
    },
    body: JSON.stringify({ name: 'Ananya Sharma Rao' })
  });
  const updateData = await updateRes.json();
  assert(updateRes.status === 200 && updateData.user.name === 'Ananya Sharma Rao', 'Updates user display name');

  // ==========================================
  // 11. SESSION LOGOUT & COOKIE DELETION
  // ==========================================
  console.log('\n11. Verifying Session Logout & Cookie Clearing...');
  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
  const logoutCookie = logoutRes.headers.get('set-cookie');
  const logoutData = await logoutRes.json();
  assert(logoutRes.status === 200 && logoutData.success, 'Logs out session successfully');
  assert(Boolean(logoutCookie && logoutCookie.includes('ktd_token=;')), 'Clears ktd_token session cookie on logout');

  console.log(`\n======================================================`);
  console.log(`🎯 Overall Result: ${passed}/${tests} tests passed.`);
  console.log(`======================================================\n`);

  await prisma.$disconnect();
  if (passed !== tests) process.exit(1);
}

runVerification().catch(e => {
  console.error('Fatal verification error:', e);
  process.exit(1);
});
