/**
 * Karnataka Travel Diaries - Recommendation Engine
 * Computes personalized, explainable destination recommendations based on explicit travel behaviors:
 * user interests, favorites, trip history, and category affinities.
 */

const { getKB } = require('./ragService');
const { haversineDistance, resolveStartingPoint } = require('./routeOptimizer');

/**
 * Computes personalized recommendations with clear human-readable explanations.
 */
function getPersonalizedRecommendations({
  user = null,
  userPreferences = null, // { interests: ["Mountains", "Nature"], travelStyle, preferredTransport }
  favorites = [],         // array of destination IDs or slugs
  trips = [],             // array of trip objects with destinationIds
  diaryEntries = [],      // array of diary objects
  origin = "Bengaluru",
  limit = 6
}) {
  const kb = getKB();
  const allDestinations = kb.destinations || [];
  if (allDestinations.length === 0) return [];

  const originHub = resolveStartingPoint(origin);

  // Extract explicit user interests
  let userInterests = [];
  if (userPreferences) {
    if (Array.isArray(userPreferences.interests)) {
      userInterests = userPreferences.interests;
    } else if (typeof userPreferences.interests === "string") {
      try {
        userInterests = JSON.parse(userPreferences.interests);
      } catch (e) {
        userInterests = [];
      }
    }
  }

  // Collect destinations user has already interacted with
  const favoritedSlugs = new Set(favorites.map(f => String(f).toLowerCase()));
  const tripSlugs = new Set();
  trips.forEach(t => {
    if (t.destinations) {
      t.destinations.forEach(d => tripSlugs.add(String(d.destination?.slug || d.destinationId || "").toLowerCase()));
    }
  });
  const diarySlugs = new Set(diaryEntries.map(d => String(d.destination?.slug || d.destinationId || "").toLowerCase()));

  // Category frequency scoring from favorites and past trips
  const categoryAffinities = {};
  allDestinations.forEach(dest => {
    const slug = dest.slug.toLowerCase();
    if (favoritedSlugs.has(slug) || tripSlugs.has(slug) || diarySlugs.has(slug)) {
      dest.categories.forEach(cat => {
        categoryAffinities[cat] = (categoryAffinities[cat] || 0) + 1;
      });
    }
  });

  // Score candidate destinations
  const recommendations = allDestinations.map(dest => {
    const slug = dest.slug.toLowerCase();
    let score = 0;
    const explanationParts = [];

    // Skip if already in favorites or visited recently, unless user has very few favorites
    const isFavorited = favoritedSlugs.has(slug);
    const isVisited = diarySlugs.has(slug) || tripSlugs.has(slug);

    if (isFavorited) {
      score += 10;
      explanationParts.push("Already in your saved wishlist");
    }

    // 1. Explicit Interests Match
    if (userInterests.length > 0) {
      const matchedInterests = userInterests.filter(interest => {
        return dest.categories.some(cat => cat.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(cat.toLowerCase()));
      });

      if (matchedInterests.length > 0) {
        score += matchedInterests.length * 35;
        explanationParts.push(`Matches your travel interests: ${matchedInterests.join(", ")}`);
      }
    }

    // 2. Category Affinity Match from behavioral history
    let affinityScore = 0;
    const matchingAffinityCats = [];
    dest.categories.forEach(cat => {
      if (categoryAffinities[cat]) {
        affinityScore += categoryAffinities[cat] * 15;
        matchingAffinityCats.push(cat);
      }
    });

    if (affinityScore > 0) {
      score += affinityScore;
      // Find a reference destination from favorites that sparked this
      const referenceDest = allDestinations.find(d => favoritedSlugs.has(d.slug.toLowerCase()) && d.categories.some(c => matchingAffinityCats.includes(c)));
      if (referenceDest && referenceDest.slug !== dest.slug) {
        explanationParts.push(`Recommended because you saved ${referenceDest.name} and explore ${matchingAffinityCats.slice(0, 2).join(" & ")}`);
      } else {
        explanationParts.push(`Aligns with your exploration of ${matchingAffinityCats.slice(0, 2).join(" & ")}`);
      }
    }

    // 3. Proximity / Accessible distance bonus
    const distFromOrigin = haversineDistance(originHub.lat, originHub.lon, dest.latitude, dest.longitude);
    if (distFromOrigin <= 300) {
      score += 15;
      explanationParts.push(`Convenient road trip within ${distFromOrigin} km from ${originHub.name}`);
    }

    // 4. Community Rating bonus
    score += (dest.averageRating || 4.7) * 5;

    // Default explanation if user is brand new with zero history
    if (explanationParts.length === 0) {
      explanationParts.push(`Highly rated iconic Karnataka ${dest.categories[0]} destination`);
    }

    // Compose primary explainable headline
    const reasonHeadline = explanationParts[0];

    return {
      destination: dest,
      distanceFromOrigin: distFromOrigin,
      score,
      reason: reasonHeadline,
      allReasons: explanationParts,
      isFavorited,
      isVisited
    };
  });

  // Sort candidates by score descending
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit);
}

module.exports = {
  getPersonalizedRecommendations
};
