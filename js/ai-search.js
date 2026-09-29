/**
 * Karnataka Travel Diaries - AI Natural-Language Destination Search
 * Seamlessly differentiates between exact single-word lookups and complex conversational requests.
 * Extracts intent, distance, budget, and vibes from plain English.
 */

const AISearch = {
  isComplexQuery(query) {
    const q = (query || "").trim();
    const words = q.split(/\s+/);
    if (words.length > 2) return true;
    return /(within|under|near|for|with|best|peaceful|budget|days|trip|suggest|plan|from)/i.test(q);
  },

  async executeSearch(query, onResultsCallback) {
    if (!query || query.trim().length === 0) return;

    // 1. Simple query: perform instant local search without hitting AI endpoint
    if (!this.isComplexQuery(query)) {
      const q = query.toLowerCase().trim();
      const localMatches = (window.karnatakaDestinations || []).filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
      if (onResultsCallback) {
        onResultsCallback({
          isAI: false,
          query,
          destinations: localMatches,
          explanation: `Showing matching places for "${query}"`
        });
      }
      return;
    }

    // 2. Conversational query: call AI Natural Language Search endpoint
    try {
      if (window.showToast) window.showToast("✨ AI Copilot parsing your search request...", "info");

      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Search error");
      }

      if (onResultsCallback) {
        onResultsCallback({
          isAI: true,
          query,
          filters: data.filters,
          destinations: data.results.map(r => ({
            ...r.destination,
            distanceFromOrigin: r.distanceFromOrigin,
            matchScore: r.matchScore,
            reasons: r.reasons
          })),
          explanation: `AI Matched ${data.resultsCount} places based on your criteria (${data.filters.origin ? `from ${data.filters.origin}` : ''} ${data.filters.maxDistance ? `within ${data.filters.maxDistance} km` : ''})`
        });
      }
    } catch (err) {
      console.warn("AI search fallback to text search:", err);
      const q = query.toLowerCase().trim();
      const localMatches = (window.karnatakaDestinations || []).filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.shortDescription.toLowerCase().includes(q)
      );
      if (onResultsCallback) {
        onResultsCallback({
          isAI: false,
          query,
          destinations: localMatches,
          explanation: `Standard results for "${query}"`
        });
      }
    }
  }
};

window.AISearch = AISearch;
