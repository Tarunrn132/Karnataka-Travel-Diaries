# Karnataka Travel Diaries

> A comprehensive full-stack travel discovery and itinerary planning platform dedicated to Karnataka. Explore 25 curated destinations across 31 districts, discover heritage and natural wonders, build custom road trip itineraries, navigate with interactive Leaflet maps and Google Maps driving directions, save favorites, and preserve personal travel journals.

---

## 🌄 Overview

**Karnataka Travel Diaries** is a centralized travel companion built to showcase the rich geographical and cultural diversity of Karnataka — from the misty coffee estates of Coorg and Chikmagalur to the royal palaces of Mysuru, the ancient boulder-strewn ruins of Hampi, the pristine shores of Gokarna and Udupi, and the untamed forests of Bandipur and Kabini.

### What Problem It Solves
Travel planning across Karnataka is often fragmented across multiple sources for sights, distances, driving routes, local advice, and booking notes. Karnataka Travel Diaries consolidates this experience into an integrated web platform offering verified destination guides, district-taluk administrative context, interactive spatial mapping, turn-by-turn driving navigation, customizable road trip itineraries, personal travel journaling, and real-time meteorological reports.

### Who It Is For
- **Road Trippers & Weekend Explorers**: Travelers planning weekend escapes or multi-day driving journeys from Bengaluru, Mysuru, Mangaluru, and other regional hubs.
- **Cultural & Heritage Travelers**: Visitors exploring UNESCO World Heritage monuments (Hampi, Pattadakal), ancient Hoysala temples (Belur, Halebidu), and coastal shrines.
- **Nature & Adventure Enthusiasts**: Trekkers and nature lovers seeking waterfalls, wildlife safaris, hill stations, and coastal retreats across the Western Ghats.
- **Independent Travelers**: Anyone who wants to curate personal itineraries, track saved places, and log memorable journeys in a private travel diary.

### What Users Can Do
- **Discover Destinations**: Browse 25 hand-curated destinations categorized by landscape, with local attractions, visiting hours, photo galleries, and recommended visit durations.
- **Filter & Search**: Search destinations in real time, apply district and taluk filters, sort by popularity or name, or use live GPS to find destinations closest to their current location.
- **Navigate & Map**: View all destinations on interactive Leaflet maps, inspect place details, and open direct Google Maps turn-by-turn driving directions from their current coordinates.
- **Build Road Trips**: Create multi-day travel itineraries, order stops along chronological timelines, and manage route stops.
- **Keep a Travel Journal**: Write, rate, and publish personal travel diary entries with cover photos, visit dates, and trip reflections.
- **Save Favorites**: Bookmark destinations with one-click wishlist toggling, synchronized across devices.
- **Check Live Weather**: View real-time temperature, humidity, wind conditions, and weather advisories powered by the Open-Meteo API.
- **Manage Account & Preferences**: Register and log in using Email/Password, Google OAuth, or Phone SMS OTP via Firebase Authentication, and personalize travel interests in the profile dashboard.

---

## ✨ Features

### 🧭 Destination Discovery
- **25 Curated Karnataka Destinations**: Verified records covering Coorg, Hampi, Gokarna, Mysuru, Chikmagalur, Udupi, Sakleshpur, Bandipur, Kabini, Badami, Dandeli, Belur & Halebidu, Jog Falls, Kudremukh, Karwar, and more.
- **Comprehensive Travel Guides (`destination.html`)**:
  - High-resolution hero imagery and visual galleries.
  - In-depth descriptions, cultural highlights, and local cuisine notes.
  - Recommended visit duration (e.g., 2–3 Days) and ideal seasonal visiting windows.
  - Driving distance (km) and estimated travel time from Bengaluru.
  - Key attractions and sightseeing landmarks with descriptions and operating hours.
  - Curated experience categories: Sightseeing, Regional Gastronomy, Heritage & Culture, Nature & Trails.
  - Community reviews and star ratings.

### 🔍 Search & Exploration (`explore.html`)
- **Instant Search**: Real-time keyword filtering across destination names, attractions, and descriptions.
- **Landscape Category Chips**: Quick filtering by *Temples*, *Beaches*, *Waterfalls*, *Hill Stations*, *Wildlife*, *Heritage*, *Adventure*, *Food*, and *Hidden Gems*.
- **Administrative Filters**: District-level and Taluk-level selectors grounded in Karnataka's 31-district administrative hierarchy.
- **Sorting Options**: Sort destinations by *Popularity & Top Rated*, *Alphabetical (A–Z)*, or *Nearest to You*.
- **"Explore Near Me" GPS**: Uses the browser's HTML5 Geolocation API to calculate geodesic distances from the user's live position and display nearest destinations.

### 🗺️ Maps & Navigation (`map.html`, `destination.html`, `js/maps.js`)
- **Interactive Leaflet Maps**: Vector tile mapping powered by OpenStreetMap and Leaflet (v1.9.4).
- **Full-Screen Map Explorer (`map.html`)**: Complete interactive map with category pills, live text search, and a synchronized destination sidebar list.
- **Custom Map Markers**: Handcrafted interactive pins displaying destination names, categories, ratings, thumbnail photos, and quick links.
- **"Locate Me" GPS Pin**: Detects user coordinates, drops a live location marker, and smoothly flies the viewport to their location.
- **Google Maps Driving Navigation**: 1-click directions that launch Google Maps (`https://www.google.com/maps/dir/?api=1&origin=...&destination=...&travelmode=driving`) with exact GPS coordinates. Includes a graceful fallback search dialog if geolocation permissions are unavailable.

### 📅 Trip Planning (`trips.html`, `js/trips.js`)
- **Custom Itinerary Creation**: Plan road trips with a custom title, travel dates, and personal notes.
- **Timeline Stops**: Add destinations as sequential stops along a chronological road trip roadmap.
- **Stop Reordering**: Move stops up or down with one click to optimize travel routes.
- **Stop-Level Directions**: Launch turn-by-turn driving directions to any individual stop directly from the itinerary timeline.
- **Dual Persistence**: Instant updates saved to `localStorage` and automatically synchronized to SQLite via `/api/trips` for logged-in users.

### 👤 User Account & Authentication (`login.html`, `register.html`, `profile.html`, `js/auth.js`)
- **Multi-Method Firebase Authentication**:
  - **Email & Password**: Registration and sign-in with password strength validation and verification email dispatch.
  - **Google OAuth**: One-click sign-in via Google popup authentication.
  - **Phone SMS OTP**: Mobile login with normalized Indian numbers (`+91`) and reCAPTCHA verification.
- **Secure Backend Synchronization**: Client sends Firebase ID Tokens to Express (`/api/auth/sync-session`), where the Firebase Admin SDK verifies tokens and maps accounts to SQLite Prisma records.
- **Route Protection**: Client-side authentication guard (`Auth.requireAuth()`) protects private pages (trips, diary, favorites, profile).
- **Profile Dashboard (`profile.html`)**: Update display names, usernames, view linked authentication providers, and configure travel interest preferences.

### ❤️ Favorites / Saved Places (`favorites.html`, `js/favorites.js`)
- **Wishlist Toggle**: Heart icon on every destination card and guide page for instant saving.
- **Real-Time Badge Counter**: Navigation header badge dynamically reflects the number of saved places.
- **Dedicated Saved Page (`favorites.html`)**: Dedicated management view to browse and remove saved destinations.
- **Automatic Sync**: Local storage bookmarks sync to the backend database (`/api/favorites`) upon login.

### 📖 Travel Journal / Diary (`diary.html`, `js/diary.js`)
- **Personal Travel Logging**: Create diary entries detailing personal journeys across Karnataka.
- **Structured Fields**: Select destination, story title, visit date, star rating (1–5), photo URL/path, and personal reflections.
- **Visual Story Cards**: Displays journal entries with cover photography, destination tags, visit dates, and ratings.
- **Full Story Viewer**: Interactive modal to read complete diary entries.
- **Dual Persistence**: Offline-first `localStorage` storage backed by server synchronization (`/api/diary`).

### 🌤️ Live Weather (`destination.html`, `backend/services/weatherService.js`)
- **Real-Time Meteorological Data**: Fetches live weather conditions via the open-access Open-Meteo API.
- **Meteorological Indicators**: Live temperature (°C), WMO weather condition descriptions (Clear, Cloudy, Rain Showers, Mist, Thunderstorm), wind speed (km/h), relative humidity (%), and precipitation probability.
- **Practical Travel Notes**: Generates weather-conscious recommendations based on actual meteorological data (e.g., advising rain gear for wet conditions or morning monument visits during hot periods).

### 💡 Behavioral Recommendations (`profile.html`, `backend/services/recommendationService.js`)
- **Personalized Suggestions**: Recommendation engine evaluating user travel interests (e.g., Mountains, Heritage, Nature, Photography, Waterfalls, Adventure).
- **Behavioral Affinity Scoring**: Computes affinity scores based on saved wishlist items, travel style, and past trip destinations.
- **Explainable Reasons**: Every recommended destination displays a clear, human-readable reason (e.g., *"Matches your travel interests: Heritage, Photography"*).

### 📱 Responsive Design & UI
- **Mobile-First Experience**: Built using Vanilla CSS with flexbox and CSS grid layouts (`css/style.css`, `css/components.css`, `css/responsive.css`).
- **Adaptive Navigation**: Sticky desktop header with quick links, wishlist counter, and auth controls, transitioning to an off-canvas mobile drawer and persistent bottom navigation bar on handheld screens.
- **Curated Color Palette**: Forest greens, warm golds, and slate grays reflecting Karnataka's landscapes.

### 🚀 Search Engine Optimization (SEO)
- **Dynamic Server-Side Meta Injection**: `server.js` dynamically injects canonical URLs, Open Graph tags, Twitter Cards, and Schema.org JSON-LD structured data (`TouristDestination`, `BreadcrumbList`) for destination pages (`/destination.html?id=:id`).
- **Structured Schema.org Data**: Implements `WebSite`, `TouristDestination`, `CollectionPage`, and `BreadcrumbList` schemas.
- **Automated Sitemap (`sitemap.xml`)**: Generated via `scripts/generateSitemap.mjs`, indexing all 25 canonical destination routes and core pages.
- **Crawl Directives (`robots.txt`)**: Allows search engine crawlers on public guide pages while disallowing authenticated user dashboards.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Structure** | HTML5 | Semantic, accessible markup across all pages |
| **Frontend Styling** | Vanilla CSS3 | Custom design tokens, responsive CSS grid, flexbox, zero CSS frameworks |
| **Frontend Logic** | Vanilla JavaScript (ES6+) | Native ES6 modules, asynchronous `fetch()`, DOM manipulation, zero frontend frameworks |
| **Interactive Maps** | Leaflet (v1.9.4) & OpenStreetMap | Open-source map rendering with custom pins and popups |
| **Navigation & Geolocation** | HTML5 Geolocation API & Google Maps | Client-side coordinate acquisition with Google Maps driving directions URL integration |
| **Weather Service** | Open-Meteo API | Free, keyless meteorological API for live temperature, wind, humidity, and forecasts |
| **Backend Runtime** | Node.js (>= 20.0.0) | Server runtime supporting native environment loading (`process.loadEnvFile`) |
| **Backend Framework** | Express (v5.2.1) | Modular REST API routing, cookie handling, CORS middleware, static asset serving |
| **Database** | SQLite (`prisma/dev.db`) | Relational file-based database for users, trips, favorites, diaries, and preferences |
| **ORM** | Prisma (v6.4.1) | Type-safe schema modeling, migrations (`prisma db push`), and query client |
| **Authentication** | Firebase Authentication & Firebase Admin SDK (v14.5.0) | Email/Password, Google OAuth, and Phone SMS OTP with server-side token validation |
| **Token Handling & Security** | jose (v5.9.6) & bcryptjs (v2.4.3) | JWT session signing/verification and fallback password hashing |
| **Hosting & Deployment** | Render / Vercel / Node.js | Single-service Node deployment on Render (`render.yaml`) or split frontend proxy on Vercel (`vercel.json`) |

---

## 📁 Project Structure

```text
Karnataka-Travel-Diaries/
├── backend/
│   ├── routes/
│   │   ├── auth.js                     # Firebase auth synchronization, profile, and demo login
│   │   ├── recommendations.js          # Personalized destination recommendation endpoints
│   │   └── user.js                     # User travel preferences and profile settings
│   └── services/
│       ├── authService.js              # Authentication helpers and OTP verification
│       ├── budgetService.js            # Transparent road trip budget estimation models
│       ├── firebaseAdmin.js            # Firebase Admin SDK initialization and token validation
│       ├── geoService.js               # 31 Districts and 240 Taluks hierarchy and route caching
│       ├── recommendationService.js    # Behavioral recommendation scoring engine
│       ├── routeOptimizer.js           # Haversine distance calculations and hub routing
│       └── weatherService.js           # Open-Meteo API weather integration and travel advisories
├── css/
│   ├── auth.css                        # Authentication modal and form styling
│   ├── components.css                  # Reusable UI components (cards, pills, buttons, modals)
│   ├── responsive.css                  # Mobile breakpoints and adaptive layout rules
│   └── style.css                       # Global styles, variables, typography, and base layout
├── data/
│   ├── karnataka-geo-hierarchy.json    # Administrative dataset of 31 districts and 240 taluks
│   └── knowledge-base.json             # Structured destination dataset with sights and seasons
├── images/
│   ├── destinations/                   # Curated photography for all 25 destinations
│   └── hero/                           # Banner images and brand visual assets
├── js/
│   ├── app.js                          # Application bootstrap, navigation drawer, and notifications
│   ├── auth.js                         # Firebase client SDK wrapper, login/register, session sync
│   ├── data.js                         # Centralized destination store (25 destinations & clusters)
│   ├── destinations.js                 # Destination card rendering and Google Maps directions
│   ├── diary.js                        # Travel diary management and local storage syncing
│   ├── favorites.js                    # Favorites wishlist management and header counter
│   ├── maps.js                         # Leaflet map component with custom markers and locate me
│   ├── recommendations.js              # Client recommendation rendering
│   ├── reviews.js                      # Destination review submission and display
│   └── trips.js                        # Road trip itinerary builder, stops, and timeline
├── prisma/
│   ├── dev.db                          # SQLite database file
│   └── schema.prisma                   # Prisma data models (User, Destination, Trip, Diary, etc.)
├── public/
│   ├── icons/                          # Application iconography
│   ├── images/                         # Public image assets
│   └── sitemap.xml                     # Pre-rendered XML sitemap
├── scripts/
│   ├── generateGeoHierarchy.mjs        # Script to compile district and taluk hierarchy
│   ├── generateSitemap.mjs             # Dynamic sitemap generator for production SEO
│   ├── seed.mjs                        # Database seeder for destinations and sample records
│   ├── testAuthFlows.mjs               # Authentication integration test runner
│   ├── testDistrictTalukScenarios.mjs  # Geographic hierarchy validation tests
│   └── verifyAllAuth.mjs               # Comprehensive auth verification test suite
├── .env.example                        # Environment variable configuration template
├── DEPLOYMENT.md                       # Production deployment and custom domain setup guide
├── destination.html                    # Individual destination guide and weather page
├── diary.html                          # Personal travel diary and journal page
├── explore.html                        # Destination catalog with search, filters, and sorting
├── favorites.html                      # Saved destinations wishlist page
├── index.html                          # Homepage with hero search, landscape cards, and map
├── login.html                          # User sign-in page (Email, Google, Phone OTP)
├── map.html                            # Full-screen interactive Leaflet tourism map
├── package.json                        # Node.js project manifest and scripts
├── profile.html                        # User profile dashboard and travel preferences
├── register.html                       # Account registration page
├── render.yaml                         # Render blueprint deployment configuration
├── reset-password.html                 # Password recovery workflow page
├── robots.txt                          # Search engine crawling rules
├── server.js                           # Express 5 server entrypoint, REST APIs, and SEO SSR
├── sitemap.xml                         # Production XML sitemap
├── trips.html                          # Road trip itinerary builder and timeline view
└── vercel.json                         # Vercel deployment and API rewrite rules
```

---

## 🗄️ Database Models (Prisma & SQLite)

The database schema (`prisma/schema.prisma`) defines the core entities powering the application:

| Model | Description |
|---|---|
| `User` | Core account credentials, Firebase UID, contact details, roles, and profile timestamps |
| `UserPreference` | Travel interests (*Mountains, Nature, Heritage, etc.*), travel style, and transport mode |
| `Destination` | 25 destinations with coordinates, districts, descriptions, ratings, and gallery links |
| `Attraction` | Sightseeing landmarks linked to destinations with visiting hours and coordinates |
| `District` | 31 Karnataka administrative districts with regional classifications and geographic centers |
| `Taluk` | 240 Karnataka administrative taluks with neighboring relationships and coordinates |
| `Favorite` | User-destination bookmark pairings (unique per user and destination) |
| `Trip` | User-created road trip itineraries with titles, date ranges, and descriptions |
| `TripDestination` | Ordered stops within a trip, tracking sequence (`visitOrder`) and personal notes |
| `TravelDiary` | User travel journal entries with title, content, ratings, visit dates, and photos |
| `Review` | Destination reviews with star ratings (1–5) and written feedback |
| `PasswordResetToken`| Secure hashed tokens for password reset workflows |
| `RouteCache` | Cached inter-destination driving distances, travel minutes, and road classifications |

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 10.0.0 or higher

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/Tarunrn132/Karnataka-Travel-Diaries.git
cd Karnataka-Travel-Diaries
npm install
```

### 3. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```
Open `.env` and configure your settings (see [Environment Variables](#-environment-variables) below). For local development, the default SQLite settings work immediately.

### 4. Initialize Database & Seed Data
```bash
# Push Prisma schema to SQLite dev.db
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed destinations, attractions, and sample data
npm run db:seed
```

### 5. Generate Sitemap
```bash
npm run sitemap
```

### 6. Start the Server
```bash
# Start development / production server
npm start
```
The application will be live at: **`http://localhost:3000`**

---

## 🔐 Environment Variables

Create a `.env` file in the root directory following `.env.example`:

```env
# Database URL (SQLite for local development, or PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# Server Port
PORT=3000

# Node Environment ("development" or "production")
NODE_ENV="development"

# JWT Signing Secret (Generate using: openssl rand -base64 32)
JWT_SECRET="your_secure_random_jwt_signing_secret_min_32_chars"

# Base Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"

# Quick Demo Login (Set to "false" in production)
ENABLE_DEMO_LOGIN="true"

# Seeder Password (Used during 'npm run db:seed')
SEED_DEFAULT_PASSWORD="your_secure_seed_password_here"

# Firebase Authentication — Client-Side Configuration (Public / Safe for Web)
FIREBASE_API_KEY="your_firebase_web_api_key"
FIREBASE_AUTH_DOMAIN="karnataka-travel-diaries.firebaseapp.com"
FIREBASE_PROJECT_ID="karnataka-travel-diaries"
FIREBASE_STORAGE_BUCKET="karnataka-travel-diaries.firebasestorage.app"
FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
FIREBASE_APP_ID="your_firebase_web_app_id"

# Firebase Admin SDK — Server-Side Configuration (Private — NEVER commit to Git)
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@karnataka-travel-diaries.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 📡 REST API Reference

### Health & SEO Endpoints
- `GET /health` — Service health check, uptime, and status.
- `GET /robots.txt` — Search engine crawl directives.
- `GET /sitemap.xml` — Standards-compliant XML sitemap.

### Authentication (`/api/auth`)
- `GET /api/auth/config` — Public Firebase Web SDK configuration.
- `POST /api/auth/sync-session` — Validates Firebase ID Token and creates/updates Prisma user.
- `POST /api/auth/resolve-identifier` — Resolves username to email for credentials login.
- `GET /api/auth/me` — Returns current authenticated session profile.
- `POST /api/auth/demo-login` — Fast development login (when `ENABLE_DEMO_LOGIN=true`).
- `POST /api/auth/logout` — Clears authentication cookies.
- `PUT /api/auth/profile` — Updates user display name and username.

### Destinations (`/api/destinations`)
- `GET /api/destinations` — Fetches all 25 destinations with attractions.
- `GET /api/destinations/:id` — Fetches destination details by ID or slug with attractions and reviews.

### Favorites (`/api/favorites`)
- `GET /api/favorites` — Returns destination IDs saved by the authenticated user.
- `POST /api/favorites` — Toggles a destination in the user's wishlist.

### Trips (`/api/trips`)
- `GET /api/trips` — Fetches the authenticated user's road trip itineraries and stops.
- `POST /api/trips` — Creates a new trip with destination stops.
- `DELETE /api/trips/:id` — Deletes a user trip itinerary.

### Travel Diary (`/api/diary`)
- `GET /api/diary` — Fetches user's travel diary entries (or public entries).
- `POST /api/diary` — Creates a new diary entry with title, rating, visit date, and photos.

### Reviews (`/api/reviews`)
- `GET /api/reviews/:destinationId` — Fetches reviews for a specific destination.
- `POST /api/reviews` — Submits a user review with a 1–5 star rating and comment.

### User Preferences & Recommendations
- `GET /api/user/preferences` — Fetches explicit travel interests and styles.
- `POST /api/user/preferences` — Updates user travel preferences.
- `GET /api/recommendations` — Computes explainable destination recommendations.

---

## 📜 Available NPM Scripts

| Command | Description |
|---|---|
| `npm start` | Starts the Express server (`node server.js`) |
| `npm run dev` | Runs the server in local development mode |
| `npm run build` | Generates the Prisma client and builds the production sitemap |
| `npm run build:render`| Pushes Prisma schema, seeds sample data, and runs build on Render |
| `npm run sitemap` | Regenerates `sitemap.xml` using current destination slugs |
| `npm run db:push` | Synchronizes `prisma/schema.prisma` with SQLite `dev.db` |
| `npm run db:generate`| Generates the Prisma client library |
| `npm run db:seed` | Seeds destinations, attractions, and sample records into SQLite |
| `npm test` | Runs the primary authentication verification test suite |
| `npm run test:auth` | Executes authentication flow integration tests |
| `npm run test:otp` | Runs OTP and password reset flow verification tests |

---

## 🚢 Deployment

The project can be deployed using either of two architectures:

### Option A: Unified Full-Stack Node.js Service (Render / Railway / DigitalOcean)
Deploy the repository as a single Node.js service using the included `render.yaml`:
1. Connect the GitHub repository to [Render](https://render.com).
2. Render detects `render.yaml` and sets the build command to:
   ```bash
   npm install && npm run build:render
   ```
3. Set start command to:
   ```bash
   npm start
   ```
4. Configure required environment variables (`JWT_SECRET`, `FIREBASE_*`, `NEXT_PUBLIC_APP_URL`).

### Option B: Split Architecture (Vercel Frontend + Render Backend)
- **Frontend on Vercel**: Deploy the repository to Vercel. The included `vercel.json` configures security headers, routes static pages, and proxies `/api/*` requests to your hosted backend.
- **Backend on Render**: Run `server.js` as a web service providing the REST API at `https://api.your-domain.com`.

For full step-by-step instructions, see [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 📄 License & Attribution

- **Project**: Built exclusively for **Karnataka Tourism Exploration**.
- **Images**: Local visual assets and photography stored under `images/destinations/` and `images/hero/`.
- **Maps**: Map data &copy; [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, rendered via [Leaflet](https://leafletjs.com/).
- **Navigation**: Driving directions powered by [Google Maps](https://maps.google.com).
- **Weather**: Meteorological data courtesy of [Open-Meteo](https://open-meteo.com/).
