/**
 * Karnataka Travel Diaries - AI Service Abstraction Layer
 * Destination-Clustered, Distance-Aware Karnataka Travel Planning Engine.
 *
 * Supported environment variables:
 * - GEMINI_API_KEY: Google Gemini 1.5 / 2.0 Flash API Key
 * - OPENAI_API_KEY: OpenAI GPT-4o / GPT-3.5 API Key
 * - AI_API_KEY: Generic AI Provider Key
 */

const {
  getKB,
  getClusters,
  getClusterBySlug,
  getDestinationBySlug,
  findClustersForDestination,
  getNeighbouringDestinations,
  getCorridorDestinations,
  getSpiritualCircuitSequence,
  retrieveRelevantDestinations,
  buildRAGContext,
  parseNaturalLanguageQuery
} = require('./ragService');

const {
  optimizeRoute,
  resolveStartingPoint,
  estimateDrivingLeg,
  haversineDistance
} = require('./routeOptimizer');

const {
  loadGeoData,
  normalizeLocationName,
  resolveLocationHierarchy,
  getTalukRelationships,
  getAttractionHierarchy,
  getRoadRouteWithCache,
  isGeographicallyViable,
  scoreCandidateDestination,
  getDailyDistanceBudget
} = require('./geoService');

const { estimateBudget, makeTripCheaper } = require('./budgetService');
const { getDestinationWeather } = require('./weatherService');

function getActiveAIProvider() {
  if (process.env.GEMINI_API_KEY) return { provider: "GEMINI", apiKey: process.env.GEMINI_API_KEY };
  if (process.env.OPENAI_API_KEY) return { provider: "OPENAI", apiKey: process.env.OPENAI_API_KEY };
  if (process.env.AI_API_KEY) return { provider: "GENERIC", apiKey: process.env.AI_API_KEY };
  return { provider: "LOCAL_RAG_ENGINE", apiKey: null };
}

/**
 * Low-level caller for external LLMs with timeout and error fallback.
 */
async function callExternalLLM(prompt, systemInstruction = "") {
  const { provider, apiKey } = getActiveAIProvider();
  if (!apiKey || provider === "LOCAL_RAG_ENGINE") return null;

  try {
    if (provider === "GEMINI" || (provider === "GENERIC" && apiKey.startsWith("AIza"))) {
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\n${prompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048
        }
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });

      if (!res.ok) {
        console.warn(`Gemini API request failed with HTTP ${res.status}`);
        return null;
      }

      const json = await res.json();
      return json.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }

    if (provider === "OPENAI") {
      const url = "https://api.openai.com/v1/chat/completions";
      const payload = {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 2048
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });

      if (!res.ok) {
        console.warn(`OpenAI API request failed with HTTP ${res.status}`);
        return null;
      }

      const json = await res.json();
      return json.choices?.[0]?.message?.content || null;
    }
  } catch (err) {
    console.warn("External AI call failed, falling back to local engine:", err.message);
    return null;
  }

  return null;
}

// =========================================================================
// 1. AI KARNATAKA TRAVEL ASSISTANT (CHAT)
// =========================================================================
async function chat({ message = "", history = [], userPreferences = null }) {
  const criteria = parseNaturalLanguageQuery(message);
  const relevantResults = retrieveRelevantDestinations(criteria, 4);
  const ragContext = buildRAGContext(relevantResults, message);

  const matchedDestinations = relevantResults.map(r => r.destination);
  const primaryDest = matchedDestinations[0] || getKB().destinations[0];

  const { provider } = getActiveAIProvider();
  let aiTextResponse = null;

  if (provider !== "LOCAL_RAG_ENGINE") {
    const systemPrompt = `You are "Karnataka AI", the official AI Travel Copilot for Karnataka Travel Diaries.
You speak with warmth, cultural appreciation, and local expertise on Karnataka.
Use the retrieved knowledge base facts below. NEVER hallucinate places, fake prices, or fake hours outside Karnataka.
Enforce Karnataka Trip Hierarchy:
- Short trips (1-2 days): Focus on ONE primary destination and nearby sights. Never jump randomly between distant districts.
- 3-4 days: Focus on ONE primary destination and at most ONE neighbouring destination.
- 5-6 days: Follow a contiguous regional corridor (e.g. Coastal corridor or Malnad corridor).
Label all monetary costs with "Estimated costs — actual prices may vary."`;

    const fullPrompt = `${ragContext}

User Message: "${message}"

Respond with:
1. Warm, locally grounded overview.
2. Structured itinerary recommendations adhering to Karnataka cluster rules.
3. Authentic local food recommendations.
4. Practical road and timing advice.`;

    aiTextResponse = await callExternalLLM(fullPrompt, systemPrompt);
  }

  if (!aiTextResponse) {
    aiTextResponse = generateLocalChatResponse(message, criteria, relevantResults, primaryDest);
  }

  const structuredTripCard = buildStructuredTripCard(criteria, matchedDestinations);

  return {
    success: true,
    provider: aiTextResponse && provider !== "LOCAL_RAG_ENGINE" ? provider : "LOCAL_RAG_ENGINE",
    mode: provider === "LOCAL_RAG_ENGINE" ? "DEMO/MOCK MODE (Local Grounded RAG)" : "LIVE CLOUD AI",
    reply: aiTextResponse,
    structuredTrip: structuredTripCard,
    retrievedDestinations: matchedDestinations.map(d => ({
      name: d.name,
      slug: d.slug,
      district: d.district,
      image: d.image,
      category: d.categories?.[0] || d.category || "Heritage",
      latitude: d.latitude,
      longitude: d.longitude
    }))
  };
}

function generateLocalChatResponse(message, criteria, relevantResults, primaryDest) {
  if (relevantResults.length === 0) {
    return `Namaskara! Karnataka offers breathtaking journeys from the Western Ghats to the ancient ruins of Vijayanagara. Could you share your starting point, duration, or whether you prefer misty hill stations, coastal beaches, or heritage palaces?`;
  }

  const destNames = relevantResults.map(r => r.destination.name).join(" and ");
  const main = primaryDest;
  const food = (main.foodSpecialties || []).slice(0, 3).join(", ");
  const tips = (main.travelTips || [])[0] || "Start your journeys early in the morning for calm sightseeing.";

  return `✨ **Karnataka AI Recommendation**

Based on your travel request, **${destNames}** is an ideal match for your journey!

📍 **Destination Highlights**:
${(main.activities || []).slice(0, 3).map(a => `• ${a}`).join("\n")}

🍛 **Must-Try Local Flavors**:
Don't miss authentic **${food}**.

💡 **Travel Copilot Advice**:
${tips}

Explore the structured journey below with direct Google Maps GPS directions and itinerary planning:`;
}

function buildStructuredTripCard(criteria, matchedDestinations) {
  if (!matchedDestinations || matchedDestinations.length === 0) return null;

  const dests = matchedDestinations.slice(0, 3);
  const days = criteria.durationDays || (dests.length === 1 ? dests[0].recommendedDays || 2 : dests.length + 1);
  const budget = criteria.maxBudget
    ? `₹${criteria.maxBudget.toLocaleString('en-IN')}`
    : `₹${(days * 2200).toLocaleString('en-IN')} – ₹${(days * 3500).toLocaleString('en-IN')}`;

  const tags = Array.from(new Set(dests.flatMap(d => d.categories || []))).slice(0, 3).join(" • ");
  const origin = criteria.origin || "Bengaluru";

  const daysPlan = [];
  if (dests.length === 1) {
    daysPlan.push({ day: 1, route: `${origin} → ${dests[0].name}`, focus: "Arrival, core attractions, and sunset viewpoint" });
    if (days >= 2) daysPlan.push({ day: 2, route: `Around ${dests[0].name} → ${origin}`, focus: "Nearby surrounding attractions, local culinary tasting, and return" });
  } else {
    daysPlan.push({ day: 1, route: `${origin} → ${dests[0].name}`, focus: "Morning drive, check-in, and local sights" });
    for (let i = 1; i < dests.length; i++) {
      daysPlan.push({ day: i + 1, route: `${dests[i - 1].name} → ${dests[i].name}`, focus: "Scenic transfer and nature/heritage exploration" });
    }
    daysPlan.push({ day: days, route: `${dests[dests.length - 1].name} → ${origin}`, focus: "Morning activity and return drive" });
  }

  return {
    title: dests.map(d => d.name).join(" + "),
    duration: `${days} Days`,
    estimatedBudget: budget,
    disclaimer: "Estimated costs — actual prices may vary.",
    perfectFor: tags,
    image: dests[0].image,
    destinationSlug: dests[0].slug,
    destinations: dests.map(d => ({
      name: d.name,
      slug: d.slug,
      latitude: d.latitude,
      longitude: d.longitude,
      image: d.image
    })),
    timeline: daysPlan
  };
}

// =========================================================================
// 2. DEDICATED SPIRITUAL TEMPLE CIRCUIT PLANNER (GEOGRAPHICALLY OPTIMIZED)
// =========================================================================
/**
 * Dedicated Geographically Optimized Spiritual Circuit Engine
 * Accurately calculates road distance, travel time, arrival time, and temple timings along:
 * User Start Location → Dharmasthala → Kukke Subrahmanya → Mangalore → Kateel → Udupi → Murdeshwar → Honnavar → Gokarna → User Return Location
 */
async function generateSpiritualTempleCircuitItinerary({
  startingLocation = "Bengaluru",
  returnLocation = null,
  durationDays = 3,
  budget = 7000,
  travelersCount = 2,
  travelWith = "Friends",
  transport = "Car",
  travelStyle = "Balanced",
  interests = [],
  primaryDestination = null
}) {
  const actualReturnLocation = returnLocation || startingLocation;
  const startHierarchy = resolveLocationHierarchy(startingLocation);
  const returnHierarchy = resolveLocationHierarchy(actualReturnLocation);
  const startHub = resolveStartingPoint(startingLocation);
  const returnHub = resolveStartingPoint(actualReturnLocation);

  const startCity = startHierarchy?.cityName || startHub.name;
  const startTaluk = startHierarchy?.talukName || (startHierarchy?.taluk?.name ? `${startHierarchy.taluk.name} Taluk` : startHub.name);
  const startDistrict = startHierarchy?.districtName || (startHierarchy?.district?.name ? `${startHierarchy.district.name} District` : startHub.name);

  const returnCity = returnHierarchy?.cityName || returnHub.name;
  const returnTaluk = returnHierarchy?.talukName || (returnHierarchy?.taluk?.name ? `${returnHierarchy.taluk.name} Taluk` : returnHub.name);
  const returnDistrict = returnHierarchy?.districtName || (returnHierarchy?.district?.name ? `${returnHierarchy.district.name} District` : returnHub.name);

  // Retrieve destination records
  const dharmasthalaDest = getDestinationBySlug("dharmasthala") || {
    name: "Dharmasthala",
    slug: "dharmasthala",
    district: "Dakshina Kannada",
    image: "images/destinations/dharmasthala.jpg",
    latitude: 12.9566,
    longitude: 75.3787
  };
  const kukkeDest = getDestinationBySlug("kukke-subrahmanya") || {
    name: "Kukke Subrahmanya",
    slug: "kukke-subrahmanya",
    district: "Dakshina Kannada",
    image: "images/destinations/kukke-subrahmanya.jpg",
    latitude: 12.6644,
    longitude: 75.6144
  };
  const mangaloreDest = getDestinationBySlug("mangalore") || {
    name: "Mangalore",
    slug: "mangalore",
    district: "Dakshina Kannada",
    image: "images/destinations/mangalore.jpg",
    latitude: 12.9141,
    longitude: 74.856
  };
  const udupiDest = getDestinationBySlug("udupi") || {
    name: "Udupi",
    slug: "udupi",
    district: "Udupi",
    image: "images/destinations/udupi.jpg",
    latitude: 13.3409,
    longitude: 74.7421
  };
  const murudeshwarDest = getDestinationBySlug("murudeshwar") || {
    name: "Murdeshwar",
    slug: "murudeshwar",
    district: "Uttara Kannada",
    image: "images/destinations/murudeshwar.jpg",
    latitude: 14.094,
    longitude: 74.4899
  };
  const honnavarDest = getDestinationBySlug("honnavar") || {
    name: "Honnavar",
    slug: "honnavar",
    district: "Uttara Kannada",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    latitude: 14.2798,
    longitude: 74.4439
  };
  const gokarnaDest = getDestinationBySlug("gokarna") || {
    name: "Gokarna",
    slug: "gokarna",
    district: "Uttara Kannada",
    image: "images/destinations/gokarna.jpg",
    latitude: 14.5479,
    longitude: 74.3188
  };

  // Pre-calculate verified road segments:
  // 1. User Start Location -> Dharmasthala
  const legStartToDharmasthala = await getRoadRouteWithCache(startingLocation, "Dharmasthala", startHub.lat, startHub.lon, 12.9566, 75.3787);
  // 2. Dharmasthala -> Kukke Subrahmanya (54 km)
  const legDharmasthalaToKukke = await getRoadRouteWithCache("Dharmasthala", "Kukke Subrahmanya", 12.9566, 75.3787, 12.6644, 75.6144);
  // 3. Kukke Subrahmanya -> Mangalore (105 km)
  const legKukkeToMangalore = await getRoadRouteWithCache("Kukke Subrahmanya", "Mangalore", 12.6644, 75.6144, 12.9141, 74.856);
  // 4. Mangalore -> Kateel (26 km)
  const legMangaloreToKateel = await getRoadRouteWithCache("Mangalore", "Kateel", 12.9141, 74.856, 13.018, 74.872);
  // 5. Kateel -> Udupi (42 km)
  const legKateelToUdupi = await getRoadRouteWithCache("Kateel", "Udupi", 13.018, 74.872, 13.3409, 74.7421);
  // 6. Udupi -> Murdeshwar (102 km)
  const legUdupiToMurdeshwar = await getRoadRouteWithCache("Udupi", "Murdeshwar", 13.3409, 74.7421, 14.094, 74.4899);
  // 7. Murdeshwar -> Honnavar (28 km)
  const legMurdeshwarToHonnavar = await getRoadRouteWithCache("Murdeshwar", "Honnavar", 14.094, 74.4899, 14.2798, 74.4439);
  // 8. Honnavar -> Gokarna (36 km)
  const legHonnavarToGokarna = await getRoadRouteWithCache("Honnavar", "Gokarna", 14.2798, 74.4439, 14.5479, 74.3188);

  // Return legs depending on duration:
  const legMangaloreToReturn = await getRoadRouteWithCache("Mangalore", actualReturnLocation, 12.9141, 74.856, returnHub.lat, returnHub.lon);
  const legMurdeshwarToReturn = await getRoadRouteWithCache("Murdeshwar", actualReturnLocation, 14.094, 74.4899, returnHub.lat, returnHub.lon);
  const legGokarnaToReturn = await getRoadRouteWithCache("Gokarna", actualReturnLocation, 14.5479, 74.3188, returnHub.lat, returnHub.lon);

  // Mode and sequence setup
  let planningMode = "spiritual_circuit";
  let modeLabel = "Full Coastal Karnataka Spiritual Circuit (5+ Days)";
  let selectedDestinations = [];

  if (durationDays <= 2) {
    planningMode = "single_destination";
    modeLabel = "Single Spiritual Taluk Destination Mode (1–2 Days)";
    selectedDestinations = [dharmasthalaDest, kukkeDest].filter(Boolean).slice(0, durationDays);
  } else if (durationDays === 3) {
    planningMode = "primary_plus_neighbour";
    modeLabel = "Sacred Temple Corridor Mode (3 Days)";
    selectedDestinations = [dharmasthalaDest, kukkeDest, mangaloreDest].filter(Boolean);
  } else if (durationDays === 4) {
    planningMode = "primary_plus_neighbour";
    modeLabel = "Sacred Temple Corridor Mode (4 Days)";
    selectedDestinations = [dharmasthalaDest, kukkeDest, mangaloreDest, udupiDest, murudeshwarDest].filter(Boolean);
  } else {
    planningMode = "spiritual_circuit";
    modeLabel = "Full Coastal Karnataka Spiritual Circuit (5+ Days)";
    selectedDestinations = [dharmasthalaDest, kukkeDest, mangaloreDest, udupiDest, murudeshwarDest, honnavarDest, gokarnaDest].filter(Boolean);
  }

  // --- DAY 1 TIMING & EXPLORATION LOGIC ---
  const d1Dist = legStartToDharmasthala.distanceKm;
  const d1DriveHours = legStartToDharmasthala.driveHours;
  const d1DepartHour = d1Dist < 100 ? 7.5 : d1Dist > 350 ? 6.0 : 6.5;
  const d1DepartStr = d1Dist < 100 ? "7:30 AM" : d1Dist > 350 ? "6:00 AM" : "6:30 AM";
  const d1BreakHours = d1DriveHours >= 5.0 ? 0.75 : d1DriveHours >= 3.0 ? 0.5 : 0;
  const d1ArrivalHour = d1DepartHour + d1DriveHours + d1BreakHours;

  let arrH = Math.floor(d1ArrivalHour);
  let arrM = Math.round((d1ArrivalHour - arrH) * 60);
  if (arrM >= 60) { arrH += 1; arrM -= 60; }
  const ampm = arrH >= 12 ? (arrH >= 24 ? "AM" : "PM") : "AM";
  const displayH = arrH % 12 || 12;
  const d1ArrivalStr = `${displayH}:${arrM < 10 ? '0' : ''}${arrM} ${ampm}`;

  let d1Morning = "";
  let d1Afternoon = "";
  let d1Evening = "";
  let d1Attractions = [];

  const manjunathaTempleAttr = {
    name: "Dharmasthala Manjunatha Temple",
    category: "Spiritual / Sacred Shrine",
    visitingHours: "6:30 AM – 2:00 PM, 5:00 PM – 8:30 PM",
    description: "Revered 800-year-old temple where Lord Shiva is worshipped as Manjunatha, famous for divine darshan and legendary Annadana.",
    image: "images/attractions/dharmasthala-manjunatha-temple.jpg",
    taluk: "Belthangady Taluk",
    district: "Dakshina Kannada"
  };

  const bahubaliStatueAttr = {
    name: "Bahubali Monolithic Statue (Ratnagiri Hill)",
    category: "Heritage / Spiritual",
    visitingHours: "6:00 AM – 6:30 PM",
    description: "Inspiring 39-foot monolithic statue of Bhagawan Bahubali carved from a single granite boulder on Ratnagiri Hill.",
    image: "images/destinations/dharmasthala.jpg",
    taluk: "Belthangady Taluk",
    district: "Dakshina Kannada"
  };

  const manjushaMuseumAttr = {
    name: "Manjusha Heritage Car Museum",
    category: "Culture / Museum",
    visitingHours: "9:00 AM – 1:00 PM, 4:00 PM – 7:00 PM",
    description: "Remarkable museum showcasing antique vintage cars, ancient manuscripts, temple chariots, and historical artifacts.",
    image: "images/destinations/dharmasthala.jpg",
    taluk: "Belthangady Taluk",
    district: "Dakshina Kannada"
  };

  if (d1ArrivalHour <= 11.5) {
    d1Morning = `Depart ${startingLocation} at ${d1DepartStr} (~${d1Dist} km, ~${d1DriveHours} hrs driving). Arrive in Dharmasthala by ${d1ArrivalStr}. Take holy dip at Netravati River Snana Ghatt, proceed for morning Darshan at Sri Manjunatha Swamy Temple, and partake in legendary Annadana (sacred dining hall).`;
    d1Afternoon = `Check-in at hotel/guest house, rest briefly, and visit the Manjusha Heritage Car Museum (open 4:00 PM – 7:00 PM) showcasing vintage royal automobiles and temple relics.`;
    d1Evening = `Ascend Ratnagiri Hill to view the 39-foot monolithic Bahubali statue. Attend evening Deepotsava / Mahamangalarathi at Sri Manjunatha Temple (5:00 PM – 8:30 PM) amidst sacred chants.`;
    d1Attractions = [manjunathaTempleAttr, bahubaliStatueAttr, manjushaMuseumAttr];
  } else if (d1ArrivalHour <= 14.5) {
    d1Morning = `Depart ${startingLocation} at ${d1DepartStr}. Scenic highway drive towards Dharmasthala (~${d1Dist} km, ~${d1DriveHours} hrs driving) traversing the Western Ghats corridor. Enjoy highway breakfast en route.`;
    d1Afternoon = `Arrive in Dharmasthala around ${d1ArrivalStr}. Complete hotel check-in, freshen up, and visit the sacred Netravati River Bathing Ghat.`;
    d1Evening = `Visit Sri Manjunatha Swamy Temple for divine evening Darshan (temple doors open 5:00 PM – 8:30 PM). Witness grand Aarti, partake in revered temple Mahaprasada (Annadana), and visit Ratnagiri Bahubali Hill (open till 6:30 PM).`;
    d1Attractions = [manjunathaTempleAttr, bahubaliStatueAttr];
  } else {
    d1Morning = `Early morning highway departure from ${startingLocation} at ${d1DepartStr}. Road transit across Karnataka (~${d1Dist} km, ~${d1DriveHours} hrs driving) with breakfast and lunch stops.`;
    d1Afternoon = `Arrive in Dharmasthala around ${d1ArrivalStr}. Check-in at hotel/homestay and unwind after the long journey.`;
    d1Evening = `Proceed to Sri Manjunatha Swamy Temple for evening Darshan (5:00 PM – 8:30 PM). Experience temple illuminations and savor temple Annadana dinner. Daytime museum visits omitted to avoid closed hours.`;
    d1Attractions = [manjunathaTempleAttr];
  }

  const day1 = {
    dayNumber: 1,
    title: `Day 1 — ${startingLocation} to Dharmasthala (Sri Manjunatha Swamy Darshan)`,
    destination: "Dharmasthala",
    destinationSlug: "dharmasthala",
    taluk: "Belthangady Taluk",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka (Karavali)",
    hierarchy: "Karnataka → Dakshina Kannada → Belthangady Taluk → Dharmasthala",
    dailyTravelDistance: d1Dist,
    daily_distance_budget: {
      maxTravelKm: d1Dist,
      dailyTravelDistance: d1Dist,
      dailyDistanceKm: d1Dist,
      idealTravelKm: d1Dist,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/dharmasthala.jpg",
    latitude: 12.9566,
    longitude: 75.3787,
    travel_from: startingLocation,
    travelLeg: {
      from: startingLocation,
      to: "Dharmasthala",
      distanceKm: d1Dist,
      driveHours: d1DriveHours,
      road_type: legStartToDharmasthala.road_type || "highway / ghat"
    },
    morning: d1Morning,
    afternoon: d1Afternoon,
    evening: d1Evening,
    overnight: "Dharmasthala",
    stay: "Overnight stay in Dharmasthala (Belthangady Taluk, Dakshina Kannada)",
    destinationInfo: {
      whyVisit: dharmasthalaDest.whyVisit || dharmasthalaDest.shortDescription,
      famousFor: dharmasthalaDest.famousFor || ["Sri Manjunatha Swamy Temple", "Annadana Mahaprasada", "Bahubali Monolith"],
      mustVisit: ["Dharmasthala Manjunatha Temple", "Bahubali Monolithic Statue"]
    },
    attractions: d1Attractions
  };

  // --- DAY 2 LOGIC (Dharmasthala -> Kukke -> Mangalore) ---
  const kukkeTempleAttr = {
    name: "Kukke Subrahmanya Temple",
    category: "Spiritual / Sacred Shrine",
    visitingHours: "6:00 AM – 1:30 PM, 3:30 PM – 8:00 PM",
    description: "Sacred shrine surrounded by the lush Western Ghats and Kumara Parvatha, dedicated to Lord Subrahmanya, protector of serpent king Vasuki.",
    image: "images/attractions/kukke-subrahmanya-temple.jpg",
    taluk: "Kadaba Taluk",
    district: "Dakshina Kannada"
  };

  const biladvaraAttr = {
    name: "Biladvara Cave",
    category: "Spiritual / Sacred Site",
    visitingHours: "6:00 AM – 6:00 PM",
    description: "Mystical natural cave nestled in forest greenery where serpent king Vasuki took refuge to escape Garuda.",
    image: "images/destinations/kukke-subrahmanya.jpg",
    taluk: "Kadaba Taluk",
    district: "Dakshina Kannada"
  };

  const kudroliTempleAttr = {
    name: "Kudroli Gokarnanatheshwara Temple",
    category: "Spiritual / Heritage",
    visitingHours: "6:00 AM – 1:00 PM, 4:30 PM – 9:00 PM",
    description: "Magnificent temple consecrated by social reformer Narayana Guru, featuring golden gopuram and dazzling evening illumination.",
    image: "images/destinations/mangalore.jpg",
    taluk: "Mangaluru Taluk",
    district: "Dakshina Kannada"
  };

  const d2Dist = 54 + 105; // 159 km
  const d2DriveHours = Number((1.4 + 2.5).toFixed(1)); // 3.9 hrs

  const day2 = {
    dayNumber: 2,
    title: `Day 2 — Dharmasthala to Kukke Subrahmanya & Evening Transit to Mangalore`,
    destination: "Mangalore",
    destinationSlug: "mangalore",
    taluk: "Mangaluru Taluk",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka (Karavali)",
    hierarchy: "Karnataka → Dakshina Kannada → Kadaba Taluk & Mangaluru Taluk → Kukke & Mangalore",
    dailyTravelDistance: d2Dist,
    daily_distance_budget: {
      maxTravelKm: d2Dist,
      dailyTravelDistance: d2Dist,
      dailyDistanceKm: d2Dist,
      idealTravelKm: d2Dist,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/kukke-subrahmanya.jpg",
    latitude: 12.9141,
    longitude: 74.856,
    travel_from: "Dharmasthala",
    travelLeg: {
      from: "Dharmasthala",
      to: "Kukke Subrahmanya → Mangalore",
      distanceKm: d2Dist,
      driveHours: d2DriveHours,
      road_type: "ghat / coastal-nh73"
    },
    morning: `Depart Dharmasthala after breakfast (~8:00 AM). Travel Dharmasthala → Kukke Subrahmanya (~54 km, ~1.4 hrs). Take a holy dip in the sacred Kumaradhara River, then visit Kukke Sri Subrahmanya Temple (open 6:00 AM – 1:30 PM) for divine Sarpa Dosha Nivarana Darshan. Partake in sacred temple prasada lunch.`,
    afternoon: `Visit Adi Subrahmanya Temple and Biladvara Cave. After completing Kukke exploration (~3:30 PM), travel the same evening: Kukke Subrahmanya → Mangalore (~105 km, ~2.5 hrs) traversing the foothills of Dakshina Kannada.`,
    evening: `Arrive in Mangalore by 6:00 PM. Check-in at hotel, visit the illuminated Kudroli Gokarnanatheshwara Temple or Panambur Beach for sunset, and enjoy authentic coastal Mangalorean dinner (Neer Dosa, Ghee Roast).`,
    overnight: "Mangalore",
    stay: "Overnight stay in Mangalore (Mangaluru Taluk, Dakshina Kannada)",
    destinationInfo: {
      whyVisit: kukkeDest.whyVisit || "Sacred pilgrimage shrine at Kumara Parvatha foothills.",
      famousFor: ["Kukke Subrahmanya Temple", "Kumaradhara River", "Biladvara Cave"],
      mustVisit: ["Kukke Subrahmanya Temple", "Kudroli Gokarnanatheshwara Temple"]
    },
    attractions: [kukkeTempleAttr, biladvaraAttr, kudroliTempleAttr]
  };

  // Common Attractions for Day 3+
  const kadriTempleAttr = {
    name: "Kadri Manjunatha Temple",
    category: "Spiritual / Heritage",
    visitingHours: "6:00 AM – 1:00 PM, 4:00 PM – 8:30 PM",
    description: "10th-century Vijayanagara/Buddhist heritage shrine housing the celebrated bronze sculpture of Bodhisattva Lokeshwara and freshwater gomukhas.",
    image: "images/attractions/kadri-manjunatha-temple.jpg",
    taluk: "Mangaluru Taluk",
    district: "Dakshina Kannada"
  };

  const kateelTempleAttr = {
    name: "Kateel Durgaparameshwari Temple",
    category: "Spiritual / Sacred Shrine",
    visitingHours: "6:00 AM – 2:00 PM, 4:30 PM – 9:00 PM",
    description: "Sacred river-island temple on the holy Nandini River dedicated to Goddess Bhramari / Durgaparameshwari.",
    image: "images/attractions/kateel-durgaparameshwari-temple.jpg",
    taluk: "Mangaluru Taluk",
    district: "Dakshina Kannada"
  };

  const udupiKrishnaTempleAttr = {
    name: "Udupi Sri Krishna Temple (Krishna Mutt)",
    category: "Spiritual / Sacred Matha",
    visitingHours: "5:00 AM – 2:00 PM, 4:00 PM – 9:00 PM",
    description: "World-renowned 13th-century Dvaita monastery founded by Sri Madhvacharya; pilgrims view Lord Krishna through the sacred Kanakana Kindi window.",
    image: "images/destinations/udupi.jpg",
    taluk: "Udupi Taluk",
    district: "Udupi"
  };

  const malpeBeachAttr = {
    name: "Malpe Beach & Sea Walk",
    category: "Beaches / Nature",
    visitingHours: "6:00 AM – 7:30 PM",
    description: "Vibrant coastal shoreline with smooth sands, beachside promenades, and view of St. Mary's volcanic islands.",
    image: "images/destinations/udupi.jpg",
    taluk: "Udupi Taluk",
    district: "Udupi"
  };

  const panamburBeachAttr = {
    name: "Panambur Beach",
    category: "Beaches / Nature",
    visitingHours: "6:00 AM – 7:30 PM",
    description: "Spacious golden beach along the Arabian Sea featuring clean sands, camel rides, and sunset coastal panoramas.",
    image: "images/destinations/mangalore.jpg",
    taluk: "Mangaluru Taluk",
    district: "Dakshina Kannada"
  };

  const murudeshwarTempleAttr = {
    name: "Murudeshwar Temple & 123-ft Shiva Statue",
    category: "Spiritual / Landmark",
    visitingHours: "6:00 AM – 1:00 PM, 3:00 PM – 8:30 PM",
    description: "Colossal 123-foot statue of Lord Shiva towering over the Arabian Sea atop Kanduka Hill, with the ancient coastal shrine.",
    image: "images/destinations/murudeshwar.jpg",
    taluk: "Bhatkal Taluk",
    district: "Uttara Kannada"
  };

  const rajagopuraAttr = {
    name: "20-Story Rajagopura Observation Lift",
    category: "Heritage / Landmark",
    visitingHours: "7:00 AM – 12:30 PM, 3:00 PM – 8:00 PM",
    description: "Magnificent 249-foot gopura equipped with high-speed elevator offering 360-degree aerial views of the coastline.",
    image: "images/destinations/murudeshwar.jpg",
    taluk: "Bhatkal Taluk",
    district: "Uttara Kannada"
  };

  const murudeshwarBeachAttr = {
    name: "Murudeshwar Beach",
    category: "Beaches / Nature",
    visitingHours: "6:00 AM – 7:00 PM",
    description: "Gentle crescent beach surrounding the temple promontory with water sports and scenic sunset vistas.",
    image: "images/destinations/murudeshwar.jpg",
    taluk: "Bhatkal Taluk",
    district: "Uttara Kannada"
  };

  const kandlaVanAttr = {
    name: "Kandla Van Mangrove Boardwalk",
    category: "Nature / Eco-Tourism",
    visitingHours: "8:30 AM – 6:30 PM",
    description: "Scenic wooden boardwalk winding through dense mangrove forest ecosystems alongside quiet backwater boat rides.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    taluk: "Honnavar Taluk",
    district: "Uttara Kannada"
  };

  const kasarkodBeachAttr = {
    name: "Kasarkod Eco Blue Flag Beach",
    category: "Nature / Beaches",
    visitingHours: "6:00 AM – 7:00 PM",
    description: "Pristine, certified Blue Flag eco-beach with golden sands, clean waters, and casuarina groves.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
    taluk: "Honnavar Taluk",
    district: "Uttara Kannada"
  };

  const mahabaleshwarTempleAttr = {
    name: "Gokarna Mahabaleshwar Temple (Atmalinga)",
    category: "Spiritual / Sacred Shrine",
    visitingHours: "6:00 AM – 12:30 PM, 5:00 PM – 8:00 PM",
    description: "Ancient Dravidian temple enshrining the sacred Pranalinga (Atmalinga) of Lord Shiva, one of India's seven sacred Muktikshetras.",
    image: "images/destinations/gokarna.jpg",
    taluk: "Kumta Taluk",
    district: "Uttara Kannada"
  };

  const mahaGanapatiTempleAttr = {
    name: "Maha Ganapati Temple",
    category: "Spiritual / Sacred Shrine",
    visitingHours: "6:00 AM – 1:00 PM, 4:30 PM – 8:30 PM",
    description: "Sacred temple honoring Lord Ganesha who tricked demon king Ravana into placing the Atmalinga on earth.",
    image: "images/destinations/gokarna.jpg",
    taluk: "Kumta Taluk",
    district: "Uttara Kannada"
  };

  const omBeachAttr = {
    name: "Om Beach & Kudle Beach",
    category: "Beaches / Nature",
    visitingHours: "6:00 AM – 7:30 PM",
    description: "Iconic naturally formed twin-crescent beach shaped like the Devanagari 'Om', with sunset cliff trails.",
    image: "images/destinations/gokarna.jpg",
    taluk: "Kumta Taluk",
    district: "Uttara Kannada"
  };

  // Day 3 Variants
  const day3For3DaysTrip = {
    dayNumber: 3,
    title: `Day 3 — Mangalore Coastal & Heritage Exploration`,
    destination: "Mangalore",
    destinationSlug: "mangalore",
    taluk: "Mangaluru Taluk",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka (Karavali)",
    hierarchy: "Karnataka → Dakshina Kannada → Mangaluru Taluk → Mangalore",
    dailyTravelDistance: 20,
    daily_distance_budget: {
      maxTravelKm: 20,
      dailyTravelDistance: 20,
      dailyDistanceKm: 20,
      idealTravelKm: 20,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/mangalore.jpg",
    latitude: 12.9141,
    longitude: 74.856,
    travel_from: "Mangalore",
    travelLeg: {
      from: "Mangalore",
      to: "Local Mangalore Heritage & Beaches",
      distanceKm: 20,
      driveHours: 1.0,
      road_type: "city-coastal"
    },
    morning: `Visit the ancient Kadri Manjunatha Temple (10th-century shrine with bronze Lokeshwara statue and perennial gomukha spring) and the historic Mangaladevi Temple. Enjoy authentic Mangalorean breakfast (Goli Baje, Tuppa Dosa).`,
    afternoon: `Explore St. Aloysius Chapel famous for century-old Italian fresco paintings, followed by delicious local coastal thali lunch. Complete the Mangalore circuit exploration.`,
    evening: `Spend relaxing sunset hours at Panambur Beach and Tannirbhavi Beach. Stroll the local market for authentic Mangalore Halwa and cashew delicacies. Complete Mangalore portion of journey.`,
    overnight: "Mangalore",
    stay: "Overnight stay in Mangalore (Mangaluru Taluk, Dakshina Kannada)",
    destinationInfo: {
      whyVisit: mangaloreDest.whyVisit || "Chief coastal port city rich in Tuluva heritage and historic temples.",
      famousFor: ["Kadri Manjunatha Temple", "Kudroli Temple", "Panambur Beach"],
      mustVisit: ["Kadri Manjunatha Temple", "Panambur Beach"]
    },
    attractions: [kadriTempleAttr, kudroliTempleAttr, panamburBeachAttr]
  };

  const day4ReturnFor3DaysTrip = {
    dayNumber: 4,
    title: `Day 4 — Mangalore to ${actualReturnLocation} (Return Journey)`,
    destination: actualReturnLocation,
    destinationSlug: returnHierarchy?.destinationSlug || "return-home",
    taluk: returnTaluk,
    district: returnDistrict,
    region: returnHierarchy?.region?.name || "Karnataka",
    hierarchy: `Karnataka → ${returnDistrict} → ${returnTaluk} → ${actualReturnLocation}`,
    dailyTravelDistance: legMangaloreToReturn.distanceKm,
    daily_distance_budget: {
      maxTravelKm: legMangaloreToReturn.distanceKm,
      dailyTravelDistance: legMangaloreToReturn.distanceKm,
      dailyDistanceKm: legMangaloreToReturn.distanceKm,
      idealTravelKm: legMangaloreToReturn.distanceKm,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/mangalore.jpg",
    latitude: returnHub.lat,
    longitude: returnHub.lon,
    travel_from: "Mangalore",
    travelLeg: {
      from: "Mangalore",
      to: `${actualReturnLocation} (Return)`,
      distanceKm: legMangaloreToReturn.distanceKm,
      driveHours: legMangaloreToReturn.driveHours,
      road_type: legMangaloreToReturn.road_type || "highway"
    },
    morning: `Enjoy a relaxed coastal breakfast in Mangalore. Check out from hotel and begin comfortable return journey from Mangalore to ${actualReturnLocation} (~${legMangaloreToReturn.distanceKm} km, ~${legMangaloreToReturn.driveHours} hrs driving).`,
    afternoon: `Scenic highway driving with lunch stop at a traditional highway restaurant.`,
    evening: `Highway tea break and safe arrival back home in ${actualReturnLocation}.`,
    overnight: `${actualReturnLocation} (Home)`,
    stay: `Return home to ${actualReturnLocation}`,
    destinationInfo: {
      whyVisit: `Return journey to ${actualReturnLocation}`,
      famousFor: [`Journey to ${actualReturnLocation}`],
      mustVisit: [`Arrival at ${actualReturnLocation}`]
    },
    attractions: []
  };

  const d3Dist = 26 + 42 + 14; // 82 km
  const d3DriveHours = 2.2;

  const day3For4PlusDays = {
    dayNumber: 3,
    title: `Day 3 — Mangalore to Kateel & Udupi Sri Krishna Mutt`,
    destination: "Udupi",
    destinationSlug: "udupi",
    taluk: "Udupi Taluk",
    district: "Udupi",
    region: "Coastal Karnataka (Karavali)",
    hierarchy: "Karnataka → Dakshina Kannada & Udupi → Mangaluru & Udupi Taluk → Kateel & Udupi",
    dailyTravelDistance: d3Dist,
    daily_distance_budget: {
      maxTravelKm: d3Dist,
      dailyTravelDistance: d3Dist,
      dailyDistanceKm: d3Dist,
      idealTravelKm: d3Dist,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/udupi.jpg",
    latitude: 13.3409,
    longitude: 74.7421,
    travel_from: "Mangalore",
    travelLeg: {
      from: "Mangalore",
      to: "Kateel → Udupi",
      distanceKm: d3Dist,
      driveHours: d3DriveHours,
      road_type: "state-highway / coastal-nh66"
    },
    morning: `Explore famous Mangalore attractions in the morning: visit Kadri Manjunatha Temple (10th-century shrine with sacred gomukha springs). Then travel: Mangalore → Kateel Durgaparameshwari Temple (~26 km, ~45 mins). Explore Kateel according to temple timings (6:00 AM – 2:00 PM). Seek blessings of Goddess Durgaparameshwari on the holy islet of the Nandini River and partake in Annadana lunch.`,
    afternoon: `Travel Kateel → Udupi (~42 km, ~1 hr). Reach Udupi and visit Sri Krishna Mutt / Udupi Sri Krishna Temple. Allocate approximately 2–3 hours for Krishna Mutt: witness the deity through the sacred silver Kanakana Kindi window, explore the eight Ashta Mathas, Annabrahma dining hall, and Madhwa Sarovara holy tank.`,
    evening: `Visit Udupi beaches (Malpe Beach / St. Mary's Island). Allocate approximately 2 hours for beach exploration and sunset over the Arabian Sea. Savor authentic Udupi cuisine (Masala Dosa, Patrode, Kadubu).`,
    overnight: "Udupi",
    stay: "Overnight stay in Udupi (Udupi Taluk, Udupi District)",
    destinationInfo: {
      whyVisit: udupiDest.whyVisit || "World-famous Krishna Mutt monastery and pristine beaches.",
      famousFor: ["Udupi Sri Krishna Temple", "Kanakana Kindi", "Malpe Beach"],
      mustVisit: ["Udupi Sri Krishna Temple", "Kateel Durgaparameshwari Temple", "Malpe Beach"]
    },
    attractions: [kadriTempleAttr, kateelTempleAttr, udupiKrishnaTempleAttr, malpeBeachAttr]
  };

  // Day 4 Variants
  const day4For4DaysTrip = {
    dayNumber: 4,
    title: `Day 4 — Udupi to Murdeshwar (Lord Shiva Statue & Coastal Exploration)`,
    destination: "Murdeshwar",
    destinationSlug: "murudeshwar",
    taluk: "Bhatkal Taluk",
    district: "Uttara Kannada",
    region: "Coastal Karnataka (Karavali)",
    hierarchy: "Karnataka → Uttara Kannada → Bhatkal Taluk → Murdeshwar",
    dailyTravelDistance: 107,
    daily_distance_budget: {
      maxTravelKm: 107,
      dailyTravelDistance: 107,
      dailyDistanceKm: 107,
      idealTravelKm: 107,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/murudeshwar.jpg",
    latitude: 14.094,
    longitude: 74.4899,
    travel_from: "Udupi",
    travelLeg: {
      from: "Udupi",
      to: "Murdeshwar",
      distanceKm: 107,
      driveHours: 2.2,
      road_type: "coastal-nh66"
    },
    morning: `Start from Udupi after morning breakfast. Travel Udupi → Murdeshwar (~102 km, ~2.0 hrs via scenic coastal NH66). Reach Murdeshwar by late morning.`,
    afternoon: `Allocate approximately 3–4 hours for exploring Murdeshwar: visit Murudeshwar Temple (open 6:00 AM – 1:00 PM, 3:00 PM – 8:30 PM), marvel at the iconic 123-foot Lord Shiva statue atop Kanduka Hill, and take the lift to the 18th floor of the 20-storied Rajagopura for 360-degree Arabian Sea views. Enjoy coastal lunch.`,
    evening: `Relax on Murudeshwar Beach with waves lapping against the temple headland. Witness sunset behind the grand Shiva statue. Authentic coastal dinner. Stay overnight in Murdeshwar. (Do not continue to Honnavar or Gokarna in the 4-day itinerary).`,
    overnight: "Murdeshwar",
    stay: "Overnight stay in Murdeshwar (Bhatkal Taluk, Uttara Kannada)",
    destinationInfo: {
      whyVisit: murudeshwarDest.whyVisit || "Iconic 123-foot Lord Shiva statue atop sea-facing Kanduka Hill.",
      famousFor: ["123-ft Shiva Statue", "Murudeshwar Temple", "20-story Rajagopura"],
      mustVisit: ["Murudeshwar Temple & 123-ft Shiva Statue", "Rajagopura Lift", "Murudeshwar Beach"]
    },
    attractions: [murudeshwarTempleAttr, rajagopuraAttr, murudeshwarBeachAttr]
  };

  const day5ReturnFor4DaysTrip = {
    dayNumber: 5,
    title: `Day 5 — Murdeshwar to ${actualReturnLocation} (Return Journey)`,
    destination: actualReturnLocation,
    destinationSlug: returnHierarchy?.destinationSlug || "return-home",
    taluk: returnTaluk,
    district: returnDistrict,
    region: returnHierarchy?.region?.name || "Karnataka",
    hierarchy: `Karnataka → ${returnDistrict} → ${returnTaluk} → ${actualReturnLocation}`,
    dailyTravelDistance: legMurdeshwarToReturn.distanceKm,
    daily_distance_budget: {
      maxTravelKm: legMurdeshwarToReturn.distanceKm,
      dailyTravelDistance: legMurdeshwarToReturn.distanceKm,
      dailyDistanceKm: legMurdeshwarToReturn.distanceKm,
      idealTravelKm: legMurdeshwarToReturn.distanceKm,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/murudeshwar.jpg",
    latitude: returnHub.lat,
    longitude: returnHub.lon,
    travel_from: "Murdeshwar",
    travelLeg: {
      from: "Murdeshwar",
      to: `${actualReturnLocation} (Return)`,
      distanceKm: legMurdeshwarToReturn.distanceKm,
      driveHours: legMurdeshwarToReturn.driveHours,
      road_type: legMurdeshwarToReturn.road_type || "highway"
    },
    morning: `Enjoy morning ocean breeze along Murudeshwar Beach. Hotel check-out and begin return journey to ${actualReturnLocation} (~${legMurdeshwarToReturn.distanceKm} km, ~${legMurdeshwarToReturn.driveHours} hrs driving).`,
    afternoon: `Smooth highway transit across scenic Karnataka corridors with lunch break.`,
    evening: `Highway tea break and safe arrival back home in ${actualReturnLocation}.`,
    overnight: `${actualReturnLocation} (Home)`,
    stay: `Return home to ${actualReturnLocation}`,
    destinationInfo: {
      whyVisit: `Return journey to ${actualReturnLocation}`,
      famousFor: [`Journey to ${actualReturnLocation}`],
      mustVisit: [`Arrival at ${actualReturnLocation}`]
    },
    attractions: []
  };

  const day4For5PlusDays = {
    dayNumber: 4,
    title: `Day 4 — Udupi to Murdeshwar & Afternoon Transit to Honnavar`,
    destination: "Honnavar",
    destinationSlug: "honnavar",
    taluk: "Honnavar Taluk",
    district: "Uttara Kannada",
    region: "Coastal Karnataka (Karavali)",
    hierarchy: "Karnataka → Uttara Kannada → Bhatkal & Honnavar Taluks → Murdeshwar & Honnavar",
    dailyTravelDistance: 142,
    daily_distance_budget: {
      maxTravelKm: 142,
      dailyTravelDistance: 142,
      dailyDistanceKm: 142,
      idealTravelKm: 142,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/murudeshwar.jpg",
    latitude: 14.2798,
    longitude: 74.4439,
    travel_from: "Udupi",
    travelLeg: {
      from: "Udupi",
      to: "Murdeshwar → Honnavar",
      distanceKm: 142,
      driveHours: 2.8,
      road_type: "coastal-nh66"
    },
    morning: `Start from Udupi after morning breakfast. Travel Udupi → Murdeshwar (~102 km, ~2.0 hrs via NH66). Reach Murdeshwar and allocate approximately 3–4 hours for exploring: darshan at Murudeshwar Temple, 123-foot Lord Shiva statue, and 20-story Rajagopura lift deck with coastal vistas.`,
    afternoon: `Enjoy coastal lunch in Murdeshwar. Then travel: Murdeshwar → Honnavar (~28 km, ~40 mins via NH66). Reach Honnavar by afternoon/evening (~3:30–4:00 PM). Check-in at accommodation.`,
    evening: `Explore Honnavar until night: walk the Kandla Van Mangrove Boardwalk through mangrove forest tunnels (open till 6:30 PM), Sharavathi River backwater boat ride, and catch the sunset at certified Kasarkod Blue Flag Eco Beach. Savor authentic Uttara Kannada dinner. Stay overnight in Honnavar.`,
    overnight: "Honnavar",
    stay: "Overnight stay in Honnavar (Honnavar Taluk, Uttara Kannada)",
    destinationInfo: {
      whyVisit: honnavarDest.whyVisit || "Unspoiled mangrove boardwalks and tranquil Sharavathi backwaters.",
      famousFor: ["Murudeshwar Temple", "Kandla Van Boardwalk", "Kasarkod Blue Flag Beach"],
      mustVisit: ["Murudeshwar Temple & 123-ft Shiva Statue", "Kandla Van Mangrove Boardwalk", "Kasarkod Beach"]
    },
    attractions: [murudeshwarTempleAttr, kandlaVanAttr, kasarkodBeachAttr]
  };

  // Day 5 & Return for 5+ Days
  const day5For5PlusDays = {
    dayNumber: 5,
    title: `Day 5 — Honnavar to Gokarna (Sacred Atmalinga & Coastal Beaches)`,
    destination: "Gokarna",
    destinationSlug: "gokarna",
    taluk: "Kumta Taluk",
    district: "Uttara Kannada",
    region: "Coastal Karnataka (Karavali)",
    hierarchy: "Karnataka → Uttara Kannada → Kumta Taluk → Gokarna",
    dailyTravelDistance: 50,
    daily_distance_budget: {
      maxTravelKm: 50,
      dailyTravelDistance: 50,
      dailyDistanceKm: 50,
      idealTravelKm: 50,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/gokarna.jpg",
    latitude: 14.5479,
    longitude: 74.3188,
    travel_from: "Honnavar",
    travelLeg: {
      from: "Honnavar",
      to: "Gokarna",
      distanceKm: 50,
      driveHours: 1.2,
      road_type: "coastal-nh66"
    },
    morning: `Start from Honnavar. Travel Honnavar → Gokarna (~36 km, ~50 mins). Arrive in holy Gokarna town. Take holy padapooja at Gokarna Main Beach, visit Maha Ganapati Temple, and proceed for sacred Atmalinga Darshan at Sri Mahabaleshwar Temple (open 6:00 AM – 12:30 PM).`,
    afternoon: `Check-in at Gokarna resort/hotel, savor authentic coastal lunch, and relax during midday.`,
    evening: `Explore Gokarna's famous crescent beaches: visit Om Beach (distinct auspicious 'Om' shape) and Kudle Beach. Walk the scenic headland cliff trail, enjoy breathtaking sunset over the Arabian Sea, and dinner at seaside beach cafes. Stay overnight in Gokarna.`,
    overnight: "Gokarna",
    stay: "Overnight stay in Gokarna (Kumta Taluk, Uttara Kannada)",
    destinationInfo: {
      whyVisit: gokarnaDest.whyVisit || "Sacred pilgrimage center and pristine cliff-lined Arabian Sea beaches.",
      famousFor: ["Mahabaleshwar Temple", "Om Beach", "Atmalinga", "Kudle Beach"],
      mustVisit: ["Gokarna Mahabaleshwar Temple (Atmalinga)", "Om Beach & Kudle Beach"]
    },
    attractions: [mahabaleshwarTempleAttr, mahaGanapatiTempleAttr, omBeachAttr]
  };

  const day6ReturnFor5DaysTrip = {
    dayNumber: 6,
    title: `Day 6 — Gokarna to ${actualReturnLocation} (Return Journey)`,
    destination: actualReturnLocation,
    destinationSlug: returnHierarchy?.destinationSlug || "return-home",
    taluk: returnTaluk,
    district: returnDistrict,
    region: returnHierarchy?.region?.name || "Karnataka",
    hierarchy: `Karnataka → ${returnDistrict} → ${returnTaluk} → ${actualReturnLocation}`,
    dailyTravelDistance: legGokarnaToReturn.distanceKm,
    daily_distance_budget: {
      maxTravelKm: legGokarnaToReturn.distanceKm,
      dailyTravelDistance: legGokarnaToReturn.distanceKm,
      dailyDistanceKm: legGokarnaToReturn.distanceKm,
      idealTravelKm: legGokarnaToReturn.distanceKm,
      label: "Daily Travel Distance"
    },
    image: "images/destinations/gokarna.jpg",
    latitude: returnHub.lat,
    longitude: returnHub.lon,
    travel_from: "Gokarna",
    travelLeg: {
      from: "Gokarna",
      to: `${actualReturnLocation} (Return)`,
      distanceKm: legGokarnaToReturn.distanceKm,
      driveHours: legGokarnaToReturn.driveHours,
      road_type: legGokarnaToReturn.road_type || "highway"
    },
    morning: `Early morning peaceful sunrise walk at Kudle Beach or final temple visit. Check out from Gokarna hotel and begin return road journey to ${actualReturnLocation} (~${legGokarnaToReturn.distanceKm} km, ~${legGokarnaToReturn.driveHours} hrs driving).`,
    afternoon: `Comfortable highway journey across Karnataka corridors with lunch stop.`,
    evening: `Highway tea break and safe arrival back home in ${actualReturnLocation}.`,
    overnight: `${actualReturnLocation} (Home)`,
    stay: `Return home to ${actualReturnLocation}`,
    destinationInfo: {
      whyVisit: `Return journey to ${actualReturnLocation}`,
      famousFor: [`Journey to ${actualReturnLocation}`],
      mustVisit: [`Arrival at ${actualReturnLocation}`]
    },
    attractions: []
  };

  // Assemble Day-by-Day Itineraries based on trip duration
  let dayItineraries = [];
  let corridorLegs = [];

  if (durationDays <= 2) {
    if (durationDays === 1) {
      dayItineraries = [
        day1,
        {
          dayNumber: 2,
          title: `Day 2 — Dharmasthala to ${actualReturnLocation} (Return Journey)`,
          destination: actualReturnLocation,
          destinationSlug: returnHierarchy?.destinationSlug || "return-home",
          taluk: returnTaluk,
          district: returnDistrict,
          region: "Karnataka",
          hierarchy: `Karnataka → ${returnDistrict} → ${returnTaluk} → ${actualReturnLocation}`,
          dailyTravelDistance: legStartToDharmasthala.distanceKm,
          daily_distance_budget: {
            maxTravelKm: legStartToDharmasthala.distanceKm,
            dailyTravelDistance: legStartToDharmasthala.distanceKm,
            dailyDistanceKm: legStartToDharmasthala.distanceKm,
            idealTravelKm: legStartToDharmasthala.distanceKm,
            label: "Daily Travel Distance"
          },
          image: "images/destinations/dharmasthala.jpg",
          latitude: returnHub.lat,
          longitude: returnHub.lon,
          travel_from: "Dharmasthala",
          travelLeg: {
            from: "Dharmasthala",
            to: `${actualReturnLocation} (Return)`,
            distanceKm: legStartToDharmasthala.distanceKm,
            driveHours: legStartToDharmasthala.driveHours,
            road_type: "highway"
          },
          morning: `Morning darshan at Dharmasthala. Check-out and begin return journey to ${actualReturnLocation} (~${legStartToDharmasthala.distanceKm} km).`,
          afternoon: `Highway drive with lunch stop.`,
          evening: `Safe return to ${actualReturnLocation}.`,
          overnight: `${actualReturnLocation} (Home)`,
          stay: `Return home to ${actualReturnLocation}`,
          destinationInfo: { whyVisit: `Return journey`, famousFor: [`Return`], mustVisit: [`Return`] },
          attractions: []
        }
      ];
      corridorLegs = [
        { legNumber: 1, ...legStartToDharmasthala, driveHours: legStartToDharmasthala.driveHours, distanceKm: legStartToDharmasthala.distanceKm },
        { legNumber: 2, from: "Dharmasthala", to: `${actualReturnLocation} (Return)`, distanceKm: legStartToDharmasthala.distanceKm, driveHours: legStartToDharmasthala.driveHours, road_type: "highway" }
      ];
    } else {
      // 2 Days
      const legKukkeReturn = await getRoadRouteWithCache("Kukke Subrahmanya", actualReturnLocation, 12.6644, 75.6144, returnHub.lat, returnHub.lon);
      dayItineraries = [
        day1,
        {
          dayNumber: 2,
          title: `Day 2 — Dharmasthala to Kukke Subrahmanya (Sacred Darshan)`,
          destination: "Kukke Subrahmanya",
          destinationSlug: "kukke-subrahmanya",
          taluk: "Kadaba Taluk",
          district: "Dakshina Kannada",
          region: "Coastal Karnataka (Karavali)",
          hierarchy: "Karnataka → Dakshina Kannada → Kadaba Taluk → Kukke Subrahmanya",
          dailyTravelDistance: 54,
          daily_distance_budget: {
            maxTravelKm: 54,
            dailyTravelDistance: 54,
            dailyDistanceKm: 54,
            idealTravelKm: 54,
            label: "Daily Travel Distance"
          },
          image: "images/destinations/kukke-subrahmanya.jpg",
          latitude: 12.6644,
          longitude: 75.6144,
          travel_from: "Dharmasthala",
          travelLeg: {
            from: "Dharmasthala",
            to: "Kukke Subrahmanya",
            distanceKm: 54,
            driveHours: 1.4,
            road_type: "state-highway / ghat"
          },
          morning: `Depart Dharmasthala. Travel to Kukke Subrahmanya (~54 km, ~1.4 hrs). Take holy snana in Kumaradhara River and darshan at Kukke Sri Subrahmanya Temple.`,
          afternoon: `Visit Biladvara Cave and Adi Subrahmanya Temple. Annadana lunch.`,
          evening: `Relaxing evening in Kukke foothills with peaceful temple chants. Overnight in Kukke.`,
          overnight: "Kukke Subrahmanya",
          stay: "Overnight stay in Kukke Subrahmanya (Kadaba Taluk, Dakshina Kannada)",
          destinationInfo: { whyVisit: kukkeDest.whyVisit, famousFor: ["Kukke Temple"], mustVisit: ["Kukke Subrahmanya Temple"] },
          attractions: [kukkeTempleAttr, biladvaraAttr]
        },
        {
          dayNumber: 3,
          title: `Day 3 — Kukke Subrahmanya to ${actualReturnLocation} (Return Journey)`,
          destination: actualReturnLocation,
          destinationSlug: returnHierarchy?.destinationSlug || "return-home",
          taluk: returnTaluk,
          district: returnDistrict,
          region: "Karnataka",
          hierarchy: `Karnataka → ${returnDistrict} → ${returnTaluk} → ${actualReturnLocation}`,
          dailyTravelDistance: legKukkeReturn.distanceKm,
          daily_distance_budget: {
            maxTravelKm: legKukkeReturn.distanceKm,
            dailyTravelDistance: legKukkeReturn.distanceKm,
            dailyDistanceKm: legKukkeReturn.distanceKm,
            idealTravelKm: legKukkeReturn.distanceKm,
            label: "Daily Travel Distance"
          },
          image: "images/destinations/kukke-subrahmanya.jpg",
          latitude: returnHub.lat,
          longitude: returnHub.lon,
          travel_from: "Kukke Subrahmanya",
          travelLeg: {
            from: "Kukke Subrahmanya",
            to: `${actualReturnLocation} (Return)`,
            distanceKm: legKukkeReturn.distanceKm,
            driveHours: legKukkeReturn.driveHours,
            road_type: "highway"
          },
          morning: `Breakfast in Kukke. Begin return journey to ${actualReturnLocation} (~${legKukkeReturn.distanceKm} km, ~${legKukkeReturn.driveHours} hrs).`,
          afternoon: `Highway drive with lunch stop.`,
          evening: `Safe return arrival in ${actualReturnLocation}.`,
          overnight: `${actualReturnLocation} (Home)`,
          stay: `Return home to ${actualReturnLocation}`,
          destinationInfo: { whyVisit: `Return journey`, famousFor: [`Return`], mustVisit: [`Return`] },
          attractions: []
        }
      ];
      corridorLegs = [
        { legNumber: 1, ...legStartToDharmasthala, driveHours: legStartToDharmasthala.driveHours, distanceKm: legStartToDharmasthala.distanceKm },
        { legNumber: 2, ...legDharmasthalaToKukke, driveHours: legDharmasthalaToKukke.driveHours, distanceKm: legDharmasthalaToKukke.distanceKm },
        { legNumber: 3, ...legKukkeReturn, driveHours: legKukkeReturn.driveHours, distanceKm: legKukkeReturn.distanceKm }
      ];
    }
  } else if (durationDays === 3) {
    dayItineraries = [day1, day2, day3For3DaysTrip, day4ReturnFor3DaysTrip];
    corridorLegs = [
      { legNumber: 1, ...legStartToDharmasthala, driveHours: legStartToDharmasthala.driveHours, distanceKm: legStartToDharmasthala.distanceKm },
      { legNumber: 2, ...legDharmasthalaToKukke, driveHours: legDharmasthalaToKukke.driveHours, distanceKm: legDharmasthalaToKukke.distanceKm },
      { legNumber: 3, ...legKukkeToMangalore, driveHours: legKukkeToMangalore.driveHours, distanceKm: legKukkeToMangalore.distanceKm },
      { legNumber: 4, ...legMangaloreToReturn, driveHours: legMangaloreToReturn.driveHours, distanceKm: legMangaloreToReturn.distanceKm }
    ];
  } else if (durationDays === 4) {
    dayItineraries = [day1, day2, day3For4PlusDays, day4For4DaysTrip, day5ReturnFor4DaysTrip];
    corridorLegs = [
      { legNumber: 1, ...legStartToDharmasthala, driveHours: legStartToDharmasthala.driveHours, distanceKm: legStartToDharmasthala.distanceKm },
      { legNumber: 2, ...legDharmasthalaToKukke, driveHours: legDharmasthalaToKukke.driveHours, distanceKm: legDharmasthalaToKukke.distanceKm },
      { legNumber: 3, ...legKukkeToMangalore, driveHours: legKukkeToMangalore.driveHours, distanceKm: legKukkeToMangalore.distanceKm },
      { legNumber: 4, ...legMangaloreToKateel, driveHours: legMangaloreToKateel.driveHours, distanceKm: legMangaloreToKateel.distanceKm },
      { legNumber: 5, ...legKateelToUdupi, driveHours: legKateelToUdupi.driveHours, distanceKm: legKateelToUdupi.distanceKm },
      { legNumber: 6, ...legUdupiToMurdeshwar, driveHours: legUdupiToMurdeshwar.driveHours, distanceKm: legUdupiToMurdeshwar.distanceKm },
      { legNumber: 7, ...legMurdeshwarToReturn, driveHours: legMurdeshwarToReturn.driveHours, distanceKm: legMurdeshwarToReturn.distanceKm }
    ];
  } else if (durationDays === 5) {
    dayItineraries = [day1, day2, day3For4PlusDays, day4For5PlusDays, day5For5PlusDays, day6ReturnFor5DaysTrip];
    corridorLegs = [
      { legNumber: 1, ...legStartToDharmasthala, driveHours: legStartToDharmasthala.driveHours, distanceKm: legStartToDharmasthala.distanceKm },
      { legNumber: 2, ...legDharmasthalaToKukke, driveHours: legDharmasthalaToKukke.driveHours, distanceKm: legDharmasthalaToKukke.distanceKm },
      { legNumber: 3, ...legKukkeToMangalore, driveHours: legKukkeToMangalore.driveHours, distanceKm: legKukkeToMangalore.distanceKm },
      { legNumber: 4, ...legMangaloreToKateel, driveHours: legMangaloreToKateel.driveHours, distanceKm: legMangaloreToKateel.distanceKm },
      { legNumber: 5, ...legKateelToUdupi, driveHours: legKateelToUdupi.driveHours, distanceKm: legKateelToUdupi.distanceKm },
      { legNumber: 6, ...legUdupiToMurdeshwar, driveHours: legUdupiToMurdeshwar.driveHours, distanceKm: legUdupiToMurdeshwar.distanceKm },
      { legNumber: 7, ...legMurdeshwarToHonnavar, driveHours: legMurdeshwarToHonnavar.driveHours, distanceKm: legMurdeshwarToHonnavar.distanceKm },
      { legNumber: 8, ...legHonnavarToGokarna, driveHours: legHonnavarToGokarna.driveHours, distanceKm: legHonnavarToGokarna.distanceKm },
      { legNumber: 9, ...legGokarnaToReturn, driveHours: legGokarnaToReturn.driveHours, distanceKm: legGokarnaToReturn.distanceKm }
    ];
  } else {
    // 6+ Days
    const day6Extended = {
      dayNumber: 6,
      title: `Day 6 — Gokarna Sacred Headlands, Mirjan Fort & Coastal Trails`,
      destination: "Gokarna",
      destinationSlug: "gokarna",
      taluk: "Kumta Taluk",
      district: "Uttara Kannada",
      region: "Coastal Karnataka (Karavali)",
      hierarchy: "Karnataka → Uttara Kannada → Kumta Taluk → Gokarna & Mirjan",
      dailyTravelDistance: 35,
      daily_distance_budget: {
        maxTravelKm: 35,
        dailyTravelDistance: 35,
        dailyDistanceKm: 35,
        idealTravelKm: 35,
        label: "Daily Travel Distance"
      },
      image: "images/destinations/gokarna.jpg",
      latitude: 14.5479,
      longitude: 74.3188,
      travel_from: "Gokarna",
      travelLeg: {
        from: "Gokarna",
        to: "Mirjan Fort & Coastal Headlands",
        distanceKm: 35,
        driveHours: 1.0,
        road_type: "coastal-nh66"
      },
      morning: `Explore Mirjan Fort (~22 km from Gokarna), a 16th-century historic laterite citadel with secret doors and mossy walls. Enjoy scenic rural vistas.`,
      afternoon: `Boat ride or hike to Half Moon Beach and Paradise Beach, secluded cliff-surrounded coves along the Arabian Sea. Coastal lunch at local beach cafe.`,
      evening: `Sunset meditation at Kudle Beach cliff top. Souvenir shopping in Gokarna temple bazaars and authentic vegetarian thali dinner. Stay overnight in Gokarna.`,
      overnight: "Gokarna",
      stay: "Overnight stay in Gokarna (Kumta Taluk, Uttara Kannada)",
      destinationInfo: {
        whyVisit: "Historic laterite fortress and secluded beach coves.",
        famousFor: ["Mirjan Fort", "Half Moon Beach", "Paradise Beach"],
        mustVisit: ["Mirjan Fort", "Half Moon Beach"]
      },
      attractions: [mahabaleshwarTempleAttr, omBeachAttr]
    };

    const day7Return = {
      ...day6ReturnFor5DaysTrip,
      dayNumber: 7,
      title: `Day 7 — Gokarna to ${actualReturnLocation} (Return Journey)`
    };

    dayItineraries = [day1, day2, day3For4PlusDays, day4For5PlusDays, day5For5PlusDays, day6Extended, day7Return];
    corridorLegs = [
      { legNumber: 1, ...legStartToDharmasthala, driveHours: legStartToDharmasthala.driveHours, distanceKm: legStartToDharmasthala.distanceKm },
      { legNumber: 2, ...legDharmasthalaToKukke, driveHours: legDharmasthalaToKukke.driveHours, distanceKm: legDharmasthalaToKukke.distanceKm },
      { legNumber: 3, ...legKukkeToMangalore, driveHours: legKukkeToMangalore.driveHours, distanceKm: legKukkeToMangalore.distanceKm },
      { legNumber: 4, ...legMangaloreToKateel, driveHours: legMangaloreToKateel.driveHours, distanceKm: legMangaloreToKateel.distanceKm },
      { legNumber: 5, ...legKateelToUdupi, driveHours: legKateelToUdupi.driveHours, distanceKm: legKateelToUdupi.distanceKm },
      { legNumber: 6, ...legUdupiToMurdeshwar, driveHours: legUdupiToMurdeshwar.driveHours, distanceKm: legUdupiToMurdeshwar.distanceKm },
      { legNumber: 7, ...legMurdeshwarToHonnavar, driveHours: legMurdeshwarToHonnavar.driveHours, distanceKm: legMurdeshwarToHonnavar.distanceKm },
      { legNumber: 8, ...legHonnavarToGokarna, driveHours: legHonnavarToGokarna.driveHours, distanceKm: legHonnavarToGokarna.distanceKm },
      { legNumber: 9, ...legGokarnaToReturn, driveHours: legGokarnaToReturn.driveHours, distanceKm: legGokarnaToReturn.distanceKm }
    ];
  }

  // Calculate totals across planned days
  const totalDistanceKm = dayItineraries.reduce((sum, d) => sum + (d.dailyTravelDistance || 0), 0);
  const totalDriveHours = Number(dayItineraries.reduce((sum, d) => sum + (d.travelLeg?.driveHours || 0), 0).toFixed(1));

  // Multi-stop Google Maps URL
  const originCoord = `${startHub.lat},${startHub.lon}`;
  const returnCoord = `${returnHub.lat},${returnHub.lon}`;
  const waypointCoords = selectedDestinations.map(d => `${d.latitude},${d.longitude}`).join("|");
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${returnCoord}&waypoints=${encodeURIComponent(waypointCoords)}&travelmode=driving`;

  // Budget Breakdown
  const budgetBreakdown = estimateBudget({
    totalDistanceKm,
    durationDays: dayItineraries.length,
    travelersCount,
    travelStyle,
    transportType: transport,
    tier: budget < durationDays * 2000 ? "budget" : budget > durationDays * 5000 ? "luxury" : "moderate",
    attractionCount: selectedDestinations.length * 2
  });

  const weather = await getDestinationWeather(12.9566, 75.3787, "Dharmasthala");
  const { provider } = getActiveAIProvider();

  const totalAttractionsCount = dayItineraries.reduce((sum, d) => sum + (d.attractions?.length || 0), 0);
  const recommendedOvernights = Array.from(new Set(
    dayItineraries.filter(d => !d.overnight.includes("Home")).map(d => d.overnight)
  ));

  const routeSummaryText = `${startingLocation} → ${selectedDestinations.map(d => d.name).join(" → ")} → ${actualReturnLocation}`;

  return {
    success: true,
    provider,
    mode: provider === "LOCAL_RAG_ENGINE" ? "DEMO/MOCK MODE (Local Grounded Engine)" : "LIVE CLOUD AI",
    trip_summary: {
      title: `Karnataka Spiritual Circuit: ${selectedDestinations.map(d => d.name).join(" → ")}`,
      duration: dayItineraries.length,
      durationDays: dayItineraries.length,
      explorationDays: durationDays,
      mode: planningMode,
      modeLabel,
      primary_destination: "Dharmasthala",
      primaryDestinationSlug: "dharmasthala",
      primary_district: "Dakshina Kannada",
      primary_taluk: "Belthangady Taluk",
      districts_covered: Array.from(new Set(dayItineraries.map(d => d.district).filter(Boolean))),
      taluks_covered: Array.from(new Set(dayItineraries.map(d => d.taluk).filter(Boolean))),
      geographic_hierarchy: {
        state: "Karnataka",
        region: "Coastal Karnataka (Karavali)",
        district: "Dakshina Kannada",
        taluk: "Belthangady Taluk"
      },
      region: "Coastal Karnataka (Karavali)",
      cluster: "coastal-karnataka",
      total_distance_km: totalDistanceKm,
      estimated_travel_hours: totalDriveHours,
      destinations_count: selectedDestinations.length,
      attractions_count: totalAttractionsCount,
      recommended_overnights: recommendedOvernights
    },
    summary: {
      title: `Karnataka Spiritual Circuit: ${selectedDestinations.map(d => d.name).join(" → ")}`,
      duration: `${dayItineraries.length} Days`,
      travelers: `${travelersCount} Traveler${travelersCount > 1 ? 's' : ''} (${travelWith})`,
      transport,
      travelStyle,
      estimatedDistance: `~${totalDistanceKm} km`,
      estimatedDriveHours: `~${totalDriveHours} hrs driving`,
      estimatedBudget: `₹${budgetBreakdown.totalEstimatedCost.toLocaleString('en-IN')}`,
      costPerPerson: `₹${budgetBreakdown.costPerPerson.toLocaleString('en-IN')}`,
      disclaimer: "Estimated costs — actual prices may vary.",
      routeSummary: routeSummaryText
    },
    days: dayItineraries,
    destinations: selectedDestinations.map(d => ({
      name: d.name,
      slug: d.slug,
      district: d.district,
      image: d.image,
      category: "Spiritual",
      whyVisit: d.whyVisit || d.shortDescription,
      famousFor: d.famousFor || (d.categories || []),
      bestNearbyPlaces: d.bestNearbyPlaces || [],
      categorizedPlaces: d.categorizedPlaces || {}
    })),
    travel_summary: {
      total_distance_km: totalDistanceKm,
      estimated_travel_hours: totalDriveHours,
      legs: corridorLegs
    },
    route: {
      googleMapsUrl,
      legs: corridorLegs,
      totalDistanceKm
    },
    budget: budgetBreakdown,
    weather: {
      destination: weather.destination,
      source: weather.source,
      factualWeather: weather.factualWeather,
      aiTravelNote: weather.aiTravelNote
    },
    spiritual_circuit: {
      available: true,
      isSpiritualTrip: true,
      destinations: selectedDestinations.map(d => d.slug)
    }
  };
}

// =========================================================================
// 3. AI TRIP PLANNER (DESTINATION-CLUSTERED, DISTANCE-AWARE ITINERARY)
// =========================================================================
async function generateTrip({
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
}) {
  const durationDays = Math.max(1, parseInt(days, 10) || 3);
  const travelersCount = Math.max(1, parseInt(travelers, 10) || 1);
  const totalBudget = Math.max(1000, parseInt(budget, 10) || 7000);
  const finalReturnLocation = returnLocation || startingLocation;

  // Normalize interests
  const interestList = Array.isArray(interests) ? interests : [interests].filter(Boolean);
  const isSpiritual = isSpiritualCircuit === true || 
    interestList.some(i => /spiritual|religious|temple/i.test(i)) && String(isSpiritualCircuit) !== "false";

  if (isSpiritual) {
    return await generateSpiritualTempleCircuitItinerary({
      startingLocation,
      returnLocation: finalReturnLocation,
      durationDays,
      budget: totalBudget,
      travelersCount,
      travelWith,
      transport,
      travelStyle,
      interests: interestList,
      primaryDestination
    });
  }

  // -------------------------------------------------------------------------
  // STEP 1: DESTINATION SELECTION BY DURATION & CLUSTER
  // -------------------------------------------------------------------------
  let selectedDestinations = [];
  let planningMode = "single_destination";
  let modeLabel = "Single-Destination Mode";
  let clusterName = "Karnataka Regional Corridor";
  let clusterSlug = "coastal-karnataka";

  // NORMAL DESTINATION TRIP LOGIC (District -> Taluk -> Destination)
  // 1. Resolve Geographic Hierarchy Anchor
    const geoAnchor = resolveLocationHierarchy(primaryDestination || startingLocation);
    let anchor = null;

    if (primaryDestination) {
      if (geoAnchor && geoAnchor.destinationSlug) {
        anchor = getDestinationBySlug(geoAnchor.destinationSlug);
      }
      if (!anchor) {
        anchor = getDestinationBySlug(primaryDestination);
      }
    }

    if (!anchor) {
      // Find candidate by interests and proximity to starting location
      const criteria = {
        origin: startingLocation,
        durationDays,
        categories: interestList,
        travelWith,
        rawQuery: interestList.join(" ")
      };
      const retrieved = retrieveRelevantDestinations(criteria, 1);
      if (retrieved.length > 0) {
        anchor = retrieved[0].destination;
      }
    }

    // Fallback anchor if still not resolved
    if (!anchor) {
      const kb = getKB();
      anchor = kb.destinations.find(d => d.slug === "coorg") || kb.destinations[0];
    }

    // Determine Anchor's Geographic Cluster and Taluk
    const clusters = findClustersForDestination(anchor.slug);
    const activeCluster = clusters[0] || getClusterBySlug("mysore-southern") || getClusters()[0];
    clusterName = activeCluster.name;
    clusterSlug = activeCluster.slug;

    // Apply strict trip duration hierarchy (Sections 1, 2, 3, 4, 12, 13, 14, 15)
    if (durationDays <= 2) {
      // 1–2 DAYS: SINGLE TALUK / LOCAL DESTINATION CLUSTER
      // Entire trip focuses on ONE primary taluk & destination, exploring local attractions
      selectedDestinations = [anchor];
      planningMode = "single_destination";
      modeLabel = "Single-Destination Taluk Mode (1–2 Days)";
    } else if (durationDays <= 4) {
      // 3–4 DAYS: PRIMARY TALUK + NEIGHBOURING DESTINATION MODE
      // One primary destination + AT MOST ONE geographically neighbouring destination in same/adjacent taluk
      const neighbours = getNeighbouringDestinations(anchor.slug, 1);
      selectedDestinations = [anchor, ...neighbours];
      planningMode = "primary_plus_neighbour";
      modeLabel = "Primary + Neighbouring Taluk Mode (3–4 Days)";
    } else if (durationDays <= 6) {
      // 5–6 DAYS: DISTRICT CLUSTER & REGIONAL CORRIDOR MODE
      // Multiple destinations within the SAME geographical corridor arranged in travel sequence
      selectedDestinations = getCorridorDestinations(activeCluster.slug, anchor.slug, startingLocation, durationDays);
      planningMode = "regional_circuit";
      modeLabel = "Regional Corridor Circuit Mode (5–6 Days)";
    } else {
      selectedDestinations = getCorridorDestinations(activeCluster.slug, anchor.slug, startingLocation, durationDays);
      planningMode = "multi_destination_road_trip";
      modeLabel = "Multi-District Road-Trip Mode (6+ Days)";
    }

  // Ensure we have at least one destination
  if (selectedDestinations.length === 0) {
    const kb = getKB();
    selectedDestinations = [kb.destinations[0]];
  }

  // -------------------------------------------------------------------------
  // STEP 2: DISTANCE-AWARE ROUTING & TRAVEL LEGS (TWO-STAGE + CACHED)
  // -------------------------------------------------------------------------
  const startHub = resolveStartingPoint(startingLocation);
  const returnHub = resolveStartingPoint(finalReturnLocation);
  const legs = [];
  let totalDistanceKm = 0;
  let prevLat = startHub.lat;
  let prevLon = startHub.lon;
  let prevName = startHub.name;

  // Leg to first destination with Route Caching
  const firstDest = selectedDestinations[0];
  const leg1 = await getRoadRouteWithCache(prevName, firstDest.name, prevLat, prevLon, firstDest.latitude, firstDest.longitude);
  legs.push({ legNumber: 1, ...leg1, driveHours: leg1.travel_hours, distanceKm: leg1.distance_km });
  totalDistanceKm += leg1.distance_km;
  prevLat = firstDest.latitude;
  prevLon = firstDest.longitude;
  prevName = firstDest.name;

  // Intermediate legs between destinations with Route Caching
  for (let i = 1; i < selectedDestinations.length; i++) {
    const curDest = selectedDestinations[i];
    const interLeg = await getRoadRouteWithCache(prevName, curDest.name, prevLat, prevLon, curDest.latitude, curDest.longitude);
    legs.push({ legNumber: legs.length + 1, ...interLeg, driveHours: interLeg.travel_hours, distanceKm: interLeg.distance_km });
    totalDistanceKm += interLeg.distance_km;
    prevLat = curDest.latitude;
    prevLon = curDest.longitude;
    prevName = curDest.name;
  }

  // Return leg back to return location
  const returnLeg = await getRoadRouteWithCache(prevName, `${returnHub.name} (Return)`, prevLat, prevLon, returnHub.lat, returnHub.lon);
  legs.push({ legNumber: legs.length + 1, ...returnLeg, driveHours: returnLeg.travel_hours, distanceKm: returnLeg.distance_km });
  totalDistanceKm += returnLeg.distance_km;

  const estimatedTravelHours = Number((totalDistanceKm / 50).toFixed(1));

  // Build Multi-Stop Google Maps Route URL
  let googleMapsUrl = "";
  if (selectedDestinations.length === 1) {
    googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startHub.lat},${startHub.lon}&destination=${selectedDestinations[0].latitude},${selectedDestinations[0].longitude}&travelmode=driving`;
  } else {
    const originStr = `${startHub.lat},${startHub.lon}`;
    const destinationStr = `${startHub.lat},${startHub.lon}`; // Round-trip
    const waypoints = selectedDestinations.map(d => `${d.latitude},${d.longitude}`).join("|");
    googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destinationStr}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`;
  }

  // -------------------------------------------------------------------------
  // STEP 3: DAY-BY-DAY GENERATION WITH ARRIVAL/DEPARTURE LOGIC
  // -------------------------------------------------------------------------
  const dayItineraries = [];
  const initialDriveKm = leg1.distanceKm;
  const isLongInitialDrive = initialDriveKm >= 220; // > 4.5 hours drive
  const returnDriveKm = returnLeg.distanceKm;
  const isLongReturnDrive = returnDriveKm >= 220;

  for (let d = 1; d <= durationDays; d++) {
    const isFirstDay = d === 1;
    const isFinalDay = d === durationDays;

    // Determine current destination for day d
    let currentDest = selectedDestinations[0];
    let fromLocationName = startingLocation;
    let travelLegToday = null;

    if (selectedDestinations.length === 1) {
      currentDest = selectedDestinations[0];
      fromLocationName = isFirstDay ? startingLocation : currentDest.name;
      if (isFirstDay) {
        travelLegToday = { from: startingLocation, to: currentDest.name, distanceKm: leg1.distanceKm, driveHours: leg1.driveHours };
      } else if (isFinalDay) {
        travelLegToday = { from: currentDest.name, to: `${startingLocation} (Return)`, distanceKm: returnLeg.distanceKm, driveHours: returnLeg.driveHours };
      }
    } else if (selectedDestinations.length === 2) {
      // 3 or 4 days split across 2 destinations
      const dest2 = selectedDestinations[1];
      const interLeg = legs.find(l => l.from === selectedDestinations[0].name && l.to === dest2.name) || legs[1];

      if (durationDays === 3) {
        // Day 1: Dest 1, Day 2: Dest 1 -> Dest 2, Day 3: Dest 2 -> Return
        if (d === 1) {
          currentDest = selectedDestinations[0];
          travelLegToday = { from: startingLocation, to: currentDest.name, distanceKm: leg1.distanceKm, driveHours: leg1.driveHours };
        } else if (d === 2) {
          currentDest = dest2;
          travelLegToday = { from: selectedDestinations[0].name, to: dest2.name, distanceKm: interLeg.distanceKm, driveHours: interLeg.driveHours };
        } else {
          currentDest = dest2;
          travelLegToday = { from: dest2.name, to: `${startingLocation} (Return)`, distanceKm: returnLeg.distanceKm, driveHours: returnLeg.driveHours };
        }
      } else {
        // 4 days: Days 1-2 in Dest 1, Days 3-4 in Dest 2
        if (d <= 2) {
          currentDest = selectedDestinations[0];
          if (d === 1) travelLegToday = { from: startingLocation, to: currentDest.name, distanceKm: leg1.distanceKm, driveHours: leg1.driveHours };
        } else {
          currentDest = dest2;
          if (d === 3) travelLegToday = { from: selectedDestinations[0].name, to: dest2.name, distanceKm: interLeg.distanceKm, driveHours: interLeg.driveHours };
          if (d === 4) travelLegToday = { from: dest2.name, to: `${startingLocation} (Return)`, distanceKm: returnLeg.distanceKm, driveHours: returnLeg.driveHours };
        }
      }
    } else {
      // Multi-destination corridor (5+ days)
      const destIndex = Math.min(Math.floor(((d - 1) / (durationDays - 1)) * selectedDestinations.length), selectedDestinations.length - 1);
      currentDest = selectedDestinations[destIndex];

      if (isFirstDay) {
        travelLegToday = { from: startingLocation, to: currentDest.name, distanceKm: leg1.distanceKm, driveHours: leg1.driveHours };
      } else if (isFinalDay) {
        travelLegToday = { from: currentDest.name, to: `${startingLocation} (Return)`, distanceKm: returnLeg.distanceKm, driveHours: returnLeg.driveHours };
      } else if (destIndex > 0 && selectedDestinations[destIndex - 1]) {
        const prev = selectedDestinations[destIndex - 1];
        if (prev.slug !== currentDest.slug) {
          const trans = estimateDrivingLeg(prev.latitude, prev.longitude, currentDest.latitude, currentDest.longitude, prev.name, currentDest.name);
          travelLegToday = { from: prev.name, to: currentDest.name, distanceKm: trans.distanceKm, driveHours: trans.driveHours };
        }
      }
    }

    // Filter and prioritize attractions based on user interests
    const attractionsPool = prioritizeAttractionsForInterests(currentDest.attractions || [], interestList, isSpiritual);

    // Section 8: ARRIVAL-DAY LOGIC
    let morningActivity = "";
    let afternoonActivity = "";
    let eveningActivity = "";

    if (isFirstDay) {
      if (isLongInitialDrive) {
        morningActivity = `Scenic morning drive from ${startingLocation} towards ${currentDest.name} (~${initialDriveKm} km / ${leg1.driveHours} hrs driving). Enjoy highway breakfast and scenic Western Ghats / expressway views.`;
        afternoonActivity = `Reach ${currentDest.name}, check-in at hotel/homestay, freshen up, and enjoy traditional lunch with local specialties.`;
        eveningActivity = attractionsPool[0]
          ? `Relaxed evening exploration of ${attractionsPool[0].name} (${attractionsPool[0].visitingHours || 'open evening'}) followed by sunset views and dinner.`
          : `Evening stroll around local town center and authentic local dinner.`;
      } else {
        morningActivity = attractionsPool[0]
          ? `Depart ${startingLocation} early. Arrive in ${currentDest.name} (~${initialDriveKm} km) and visit ${attractionsPool[0].name} (${attractionsPool[0].description}).`
          : `Morning drive from ${startingLocation} to ${currentDest.name} and hotel check-in.`;
        afternoonActivity = attractionsPool[1]
          ? `Explore ${attractionsPool[1].name} and relish authentic local ${currentDest.foodSpecialties?.[0] || 'cuisine'}.`
          : `Afternoon relaxation and local market walk.`;
        eveningActivity = attractionsPool[2]
          ? `Sunset visit at ${attractionsPool[2].name} followed by evening local dinner.`
          : `Evening sunset viewpoint and warm filter coffee at local homestay.`;
      }
    } else if (isFinalDay) {
      // Section 9: DEPARTURE-DAY LOGIC
      if (isLongReturnDrive) {
        morningActivity = attractionsPool[0]
          ? `Early morning visit to ${attractionsPool[0].name} (${attractionsPool[0].visitingHours || 'early morning hours'}) before the day gets warm.`
          : `Morning nature walk, breakfast, and souvenir shopping.`;
        afternoonActivity = `Check out and begin return journey towards ${startingLocation} (~${returnDriveKm} km / ${returnLeg.driveHours} hrs driving). Stop for lunch along the scenic highway.`;
        eveningActivity = `Highway sunset tea break and safe return arrival in ${startingLocation}.`;
      } else {
        morningActivity = attractionsPool[0]
          ? `Visit ${attractionsPool[0].name} and capture final morning photos.`
          : `Morning sightseeing and souvenir shopping.`;
        afternoonActivity = attractionsPool[1]
          ? `Visit ${attractionsPool[1].name} followed by traditional lunch.`
          : `Afternoon local food experience.`;
        eveningActivity = `Commence comfortable return drive to ${startingLocation}.`;
      }
    } else {
      // INTERMEDIATE DAYS
      if (selectedDestinations.length === 1) {
        // Single Destination Day 2: Explore surrounding/nearby attractions
        const nearby = currentDest.bestNearbyPlaces || [];
        morningActivity = attractionsPool[1]
          ? `Explore ${attractionsPool[1].name} (${attractionsPool[1].description}) in the pleasant morning hours.`
          : `Morning visit to nearby sights around ${currentDest.name}.`;
        afternoonActivity = attractionsPool[2]
          ? `Visit ${attractionsPool[2].name} and enjoy authentic ${currentDest.foodSpecialties?.[0] || 'delicacies'}.`
          : `Afternoon estate walk / cultural craft center.`;
        eveningActivity = nearby[0]
          ? `Excursion to ${nearby[0].name} (${nearby[0].distance}) for sunset views and dinner.`
          : `Evening temple visit or scenic viewpoint followed by relaxing dinner.`;
      } else {
        // Multi-destination progression
        morningActivity = attractionsPool[0]
          ? `Morning exploration of ${attractionsPool[0].name} (${attractionsPool[0].description}).`
          : `Morning exploration in ${currentDest.name}.`;
        afternoonActivity = travelLegToday && travelLegToday.distanceKm > 0 && travelLegToday.from !== travelLegToday.to
          ? `Travel from ${travelLegToday.from} to ${travelLegToday.to} (~${travelLegToday.distanceKm} km, ~${travelLegToday.driveHours} hrs) through scenic corridors. Lunch en route.`
          : attractionsPool[1]
            ? `Visit ${attractionsPool[1].name} and savor local flavors.`
            : `Afternoon relaxation and local sights.`;
        eveningActivity = attractionsPool[2]
          ? `Sunset at ${attractionsPool[2].name} and authentic dinner.`
          : `Evening sunset viewpoint and local dinner in ${currentDest.name}.`;
      }
    }

    const destGeo = resolveLocationHierarchy(currentDest.slug) || resolveLocationHierarchy(currentDest.name);
    const talukName = destGeo?.taluk?.name ? `${destGeo.taluk.name} Taluk` : `${currentDest.district} District`;
    const districtName = destGeo?.district?.name || currentDest.district;
    const regionName = destGeo?.region?.name || clusterName;
    const hierarchyBreadcrumb = `Karnataka → ${districtName} → ${talukName} → ${currentDest.name}`;
    const dayDistanceKm = travelLegToday ? travelLegToday.distanceKm : (isFirstDay ? leg1.distanceKm : (isFinalDay ? returnLeg.distanceKm : 25));
    const dailyBudget = getDailyDistanceBudget(d, durationDays, isFirstDay || isFinalDay, dayDistanceKm);
    const overnightLocation = isFinalDay ? `${finalReturnLocation} (Home)` : currentDest.name;

    dayItineraries.push({
      dayNumber: d,
      title: isFirstDay
        ? `Day 1 — ${startingLocation} to ${currentDest.name}`
        : isFinalDay
          ? `Day ${d} — ${currentDest.name} to ${finalReturnLocation}`
          : `Day ${d} — Exploring ${currentDest.name}`,
      destination: currentDest.name,
      destinationSlug: currentDest.slug,
      taluk: talukName,
      district: districtName,
      region: regionName,
      hierarchy: hierarchyBreadcrumb,
      dailyTravelDistance: dayDistanceKm,
      daily_distance_budget: dailyBudget,
      image: currentDest.image,
      latitude: currentDest.latitude,
      longitude: currentDest.longitude,
      travel_from: fromLocationName,
      travelLeg: travelLegToday,
      morning: morningActivity,
      afternoon: afternoonActivity,
      evening: eveningActivity,
      overnight: overnightLocation,
      stay: isFinalDay ? `Return home to ${finalReturnLocation}` : `Overnight stay in ${currentDest.name} (${talukName}, ${districtName})`,
      destinationInfo: {
        whyVisit: currentDest.whyVisit || currentDest.shortDescription,
        famousFor: currentDest.famousFor || (currentDest.categories || []).slice(0, 4),
        mustVisit: (currentDest.attractions || []).slice(0, 3).map(a => a.name)
      },
      attractions: attractionsPool.slice(0, 3).map(a => {
        const attrGeo = getAttractionHierarchy(a.name) || destGeo;
        return {
          name: a.name,
          category: a.category || "Attraction",
          visitingHours: a.visitingHours || "Regular hours",
          description: a.description,
          image: a.image,
          taluk: attrGeo?.taluk?.name ? `${attrGeo.taluk.name} Taluk` : talukName,
          district: attrGeo?.district?.name || districtName
        };
      })
    });
  }

  // -------------------------------------------------------------------------
  // STEP 4: BUDGET & WEATHER ESTIMATION
  // -------------------------------------------------------------------------
  const budgetBreakdown = estimateBudget({
    totalDistanceKm,
    durationDays,
    travelersCount,
    travelStyle,
    transportType: transport,
    tier: totalBudget < durationDays * 2000 ? "budget" : totalBudget > durationDays * 5000 ? "luxury" : "moderate",
    attractionCount: selectedDestinations.length * 2
  });

  const weather = await getDestinationWeather(firstDest.latitude, firstDest.longitude, firstDest.name);

  // Recommended overnight stays
  const recommendedOvernights = Array.from(new Set(
    dayItineraries.filter(d => !d.overnight.includes("Home")).map(d => d.overnight)
  ));

  const totalAttractionsCount = dayItineraries.reduce((sum, d) => sum + (d.attractions?.length || 0), 0);

  const { provider } = getActiveAIProvider();

  // -------------------------------------------------------------------------
  // STEP 5: FINAL STRUCTURED OUTPUT (Section 18, 19, 20)
  // -------------------------------------------------------------------------
  return {
    success: true,
    provider,
    mode: provider === "LOCAL_RAG_ENGINE" ? "DEMO/MOCK MODE (Local Grounded Engine)" : "LIVE CLOUD AI",
    trip_summary: {
      title: isSpiritual
        ? `Karnataka Spiritual Circuit: ${selectedDestinations.map(d => d.name).join(" → ")}`
        : `${selectedDestinations.map(d => d.name).join(" & ")} Journey`,
      duration: durationDays,
      durationDays,
      mode: planningMode,
      modeLabel,
      primary_destination: selectedDestinations[0].name,
      primaryDestinationSlug: selectedDestinations[0].slug,
      primary_district: selectedDestinations[0].district,
      primary_taluk: resolveLocationHierarchy(selectedDestinations[0].slug)?.taluk?.name ? `${resolveLocationHierarchy(selectedDestinations[0].slug).taluk.name} Taluk` : `${selectedDestinations[0].district}`,
      districts_covered: Array.from(new Set(selectedDestinations.map(d => resolveLocationHierarchy(d.slug)?.district?.name || d.district))),
      taluks_covered: Array.from(new Set(selectedDestinations.map(d => resolveLocationHierarchy(d.slug)?.taluk?.name).filter(Boolean))),
      geographic_hierarchy: {
        state: "Karnataka",
        region: clusterName,
        district: selectedDestinations[0].district,
        taluk: resolveLocationHierarchy(selectedDestinations[0].slug)?.taluk?.name ? `${resolveLocationHierarchy(selectedDestinations[0].slug).taluk.name} Taluk` : selectedDestinations[0].district
      },
      region: clusterName,
      cluster: clusterSlug,
      total_distance_km: totalDistanceKm,
      estimated_travel_hours: estimatedTravelHours,
      destinations_count: selectedDestinations.length,
      attractions_count: totalAttractionsCount,
      recommended_overnights: recommendedOvernights
    },
    summary: {
      title: isSpiritual
        ? `Karnataka Spiritual Circuit: ${selectedDestinations.map(d => d.name).join(" → ")}`
        : `${startingLocation} to ${selectedDestinations.map(d => d.name).join(" & ")} Journey`,
      duration: `${durationDays} Days`,
      travelers: `${travelersCount} Traveler${travelersCount > 1 ? 's' : ''} (${travelWith})`,
      transport,
      travelStyle,
      estimatedDistance: `~${totalDistanceKm} km`,
      estimatedDriveHours: `~${estimatedTravelHours} hrs driving`,
      estimatedBudget: `₹${budgetBreakdown.totalEstimatedCost.toLocaleString('en-IN')}`,
      costPerPerson: `₹${budgetBreakdown.costPerPerson.toLocaleString('en-IN')}`,
      disclaimer: "Estimated costs — actual prices may vary.",
      routeSummary: `${startingLocation} → ${selectedDestinations.map(d => d.name).join(" → ")} → ${startingLocation}`
    },
    days: dayItineraries,
    destinations: selectedDestinations.map(d => ({
      name: d.name,
      slug: d.slug,
      district: d.district,
      image: d.image,
      category: d.categories?.[0] || d.category || "Heritage",
      whyVisit: d.whyVisit || d.shortDescription,
      famousFor: d.famousFor || (d.categories || []),
      bestNearbyPlaces: d.bestNearbyPlaces || [],
      categorizedPlaces: d.categorizedPlaces || {}
    })),
    travel_summary: {
      total_distance_km: totalDistanceKm,
      estimated_travel_hours: estimatedTravelHours,
      legs
    },
    route: {
      googleMapsUrl,
      legs,
      totalDistanceKm
    },
    budget: budgetBreakdown,
    weather: {
      destination: weather.destination,
      source: weather.source,
      factualWeather: weather.factualWeather,
      aiTravelNote: weather.aiTravelNote
    },
    spiritual_circuit: {
      available: true,
      isSpiritualTrip: isSpiritual,
      destinations: ["dharmasthala", "kukke-subrahmanya", "mangalore", "udupi", "murudeshwar", "gokarna"]
    }
  };
}

/**
 * Prioritizes attractions based on user interests
 */
function prioritizeAttractionsForInterests(attractions = [], interests = [], isSpiritual = false) {
  if (!attractions || attractions.length === 0) return [];
  const list = [...attractions];

  const hasInterest = (category, regex) => regex.test(category);

  list.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    const catA = (a.category || "").toLowerCase();
    const catB = (b.category || "").toLowerCase();
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();

    if (isSpiritual) {
      if (hasInterest(catA, /spiritual|temple|shiva|devi|subrahmanya|krishna/)) scoreA += 50;
      if (hasInterest(catB, /spiritual|temple|shiva|devi|subrahmanya|krishna/)) scoreB += 50;
    }

    interests.forEach(i => {
      const lower = i.toLowerCase();
      if (lower.includes("spiritual") || lower.includes("religious") || lower.includes("temple")) {
        if (hasInterest(catA, /spiritual|temple/)) scoreA += 30;
        if (hasInterest(catB, /spiritual|temple/)) scoreB += 30;
      }
      if (lower.includes("beach")) {
        if (hasInterest(catA, /beach|coast|sea|island/)) scoreA += 30;
        if (hasInterest(catB, /beach|coast|sea|island/)) scoreB += 30;
      }
      if (lower.includes("nature") || lower.includes("waterfall") || lower.includes("hill")) {
        if (hasInterest(catA, /nature|waterfall|peak|viewpoint|coffee/)) scoreA += 30;
        if (hasInterest(catB, /nature|waterfall|peak|viewpoint|coffee/)) scoreB += 30;
      }
      if (lower.includes("heritage") || lower.includes("history")) {
        if (hasInterest(catA, /heritage|historical|palace|fort|museum/)) scoreA += 30;
        if (hasInterest(catB, /heritage|historical|palace|fort|museum/)) scoreB += 30;
      }
      if (lower.includes("adventure") || lower.includes("wildlife")) {
        if (hasInterest(catA, /adventure|wildlife|safari|scuba|rafting|trek/)) scoreA += 30;
        if (hasInterest(catB, /adventure|wildlife|safari|scuba|rafting|trek/)) scoreB += 30;
      }
    });

    return scoreB - scoreA;
  });

  return list;
}

// =========================================================================
// 3. AI NATURAL-LANGUAGE DESTINATION SEARCH
// =========================================================================
async function parseTravelSearch({ query = "" }) {
  if (!query || query.trim().length === 0) {
    return { success: false, error: "Search query is empty" };
  }

  const structuredFilters = parseNaturalLanguageQuery(query);
  const relevantResults = retrieveRelevantDestinations(structuredFilters, 6);

  return {
    success: true,
    query,
    filters: structuredFilters,
    resultsCount: relevantResults.length,
    results: relevantResults.map(r => ({
      destination: r.destination,
      distanceFromOrigin: r.distanceFromOrigin,
      matchScore: r.score,
      reasons: r.reasons
    }))
  };
}

// =========================================================================
// 4. AI TRAVEL DIARY GENERATOR
// =========================================================================
async function generateDiary({
  destination = "Coorg",
  visitDate = new Date().toISOString().split("T")[0],
  notes = "",
  highlights = "",
  mood = "Inspired",
  photo = "",
  style = "Storytelling",
  previousDraft = "",
  action = "generate"
}) {
  const kb = getKB();
  const destRecord = kb.destinations.find(d =>
    d.name.toLowerCase().includes(destination.toLowerCase()) ||
    d.slug.toLowerCase().includes(destination.toLowerCase())
  ) || {
    name: destination,
    district: "Karnataka",
    foodSpecialties: ["Filter Coffee", "Local Thali"]
  };

  const { provider } = getActiveAIProvider();
  let generatedTitle = "";
  let generatedContent = "";

  if (provider !== "LOCAL_RAG_ENGINE") {
    const prompt = `Write a travel diary entry based on the user's travel notes:
Destination: ${destRecord.name}, ${destRecord.district}
Date: ${visitDate}
User Notes: ${notes}
Highlights: ${highlights}
Mood: ${mood}
Style: ${style}
${previousDraft ? `Previous Draft to adjust (${action}): "${previousDraft}"` : ""}

Generate:
1. Title: An evocative headline (under 12 words).
2. Diary Story: Written in the ${style} tone. 2-3 paragraphs. Vivid sensory details of Karnataka's landscape, aromas, and moments.`;

    const cloudRes = await callExternalLLM(prompt, "You are a poetic, authentic travel writer specializing in Karnataka journeys.");
    if (cloudRes) {
      const parts = cloudRes.split("\n\n");
      generatedTitle = parts[0]?.replace(/^Title:\s*/i, '').replace(/[*#]/g, '').trim();
      generatedContent = parts.slice(1).join("\n\n").trim();
    }
  }

  if (!generatedContent) {
    const localResult = generateLocalDiaryDraft({
      destRecord,
      visitDate,
      notes,
      highlights,
      mood,
      style,
      action,
      previousDraft
    });
    generatedTitle = localResult.title;
    generatedContent = localResult.content;
  }

  return {
    success: true,
    provider,
    mode: provider === "LOCAL_RAG_ENGINE" ? "DEMO/MOCK MODE (Local Grounded Writer)" : "LIVE CLOUD AI",
    editable: true,
    title: generatedTitle,
    content: generatedContent,
    destination: destRecord.name,
    visitDate,
    style,
    image: photo || destRecord.image || "images/hero/karnataka-hero.jpg"
  };
}

function generateLocalDiaryDraft({ destRecord, visitDate, notes, highlights, mood, style, action, previousDraft }) {
  const dName = destRecord.name;
  const food = destRecord.foodSpecialties?.[0] || "steaming filter coffee";
  const userNotes = notes ? ` ${notes}` : ` We spent unforgettable hours soaking in the atmosphere of ${dName}.`;

  let title = `A Journey Through ${dName}: Reflections & Memories`;
  let content = "";

  if (style === "Short" || action === "make_shorter") {
    title = `Moments in ${dName}`;
    content = `Visiting ${dName} was truly ${mood.toLowerCase()}.${userNotes} The mist rolling over the hills and the fragrance of ${food} made this day unforgettable. Karnataka has a way of staying in your heart long after the journey ends.`;
  } else if (style === "Photo Caption") {
    title = `Postcard from ${dName}`;
    content = `Somewhere between the historic stone carvings and the scent of ${food} in ${dName}. Feeling ${mood.toLowerCase()} on the road across Karnataka. 🌿✨ #KarnatakaDiaries #${destRecord.slug}`;
  } else if (style === "Casual") {
    title = `Weekend Escapade in ${dName}`;
    content = `Packed our bags for a quick getaway to ${dName}, and it turned out to be exactly what we needed!${userNotes} From early morning viewpoints to winding ghats and sharing plates of ${food}, every hour was filled with laughs and scenic road trip tunes.`;
  } else {
    title = `Monsoon Whispers & Golden Memories in ${dName}`;
    content = `There is an undeniable charm to ${dName} that greets you the moment you arrive. The air feels lighter, carried by a gentle breeze over the ${destRecord.district} landscape.${userNotes}

${highlights ? `One of the most vivid highlights was ${highlights}. ` : ''}We paused for a quiet break to savor authentic ${food}, letting the warmth of local hospitality settle into the evening.

As dusk fell across Karnataka, the horizons melted into shades of deep amber and violet. It is journeys like this that remind us why we travel — not merely to see new places, but to be gently transformed by them.`;
  }

  return { title, content };
}

// =========================================================================
// 5. AI PACKING ASSISTANT
// =========================================================================
async function generatePackingList({
  destination = "Coorg",
  durationDays = 3,
  season = "Winter",
  activities = ["Trekking", "Photography"]
}) {
  const days = Math.max(1, parseInt(durationDays, 10) || 3);
  const isRainy = /monsoon|rain|july|august|september/i.test(season);
  const isHighland = /coorg|chikmagalur|sakleshpur|kudremukh|kemmangundi|nandi/i.test(destination);
  const isCoastal = /gokarna|udupi|mangalore|murudeshwar|honnavar|karwar/i.test(destination);

  const checklist = [
    {
      category: "Clothing & Footwear",
      items: [
        { item: `${days + 1} sets of breathable cotton clothing`, checked: false },
        { item: "Sturdy walking/trekking shoes with grip", checked: false },
        { item: "Flip-flops / sandals for homestays or beach shores", checked: false },
        ...(isHighland ? [{ item: "Light fleece jacket / sweater for chilly highland evenings", checked: false }] : []),
        ...(isCoastal ? [{ item: "Swimwear / UV-protective sun shirts", checked: false }] : [])
      ]
    },
    {
      category: "Weather & Outdoor Protection",
      items: [
        ...(isRainy ? [
          { item: "Compact waterproof umbrella / raincoat", checked: false },
          { item: "Dry bag / zip-lock pouches for phone & electronics", checked: false },
          { item: "Leech socks (if trekking Western Ghats forests during monsoon)", checked: false }
        ] : []),
        { item: "Broad-brim sun hat & UV sunglasses", checked: false },
        { item: "SPF 50+ Sunscreen & lip balm", checked: false },
        { item: "Natural insect / mosquito repellent spray", checked: false }
      ]
    },
    {
      category: "Tech & Travel Essentials",
      items: [
        { item: "10,000+ mAh Power bank for ghat road navigation", checked: false },
        { item: "Camera / extra memory cards for scenic vistas", checked: false },
        { item: "Offline downloaded Google Maps of destination", checked: false },
        { item: "Fast-charging car adapter", checked: false }
      ]
    },
    {
      category: "Health & Toiletries",
      items: [
        { item: "Personal first-aid kit (bandages, antiseptic, ORS)", checked: false },
        { item: "Motion sickness tablets (for ghat hairpin bends)", checked: false },
        { item: "Reusable BPA-free insulated water bottle", checked: false },
        { item: "Hand sanitizer & wet wipes", checked: false }
      ]
    }
  ];

  return {
    success: true,
    destination,
    durationDays: days,
    season,
    activities,
    packingCategories: checklist
  };
}

module.exports = {
  getActiveAIProvider,
  chat,
  generateTrip,
  parseTravelSearch,
  generateDiary,
  generatePackingList,
  optimizeBudget: makeTripCheaper
};
