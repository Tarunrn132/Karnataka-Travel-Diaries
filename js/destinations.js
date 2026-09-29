/**
 * Karnataka Travel Diaries - Destinations Rendering & Navigation Engine
 */

const Destinations = {
  // Single source of truth getters
  getAll() {
    return (window.karnatakaDestinations && Array.isArray(window.karnatakaDestinations)) 
      ? window.karnatakaDestinations 
      : [];
  },

  getById(idOrSlug) {
    if (!idOrSlug) return null;
    const all = this.getAll();
    return all.find(d => (d.id && d.id === idOrSlug) || (d.slug && d.slug === idOrSlug)) || null;
  },

  // Generate HTML for standard rich travel card
  renderCard(dest) {
    if (!dest) return "";
    const id = dest.id || dest.slug || "";
    const isFav = window.Favorites ? window.Favorites.isFavorited(id) : false;
    const heartIcon = isFav ? "❤️" : "🤍";
    const favClass = isFav ? "card-favorite-btn favorited" : "card-favorite-btn";
    const safeImage = dest.image || "images/hero/karnataka-hero.jpg";
    const safeName = (dest.name || "").replace(/'/g, "\\'");
    const lat = Number(dest.latitude) || 12.9716;
    const lng = Number(dest.longitude) || 77.5946;
    const talukLabel = dest.taluk ? ` (${dest.taluk})` : "";
    const snippet = dest.shortDescription || dest.description || "";

    return `
      <div class="destination-card" data-category="${dest.category || ''}" data-id="${id}">
        <!-- Media (45-60% of card) -->
        <div class="card-media">
          <img 
            src="${safeImage}" 
            alt="${dest.alt || `${dest.name}, Karnataka`}" 
            loading="lazy"
            onerror="this.onerror=null; this.src='images/hero/karnataka-hero.jpg';"
          />
          <div class="card-image-overlay"></div>
          
          <!-- Category badge -->
          <div class="card-category-badge">${dest.category || 'Destination'}</div>
          
          <!-- Heart Favorite Button -->
          <button 
            type="button" 
            class="${favClass}" 
            data-favorite-id="${id}"
            onclick="Favorites.toggle('${id}')"
            aria-label="Save ${dest.name} to favorites"
            title="Save to favorites"
          >
            ${heartIcon}
          </button>
          
          <!-- Location & Rating strip over image -->
          <div class="card-media-bottom">
            <div class="card-location-label">
              <span>📍</span>
              <span>${dest.district || 'Karnataka'}${talukLabel}, Karnataka</span>
            </div>
            <div class="card-rating-pill">
              <span>★</span>
              <span>${(dest.averageRating || 4.8).toFixed(1)}</span>
              <span style="opacity:0.7; font-size:10px;">(${dest.reviewCount || 100})</span>
            </div>
          </div>
        </div>

        <!-- Body content -->
        <div class="card-body">
          <div>
            <h3 class="card-title">
              <a href="destination.html?id=${dest.slug || dest.id}">${dest.name}</a>
            </h3>
            <div class="card-tags">${dest.tags || `${dest.category || 'Destination'} • Karnataka`}</div>
            <p class="card-snippet">${snippet}</p>
          </div>

          <div class="card-meta-strip">
            <span>⏱️ <span class="highlight">${dest.recommendedDays || '2 Days'}</span></span>
            <span>🛣️ <span class="highlight">${(window.TravelDistance || TravelDistance).getDisplayDistance(dest)} km</span> from BLR</span>
          </div>

          <div class="card-btn-row">
            <a href="destination.html?id=${dest.slug || dest.id}" class="btn-card-explore">
              Explore <span>→</span>
            </a>
            <button 
              type="button" 
              class="btn-card-directions"
              onclick="Destinations.getDirections(${lat}, ${lng}, '${safeName}')"
            >
              🧭 Directions
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Google Maps Driving Directions Integration
  async getDirections(destLat, destLng, destName) {
    if (!navigator.geolocation) {
      this.showDirectionsFallbackModal(destLat, destLng, destName, "Geolocation is not supported by your browser.");
      return;
    }

    if (window.showToast) {
      window.showToast("Requesting current location to calculate driving route...", "info");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&travelmode=driving`;
        
        if (window.showToast) {
          window.showToast(`Route mapped from your location to ${destName}!`, "success");
        }
        window.open(url, "_blank", "noopener,noreferrer");
      },
      (error) => {
        let msg = "Location permission is required to provide directions from your current location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission was denied in your browser settings.";
        }
        this.showDirectionsFallbackModal(destLat, destLng, destName, msg);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  },

  // Fallback modal when GPS permission is denied
  showDirectionsFallbackModal(destLat, destLng, destName, message) {
    let modal = document.getElementById("directionsFallbackModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "directionsFallbackModal";
      modal.className = "modal-backdrop";
      document.body.appendChild(modal);
    }

    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}+(${encodeURIComponent(destName + ", Karnataka")})`;

    modal.innerHTML = `
      <div class="modal-card">
        <span class="modal-close-btn" onclick="Destinations.closeDirectionsModal()">&times;</span>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
          <div style="width:42px; height:42px; border-radius:12px; background:#fef3c7; color:#d97706; display:flex; align-items:center; justify-content:center; font-size:20px;">
            🧭
          </div>
          <div>
            <h3 style="font-size:18px; font-weight:800; color:var(--dark-text);">Google Maps Directions</h3>
            <p style="font-size:12px; color:#64748b;">To ${destName}</p>
          </div>
        </div>

        <p style="font-size:13px; color:#4b5563; line-height:1.6; margin-bottom:16px;">
          ${message}
        </p>

        <div style="background:#f8fafc; padding:12px 14px; border-radius:12px; border:1px solid #e2e8f0; font-size:12px; color:#64748b; margin-bottom:20px;">
          💡 You can still open <strong>${destName}</strong> directly in Google Maps and set your starting point manually.
        </div>

        <div style="display:flex; gap:10px;">
          <a href="${fallbackUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="flex:1;" onclick="Destinations.closeDirectionsModal()">
            Open Destination in Google Maps
          </a>
          <button type="button" class="btn btn-secondary btn-sm" onclick="Destinations.closeDirectionsModal()">
            Cancel
          </button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  },

  closeDirectionsModal() {
    const modal = document.getElementById("directionsFallbackModal");
    if (modal) modal.classList.remove("open");
  },

  // Setup Global Live Search Bar logic
  initSearchBar(inputElId, suggestionsElId) {
    const input = document.getElementById(inputElId);
    const box = document.getElementById(suggestionsElId);
    if (!input || !box) return;

    input.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        box.classList.remove("open");
        box.innerHTML = "";
        return;
      }

      const matches = window.karnatakaDestinations.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        (d.attractions && d.attractions.some(a => a.name.toLowerCase().includes(q)))
      ).slice(0, 6);

      if (matches.length === 0) {
        box.innerHTML = `
          <div style="padding:16px; text-align:center; font-size:13px; color:#64748b;">
            No destinations found for &ldquo;${q}&rdquo;. Try Coorg, Hampi, or Gokarna!
          </div>
        `;
      } else {
        box.innerHTML = `
          <div style="padding:6px 10px; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase;">
            Destinations & Sights
          </div>
          ${matches.map(d => `
            <a href="destination.html?id=${d.slug || d.id}" class="suggestion-item">
              <div class="suggestion-left">
                <img 
                  src="${d.image}" 
                  alt="${d.alt || d.name}" 
                  class="suggestion-thumb" 
                  onerror="this.src='images/hero/karnataka-hero.jpg'"
                />
                <div>
                  <div class="suggestion-title">${d.name}</div>
                  <div class="suggestion-sub">${d.district} • ${d.category}</div>
                </div>
              </div>
              <div style="font-size:12px; font-weight:700; color:#f59e0b;">★ ${d.averageRating.toFixed(1)}</div>
            </a>
          `).join("")}
          <div style="padding:8px 10px; border-top:1px solid #f1f5f9; text-align:center;">
            <a href="explore.html?search=${encodeURIComponent(q)}" style="font-size:12px; font-weight:700; color:var(--primary-brand);">
              View all results for &ldquo;${q}&rdquo; →
            </a>
          </div>
        `;
      }
      box.classList.add("open");
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !box.contains(e.target)) {
        box.classList.remove("open");
      }
    });
  }
};

if (typeof window !== "undefined") {
  window.Destinations = Destinations;
  window.destinationService = Destinations;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Destinations, destinationService: Destinations };
}
