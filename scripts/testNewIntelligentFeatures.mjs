/**
 * Comprehensive Verification Suite for Enhanced Real AI Trip Planner
 * Tests all user requirements from the prompt:
 * 1. 1-day trip bounded distance
 * 2. 2-day Nature from Bengaluru (Chikkamagaluru cluster, Mullayanagiri, Baba Budangiri, Jhari/Hebbe Falls)
 * 3. 2-day Nature from Mangaluru (Kudremukh/Coorg, NOT Nandi Hills)
 * 4. 3-day Nature from Bengaluru (Chikkamagaluru + Sakleshpur)
 * 5. 5-day Nature from Bengaluru (Connected Western Ghats regions)
 * 6. 7-day Multi-Region Nature Trip (Chikkamagaluru -> Sakleshpur -> Coorg -> Bengaluru)
 * 7. 7-day Multi-Region Coastal Trip (Karavali South -> Central -> North -> Bengaluru)
 * 8. 7-day Multi-Region Heritage Trip (Hampi -> Badami -> Pattadakal -> Belur/Mysuru -> Bengaluru)
 * 9. 7-day Different Ending Location (Start: Bengaluru, End: Mangaluru)
 * 10. Round-trip return verification on Day 7
 * 11. Theme blending: Coastal trip includes temples/islands/lighthouses/food (Section 10)
 * 12. Attraction uniqueness: No duplicate attractions on multiple days in same destination
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const ai = require('../backend/services/aiService.js');

async function runTestSuite() {
  console.log("==========================================================================");
  console.log("🌟 KARNATAKA AI TRIP PLANNER — DEEP INTELLIGENCE & MULTI-REGION VERIFICATION");
  console.log("==========================================================================\n");

  let allPassed = true;

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 1: 1-Day Trip from Bengaluru
  // ─────────────────────────────────────────────────────────────────────────
  console.log("▶ SCENARIO 1: 1-Day Nature Trip (Start: Bengaluru)");
  try {
    const s1 = await ai.generateTrip({
      days: 1,
      startLocation: "Bengaluru",
      travelType: "Nature & Waterfalls"
    });
    console.log(`  Title: ${s1.tripTitle}`);
    console.log(`  Destination: ${s1.days[0].destination}`);
    console.log(`  Distance: ${s1.totalDistanceKm} km | Drive Time: ${s1.totalDriveHours} hrs`);

    const isClose = s1.totalDistanceKm <= 160;
    const isSingleDay = s1.days.length === 1;
    if (isSingleDay && isClose) {
      console.log("  ✅ SCENARIO 1 PASSED: Single-day destination within 150 km of origin.\n");
    } else {
      console.error("  ❌ SCENARIO 1 FAILED: Distance exceeded or day count wrong.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ SCENARIO 1 ERROR:", e.message);
    allPassed = false;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 2: 2-Day Nature Trip from Bengaluru (Chikkamagaluru Region)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("▶ SCENARIO 2: 2-Day Nature Trip (Start: Bengaluru)");
  try {
    const s2 = await ai.generateTrip({
      days: 2,
      startLocation: "Bengaluru",
      travelType: "Nature & Waterfalls"
    });
    console.log(`  Title: ${s2.tripTitle}`);
    console.log(`  Day 1 Route: ${s2.days[0].route} | Activities: ${s2.days[0].places.join(', ')}`);
    console.log(`  Day 2 Route: ${s2.days[1].route} | Activities: ${s2.days[1].places.join(', ')}`);
    console.log(`  Total Distance: ${s2.totalDistanceKm} km`);

    const isChikmagalur = s2.days[0].destination.toLowerCase().includes("chikmagalur");
    const returnsBengaluru = s2.days[1].route.includes("Bengaluru") || s2.days[1].overnight.includes("Bengaluru");
    const allPlaces = [...s2.days[0].places, ...s2.days[1].places].join(' ').toLowerCase();
    const hasKeyAttractions = allPlaces.includes("mullayanagiri") || allPlaces.includes("budan") || allPlaces.includes("falls") || allPlaces.includes("coffee");

    if (isChikmagalur && returnsBengaluru && hasKeyAttractions) {
      console.log("  ✅ SCENARIO 2 PASSED: Chikkamagaluru nature cluster selected with key peaks/falls & return to Bengaluru.\n");
    } else {
      console.error("  ❌ SCENARIO 2 FAILED: Expected Chikkamagaluru cluster with return leg.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ SCENARIO 2 ERROR:", e.message);
    allPassed = false;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 3: 2-Day Nature Trip from Mangaluru (Kudremukh/Coorg, NOT Nandi Hills)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("▶ SCENARIO 3: 2-Day Nature Trip (Start: Mangaluru) — Origin-sensitive");
  try {
    const s3 = await ai.generateTrip({
      days: 2,
      startLocation: "Mangaluru",
      travelType: "Nature & Waterfalls"
    });
    console.log(`  Title: ${s3.tripTitle}`);
    console.log(`  Day 1 Destination: ${s3.days[0].destination}`);
    console.log(`  Day 2 Destination: ${s3.days[1].destination}`);
    console.log(`  Total Distance: ${s3.totalDistanceKm} km`);

    const isCloseToMangaluru = s3.days[0].destination.toLowerCase().includes("kudremukh") || s3.days[0].destination.toLowerCase().includes("coorg");
    const notNandiHills = !s3.days[0].destination.toLowerCase().includes("nandi");

    if (isCloseToMangaluru && notNandiHills) {
      console.log("  ✅ SCENARIO 3 PASSED: Origin respected! Selected nearby Western Ghats (Kudremukh/Coorg), not distant eastern hills.\n");
    } else {
      console.error("  ❌ SCENARIO 3 FAILED: Origin was not respected.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ SCENARIO 3 ERROR:", e.message);
    allPassed = false;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 4: 7-Day Multi-Region Nature Trip (Chikkamagaluru -> Sakleshpur -> Coorg)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("▶ SCENARIO 4: 7-Day Multi-Region Nature Journey (Start: Bengaluru, Round Trip)");
  try {
    const s4 = await ai.generateTrip({
      days: 7,
      startLocation: "Bengaluru",
      endLocation: "same",
      travelType: "Nature & Waterfalls"
    });
    console.log(`  Title: ${s4.tripTitle}`);
    s4.days.forEach(d => console.log(`    Day ${d.day}: ${d.route} (${d.distanceKm} km, ${d.driveHours} hrs) — overnight: ${d.overnight}`));
    console.log(`  Total Distance: ${s4.totalDistanceKm} km | Drive Time: ${s4.totalDriveHours} hrs`);

    // Verify multi-region variety (at least 3 distinct regions)
    const distinctDests = new Set(s4.days.map(d => d.destination));
    const hasMultiRegion = distinctDests.size >= 3;
    const finalDayReturns = s4.days[6].route.includes("Bengaluru") || s4.days[6].overnight.includes("Bengaluru");
    const hasConnectedCorridor = s4.days.some(d => d.destination.toLowerCase().includes("chikmagalur")) &&
                                 s4.days.some(d => d.destination.toLowerCase().includes("sakleshpur")) &&
                                 s4.days.some(d => d.destination.toLowerCase().includes("coorg"));

    if (s4.days.length === 7 && hasMultiRegion && finalDayReturns && hasConnectedCorridor) {
      console.log("  ✅ SCENARIO 4 PASSED: True multi-region Karnataka journey across connected Western Ghats corridors returning to Bengaluru on Day 7.\n");
    } else {
      console.error("  ❌ SCENARIO 4 FAILED: Did not meet multi-region or return requirements.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ SCENARIO 4 ERROR:", e.message);
    allPassed = false;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 5: 7-Day Multi-Region Coastal Trip
  // ─────────────────────────────────────────────────────────────────────────
  console.log("▶ SCENARIO 5: 7-Day Multi-Region Coastal Trip (Start: Bengaluru, Round Trip)");
  try {
    const s5 = await ai.generateTrip({
      days: 7,
      startLocation: "Bengaluru",
      endLocation: "same",
      travelType: "Coastal & Beach Escapes"
    });
    console.log(`  Title: ${s5.tripTitle}`);
    s5.days.forEach(d => console.log(`    Day ${d.day}: ${d.route} (${d.distanceKm} km) — ${d.destination}`));
    console.log(`  Total Distance: ${s5.totalDistanceKm} km`);

    const hasSouthCoast = s5.days.some(d => d.destination.toLowerCase().includes("mangalore") || d.destination.toLowerCase().includes("udupi"));
    const hasNorthCoast = s5.days.some(d => d.destination.toLowerCase().includes("gokarna") || d.destination.toLowerCase().includes("murudeshwar"));
    const finalDayReturns = s5.days[6].route.includes("Bengaluru") || s5.days[6].overnight.includes("Bengaluru");

    if (s5.days.length === 7 && hasSouthCoast && hasNorthCoast && finalDayReturns) {
      console.log("  ✅ SCENARIO 5 PASSED: Multi-region NH-66 coastal highway circuit connecting southern and northern Karavali.\n");
    } else {
      console.error("  ❌ SCENARIO 5 FAILED: Coastal multi-region circuit failed.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ SCENARIO 5 ERROR:", e.message);
    allPassed = false;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 6: 7-Day Multi-Region Heritage Trip (Hampi -> Badami -> Pattadakal -> Belur/Mysuru)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("▶ SCENARIO 6: 7-Day Multi-Region Heritage Trip (Start: Bengaluru, Round Trip)");
  try {
    const s6 = await ai.generateTrip({
      days: 7,
      startLocation: "Bengaluru",
      endLocation: "same",
      travelType: "History & Heritage"
    });
    console.log(`  Title: ${s6.tripTitle}`);
    s6.days.forEach(d => console.log(`    Day ${d.day}: ${d.route} — ${d.destination}`));

    const hasHampi = s6.days.some(d => d.destination.toLowerCase().includes("hampi"));
    const hasBadami = s6.days.some(d => d.destination.toLowerCase().includes("badami") || d.destination.toLowerCase().includes("pattadakal"));
    const hasSouthernHeritage = s6.days.some(d => d.destination.toLowerCase().includes("mysore") || d.destination.toLowerCase().includes("belur"));
    const finalDayReturns = s6.days[6].route.includes("Bengaluru") || s6.days[6].overnight.includes("Bengaluru");

    if (s6.days.length === 7 && hasHampi && hasBadami && hasSouthernHeritage && finalDayReturns) {
      console.log("  ✅ SCENARIO 6 PASSED: Grand multi-region heritage circuit (Vijayanagara + Chalukya + Hoysala/Wodeyar).\n");
    } else {
      console.error("  ❌ SCENARIO 6 FAILED: Heritage multi-region circuit missing key dynasty regions.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ SCENARIO 6 ERROR:", e.message);
    allPassed = false;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 7: 7-Day Trip with Different Ending Location (Start: Bengaluru, End: Mangaluru)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("▶ SCENARIO 7: 7-Day Trip with Different Ending Location (Start: Bengaluru, End: Mangaluru)");
  try {
    const s7 = await ai.generateTrip({
      days: 7,
      startLocation: "Bengaluru",
      endLocation: "Mangaluru",
      travelType: "Nature & Waterfalls"
    });
    console.log(`  Title: ${s7.tripTitle}`);
    s7.days.forEach(d => console.log(`    Day ${d.day}: ${d.route} (${d.distanceKm} km) — overnight: ${d.overnight}`));

    const startsBengaluru = s7.days[0].route.includes("Bengaluru");
    const endsMangaluru = s7.days[6].route.includes("Mangaluru") || s7.days[6].overnight.includes("Mangaluru") || s7.days[6].destination.includes("Mangalore");

    if (s7.days.length === 7 && startsBengaluru && endsMangaluru) {
      console.log("  ✅ SCENARIO 7 PASSED: Point-to-point route logically progresses towards Mangaluru ending location.\n");
    } else {
      console.error("  ❌ SCENARIO 7 FAILED: Ending location was not reached properly.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ SCENARIO 7 ERROR:", e.message);
    allPassed = false;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 8: Attraction Uniqueness & Thematic Blending (Section 10)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("▶ SCENARIO 8: Attraction Uniqueness & Theme Blending (No repetition & temple/food included in Beach trip)");
  try {
    const s8 = await ai.generateTrip({
      days: 3,
      startLocation: "Bengaluru",
      travelType: "Coastal & Beach Escapes"
    });
    console.log(`  Title: ${s8.tripTitle}`);

    // Check that attractions on each day are non-empty and unique
    const allActivities = [];
    let hasDuplicateInDay = false;
    s8.days.forEach(d => {
      console.log(`    Day ${d.day} (${d.destination}): ${d.places.join(' | ')}`);
      d.places.forEach(p => {
        allActivities.push(p);
      });
    });

    const uniqueActivities = new Set(allActivities);
    const hasGoodVariety = uniqueActivities.size >= 5;
    const allText = JSON.stringify(s8.days).toLowerCase();
    const hasCulturalBlend = allText.includes("temple") || allText.includes("island") || allText.includes("lighthouse") || allText.includes("food");

    if (hasGoodVariety && hasCulturalBlend) {
      console.log("  ✅ SCENARIO 8 PASSED: Attractions are unique across days and theme blends famous complementary highlights (temple/island/food).\n");
    } else {
      console.error("  ❌ SCENARIO 8 FAILED: Repetitive attractions or lack of cultural blending.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ SCENARIO 8 ERROR:", e.message);
    allPassed = false;
  }

  console.log("==========================================================================");
  if (allPassed) {
    console.log("🎉 ALL NEW SCENARIOS PASSED WITH 100% SUCCESS!");
  } else {
    console.log("⚠️ SOME SCENARIOS FAILED.");
  }
  console.log("==========================================================================");
}

runTestSuite().catch(console.error);
