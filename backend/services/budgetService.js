/**
 * Karnataka Travel Diaries - Budget Estimation & Optimization Service
 * Provides transparent, categorized cost models for Karnataka road trips.
 * Note: Clearly labeled as estimates — actual market rates and seasonal surcharges may vary.
 */

const STAY_RATES_PER_ROOM = {
  Relaxed: { budget: 1500, moderate: 3500, luxury: 7500 },
  Balanced: { budget: 1200, moderate: 2800, luxury: 6000 },
  Packed: { budget: 900, moderate: 2200, luxury: 4800 }
};

const FOOD_PER_PERSON_DAY = {
  Relaxed: 800, // Cafes, specialty dining
  Balanced: 550, // Traditional thalis, reputable messes
  Packed: 380    // Darshinis, local street food
};

const TRANSPORT_COST_PER_KM = {
  Car: 12,       // Petrol / diesel + maintenance per km
  Bike: 4,       // Fuel for 2-wheeler per km
  Bus: 3,        // KSRTC Rajahamsa / Airavat per person equivalent
  Train: 1.5,    // South Western Railway express
  Mixed: 6       // Combination
};

/**
 * Calculates a structured, realistic trip budget estimate.
 */
function estimateBudget({
  totalDistanceKm = 300,
  durationDays = 2,
  travelersCount = 2,
  travelStyle = "Balanced",
  transportType = "Car",
  tier = "moderate",
  attractionCount = 4
}) {
  const travelers = Math.max(1, parseInt(travelersCount, 10) || 1);
  const days = Math.max(1, parseInt(durationDays, 10) || 1);
  const nights = Math.max(1, days - 1);
  const roomsNeeded = Math.ceil(travelers / 2);

  const styleKey = ["Relaxed", "Balanced", "Packed"].includes(travelStyle) ? travelStyle : "Balanced";
  const validTier = ["budget", "moderate", "luxury"].includes(tier) ? tier : "moderate";

  // 1. Transportation
  const costPerKm = TRANSPORT_COST_PER_KM[transportType] || TRANSPORT_COST_PER_KM.Car;
  let transportTotal = 0;
  if (transportType === "Bus" || transportType === "Train") {
    transportTotal = Math.round(totalDistanceKm * costPerKm * travelers) + (200 * days); // Local autos
  } else {
    // Car or Bike (fixed fuel for vehicle, plus tolls)
    const tollEstimate = Math.round((totalDistanceKm / 100) * 120);
    transportTotal = Math.round(totalDistanceKm * costPerKm) + tollEstimate;
  }

  // 2. Accommodation
  const roomRate = (STAY_RATES_PER_ROOM[styleKey] && STAY_RATES_PER_ROOM[styleKey][validTier]) || 2500;
  const stayTotal = roomRate * roomsNeeded * nights;

  // 3. Food & Beverages
  const foodRate = FOOD_PER_PERSON_DAY[styleKey] || 500;
  const foodTotal = foodRate * travelers * days;

  // 4. Activities (Safari, Trekking, Boating, Guide)
  let activityRate = 350;
  if (validTier === "budget") activityRate = 150;
  if (validTier === "luxury") activityRate = 900;
  const activitiesTotal = activityRate * travelers * Math.min(days, attractionCount);

  // 5. Entry Fees & Parking
  const entryFeeTotal = Math.min(attractionCount * 50 * travelers, 800 * travelers);

  // 6. Miscellaneous (Taxes, water, snacks, incidentals)
  const miscTotal = Math.round((transportTotal + stayTotal + foodTotal) * 0.06);

  const totalEstimatedCost = transportTotal + stayTotal + foodTotal + activitiesTotal + entryFeeTotal + miscTotal;
  const costPerPerson = Math.round(totalEstimatedCost / travelers);

  return {
    disclaimer: "Estimated costs — actual prices may vary.",
    currency: "INR",
    currencySymbol: "₹",
    travelers,
    durationDays: days,
    tier: validTier,
    breakdown: {
      transportation: { label: "Transportation (Fuel/Fares & Tolls)", amount: transportTotal },
      accommodation: { label: `Accommodation (${nights} nights, ${roomsNeeded} room${roomsNeeded > 1 ? 's' : ''})`, amount: stayTotal },
      food: { label: `Food & Beverages (${days} days)`, amount: foodTotal },
      activities: { label: "Activities & Sightseeing", amount: activitiesTotal },
      entryFees: { label: "Monument & Forest Entry Fees", amount: entryFeeTotal },
      miscellaneous: { label: "Miscellaneous & Incidentals", amount: miscTotal }
    },
    totalEstimatedCost,
    costPerPerson
  };
}

/**
 * Optimizes an existing itinerary to reduce costs ("Make Trip Cheaper").
 * Generates specific, actionable frugality adjustments.
 */
function makeTripCheaper(currentBudget, routeInfo = {}) {
  const currentTotal = currentBudget.totalEstimatedCost || 6000;
  const travelers = currentBudget.travelers || 2;
  const days = currentBudget.durationDays || 3;

  // Reduced tier calculation
  const optimized = estimateBudget({
    totalDistanceKm: routeInfo.totalDistanceKm || 400,
    durationDays: days,
    travelersCount: travelers,
    travelStyle: "Packed",
    transportType: "Bus",
    tier: "budget"
  });

  const savings = Math.max(0, currentTotal - optimized.totalEstimatedCost);

  const tips = [
    "Opt for KSRTC Rajahamsa/Airavat luxury buses instead of private cabs to cut transport expenses by up to 50%.",
    "Choose certified local Malnad homestays or KSTDC Mayura heritage properties instead of luxury private resorts.",
    "Prioritize natural viewpoints (Mullayanagiri, Matanga Hill, Om Beach cliffs) with zero entry fees over commercial parks.",
    "Enjoy authentic regional thalis at iconic messes (e.g., Hotel Mylari in Mysuru, Shankar Mess in Hampi) for authentic taste at ₹120–₹180/meal.",
    "Travel in a group of 3–4 to split fuel and double-occupancy room costs efficiently."
  ];

  return {
    disclaimer: "Estimated costs — actual prices may vary.",
    originalTotal: currentTotal,
    optimizedTotal: optimized.totalEstimatedCost,
    potentialSavings: savings,
    percentageSaved: currentTotal > 0 ? Math.round((savings / currentTotal) * 100) : 0,
    costPerPerson: optimized.costPerPerson,
    breakdown: optimized.breakdown,
    actionableSavingsTips: tips
  };
}

module.exports = {
  estimateBudget,
  makeTripCheaper
};
