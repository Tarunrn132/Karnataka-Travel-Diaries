/**
 * Karnataka Travel Diaries - Recommendations & Visual Wizard Client Engine
 * Renders explainable destination recommendations and coordinates the "Find My Place" interactive wizard.
 */

const Recommendations = {
  async fetchAndRender(containerId = "recommendationsContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      // Pass cached favorites if guest
      const favs = window.Favorites ? window.Favorites.getAll() : [];
      const favParam = favs.length > 0 ? `?favorites=${encodeURIComponent(favs.join(','))}` : '';

      const res = await fetch(`/api/recommendations${favParam}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.recommendations || data.recommendations.length === 0) {
        container.innerHTML = `<p style="font-size:13px; color:#64748b;">No recommendations available right now.</p>`;
        return;
      }

      container.innerHTML = data.recommendations.map(r => this.renderCard(r)).join("");
    } catch (e) {
      console.warn("Could not load recommendations:", e);
    }
  },

  renderCard(recItem) {
    const dest = recItem.destination;
    const isFav = window.Favorites ? window.Favorites.isFavorited(dest.id || dest.slug) : false;
    const heartIcon = isFav ? "❤️" : "🤍";

    return `
      <div class="destination-card" data-id="${dest.slug || dest.id}">
        <div class="card-media">
          <img 
            src="${dest.image || 'images/hero/karnataka-hero.jpg'}" 
            alt="${dest.name}" 
            loading="lazy" 
            onerror="this.src='images/hero/karnataka-hero.jpg'" 
          />
          <div class="card-image-overlay"></div>
          <div class="card-category-badge">${dest.categories?.[0] || 'Karnataka'}</div>
          
          <button 
            type="button" 
            class="card-favorite-btn ${isFav ? 'favorited' : ''}" 
            onclick="Favorites.toggle('${dest.slug || dest.id}')"
            title="Save to favorites"
          >
            ${heartIcon}
          </button>

          <div class="card-media-bottom">
            <div class="card-location-label">
              <span>📍</span>
              <span>${dest.district}, Karnataka</span>
            </div>
            <div class="card-rating-pill">
              <span>★</span>
              <span>${(dest.averageRating || 4.8).toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div class="card-body">
          <!-- Explainable AI Recommendation Reason Tag -->
          <div style="background:#ede9fe; color:var(--primary-brand); font-size:11px; font-weight:700; padding:6px 10px; border-radius:8px; margin-bottom:10px; line-height:1.4; border-left:3px solid var(--primary-brand);">
            💡 ${recItem.reason}
          </div>

          <h3 class="card-title">
            <a href="destination.html?id=${dest.slug || dest.id}">${dest.name}</a>
          </h3>
          <p class="card-snippet">${dest.shortDescription}</p>

          <div class="card-meta-strip">
            <span>⏱️ <span class="highlight">${dest.recommendedDays || 2} Days</span></span>
            <span>🛣️ <span class="highlight">${Number.isFinite(recItem.distanceFromOrigin) ? recItem.distanceFromOrigin : (window.TravelDistance || TravelDistance).getDisplayDistance(dest)} km</span> away</span>
          </div>

          <div class="card-btn-row">
            <a href="destination.html?id=${dest.slug || dest.id}" class="btn-card-explore">
              Explore <span>→</span>
            </a>
            <button 
              type="button" 
              class="btn-card-directions"
              onclick="Destinations.getDirections(${dest.latitude}, ${dest.longitude}, '${dest.name.replace(/'/g, "\\'")}')"
            >
              🧭 Directions
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // "Find My Place" Wizard Handlers
  async handleWizardSubmit() {
    const exp = document.querySelector("input[name='wizardExperience']:checked")?.value || "Hill Stations";
    const dur = document.querySelector("input[name='wizardDuration']:checked")?.value || "2–3 Days";
    const group = document.querySelector("input[name='wizardGroup']:checked")?.value || "Friends";
    const budget = document.getElementById("wizardBudgetInput")?.value || "6000";

    const resultsContainer = document.getElementById("wizardResultsContainer");
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
      <div style="text-align:center; padding:30px; font-size:13px; color:#64748b;">
        ✨ Finding your perfect Karnataka destinations...
      </div>
    `;

    try {
      const res = await fetch("/api/recommendations/wizard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: exp,
          duration: dur,
          travelWith: group,
          budget
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error("Wizard failed");

      if (data.results.length === 0) {
        resultsContainer.innerHTML = `<p style="text-align:center; padding:20px;">No exact match. Try adjusting your preferences!</p>`;
        return;
      }

      resultsContainer.innerHTML = `
        <div style="margin-bottom:16px;">
          <h4 style="font-size:16px; font-weight:800; color:var(--dark-text);">
            ✨ Handpicked Places for Your ${dur} ${exp} Journey:
          </h4>
        </div>
        <div class="destinations-grid">
          ${data.results.map(r => this.renderCard(r)).join("")}
        </div>
      `;
    } catch (e) {
      resultsContainer.innerHTML = `<p style="color:#b91c1c;">Could not run wizard: ${e.message}</p>`;
    }
  }
};

window.Recommendations = Recommendations;
