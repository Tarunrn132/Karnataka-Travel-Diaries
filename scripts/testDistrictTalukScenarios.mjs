// Native fetch is globally available in Node.js 18+

const BASE_URL = 'http://localhost:3000';

async function runTest(testName, payload, validator) {
  process.stdout.write(`Testing: ${testName}... `);
  try {
    const res = await fetch(`${BASE_URL}/api/ai/plan-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const validationError = validator(data);
    if (validationError) {
      console.log(`❌ FAILED: ${validationError}`);
      return false;
    } else {
      console.log(`✅ PASSED`);
      return true;
    }
  } catch (err) {
    console.log(`❌ ERROR: ${err.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log("=================================================");
  console.log("🧪 TESTING DISTRICT-TALUK GEOGRAPHIC ROUTING LAYER");
  console.log("=================================================\n");

  let allPassed = true;

  // Test 1: 2 days — Mangalore
  allPassed = await runTest(
    "Test 1: 2 days — Mangalore (Single-Destination Taluk Mode)",
    { startingLocation: "Bengaluru", days: 2, primaryDestination: "Mangalore" },
    (data) => {
      if (data.trip_summary.mode !== "single_destination") return `Expected single_destination mode, got ${data.trip_summary.mode}`;
      if (data.destinations.length !== 1) return `Expected 1 destination, got ${data.destinations.length}`;
      if (!data.destinations[0].slug.includes("mangalore")) return `Expected Mangalore, got ${data.destinations[0].slug}`;
      if (!data.days[0].taluk?.toLowerCase().includes("mangaluru")) return `Expected Mangaluru Taluk, got ${data.days[0].taluk}`;
      return null;
    }
  ) && allPassed;

  // Test 2: 2 days — Udupi
  allPassed = await runTest(
    "Test 2: 2 days — Udupi (Single-Destination Taluk Mode)",
    { startingLocation: "Bengaluru", days: 2, primaryDestination: "Udupi" },
    (data) => {
      if (data.trip_summary.mode !== "single_destination") return `Expected single_destination mode, got ${data.trip_summary.mode}`;
      if (data.destinations.length !== 1) return `Expected 1 destination, got ${data.destinations.length}`;
      if (data.destinations[0].slug !== "udupi") return `Expected Udupi, got ${data.destinations[0].slug}`;
      if (!data.days[0].taluk?.toLowerCase().includes("udupi")) return `Expected Udupi Taluk, got ${data.days[0].taluk}`;
      return null;
    }
  ) && allPassed;

  // Test 3: 4 days — Mangalore + Udupi
  allPassed = await runTest(
    "Test 3: 4 days — Mangalore + Udupi (Primary + Neighbour Mode)",
    { startingLocation: "Bengaluru", days: 4, primaryDestination: "Mangalore" },
    (data) => {
      if (data.trip_summary.mode !== "primary_plus_neighbour") return `Expected primary_plus_neighbour mode, got ${data.trip_summary.mode}`;
      if (data.destinations.length !== 2) return `Expected 2 destinations, got ${data.destinations.length}`;
      const destSlugs = data.destinations.map(d => d.slug);
      if (!destSlugs.includes("mangalore") || !destSlugs.includes("udupi")) return `Expected Mangalore and Udupi, got ${destSlugs.join(", ")}`;
      return null;
    }
  ) && allPassed;

  // Test 4: 6 days — Coastal Karnataka
  allPassed = await runTest(
    "Test 4: 6 days — Coastal Karnataka (Regional Corridor Circuit)",
    { startingLocation: "Bengaluru", days: 6, primaryDestination: "Mangalore" },
    (data) => {
      if (data.destinations.length < 3) return `Expected >= 3 corridor stops, got ${data.destinations.length}`;
      const destSlugs = data.destinations.map(d => d.slug);
      if (!destSlugs.includes("mangalore")) return `Expected Mangalore in corridor`;
      if (!destSlugs.includes("udupi")) return `Expected Udupi in corridor`;
      return null;
    }
  ) && allPassed;

  // Test 5: 6 days — Spiritual Circuit
  allPassed = await runTest(
    "Test 5: 6 days — Spiritual Circuit (Dharmasthala -> Kukke -> Mangalore -> Udupi -> Murdeshwar -> Gokarna)",
    { startingLocation: "Bengaluru", days: 6, isSpiritualCircuit: true },
    (data) => {
      if (data.trip_summary.mode !== "spiritual_circuit") return `Expected spiritual_circuit mode, got ${data.trip_summary.mode}`;
      const destSlugs = data.destinations.map(d => d.slug);
      if (!destSlugs.includes("dharmasthala")) return `Expected Dharmasthala in circuit`;
      if (!destSlugs.includes("kukke-subrahmanya")) return `Expected Kukke in circuit`;
      if (!destSlugs.includes("udupi")) return `Expected Udupi in circuit`;

      // Check temple images and visiting hours
      const allAttractions = data.days.flatMap(d => d.attractions || []);
      const dharmasthalaAttr = allAttractions.find(a => a.name.includes("Dharmasthala"));
      if (dharmasthalaAttr && !dharmasthalaAttr.image?.includes("dharmasthala")) {
        return `Expected local image for Dharmasthala, got ${dharmasthalaAttr.image}`;
      }
      return null;
    }
  ) && allPassed;

  // Test 6: 8 days — Karnataka Road Trip
  allPassed = await runTest(
    "Test 6: 8 days — Karnataka Road Trip (Multi-District Road Trip)",
    { startingLocation: "Bengaluru", days: 8, primaryDestination: "Chikmagalur" },
    (data) => {
      if (data.destinations.length < 4) return `Expected >= 4 destinations for 8-day trip, got ${data.destinations.length}`;
      if (!data.trip_summary.districts_covered || data.trip_summary.districts_covered.length < 2) {
        return `Expected multiple districts covered`;
      }
      return null;
    }
  ) && allPassed;

  // Test 7: 2 days — Coorg
  allPassed = await runTest(
    "Test 7: 2 days — Coorg (Coorg / Kodagu-focused itinerary)",
    { startingLocation: "Bengaluru", days: 2, primaryDestination: "Coorg" },
    (data) => {
      if (data.trip_summary.mode !== "single_destination") return `Expected single_destination, got ${data.trip_summary.mode}`;
      if (data.destinations.length !== 1) return `Expected 1 destination, got ${data.destinations.length}`;
      if (data.destinations[0].slug !== "coorg") return `Expected Coorg, got ${data.destinations[0].slug}`;
      if (!data.days[0].district?.toLowerCase().includes("kodagu")) return `Expected Kodagu District, got ${data.days[0].district}`;
      return null;
    }
  ) && allPassed;

  // Test 8: 4 days — Chikkamagaluru
  allPassed = await runTest(
    "Test 8: 4 days — Chikkamagaluru (Chikkamagaluru + nearby Malnad)",
    { startingLocation: "Bengaluru", days: 4, primaryDestination: "Chikmagalur" },
    (data) => {
      if (data.trip_summary.mode !== "primary_plus_neighbour") return `Expected primary_plus_neighbour, got ${data.trip_summary.mode}`;
      if (data.destinations.length !== 2) return `Expected 2 destinations, got ${data.destinations.length}`;
      if (data.destinations[0].slug !== "chikmagalur") return `Expected Chikmagalur as anchor, got ${data.destinations[0].slug}`;
      return null;
    }
  ) && allPassed;

  // Test 9: Verify Image Paths for the 4 Requested Temples
  process.stdout.write(`Testing: Temple Image Verification (Dharmasthala, Kukke, Kateel, Kadri)... `);
  try {
    const res = await fetch(`${BASE_URL}/images/destinations/dharmasthala.jpg`);
    const res2 = await fetch(`${BASE_URL}/images/destinations/kukke-subrahmanya.jpg`);
    const res3 = await fetch(`${BASE_URL}/images/attractions/kateel-durgaparameshwari-temple.jpg`);
    const res4 = await fetch(`${BASE_URL}/images/attractions/kadri-manjunatha-temple.jpg`);
    if (res.status === 200 && res2.status === 200 && res3.status === 200 && res4.status === 200) {
      console.log(`✅ PASSED (All 4 images served with HTTP 200)`);
    } else {
      console.log(`❌ FAILED: status codes: ${res.status}, ${res2.status}, ${res3.status}, ${res4.status}`);
      allPassed = false;
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e.message}`);
    allPassed = false;
  }

  // Test 10: Verify Geo-Hierarchy Endpoint
  process.stdout.write(`Testing: GET /api/ai/geo-hierarchy... `);
  try {
    const res = await fetch(`${BASE_URL}/api/ai/geo-hierarchy`);
    const data = await res.json();
    if (data.success && data.districtsCount === 31 && data.taluksCount >= 200) {
      console.log(`✅ PASSED (31 districts, ${data.taluksCount} taluks returned)`);
    } else {
      console.log(`❌ FAILED: returned ${data.districtsCount} districts, ${data.taluksCount} taluks`);
      allPassed = false;
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e.message}`);
    allPassed = false;
  }

  console.log("\n=================================================");
  if (allPassed) {
    console.log("🎉 ALL 10 TESTS PASSED PERFECTLY!");
  } else {
    console.log("⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.");
  }
  console.log("=================================================");
}

runAllTests();
