/**
 * Karnataka Travel Diaries - Personal Travel Journal
 */

const Diary = {
  entries: [],

  init() {
    const stored = localStorage.getItem("ktd_diaries");
    if (stored) {
      try {
        this.entries = JSON.parse(stored);
      } catch (e) {
        this.entries = [];
      }
    }

    if (this.entries.length === 0) {
      this.entries = [
        {
          id: "diary-1",
          destinationId: "coorg",
          title: "Monsoon Whispers in the Coffee Valleys of Coorg",
          visitDate: "2026-08-15",
          rating: 5,
          image: "images/destinations/coorg.jpg",
          content: "Waking up to the aroma of freshly roasted Arabica beans and rain drumming gently against the plantation roof was unforgettable. We took an early morning walk to Abbey Falls where the roaring torrent sent mist all the way to our faces. The evening was spent watching the sunset from Raja's Seat with hot filter coffee and Kodava Akki Roti."
        },
        {
          id: "diary-2",
          destinationId: "hampi",
          title: "Golden Sunrise Over the Stone Chariot in Hampi",
          visitDate: "2026-09-02",
          rating: 5,
          image: "images/destinations/hampi.jpg",
          content: "Cycling through the ancient bazaars of the Vijayanagara Empire during dawn was like stepping 600 years back in time. The boulder hills glowing amber in the morning light and the intricate musical pillars of Vittala temple left us completely speechless."
        }
      ];
      localStorage.setItem("ktd_diaries", JSON.stringify(this.entries));
    }

    this.syncWithServer();
  },

  async syncWithServer() {
    try {
      const res = await fetch("/api/diary?public=true");
      if (res.ok) {
        const data = await res.json();
        if (data.diaries && data.diaries.length > 0) {
          // Merge with server entries
          const serverMapped = data.diaries.map(d => {
            let img = "images/hero/karnataka-hero.jpg";
            try {
              const parsed = JSON.parse(d.images);
              if (parsed.length > 0) img = parsed[0];
            } catch(e){}
            return {
              id: d.id,
              destinationId: d.destination?.slug || d.destinationId,
              title: d.title,
              visitDate: d.visitDate ? d.visitDate.split("T")[0] : "",
              rating: d.rating || 5,
              image: img,
              content: d.content
            };
          });
          this.entries = serverMapped;
          this.renderDiaryCards();
        }
      }
    } catch (e) {
      // Ignored
    }
  },

  create(destinationId, title, content, visitDate, rating = 5, imageUrl = "") {
    const dest = window.karnatakaDestinations.find(d => (d.slug === destinationId || d.id === destinationId));
    const newEntry = {
      id: "diary-" + Date.now(),
      destinationId,
      title,
      content,
      visitDate: visitDate || new Date().toISOString().split("T")[0],
      rating: parseInt(rating) || 5,
      image: imageUrl || (dest ? dest.image : "images/hero/karnataka-hero.jpg")
    };

    this.entries.unshift(newEntry);
    localStorage.setItem("ktd_diaries", JSON.stringify(this.entries));
    this.renderDiaryCards();

    if (window.showToast) window.showToast("Story successfully published to your travel diary! 📖", "success");

    // Sync to API
    fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationId,
        title,
        content,
        visitDate: newEntry.visitDate,
        rating: newEntry.rating,
        images: [newEntry.image]
      })
    }).catch(() => {});

    return newEntry;
  },

  delete(diaryId) {
    if (!confirm("Are you sure you want to delete this diary entry?")) return;
    this.entries = this.entries.filter(e => e.id !== diaryId);
    localStorage.setItem("ktd_diaries", JSON.stringify(this.entries));
    this.renderDiaryCards();

    if (window.showToast) window.showToast("Diary entry removed.", "info");

    fetch(`/api/diary/${diaryId}`, { method: "DELETE" }).catch(() => {});
  },

  renderDiaryCards(containerId = "diaryEntriesContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.entries.length === 0) {
      container.innerHTML = `
        <div style="background:#ffffff; border-radius:24px; padding:48px; text-align:center; border:1px solid #eef0f3; max-width:480px; margin:0 auto; grid-column:1/-1;">
          <div style="font-size:36px; margin-bottom:12px;">📖</div>
          <h3 style="font-size:18px; font-weight:800; color:var(--dark-text); margin-bottom:6px;">Your Diary is Empty</h3>
          <p style="font-size:13px; color:#64748b; margin-bottom:20px;">
            Capture personal memories, morning plantation mist in Coorg, or sunset reflections at Om Beach.
          </p>
          <button onclick="document.getElementById('createDiaryModal').classList.add('open')" class="btn btn-primary btn-sm">
            Write First Entry
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = this.entries.map(entry => {
      const dest = window.karnatakaDestinations.find(d => (d.slug === entry.destinationId || d.id === entry.destinationId)) || {
        name: entry.destinationId,
        image: entry.image || "images/hero/karnataka-hero.jpg"
      };

      const stars = "★".repeat(entry.rating) + "☆".repeat(5 - entry.rating);

      return `
        <div class="destination-card" style="box-shadow:var(--shadow-card);">
          <div class="card-media">
            <img 
              src="${entry.image || dest.image}" 
              alt="${entry.title}" 
              onerror="this.src='images/hero/karnataka-hero.jpg'"
            />
            <div class="card-image-overlay"></div>
            <div class="card-category-badge">📍 ${dest.name}</div>
            <div class="card-media-bottom">
              <span style="font-size:11px; font-weight:600;">📅 ${entry.visitDate}</span>
              <span style="color:#fbbf24; font-weight:800; font-size:12px;">${stars}</span>
            </div>
          </div>
          <div class="card-body">
            <div>
              <h3 style="font-size:17px; font-weight:800; color:var(--dark-text); margin-bottom:8px; line-height:1.3;">
                ${entry.title}
              </h3>
              <p style="font-size:12px; color:#475569; line-height:1.6; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden;">
                &ldquo;${entry.content}&rdquo;
              </p>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid #f1f5f9;">
              <a href="destination.html?id=${dest.slug || dest.id}" style="font-size:12px; font-weight:700; color:var(--primary-brand);">
                Explore ${dest.name} →
              </a>
              <button onclick="Diary.delete('${entry.id}')" style="color:#ef4444; font-size:14px; padding:4px;" title="Delete Entry">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
};

window.Diary = Diary;
