/**
 * Karnataka Travel Diaries - Geographic Routing Layer (District -> Taluk -> Destination -> Attraction)
 *
 * Implements:
 * 1. 31 Karnataka Districts & Taluks Hierarchy
 * 2. Location Name Normalization (e.g. Mangalore -> mangaluru, Bangalore -> bengaluru)
 * 3. Taluk Neighbor & Proximity Graph (Directly Neighbouring vs Nearby vs Regional Corridor)
 * 4. Two-Stage Distance Calculation (Stage 1: Geo Filter -> Stage 2: Road Route)
 * 5. Route Caching (SQLite prisma.routeCache & in-memory LRU)
 * 6. Daily Travel Distance Budget & Anti-Backtracking Scoring
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { estimateDrivingLeg, haversineDistance } = require('./routeOptimizer');

const prisma = new PrismaClient();

// Load geo-hierarchy JSON once
let geoData = null;
function loadGeoData() {
  if (!geoData) {
    try {
      const dataPath = path.join(__dirname, '..', '..', 'data', 'karnataka-geo-hierarchy.json');
      if (fs.existsSync(dataPath)) {
        geoData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      }
    } catch (e) {
      console.warn("Failed to load karnataka-geo-hierarchy.json:", e.message);
    }
  }
  return geoData;
}

// In-memory route cache fallback
const memoryRouteCache = new Map();

/**
 * 1. Normalize Location Name
 */
function normalizeLocationName(name) {
  if (!name || typeof name !== 'string') return '';
  let str = name.toLowerCase().trim()
    .replace(/[,\-_.]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b(district|taluk|taluka|city|town|region|karnataka|temple|shrine|mutt|matha|beach|swamy)\b/g, '')
    .trim();

  const data = loadGeoData();
  if (data && data.locationAliases && data.locationAliases[str]) {
    return data.locationAliases[str];
  }

  // Common heuristics
  if (str.includes('kateel')) return 'kateel';
  if (str.includes('mangalor') || str.includes('mangaluru')) return 'mangaluru';
  if (str.includes('bangalor') || str.includes('bengaluru')) return 'bengaluru';
  if (str.includes('coorg') || str.includes('kodagu') || str.includes('madikeri')) return 'madikeri';
  if (str.includes('chikmagalur') || str.includes('chikkamagaluru')) return 'chikkamagaluru';
  if (str.includes('mysore') || str.includes('mysuru')) return 'mysuru';
  if (str.includes('udupi')) return 'udupi';
  if (str.includes('dharmasthala')) return 'dharmasthala';
  if (str.includes('kukke') || str.includes('subrahmanya')) return 'kukke';
  if (str.includes('murudeshwar') || str.includes('murdeshwar')) return 'murudeshwar';
  if (str.includes('honnavar')) return 'honnavar';
  if (str.includes('gokarna')) return 'gokarna';
  if (str.includes('hampi')) return 'hosapete';
  if (str.includes('badami')) return 'badami';
  if (str.includes('sringeri')) return 'sringeri';
  if (str.includes('sakleshpur')) return 'sakleshpur';
  if (str.includes('jog falls') || str.includes('sagara')) return 'sagara';
  if (str.includes('karwar')) return 'karwar';
  if (str.includes('belagavi') || str.includes('belgaum')) return 'belagavi';
  if (str.includes('hubballi') || str.includes('hubli')) return 'hubballi';
  if (str.includes('dharwad')) return 'dharwad';
  if (str.includes('shivamogga') || str.includes('shimoga')) return 'shivamogga';
  if (str.includes('hassan')) return 'hassan';

  return str;
}

/**
 * 2. Resolve Complete Location Hierarchy
 * Returns { district, taluk, destinationSlug, region, latitude, longitude, cityName, talukName, districtName, hierarchy }
 */
function resolveLocationHierarchy(input) {
  const data = loadGeoData();
  if (!data) return null;

  const normalized = normalizeLocationName(input);

  // Check if it's a known taluk
  let taluk = data.taluks.find(t => t.id === normalized || t.normalizedName === normalized);
  if (!taluk) {
    taluk = data.taluks.find(t => t.name.toLowerCase().includes(normalized) || normalized.includes(t.id));
  }

  // Check destination mapping if not found
  let destSlug = null;
  if (!taluk) {
    for (const [slug, map] of Object.entries(data.destinationTalukMapping)) {
      if (slug === normalized || slug.replace('-', ' ') === normalized) {
        destSlug = slug;
        taluk = data.taluks.find(t => t.id === map.talukId);
        break;
      }
    }
  }

  // Check city mapping
  if (!taluk && data.cityTalukMapping) {
    for (const [cityKey, map] of Object.entries(data.cityTalukMapping)) {
      if (cityKey === normalized || cityKey.toLowerCase().includes(normalized) || normalized.includes(cityKey)) {
        taluk = data.taluks.find(t => t.id === map.talukId);
        if (map.type === 'destination') destSlug = cityKey;
        break;
      }
    }
  }

  // Check if input is an attraction
  if (!taluk && data.attractionTalukMapping) {
    for (const [attrName, map] of Object.entries(data.attractionTalukMapping)) {
      if (attrName.toLowerCase().includes(normalized) || normalized.includes(attrName.toLowerCase())) {
        taluk = data.taluks.find(t => t.id === map.talukId);
        destSlug = map.destinationSlug;
        break;
      }
    }
  }

  // Fallback to district if still not found
  let district = null;
  if (taluk) {
    district = data.districts.find(d => d.id === taluk.districtId);
  } else {
    district = data.districts.find(d => d.id === normalized || d.normalizedName === normalized);
    if (district) {
      taluk = data.taluks.filter(t => t.districtId === district.id)
        .sort((a, b) => b.priorityForTravelClustering - a.priorityForTravelClustering)[0];
    }
  }

  if (!taluk && !district) {
    // Check specific popular towns
    if (normalized === 'dharmasthala') {
      taluk = data.taluks.find(t => t.id === 'belathangadi');
      district = data.districts.find(d => d.id === 'dakshina-kannada');
      destSlug = 'dharmasthala';
    } else if (normalized === 'kukke') {
      taluk = data.taluks.find(t => t.id === 'kadaba');
      district = data.districts.find(d => d.id === 'dakshina-kannada');
      destSlug = 'kukke-subrahmanya';
    } else if (normalized === 'murudeshwar') {
      taluk = data.taluks.find(t => t.id === 'bhatkal');
      district = data.districts.find(d => d.id === 'uttara-kannada');
      destSlug = 'murudeshwar';
    } else if (normalized === 'gokarna') {
      taluk = data.taluks.find(t => t.id === 'kumta');
      district = data.districts.find(d => d.id === 'uttara-kannada');
      destSlug = 'gokarna';
    } else if (normalized === 'kateel') {
      taluk = data.taluks.find(t => t.id === 'mangaluru');
      district = data.districts.find(d => d.id === 'dakshina-kannada');
      destSlug = 'mangalore';
    }
  }

  if (!taluk && !district) {
    taluk = data.taluks.find(t => t.id === 'bengaluru-north') || data.taluks[0];
    district = data.districts.find(d => d.id === taluk.districtId);
  }

  if (taluk && !district) {
    district = data.districts.find(d => d.id === taluk.districtId);
  }

  if (!destSlug && taluk) {
    for (const [slug, map] of Object.entries(data.destinationTalukMapping)) {
      if (map.talukId === taluk.id) {
        destSlug = slug;
        break;
      }
    }
  }

  const region = data.regions.find(r => r.id === (taluk ? taluk.region : district?.region)) || data.regions[0];
  const latitude = taluk?.latitude || district?.latitude || 12.9716;
  const longitude = taluk?.longitude || district?.longitude || 77.5946;
  const talukName = taluk?.name ? `${taluk.name} Taluk` : (district?.name ? `${district.name} District` : 'Karnataka');
  const districtName = district?.name || 'Karnataka';
  const cityName = taluk?.name || district?.name || input;

  return {
    rawInput: input,
    normalized,
    destinationSlug: destSlug,
    taluk,
    district,
    region,
    latitude,
    longitude,
    talukName,
    districtName,
    cityName,
    hierarchy: `Karnataka → ${districtName} → ${talukName} → ${cityName}`
  };
}

/**
 * 3. Get Taluk Relationships
 * Directly neighbouring vs Nearby vs Corridor
 */
function getTalukRelationships(talukId) {
  const data = loadGeoData();
  if (!data) return { direct: [], nearby: [], districtOthers: [] };

  const taluk = data.taluks.find(t => t.id === talukId);
  if (!taluk) return { direct: [], nearby: [], districtOthers: [] };

  const direct = (taluk.neighbouringTaluks || []).map(id => data.taluks.find(t => t.id === id)).filter(Boolean);
  const nearby = (taluk.nearbyTaluks || []).map(id => data.taluks.find(t => t.id === id)).filter(Boolean);
  const districtOthers = data.taluks.filter(t => t.districtId === taluk.districtId && t.id !== taluk.id);

  return { direct, nearby, districtOthers };
}

/**
 * 4. Attraction Hierarchy (Attraction -> Destination -> Taluk -> District -> Region)
 */
function getAttractionHierarchy(attractionName) {
  const data = loadGeoData();
  if (!data) return null;

  let mapping = data.attractionTalukMapping[attractionName];
  if (!mapping) {
    // Try case-insensitive lookup
    for (const [name, meta] of Object.entries(data.attractionTalukMapping)) {
      if (name.toLowerCase() === attractionName.toLowerCase()) {
        mapping = meta;
        break;
      }
    }
  }

  if (mapping) {
    const taluk = data.taluks.find(t => t.id === mapping.talukId);
    const district = taluk ? data.districts.find(d => d.id === taluk.districtId) : null;
    const region = taluk ? data.regions.find(r => r.id === taluk.region) : null;
    return {
      attraction: attractionName,
      destinationSlug: mapping.destinationSlug,
      taluk,
      district,
      region
    };
  }

  return null;
}

// Verified road driving distances across Karnataka corridors (National & State Highways)
const VERIFIED_ROAD_DISTANCES = {
  // Coastal Spiritual Corridor segments
  "dharmasthala:kukke": { distanceKm: 54, driveHours: 1.4, roadType: "state-highway / ghat" },
  "belathangadi:kadaba": { distanceKm: 54, driveHours: 1.4, roadType: "state-highway / ghat" },
  "dharmasthala:kadaba": { distanceKm: 54, driveHours: 1.4, roadType: "state-highway / ghat" },
  "kukke:mangaluru": { distanceKm: 105, driveHours: 2.5, roadType: "highway" },
  "kadaba:mangaluru": { distanceKm: 105, driveHours: 2.5, roadType: "highway" },
  "mangaluru:kateel": { distanceKm: 26, driveHours: 0.8, roadType: "state-highway" },
  "kateel:udupi": { distanceKm: 42, driveHours: 1.0, roadType: "coastal-nh66" },
  "mangaluru:udupi": { distanceKm: 55, driveHours: 1.2, roadType: "coastal-nh66" },
  "udupi:murudeshwar": { distanceKm: 102, driveHours: 2.0, roadType: "coastal-nh66" },
  "udupi:bhatkal": { distanceKm: 102, driveHours: 2.0, roadType: "coastal-nh66" },
  "murudeshwar:honnavar": { distanceKm: 28, driveHours: 0.6, roadType: "coastal-nh66" },
  "bhatkal:honnavar": { distanceKm: 28, driveHours: 0.6, roadType: "coastal-nh66" },
  "honnavar:gokarna": { distanceKm: 36, driveHours: 0.8, roadType: "coastal-nh66" },
  "honnavar:kumta": { distanceKm: 18, driveHours: 0.4, roadType: "coastal-nh66" },
  "kumta:gokarna": { distanceKm: 18, driveHours: 0.4, roadType: "coastal-nh66" },
  "murudeshwar:gokarna": { distanceKm: 64, driveHours: 1.3, roadType: "coastal-nh66" },
  "bhatkal:kumta": { distanceKm: 46, driveHours: 1.0, roadType: "coastal-nh66" },
  "dharmasthala:mangaluru": { distanceKm: 65, driveHours: 1.5, roadType: "nh73" },
  "belathangadi:mangaluru": { distanceKm: 65, driveHours: 1.5, roadType: "nh73" },

  // Bengaluru hub connections
  "bengaluru:dharmasthala": { distanceKm: 305, driveHours: 6.5, roadType: "nh75" },
  "bengaluru:belathangadi": { distanceKm: 305, driveHours: 6.5, roadType: "nh75" },
  "bengaluru:kukke": { distanceKm: 285, driveHours: 6.0, roadType: "nh75" },
  "bengaluru:kadaba": { distanceKm: 285, driveHours: 6.0, roadType: "nh75" },
  "bengaluru:mangaluru": { distanceKm: 350, driveHours: 7.0, roadType: "nh75" },
  "bengaluru:udupi": { distanceKm: 405, driveHours: 8.0, roadType: "nh75 / nh66" },
  "bengaluru:murudeshwar": { distanceKm: 465, driveHours: 8.5, roadType: "nh69 / nh206" },
  "bengaluru:bhatkal": { distanceKm: 465, driveHours: 8.5, roadType: "nh69 / nh206" },
  "bengaluru:honnavar": { distanceKm: 460, driveHours: 8.5, roadType: "nh69 / nh206" },
  "bengaluru:gokarna": { distanceKm: 490, driveHours: 9.0, roadType: "nh48 / sh" },
  "bengaluru:kumta": { distanceKm: 475, driveHours: 8.8, roadType: "nh48 / sh" },

  // Mysuru hub connections
  "mysuru:dharmasthala": { distanceKm: 235, driveHours: 5.5, roadType: "sh / ghat" },
  "mysuru:belathangadi": { distanceKm: 235, driveHours: 5.5, roadType: "sh / ghat" },
  "mysuru:kukke": { distanceKm: 180, driveHours: 4.2, roadType: "sh / ghat" },
  "mysuru:kadaba": { distanceKm: 180, driveHours: 4.2, roadType: "sh / ghat" },
  "mysuru:mangaluru": { distanceKm: 255, driveHours: 5.5, roadType: "sh27 / nh275" },
  "mysuru:udupi": { distanceKm: 310, driveHours: 6.5, roadType: "nh275 / nh66" },
  "mysuru:murudeshwar": { distanceKm: 410, driveHours: 8.0, roadType: "nh66" },
  "mysuru:honnavar": { distanceKm: 435, driveHours: 8.5, roadType: "nh66" },
  "mysuru:gokarna": { distanceKm: 470, driveHours: 9.0, roadType: "nh66" },

  // Hubballi / Dharwad hub connections
  "hubballi:dharmasthala": { distanceKm: 345, driveHours: 7.0, roadType: "nh48 / sh" },
  "hubballi:mangaluru": { distanceKm: 355, driveHours: 7.0, roadType: "nh66 / nh67" },
  "hubballi:udupi": { distanceKm: 300, driveHours: 6.0, roadType: "nh66" },
  "hubballi:murudeshwar": { distanceKm: 205, driveHours: 4.2, roadType: "nh67 / nh66" },
  "hubballi:honnavar": { distanceKm: 175, driveHours: 3.8, roadType: "nh67 / nh66" },
  "hubballi:gokarna": { distanceKm: 150, driveHours: 3.5, roadType: "nh67 / nh66" },

  // Belagavi hub connections
  "belagavi:dharmasthala": { distanceKm: 420, driveHours: 8.5, roadType: "nh48 / sh" },
  "belagavi:mangaluru": { distanceKm: 430, driveHours: 8.5, roadType: "nh66" },
  "belagavi:udupi": { distanceKm: 375, driveHours: 7.5, roadType: "nh66" },
  "belagavi:murudeshwar": { distanceKm: 280, driveHours: 5.8, roadType: "nh66" },
  "belagavi:honnavar": { distanceKm: 255, driveHours: 5.2, roadType: "nh66" },
  "belagavi:gokarna": { distanceKm: 235, driveHours: 4.8, roadType: "nh66" },

  // Hassan hub connections
  "hassan:dharmasthala": { distanceKm: 120, driveHours: 3.0, roadType: "nh75 / shiradi ghat" },
  "hassan:mangaluru": { distanceKm: 170, driveHours: 4.0, roadType: "nh75" },
  "hassan:murudeshwar": { distanceKm: 270, driveHours: 5.5, roadType: "nh66" },
  "hassan:gokarna": { distanceKm: 380, driveHours: 7.5, roadType: "nh69 / nh66" },

  // Shivamogga hub connections
  "shivamogga:dharmasthala": { distanceKm: 185, driveHours: 4.2, roadType: "sh / ghat" },
  "shivamogga:mangaluru": { distanceKm: 195, driveHours: 4.5, roadType: "sh / agumbe ghat" },
  "shivamogga:udupi": { distanceKm: 145, driveHours: 3.5, roadType: "sh / agumbe" },
  "shivamogga:murudeshwar": { distanceKm: 185, driveHours: 4.0, roadType: "nh69 / nh66" },
  "shivamogga:honnavar": { distanceKm: 165, driveHours: 3.5, roadType: "nh69 / nh66" },
  "shivamogga:gokarna": { distanceKm: 200, driveHours: 4.2, roadType: "nh69 / nh66" }
};

/**
 * 5. TWO-STAGE DISTANCE CALCULATION WITH ROUTE CACHING
 * Stage 1: Fast Geographic Filtering
 * Stage 2: Accurate Road Routing with SQLite & Memory Cache
 */
async function getRoadRouteWithCache(originName, destName, originLat, originLon, destLat, destLon) {
  const normOrigin = normalizeLocationName(originName);
  const normDest = normalizeLocationName(destName);

  // ─── Same-location guard ──────────────────────────────────────────────
  // When origin and destination resolve to the same normalised key (e.g.
  // "Bengaluru" → "Bengaluru", "Bangalore" → "Bengaluru") the distance is
  // always 0 km and travel time 0 hrs.  Skip any route API call.
  if (normOrigin && normDest && normOrigin === normDest) {
    return {
      from: originName,
      to: destName,
      distance_km: 0,
      distanceKm: 0,
      travel_hours: 0,
      driveHours: 0,
      travel_minutes: 0,
      road_type: 'same-location',
      cached: true
    };
  }

  const cacheKey = `${normOrigin}:${normDest}`;
  const reverseCacheKey = `${normDest}:${normOrigin}`;

  // Check verified highway distance table first
  if (VERIFIED_ROAD_DISTANCES[cacheKey]) {
    const v = VERIFIED_ROAD_DISTANCES[cacheKey];
    return {
      from: originName,
      to: destName,
      distance_km: v.distanceKm,
      distanceKm: v.distanceKm,
      travel_hours: v.driveHours,
      driveHours: v.driveHours,
      travel_minutes: Math.round(v.driveHours * 60),
      road_type: v.roadType,
      cached: true
    };
  }
  if (VERIFIED_ROAD_DISTANCES[reverseCacheKey]) {
    const v = VERIFIED_ROAD_DISTANCES[reverseCacheKey];
    return {
      from: originName,
      to: destName,
      distance_km: v.distanceKm,
      distanceKm: v.distanceKm,
      travel_hours: v.driveHours,
      driveHours: v.driveHours,
      travel_minutes: Math.round(v.driveHours * 60),
      road_type: v.roadType,
      cached: true
    };
  }

  // Check memory cache
  if (memoryRouteCache.has(cacheKey)) {
    const m = memoryRouteCache.get(cacheKey);
    return { ...m, distanceKm: m.distance_km || m.distanceKm, driveHours: m.travel_hours || m.driveHours };
  }
  if (memoryRouteCache.has(reverseCacheKey)) {
    const m = memoryRouteCache.get(reverseCacheKey);
    return { ...m, distanceKm: m.distance_km || m.distanceKm, driveHours: m.travel_hours || m.driveHours };
  }

  // Check SQLite RouteCache table
  try {
    const dbCached = await prisma.routeCache.findFirst({
      where: {
        OR: [
          { originKey: normOrigin, destinationKey: normDest },
          { originKey: normDest, destinationKey: normOrigin }
        ]
      }
    });

    if (dbCached) {
      const travelHours = +(dbCached.travelMinutes / 60).toFixed(1);
      const result = {
        from: originName,
        to: destName,
        distance_km: dbCached.distanceKm,
        distanceKm: dbCached.distanceKm,
        travel_hours: travelHours,
        driveHours: travelHours,
        travel_minutes: dbCached.travelMinutes,
        road_type: dbCached.roadType || "highway",
        cached: true
      };
      memoryRouteCache.set(cacheKey, result);
      return result;
    }
  } catch (e) {
    // DB cache check failed gracefully
  }

  // Stage 2: Calculate Road Distance using application's routing service
  const leg = estimateDrivingLeg(originLat, originLon, destLat, destLon, originName, destName);
  const travelMinutes = Math.round(leg.drivingHours * 60);

  // Determine road type based on geography
  let roadType = "highway";
  if (originName.toLowerCase().includes('ghat') || destName.toLowerCase().includes('ghat') ||
      originName.toLowerCase().includes('coorg') || destName.toLowerCase().includes('coorg') ||
      originName.toLowerCase().includes('chikmagalur') || destName.toLowerCase().includes('chikmagalur') ||
      normOrigin.includes('dharmasthala') || normDest.includes('kukke')) {
    roadType = "ghat / highway";
  } else if (originName.toLowerCase().includes('beach') || destName.toLowerCase().includes('beach') ||
             normOrigin === 'mangaluru' || normDest === 'udupi' || normDest === 'kumta' || normDest === 'honnavar' || normDest === 'murudeshwar') {
    roadType = "coastal-nh66";
  }

  const routeResult = {
    from: originName,
    to: destName,
    distance_km: leg.distanceKm,
    distanceKm: leg.distanceKm,
    travel_hours: leg.drivingHours,
    driveHours: leg.drivingHours,
    travel_minutes: travelMinutes,
    road_type: roadType,
    google_maps_url: leg.googleMapsUrl,
    cached: false
  };

  // Cache in memory
  memoryRouteCache.set(cacheKey, routeResult);

  // Cache in SQLite asynchronously
  try {
    await prisma.routeCache.upsert({
      where: {
        originKey_destinationKey: {
          originKey: normOrigin,
          destinationKey: normDest
        }
      },
      update: {
        distanceKm: leg.distanceKm,
        travelMinutes,
        roadType
      },
      create: {
        originKey: normOrigin,
        destinationKey: normDest,
        distanceKm: leg.distanceKm,
        travelMinutes,
        roadType
      }
    });
  } catch (e) {
    // Ignore upsert error
  }

  return routeResult;
}

/**
 * 6. Geographic Proximity & Clustering Filter (Stage 1 Filtering)
 * Determines whether candidate destination is geographically acceptable for the given trip mode.
 */
function isGeographicallyViable(anchorHierarchy, candidateHierarchy, durationDays, mode) {
  if (!anchorHierarchy || !candidateHierarchy) return true;

  const anchorTaluk = anchorHierarchy.taluk;
  const candTaluk = candidateHierarchy.taluk;
  if (!anchorTaluk || !candTaluk) return true;

  // 1-2 Days: Must be inside same taluk OR directly neighbouring taluk
  if (durationDays <= 2) {
    if (anchorTaluk.id === candTaluk.id) return true;
    if (anchorTaluk.neighbouringTaluks && anchorTaluk.neighbouringTaluks.includes(candTaluk.id)) {
      return true;
    }
    return false; // Eliminate distant taluks
  }

  // 3-4 Days: Same taluk, direct neighbour, or nearby taluk in same/neighbouring district
  if (durationDays <= 4) {
    if (anchorTaluk.id === candTaluk.id) return true;
    if (anchorTaluk.districtId === candTaluk.districtId) return true;
    if (anchorTaluk.neighbouringTaluks && anchorTaluk.neighbouringTaluks.includes(candTaluk.id)) return true;
    if (anchorTaluk.nearbyTaluks && anchorTaluk.nearbyTaluks.includes(candTaluk.id)) return true;
    if (anchorHierarchy.district?.neighbouringDistricts?.includes(candTaluk.districtId)) return true;
    return false;
  }

  // 5-6 Days: Must share regional corridor
  if (durationDays <= 6) {
    if (anchorTaluk.region === candTaluk.region) return true;
    // Allow adjacent regions (e.g. Coastal <-> Malnad or Mysuru <-> Malnad)
    const adjacentRegions = {
      "coastal-karnataka": ["malnad-region"],
      "malnad-region": ["coastal-karnataka", "mysuru-region"],
      "mysuru-region": ["malnad-region", "bengaluru-region"],
      "bengaluru-region": ["mysuru-region", "central-karnataka"],
      "heritage-circuit": ["north-karnataka", "kalyana-karnataka"],
      "north-karnataka": ["heritage-circuit", "central-karnataka"]
    };
    if (adjacentRegions[anchorTaluk.region]?.includes(candTaluk.region)) return true;
    return false;
  }

  // 6+ Days: Regional road trip
  return true;
}

/**
 * 7. Score Destination for Route Quality & Anti-Backtracking
 */
function scoreCandidateDestination({
  candidateSlug,
  currentTalukId,
  visitedTalukIds,
  anchorTalukId,
  userInterests,
  candidateCategory,
  distKm
}) {
  const data = loadGeoData();
  let score = 100;

  const currentTaluk = data.taluks.find(t => t.id === currentTalukId);
  const candMap = data.destinationTalukMapping[candidateSlug];
  const candTaluk = candMap ? data.taluks.find(t => t.id === candMap.talukId) : null;

  if (!currentTaluk || !candTaluk) return score;

  // 1. Same taluk bonus (cluster attractions)
  if (currentTaluk.id === candTaluk.id) {
    score += 50;
  }
  // 2. Direct neighbour bonus
  else if (currentTaluk.neighbouringTaluks?.includes(candTaluk.id)) {
    score += 35;
  }
  // 3. Nearby taluk bonus
  else if (currentTaluk.nearbyTaluks?.includes(candTaluk.id)) {
    score += 20;
  }
  // 4. Same district bonus
  else if (currentTaluk.districtId === candTaluk.districtId) {
    score += 15;
  }

  // 5. Backtracking penalty
  if (visitedTalukIds.includes(candTaluk.id)) {
    score -= 60; // Strong penalty for returning to already passed taluk
  }

  // 6. Excessive distance penalty
  if (distKm > 150) {
    score -= Math.round((distKm - 150) * 0.5);
  }

  // 7. Interest match
  if (userInterests && Array.isArray(userInterests) && candidateCategory) {
    const hasInterest = userInterests.some(i => candidateCategory.toLowerCase().includes(i.toLowerCase()));
    if (hasInterest) score += 30;
  }

  return score;
}

/**
 * 8. Daily Distance Helper
 * Calculates actual road distance and realistic travel bounds for that day's planned route.
 * Never returns hardcoded 380 km.
 */
function getDailyDistanceBudget(dayIndex, totalDays, isTransitDay = false, actualDistanceKm = null) {
  if (actualDistanceKm !== null && actualDistanceKm !== undefined && !isNaN(Number(actualDistanceKm))) {
    const km = Math.round(Number(actualDistanceKm));
    return {
      maxTravelKm: km,
      dailyTravelDistance: km,
      dailyDistanceKm: km,
      idealTravelKm: km,
      label: "Daily Travel Distance"
    };
  }

  // If actual distance is not pre-computed, use realistic day-specific road bounds
  const defaultKm = isTransitDay ? (totalDays <= 3 ? 160 : 140) : (totalDays <= 2 ? 60 : 100);
  return {
    maxTravelKm: defaultKm,
    dailyTravelDistance: defaultKm,
    dailyDistanceKm: defaultKm,
    idealTravelKm: defaultKm,
    label: "Daily Travel Distance"
  };
}

module.exports = {
  loadGeoData,
  normalizeLocationName,
  resolveLocationHierarchy,
  getTalukRelationships,
  getAttractionHierarchy,
  getRoadRouteWithCache,
  isGeographicallyViable,
  scoreCandidateDestination,
  getDailyDistanceBudget,
  VERIFIED_ROAD_DISTANCES
};

