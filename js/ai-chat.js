/**
 * Karnataka Travel Diaries - Floating AI Travel Assistant
 * Provides interactive chat copilot with grounded responses and structured trip recommendations.
 */

const AIChat = {
  isOpen: false,
  history: [],
  containerCreated: false,

  suggestedQuestions: [
    "Plan a 3-day Coorg trip",
    "Where can I go from Bengaluru for 2 days?",
    "I like beaches and temples",
    "Suggest a trip under ₹5,000",
    "What should I visit in Hampi?",
    "Suggest peaceful hill stations"
  ],

  init() {
    this.createFloatingButtonAndDrawer();
  },

  createFloatingButtonAndDrawer() {
    if (this.containerCreated || document.getElementById("aiChatFloatingBtn")) return;
    this.containerCreated = true;

    // 1. Floating Action Button
    const btn = document.createElement("button");
    btn.id = "aiChatFloatingBtn";
    btn.className = "floating-ai-btn";
    btn.setAttribute("aria-label", "Ask Karnataka AI Copilot");
    btn.innerHTML = `
      <span class="sparkle-icon">✨</span>
      <span>Ask Karnataka AI</span>
    `;
    btn.onclick = () => this.toggleDrawer();
    document.body.appendChild(btn);

    // 2. Chat Drawer Backdrop & Panel
    const drawerBackdrop = document.createElement("div");
    drawerBackdrop.id = "aiChatDrawerBackdrop";
    drawerBackdrop.className = "ai-chat-drawer-backdrop";
    drawerBackdrop.onclick = (e) => {
      if (e.target === drawerBackdrop) this.closeDrawer();
    };

    drawerBackdrop.innerHTML = `
      <div class="ai-chat-panel" id="aiChatPanel">
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-chat-title-wrap">
            <div class="ai-chat-avatar">✨</div>
            <div>
              <div class="ai-chat-title">Karnataka AI</div>
              <div class="ai-chat-sub">
                <span class="online-indicator"></span>
                <span>Your Karnataka Travel Assistant</span>
              </div>
            </div>
          </div>
          <button type="button" class="ai-chat-close-btn" onclick="AIChat.closeDrawer()" aria-label="Close Chat">&times;</button>
        </div>

        <!-- Chat Body -->
        <div class="ai-chat-body" id="aiChatMessages">
          <div class="chat-msg ai-msg">
            <div class="chat-bubble">
              <p><strong>Namaskara! 🙏</strong></p>
              <p>I am your <strong>Karnataka AI Travel Copilot</strong>. Tell me where you are starting from, your duration, budget, or what experiences you love (misty hills, coastal beaches, ancient temples, or waterfalls).</p>
            </div>
          </div>
        </div>

        <!-- Suggested Question Pills -->
        <div class="chat-suggestions-strip" id="aiChatSuggestions">
          ${this.suggestedQuestions.map(q => `
            <button type="button" class="suggestion-pill" onclick="AIChat.handleSuggestedClick('${q.replace(/'/g, "\\'")}')">${q}</button>
          `).join("")}
        </div>

        <!-- Input Bar -->
        <form class="ai-chat-input-bar" onsubmit="AIChat.handleFormSubmit(event)">
          <input 
            type="text" 
            id="aiChatInput" 
            class="ai-chat-input" 
            placeholder="Ask anything about Karnataka travel..." 
            autocomplete="off"
          />
          <button type="submit" class="ai-chat-send-btn" aria-label="Send Message">➤</button>
        </form>
      </div>
    `;

    document.body.appendChild(drawerBackdrop);
  },

  toggleDrawer() {
    if (this.isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  },

  openDrawer() {
    this.isOpen = true;
    const backdrop = document.getElementById("aiChatDrawerBackdrop");
    if (backdrop) backdrop.classList.add("open");
    setTimeout(() => {
      const input = document.getElementById("aiChatInput");
      if (input) input.focus();
    }, 200);
  },

  closeDrawer() {
    this.isOpen = false;
    const backdrop = document.getElementById("aiChatDrawerBackdrop");
    if (backdrop) backdrop.classList.remove("open");
  },

  handleSuggestedClick(question) {
    const input = document.getElementById("aiChatInput");
    if (input) {
      input.value = question;
      this.sendMessage(question);
    }
  },

  handleFormSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("aiChatInput");
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;
    input.value = "";
    this.sendMessage(msg);
  },

  async sendMessage(text) {
    const messagesContainer = document.getElementById("aiChatMessages");
    if (!messagesContainer) return;

    // 1. Append User Message Bubble
    this.appendUserMessage(text);

    // 2. Append Loading Placeholder
    const loadingId = "loading-" + Date.now();
    const loadingElem = document.createElement("div");
    loadingElem.id = loadingId;
    loadingElem.className = "chat-msg ai-msg";
    loadingElem.innerHTML = `
      <div class="chat-bubble" style="color:#64748b; font-style:italic;">
        <span>✨ Analyzing Karnataka knowledge base...</span>
      </div>
    `;
    messagesContainer.appendChild(loadingElem);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 3. Call Backend API
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: this.history })
      });

      const data = await res.json();
      loadingElem.remove();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to receive response");
      }

      // 4. Append AI Answer Bubble
      this.appendAIMessage(data.reply, data.structuredTrip);

      // Save to history
      this.history.push({ role: "user", content: text });
      this.history.push({ role: "assistant", content: data.reply });
    } catch (err) {
      if (loadingElem) loadingElem.remove();
      const errElem = document.createElement("div");
      errElem.className = "chat-msg ai-msg";
      errElem.innerHTML = `
        <div class="chat-bubble" style="border-color:#fecaca; background:#fff5f5; color:#b91c1c;">
          ⚠️ <strong>Travel Copilot Notice</strong><br>
          ${err.message || "AI service is temporarily unavailable. You can continue exploring Karnataka normally."}
        </div>
      `;
      messagesContainer.appendChild(errElem);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  },

  appendUserMessage(text) {
    const container = document.getElementById("aiChatMessages");
    const div = document.createElement("div");
    div.className = "chat-msg user-msg";
    div.innerHTML = `<div class="chat-bubble">${this.escapeHTML(text)}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  appendAIMessage(markdownText, structuredTrip = null) {
    const container = document.getElementById("aiChatMessages");
    const div = document.createElement("div");
    div.className = "chat-msg ai-msg";

    // Format simple markdown into paragraphs and bold text
    let formatted = markdownText
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/•\s*(.*?)(?=\n|$)/g, "<div>• $1</div>")
      .split("\n\n")
      .map(p => `<p>${p}</p>`)
      .join("");

    let structuredHtml = "";
    if (structuredTrip) {
      structuredHtml = `
        <div class="structured-trip-card">
          ${structuredTrip.image ? `
            <div class="structured-card-hero">
              <img src="${structuredTrip.image}" alt="${structuredTrip.title}" onerror="this.src='images/hero/karnataka-hero.jpg'" />
              <div class="structured-card-badge">✨ Recommended Trip</div>
            </div>
          ` : ''}
          <div class="structured-card-body">
            <h4 class="structured-card-title">${structuredTrip.title}</h4>
            
            <div class="structured-meta-row">
              <div class="structured-meta-item">
                <strong>Duration</strong>
                <span>⏱️ ${structuredTrip.duration}</span>
              </div>
              <div class="structured-meta-item">
                <strong>Est. Budget</strong>
                <span>💰 ${structuredTrip.estimatedBudget}</span>
              </div>
            </div>

            ${structuredTrip.perfectFor ? `
              <div style="font-size:11px; color:#475569; margin-bottom:10px;">
                <strong>Perfect For:</strong> ${structuredTrip.perfectFor}
              </div>
            ` : ''}

            <!-- Mini Timeline -->
            ${structuredTrip.timeline && structuredTrip.timeline.length > 0 ? `
              <div class="structured-timeline">
                ${structuredTrip.timeline.map(t => `
                  <div class="timeline-mini-node">
                    <span class="day-tag">DAY ${t.day}</span>
                    <span>${t.route}</span>
                  </div>
                `).join("")}
              </div>
            ` : ''}

            <div class="structured-actions-grid">
              <a href="ai-planner.html" class="btn-structured primary">
                📋 View Full Plan
              </a>
              ${structuredTrip.destinations && structuredTrip.destinations[0] ? `
                <button type="button" class="btn-structured secondary" onclick="Destinations.getDirections(${structuredTrip.destinations[0].latitude}, ${structuredTrip.destinations[0].longitude}, '${structuredTrip.destinations[0].name.replace(/'/g, "\\'")}')">
                  🧭 Directions
                </button>
              ` : ''}
              <a href="map.html" class="btn-structured secondary">
                🗺️ View Map
              </a>
              <button type="button" class="btn-structured secondary" onclick="AIChat.saveTripFromCard('${encodeURIComponent(JSON.stringify(structuredTrip))}')">
                💾 Save Trip
              </button>
            </div>
          </div>
        </div>
      `;
    }

    div.innerHTML = `
      <div class="chat-bubble">
        ${formatted}
        ${structuredHtml}
      </div>
    `;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  saveTripFromCard(encodedTripJson) {
    try {
      const trip = JSON.parse(decodeURIComponent(encodedTripJson));
      const slugs = (trip.destinations || []).map(d => d.slug);
      if (window.Trips) {
        window.Trips.create(
          trip.title || "AI Planned Journey",
          `Created via Karnataka AI Copilot (${trip.duration})`,
          new Date().toISOString().split("T")[0],
          "",
          slugs
        );
        if (window.showToast) window.showToast("Trip saved to your itineraries! 📅", "success");
      }
    } catch (e) {
      if (window.showToast) window.showToast("Could not save trip.", "error");
    }
  },

  escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
};

window.AIChat = AIChat;

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  AIChat.init();
});
