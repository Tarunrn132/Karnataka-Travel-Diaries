/**
 * Karnataka Travel Diaries - AI Trip Planner Frontend Controller
 * Distance-aware, duration-clustered Karnataka Travel Planner.
 */

const AIPlanner = {
  currentPlan: null,
  mapInstance: null,
  routePolyline: null,
  mapMarkers: [],
  loadingInterval: null,

  init() {
    this.initDaysSelector();
    this.initLocationInput();
    this.initTravelTypes();
    this.initOptionPills();
    this.initPreferenceChips();
    this.initFormSubmit();
    this.checkUrlParams();
  },

  // 1. Days Selection Pills
  initDaysSelector() {
    const pills = document.querySelectorAll(".day-pill-btn");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const val = pill.getAttribute("data-days") || "2";
        const hiddenInput = document.getElementById("planDaysInput");
        if (hiddenInput) hiddenInput.value = val;

        // Visual hint for 6-day spiritual special case
        this.checkSpiritualNotice();
      });
    });
  },

  // 2. Location Input & GPS
  initLocationInput() {
    // Quick chips
    document.querySelectorAll(".quick-loc-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const input = document.getElementById("planStartLocation");
        if (input) {
          input.value = chip.innerText.trim();
        }
      });
    });

    // End location toggle
    const endRadios = document.querySelectorAll("input[name='endLocationOption']");
    const diffContainer = document.getElementById("differentEndLocationContainer");
    endRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        if (diffContainer) {
          diffContainer.style.display = e.target.value === "different" ? "block" : "none";
        }
      });
    });

    // GPS Locate
    const locateBtn = document.getElementById("btnLocateMe");
    if (locateBtn) {
      locateBtn.addEventListener("click", () => {
        if (!navigator.geolocation) {
          this.showToast("Geolocation is not supported by your browser.", "error");
          return;
        }
        locateBtn.innerText = "Locating...";
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            // Reverse geocode or use city name
            const input = document.getElementById("planStartLocation");
            if (input) {
              input.value = `Current Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
            }
            locateBtn.innerText = "📍 Located!";
            setTimeout(() => { locateBtn.innerText = "📍 Use Current"; }, 2000);
            this.showToast("GPS position set as origin!", "success");
          },
          (err) => {
            locateBtn.innerText = "📍 Use Current";
            this.showToast("Could not retrieve GPS location. Please select a city.", "info");
          },
          { timeout: 7000 }
        );
      });
    }
  },

  // 3. Travel Type Selection Cards
  initTravelTypes() {
    const cards = document.querySelectorAll(".type-card");
    cards.forEach(card => {
      card.addEventListener("click", () => {
        cards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        const typeVal = card.getAttribute("data-type") || "Mixed Karnataka";
        const hiddenInput = document.getElementById("planTravelTypeInput");
        if (hiddenInput) hiddenInput.value = typeVal;

        this.checkSpiritualNotice();
      });
    });
  },

  checkSpiritualNotice() {
    const daysVal = document.getElementById("planDaysInput")?.value || "2";
    const typeVal = document.getElementById("planTravelTypeInput")?.value || "";
    const notice = document.getElementById("spiritualSpecialBanner");
    if (notice) {
      if (parseInt(daysVal, 10) === 6 && (typeVal.includes("Temple") || typeVal.includes("Spiritual"))) {
        notice.style.display = "block";
      } else {
        notice.style.display = "none";
      }
    }
  },

  // 4. Option Pills (Pace, Budget, Travel Mode)
  initOptionPills() {
    // Pace
    document.querySelectorAll(".pace-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".pace-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const input = document.getElementById("planPaceInput");
        if (input) input.value = btn.getAttribute("data-pace");
      });
    });

    // Budget
    document.querySelectorAll(".budget-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".budget-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const input = document.getElementById("planBudgetInput");
        if (input) input.value = btn.getAttribute("data-budget");
      });
    });

    // Travel Mode
    document.querySelectorAll(".mode-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".mode-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const input = document.getElementById("planModeInput");
        if (input) input.value = btn.getAttribute("data-mode");
      });
    });
  },

  // 5. Preferences Multi-select Chips
  initPreferenceChips() {
    document.querySelectorAll(".pref-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
        const cb = chip.querySelector("input[type='checkbox']");
        if (cb) cb.checked = chip.classList.contains("selected");
      });
    });
  },

  // 6. Form Submission
  initFormSubmit() {
    const form = document.getElementById("aiPlanTripForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.generateItinerary();
    });
  },

  getFormData() {
    const days = parseInt(document.getElementById("planDaysInput")?.value || "2", 10);
    const startLocation = document.getElementById("planStartLocation")?.value?.trim() || "Bengaluru";
    
    // Ending location
    const endOption = document.querySelector("input[name='endLocationOption']:checked")?.value || "same";
    let endLocation = "same";
    if (endOption === "different") {
      endLocation = document.getElementById("planDifferentEndLocation")?.value?.trim() || startLocation;
    } else if (endOption === "open") {
      endLocation = "open";
    }

    const travelType = document.getElementById("planTravelTypeInput")?.value || "Temple & Spiritual";
    const pace = document.getElementById("planPaceInput")?.value || "Balanced";
    const budget = document.getElementById("planBudgetInput")?.value || "Moderate";
    const travelMode = document.getElementById("planModeInput")?.value || "Car";
    const travelers = document.getElementById("planTravelersInput")?.value || "2 Travelers";

    const preferences = [];
    document.querySelectorAll(".pref-chip.selected").forEach(chip => {
      const val = chip.getAttribute("data-pref");
      if (val) preferences.push(val);
    });

    const userPrompt = document.getElementById("planUserPrompt")?.value?.trim() || "";
    const placesToVisit = document.getElementById("planPlacesToVisit")?.value?.trim() || "";
    const placesToAvoid = document.getElementById("planPlacesToAvoid")?.value?.trim() || "";

    return {
      days,
      durationDays: days,
      startLocation,
      endLocation,
      travelType,
      pace,
      budget,
      travelMode,
      travelers,
      preferences,
      userPrompt,
      placesToVisit,
      placesToAvoid
    };
  },

  async generateItinerary(customData = null) {
    const payload = customData || this.getFormData();
    this.showLoadingState();

    try {
      const response = await fetch("/api/ai/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const plan = await response.json();
      if (!plan || !plan.days) {
        throw new Error("Invalid itinerary payload returned by server");
      }

      this.currentPlan = plan;
      this.hideLoadingState();
      this.renderItinerary(plan);
      this.showToast("AI Itinerary successfully created! ✨", "success");

      // Smooth scroll to output
      const out = document.getElementById("planOutputSection");
      if (out) {
        out.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      console.error("AI Planner error:", err);
      this.hideLoadingState();
      this.showToast("AI Trip Planner is temporarily unavailable. Please try again.", "error");
    }
  },

  showLoadingState() {
    const loadingBox = document.getElementById("aiLoadingBox");
    const outputSection = document.getElementById("planOutputSection");
    const submitBtn = document.getElementById("btnSubmitPlan");

    if (loadingBox) loadingBox.style.display = "block";
    if (outputSection) outputSection.style.display = "none";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳</span> Calculating Optimal Route...`;
    }

    const steps = [
      "1/4 • Filtering Karnataka destinations by category & region...",
      "2/4 • Analyzing duration feasibility & geographic clustering...",
      "3/4 • Calculating verified road distances & driving times...",
      "4/4 • Crafting daily morning, afternoon & evening schedule..."
    ];

    let currentStep = 0;
    const stepTextEl = document.getElementById("aiLoadingStepText");
    if (stepTextEl) stepTextEl.innerText = steps[0];

    if (this.loadingInterval) clearInterval(this.loadingInterval);
    this.loadingInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length && stepTextEl) {
        stepTextEl.innerText = steps[currentStep];
      }
    }, 700);
  },

  hideLoadingState() {
    if (this.loadingInterval) clearInterval(this.loadingInterval);
    const loadingBox = document.getElementById("aiLoadingBox");
    const submitBtn = document.getElementById("btnSubmitPlan");

    if (loadingBox) loadingBox.style.display = "none";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>✨</span> Generate My AI Itinerary`;
    }
  },

  // 7. Render Itinerary
  renderItinerary(plan) {
    const out = document.getElementById("planOutputSection");
    if (!out) return;
    out.style.display = "block";
    out.classList.add("visible");

    // Title & Summary
    const titleEl = document.getElementById("outTripTitle");
    if (titleEl) titleEl.innerText = plan.tripTitle || "Karnataka Custom Journey";

    const leadEl = document.getElementById("outTripLead");
    if (leadEl) leadEl.innerText = plan.summary || "";

    // Metrics Bar
    const metricDays = document.getElementById("metricDays");
    if (metricDays) metricDays.innerText = `${plan.daysCount || plan.days.length} Days`;

    const metricType = document.getElementById("metricType");
    if (metricType) metricType.innerText = plan.travelType || "Travel";

    const metricStart = document.getElementById("metricStart");
    if (metricStart) metricStart.innerText = plan.startLocation || "Bengaluru";

    const metricMode = document.getElementById("metricMode");
    if (metricMode) metricMode.innerText = plan.travelMode || "Car";

    const metricPace = document.getElementById("metricPace");
    if (metricPace) metricPace.innerText = plan.pace || "Balanced";

    const metricDist = document.getElementById("metricDistance");
    if (metricDist) metricDist.innerText = `${plan.totalDistanceKm || 0} km`;

    const metricHours = document.getElementById("metricDriveHours");
    if (metricHours) metricHours.innerText = `${plan.totalDriveHours || 0} hrs`;

    // Aggressive travel warning
    const warningBox = document.getElementById("outTravelWarningAlert");
    if (warningBox) {
      if (plan.travelWarning) {
        warningBox.style.display = "flex";
        warningBox.innerHTML = `<span>⚠️</span> <div>${plan.travelWarning}</div>`;
      } else {
        warningBox.style.display = "none";
      }
    }

    // "Why this itinerary?"
    const whyText = document.getElementById("outWhyThisItineraryText");
    if (whyText) {
      whyText.innerText = plan.whyThisItinerary || "Geographically clustered Karnataka itinerary designed to eliminate backtracking.";
    }

    // Google Maps Navigation Link
    const navBtn = document.getElementById("btnGoogleMapsNav");
    if (navBtn && plan.googleMapsUrl) {
      navBtn.href = plan.googleMapsUrl;
    }

    // Render Daily Timeline Cards
    this.renderTimelineCards(plan.days);

    // Render Budget Overview
    this.renderBudgetCard(plan.budget);
  },

  // 8. Navigation & Route Link (Map display removed per user directive)
  renderRouteMap(plan) {
    const navBtn = document.getElementById("btnGoogleMapsNav");
    if (navBtn && plan.googleMapsUrl) {
      navBtn.href = plan.googleMapsUrl;
    }
  },

  zoomToFullRoute() {
    if (this.currentPlan?.googleMapsUrl) {
      window.open(this.currentPlan.googleMapsUrl, "_blank");
    }
  },

  // 9. Render Daily Timeline Cards
  renderTimelineCards(days = []) {
    const container = document.getElementById("dailyTimelineCardsContainer");
    if (!container) return;
    container.innerHTML = "";

    days.forEach((day, idx) => {
      const card = document.createElement("div");
      card.className = "day-timeline-card";

      const morningActs = (day.morning?.activities || []).map(a => `<span class="activity-tag">✓ ${a}</span>`).join("");
      const afternoonActs = (day.afternoon?.activities || []).map(a => `<span class="activity-tag">✓ ${a}</span>`).join("");
      const eveningActs = (day.evening?.activities || []).map(a => `<span class="activity-tag">✓ ${a}</span>`).join("");

      card.innerHTML = `
        <div class="day-card-header">
          <div class="day-card-title-group">
            <span class="day-circle-badge">DAY ${day.dayNumber || idx + 1}</span>
            <span class="day-route-text">📍 ${day.route || day.destination}</span>
          </div>
          <div class="day-badges-strip">
            <span class="day-meta-pill">🚗 ${day.distanceKm} km</span>
            <span class="day-meta-pill">⏱️ ${day.driveHours} hrs</span>
            <span class="day-meta-pill overnight">🏨 ${day.overnight || 'Overnight'}</span>
          </div>
        </div>

        <div class="day-card-body">
          <div class="time-slot-grid">
            <!-- Morning Slot -->
            <div class="time-slot-block">
              <div class="slot-icon-col">
                <div class="slot-icon-badge">🌅</div>
                <div class="slot-vert-line"></div>
              </div>
              <div class="slot-content-col">
                <span class="slot-timing-pill">${day.morning?.time || 'Morning'}</span>
                <h4 class="slot-title">${day.morning?.title || 'Morning Exploration'}</h4>
                <p class="slot-desc">${day.morning?.description || ''}</p>
                <div class="slot-activities-list">${morningActs}</div>
              </div>
            </div>

            <!-- Afternoon Slot -->
            <div class="time-slot-block">
              <div class="slot-icon-col">
                <div class="slot-icon-badge">☀️</div>
                <div class="slot-vert-line"></div>
              </div>
              <div class="slot-content-col">
                <span class="slot-timing-pill">${day.afternoon?.time || 'Afternoon'}</span>
                <h4 class="slot-title">${day.afternoon?.title || 'Afternoon Sightseeing'}</h4>
                <p class="slot-desc">${day.afternoon?.description || ''}</p>
                <div class="slot-activities-list">${afternoonActs}</div>
              </div>
            </div>

            <!-- Evening Slot -->
            <div class="time-slot-block">
              <div class="slot-icon-col">
                <div class="slot-icon-badge">🌙</div>
              </div>
              <div class="slot-content-col">
                <span class="slot-timing-pill">${day.evening?.time || 'Evening'}</span>
                <h4 class="slot-title">${day.evening?.title || 'Evening & Cultural Experience'}</h4>
                <p class="slot-desc">${day.evening?.description || ''}</p>
                <div class="slot-activities-list">${eveningActs}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="day-card-footer">
          <div class="footer-meal-note">
            <span>🍛</span> <span><strong>Meals:</strong> ${day.meals || 'Traditional local meals & refreshments'}</span>
          </div>
          <button type="button" class="btn-remove-day-place" onclick="AIPlanner.removePlace('${day.destinationSlug || day.destination}')">
            ✕ Remove Stop
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  },

  // 10. Budget Breakdown
  renderBudgetCard(budget) {
    if (!budget) return;
    const bTrans = document.getElementById("budgetItemTransport");
    const bStay = document.getElementById("budgetItemStay");
    const bFood = document.getElementById("budgetItemFood");
    const bActs = document.getElementById("budgetItemActivities");
    const bTotal = document.getElementById("budgetTotalAmount");
    const bPerson = document.getElementById("budgetPerPersonAmount");

    if (bTrans) bTrans.innerText = `₹${(budget.breakdown?.transportation?.amount || 0).toLocaleString('en-IN')}`;
    if (bStay) bStay.innerText = `₹${(budget.breakdown?.accommodation?.amount || 0).toLocaleString('en-IN')}`;
    if (bFood) bFood.innerText = `₹${(budget.breakdown?.food?.amount || 0).toLocaleString('en-IN')}`;
    if (bActs) bActs.innerText = `₹${(budget.breakdown?.activities?.amount || 0).toLocaleString('en-IN')}`;
    if (bTotal) bTotal.innerText = `₹${(budget.totalEstimatedCost || 0).toLocaleString('en-IN')}`;
    if (bPerson) bPerson.innerText = `(Approx. ₹${(budget.costPerPerson || 0).toLocaleString('en-IN')} per traveler)`;
  },

  // 11. Modification Actions (Section 15)
  async modifyActivePlan(action, payload = {}) {
    if (!this.currentPlan) return;
    this.showLoadingState();

    try {
      const res = await fetch("/api/ai/modify-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPlan: this.currentPlan,
          action,
          payload
        })
      });

      if (!res.ok) throw new Error("Modification failed");
      const updated = await res.json();
      this.currentPlan = updated;
      this.hideLoadingState();
      this.renderItinerary(updated);
      this.showToast(`Itinerary updated (${action.replace('_', ' ')}) ✨`, "success");
    } catch (e) {
      this.hideLoadingState();
      this.showToast("Could not modify itinerary. Please try again.", "error");
    }
  },

  optimizeTrip() {
    this.modifyActivePlan("optimize");
  },

  makeTripRelaxed() {
    this.modifyActivePlan("make_relaxed");
  },

  slowDownTrip() {
    this.modifyActivePlan("make_relaxed");
  },

  reduceTravelTime() {
    this.modifyActivePlan("reduce_travel_time");
  },

  makeTripFaster() {
    this.modifyActivePlan("reduce_travel_time");
  },

  addTemples() {
    this.modifyActivePlan("add_temples");
  },

  addBeaches() {
    this.modifyActivePlan("add_beaches");
  },

  addNature() {
    this.modifyActivePlan("add_nature");
  },

  addPhotography() {
    this.modifyActivePlan("add_photography");
  },

  makeBudgetFriendly() {
    this.modifyActivePlan("make_budget_friendly");
  },

  promptRemovePlace() {
    const place = prompt("Enter the destination name to remove (e.g. Karwar, Honnavar, Udupi):");
    if (place && place.trim().length > 0) {
      this.modifyActivePlan("remove_destination", { placeName: place.trim() });
    }
  },

  changeTravelMode() {
    const modes = ["Car", "Bike", "Bus", "Train + Local Transport"];
    const current = this.currentPlan?.travelMode || "Car";
    const next = modes[(modes.indexOf(current) + 1) % modes.length];
    this.modifyActivePlan("change_mode", { travelMode: next });
  },

  removePlace(placeSlug) {
    if (!confirm(`Are you sure you want to remove this stop from your itinerary?`)) return;
    this.modifyActivePlan("remove_place", { placeName: placeSlug });
  },

  promptAddPlace() {
    const place = prompt("Enter the name of a Karnataka destination to add (e.g. Sringeri, Kudremukh, Belur, Gokarna):");
    if (place && place.trim().length > 0) {
      this.modifyActivePlan("add_place", { placeName: place.trim() });
    }
  },

  promptChangeDays() {
    const daysStr = prompt("Enter new duration in days (1–10):", this.currentPlan?.daysCount || 2);
    const num = parseInt(daysStr, 10);
    if (!isNaN(num) && num >= 1 && num <= 10) {
      this.modifyActivePlan("change_days", { days: num });
    }
  },

  async saveToMyTrips() {
    if (!this.currentPlan) return;
    const saveBtn = document.getElementById("btnSaveToTrips");
    if (saveBtn) saveBtn.innerText = "Saving...";

    try {
      const res = await fetch("/api/ai/save-to-trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: this.currentPlan })
      });

      const data = await res.json();
      if (data.success) {
        if (saveBtn) saveBtn.innerText = "Saved to Trips! ✓";
        this.showToast("Trip saved! You can view it in the Trips tab anytime.", "success");
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      if (saveBtn) saveBtn.innerText = "💾 Save to Trips";
      this.showToast("Could not save trip.", "error");
    }
  },

  // 12. URL Parameter Pre-fill (e.g. ?type=spiritual&days=6&start=bengaluru)
  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const days = params.get("days");
    const type = params.get("type");
    const start = params.get("start");

    if (days) {
      const pill = document.querySelector(`.day-pill-btn[data-days="${days}"]`);
      if (pill) pill.click();
    }
    if (type) {
      const typeLower = type.toLowerCase().replace(/[^a-z0-9]/g, "");
      const allCards = document.querySelectorAll(".type-card");
      let matchedCard = null;
      for (const card of allCards) {
        const dType = (card.getAttribute("data-type") || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        if (dType.includes(typeLower) || typeLower.includes(dType)) {
          matchedCard = card;
          break;
        }
      }
      if (matchedCard) {
        matchedCard.click();
      }
    }
    if (start) {
      const input = document.getElementById("planStartLocation");
      if (input) input.value = start;
    }

    if (params.get("auto") === "true") {
      setTimeout(() => { this.generateItinerary(); }, 300);
    }
  },

  showToast(msg, type = "info") {
    if (window.showToast) {
      window.showToast(msg, type);
      return;
    }
    const t = document.createElement("div");
    t.style.position = "fixed";
    t.style.bottom = "24px";
    t.style.left = "50%";
    t.style.transform = "translateX(-50%)";
    t.style.background = type === "error" ? "#B91C1C" : type === "success" ? "#1B4332" : "#1C1E21";
    t.style.color = "#ffffff";
    t.style.padding = "10px 20px";
    t.style.borderRadius = "9999px";
    t.style.fontSize = "13px";
    t.style.fontWeight = "700";
    t.style.zIndex = "9999";
    t.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.remove(); }, 3000);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  AIPlanner.init();
});

if (typeof window !== "undefined") {
  window.AIPlanner = AIPlanner;
}
