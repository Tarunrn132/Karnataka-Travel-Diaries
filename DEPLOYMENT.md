# Karnataka Travel Diaries — Production Deployment & SEO Guide

This document provides complete, step-by-step instructions for deploying the **Karnataka Travel Diaries** application to production and connecting it to a custom domain and Google Search Console.

---

## 1. Architecture Overview

* **Frontend**: Pure Vanilla HTML5, CSS3, and JavaScript (Leaflet Maps, Local & Firebase Auth).
* **Backend**: Node.js & Express 5 REST API (`server.js`).
* **Database**: Prisma ORM (SQLite `dev.db` locally, easily switchable to PostgreSQL/Supabase/Neon for high-concurrency production).
* **Authentication**: Firebase Authentication (Email/Password, Google OAuth, Phone/SMS OTP) with server-side Firebase Admin SDK session verification.
* **AI & Planning**: Embedded Local Grounded RAG + optional Gemini/OpenAI integration.
* **Maps & Geo**: Leaflet 1.9.4 with OpenStreetMap tiles & 31 Karnataka Districts + 240 Taluks geographic hierarchy.
* **SEO Layer**: Pre-rendered Open Graph tags, canonical URLs, Schema.org JSON-LD structured data (`TouristDestination`, `BreadcrumbList`, `WebSite`), `sitemap.xml`, and `robots.txt`.

---

## 2. Deployment Strategies

You can deploy Karnataka Travel Diaries using either of two industry-standard patterns:

### Option A: Unified Full-Stack Node.js Deployment (Recommended)
Deploy the entire application as a single Node.js service on **Render**, **Railway**, **Fly.io**, **DigitalOcean**, or **AWS Lightsail**.
* **Advantage**: Zero CORS friction, automatic SSR SEO meta-injection, single environment, single domain (`https://YOUR-PRODUCTION-DOMAIN.com`).

### Option B: Split Architecture (Vercel Frontend + Render/Railway Backend)
* **Frontend**: Deployed to **Vercel** as a static project. The included `vercel.json` automatically proxies `/api/*` requests to your backend and enforces security headers.
* **Backend**: Deployed to **Render** or **Railway** providing the REST API at `https://api.YOUR-PRODUCTION-DOMAIN.com`.

---

## 3. Production Environment Variables Reference

Configure these environment variables in your hosting dashboard (e.g., Render, Railway, or Vercel). **Never commit real values into git.**

| Variable | Scope | Public / Secret | Description & Recommended Production Value |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Backend | Public | Set to `production` |
| `PORT` | Backend | Public | Assigned automatically by hosting platform (default `3000`) |
| `DATABASE_URL` | Backend | **SECRET** | Connection string e.g. `postgresql://user:pass@host:5432/ktd?sslmode=require` or `file:./dev.db` |
| `JWT_SECRET` | Backend | **SECRET** | Strong random 32+ character key (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_APP_URL` | Frontend & Backend | Public | Full production URL: `https://YOUR-PRODUCTION-DOMAIN.com` |
| `FRONTEND_URL` | Backend | Public | Origin for CORS whitelist: `https://YOUR-PRODUCTION-DOMAIN.com` |
| `CORS_ORIGIN` | Backend | Public | Allowed CORS origins: `https://YOUR-PRODUCTION-DOMAIN.com` |
| `ENABLE_DEMO_LOGIN` | Backend | Public | Set to `false` in production |
| `FIREBASE_API_KEY` | Client & Backend | Public | From Firebase Console Web App configuration |
| `FIREBASE_AUTH_DOMAIN` | Client & Backend | Public | e.g. `karnataka-travel-diaries.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Client & Backend | Public | e.g. `karnataka-travel-diaries` |
| `FIREBASE_STORAGE_BUCKET`| Client & Backend | Public | e.g. `karnataka-travel-diaries.firebasestorage.app` |
| `FIREBASE_MESSAGING_SENDER_ID`| Client & Backend | Public | From Firebase Console Web App configuration |
| `FIREBASE_APP_ID` | Client & Backend | Public | From Firebase Console Web App configuration |
| `FIREBASE_CLIENT_EMAIL`| Backend | **SECRET** | Service Account Email from Google Cloud / Firebase Admin SDK |
| `FIREBASE_PRIVATE_KEY` | Backend | **SECRET** | Full RSA Private Key with newline characters (`\n`) |
| `GEMINI_API_KEY` | Backend | **SECRET** | (Optional) Google Gemini API Key for LLM expansion |
| `WHATSAPP_API_KEY` | Backend | **SECRET** | (Optional) Meta Cloud API access token if using WhatsApp OTP |
| `WHATSAPP_PHONE_NUMBER_ID` | Backend | **SECRET** | (Optional) Meta Phone Number ID for WhatsApp Business |

---

## 4. Step-by-Step Deployment Instructions

### Step 4.1: Database Setup
1. **Using SQLite (Default for low-traffic/single instance)**:
   - No external database required. The app will generate and use `prisma/dev.db`.
2. **Using PostgreSQL (Recommended for production scaling)**:
   - Create a free PostgreSQL instance on **Supabase**, **Neon.tech**, or **Railway**.
   - Copy the connection URI: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require`.
   - In `prisma/schema.prisma`, change:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - Push the schema to your production database:
     ```bash
     DATABASE_URL="your_postgresql_url" npx prisma db push
     DATABASE_URL="your_postgresql_url" node scripts/seed.mjs
     ```

### Step 4.2: Backend Deployment (e.g. Render / Railway)
1. Push your repository to GitHub or GitLab.
2. In **Render** (or **Railway**), create a new **Web Service**.
3. Connect your repository.
4. Set:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add all required variables from the table above.
6. Trigger the deployment.
7. Once deployed, verify your service by opening `https://YOUR-BACKEND-URL/health`. It will return:
   ```json
   {
     "status": "ok",
     "service": "karnataka-travel-diaries",
     "uptime": 120,
     "timestamp": "2026-09-27T..."
   }
   ```

### Step 4.3: Frontend Deployment on Vercel (If using Option B)
1. In the **Vercel Dashboard**, click **Add New Project** and import the repository.
2. **Framework Preset**: Other (Static / HTML).
3. **Build Command**: `npm run build`
4. **Output Directory**: `.` (Root directory).
5. In **Environment Variables**, set:
   - `NEXT_PUBLIC_APP_URL`: `https://YOUR-PRODUCTION-DOMAIN.com`
6. In `vercel.json`, ensure the rewrite destination points to your live backend:
   ```json
   {
     "source": "/api/:path*",
     "destination": "https://api.YOUR-PRODUCTION-DOMAIN.com/api/:path*"
   }
   ```
7. Click **Deploy**.

---

## 5. Firebase Authentication Production Settings

Because the application relies on Firebase Authentication as the primary identity provider, you must register your production domain in the Firebase Console:

1. Open **[Firebase Console](https://console.firebase.google.com/)** and select your project (`karnataka-travel-diaries`).
2. Go to **Authentication** &rarr; **Settings** &rarr; **Authorized domains**.
3. Click **Add domain**.
4. Add:
   - `YOUR-PRODUCTION-DOMAIN.com`
   - `www.YOUR-PRODUCTION-DOMAIN.com`
   - Your hosting domain (e.g., `karnataka-travel-diaries.vercel.app` or `karnataka-travel-diaries.onrender.com`).
5. For **Google Sign-In**:
   - Ensure the Google OAuth client created under **Google Cloud Console &rarr; Credentials &rarr; OAuth 2.0 Client IDs** has the authorized redirect URI:
     `https://<YOUR-FIREBASE-PROJECT-ID>.firebaseapp.com/__/auth/handler`
6. For **Phone/SMS Authentication**:
   - If using SMS in production, configure production SMS quotas in Firebase Authentication &rarr; Sign-in method &rarr; Phone.

---

## 6. Custom Domain & DNS Setup

Once you register a domain (e.g. at Namecheap, GoDaddy, Cloudflare, or Google Domains):

| Type | Name / Host | Target / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **A** | `@` (or apex) | Provider IP (e.g. `76.76.21.21` for Vercel) | Points root domain to frontend |
| **CNAME** | `www` | `cname.vercel-dns.com` or backend host | Handles `www` subdomain |
| **CNAME** | `api` (If using Option B) | `your-app.onrender.com` | Dedicated API subdomain |

*Enable automatic HTTPS/SSL certificates in your hosting provider's dashboard.*

---

## 7. Search Engine Optimization (SEO) & Google Search Console

The application has been engineered for maximum search visibility:

### 7.1 Technical SEO Assets
* **Robots.txt**: Live at `https://YOUR-PRODUCTION-DOMAIN.com/robots.txt`
  - Explicitly permits Googlebot to index all 25 destination guides, explore filters, map, and the homepage.
  - Automatically disallows private user accounts, dashboards, trips, and authentication endpoints.
* **Sitemap.xml**: Live at `https://YOUR-PRODUCTION-DOMAIN.com/sitemap.xml`
  - Generated dynamically via `npm run sitemap` (included in `npm run build`).
  - Contains all 29 primary public canonical URLs with freshness timestamps and priority weights.
* **Server-Side Rendered Meta Tags**:
  - Whenever a crawler accesses `https://YOUR-PRODUCTION-DOMAIN.com/destination.html?id=<slug>`, Express immediately returns complete `<title>`, `<meta name="description">`, Open Graph, and Twitter tags without requiring client-side JS execution.
* **Structured Data**:
  - Schema.org `TouristDestination` & `BreadcrumbList` on every destination guide.
  - Schema.org `WebSite` & `TravelAgency` on homepage.
  - Schema.org `CollectionPage` on explore directory.
  - Schema.org `Map` on interactive map page.
  - Schema.org `WebApplication` on AI planner.

### 7.2 Google Search Console Submission Steps
1. Navigate to **[Google Search Console](https://search.google.com/search-console)**.
2. Click **Add Property** and select **URL prefix**: `https://YOUR-PRODUCTION-DOMAIN.com`.
3. Choose **HTML tag** verification method or **DNS TXT record** verification method.
4. Once verified, click **Sitemaps** in the left sidebar.
5. In the **Add a new sitemap** input, enter:
   `sitemap.xml`
6. Click **Submit**. Googlebot will queue and crawl all 25 destination pages.
7. Use the **URL Inspection** tool on your top destinations (e.g. `https://YOUR-PRODUCTION-DOMAIN.com/destination.html?id=hampi`) to confirm that Googlebot renders the metadata and Schema.org rich results properly.

---

## 8. Verification & QA Commands

Run these automated verification checks locally before or after any deployment:

```bash
# 1. Run production build and generate sitemap
npm run build

# 2. Run full 38-point authentication and security suite
npm test

# 3. Run auth flow & protected route checks
npm run test:auth

# 4. Run OTP, WhatsApp, and password recovery checks
npm run test:otp

# 5. Check backend health endpoint
curl -s http://localhost:3000/health

# 6. Check robots.txt directives
curl -s http://localhost:3000/robots.txt

# 7. Check XML sitemap
curl -s http://localhost:3000/sitemap.xml
```
