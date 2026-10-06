/**
 * Karnataka Travel Diaries - AI REST API Routes
 * Dedicated endpoints for AI Trip Planning, Plan Modification, Chat, and Locations.
 */

const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { HUBS } = require('../services/routeOptimizer');
const { loadGeoData } = require('../services/geoService');

module.exports = function(prisma) {
  // 1. Generate AI Trip Itinerary (Standard & Aliases)
  const handlePlanTrip = async (req, res) => {
    try {
      const plan = await aiService.generateTripPlan(req.body);
      return res.json(plan);
    } catch (err) {
      console.error("AI Plan Trip error:", err.message);
      return res.status(500).json({
        success: false,
        error: "AI Trip Planner is temporarily unavailable. Please try again.",
        details: process.env.NODE_ENV !== 'production' ? err.message : undefined
      });
    }
  };

  router.post('/trip-plan', handlePlanTrip);
  router.post('/plan-trip', handlePlanTrip);
  router.post('/generate-trip', handlePlanTrip);

  // 2. Modify / Optimize Trip (Standard & Aliases)
  const handleModifyTrip = async (req, res) => {
    try {
      const { currentPlan, action, payload } = req.body;
      if (!currentPlan) {
        return res.status(400).json({ error: "Missing currentPlan parameter" });
      }
      const modified = await aiService.optimizeTripPlan(currentPlan, action, payload || {});
      return res.json(modified);
    } catch (err) {
      console.error("AI Modify Trip error:", err.message);
      return res.status(500).json({
        success: false,
        error: "Failed to modify itinerary. Please try again."
      });
    }
  };

  router.post('/optimize-trip', handleModifyTrip);
  router.post('/modify-trip', handleModifyTrip);

  // 3. Provider Configuration & Diagnostics (Zero Leakage of Secrets)
  router.get('/config', (req, res) => {
    const info = aiService.getActiveAIProvider();
    return res.json({
      success: true,
      provider: info.provider,
      primaryProvider: "GEMINI",
      fallbackProvider: "OPENAI",
      hasGemini: !!process.env.GEMINI_API_KEY,
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      isConfigured: info.provider !== "LOCAL_GROUNDED_ENGINE"
    });
  });

  // 4. Test Providers Verification Endpoint
  router.get('/test-providers', async (req, res) => {
    try {
      const report = await aiService.testAIProviders();
      return res.json({ success: true, ...report });
    } catch (err) {
      return res.status(500).json({ success: false, error: "Test execution failed" });
    }
  });

  // 5. Karnataka Autocomplete Locations (Cities, Towns & Major Hubs)
  router.get('/locations', (req, res) => {
    try {
      const popularHubs = [
        "Bengaluru",
        "Mysuru",
        "Mangaluru",
        "Udupi",
        "Hubballi",
        "Belagavi",
        "Shivamogga",
        "Hassan",
        "Ballari",
        "Dharmasthala",
        "Gokarna",
        "Madikeri (Coorg)",
        "Chikkamagaluru",
        "Dandeli",
        "Hampi",
        "Badami",
        "Karwar",
        "Vijayapura",
        "Bidar",
        "Davangere"
      ];
      return res.json({ success: true, locations: popularHubs });
    } catch (err) {
      return res.status(500).json({ error: "Could not fetch locations" });
    }
  });

  // 6. Save AI Generated Trip to Database
  router.post('/save-to-trips', async (req, res) => {
    try {
      const { plan } = req.body;
      if (!plan || !plan.days) {
        return res.status(400).json({ error: "Valid trip plan object required" });
      }

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

      // Save to GeneratedItinerary
      const savedItinerary = await prisma.generatedItinerary.create({
        data: {
          userId: user.id,
          title: plan.tripTitle || `${plan.daysCount}-Day Karnataka Trip`,
          startingPoint: plan.startLocation || "Bengaluru",
          durationDays: plan.daysCount || 2,
          totalBudget: plan.budget?.totalEstimatedCost || 5000,
          totalDistance: plan.totalDistanceKm || 0,
          travelers: plan.travelers || "2",
          transport: plan.travelMode || "Car",
          itineraryJson: JSON.stringify(plan),
          budgetJson: JSON.stringify(plan.budget || {})
        }
      });

      // Also create a Trip record with destination stops
      const tripStops = [];
      for (let i = 0; i < plan.days.length; i++) {
        const d = plan.days[i];
        if (d.destinationSlug) {
          const dest = await prisma.destination.findFirst({
            where: { OR: [{ slug: d.destinationSlug }, { id: d.destinationSlug }] }
          });
          if (dest) {
            tripStops.push({
              destinationId: dest.id,
              visitOrder: i + 1,
              notes: `Day ${i + 1}: ${d.title}`
            });
          }
        }
      }

      const trip = await prisma.trip.create({
        data: {
          userId: user.id,
          name: plan.tripTitle || `AI Plan: ${plan.startLocation} Circuit`,
          description: plan.summary || plan.whyThisItinerary,
          startDate: new Date(),
          endDate: new Date(Date.now() + (plan.daysCount || 2) * 24 * 60 * 60 * 1000),
          destinations: {
            create: tripStops
          }
        }
      });

      return res.json({
        success: true,
        message: "Trip saved successfully!",
        itineraryId: savedItinerary.id,
        tripId: trip.id
      });
    } catch (err) {
      console.error("Save AI Trip error:", err.message);
      return res.status(500).json({ error: "Could not save itinerary to database" });
    }
  });

  return router;
};
