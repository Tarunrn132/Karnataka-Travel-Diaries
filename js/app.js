/**
 * Karnataka Travel Diaries - Main App Coordinator & Global Utilities
 */

// Toast notification helper
function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
window.showToast = showToast;

// Haversine formula calculation in kilometers
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
window.calculateHaversineDistance = calculateHaversineDistance;

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  if (window.Favorites) window.Favorites.init();
  if (window.Trips) window.Trips.init();
  if (window.Diary) window.Diary.init();
  if (window.Reviews) window.Reviews.init();

  // Mobile drawer toggle
  const hamburgerBtn = document.getElementById("mobileHamburgerBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("open");
    });
  }

  // Active navigation highlight
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link, .bottom-nav-item");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});

// Reusable Global Image Fallback
window.addEventListener("error", (e) => {
  if (e.target && e.target.tagName === "IMG") {
    const fallback = "images/hero/karnataka-hero.jpg";
    if (!e.target.src.endsWith("karnataka-hero.jpg") && !e.target.dataset.failed) {
      e.target.dataset.failed = "true";
      e.target.src = fallback;
    }
  }
}, true);

