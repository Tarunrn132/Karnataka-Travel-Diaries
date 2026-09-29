/**
 * Karnataka Travel Diaries - Favorites / Bookmarks Manager
 */

const Favorites = {
  ids: new Set(),

  init() {
    const stored = localStorage.getItem("ktd_favorites");
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        this.ids = new Set(arr);
      } catch (e) {
        this.ids = new Set();
      }
    }
    this.syncWithServer();
    this.updateBadges();
  },

  async syncWithServer() {
    if (!window.Auth || !window.Auth.isLoggedIn()) return;
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        if (data.destinations) {
          data.destinations.forEach(d => this.ids.add(d.id || d.slug));
          localStorage.setItem("ktd_favorites", JSON.stringify([...this.ids]));
          this.updateBadges();
          this.updateCardHeartIcons();
        }
      }
    } catch (e) {
      // Ignored
    }
  },

  isFavorited(destinationId) {
    return this.ids.has(destinationId);
  },

  async toggle(destinationId) {
    const isFav = this.ids.has(destinationId);
    if (isFav) {
      this.ids.delete(destinationId);
    } else {
      this.ids.add(destinationId);
    }

    localStorage.setItem("ktd_favorites", JSON.stringify([...this.ids]));
    this.updateBadges();
    this.updateCardHeartIcons();

    if (window.showToast) {
      window.showToast(
        isFav ? "Removed from saved places." : "Added to your saved places! ❤️",
        isFav ? "info" : "success"
      );
    }

    // Sync with API if logged in
    if (window.Auth && window.Auth.isLoggedIn()) {
      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destinationId }),
        });
      } catch (e) {
        // Ignored
      }
    }
  },

  updateBadges() {
    const badges = document.querySelectorAll(".fav-badge");
    badges.forEach(b => {
      b.textContent = this.ids.size;
      b.style.display = this.ids.size > 0 ? "flex" : "none";
    });
  },

  updateCardHeartIcons() {
    const buttons = document.querySelectorAll("[data-favorite-id]");
    buttons.forEach(btn => {
      const id = btn.getAttribute("data-favorite-id");
      if (this.isFavorited(id)) {
        btn.classList.add("favorited");
        btn.innerHTML = "❤️";
      } else {
        btn.classList.remove("favorited");
        btn.innerHTML = "🤍";
      }
    });
  }
};

window.Favorites = Favorites;
