/**
 * Karnataka Travel Diaries - Trip Itinerary Planner
 */

const Trips = {
  trips: [],

  init() {
    const stored = localStorage.getItem("ktd_trips");
    if (stored) {
      try {
        this.trips = JSON.parse(stored);
      } catch (e) {
        this.trips = [];
      }
    }

    if (this.trips.length === 0) {
      // Default sample trip
      this.trips = [
        {
          id: "trip-sample-1",
          name: "Royal Heritage & Western Ghats Hills",
          description: "4-day road trip from Bengaluru exploring the palaces of Mysuru and coffee estates of Coorg.",
          startDate: "2026-10-15",
          endDate: "2026-10-19",
          stops: [
            { destinationId: "mysore", notes: "Day 1: Mysore Palace lighting & Chamundi hill sunset" },
            { destinationId: "coorg", notes: "Day 2-4: Coffee plantation homestay, Abbey falls & Raja's seat" }
          ]
        }
      ];
      localStorage.setItem("ktd_trips", JSON.stringify(this.trips));
    }

    this.syncWithServer();
  },

  async syncWithServer() {
    try {
      const res = await fetch("/api/trips");
      if (res.ok) {
        const data = await res.json();
        if (data.trips && data.trips.length > 0) {
          this.trips = data.trips.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
            startDate: t.startDate ? t.startDate.split("T")[0] : "",
            endDate: t.endDate ? t.endDate.split("T")[0] : "",
            stops: t.destinations ? t.destinations.map(d => ({
              destinationId: d.destination?.slug || d.destinationId,
              notes: d.notes
            })) : []
          }));
          localStorage.setItem("ktd_trips", JSON.stringify(this.trips));
          this.renderTripsList();
        }
      }
    } catch (e) {
      // Ignored
    }
  },

  getAll() {
    return this.trips;
  },

  create(name, description, startDate, endDate, destinationIds = []) {
    const newTrip = {
      id: "trip-" + Date.now(),
      name,
      description,
      startDate,
      endDate,
      stops: destinationIds.map((id, idx) => ({
        destinationId: id,
        notes: `Stop ${idx + 1}`
      }))
    };

    this.trips.unshift(newTrip);
    localStorage.setItem("ktd_trips", JSON.stringify(this.trips));
    this.renderTripsList();

    if (window.showToast) window.showToast(`Trip "${name}" created!`, "success");

    // Sync to API
    fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        startDate,
        endDate,
        destinationIds
      })
    }).catch(() => {});

    return newTrip;
  },

  delete(tripId) {
    if (!confirm("Are you sure you want to delete this trip itinerary?")) return;
    this.trips = this.trips.filter(t => t.id !== tripId);
    localStorage.setItem("ktd_trips", JSON.stringify(this.trips));
    this.renderTripsList();

    if (window.showToast) window.showToast("Trip itinerary deleted.", "info");

    fetch(`/api/trips/${tripId}`, { method: "DELETE" }).catch(() => {});
  },

  addStop(tripId, destinationId, notes = "") {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) return;

    if (trip.stops.some(s => s.destinationId === destinationId)) {
      if (window.showToast) window.showToast("This stop is already in your trip!", "info");
      return;
    }

    trip.stops.push({ destinationId, notes });
    localStorage.setItem("ktd_trips", JSON.stringify(this.trips));
    this.renderTripsList();

    if (window.showToast) window.showToast("Destination added to your trip roadmap!", "success");
  },

  removeStop(tripId, stopIndex) {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) return;

    trip.stops.splice(stopIndex, 1);
    localStorage.setItem("ktd_trips", JSON.stringify(this.trips));
    this.renderTripsList();
    if (window.showToast) window.showToast("Stop removed from itinerary.", "info");
  },

  moveStop(tripId, index, direction) {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= trip.stops.length) return;

    const temp = trip.stops[index];
    trip.stops[index] = trip.stops[targetIndex];
    trip.stops[targetIndex] = temp;

    localStorage.setItem("ktd_trips", JSON.stringify(this.trips));
    this.renderTripsList();
  },

  renderTripsList(containerId = "tripsListContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.trips.length === 0) {
      container.innerHTML = `
        <div style="background:#ffffff; border-radius:24px; padding:48px; text-align:center; border:1px solid #eef0f3; max-width:480px; margin:0 auto;">
          <div style="font-size:36px; margin-bottom:12px;">🗺️</div>
          <h3 style="font-size:18px; font-weight:800; color:var(--dark-text); margin-bottom:6px;">No Trips Planned Yet</h3>
          <p style="font-size:13px; color:#64748b; margin-bottom:20px;">
            Build a custom Karnataka road trip! Plan daily stops to Coorg, Hampi, or Gokarna and calculate Google Maps driving routes.
          </p>
          <button onclick="document.getElementById('createTripModal').classList.add('open')" class="btn btn-primary btn-sm">
            Create Your First Trip
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = this.trips.map(trip => `
      <div style="background:#ffffff; border-radius:24px; padding:28px; border:1px solid #eef0f3; box-shadow:var(--shadow-card); margin-bottom:24px;">
        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; border-bottom:1px solid #f1f5f9; padding-bottom:16px; margin-bottom:20px;">
          <div>
            <h3 style="font-size:20px; font-weight:800; color:var(--dark-text);">${trip.name}</h3>
            ${trip.description ? `<p style="font-size:13px; color:#64748b; margin-top:4px;">${trip.description}</p>` : ''}
            ${trip.startDate ? `<div style="font-size:12px; font-weight:600; color:var(--primary-brand); margin-top:6px;">📅 ${trip.startDate} ${trip.endDate ? `to ${trip.endDate}` : ''}</div>` : ''}
          </div>
          <div style="display:flex; gap:8px;">
            <button onclick="Trips.promptAddStop('${trip.id}')" class="btn btn-secondary btn-sm">
              ➕ Add Stop
            </button>
            <button onclick="Trips.delete('${trip.id}')" class="btn btn-secondary btn-sm" style="color:#dc2626;" title="Delete Trip">
              🗑️
            </button>
          </div>
        </div>

        <!-- Timeline Stops -->
        <div style="display:flex; flex-direction:column; gap:14px; padding-left:14px; border-left:2px solid #e0e7ff; margin-left:10px;">
          ${trip.stops.map((stop, idx) => {
            const dest = window.karnatakaDestinations.find(d => (d.slug === stop.destinationId || d.id === stop.destinationId)) || {
              name: stop.destinationId,
              district: "Karnataka",
              image: "images/hero/karnataka-hero.jpg",
              latitude: 12.9716,
              longitude: 77.5946
            };

            return `
              <div style="position:relative; background:#f8fafc; border-radius:16px; padding:14px 18px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; border:1px solid #e2e8f0;">
                <div style="position:absolute; left:-24px; top:18px; width:20px; height:20px; border-radius:50%; background:var(--primary-brand); color:white; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(92,79,229,0.4);">
                  ${idx + 1}
                </div>

                <div style="display:flex; align-items:center; gap:12px;">
                  <img 
                    src="${dest.image}" 
                    alt="${dest.alt || dest.name}" 
                    style="width:52px; height:52px; border-radius:12px; object-fit:cover;"
                    onerror="this.src='images/hero/karnataka-hero.jpg'"
                  />
                  <div>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-size:10px; font-weight:700; color:var(--primary-brand); background:#ede9fe; padding:2px 6px; border-radius:4px;">
                        STOP ${idx + 1}
                      </span>
                      <a href="destination.html?id=${dest.slug || dest.id}" style="font-size:14px; font-weight:800; color:var(--dark-text);">
                        ${dest.name}
                      </a>
                    </div>
                    <div style="font-size:11px; color:#64748b; margin-top:2px;">
                      ${dest.district} • ${dest.category || 'Karnataka'}
                    </div>
                    ${stop.notes ? `<div style="font-size:11px; font-style:italic; color:#475569; margin-top:2px;">&ldquo;${stop.notes}&rdquo;</div>` : ''}
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:6px;">
                  <button onclick="Trips.moveStop('${trip.id}', ${idx}, 'up')" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''} class="btn btn-secondary btn-sm" style="padding:6px 10px;" title="Move earlier">
                    ▲
                  </button>
                  <button onclick="Trips.moveStop('${trip.id}', ${idx}, 'down')" ${idx === trip.stops.length - 1 ? 'disabled style="opacity:0.3;"' : ''} class="btn btn-secondary btn-sm" style="padding:6px 10px;" title="Move later">
                    ▼
                  </button>
                  <button onclick="Destinations.getDirections(${dest.latitude}, ${dest.longitude}, '${dest.name.replace(/'/g, "\\'")}')" class="btn btn-secondary btn-sm" style="color:var(--primary-brand);">
                    🧭 Directions
                  </button>
                  <button onclick="Trips.removeStop('${trip.id}', ${idx})" class="btn btn-secondary btn-sm" style="color:#ef4444;" title="Remove stop">
                    ✕
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `).join("");
  },

  promptAddStop(tripId) {
    const destName = prompt("Enter Destination Name (e.g. Coorg, Hampi, Gokarna, Mysore, Udupi):");
    if (!destName) return;

    const matched = window.karnatakaDestinations.find(d => 
      d.name.toLowerCase().includes(destName.toLowerCase()) || 
      d.id.toLowerCase().includes(destName.toLowerCase())
    );

    if (matched) {
      this.addStop(tripId, matched.slug || matched.id, `Explore ${matched.name}`);
    } else {
      alert(`Could not find destination "${destName}". Please try Coorg, Hampi, Gokarna, Mysore, etc.`);
    }
  }
};

window.Trips = Trips;
