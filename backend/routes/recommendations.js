/**
 * Karnataka Travel Diaries - Recommendations REST API
 * Delivers explainable destination recommendations based on explicit travel behaviors and preference wizard.
 */

const express = require('express');
const router = express.Router();
const { getPersonalizedRecommendations } = require('../services/recommendationService');
const { retrieveRelevantDestinations } = require('../services/ragService');

module.exports = function(prisma) {
  // 1. Recommendations for Public Visitors
  router.get('/', async (req, res) => {
    try {
      let favorites = [];
      let trips = [];
      let diaryEntries = [];
      let userPreferences = null;

      // Guest mode preferences from query params or database
      if (req.query.favorites) {
        favorites = req.query.favorites.split(',');
      }
      if (req.query.interests) {
        userPreferences = { interests: req.query.interests.split(',') };
      }

      const recommendations = getPersonalizedRecommendations({
        user: null,
        userPreferences,
        favorites,
        trips,
        diaryEntries,
        origin: req.query.origin || "Bengaluru",
        limit: parseInt(req.query.limit, 10) || 6
      });

      return res.json({
        success: true,
        isPersonalized: Boolean(favorites.length > 0 || (userPreferences?.interests?.length > 0)),
        userInterests: userPreferences?.interests
          ? (typeof userPreferences.interests === 'string' ? JSON.parse(userPreferences.interests) : userPreferences.interests)
          : [],
        recommendations
      });
    } catch (err) {
      console.error("Recommendations error:", err.message);
      const payload = { error: "Could not fetch recommendations" };
      if (process.env.NODE_ENV !== 'production' && err?.message) payload.details = err.message;
      return res.status(500).json(payload);
    }
  });

  // 2. Visual Recommendation Wizard ("Find My Place")
  router.post('/wizard', (req, res) => {
    try {
      const { experience, duration, travelWith, budget } = req.body;
      const categories = experience ? [experience] : [];
      let durationDays = 2;
      if (duration === "1 Day") durationDays = 1;
      else if (duration === "2–3 Days" || duration === "2-3 Days") durationDays = 3;
      else if (duration === "4–5 Days" || duration === "4-5 Days") durationDays = 5;
      else if (duration === "1 Week") durationDays = 7;

      const parsed = retrieveRelevantDestinations({
        categories,
        durationDays,
        travelWith: travelWith || "Friends",
        maxBudget: budget ? parseInt(budget, 10) : null,
        origin: "Bengaluru"
      }, 5);

      const results = parsed.map(p => ({
        destination: p.destination,
        distanceFromOrigin: p.distanceFromOrigin,
        score: p.score,
        reason: `Matches ${experience || 'Karnataka'} experience for a ${durationDays}-day ${travelWith || 'trip'}`
      }));

      return res.json({
        success: true,
        results
      });
    } catch (err) {
      console.error("Wizard calculation error:", err.message);
      const payload = { error: "Wizard calculation failed" };
      if (process.env.NODE_ENV !== 'production' && err?.message) payload.details = err.message;
      return res.status(500).json(payload);
    }
  });

  return router;
};
