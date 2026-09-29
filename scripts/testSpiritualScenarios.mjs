// Test script for user-specified Spiritual Circuit scenarios
const BASE_URL = 'http://localhost:3000';

async function testScenario(name, payload) {
  console.log(`\n======================================================`);
  console.log(`▶ RUNNING TEST: ${name}`);
  console.log(`Payload:`, JSON.stringify(payload));
  console.log(`======================================================`);

  const res = await fetch(`${BASE_URL}/api/ai/plan-trip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const jsonStr = JSON.stringify(data);

  // 1. Verify "Daily Budget: ~380 km" NEVER appears
  if (jsonStr.includes("380 km")) {
    console.error(`❌ FAILED: Found "380 km" in output!`);
    process.exit(1);
  }
  if (jsonStr.includes("Daily Budget: ~380")) {
    console.error(`❌ FAILED: Found "Daily Budget: ~380" in output!`);
    process.exit(1);
  }

  console.log(`✅ No "~380 km" found anywhere in payload.`);
  console.log(`Summary Title: ${data.summary?.title}`);
  console.log(`Route Summary: ${data.summary?.routeSummary}`);
  console.log(`Total Distance: ${data.trip_summary?.total_distance_km} km`);
  console.log(`Total Drive Time: ${data.trip_summary?.estimated_travel_hours} hrs`);
  console.log(`Days Count: ${data.days.length}`);

  data.days.forEach((day) => {
    console.log(`  - Day ${day.dayNumber}: ${day.title}`);
    console.log(`    Travel: ${day.travelLeg ? `${day.travelLeg.from} → ${day.travelLeg.to} (${day.travelLeg.distanceKm} km, ${day.travelLeg.driveHours} hrs)` : 'Local'}`);
    console.log(`    Daily Travel Distance: ${day.dailyTravelDistance} km`);
    console.log(`    Daily Budget Object: ${JSON.stringify(day.daily_distance_budget)}`);
    console.log(`    Overnight: ${day.overnight}`);
    if (day.attractions && day.attractions.length > 0) {
      console.log(`    Attractions (${day.attractions.length}): ${day.attractions.map(a => `${a.name} [${a.visitingHours || 'open'}]`).join("; ")}`);
    }
  });

  return data;
}

async function run() {
  // TEST 1: 3-day trip from Bengaluru
  const d3 = await testScenario("TEST 1: 3-Day Trip (Bengaluru)", {
    startingLocation: "Bengaluru",
    days: 3,
    isSpiritualCircuit: true
  });
  if (d3.days.length !== 4) throw new Error(`Expected 4 days (3 exploration + 1 return), got ${d3.days.length}`);
  if (!d3.days[0].title.includes("Dharmasthala")) throw new Error("Day 1 should be Dharmasthala");
  if (!d3.days[1].title.includes("Kukke") || !d3.days[1].title.includes("Mangalore")) throw new Error("Day 2 should be Kukke & Mangalore");
  if (d3.days[1].dailyTravelDistance !== 159) throw new Error(`Day 2 travel distance must be 159 km (54 + 105), got ${d3.days[1].dailyTravelDistance}`);
  if (!d3.days[2].title.includes("Mangalore")) throw new Error("Day 3 should be Mangalore");
  if (!d3.days[3].title.includes("Return") || !d3.days[3].destination.includes("Bengaluru")) throw new Error("Day 4 should be Return to Bengaluru");

  // TEST 2: 4-day trip from Mysuru
  const d4 = await testScenario("TEST 2: 4-Day Trip (Mysuru)", {
    startingLocation: "Mysuru",
    days: 4,
    isSpiritualCircuit: true
  });
  if (d4.days.length !== 5) throw new Error(`Expected 5 days (4 exploration + 1 return), got ${d4.days.length}`);
  if (!d4.days[0].title.includes("Dharmasthala")) throw new Error("Day 1 should be Dharmasthala");
  if (d4.days[1].dailyTravelDistance !== 159) throw new Error(`Day 2 travel distance must be 159 km, got ${d4.days[1].dailyTravelDistance}`);
  if (d4.days[2].dailyTravelDistance !== 82) throw new Error(`Day 3 travel distance must be 82 km, got ${d4.days[2].dailyTravelDistance}`);
  if (d4.days[3].dailyTravelDistance !== 107) throw new Error(`Day 4 travel distance must be 107 km, got ${d4.days[3].dailyTravelDistance}`);
  if (!d4.days[3].title.includes("Murdeshwar")) throw new Error("Day 4 should be Murdeshwar");
  if (!d4.days[4].title.includes("Return") || !d4.days[4].destination.includes("Mysuru")) throw new Error("Day 5 should be Return to Mysuru");

  // TEST 3: 5-day trip from Hubballi
  const d5 = await testScenario("TEST 3: 5-Day Trip (Hubballi)", {
    startingLocation: "Hubballi",
    days: 5,
    isSpiritualCircuit: true
  });
  if (d5.days.length !== 6) throw new Error(`Expected 6 days (5 exploration + 1 return), got ${d5.days.length}`);
  if (!d5.days[0].title.includes("Dharmasthala")) throw new Error("Day 1 should be Dharmasthala");
  if (d5.days[1].dailyTravelDistance !== 159) throw new Error(`Day 2 travel distance must be 159 km, got ${d5.days[1].dailyTravelDistance}`);
  if (d5.days[2].dailyTravelDistance !== 82) throw new Error(`Day 3 travel distance must be 82 km, got ${d5.days[2].dailyTravelDistance}`);
  if (d5.days[3].dailyTravelDistance !== 142) throw new Error(`Day 4 travel distance must be 142 km, got ${d5.days[3].dailyTravelDistance}`);
  if (d5.days[4].dailyTravelDistance !== 50) throw new Error(`Day 5 travel distance must be 50 km, got ${d5.days[4].dailyTravelDistance}`);
  if (!d5.days[4].title.includes("Gokarna")) throw new Error("Day 5 should be Gokarna");
  if (!d5.days[5].title.includes("Return") || !d5.days[5].destination.includes("Hubballi")) throw new Error("Day 6 should be Return to Hubballi");

  // TEST 4: Custom starting location and return location (Belagavi -> Sirsi)
  const dCustom = await testScenario("TEST 4: Custom Start & Return Locations (Belagavi -> Udupi return)", {
    startingLocation: "Belagavi",
    returnLocation: "Udupi",
    days: 4,
    isSpiritualCircuit: true
  });
  if (!dCustom.days[4].title.includes("Udupi")) throw new Error("Day 5 return must use return location Udupi");

  console.log(`\n🎉 ALL SCENARIOS VALIDATED SUCCESSFULLY WITH ACCURATE DAILY TRAVEL DISTANCES!`);
}

run().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
