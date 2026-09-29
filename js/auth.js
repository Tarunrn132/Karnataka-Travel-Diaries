/**
 * Karnataka Travel Diaries - Firebase Authentication Client
 * 
 * Features:
 * - Firebase Web SDK integration (Email/Password, Google OAuth, Phone SMS OTP)
 * - Automatic Firebase ID Token retrieval & backend synchronization
 * - Seamless session management with onAuthStateChanged
 * - Unified Auth API preserving compatibility with all application pages
 * - ReCAPTCHA-backed Firebase Phone verification
 * - Dynamic Firebase script loader
 */

const Auth = {
  user: null,
  isInitialized: false,
  firebaseConfig: null,
  confirmationResult: null,

  /**
   * Load Firebase scripts dynamically if not already on the page
   */
  async ensureFirebaseLoaded() {
    if (window.firebase && window.firebase.auth) {
      return;
    }

    const loadScript = (src) => new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (window.firebase) return resolve();
        existing.addEventListener('load', resolve);
        existing.addEventListener('error', reject);
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });

    try {
      await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js');
    } catch (e) {
      console.warn('Could not load Firebase CDN scripts:', e);
    }
  },

  /**
   * Initialize Firebase Auth & sync with backend
   */
  async init() {
    // 1. Instant hydration from localStorage
    const cached = localStorage.getItem("ktd_user");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const PLACEHOLDERS = ['traveler@karnatakadiaries.com', 'admin@karnatakadiaries.com'];
        if (parsed && PLACEHOLDERS.includes(parsed.email)) {
          this.user = null;
          localStorage.removeItem("ktd_user");
        } else {
          this.user = parsed;
        }
      } catch (e) {
        this.user = null;
        localStorage.removeItem("ktd_user");
      }
    }
    this.renderHeaderAuth();

    // 2. Fetch public Firebase configuration from backend
    try {
      const configRes = await fetch("/api/auth/config");
      if (configRes.ok) {
        this.firebaseConfig = await configRes.json();
      }
    } catch (e) {
      console.warn("Could not fetch Firebase configuration from /api/auth/config");
    }

    // 3. Ensure Firebase SDK is loaded
    await this.ensureFirebaseLoaded();

    if (window.firebase && this.firebaseConfig && this.firebaseConfig.projectId) {
      if (!firebase.apps.length) {
        try {
          firebase.initializeApp(this.firebaseConfig);
        } catch (e) {
          console.error("Firebase initialization error:", e);
        }
      }

      // 4. Attach Firebase Auth state listener
      firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const idToken = await firebaseUser.getIdToken();
            const syncRes = await fetch("/api/auth/sync-session", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
              },
              body: JSON.stringify({ idToken })
            });

            if (syncRes.ok) {
              const syncData = await syncRes.json();
              this.user = syncData.user;
            }
          } catch (err) {
            console.error("Failed to sync Firebase session with backend:", err);
          }

          // ── Identity patch from Firebase Authentication ─────────────
          const PLACEHOLDER_NAMES = ['Explorer', 'Karnataka Traveler', 'Traveler'];
          const PLACEHOLDER_EMAILS = ['traveler@karnatakadiaries.com', 'admin@karnatakadiaries.com'];
          const PLACEHOLDER_USERNAMES = ['traveler', 'karnatakatraveler', 'explorer'];

          if (!this.user) {
            const emailPrefix = firebaseUser.email ? firebaseUser.email.split('@')[0] : 'traveler';
            this.user = {
              firebaseUid: firebaseUser.uid,
              name: firebaseUser.displayName || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)),
              email: firebaseUser.email || null,
              username: `${emailPrefix.toLowerCase().replace(/[^a-z0-9_]/g, '')}_${firebaseUser.uid.slice(-4)}`,
              phoneNumber: firebaseUser.phoneNumber || null,
              avatar: firebaseUser.photoURL || null,
              emailVerified: Boolean(firebaseUser.emailVerified),
              phoneVerified: Boolean(firebaseUser.phoneNumber),
              authProvider: 'firebase'
            };
          } else {
            if (firebaseUser.displayName &&
                (!this.user.name ||
                 PLACEHOLDER_NAMES.includes(this.user.name) ||
                 this.user.name.startsWith('Traveler '))) {
              this.user.name = firebaseUser.displayName;
            }
            if (firebaseUser.email &&
                (!this.user.email ||
                 PLACEHOLDER_EMAILS.includes(this.user.email))) {
              this.user.email = firebaseUser.email;
            }
            if (firebaseUser.photoURL && !this.user.avatar) {
              this.user.avatar = firebaseUser.photoURL;
            }
            if (!this.user.username || PLACEHOLDER_USERNAMES.includes(this.user.username.toLowerCase())) {
              const base = (firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'user'))
                .toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 14);
              this.user.username = `${base}_${firebaseUser.uid.slice(-4)}`;
            }
          }
          localStorage.setItem("ktd_user", JSON.stringify(this.user));
          // ────────────────────────────────────────────────────────────
        } else {
          // If logged out from Firebase
          if (this.user && !this.user.isDemo) {
            this.user = null;
            localStorage.removeItem("ktd_user");
          }
        }

        this.isInitialized = true;
        this.renderHeaderAuth();
        document.dispatchEvent(new CustomEvent("ktd:auth-ready", { detail: { user: this.user } }));
      });
    } else {
      // Offline or fallback session sync via /api/auth/me
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const data = await meRes.json();
          this.user = data.user;
          if (data.user) {
            localStorage.setItem("ktd_user", JSON.stringify(data.user));
          } else {
            localStorage.removeItem("ktd_user");
          }
        }
      } catch (e) {}

      this.isInitialized = true;
      this.renderHeaderAuth();
      document.dispatchEvent(new CustomEvent("ktd:auth-ready", { detail: { user: this.user } }));
    }
  },

  getUser() {
    return this.user;
  },

  isLoggedIn() {
    return Boolean(this.user);
  },

  async getIdToken() {
    if (window.firebase && firebase.auth().currentUser) {
      return firebase.auth().currentUser.getIdToken();
    }
    return null;
  },

  /**
   * Route Guard: Protect private pages
   */
  requireAuth(redirectTarget = window.location.pathname) {
    if (!this.isLoggedIn()) {
      const target = encodeURIComponent(redirectTarget);
      window.location.href = `login.html?redirect=${target}`;
      return false;
    }
    return true;
  },

  /**
   * Register with Email + Password via Firebase Authentication
   */
  async register({ name, username, email, password }) {
    await this.ensureFirebaseLoaded();

    if (!window.firebase || !firebase.auth) {
      return { success: false, error: "Firebase Authentication is not ready. Please try again." };
    }

    try {
      const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      
      // Update display name
      if (name && cred.user) {
        await cred.user.updateProfile({ displayName: name });
      }

      // Send email verification
      try {
        await cred.user.sendEmailVerification();
      } catch (e) {
        console.warn("Could not send verification email:", e.message);
      }

      // Get ID token and sync with backend
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/sync-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ idToken, name, username })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create application user.");

      this.user = data.user;
      localStorage.setItem("ktd_user", JSON.stringify(data.user));
      this.renderHeaderAuth();
      return { success: true, user: data.user };
    } catch (err) {
      let msg = err.message;
      if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists. Please sign in.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      return { success: false, error: msg };
    }
  },

  /**
   * Sign In with Email or Username + Password via Firebase Authentication
   */
  async login(identifier, password) {
    await this.ensureFirebaseLoaded();

    if (!window.firebase || !firebase.auth) {
      return { success: false, error: "Firebase Authentication is not ready. Please try again." };
    }

    // Resolve username to email if necessary
    let targetEmail = (identifier || "").trim();
    if (targetEmail && !targetEmail.includes('@')) {
      try {
        const resolveRes = await fetch('/api/auth/resolve-identifier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: targetEmail })
        });
        if (resolveRes.ok) {
          const resolveData = await resolveRes.json();
          targetEmail = resolveData.email;
        } else {
          return { success: false, error: 'No account found with this username.' };
        }
      } catch (e) {
        // Continue with original identifier
      }
    }

    try {
      const cred = await firebase.auth().signInWithEmailAndPassword(targetEmail, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/sync-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ idToken })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sync session with backend.");

      this.user = data.user;
      localStorage.setItem("ktd_user", JSON.stringify(data.user));
      this.renderHeaderAuth();
      return { success: true, user: data.user };
    } catch (err) {
      let msg = err.message;
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please try again later or reset your password.";
      }
      return { success: false, error: msg };
    }
  },

  /**
   * Sign In with Google via Firebase Google Provider
   */
  async loginWithGoogle() {
    await this.ensureFirebaseLoaded();

    if (!window.firebase || !firebase.auth) {
      return { success: false, error: "Firebase Authentication is not ready." };
    }

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      const cred = await firebase.auth().signInWithPopup(provider);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/sync-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ idToken })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sync Google user with backend.");

      this.user = data.user;
      localStorage.setItem("ktd_user", JSON.stringify(data.user));
      this.renderHeaderAuth();
      return { success: true, user: data.user };
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        return { success: false, error: "Google sign-in popup was closed before completion." };
      }
      return { success: false, error: err.message };
    }
  },

  /**
   * Send Phone SMS OTP via Firebase Phone Authentication
   */
  async sendPhoneOtp(phoneNumber, containerId = "recaptcha-container") {
    await this.ensureFirebaseLoaded();

    if (!window.firebase || !firebase.auth) {
      return { success: false, error: "Firebase Authentication is not available." };
    }

    // Normalize Indian phone number
    let cleaned = phoneNumber.replace(/[\s\-\(\)\.]/g, '');
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.substring(1);
    }

    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      return { success: false, error: "Please enter a valid 10-digit Indian mobile number." };
    }

    const formattedPhone = `+91${cleaned}`;

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {
          size: "invisible",
          callback: () => {}
        });
      }

      this.confirmationResult = await firebase.auth().signInWithPhoneNumber(formattedPhone, window.recaptchaVerifier);
      return { success: true, cooldownSeconds: 60, formattedPhone };
    } catch (err) {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
      return { success: false, error: err.message || "Failed to send SMS code." };
    }
  },

  /**
   * Verify Phone SMS OTP via Firebase Phone Authentication
   */
  async verifyPhoneOtp(arg1, arg2 = {}) {
    if (!this.confirmationResult) {
      return { success: false, error: "No active verification session. Please request a new OTP." };
    }

    let code;
    let name;
    let username;
    if (typeof arg1 === 'object' && arg1 !== null) {
      code = arg1.otp || arg1.code;
      name = arg1.name;
      username = arg1.username;
    } else {
      code = arg1;
      name = arg2.name;
      username = arg2.username;
    }

    if (!code) {
      return { success: false, error: "Please enter the verification code." };
    }

    try {
      const cred = await this.confirmationResult.confirm(code);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/sync-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ idToken, name, username })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to complete phone sign-in.");

      this.user = data.user;
      localStorage.setItem("ktd_user", JSON.stringify(data.user));
      this.renderHeaderAuth();
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || "Incorrect verification code." };
    }
  },

  /**
   * Password Reset via Firebase Authentication
   */
  async forgotPassword(email) {
    await this.ensureFirebaseLoaded();

    if (!window.firebase || !firebase.auth) {
      return { success: false, error: "Firebase Authentication is not ready." };
    }

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      return {
        success: true,
        message: "Password reset instructions have been sent to your email address."
      };
    } catch (err) {
      let msg = err.message;
      if (err.code === "auth/user-not-found") {
        // Protect against email enumeration
        return { success: true, message: "If an account exists with that email, instructions have been sent." };
      }
      return { success: false, error: msg };
    }
  },

  /**
   * Confirm Password Reset with Firebase action code / token
   */
  async resetPassword(arg1, arg2) {
    await this.ensureFirebaseLoaded();

    let code;
    let newPassword;
    if (typeof arg1 === 'object' && arg1 !== null) {
      code = arg1.token || arg1.oobCode || arg1.code;
      newPassword = arg1.newPassword || arg1.password;
    } else {
      code = arg1;
      newPassword = arg2;
    }

    if (!code) {
      return { success: false, error: "Missing password reset token or code." };
    }
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }

    if (!window.firebase || !firebase.auth) {
      return { success: false, error: "Firebase Authentication is not ready." };
    }

    try {
      await firebase.auth().confirmPasswordReset(code, newPassword);
      return { success: true, message: "Your password has been successfully reset. You can now sign in." };
    } catch (err) {
      let msg = err.message;
      if (err.code === "auth/invalid-action-code" || err.code === "auth/expired-action-code") {
        msg = "The password reset link is invalid or has expired. Please request a new one.";
      }
      return { success: false, error: msg };
    }
  },

  /**
   * Quick Demo Login
   */
  async demoLogin(role = "traveler") {
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed");

      this.user = data.user;
      this.user.isDemo = true;
      localStorage.setItem("ktd_user", JSON.stringify(data.user));

      // If customToken is returned and Firebase SDK is loaded, sign in to Firebase client
      if (data.customToken && window.firebase && firebase.auth && !data.customToken.startsWith("dev_token_")) {
        try {
          await firebase.auth().signInWithCustomToken(data.customToken);
        } catch (e) {}
      }

      this.renderHeaderAuth();
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Sign Out
   */
  async logout() {
    try {
      if (window.firebase && firebase.auth) {
        await firebase.auth().signOut();
      }
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}

    this.user = null;
    localStorage.removeItem("ktd_user");
    this.renderHeaderAuth();
    window.location.href = "login.html";
  },

  /**
   * Update Profile Details
   */
  async updateProfile(payload) {
    try {
      let idToken = await this.getIdToken();
      const headers = { "Content-Type": "application/json" };
      if (idToken) headers["Authorization"] = `Bearer ${idToken}`;

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      this.user = { ...this.user, ...data.user };
      localStorage.setItem("ktd_user", JSON.stringify(this.user));
      this.renderHeaderAuth();
      return { success: true, user: this.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Link Additional Provider Accounts (Password, Phone, WhatsApp)
   */
  async linkAccount(data) {
    await this.ensureFirebaseLoaded();

    if (data.type === 'whatsapp') {
      return this.verifyWhatsAppOtp({ whatsappNumber: data.whatsappNumber, otp: data.otp });
    }

    if (data.type === 'password') {
      const fbUser = window.firebase && firebase.auth().currentUser;
      if (fbUser) {
        try {
          if (data.password) {
            await fbUser.updatePassword(data.password);
            return { success: true, message: 'Password updated successfully in Firebase.' };
          }
        } catch (err) {
          return { success: false, error: err.message };
        }
      }
      return { success: false, error: 'Firebase authentication session not active.' };
    }

    if (data.type === 'phone') {
      if (this.confirmationResult && data.otp) {
        try {
          const cred = firebase.auth.PhoneAuthProvider.credential(this.confirmationResult.verificationId, data.otp);
          const fbUser = window.firebase && firebase.auth().currentUser;
          if (fbUser) {
            await fbUser.linkWithCredential(cred);
          }
          const idToken = fbUser ? await fbUser.getIdToken(true) : null;
          if (idToken) {
            const res = await fetch('/api/auth/sync-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
              },
              body: JSON.stringify({ idToken, phoneNumber: data.phoneNumber })
            });
            const resData = await res.json();
            if (res.ok) {
              this.user = resData.user;
              localStorage.setItem('ktd_user', JSON.stringify(resData.user));
              return { success: true, user: resData.user };
            }
          }
          return { success: true };
        } catch (err) {
          return { success: false, error: err.message || 'Failed to link phone number.' };
        }
      }
      return { success: false, error: 'No active phone verification session.' };
    }

    return { success: false, error: 'Unsupported account linking provider.' };
  },

  /**
   * Render User Header Dropdown across all pages
   */
  renderHeaderAuth() {
    const containers = document.querySelectorAll("#headerAuthContainer, .auth-buttons, #nav-auth-container");
    if (!containers || containers.length === 0) return;

    containers.forEach((container) => {
      if (this.user) {
        const displayName = this.user.name || this.user.username || "Traveler";
        const firstName = displayName.split(" ")[0];
        const avatarUrl = this.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

        container.innerHTML = `
          <div class="user-menu-wrap" style="position: relative; display: inline-block;">
            <button class="user-profile-btn" id="userMenuToggle" aria-label="User Menu" style="display: flex; align-items: center; gap: 8px; background: #ffffff; border: 1.5px solid #e2e8f0; padding: 5px 12px; border-radius: 9999px; cursor: pointer; transition: all 0.2s;">
              <img 
                src="${avatarUrl}" 
                alt="${displayName}" 
                class="user-avatar"
                style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;"
                onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=KTD'"
              />
              <span class="user-name-text" style="font-size: 13px; font-weight: 700; color: #1e293b; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${firstName}</span>
              <span style="font-size: 10px; color: #94a3b8;">▼</span>
            </button>
            <div class="user-dropdown" id="userDropdown" style="position: absolute; top: calc(100% + 8px); right: 0; width: 230px; background: #ffffff; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); border: 1px solid #e2e8f0; padding: 8px; display: none; z-index: 1000;">
              <div class="user-dropdown-header" style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; margin-bottom: 4px;">
                <div style="font-size: 11px; color: #94a3b8; font-weight: 600;">Signed in with Firebase</div>
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.user.email || this.user.phoneNumber || displayName}</div>
              </div>
              <a href="profile.html" class="dropdown-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none;">👤 Traveler Profile</a>
              <a href="trips.html" class="dropdown-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none;">🗺️ My Road Trips</a>
              <a href="diary.html" class="dropdown-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none;">📖 Travel Diary</a>
              <a href="favorites.html" class="dropdown-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none;">❤️ Saved Places</a>
              <a href="profile.html#security" class="dropdown-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none;">🔒 Account Security</a>
              <div style="border-top: 1px solid #f1f5f9; margin-top: 4px; padding-top: 4px;">
                <button onclick="Auth.logout()" class="dropdown-item logout" style="width: 100%; border: none; background: none; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #dc2626;">
                  🚪 Sign Out
                </button>
              </div>
            </div>
          </div>
        `;

        const toggle = container.querySelector("#userMenuToggle");
        const dropdown = container.querySelector("#userDropdown");
        if (toggle && dropdown) {
          toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
          });
          document.addEventListener("click", () => {
            dropdown.style.display = "none";
          });
        }
      } else {
        container.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="login.html" class="btn btn-secondary btn-sm" style="padding: 7px 14px; font-size: 13px; font-weight: 600; border-radius: 8px; text-decoration: none; color: #334155; background: #f1f5f9; border: 1px solid #e2e8f0;">Log In</a>
            <a href="register.html" class="btn btn-primary btn-sm" style="padding: 7px 14px; font-size: 13px; font-weight: 600; border-radius: 8px; text-decoration: none; color: #ffffff; background: #5c4fe5;">Sign Up</a>
          </div>
        `;
      }
    });
  }
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  Auth.init();
});

window.Auth = Auth;
