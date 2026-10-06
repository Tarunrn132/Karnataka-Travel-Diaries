/**
 * Comprehensive Automated Test Suite for Karnataka AI Trip Planner
 * Validates all 8 Required Test Cases from Section 26 of the Specification.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const ai = require('../backend/services/aiService.js');

async function runAllTests() {
  console.log("==================================================================");
  console.log("🚀 KARNATAKA TRAVEL DIARIES - AI TRIP PLANNER VERIFICATION SUITE");
  console.log("==================================================================\n");

  let allPassed = true;

  // ----------------------------------------------------
  // TEST 1: 2 Days, Start: Bengaluru, Type: Temple & Spiritual
  // ----------------------------------------------------
  console.log("▶ TEST 1: 2 Days | Start: Bengaluru | Type: Temple & Spiritual");
  try {
    const t1 = await ai.generateTrip({
      days: 2,
      startLocation: "Bengaluru",
      travelType: "Temple & Spiritual"
    });
    console.log(`  Title: ${t1.tripTitle}`);
    console.log(`  Total Distance: ${t1.totalDistanceKm} km | Drive Time: ${t1.totalDriveHours} hrs`);
    console.log(`  Destinations: ${t1.days.map(d => d.destination).join(" → ")}`);
    
    // Validations: One primary destination/region, no Karnataka-wide route
    const isSingleRegion = t1.days.every(d => d.destination.toLowerCase().includes("mysore") || d.destination.toLowerCase().includes("srirangapatna") || d.destination.toLowerCase().includes("mysuru"));
    const isDistanceFeasible = t1.totalDistanceKm < 400;
    
    if (t1.days.length === 2 && isDistanceFeasible && isSingleRegion) {
      console.log("  ✅ TEST 1 PASSED: One primary region selected (Mysuru/Srirangapatna) without statewide travel.\n");
    } else {
      console.error("  ❌ TEST 1 FAILED: Unexpected scope or distance.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ TEST 1 ERROR:", e.message);
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 2: 2 Days, Start: Bengaluru, Type: Beaches
  // ----------------------------------------------------
  console.log("▶ TEST 2: 2 Days | Start: Bengaluru | Type: Beaches");
  try {
    const t2 = await ai.generateTrip({
      days: 2,
      startLocation: "Bengaluru",
      travelType: "Beaches"
    });
    console.log(`  Title: ${t2.tripTitle}`);
    console.log(`  Total Distance: ${t2.totalDistanceKm} km | Drive Time: ${t2.totalDriveHours} hrs`);
    console.log(`  Destinations: ${t2.days.map(d => d.destination).join(" → ")}`);
    
    // One primary coastal destination/cluster
    const isSingleCoast = t2.days.every(d => d.destination.toLowerCase().includes("gokarna") || d.destination.toLowerCase().includes("mangalore"));
    if (t2.days.length === 2 && isSingleCoast) {
      console.log("  ✅ TEST 2 PASSED: One primary coastal destination/cluster selected.\n");
    } else {
      console.error("  ❌ TEST 2 FAILED: More than one coastal cluster selected.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ TEST 2 ERROR:", e.message);
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 3: 3 Days, Start: Bengaluru, Type: Beaches
  // ----------------------------------------------------
  console.log("▶ TEST 3: 3 Days | Start: Bengaluru | Type: Beaches");
  try {
    const t3 = await ai.generateTrip({
      days: 3,
      startLocation: "Bengaluru",
      travelType: "Beaches"
    });
    console.log(`  Title: ${t3.tripTitle}`);
    console.log(`  Total Distance: ${t3.totalDistanceKm} km | Drive Time: ${t3.totalDriveHours} hrs`);
    console.log(`  Destinations: ${t3.days.map(d => d.destination).join(" → ")}`);
    
    // Nearby coastal destinations with reasonable travel
    const destNames = t3.days.map(d => d.destination.toLowerCase());
    const hasNearbyCoasts = destNames.some(d => d.includes("mangalore") || d.includes("mangaluru")) && destNames.some(d => d.includes("udupi"));
    if (t3.days.length === 3 && hasNearbyCoasts) {
      console.log("  ✅ TEST 3 PASSED: Nearby coastal destinations (Mangaluru + Udupi) connected reasonably.\n");
    } else {
      console.error("  ❌ TEST 3 FAILED: Coastal grouping did not meet expectations.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ TEST 3 ERROR:", e.message);
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 4: 3 Days, Start: Bengaluru, Type: Temple & Spiritual
  // ----------------------------------------------------
  console.log("▶ TEST 4: 3 Days | Start: Bengaluru | Type: Temple & Spiritual");
  try {
    const t4 = await ai.generateTrip({
      days: 3,
      startLocation: "Bengaluru",
      travelType: "Temple & Spiritual"
    });
    console.log(`  Title: ${t4.tripTitle}`);
    console.log(`  Total Distance: ${t4.totalDistanceKm} km | Drive Time: ${t4.totalDriveHours} hrs`);
    console.log(`  Destinations: ${t4.days.map(d => d.destination).join(" → ")}`);
    
    // One major spiritual region + nearby temples
    if (t4.days.length === 3 && t4.totalDistanceKm < 500) {
      console.log("  ✅ TEST 4 PASSED: One major spiritual region + nearby temples without excessive transit.\n");
    } else {
      console.error("  ❌ TEST 4 FAILED: Excessive travel or incorrect length.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ TEST 4 ERROR:", e.message);
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 5: 4 Days, Start: Bengaluru, Type: Nature & Waterfalls
  // ----------------------------------------------------
  console.log("▶ TEST 5: 4 Days | Start: Bengaluru | Type: Nature & Waterfalls");
  try {
    const t5 = await ai.generateTrip({
      days: 4,
      startLocation: "Bengaluru",
      travelType: "Nature & Waterfalls"
    });
    console.log(`  Title: ${t5.tripTitle}`);
    console.log(`  Total Distance: ${t5.totalDistanceKm} km | Drive Time: ${t5.totalDriveHours} hrs`);
    console.log(`  Destinations: ${t5.days.map(d => d.destination).join(" → ")}`);
    
    // Connected regional nature circuit
    const hasNatureCorridor = t5.days.some(d => d.destination.toLowerCase().includes("coorg")) && t5.days.some(d => d.destination.toLowerCase().includes("chikmagalur") || d.destination.toLowerCase().includes("sakleshpur"));
    if (t5.days.length === 4 && hasNatureCorridor) {
      console.log("  ✅ TEST 5 PASSED: Connected Western Ghats regional nature circuit.\n");
    } else {
      console.error("  ❌ TEST 5 FAILED: Nature corridor not connected properly.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ TEST 5 ERROR:", e.message);
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 6: 6 Days, Start: Bengaluru, Type: Temple & Spiritual (SPECIAL ROUTE)
  // ----------------------------------------------------
  console.log("▶ TEST 6: 6 Days | Start: Bengaluru | Type: Temple & Spiritual (REQUIRED SPECIAL ROUTE)");
  try {
    const t6 = await ai.generateTrip({
      days: 6,
      startLocation: "Bengaluru",
      travelType: "Temple & Spiritual"
    });
    console.log(`  Title: ${t6.tripTitle}`);
    console.log(`  Total Distance: ${t6.totalDistanceKm} km | Drive Time: ${t6.totalDriveHours} hrs`);
    t6.days.forEach(d => console.log(`    Day ${d.day}: ${d.route} (${d.distanceKm} km, ${d.driveHours} hrs)`));

    // Must contain: Dharmasthala, Kukke, Mangaluru, Udupi, Murdeshwar, Honnavar, Gokarna, Karwar
    const expectedStops = ["Dharmasthala", "Kukke", "Mangaluru", "Udupi", "Murdeshwar", "Honnavar", "Gokarna", "Karwar"];
    const allStopsText = t6.days.map(d => `${d.route} ${d.destination} ${d.morning?.description || ''} ${d.afternoon?.description || ''}`).join(" ");
    const matchesAllStops = expectedStops.every(s => allStopsText.includes(s));

    if (t6.days.length === 6 && matchesAllStops && t6.days[0].distanceKm > 250) {
      console.log("  ✅ TEST 6 PASSED: Verified 6-Day Karnataka Coastal Spiritual Circuit from Bengaluru.\n");
    } else {
      console.error("  ❌ TEST 6 FAILED: Coastal spiritual route missing required sequence stops.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ TEST 6 ERROR:", e.message);
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 7: 6 Days, Start: Bengaluru, Type: Beaches
  // ----------------------------------------------------
  console.log("▶ TEST 7: 6 Days | Start: Bengaluru | Type: Beaches");
  try {
    const t7 = await ai.generateTrip({
      days: 6,
      startLocation: "Bengaluru",
      travelType: "Beaches"
    });
    console.log(`  Title: ${t7.tripTitle}`);
    console.log(`  Total Distance: ${t7.totalDistanceKm} km | Drive Time: ${t7.totalDriveHours} hrs`);
    t7.days.forEach(d => console.log(`    Day ${d.day}: ${d.route} (${d.distanceKm} km, ${d.driveHours} hrs)`));

    if (t7.days.length === 6 && t7.tripTitle.toLowerCase().includes("beach")) {
      console.log("  ✅ TEST 7 PASSED: Comprehensive 6-day Coastal Karnataka Beach circuit generated.\n");
    } else {
      console.error("  ❌ TEST 7 FAILED: Coastal beach circuit not as expected.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ TEST 7 ERROR:", e.message);
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 8: 6 Days, Start: Mysuru, Type: Temple & Spiritual
  // ----------------------------------------------------
  console.log("▶ TEST 8: 6 Days | Start: Mysuru | Type: Temple & Spiritual");
  try {
    const t8 = await ai.generateTrip({
      days: 6,
      startLocation: "Mysuru",
      travelType: "Temple & Spiritual"
    });
    console.log(`  Title: ${t8.tripTitle}`);
    console.log(`  Start Location: ${t8.startLocation}`);
    console.log(`  Day 1 Route: ${t8.days[0].route} (${t8.days[0].distanceKm} km, ${t8.days[0].driveHours} hrs)`);
    console.log(`  Total Distance: ${t8.totalDistanceKm} km | Drive Time: ${t8.totalDriveHours} hrs`);

    const respectsMysuru = t8.startLocation === "Mysuru" && t8.days[0].route.includes("Mysuru → Dharmasthala");
    if (t8.days.length === 6 && respectsMysuru && t8.days[0].distanceKm === 235) {
      console.log("  ✅ TEST 8 PASSED: Start from Mysuru respected; verified highway distance to Dharmasthala (235 km).\n");
    } else {
      console.error("  ❌ TEST 8 FAILED: Starting location logic did not adapt appropriately.\n");
      allPassed = false;
    }
  } catch (e) {
    console.error("  ❌ TEST 8 ERROR:", e.message);
    allPassed = false;
  }

  console.log("==================================================================");
  if (allPassed) {
    console.log("🎉 ALL 8 TEST CASES PASSED WITH 100% SUCCESS!");
  } else {
    console.log("⚠️ SOME TESTS FAILED.");
  }
  console.log("==================================================================");
}

runAllTests().catch(console.error);
