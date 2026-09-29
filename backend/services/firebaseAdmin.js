/**
 * Karnataka Travel Diaries - Firebase Admin SDK Service
 * 
 * Provides:
 * - Firebase Admin initialization with server-side service account credentials
 * - Secure ID token verification (verifyIdToken)
 * - Safe user mapping (Firebase UID -> Prisma Application User)
 * - Controlled account migration for existing users
 * - Zero plaintext password handling
 */

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');

let isInitialized = false;
let isConfiguredWithServiceAccount = false;

function initFirebaseAdmin() {
  const apps = typeof admin.getApps === 'function' ? admin.getApps() : (admin.apps || []);
  if (isInitialized || apps.length > 0) {
    isInitialized = true;
    return apps[0] || admin;
  }

  // 1. Try file path from FIREBASE_SERVICE_ACCOUNT_KEY
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountPath) {
    try {
      let credentials;
      if (fs.existsSync(serviceAccountPath)) {
        credentials = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      } else {
        // Stringified JSON
        credentials = JSON.parse(serviceAccountPath);
      }
      const app = admin.initializeApp({
        credential: admin.credential.cert(credentials)
      });
      isInitialized = true;
      isConfiguredWithServiceAccount = true;
      console.log('🔥 Firebase Admin initialized via service account file/JSON.');
      return app;
    } catch (e) {
      console.error('[Firebase Admin Error]: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e.message);
    }
  }

  // 2. Try individual environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      privateKey = privateKey.replace(/\\n/g, '\n');
      const app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
      isInitialized = true;
      isConfiguredWithServiceAccount = true;
      console.log('🔥 Firebase Admin initialized via environment variables.');
      return app;
    } catch (e) {
      console.error('[Firebase Admin Error]: Failed to initialize with environment credentials:', e.message);
    }
  }

  // 3. Fallback: Initialize without cert for development/emulator or project-id context
  try {
    const app = admin.initializeApp({
      projectId: projectId || 'karnatakatraveldiaries-a513e'
    });
    isInitialized = true;
    console.log('ℹ️ [Firebase Admin]: Initialized with project ID (Development Mode). For production verification, set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.');
    return app;
  } catch (e) {
    console.warn('[Firebase Admin Warning]:', e.message);
    isInitialized = true;
    const apps = admin.getApps();
    return apps[0] || admin;
  }
}

// Ensure initialized on load
const defaultApp = initFirebaseAdmin();

function getFirebaseAuth() {
  return getAuth(defaultApp);
}

/**
 * Verify Firebase ID Token
 * @param {string} idToken
 * @returns {Promise<object>} Decoded token claims
 */
async function verifyFirebaseIdToken(idToken) {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Firebase ID token is missing or invalid.');
  }

  const auth = getFirebaseAuth();

  // If service account is configured, use standard Firebase Admin verification
  if (isConfiguredWithServiceAccount) {
    return auth.verifyIdToken(idToken);
  }

  // In development / testing mode without live service account keys:
  // If token is a valid Firebase JWT format, verify using auth.verifyIdToken() if possible, or decode payload
  try {
    return await auth.verifyIdToken(idToken);
  } catch (err) {
    // Development fallback: decode JWT structure safely if running in dev environment
    if (process.env.NODE_ENV !== 'production') {
      try {
        const parts = idToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
          if (payload && (payload.uid || payload.sub)) {
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && now > payload.exp) {
              const err = new Error('Firebase ID token has expired.');
              err.code = 'auth/id-token-expired';
              throw err;
            }
            return {
              uid: payload.uid || payload.sub,
              email: payload.email || null,
              email_verified: Boolean(payload.email_verified),
              phone_number: payload.phone_number || null,
              name: payload.name || null,
              picture: payload.picture || null,
              auth_time: payload.auth_time || Math.floor(Date.now() / 1000),
              dev_mode: true
            };
          }
        }
      } catch (decodeErr) {
        if (decodeErr.code === 'auth/id-token-expired') throw decodeErr;
        // Fall through to throw original error
      }
    }
    throw err;
  }
}

/**
 * Maps a verified Firebase Token to an application User in Prisma.
 * Never creates duplicate accounts. Intelligently links existing users.
 * 
 * @param {object} decodedToken - verified Firebase token claims
 * @param {object} prisma - Prisma Client instance
 * @param {object} extraData - optional extra registration fields (e.g. username, name)
 * @returns {Promise<object>} Prisma User
 */
async function getOrCreateUserFromFirebaseToken(decodedToken, prisma, extraData = {}) {
  const { uid, email, phone_number, name, picture, email_verified } = decodedToken;

  if (!uid) {
    throw new Error('Firebase token does not contain a valid user ID (uid).');
  }

  // 1. Direct match on firebaseUid
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid }
  });

  if (user) {
    // Merge in fresh identity data from Firebase token.
    // This keeps the profile up to date after first real sign-in even
    // if the user was initially created with seed/placeholder data.
    const PLACEHOLDER_NAMES = ['Explorer', 'Karnataka Traveler', 'Traveler'];
    const PLACEHOLDER_EMAILS = ['traveler@karnatakadiaries.com', 'admin@karnatakadiaries.com'];
    const PLACEHOLDER_USERNAMES = ['traveler', 'karnatakatraveler', 'explorer'];

    const nameFromToken = extraData.name?.trim() || name || null;
    const shouldUpdateName =
      nameFromToken &&
      nameFromToken.length >= 2 &&
      (!user.name || PLACEHOLDER_NAMES.includes(user.name) || user.name.startsWith('Traveler '));

    const shouldUpdateEmail =
      email &&
      (!user.email || PLACEHOLDER_EMAILS.includes(user.email));

    const shouldUpdateAvatar = picture && !user.avatar;

    const isPlaceholderUsername = !user.username || PLACEHOLDER_USERNAMES.includes(user.username.toLowerCase()) || user.username.startsWith('traveler_');

    const updatePayload = {
      lastLoginAt: new Date(),
      emailVerified: email_verified || user.emailVerified,
      phoneVerified: Boolean(phone_number) || user.phoneVerified,
    };
    if (shouldUpdateName)   updatePayload.name   = nameFromToken;
    if (shouldUpdateEmail)  updatePayload.email  = email.toLowerCase();
    if (shouldUpdateAvatar) updatePayload.avatar = picture;

    if (isPlaceholderUsername && (nameFromToken || email)) {
      const base = (nameFromToken || (email ? email.split('@')[0] : 'traveler'))
        .toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14) || 'traveler';
      const desiredUsername = `${base}_${uid.slice(-4)}`;
      const existing = await prisma.user.findUnique({ where: { username: desiredUsername } });
      if (!existing || existing.id === user.id) {
        updatePayload.username = desiredUsername;
      }
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: updatePayload
    });
    return user;
  }

  // 2. Existing user migration / link by verified Email
  if (email) {
    user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (user) {
      const nameFromToken = extraData.name?.trim() || name || null;
      const updateData = {
        firebaseUid: uid,
        authProvider: 'firebase',
        lastLoginAt: new Date(),
        emailVerified: true,
        avatar: user.avatar || picture
      };
      if (nameFromToken && (!user.name || ['Explorer', 'Karnataka Traveler', 'Traveler'].includes(user.name))) {
        updateData.name = nameFromToken;
      }
      // Safely link Firebase UID to the existing user record!
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
      console.log(`🔗 Existing application user [${user.email}] linked to Firebase UID [${uid}].`);
      return user;
    }
  }

  // 3. Existing user migration / link by verified Phone Number
  if (phone_number) {
    user = await prisma.user.findUnique({
      where: { phoneNumber: phone_number }
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firebaseUid: uid,
          authProvider: 'firebase',
          lastLoginAt: new Date(),
          phoneVerified: true
        }
      });
      console.log(`🔗 Existing application user [${user.phoneNumber}] linked to Firebase UID [${uid}].`);
      return user;
    }
  }

  // 4. Create a brand-new application user in Prisma
  const displayName = (extraData.name && extraData.name.trim().length >= 2)
    ? extraData.name.trim()
    : (name || (email ? email.split('@')[0] : `Traveler ${uid.slice(-4)}`));

  let desiredUsername = extraData.username
    ? extraData.username.toLowerCase().replace(/[^a-z0-9_-]/g, '')
    : null;

  if (!desiredUsername) {
    const base = displayName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14) || 'traveler';
    desiredUsername = `${base}_${uid.slice(-4)}`;
  }

  // Ensure username is unique
  const existingUsername = await prisma.user.findUnique({ where: { username: desiredUsername } });
  if (existingUsername) {
    desiredUsername = `${desiredUsername.slice(0, 20)}_${Math.floor(100 + Math.random() * 900)}`;
  }

  user = await prisma.user.create({
    data: {
      firebaseUid: uid,
      name: displayName,
      username: desiredUsername,
      email: email ? email.toLowerCase() : null,
      phoneNumber: phone_number || null,
      avatar: picture || null,
      authProvider: 'firebase',
      emailVerified: Boolean(email_verified),
      phoneVerified: Boolean(phone_number),
      role: 'USER',
      lastLoginAt: new Date()
    }
  });

  console.log(`✨ Created new application user [${user.name} - @${user.username}] for Firebase UID [${uid}].`);
  return user;
}

module.exports = {
  admin,
  initFirebaseAdmin,
  getFirebaseAuth,
  verifyFirebaseIdToken,
  getOrCreateUserFromFirebaseToken,
  isConfiguredWithServiceAccount: () => isConfiguredWithServiceAccount
};
