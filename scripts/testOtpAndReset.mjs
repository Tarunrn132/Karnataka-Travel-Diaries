/**
 * Test Phone & WhatsApp OTP Verification and Password Reset Identifier Resolution
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000/api/auth';

function createMockFirebaseIdToken({ uid, phone_number, name }) {
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
    phone_number: phone_number,
    name: name,
    firebase: {
      identities: { phone: [phone_number] },
      sign_in_provider: 'phone'
    }
  })).toString('base64url');

  return `${header}.${payload}.devSignature`;
}

async function testOtpAndReset() {
  console.log('🧪 Testing Firebase Phone Auth, WhatsApp OTP & Password Recovery...\n');
  const tag = Date.now().toString().slice(-5);

  // 1. Firebase Phone Authentication Verification
  const phone = `+9199998${tag}`;
  console.log('1. Testing Firebase Phone Auth Session Sync for:', phone);
  const phoneToken = createMockFirebaseIdToken({
    uid: `phone_user_${tag}`,
    phone_number: phone,
    name: 'Suresh Kumar'
  });

  const phoneRes = await fetch(`${BASE_URL}/sync-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${phoneToken}`
    },
    body: JSON.stringify({ idToken: phoneToken })
  });
  const phoneData = await phoneRes.json();
  if (!phoneData.success || phoneData.user.phoneNumber !== phone) {
    throw new Error('Firebase phone session sync failed: ' + JSON.stringify(phoneData));
  }
  console.log('  ✅ Firebase Phone Auth verified, application user mapped:', phoneData.user.name, phoneData.user.phoneNumber);

  // 2. WhatsApp Business API OTP Dispatch & Verification
  console.log('\n2. Testing WhatsApp Business API Verification...');
  const waNumber = `+9198888${tag}`;
  const sendWaRes = await fetch(`${BASE_URL}/whatsapp/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ whatsappNumber: waNumber })
  });
  const sendWaData = await sendWaRes.json();
  if (!sendWaData.success || sendWaData.cooldownSeconds !== 60) {
    throw new Error('Failed to dispatch WhatsApp OTP: ' + JSON.stringify(sendWaData));
  }
  console.log('  ✅ WhatsApp OTP dispatched with 60-second cooldown');

  // Verify OTP record created
  const otpRecord = await prisma.otpVerification.findFirst({
    where: { identifier: waNumber, type: 'whatsapp', verified: false },
    orderBy: { createdAt: 'desc' }
  });
  if (!otpRecord) throw new Error('WhatsApp OTP record not found in database');

  // Test incorrect OTP
  const badWaRes = await fetch(`${BASE_URL}/whatsapp/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ whatsappNumber: waNumber, otp: '111111' })
  });
  if (badWaRes.status !== 400) {
    throw new Error('Failed to reject incorrect WhatsApp OTP');
  }
  console.log('  ✅ Correctly rejected incorrect WhatsApp OTP');

  // Simulate correct OTP verification
  const crypto = await import('crypto');
  const testOtp = '889900';
  const testHash = crypto.createHash('sha256').update(testOtp).digest('hex');
  await prisma.otpVerification.update({
    where: { id: otpRecord.id },
    data: { otpHash: testHash }
  });

  const goodWaRes = await fetch(`${BASE_URL}/whatsapp/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${phoneToken}`
    },
    body: JSON.stringify({ whatsappNumber: waNumber, otp: testOtp })
  });
  const goodWaData = await goodWaRes.json();
  if (!goodWaData.success) {
    throw new Error('Failed to verify valid WhatsApp OTP: ' + JSON.stringify(goodWaData));
  }
  console.log('  ✅ Successfully verified WhatsApp OTP and linked to user');

  // 3. Password Reset Identifier Resolution
  console.log('\n3. Testing Password Reset Username Resolution...');
  const resolveRes = await fetch(`${BASE_URL}/resolve-identifier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'traveler' })
  });
  const resolveData = await resolveRes.json();
  if (resolveData.email !== 'traveler@karnatakadiaries.com') {
    throw new Error('Failed to resolve username to email for password reset');
  }
  console.log('  ✅ Successfully resolved username to email for Firebase password reset');

  console.log(`\n======================================================`);
  console.log('🎯 OTP and Reset Tests Completed Successfully!');
  console.log(`======================================================\n`);

  await prisma.$disconnect();
}

testOtpAndReset().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
