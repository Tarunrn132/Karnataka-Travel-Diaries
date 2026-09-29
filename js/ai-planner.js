/**
 * Karnataka Travel Diaries - AI Travel Hub & Itinerary Planner
 * Destination-Clustered, Distance-Aware Karnataka Travel Planning Frontend.
 */

const AIPlanner = {
  currentGeneratedTrip: null,
  currentBudget: null,
  activeLoadingInterval: null,

  init() {
    this.initFormListeners();
    this.initChipToggles();
  },

  initChipToggles() {
    document.querySelectorAll(".interest-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
        const checkbox = chip.querySelector("input[type='checkbox']");
        if (checkbox) checkbox.checked = chip.classList.contains("selected");
      });
    });
  },

  setTripMode(isSpiritual) {
    const hiddenInput = document.getElementById("planIsSpiritual");
    const btnStandard = document.getElementById("btnModeStandard");
    const btnSpiritual = document.getElementById("btnModeSpiritual");
    const destSelect = document.getElementById("planPrimaryDestination");

    if (hiddenInput) hiddenInput.value = isSpiritual ? "true" : "false";

    if (btnStandard && btnSpiritual) {
      if (isSpiritual) {
        btnSpiritual.style.background = "#ffffff";
        btnSpiritual.style.color = "#b45309";
        btnSpiritual.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
        btnStandard.style.background = "transparent";
        btnStandard.style.color = "#64748b";
        btnStandard.style.boxShadow = "none";
      } else {
        btnStandard.style.background = "#ffffff";
        btnStandard.style.color = "var(--dark-text)";
        btnStandard.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
        btnSpiritual.style.background = "transparent";
        btnSpiritual.style.color = "#64748b";
        btnSpiritual.style.boxShadow = "none";
      }
    }

    // Toggle Spiritual Chip
    const chips = document.querySelectorAll(".interest-chip");
    chips.forEach(chip => {
      const val = chip.querySelector("input")?.value || "";
      if (val === "Religious") {
        if (isSpiritual) {
          chip.classList.add("selected");
          chip.querySelector("input").checked = true;
        }
      }
    });

    if (isSpiritual && destSelect && !destSelect.value) {
      destSelect.value = "dharmasthala";
    }
  },

  quickLaunchSpiritual(days = 6) {
    this.setTripMode(true);
    const daysSelect = document.getElementById("planDays");
    if (daysSelect) daysSelect.value = String(days);
    const destSelect = document.getElementById("planPrimaryDestination");
    if (destSelect) destSelect.value = "dharmasthala";

    const formSection = document.getElementById("plannerFormSection");
    if (formSection) formSection.scrollIntoView({ behavior: "smooth" });

    this.handlePlanTripSubmit();
  },

  initFormListeners() {
    const form = document.getElementById("aiPlanTripForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handlePlanTripSubmit();
      });
    }
  },

  async handlePlanTripSubmit() {
    const startLoc = document.getElementById("planStartLocation")?.value?.trim() || "Bengaluru";
    const days = parseInt(document.getElementById("planDays")?.value, 10) || 3;
    const budget = parseInt(document.getElementById("planBudget")?.value, 10) || 8000;
    const travelers = parseInt(document.getElementById("planTravelers")?.value, 10) || 2;
    const travelWith = document.getElementById("planTravelWith")?.value || "Friends";
    const transport = document.getElementById("planTransport")?.value || "Car";
    const travelStyle = document.getElementById("planStyle")?.value || "Balanced";
    const primaryDest = document.getElementById("planPrimaryDestination")?.value || null;
    const isSpiritual = document.getElementById("planIsSpiritual")?.value === "true";

    // Collect selected interests
    const selectedInterests = [];
    document.querySelectorAll(".interest-chip.selected input").forEach(input => {
      selectedInterests.push(input.value);
    });

    if (isSpiritual && !selectedInterests.includes("Religious")) {
      selectedInterests.push("Religious");
      selectedInterests.push("Spiritual");
    }

    // Show loading state with micro-animations
    this.showLoadingUI(isSpiritual);

    try {
      const res = await fetch("/api/ai/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startingLocation: startLoc,
          returnLocation: startLoc,
          days,
          budget,
          travelers,
          travelWith,
          transport,
          travelStyle,
          interests: selectedInterests,
          primaryDestination: primaryDest,
          isSpiritualCircuit: isSpiritual
        })
      });

      const data = await res.json();
      this.hideLoadingUI();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate itinerary");
      }

      this.currentGeneratedTrip = data;
      this.currentBudget = data.budget;
      this.renderGeneratedItinerary(data);

      // Scroll smoothly to output
      const outputElem = document.getElementById("itineraryOutputSection");
      if (outputElem) {
        outputElem.scrollIntoView({ behavior: "smooth" });
      }

      if (window.showToast) {
        window.showToast("Your destination-clustered Karnataka itinerary is ready! ✨", "success");
      }
    } catch (err) {
      this.hideLoadingUI();
      alert(`Itinerary generation failed: ${err.message || 'Please check your connection and try again.'}`);
    }
  },

  showLoadingUI(isSpiritual = false) {
    const outputContainer = document.getElementById("itineraryOutputContainer");
    if (!outputContainer) return;

    outputContainer.innerHTML = `
      <div class="ai-loading-container">
        <div class="ai-loading-spinner"></div>
        <div class="ai-loading-step-text" id="aiLoadingStep">
          ${isSpiritual ? '🛕 Aligning temple opening hours and sacred corridors...' : '✨ Analyzing destination clusters and distances...'}
        </div>
        <p class="ai-loading-subtext">
          Calculating realistic driving distances, morning-afternoon-evening movement, and scenic Karnataka highway corridors.
        </p>
      </div>
    `;

    const steps = isSpiritual ? [
      "🛕 Consulting Karnataka temple timings & visiting hours...",
      "📍 Arranging sacred corridor: Dharmasthala → Kukke → Coastal shrines...",
      "🗺️ Calculating travel distance and avoiding backtracking...",
      "💰 Estimating transparent travel budget...",
      "✨ Finalizing your sacred Karnataka pilgrimage..."
    ] : [
      "✨ Identifying your primary destination anchor...",
      "📍 Clustering geographically neighbouring destinations...",
      "🗺️ Optimizing road-trip sequence without zig-zags...",
      "🏨 Planning realistic morning, afternoon & overnight stays...",
      "✨ Assembling your personalized Karnataka journey..."
    ];

    let stepIdx = 0;
    this.activeLoadingInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      const stepElem = document.getElementById("aiLoadingStep");
      if (stepElem) {
        stepElem.style.opacity = "0";
        setTimeout(() => {
          stepElem.textContent = steps[stepIdx];
          stepElem.style.opacity = "1";
        }, 150);
      }
    }, 900);
  },

  hideLoadingUI() {
    if (this.activeLoadingInterval) {
      clearInterval(this.activeLoadingInterval);
      this.activeLoadingInterval = null;
    }
  },

  renderGeneratedItinerary(data) {
    const container = document.getElementById("itineraryOutputContainer");
    if (!container) return;

    const ts = data.trip_summary || {};
    const s = data.summary || {};
    const b = data.budget || {};
    const w = data.weather || {};
    const isSpiritual = ts.mode === "spiritual_circuit" || data.spiritual_circuit?.isSpiritualTrip;

    // Build Overview Stat Strip
    const totalDist = ts.total_distance_km ? `~${ts.total_distance_km} km` : s.estimatedDistance;
    const totalDrive = ts.estimated_travel_hours ? `~${ts.estimated_travel_hours} hrs` : s.estimatedDriveHours;
    const overnightsText = (ts.recommended_overnights && ts.recommended_overnights.length > 0)
      ? ts.recommended_overnights.join(", ")
      : data.days.map(d => d.destination).filter((v, i, a) => a.indexOf(v) === i).join(", ");

    container.innerHTML = `
      <!-- 1. TRIP OVERVIEW HERO BANNER (Section 19) -->
      <div style="background: ${isSpiritual ? 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #1e1b4b 100%)' : 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)'}; border-radius:var(--radius-xl); padding:32px; color:white; margin-bottom:28px; box-shadow:var(--shadow-premium); border:1px solid rgba(255,255,255,0.14);">
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:18px;">
          <div>
            <div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-bottom:12px;">
              <span class="mode-badge-pill">
                ${isSpiritual ? '🛕 ' : '✨ '} ${ts.modeLabel || 'DESTINATION CLUSTER'}
              </span>
              <span style="background:rgba(255,255,255,0.15); padding:4px 10px; border-radius:12px; font-size:11px; font-weight:700; color:#cbd5e1;">
                📍 Region: ${ts.region || 'Karnataka'}
              </span>
              <span style="background:rgba(255,255,255,0.15); padding:4px 10px; border-radius:12px; font-size:11px; font-weight:700; color:#cbd5e1;">
                🏛️ District: ${ts.primary_district || 'Karnataka'}
              </span>
              <span style="background:rgba(255,255,255,0.15); padding:4px 10px; border-radius:12px; font-size:11px; font-weight:700; color:#cbd5e1;">
                🧭 Taluk: ${ts.primary_taluk || 'Karnataka'}
              </span>
            </div>
            <h2 style="font-size:26px; font-weight:800; line-height:1.25; margin-bottom:6px; color:#ffffff;">${ts.title || s.title}</h2>
            <p style="font-size:13px; color:#cbd5e1; line-height:1.5;">${s.routeSummary}</p>
            ${ts.districts_covered && ts.districts_covered.length > 0 ? `
              <div style="font-size:11px; color:#94a3b8; margin-top:6px;">
                🗺️ <strong>Districts Traversed:</strong> ${ts.districts_covered.join(' → ')}
                ${ts.taluks_covered && ts.taluks_covered.length > 0 ? ` | <strong>Taluks:</strong> ${ts.taluks_covered.slice(0, 6).join(', ')}${ts.taluks_covered.length > 6 ? '...' : ''}` : ''}
              </div>
            ` : ''}
          </div>
          
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn btn-primary btn-sm" onclick="AIPlanner.saveThisTrip()">
              💾 Save This Trip
            </button>
            ${data.route.googleMapsUrl ? `
              <a href="${data.route.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color:var(--primary-brand); background:#ffffff;">
                🗺️ Full Route in Google Maps
              </a>
            ` : ''}
          </div>
        </div>

        <!-- Metric Stat Strip (Section 19: Trip Overview) -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; border-top:1px solid rgba(255,255,255,0.12); padding-top:18px;">
          <div>
            <div style="font-size:11px; opacity:0.8;">⏱️ Duration</div>
            <div style="font-size:16px; font-weight:800;">${ts.duration || data.days.length} Days</div>
          </div>
          <div>
            <div style="font-size:11px; opacity:0.8;">🚗 Total Distance</div>
            <div style="font-size:16px; font-weight:800;">${totalDist}</div>
          </div>
          <div>
            <div style="font-size:11px; opacity:0.8;">⏳ Est. Driving Time</div>
            <div style="font-size:16px; font-weight:800;">${totalDrive}</div>
          </div>
          <div>
            <div style="font-size:11px; opacity:0.8;">📍 Destinations</div>
            <div style="font-size:16px; font-weight:800;">${ts.destinations_count || data.destinations.length} Hubs</div>
          </div>
          <div>
            <div style="font-size:11px; opacity:0.8;">🏛️ Attractions</div>
            <div style="font-size:16px; font-weight:800;">${ts.attractions_count || (data.destinations.length * 3)} Spots</div>
          </div>
          <div>
            <div style="font-size:11px; opacity:0.8;">💰 Total Est. Budget</div>
            <div style="font-size:16px; font-weight:800; color:#fde047;">${s.estimatedBudget}</div>
          </div>
        </div>

        <div style="margin-top:12px; font-size:12px; color:#e2e8f0; display:flex; align-items:center; gap:6px;">
          <span>🏨 <strong>Recommended Stays:</strong> ${overnightsText}</span>
        </div>
      </div>

      <!-- 2. REAL WEATHER INSIGHT -->
      ${w && w.factualWeather ? `
        <div style="background:#ffffff; border-radius:18px; padding:18px 22px; border:1px solid #dcfce7; margin-bottom:24px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px; box-shadow:0 2px 10px rgba(0,0,0,0.03);">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:44px; height:44px; border-radius:12px; background:#dcfce7; color:#16a34a; display:flex; align-items:center; justify-content:center; font-size:22px;">
              🌤️
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:14px; font-weight:800; color:var(--dark-text);">${w.destination}</span>
                <span style="font-size:12px; font-weight:700; color:#16a34a;">${w.factualWeather.temperature} • ${w.factualWeather.condition}</span>
                <span style="font-size:10px; color:#64748b; background:#f1f5f9; padding:2px 6px; border-radius:4px;">${w.source}</span>
              </div>
              <p style="font-size:12px; color:#475569; margin-top:3px; line-height:1.5;">${w.aiTravelNote || 'Pleasant weather for travel across Karnataka.'}</p>
            </div>
          </div>
          <div style="font-size:11px; color:#94a3b8; font-style:italic;">
            Rain chance: ${w.factualWeather.rainProbability}
          </div>
        </div>
      ` : ''}

      <!-- 3. DAY BY DAY JOURNEY TIMELINE (Section 19) -->
      <div style="margin-bottom:36px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <h3 style="font-size:22px; font-weight:800; color:var(--dark-text);">District–Taluk Journey Roadmap</h3>
            <p style="font-size:13px; color:#64748b;">Distance-aware, cluster-optimized schedules organized by administrative taluks &amp; driving corridors.</p>
          </div>
          <span style="font-size:12px; color:#64748b; font-weight:700;">${data.days.length} Daily Stages</span>
        </div>

        <div class="itinerary-timeline">
          ${data.days.map(day => `
            <div class="itinerary-day-card">
              <div class="itinerary-day-media">
                <img src="${day.image}" alt="${day.destination}" onerror="this.src='images/hero/karnataka-hero.jpg'" />
                <div class="day-badge-corner">DAY ${day.dayNumber}</div>
              </div>
              <div class="itinerary-day-body">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                    <div>
                      <h4 style="font-size:18px; font-weight:800; color:var(--dark-text); margin-bottom:4px;">${day.title}</h4>
                      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; font-size:12px;">
                        <span style="font-weight:700; color:var(--primary-brand);">📍 ${day.destination}</span>
                        <span style="color:#64748b;">•</span>
                        <span style="color:#475569; font-weight:600;">🏛️ ${day.taluk || ''}</span>
                        <span style="color:#64748b;">•</span>
                        <span style="color:#475569;">${day.district || ''} District</span>
                      </div>
                      ${day.hierarchy ? `
                        <div style="font-size:11px; color:#0284c7; font-weight:600; margin-top:4px;">
                          🗺️ ${day.hierarchy}
                        </div>
                      ` : ''}
                    </div>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="Destinations.getDirections(${day.latitude}, ${day.longitude}, '${day.destination.replace(/'/g, "\\'")}')">
                      🧭 Directions
                    </button>
                  </div>

                  <!-- Inter-City Travel Leg Badge (Section 19 Requirement) -->
                  ${day.travelLeg ? `
                    <div class="travel-leg-strip">
                      <div class="travel-leg-pill">
                        <span>🚗 Travel:</span>
                        <span>${day.travelLeg.from}</span>
                        <span>→</span>
                        <span>${day.travelLeg.to}</span>
                        ${day.travelLeg.road_type ? `<span style="background:rgba(255,255,255,0.25); padding:1px 6px; border-radius:4px; font-size:9px; text-transform:uppercase;">${day.travelLeg.road_type}</span>` : ''}
                      </div>
                      <div style="display:flex; gap:12px; font-size:11px; font-weight:700;">
                        <span>Distance: ~${day.travelLeg.distanceKm} km</span>
                        <span>Travel time: ~${day.travelLeg.driveHours} hrs</span>
                        ${day.daily_distance_budget ? `<span style="color:#0369a1; background:#e0f2fe; padding:1px 6px; border-radius:4px;">Daily Travel Distance: ~${day.dailyTravelDistance || day.daily_distance_budget.dailyTravelDistance || day.daily_distance_budget.maxTravelKm} km</span>` : ''}
                      </div>
                    </div>
                  ` : ''}

                  <!-- Daily Slots: Morning, Afternoon, Evening -->
                  <div class="slot-block">
                    <span class="slot-label">🌅 Morning</span>
                    <p class="slot-text">${day.morning}</p>
                  </div>

                  <div class="slot-block">
                    <span class="slot-label">☀️ Afternoon</span>
                    <p class="slot-text">${day.afternoon}</p>
                  </div>

                  <div class="slot-block">
                    <span class="slot-label">🌙 Evening</span>
                    <p class="slot-text">${day.evening}</p>
                  </div>

                  <!-- Featured Day Attractions with Visiting Hours and Taluk Badges -->
                  ${day.attractions && day.attractions.length > 0 ? `
                    <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
                      <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">Highlights in this Taluk:</div>
                      <div style="display:flex; flex-wrap:wrap; gap:8px;">
                        ${day.attractions.map(a => `
                          <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:6px 12px; border-radius:10px; font-size:11px; display:inline-flex; align-items:center; gap:8px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
                            ${a.image ? `<img src="${a.image}" alt="${a.name}" style="width:28px; height:28px; border-radius:6px; object-fit:cover;" onerror="this.style.display='none'" />` : ''}
                            <div>
                              <strong style="color:var(--dark-text);">${a.name}</strong>
                              <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                                ${a.taluk ? `<span style="font-size:10px; color:#475569; background:#e2e8f0; padding:1px 5px; border-radius:4px;">🏛️ ${a.taluk}</span>` : ''}
                                ${a.visitingHours ? `<span class="visiting-time-badge">🕒 ${a.visitingHours}</span>` : ''}
                              </div>
                            </div>
                          </div>
                        `).join("")}
                      </div>
                    </div>
                  ` : ''}
                </div>

                <!-- Footer: Stay & Destination link -->
                <div style="padding-top:14px; margin-top:14px; border-top:1px solid #f1f5f9; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:8px;">
                  <span style="font-size:12px; font-weight:700; color:#334155;">🏨 Overnight: ${day.stay || day.overnight}</span>
                  <a href="destination.html?id=${day.destinationSlug}" style="font-size:12px; font-weight:700; color:var(--primary-brand);">
                    Explore ${day.destination} Details →
                  </a>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- 4. DESTINATION INSIGHTS ("WHY THIS PLACE?" - Section 20) -->
      ${data.destinations && data.destinations.length > 0 ? `
        <div style="margin-bottom:36px;">
          <div style="margin-bottom:16px;">
            <div class="section-tag">🧭 Destination Intelligence</div>
            <h3 style="font-size:20px; font-weight:800; color:var(--dark-text);">Why Visit These Destinations?</h3>
            <p style="font-size:12px; color:#64748b;">Key highlights, local fame, and best nearby excursions for every primary stop.</p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:18px;">
            ${data.destinations.map(dest => `
              <div class="dest-why-section">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                  <div>
                    <h4 style="font-size:16px; font-weight:800; color:var(--dark-text);">${dest.name}</h4>
                    <span style="font-size:11px; color:#64748b;">${dest.district} District</span>
                  </div>
                  <a href="destination.html?id=${dest.slug}" style="font-size:11px; font-weight:700; color:var(--primary-brand);">
                    View Page →
                  </a>
                </div>

                <div style="margin-bottom:10px;">
                  <strong style="font-size:11px; color:#475569; display:block; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Why Visit?</strong>
                  <p style="font-size:12px; color:#334155; line-height:1.5;">${dest.whyVisit}</p>
                </div>

                <div style="margin-bottom:12px;">
                  <strong style="font-size:11px; color:#475569; display:block; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">Famous For</strong>
                  <div>
                    ${(dest.famousFor || []).map(f => `<span class="dest-tag-chip">✨ ${f}</span>`).join("")}
                  </div>
                </div>

                ${dest.bestNearbyPlaces && dest.bestNearbyPlaces.length > 0 ? `
                  <div style="border-top:1px dashed #e2e8f0; padding-top:10px; margin-top:10px;">
                    <strong style="font-size:11px; color:#475569; display:block; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Best Nearby Places</strong>
                    <ul style="padding-left:16px; font-size:12px; color:#64748b; line-height:1.5;">
                      ${dest.bestNearbyPlaces.map(p => `<li><strong>${p.name}</strong> (${p.distance}): ${p.description}</li>`).join("")}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `).join("")}
          </div>
        </div>
      ` : ''}

      <!-- 5. ITEMISED BUDGET BREAKDOWN -->
      <div style="margin-bottom:32px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:16px;">
          <div>
            <h3 style="font-size:20px; font-weight:800; color:var(--dark-text);">Estimated Trip Budget</h3>
            <p style="font-size:12px; color:#64748b;">Transparent estimates based on travel style and vehicle economics.</p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="btnMakeTripCheaper" onclick="AIPlanner.handleMakeTripCheaper()">
            💡 Make Trip Cheaper
          </button>
        </div>

        <div class="budget-card" id="budgetCardContainer">
          ${this.renderBudgetTable(b)}
        </div>
      </div>

      <!-- 6. PACKING CHECKLIST SHORTCUT -->
      <div style="background:#f8fafc; border-radius:20px; padding:24px; border:1px solid #e2e8f0; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px;">
        <div>
          <h4 style="font-size:16px; font-weight:800; color:var(--dark-text);">Need a Packing Checklist?</h4>
          <p style="font-size:12px; color:#64748b;">Get an AI checklist customized for ${ts.duration || data.days.length} Days in ${data.destinations[0]?.name || 'Karnataka'}.</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="AIPlanner.openPackingModal('${data.destinations[0]?.name || 'Coorg'}', ${data.days.length})">
          🎒 View Packing Assistant
        </button>
      </div>
    `;
  },

  renderBudgetTable(budget) {
    if (!budget || !budget.breakdown) {
      return `<p style="font-size:12px; color:#64748b;">Budget estimation available upon generation.</p>`;
    }
    const b = budget.breakdown;
    return `
      <div class="budget-row">
        <span>🚗 ${b.transportation.label}</span>
        <strong>₹${b.transportation.amount.toLocaleString('en-IN')}</strong>
      </div>
      <div class="budget-row">
        <span>🏨 ${b.accommodation.label}</span>
        <strong>₹${b.accommodation.amount.toLocaleString('en-IN')}</strong>
      </div>
      <div class="budget-row">
        <span>🍛 ${b.food.label}</span>
        <strong>₹${b.food.amount.toLocaleString('en-IN')}</strong>
      </div>
      <div class="budget-row">
        <span>🎫 ${b.activities.label}</span>
        <strong>₹${b.activities.amount.toLocaleString('en-IN')}</strong>
      </div>
      <div class="budget-row">
        <span>🏛️ ${b.entryFees.label}</span>
        <strong>₹${b.entryFees.amount.toLocaleString('en-IN')}</strong>
      </div>
      <div class="budget-row">
        <span>🧾 ${b.miscellaneous.label}</span>
        <strong>₹${b.miscellaneous.amount.toLocaleString('en-IN')}</strong>
      </div>
      <div class="budget-row total-row">
        <span>Total Estimated Budget (${budget.travelers} Traveler${budget.travelers > 1 ? 's' : ''})</span>
        <span style="color:var(--primary-brand); font-size:20px;">₹${budget.totalEstimatedCost.toLocaleString('en-IN')}</span>
      </div>
      <div class="budget-disclaimer">
        * ${budget.disclaimer || "Estimated costs — actual prices may vary."}
      </div>
    `;
  },

  async handleMakeTripCheaper() {
    if (!this.currentBudget) return;
    const btn = document.getElementById("btnMakeTripCheaper");
    if (btn) btn.textContent = "✨ Calculating Savings...";

    try {
      const res = await fetch("/api/ai/budget-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentBudget: this.currentBudget,
          routeInfo: this.currentGeneratedTrip?.route || {}
        })
      });

      const opt = await res.json();
      if (btn) btn.textContent = "💡 Make Trip Cheaper";

      const container = document.getElementById("budgetCardContainer");
      if (container) {
        container.innerHTML = `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:14px; padding:16px; margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-weight:800; color:#15803d; font-size:14px;">🎉 Optimized Frugal Itinerary</span>
              <span style="background:#15803d; color:white; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">Save ~${opt.percentageSaved}%</span>
            </div>
            <p style="font-size:12px; color:#166534; line-height:1.5;">
              By adopting KSRTC express transit and authentic local homestays, your estimated total reduces from <strong>₹${opt.originalTotal.toLocaleString('en-IN')}</strong> to <strong>₹${opt.optimizedTotal.toLocaleString('en-IN')}</strong> (saving ~₹${opt.potentialSavings.toLocaleString('en-IN')}).
            </p>
          </div>

          ${this.renderBudgetTable({
            breakdown: opt.breakdown,
            travelers: this.currentBudget.travelers,
            totalEstimatedCost: opt.optimizedTotal,
            disclaimer: opt.disclaimer
          })}

          <div style="margin-top:16px; padding-top:16px; border-top:1px solid #f1f5f9;">
            <strong style="font-size:12px; color:var(--dark-text); display:block; margin-bottom:6px;">Smart Savings Strategies:</strong>
            <ul style="font-size:12px; color:#64748b; padding-left:18px; line-height:1.6;">
              ${opt.actionableSavingsTips.map(t => `<li>${t}</li>`).join("")}
            </ul>
          </div>
        `;
      }

      if (window.showToast) window.showToast("Budget optimized for maximum savings! 💰", "success");
    } catch (e) {
      if (btn) btn.textContent = "💡 Make Trip Cheaper";
      alert("Could not calculate savings right now.");
    }
  },

  async saveThisTrip() {
    if (!this.currentGeneratedTrip) return;
    const trip = this.currentGeneratedTrip;
    const slugs = (trip.destinations || []).map(d => d.slug);

    if (window.Auth && window.Auth.isLoggedIn()) {
      try {
        const res = await fetch("/api/ai/save-to-trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trip.trip_summary?.title || trip.summary.title,
            description: `${trip.summary.duration} itinerary: ${trip.summary.routeSummary}`,
            startDate: new Date().toISOString().split("T")[0],
            destinationSlugs: slugs,
            notes: trip.days.map(d => `Day ${d.dayNumber}: ${d.title}`)
          })
        });
        if (res.ok) {
          if (window.showToast) window.showToast("Trip synced and saved to your account! 🗺️", "success");
          return;
        }
      } catch (e) {}
    }

    // Fallback: save to Trips local storage
    if (window.Trips) {
      window.Trips.create(
        trip.trip_summary?.title || trip.summary.title,
        `${trip.summary.duration} itinerary: ${trip.summary.routeSummary}`,
        new Date().toISOString().split("T")[0],
        "",
        slugs
      );
      if (window.showToast) window.showToast("Trip saved to your local road trips! 🗺️", "success");
    }
  },

  openPackingModal(destination, durationDays) {
    if (window.PackingAssistant) {
      window.PackingAssistant.openModal(destination, durationDays);
    }
  }
};

window.AIPlanner = AIPlanner;

document.addEventListener("DOMContentLoaded", () => {
  AIPlanner.init();
});
