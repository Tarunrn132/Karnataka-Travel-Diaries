// Load environment variables natively if available (Node.js 20+)
try {
  process.loadEnvFile();
} catch (e) {
  // Ignored if .env file is absent or env vars are directly injected by host
}

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { karnatakaDestinations } = require('./js/data.js');
const { getDestinationWeather } = require('./backend/services/weatherService');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Production CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) 
  : (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000', 'http://127.0.0.1:3000']);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to get or create default public traveler record
async function getPublicTraveler() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Karnataka Traveler',
        email: 'traveler@karnatakadiaries.com',
        role: 'USER'
      }
    });
  }
  return user;
}

// Production Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'karnataka-travel-diaries',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Technical SEO Endpoints
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

// Legacy auth routes redirect to home
app.get(['/login', '/login.html', '/register', '/register.html', '/reset-password', '/reset-password.html', '/profile', '/profile.html'], (req, res) => {
  res.redirect(301, '/');
});

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Destinations List
app.get('/api/destinations', async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        attractions: true
      },
      orderBy: { name: 'asc' }
    });
    return res.json(destinations);
  } catch (err) {
    console.error('Error fetching destinations:', err);
    return res.status(500).json({ error: 'Could not fetch destinations' });
  }
});

// 2. Destination Detail
app.get('/api/destinations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let dest = await prisma.destination.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      },
      include: {
        attractions: true,
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!dest) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    return res.json(dest);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching destination' });
  }
});

// 3. Favorites
app.get('/api/favorites', async (req, res) => {
  try {
    const favs = await prisma.favorite.findMany({
      select: { destinationId: true }
    });
    return res.json(favs.map(f => f.destinationId));
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching favorites' });
  }
});

app.post('/api/favorites', async (req, res) => {
  const { destinationId } = req.body;
  if (!destinationId) return res.status(400).json({ error: 'destinationId required' });

  try {
    const dest = await prisma.destination.findFirst({
      where: { OR: [{ id: destinationId }, { slug: destinationId }] }
    });
    const targetDestId = dest ? dest.id : destinationId;

    const traveler = await getPublicTraveler();
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_destinationId: {
          userId: traveler.id,
          destinationId: targetDestId
        }
      }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      });
      return res.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId: traveler.id,
          destinationId: targetDestId
        }
      });
      return res.json({ favorited: true });
    }
  } catch (err) {
    console.error('Favorite error:', err);
    return res.status(500).json({ error: 'Error updating favorite' });
  }
});

// ==========================================
// 4. MULTI-DAY TRIP PLANNER SECTION
// ==========================================
app.get('/api/trips', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        destinations: {
          include: { destination: true },
          orderBy: { visitOrder: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ trips, success: true });
  } catch (err) {
    console.error('Error fetching trips:', err);
    return res.status(500).json({ error: 'Error fetching trips' });
  }
});

app.post('/api/trips', async (req, res) => {
  const { name, description, startDate, endDate, destinationIds } = req.body;

  try {
    const traveler = await getPublicTraveler();

    // Resolve destination IDs (supporting both slug and CUID)
    const tripStops = [];
    if (Array.isArray(destinationIds)) {
      for (let i = 0; i < destinationIds.length; i++) {
        const dId = destinationIds[i];
        const dest = await prisma.destination.findFirst({
          where: { OR: [{ id: dId }, { slug: dId }] }
        });
        if (dest) {
          tripStops.push({
            destinationId: dest.id,
            visitOrder: i + 1
          });
        }
      }
    }

    const trip = await prisma.trip.create({
      data: {
        userId: traveler.id,
        name: name || 'My Karnataka Journey',
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        destinations: {
          create: tripStops
        }
      },
      include: {
        destinations: {
          include: { destination: true }
        }
      }
    });
    return res.json({ trip, success: true });
  } catch (err) {
    console.error('Trip create error:', err);
    return res.status(500).json({ error: 'Error creating trip' });
  }
});

app.delete('/api/trips/:id', async (req, res) => {
  try {
    const existing = await prisma.trip.findUnique({
      where: { id: req.params.id }
    });
    if (existing) {
      await prisma.trip.delete({
        where: { id: req.params.id }
      });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error('Trip delete error:', err);
    return res.status(500).json({ error: 'Error deleting trip' });
  }
});

// ==========================================
// 5. TRAVEL DIARY
// ==========================================
app.get('/api/diary', async (req, res) => {
  try {
    const entries = await prisma.travelDiary.findMany({
      include: { destination: true },
      orderBy: { visitDate: 'desc' }
    });
    return res.json({ diaries: entries });
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching diary' });
  }
});

app.post('/api/diary', async (req, res) => {
  const { destinationId, title, content, rating, visitDate, images } = req.body;

  try {
    const traveler = await getPublicTraveler();
    const dest = await prisma.destination.findFirst({
      where: { OR: [{ id: destinationId }, { slug: destinationId }] }
    });
    const targetDestId = dest ? dest.id : destinationId;

    const entry = await prisma.travelDiary.create({
      data: {
        userId: traveler.id,
        destinationId: targetDestId,
        title,
        content,
        rating: rating ? parseInt(rating, 10) : 5,
        visitDate: visitDate ? new Date(visitDate) : new Date(),
        images: JSON.stringify(images || [])
      },
      include: { destination: true }
    });
    return res.json(entry);
  } catch (err) {
    console.error('Diary create error:', err);
    return res.status(500).json({ error: 'Error creating diary entry' });
  }
});

// ==========================================
// 6. REVIEWS
// ==========================================
app.get('/api/reviews/:destinationId', async (req, res) => {
  try {
    const dest = await prisma.destination.findFirst({
      where: { OR: [{ id: req.params.destinationId }, { slug: req.params.destinationId }] }
    });
    const targetDestId = dest ? dest.id : req.params.destinationId;

    const reviews = await prisma.review.findMany({
      where: { destinationId: targetDestId },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching reviews' });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { destinationId, rating, comment, name } = req.body;

  try {
    const traveler = await getPublicTraveler();
    const dest = await prisma.destination.findFirst({
      where: { OR: [{ id: destinationId }, { slug: destinationId }] }
    });
    const targetDestId = dest ? dest.id : destinationId;

    const review = await prisma.review.create({
      data: {
        userId: traveler.id,
        destinationId: targetDestId,
        rating: parseInt(rating, 10) || 5,
        comment: comment || ''
      },
      include: { user: { select: { name: true, avatar: true } } }
    });
    return res.json(review);
  } catch (err) {
    console.error('Review create error:', err);
    return res.status(500).json({ error: 'Error saving review' });
  }
});

// ==========================================
// 7. LIVE WEATHER ROUTE
// ==========================================
const weatherHandler = async (req, res) => {
  let { lat, lon, name, destination } = req.query;
  const targetName = destination || name || "Karnataka";

  if ((!lat || !lon) && targetName) {
    const lower = targetName.toLowerCase();
    const destRecord = (karnatakaDestinations || []).find(d =>
      (d.slug && d.slug.toLowerCase() === lower) ||
      (d.name && d.name.toLowerCase().includes(lower))
    );
    if (destRecord) {
      lat = destRecord.latitude;
      lon = destRecord.longitude;
    }
  }
  if (!lat || !lon) {
    lat = 12.9716;
    lon = 77.5946;
  }

  try {
    const weatherData = await getDestinationWeather(parseFloat(lat), parseFloat(lon), targetName);
    return res.json({
      success: true,
      destination: weatherData.destination,
      weather: {
        temperature: parseInt(weatherData.factualWeather.temperature, 10) || 25,
        description: weatherData.factualWeather.condition,
        humidity: parseInt(weatherData.factualWeather.humidity, 10) || 60,
        windSpeed: parseInt(weatherData.factualWeather.windSpeed, 10) || 10,
        rainProbability: weatherData.factualWeather.rainProbability,
        forecast: weatherData.factualWeather.forecast
      },
      aiTravelAdvice: weatherData.aiTravelNote,
      factualWeather: weatherData.factualWeather,
      travelAdvice: weatherData.aiTravelNote,
      source: weatherData.source
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

app.get('/api/weather', weatherHandler);
app.get('/api/ai/weather', weatherHandler);

// ==========================================
// 8. RECOMMENDATIONS ROUTE
// ==========================================
app.use('/api/recommendations', require('./backend/routes/recommendations')(prisma));

// ==========================================
// 9. AI TRIP PLANNER ROUTE
// ==========================================
app.use('/api/ai', require('./backend/routes/ai')(prisma));

// Explicit route for AI Trip Planner page
app.get(['/ai-planner.html', '/ai-planner', '/plan'], (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-planner.html'));
});

// ==========================================
// STATIC FRONTEND SERVING & SEO SSR
// ==========================================

// Server-Side Rendered SEO Meta-Tags & Schema.org JSON-LD for Destination Guides
app.get(['/destination.html', '/destination'], (req, res) => {
  const destId = req.query.id || 'coorg';
  const dest = (karnatakaDestinations || []).find(d =>
    d.slug === destId || d.id === destId || d.name.toLowerCase().includes(destId.toLowerCase())
  ) || (karnatakaDestinations && karnatakaDestinations[0]) || { name: 'Karnataka' };

  const htmlPath = path.join(__dirname, 'destination.html');
  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) return res.sendFile(htmlPath);

    const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.FRONTEND_URL || 'https://YOUR-PRODUCTION-DOMAIN.com').replace(/\/$/, '');
    const canonicalUrl = `${siteUrl}/destination.html?id=${dest.slug || 'coorg'}`;
    const pageTitle = `${dest.name} Travel Guide – Places to Visit, Attractions & Tips | Karnataka Travel Diaries`;
    const metaDesc = `${dest.shortDescription || dest.name} Explore attractions, best time to visit (${dest.bestTimeToVisit || 'All Year'}), distance from Bengaluru (${dest.distanceFromBangalore || 0} km), and interactive map.`;
    const ogImage = dest.image && dest.image.startsWith('http') ? dest.image : `${siteUrl}/${dest.image || 'images/hero/karnataka-fallback.jpg'}`;

    const schemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "TouristDestination",
          "name": dest.name,
          "description": dest.description || dest.shortDescription || '',
          "url": canonicalUrl,
          "image": ogImage,
          "touristType": dest.category || 'Travel',
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": dest.latitude || 12.9716,
            "longitude": dest.longitude || 77.5946
          },
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": `${dest.district || 'Karnataka'} District, Karnataka, India`
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": dest.averageRating || 4.8,
            "reviewCount": dest.reviewCount || 100
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${siteUrl}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Destinations",
              "item": `${siteUrl}/explore.html`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": dest.name,
              "item": canonicalUrl
            }
          ]
        }
      ]
    });

    let rendered = html
      .replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`)
      .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${metaDesc.replace(/"/g, '&quot;')}">`);

    const seoTags = `
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Karnataka Travel Diaries">
  <meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}">
  <meta property="og:description" content="${metaDesc.replace(/"/g, '&quot;')}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}">
  <meta name="twitter:description" content="${metaDesc.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="${ogImage}">
  <script type="application/ld+json">${schemaJson}</script>`;

    rendered = rendered.replace('</head>', `${seoTags}\n</head>`);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(rendered);
  });
});

// Serve all static assets from project root
app.use(express.static(__dirname));

// Route root / to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌟 Karnataka Travel Diaries Server Running on http://localhost:${PORT}`);
  console.log(`📁 Frontend: Pure HTML, CSS & Vanilla JavaScript`);
  console.log(`🔗 API & Database: Express REST API & SQLite Prisma`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
