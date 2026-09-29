/**
 * Karnataka Travel Diaries - Vanilla Leaflet Interactive Map Module
 * Unified reusable map component for interactive maps & previews
 */

// Bounding box for Karnataka state
const KARNATAKA_BOUNDS = [
  [11.5, 74.0], // South-West (Arabian sea / Kerala border)
  [18.5, 77.7]  // North-East (Bidar border)
];

// Reusable coordinate validator
function isValidCoordinate(latitude, longitude) {
  if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) return false;
  const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
  const lng = typeof longitude === 'number' ? longitude : parseFloat(longitude);
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat === 0 && lng === 0) return false;
  // Karnataka roughly spans lat 11.2 to 18.8, lng 73.8 to 78.8
  if (lat < 11.2 || lat > 18.8 || lng < 73.8 || lng > 78.8) return false;
  return true;
}

const KarnatakaMap = {
  map: null,
  markers: [],
  userMarker: null,
  isValidCoordinate,
  karnatakaBounds: KARNATAKA_BOUNDS,

  init(containerId = "karnatakaMap", options = {}) {
    const el = document.getElementById(containerId);
    if (!el || typeof L === "undefined") return null;

    // Check if map already initialized on this container
    if (this.map) {
      try {
        this.map.remove();
      } catch (e) {}
    }

    const isCompact = !!options.compact;

    // Initialize Leaflet map
    this.map = L.map(containerId, {
      center: [14.8, 75.8],
      zoom: isCompact ? 6 : 7,
      scrollWheelZoom: options.scrollWheelZoom !== undefined ? options.scrollWheelZoom : !isCompact,
      zoomControl: options.zoomControl !== undefined ? options.zoomControl : true,
      maxZoom: 18,
      minZoom: 5
    });

    // Tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(this.map);

    // Initial bounds fitting
    this.fitKarnatakaBounds(isCompact ? [15, 15] : [30, 30]);

    // Force Leaflet to re-calculate container dimensions after DOM layout
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        this.fitKarnatakaBounds(isCompact ? [15, 15] : [30, 30]);
      }
    }, 150);

    // Render Markers
    this.renderMarkers(options.filterCategory || "All", options.searchQuery || "");

    return this.map;
  },

  // Calculate dynamic bounds from destination coordinates or fallback to KARNATAKA_BOUNDS
  fitKarnatakaBounds(padding = [30, 30]) {
    if (!this.map) return;
    const dests = (window.karnatakaDestinations || []).filter(d =>
      isValidCoordinate(d.latitude, d.longitude)
    );

    if (dests.length > 0) {
      const lats = dests.map(d => Number(d.latitude));
      const lngs = dests.map(d => Number(d.longitude));
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const bounds = L.latLngBounds([minLat, minLng], [maxLat, maxLng]);
      this.map.fitBounds(bounds, { padding, maxZoom: 8 });
    } else {
      this.map.fitBounds(KARNATAKA_BOUNDS, { padding, maxZoom: 8 });
    }
  },

  renderMarkers(filterCategory = "All", searchQuery = "") {
    if (!this.map || !window.karnatakaDestinations) return;

    // Clear old markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const destinations = window.karnatakaDestinations.filter(d => {
      if (!isValidCoordinate(d.latitude, d.longitude)) return false;
      const matchCat = filterCategory === "All" || d.category === filterCategory || (d.categories && d.categories.includes(filterCategory));
      const matchSearch = !searchQuery || 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (d.district && d.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.taluk && d.taluk.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    destinations.forEach(dest => {
      const lat = Number(dest.latitude);
      const lng = Number(dest.longitude);
      const safeName = (dest.name || '').replace(/'/g, "\\'");
      const displayName = dest.name.split(" ")[0];

      // Custom HTML Pin
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, #5c4fe5 0%, #3d27a4 100%);
            color: #ffffff;
            padding: 5px 9px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(92, 79, 229, 0.4);
            border: 2px solid #ffffff;
            cursor: pointer;
            transform: translate(-50%, -100%);
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>📍</span>
            <span>${displayName}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);

      // Popup Content meeting Requirement 13
      const popupHtml = `
        <div style="width: 230px; font-family: 'Poppins', sans-serif;">
          <div style="position: relative; width: 100%; height: 115px; border-radius: 12px; overflow: hidden; margin-bottom: 8px; background: #e2e8f0;">
            <img 
              src="${dest.image || 'images/hero/karnataka-hero.jpg'}" 
              alt="${dest.alt || dest.name}" 
              style="width: 100%; height: 100%; object-fit: cover;"
              onerror="this.onerror=null; this.src='images/hero/karnataka-hero.jpg';"
            />
            <span style="position: absolute; top: 6px; left: 6px; background: rgba(255,255,255,0.95); font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 6px; color:#5c4fe5; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
              ${dest.category}
            </span>
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #16202c; margin-bottom: 2px; line-height: 1.3;">
            ${dest.name}
          </h4>
          <p style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 600;">
            📍 ${dest.district}${dest.taluk ? ` (${dest.taluk})` : ''} • ★ ${(dest.averageRating || 4.8).toFixed(1)}
          </p>
          <p style="font-size: 11px; color: #475569; line-height: 1.4; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${dest.shortDescription || dest.description || ''}
          </p>
          <div style="display: flex; gap: 6px;">
            <a href="destination.html?id=${dest.slug || dest.id}" style="flex:1; text-align:center; padding: 6px 10px; background: #16202c; color: white; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;">
              Explore
            </a>
            <button onclick="Destinations.getDirections(${lat}, ${lng}, '${safeName}')" style="flex:1; text-align:center; padding: 6px 10px; background: #5c4fe5; color: white; border-radius: 8px; font-size: 11px; font-weight: 600; border: none; cursor: pointer;">
              Directions
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260 });
      this.markers.push(marker);
    });
  },

  // Factory function to create standalone map instances (e.g. for Home page preview)
  create(containerId, options = {}) {
    const el = document.getElementById(containerId);
    if (!el || typeof L === "undefined") return null;

    const isCompact = !!options.compact;
    const instanceMap = L.map(containerId, {
      center: [14.8, 75.8],
      zoom: isCompact ? 6 : 7,
      scrollWheelZoom: options.scrollWheelZoom !== undefined ? options.scrollWheelZoom : false,
      zoomControl: options.zoomControl !== undefined ? options.zoomControl : true,
      maxZoom: 18,
      minZoom: 5
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(instanceMap);

    const fitBounds = (padding = [20, 20]) => {
      const dests = (options.destinations || window.karnatakaDestinations || []).filter(d =>
        isValidCoordinate(d.latitude, d.longitude)
      );
      if (dests.length > 0) {
        const lats = dests.map(d => Number(d.latitude));
        const lngs = dests.map(d => Number(d.longitude));
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        instanceMap.fitBounds(L.latLngBounds([minLat, minLng], [maxLat, maxLng]), { padding, maxZoom: 8 });
      } else {
        instanceMap.fitBounds(KARNATAKA_BOUNDS, { padding, maxZoom: 8 });
      }
    };

    fitBounds(isCompact ? [15, 15] : [30, 30]);

    setTimeout(() => {
      if (instanceMap) {
        instanceMap.invalidateSize();
        fitBounds(isCompact ? [15, 15] : [30, 30]);
      }
    }, 150);

    const list = (options.destinations || window.karnatakaDestinations || []).filter(d =>
      isValidCoordinate(d.latitude, d.longitude)
    );

    const markers = [];
    list.forEach(dest => {
      const lat = Number(dest.latitude);
      const lng = Number(dest.longitude);
      const safeName = (dest.name || '').replace(/'/g, "\\'");
      const displayName = dest.name.split(" ")[0];

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, #5c4fe5 0%, #3d27a4 100%);
            color: #ffffff;
            padding: 5px 9px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(92, 79, 229, 0.4);
            border: 2px solid #ffffff;
            cursor: pointer;
            transform: translate(-50%, -100%);
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>📍</span>
            <span>${displayName}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(instanceMap);

      const popupHtml = `
        <div style="width: 220px; font-family: 'Poppins', sans-serif;">
          <div style="position: relative; width: 100%; height: 110px; border-radius: 12px; overflow: hidden; margin-bottom: 8px; background: #e2e8f0;">
            <img 
              src="${dest.image || 'images/hero/karnataka-hero.jpg'}" 
              alt="${dest.alt || dest.name}" 
              style="width: 100%; height: 100%; object-fit: cover;"
              onerror="this.onerror=null; this.src='images/hero/karnataka-hero.jpg';"
            />
            <span style="position: absolute; top: 6px; left: 6px; background: rgba(255,255,255,0.95); font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; color:#5c4fe5;">
              ${dest.category}
            </span>
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #16202c; margin-bottom: 2px;">
            ${dest.name}
          </h4>
          <p style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 600;">
            📍 ${dest.district}${dest.taluk ? ` (${dest.taluk})` : ''} • ★ ${(dest.averageRating || 4.8).toFixed(1)}
          </p>
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <a href="destination.html?id=${dest.slug || dest.id}" style="flex:1; text-align:center; padding: 6px 10px; background: #16202c; color: white; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;">
              Explore
            </a>
            <button onclick="Destinations.getDirections(${lat}, ${lng}, '${safeName}')" style="flex:1; text-align:center; padding: 6px 10px; background: #5c4fe5; color: white; border-radius: 8px; font-size: 11px; font-weight: 600; border: none; cursor: pointer;">
              Directions
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 250 });
      markers.push(marker);
    });

    return {
      map: instanceMap,
      markers,
      fitBounds
    };
  },

  locateUser() {
    if (!navigator.geolocation || !this.map) {
      if (window.showToast) window.showToast("Geolocation is not supported by your browser.", "error");
      return;
    }

    if (window.showToast) window.showToast("Locating your GPS position...", "info");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (this.userMarker) this.userMarker.remove();

        const userIcon = L.divIcon({
          className: 'user-pin',
          html: `<div style="width: 18px; height: 18px; background: #10b981; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.4); transform: translate(-50%, -50%);"></div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });

        this.userMarker = L.marker([latitude, longitude], { icon: userIcon })
          .addTo(this.map)
          .bindPopup("<b>You are here</b>")
          .openPopup();

        this.map.flyTo([latitude, longitude], 10, { duration: 1.5 });
        if (window.showToast) window.showToast("GPS position mapped!", "success");
      },
      (err) => {
        if (window.showToast) window.showToast("Could not retrieve current location.", "error");
      }
    );
  }
};

if (typeof window !== "undefined") {
  window.KarnatakaMap = KarnatakaMap;
  window.isValidCoordinate = isValidCoordinate;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { KarnatakaMap, isValidCoordinate, KARNATAKA_BOUNDS };
}
