/**
 * Karnataka Travel Diaries - Reviews & Ratings Engine
 */

const Reviews = {
  reviews: {},

  init() {
    const stored = localStorage.getItem("ktd_reviews");
    if (stored) {
      try {
        this.reviews = JSON.parse(stored);
      } catch (e) {
        this.reviews = {};
      }
    }
  },

  getReviews(destinationId) {
    return this.reviews[destinationId] || [
      {
        id: "rev-seed-1",
        userName: "Tarun Naik",
        rating: 5,
        date: "2026-09-10",
        comment: "Exceeded all our expectations! The scenic beauty and cultural history were absolutely captivating. Truly an unforgettable Karnataka experience."
      }
    ];
  },

  addReview(destinationId, userName, rating, comment) {
    if (!this.reviews[destinationId]) {
      this.reviews[destinationId] = this.getReviews(destinationId);
    }

    const newRev = {
      id: "rev-" + Date.now(),
      userName: userName || "Traveler",
      rating: parseInt(rating) || 5,
      date: new Date().toISOString().split("T")[0],
      comment: comment.trim()
    };

    this.reviews[destinationId].unshift(newRev);
    localStorage.setItem("ktd_reviews", JSON.stringify(this.reviews));

    if (window.showToast) window.showToast("Review submitted! Thank you for sharing.", "success");

    // Sync to API
    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationId,
        rating: newRev.rating,
        comment: newRev.comment,
        name: newRev.userName
      })
    }).catch(() => {});

    return newRev;
  }
};

window.Reviews = Reviews;
