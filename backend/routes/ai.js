/**
 * Karnataka Travel Diaries - AI REST API Routes
 * Endpoints for Chat, Trip Planning, Natural-Language Search, Travel Diary, Packing Assistant, and Budget Optimization.
 */

const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { getKB } = require('../services/ragService');
const { getDestinationWeather } = require('../services/weatherService');
const { makeTripCheaper } = require('../services/budgetService');

// Helper to sanitize error outputs in production
function safeError(res, status, userMessage, err) {
  const payload = { error: userMessage };
  if (process.env.NODE_ENV !== 'production' && err?.message) {
    payload.details = err.message;
  }
  return res.status(status).json(payload);
}

// Middleware to authenticate user if token present (optional auth helper)
module.exports = function(prisma, authenticate) {
  // 1. AI Chat Copilot
  router.post('/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const session = await authenticate(req);
      let userPreferences = null;
      if (session) {
        userPreferences = await prisma.userPreference.findUnique({
          where: { userId: session.id }
        });
      }

      const result = await aiService.chat({ message, history, userPreferences });

      // If user is logged in, optionally save conversation message
      if (session && result.success) {
        try {
          let conv = await prisma.aIConversation.findFirst({
            where: { userId: session.id },
            orderBy: { updatedAt: 'desc' }
          });
          if (!conv) {
            conv = await prisma.aIConversation.create({
              data: { userId: session.id, title: message.slice(0, 40) }
            });
          }
          await prisma.aIMessage.create({
            data: { conversationId: conv.id, sender: 'user', content: message }
          });
          await prisma.aIMessage.create({
            data: {
              conversationId: conv.id,
              sender: 'assistant',
              content: result.reply,
              structuredJson: JSON.stringify(result.structuredTrip || {})
            }
          });
        } catch (dbErr) {
          console.warn("Could not save chat message to DB:", dbErr.message);
        }
      }

      return res.json(result);
    } catch (err) {
      console.error("AI Chat Error:", err.message);
      return safeError(res, 500, "AI service is temporarily unavailable. You can continue exploring Karnataka normally.", err);
    }
  });

  // 2. AI Trip Planner
  router.post('/plan-trip', async (req, res) => {
    try {
      const {
        startingLocation = "Bengaluru",
        returnLocation = null,
        days = 3,
        budget = 7000,
        travelers = 2,
        travelWith = "Friends",
        transport = "Car",
        travelStyle = "Balanced",
        interests = [],
        primaryDestination = null,
        isSpiritualCircuit = false
      } = req.body;

      const result = await aiService.generateTrip({
        startingLocation,
        returnLocation: returnLocation || startingLocation,
        days,
        budget,
        travelers,
        travelWith,
        transport,
        travelStyle,
        interests,
        primaryDestination,
        isSpiritualCircuit: isSpiritualCircuit === true || String(isSpiritualCircuit) === "true"
      });

      // Save generated itinerary if logged in
      const session = await authenticate(req);
      if (session && result.success) {
        try {
          await prisma.generatedItinerary.create({
            data: {
              userId: session.id,
              title: result.summary.title,
              startingPoint: startingLocation,
              durationDays: parseInt(days, 10) || 3,
              totalBudget: result.budget.totalEstimatedCost,
              totalDistance: result.route.totalDistanceKm,
              travelers: `${travelers} (${travelWith})`,
              transport,
              itineraryJson: JSON.stringify(result.days),
              budgetJson: JSON.stringify(result.budget)
            }
          });
        } catch (dbErr) {
          console.warn("Could not persist generated itinerary:", dbErr.message);
        }
      }

      return res.json(result);
    } catch (err) {
      console.error("AI Trip Planner Error:", err.message);
      return safeError(res, 500, "AI service is temporarily unavailable. You can continue exploring Karnataka normally.", err);
    }
  });

  // 3. AI Natural-Language Search
  router.post('/search', async (req, res) => {
    try {
      const { query } = req.body;
      const result = await aiService.parseTravelSearch({ query });
      return res.json(result);
    } catch (err) {
      console.error("AI Search Error:", err.message);
      return safeError(res, 500, "AI search temporarily unavailable.", err);
    }
  });

  // 4. AI Travel Diary Generator
  router.post('/diary', async (req, res) => {
    try {
      const {
        destination,
        visitDate,
        notes,
        highlights,
        mood,
        photo,
        style,
        previousDraft,
        action
      } = req.body;

      const result = await aiService.generateDiary({
        destination,
        visitDate,
        notes,
        highlights,
        mood,
        photo,
        style,
        previousDraft,
        action
      });

      // If user is logged in, optionally save draft
      const session = await authenticate(req);
      if (session && result.success && (action === 'save_draft' || req.body.saveDraft)) {
        try {
          await prisma.diaryDraft.create({
            data: {
              userId: session.id,
              destinationId: destination,
              promptNotes: notes || "",
              generatedText: result.content,
              style: style || "Storytelling"
            }
          });
        } catch (dbErr) {
          console.warn("Could not save diary draft:", dbErr.message);
        }
      }

      return res.json(result);
    } catch (err) {
      console.error("AI Diary Error:", err.message);
      return safeError(res, 500, "AI diary service is temporarily unavailable.", err);
    }
  });

  // 5. AI Packing Assistant
  router.post('/packing', async (req, res) => {
    try {
      const { destination, durationDays, season, activities } = req.body;
      const result = await aiService.generatePackingList({
        destination,
        durationDays,
        season,
        activities
      });
      return res.json(result);
    } catch (err) {
      console.error("AI Packing Error:", err.message);
      return safeError(res, 500, "AI packing service is temporarily unavailable.", err);
    }
  });

  // 6. Make Trip Cheaper (Budget Optimizer)
  router.post('/budget-optimize', (req, res) => {
    try {
      const { currentBudget, routeInfo } = req.body;
      if (!currentBudget) return res.status(400).json({ error: "currentBudget is required" });
      const optimized = makeTripCheaper(currentBudget, routeInfo);
      return res.json(optimized);
    } catch (err) {
      console.error("Budget optimization error:", err.message);
      return safeError(res, 500, "Budget optimization failed", err);
    }
  });

  // 7. Live Weather Integration
  router.get('/weather', async (req, res) => {
    let { lat, lon, name, destination } = req.query;
    const targetName = destination || name || "Karnataka";
    
    if ((!lat || !lon) && targetName) {
      const kb = getKB();
      const lower = targetName.toLowerCase();
      const kbRecord = (kb.destinations || []).find(d => 
        (d.slug && d.slug.toLowerCase() === lower) ||
        (d.name && d.name.toLowerCase().includes(lower))
      );
      if (kbRecord) {
        lat = kbRecord.latitude;
        lon = kbRecord.longitude;
      }
    }
    if (!lat || !lon) {
      lat = 12.9716;
      lon = 77.5946;
    }

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
      factualWeather: weatherData.factualWeather,
      aiTravelAdvice: weatherData.aiTravelNote,
      aiTravelNote: weatherData.aiTravelNote,
      source: weatherData.source
    });
  });

  // 8. Save Generated AI Itinerary to User's Official Trips
  router.post('/save-to-trips', async (req, res) => {
    const session = await authenticate(req);
    if (!session) return res.status(401).json({ error: "Authentication required to save trip" });

    const { name, description, startDate, endDate, destinationSlugs, notes } = req.body;
    try {
      // Find destinations by slug
      const foundDests = await prisma.destination.findMany({
        where: { slug: { in: destinationSlugs || [] } }
      });

      const trip = await prisma.trip.create({
        data: {
          userId: session.id,
          name: name || "AI Planned Karnataka Journey",
          description: description || "Personalized itinerary generated by Karnataka AI Travel Copilot",
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : null,
          destinations: {
            create: foundDests.map((d, idx) => ({
              destinationId: d.id,
              visitOrder: idx + 1,
              notes: notes?.[idx] || `Stop ${idx + 1}`
            }))
          }
        },
        include: {
          destinations: { include: { destination: true } }
        }
      });

      return res.json({ success: true, trip });
    } catch (err) {
      console.error("Save AI Trip Error:", err);
      return res.status(500).json({ error: "Could not save AI itinerary to trips" });
    }
  });

  // 9. Destination Clusters (Configurable in DB & KB)
  router.get('/clusters', async (req, res) => {
    try {
      const dbClusters = await prisma.destinationCluster.findMany({
        orderBy: { name: 'asc' }
      });
      if (dbClusters && dbClusters.length > 0) {
        return res.json({
          success: true,
          clusters: dbClusters.map(c => ({
            ...c,
            destinations: JSON.parse(c.destinations || '[]'),
            corridor: c.corridor ? JSON.parse(c.corridor) : []
          }))
        });
      }
      const { getClusters } = require('../services/ragService');
      return res.json({ success: true, clusters: getClusters() });
    } catch (err) {
      console.warn("Could not fetch clusters from DB, falling back to KB:", err.message);
      const { getClusters } = require('../services/ragService');
      return res.json({ success: true, clusters: getClusters() });
    }
  });

  // 10. Karnataka District & Taluk Geographic Hierarchy
  router.get('/geo-hierarchy', async (req, res) => {
    try {
      const { loadGeoData } = require('../services/geoService');
      const data = loadGeoData();
      return res.json({
        success: true,
        regions: data?.regions || [],
        districtsCount: data?.districts?.length || 0,
        taluksCount: data?.taluks?.length || 0,
        districts: data?.districts || [],
        taluks: data?.taluks || []
      });
    } catch (err) {
      return safeError(res, 500, "Error loading Karnataka geographic hierarchy", err);
    }
  });

  // 11. Location Hierarchy Resolver
  router.get('/resolve-location', async (req, res) => {
    try {
      const query = req.query.q || req.query.location || "Mangalore";
      const { resolveLocationHierarchy } = require('../services/geoService');
      const hierarchy = resolveLocationHierarchy(query);
      return res.json({ success: true, query, hierarchy });
    } catch (err) {
      return safeError(res, 500, "Error resolving location hierarchy", err);
    }
  });

  return router;
};
