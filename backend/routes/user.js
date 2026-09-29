/**
 * Karnataka Travel Diaries - User Preferences & Journey Dashboard API
 */

const express = require('express');
const router = express.Router();

module.exports = function(prisma, authenticate) {
  // 1. Get User Preferences
  router.get('/preferences', async (req, res) => {
    const session = await authenticate(req);
    if (!session) return res.json({ preferences: null });

    try {
      const pref = await prisma.userPreference.findUnique({
        where: { userId: session.id }
      });

      let interests = ["Nature", "Mountains", "Photography"];
      if (pref && pref.interests) {
        try {
          interests = JSON.parse(pref.interests);
        } catch (e) {
          interests = [];
        }
      }

      return res.json({
        preferences: pref ? {
          ...pref,
          interests
        } : { interests, travelStyle: "Balanced", preferredTransport: "Car" }
      });
    } catch (err) {
      return res.status(500).json({ error: "Could not fetch preferences" });
    }
  });

  // 2. Save / Update User Preferences
  router.post('/preferences', async (req, res) => {
    const session = await authenticate(req);
    if (!session) return res.status(401).json({ error: "Authentication required" });

    const { interests, travelStyle, preferredTransport, budgetRange } = req.body;
    const jsonInterests = JSON.stringify(Array.isArray(interests) ? interests : []);

    try {
      const updated = await prisma.userPreference.upsert({
        where: { userId: session.id },
        update: {
          interests: jsonInterests,
          travelStyle: travelStyle || "Balanced",
          preferredTransport: preferredTransport || "Car",
          budgetRange: budgetRange || "Moderate"
        },
        create: {
          userId: session.id,
          interests: jsonInterests,
          travelStyle: travelStyle || "Balanced",
          preferredTransport: preferredTransport || "Car",
          budgetRange: budgetRange || "Moderate"
        }
      });

      return res.json({ success: true, preferences: updated });
    } catch (err) {
      console.error("Save preferences error:", err);
      return res.status(500).json({ error: "Could not save preferences" });
    }
  });

  // 3. User Journey Overview Dashboard Stats
  router.get('/journey-stats', async (req, res) => {
    const session = await authenticate(req);
    if (!session) return res.json({ stats: null });

    try {
      const [favsCount, tripsCount, diariesCount, userDests] = await Promise.all([
        prisma.favorite.count({ where: { userId: session.id } }),
        prisma.trip.count({ where: { userId: session.id } }),
        prisma.travelDiary.count({ where: { userId: session.id } }),
        prisma.travelDiary.findMany({
          where: { userId: session.id },
          select: { destinationId: true }
        })
      ]);

      const visitedSet = new Set(userDests.map(d => d.destinationId));
      const totalDestinationsCount = await prisma.destination.count();

      return res.json({
        stats: {
          savedPlaces: favsCount,
          tripsCreated: tripsCount,
          diaryEntries: diariesCount,
          placesVisited: visitedSet.size,
          totalDestinations: totalDestinationsCount,
          progressPercentage: totalDestinationsCount > 0 ? Math.round((visitedSet.size / totalDestinationsCount) * 100) : 0
        }
      });
    } catch (err) {
      return res.status(500).json({ error: "Error fetching journey stats" });
    }
  });

  return router;
};
