/**
 * Karnataka Travel Diaries - Firebase Authentication & Identity Router
 * 
 * Source of Truth:
 * - Authentication Identity: Firebase Authentication (Email/Password, Google, Phone/SMS)
 * - Application Business Data: Prisma SQLite (Trips, Diaries, Favorites, User Preferences)
 * 
 * Routes:
 * - GET  /api/auth/config         -> Serves public Firebase Web configuration
 * - POST /api/auth/sync-session   -> Verifies Firebase ID Token and maps/creates Prisma User
 * - GET  /api/auth/me             -> Returns current authenticated user and linked statuses
 * - POST /api/auth/demo-login     -> Quick demo login support for development
 * - POST /api/auth/logout         -> Invalidate session cookies
 * - PUT  /api/auth/profile        -> Update display name and username
 * - POST /api/auth/whatsapp/*     -> WhatsApp Business API verification (independent of SMS)
 */

const express = require('express');
const {
  admin,
  getFirebaseAuth,
  verifyFirebaseIdToken,
  getOrCreateUserFromFirebaseToken
} = require('../services/firebaseAdmin');
const authService = require('../services/authService');

module.exports = function(prisma, authenticate, JWT_SECRET) {
  const router = express.Router();

  // Helper to format safe application user object
  function formatSafeUser(user) {
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      whatsappNumber: user.whatsappNumber,
      avatar: user.avatar,
      role: user.role,
      authProvider: user.authProvider || 'firebase',
      emailVerified: Boolean(user.emailVerified),
      phoneVerified: Boolean(user.phoneVerified),
      whatsappVerified: Boolean(user.whatsappVerified),
      hasGoogle: Boolean(user.googleProviderId || (user.firebaseUid && user.authProvider === 'google')),
      hasPhone: Boolean(user.phoneNumber),
      hasWhatsApp: Boolean(user.whatsappNumber),
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };
  }

  // ==========================================
  // 1. PUBLIC FIREBASE WEB CONFIGURATION
  // ==========================================
  router.get('/config', (req, res) => {
    return res.json({
      apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "karnatakatraveldiaries-a513e.firebaseapp.com",
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "karnatakatraveldiaries-a513e",
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "karnatakatraveldiaries-a513e.firebasestorage.app",
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "989877596600",
      appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "1:989877596600:web:c108fc94c64e77a61d5f4d",
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-Q2SLHRRKB6",
      enableDemoLogin: process.env.ENABLE_DEMO_LOGIN === "true"
    });
  });

  // Resolve username to email for Email/Password Firebase sign-in
  router.post('/resolve-identifier', async (req, res) => {
    const { identifier } = req.body;
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({ error: 'Identifier is required.' });
    }

    const trimmed = identifier.trim().toLowerCase();
    if (trimmed.includes('@')) {
      return res.json({ email: trimmed });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { username: trimmed }
      });
      if (user && user.email) {
        return res.json({ email: user.email });
      }
      return res.status(404).json({ error: 'No account found with this username.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to resolve username.' });
    }
  });

  // ==========================================
  // 2. SYNC FIREBASE SESSION WITH PRISMA USER
  // ==========================================
  router.post('/sync-session', async (req, res) => {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.body.idToken) {
      token = req.body.idToken;
    } else if (req.cookies?.ktd_token) {
      token = req.cookies.ktd_token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Firebase ID Token is required for authentication.' });
    }

    try {
      const decodedToken = await verifyFirebaseIdToken(token);
      if (!decodedToken || !decodedToken.uid) {
        return res.status(401).json({ error: 'Invalid Firebase ID Token.' });
      }

      // Map or create application user
      const user = await getOrCreateUserFromFirebaseToken(decodedToken, prisma, {
        name: req.body.name,
        username: req.body.username
      });

      // Set session cookie
      res.cookie('ktd_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        success: true,
        user: formatSafeUser(user)
      });
    } catch (err) {
      console.error('Session sync error:', err.message);
      return res.status(401).json({ error: 'Failed to verify Firebase authentication session.' });
    }
  });

  // ==========================================
  // 3. GET CURRENT USER PROFILE (/api/auth/me)
  // ==========================================
  router.get('/me', async (req, res) => {
    const session = await authenticate(req);
    if (!session) {
      return res.json({ user: null });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.id }
      });

      if (!user) {
        res.clearCookie('ktd_token');
        return res.json({ user: null });
      }

      return res.json({
        user: formatSafeUser(user)
      });
    } catch (err) {
      console.error('Session retrieval error:', err);
      return res.json({ user: null });
    }
  });

  // ==========================================
  // 4. DEMO LOGIN (Development / Testing)
  // ==========================================
  router.post('/demo-login', async (req, res) => {
    if (process.env.ENABLE_DEMO_LOGIN !== 'true' && process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Demo logins are disabled in production.' });
    }

    const { role } = req.body;
    const email = role === 'admin' ? 'admin@karnatakadiaries.com' : 'traveler@karnatakadiaries.com';

    try {
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Demo account not found. Please run seed script first.' });
      }

      // Ensure demo account has a firebaseUid
      if (!user.firebaseUid) {
        const demoUid = `demo-${role}-${user.id.slice(-6)}`;
        user = await prisma.user.update({
          where: { id: user.id },
          data: { firebaseUid: demoUid, authProvider: 'firebase', lastLoginAt: new Date() }
        });
      }

      // Generate custom token if Firebase Admin supports it, or use mock JWT in dev
      let customToken = null;
      try {
        customToken = await getFirebaseAuth().createCustomToken(user.firebaseUid, {
          role: user.role,
          email: user.email
        });
      } catch (e) {
        // Fallback for dev mode
        customToken = `dev_token_${user.firebaseUid}`;
      }

      // Set cookie
      const { SignJWT } = require('jose');
      const token = await new SignJWT({
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        role: user.role
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

      res.cookie('ktd_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        success: true,
        user: formatSafeUser(user),
        customToken
      });
    } catch (err) {
      console.error('Demo login error:', err);
      return res.status(500).json({ error: 'Demo login failed.' });
    }
  });

  // ==========================================
  // 5. LOGOUT
  // ==========================================
  router.post('/logout', (req, res) => {
    res.clearCookie('ktd_token');
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  // ==========================================
  // 6. UPDATE PROFILE
  // ==========================================
  router.put('/profile', async (req, res) => {
    const session = await authenticate(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { name, username, avatar } = req.body;
    const updateData = {};

    if (name && typeof name === 'string' && name.trim().length >= 2) {
      updateData.name = name.trim();
    }

    if (username) {
      const cleanUsername = authService.normalizeUsername(username);
      if (!cleanUsername) {
        return res.status(400).json({ error: 'Username must be 3-30 letters, numbers, hyphens, or underscores.' });
      }
      const existing = await prisma.user.findUnique({ where: { username: cleanUsername } });
      if (existing && existing.id !== session.id) {
        return res.status(400).json({ error: 'Username is already taken.' });
      }
      updateData.username = cleanUsername;
    }

    if (avatar && typeof avatar === 'string') {
      updateData.avatar = avatar.trim();
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: session.id },
        data: updateData
      });

      return res.json({
        success: true,
        user: formatSafeUser(updatedUser)
      });
    } catch (err) {
      console.error('Profile update error:', err);
      return res.status(500).json({ error: 'Could not update profile.' });
    }
  });

  // ==========================================
  // 7. WHATSAPP BUSINESS API (Independent Provider)
  // ==========================================
  router.post('/whatsapp/send-otp', async (req, res) => {
    const { whatsappNumber } = req.body;
    const normalized = authService.normalizeIndianPhoneNumber(whatsappNumber);

    if (!normalized) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian WhatsApp number.' });
    }

    const plainOtp = authService.generateOtp();
    const otpHash = authService.hashValue(plainOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await prisma.otpVerification.deleteMany({
        where: { identifier: normalized, type: 'whatsapp', verified: false }
      });

      await prisma.otpVerification.create({
        data: {
          identifier: normalized,
          type: 'whatsapp',
          otpHash,
          expiresAt,
          attempts: 0,
          maxAttempts: 5
        }
      });

      await authService.sendWhatsAppOtp(normalized, plainOtp);

      return res.json({
        success: true,
        message: 'WhatsApp verification code sent.',
        cooldownSeconds: 60
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to send WhatsApp verification.' });
    }
  });

  router.post('/whatsapp/verify-otp', async (req, res) => {
    const session = await authenticate(req);
    const { whatsappNumber, otp } = req.body;
    const normalized = authService.normalizeIndianPhoneNumber(whatsappNumber);

    if (!normalized || !otp) {
      return res.status(400).json({ error: 'WhatsApp number and code are required.' });
    }

    try {
      const record = await prisma.otpVerification.findFirst({
        where: { identifier: normalized, type: 'whatsapp', verified: false },
        orderBy: { createdAt: 'desc' }
      });

      if (!record || new Date() > new Date(record.expiresAt)) {
        return res.status(400).json({ error: 'Invalid or expired WhatsApp verification code.' });
      }

      const incomingHash = authService.hashValue(otp.trim());
      if (incomingHash !== record.otpHash) {
        return res.status(400).json({ error: 'Incorrect verification code.' });
      }

      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { verified: true }
      });

      if (session) {
        await prisma.user.update({
          where: { id: session.id },
          data: {
            whatsappNumber: normalized,
            whatsappVerified: true
          }
        });
      }

      return res.json({
        success: true,
        message: 'WhatsApp number verified successfully!'
      });
    } catch (err) {
      return res.status(500).json({ error: 'Verification failed.' });
    }
  });

  return router;
};
