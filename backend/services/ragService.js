/**
 * Karnataka Travel Diaries - RAG (Retrieval-Augmented Generation) Service
 * Manages knowledge base indexing, destination clustering, semantic retrieval,
 * natural-language query parsing, and corridor-based destination planning.
 */

const fs = require('fs');
const path = require('path');
const { haversineDistance, resolveStartingPoint } = require('./routeOptimizer');

// Load knowledge base
let kbData = null;
function getKB() {
  if (!kbData) {
    const kbPath = path.join(__dirname, '../../data/knowledge-base.json');
    if (fs.existsSync(kbPath)) {
      kbData = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
    } else {
      kbData = { destinations: [], clusters: [], tripTemplates: [] };
    }
  }
  return kbData;
}

/**
 * Returns all configured destination clusters
 */
function getClusters() {
  const kb = getKB();
  return kb.clusters || [];
}

/**
 * Find cluster by slug
 */
function getClusterBySlug(slug) {
  const clusters = getClusters();
  return clusters.find(c => c.slug === slug || c.slug.toLowerCase().includes(String(slug).toLowerCase())) || null;
}

/**
 * Find destination by slug or partial name match
 */
function getDestinationBySlug(slugOrName) {
  if (!slugOrName) return null;
  const kb = getKB();
  const clean = String(slugOrName).trim().toLowerCase();
  
  // Exact slug match
  let found = kb.destinations.find(d => d.slug.toLowerCase() === clean);
  if (found) return found;

  // Name match
  found = kb.destinations.find(d => d.name.toLowerCase() === clean);
  if (found) return found;

  // Partial match
  return kb.destinations.find(d => 
    d.name.toLowerCase().includes(clean) || 
    d.slug.toLowerCase().includes(clean) ||
    clean.includes(d.slug.toLowerCase())
  ) || null;
}

/**
 * Find which cluster(s) a destination belongs to
 */
function findClustersForDestination(destSlug) {
  const dest = getDestinationBySlug(destSlug);
  if (!dest) return [];
  const clusters = getClusters();
  return clusters.filter(c => 
    (c.destinations && c.destinations.includes(dest.slug)) ||
    (dest.clusters && dest.clusters.includes(c.slug))
  );
}

/**
 * Gets nearest neighbouring destinations within the same cluster
 */
function getNeighbouringDestinations(primarySlug, maxCount = 2) {
  const primary = getDestinationBySlug(primarySlug);
  if (!primary) return [];

  const kb = getKB();
  const clusters = findClustersForDestination(primary.slug);
  const clusterDestSlugs = new Set();
  
  clusters.forEach(c => {
    (c.destinations || []).forEach(slug => {
      if (slug !== primary.slug) clusterDestSlugs.add(slug);
    });
  });

  // Calculate distance from primary
  const neighbours = [];
  clusterDestSlugs.forEach(slug => {
    const dest = getDestinationBySlug(slug);
    if (dest) {
      const dist = haversineDistance(primary.latitude, primary.longitude, dest.latitude, dest.longitude);
      neighbours.push({ dest, dist });
    }
  });

  // If cluster didn't have enough, check any destination within 120km
  if (neighbours.length === 0) {
    kb.destinations.forEach(d => {
      if (d.slug !== primary.slug) {
        const dist = haversineDistance(primary.latitude, primary.longitude, d.latitude, d.longitude);
        if (dist <= 130) {
          neighbours.push({ dest: d, dist });
        }
      }
    });
  }

  // Sort by driving distance (closest first)
  neighbours.sort((a, b) => a.dist - b.dist);
  return neighbours.slice(0, maxCount).map(n => n.dest);
}

/**
 * Gets destinations in geographic corridor order for multi-day regional circuits
 */
function getCorridorDestinations(clusterSlug, primarySlug = null, startingLocation = "Bengaluru", maxDays = 6) {
  const cluster = getClusterBySlug(clusterSlug) || getClusters()[0];
  if (!cluster) return [];

  const rawCorridor = (cluster.corridor || cluster.destinations || []).map(slug => getDestinationBySlug(slug)).filter(Boolean);
  if (rawCorridor.length === 0) return [];

  const originHub = resolveStartingPoint(startingLocation);

  // If origin is near northern or southern end, orient corridor travel direction
  const firstDist = haversineDistance(originHub.lat, originHub.lon, rawCorridor[0].latitude, rawCorridor[0].longitude);
  const lastDist = haversineDistance(originHub.lat, originHub.lon, rawCorridor[rawCorridor.length - 1].latitude, rawCorridor[rawCorridor.length - 1].longitude);

  let oriented = [...rawCorridor];
  if (lastDist < firstDist) {
    oriented.reverse();
  }

  // If primary destination is specified, ensure it is anchored
  if (primarySlug) {
    const primary = getDestinationBySlug(primarySlug);
    if (primary) {
      const primaryIdx = oriented.findIndex(d => d.slug === primary.slug);
      if (primaryIdx > 0) {
        // Rearrange or start from segment near primary
        const before = oriented.slice(0, primaryIdx);
        const after = oriented.slice(primaryIdx);
        oriented = [...after, ...before];
      }
    }
  }

  // Select appropriate number of stops based on days
  // 5 days = 3-4 destinations; 6+ days = 4-6 destinations
  const targetCount = maxDays <= 2 ? 1 : maxDays <= 4 ? 2 : Math.min(oriented.length, maxDays - 1);
  return oriented.slice(0, targetCount);
}

/**
 * Dedicated Spiritual Circuit Generator
 * Dynamically orders Karnataka's premier temples and sacred destinations
 */
function getSpiritualCircuitSequence(durationDays = 6, startingLocation = "Bengaluru", primaryDestination = null) {
  const days = Math.max(1, parseInt(durationDays, 10) || 6);

  // Core Temples & Sacred Destinations along the Corridor
  const dharmasthala = getDestinationBySlug("dharmasthala");
  const kukke = getDestinationBySlug("kukke-subrahmanya");
  const mangalore = getDestinationBySlug("mangalore");
  const udupi = getDestinationBySlug("udupi");
  const murudeshwar = getDestinationBySlug("murudeshwar");
  const honnavar = getDestinationBySlug("honnavar");
  const gokarna = getDestinationBySlug("gokarna");

  // 1-2 Days Spiritual: Single destination + immediate shrines
  if (days <= 2) {
    if (primaryDestination) {
      const selected = getDestinationBySlug(primaryDestination);
      if (selected) return [selected];
    }
    return [dharmasthala, kukke].filter(Boolean).slice(0, days);
  }

  // 3 Days Spiritual: Dharmasthala -> Kukke Subrahmanya -> Mangalore
  if (days === 3) {
    return [dharmasthala, kukke, mangalore].filter(Boolean);
  }

  // 4 Days Spiritual: Dharmasthala -> Kukke Subrahmanya -> Mangalore -> Udupi -> Murdeshwar
  if (days === 4) {
    return [dharmasthala, kukke, mangalore, udupi, murudeshwar].filter(Boolean);
  }

  // 5+ Days Spiritual: Complete Corridor
  // Dharmasthala -> Kukke Subrahmanya -> Mangalore -> Udupi -> Murdeshwar -> Honnavar -> Gokarna
  return [dharmasthala, kukke, mangalore, udupi, murudeshwar, honnavar, gokarna].filter(Boolean);
}

/**
 * Normal search check: returns true if query is a simple single-word destination or district name
 */
function isSimpleQuery(query = "") {
  const trimmed = query.trim();
  const words = trimmed.split(/\s+/);
  return words.length <= 2 && !/(within|under|near|for|with|best|peaceful|budget|days|trip|suggest|plan|from)/i.test(trimmed);
}

/**
 * Natural Language Query Parser
 * Extracts structured travel filters from conversational English.
 */
function parseNaturalLanguageQuery(query = "") {
  const text = query.toLowerCase();

  // 1. Extract Origin
  let origin = "Bengaluru";
  const originMatch = text.match(/(?:from|starting at|starting from|leaving)\s+([a-zA-Z\s]+?)(?:\s+(?:for|to|within|under|with)|$)/i);
  if (originMatch && originMatch[1]) {
    origin = originMatch[1].trim();
  }

  // 2. Extract Distance constraint (e.g., "within 300 km")
  let maxDistance = null;
  const distMatch = text.match(/(?:within|under|less than|around)\s+(\d+)\s*(?:km|kms|kilometers)/i);
  if (distMatch) {
    maxDistance = parseInt(distMatch[1], 10);
  }

  // 3. Extract Duration (e.g., "for 3 days", "weekend", "2 day trip")
  let durationDays = null;
  if (/weekend/i.test(text)) {
    durationDays = 2;
  } else {
    const daysMatch = text.match(/(\d+)\s*(?:day|days|night|nights)/i);
    if (daysMatch) {
      durationDays = parseInt(daysMatch[1], 10);
    }
  }

  // 4. Extract Budget (e.g., "under 5000", "budget 7000", "under ₹5,000")
  let maxBudget = null;
  const budgetMatch = text.match(/(?:under|below|budget of|within|less than)?\s*(?:₹|rs\.?|inr)?\s*(\d{1,2}(?:,\d{3})+|\d{4,6})/i);
  if (budgetMatch && budgetMatch[1]) {
    const rawNum = budgetMatch[1].replace(/,/g, '');
    const num = parseInt(rawNum, 10);
    if (num >= 500) maxBudget = num;
  }

  // 5. Category detection
  const categories = [];
  if (/hill|mountain|peak|ghats|mist|fog/i.test(text)) categories.push("Hill Stations");
  if (/beach|sea|coast|shore|ocean|coastal/i.test(text)) categories.push("Beaches");
  if (/heritage|history|ruins|palace|ancient|monument|fort|unesco/i.test(text)) categories.push("Heritage");
  if (/wildlife|tiger|elephant|safari|jungle|sanctuary/i.test(text)) categories.push("Wildlife");
  if (/waterfall|falls|cascade/i.test(text)) categories.push("Waterfalls");
  if (/spiritual|pilgrim|darshan|shrine|temple/i.test(text)) {
    categories.push("Religious");
    categories.push("Spiritual");
  }
  if (/adventure|rafting|trek|trekking|kayaking|scuba/i.test(text)) categories.push("Adventure");
  if (/nature|green|coffee|plantation|forest|lake/i.test(text)) categories.push("Nature");

  // 6. Spiritual Circuit flag
  const isSpiritualCircuit = /spiritual circuit|temple circuit|pilgrimage circuit|darshan circuit|dharmasthala/i.test(text);

  // 7. Travel Group detection
  let travelWith = "Friends";
  if (/solo|alone|by myself/i.test(text)) travelWith = "Solo";
  else if (/family|kids|parents/i.test(text)) travelWith = "Family";
  else if (/couple|romantic|honeymoon|partner/i.test(text)) travelWith = "Couple";
  else if (/friend|friends|group|gang|buddies/i.test(text)) travelWith = "Friends";

  // 8. Preferences / Vibe
  const vibes = [];
  if (/peaceful|quiet|serene|calm|relaxed/i.test(text)) vibes.push("Peaceful");
  if (/photography|photo|scenic|views|instagram/i.test(text)) vibes.push("Photography");
  if (/food|cuisine|dosa|coffee|eating|seafood/i.test(text)) vibes.push("Food & Culture");

  // 9. Primary Destination Anchor Detection (Prompt Section 16)
  let primaryDestination = null;
  const knownPlaces = [
    { key: "coorg", slug: "coorg" },
    { key: "madikeri", slug: "coorg" },
    { key: "udupi", slug: "udupi" },
    { key: "mangalore", slug: "mangalore" },
    { key: "mangaluru", slug: "mangalore" },
    { key: "gokarna", slug: "gokarna" },
    { key: "murudeshwar", slug: "murudeshwar" },
    { key: "murdeshwar", slug: "murudeshwar" },
    { key: "dharmasthala", slug: "dharmasthala" },
    { key: "kukke", slug: "kukke-subrahmanya" },
    { key: "subrahmanya", slug: "kukke-subrahmanya" },
    { key: "honnavar", slug: "honnavar" },
    { key: "karwar", slug: "karwar" },
    { key: "chikmagalur", slug: "chikmagalur" },
    { key: "chikkamagaluru", slug: "chikmagalur" },
    { key: "sakleshpur", slug: "sakleshpur" },
    { key: "sringeri", slug: "sringeri" },
    { key: "kudremukh", slug: "kudremukh" },
    { key: "hampi", slug: "hampi" },
    { key: "badami", slug: "badami" },
    { key: "pattadakal", slug: "pattadakal" },
    { key: "mysore", slug: "mysore" },
    { key: "mysuru", slug: "mysore" },
    { key: "srirangapatna", slug: "srirangapatna" },
    { key: "dandeli", slug: "dandeli" },
    { key: "bandipur", slug: "bandipur" },
    { key: "nagarhole", slug: "nagarhole" },
    { key: "nandi hills", slug: "nandi-hills" }
  ];

  for (const p of knownPlaces) {
    const reg = new RegExp(`\\b${p.key}\\b`, 'i');
    if (reg.test(text)) {
      primaryDestination = p.slug;
      break;
    }
  }

  // 10. Regional Corridor Cluster Detection
  let targetCluster = null;
  if (/coastal|karavali|beach circuit/i.test(text)) targetCluster = "coastal-karnataka";
  else if (/malnad|western ghats/i.test(text)) targetCluster = "malnad";
  else if (/mysore|southern/i.test(text)) targetCluster = "mysore-southern";
  else if (/hampi|north karnataka/i.test(text)) targetCluster = "hampi-north";

  return {
    rawQuery: query,
    origin,
    maxDistance,
    durationDays,
    maxBudget,
    categories,
    travelWith,
    vibes,
    primaryDestination,
    isSpiritualCircuit,
    targetCluster
  };
}

/**
 * Retrieves the most relevant destination records using weighted scoring
 */
function retrieveRelevantDestinations(criteria, limit = 5) {
  const kb = getKB();
  const allDestinations = kb.destinations || [];
  if (allDestinations.length === 0) return [];

  const originHub = resolveStartingPoint(criteria.origin || "Bengaluru");

  const scored = allDestinations.map(dest => {
    let score = 0;
    const reasons = [];

    const distFromOrigin = haversineDistance(originHub.lat, originHub.lon, dest.latitude, dest.longitude);

    // Primary destination anchor match
    if (criteria.primaryDestination && dest.slug === criteria.primaryDestination) {
      score += 150;
      reasons.push(`Primary requested destination: ${dest.name}`);
    }

    // Cluster match
    if (criteria.targetCluster && dest.clusters && dest.clusters.includes(criteria.targetCluster)) {
      score += 40;
      reasons.push(`Belongs to ${criteria.targetCluster} regional corridor`);
    }

    // Distance match
    if (criteria.maxDistance) {
      if (distFromOrigin <= criteria.maxDistance) {
        score += 30;
        reasons.push(`${distFromOrigin} km from ${originHub.name} (within ${criteria.maxDistance} km limit)`);
      } else {
        score -= 25;
      }
    } else {
      if (distFromOrigin <= 300) score += 5;
    }

    // Category match
    if (criteria.categories && criteria.categories.length > 0) {
      const matchCount = criteria.categories.filter(c => 
        (dest.categories || []).map(x => x.toLowerCase()).includes(c.toLowerCase())
      ).length;
      if (matchCount > 0) {
        score += matchCount * 25;
        reasons.push(`Matches requested interest: ${criteria.categories.join(", ")}`);
      }
    }

    // Duration compatibility
    if (criteria.durationDays) {
      const recDays = dest.recommendedDays || 2;
      if (criteria.durationDays >= recDays) {
        score += 15;
        reasons.push(`Ideal for ${criteria.durationDays}-day timeframe`);
      }
    }

    // Keyword matching
    const queryLower = (criteria.rawQuery || "").toLowerCase();
    const searchableText = `${dest.name} ${dest.district} ${dest.shortDescription} ${dest.description} ${(dest.activities || []).join(" ")} ${(dest.attractions || []).map(a => a.name).join(" ")} ${(dest.foodSpecialties || []).join(" ")}`.toLowerCase();

    const searchTerms = queryLower.split(/\s+/).filter(w => w.length > 3);
    searchTerms.forEach(term => {
      if (searchableText.includes(term)) {
        score += 10;
      }
    });

    // Rating bonus
    score += (dest.averageRating || 4.7) * 2;

    return {
      destination: dest,
      distanceFromOrigin: distFromOrigin,
      score,
      reasons: reasons.length > 0 ? reasons : [`Top rated destination in ${dest.district}`]
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/**
 * Builds compact, information-dense Markdown context containing only the retrieved records.
 */
function buildRAGContext(retrievedResults = [], userQuery = "") {
  if (!retrievedResults || retrievedResults.length === 0) {
    return "No specific Karnataka destination records found for this query.";
  }

  const sections = retrievedResults.map(({ destination: d, distanceFromOrigin, reasons }) => `
### ${d.name} (${d.district} District)
- **Categories**: ${(d.categories || []).join(", ")}
- **Clusters**: ${(d.clusters || []).join(", ")}
- **Distance from Origin**: ~${distanceFromOrigin} km
- **Recommended Stay**: ${d.recommendedDays} Days | **Best Season**: ${d.bestSeason || 'October to March'}
- **Top Attractions**: ${(d.attractions || []).map(a => `${a.name} (${a.category || 'Attraction'})`).join("; ")}
- **Why Visit**: ${d.whyVisit || d.shortDescription}
- **Famous For**: ${(d.famousFor || []).join(", ")}
- **Local Food Specialties**: ${(d.foodSpecialties || []).join(", ")}
- **Match Rationale**: ${reasons.join(" • ")}
`).join("\n");

  return `
[RETRIEVED KARNATAKA KNOWLEDGE BASE CONTEXT]
User Travel Request: "${userQuery}"

${sections}

[GROUNDING INSTRUCTIONS]
1. Answer using ONLY verified facts from the retrieved destinations above.
2. Label all estimated monetary figures with "Estimated costs — actual prices may vary."
3. Follow the Karnataka Travel Hierarchy: 1-2 days = Single destination + nearby; 3-4 days = Primary destination + 1 neighbour; 5-6 days = Regional circuit.
`;
}

module.exports = {
  getKB,
  getClusters,
  getClusterBySlug,
  getDestinationBySlug,
  findClustersForDestination,
  getNeighbouringDestinations,
  getCorridorDestinations,
  getSpiritualCircuitSequence,
  isSimpleQuery,
  parseNaturalLanguageQuery,
  retrieveRelevantDestinations,
  buildRAGContext
};
