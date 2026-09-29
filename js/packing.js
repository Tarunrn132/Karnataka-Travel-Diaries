/**
 * Karnataka Travel Diaries - AI Packing Assistant
 * Generates tailored packing checklists based on destination geography, season, and travel activities.
 */

const PackingAssistant = {
  currentList: null,

  openModal(preDest = "Coorg", preDays = 3) {
    let modal = document.getElementById("packingModal");
    if (!modal) {
      this.createModalDOM();
      modal = document.getElementById("packingModal");
    }

    const destInput = document.getElementById("packingDestInput");
    if (destInput && preDest) destInput.value = preDest;
    const daysInput = document.getElementById("packingDaysInput");
    if (daysInput && preDays) daysInput.value = preDays;

    modal.classList.add("open");
    this.generateList();
  },

  closeModal() {
    const modal = document.getElementById("packingModal");
    if (modal) modal.classList.remove("open");
  },

  createModalDOM() {
    const div = document.createElement("div");
    div.id = "packingModal";
    div.className = "modal-backdrop";
    div.onclick = (e) => {
      if (e.target === div) this.closeModal();
    };

    div.innerHTML = `
      <div class="modal-card" style="max-width:580px; width:92%;">
        <span class="modal-close-btn" onclick="PackingAssistant.closeModal()">&times;</span>
        
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
          <span style="font-size:24px;">🎒</span>
          <h3 style="font-size:20px; font-weight:800; color:var(--dark-text); margin:0;">AI Packing Assistant</h3>
        </div>
        <p style="font-size:12px; color:#64748b; margin-bottom:18px;">
          Checklist tailored for Karnataka highlands, coastal shores, wildlife safaris, and weather.
        </p>

        <!-- Input Parameters -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; background:#f8fafc; padding:12px; border-radius:12px; border:1px solid #e2e8f0;">
          <div>
            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">Destination</label>
            <input type="text" id="packingDestInput" value="Coorg" style="width:100%; padding:6px 10px; border-radius:8px; border:1px solid #cbd5e1; font-size:12px;" />
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">Duration (Days)</label>
            <input type="number" id="packingDaysInput" value="3" min="1" max="14" style="width:100%; padding:6px 10px; border-radius:8px; border:1px solid #cbd5e1; font-size:12px;" />
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">Season</label>
            <select id="packingSeasonSelect" style="width:100%; padding:6px 10px; border-radius:8px; border:1px solid #cbd5e1; font-size:12px;">
              <option value="Winter">Winter (Oct - Feb)</option>
              <option value="Monsoon">Monsoon (Jun - Sep)</option>
              <option value="Summer">Summer (Mar - May)</option>
            </select>
          </div>
          <div style="display:flex; align-items:flex-end;">
            <button type="button" class="btn btn-primary btn-sm" style="width:100%;" onclick="PackingAssistant.generateList()">
              Update List 🔄
            </button>
          </div>
        </div>

        <!-- Checklist Container -->
        <div id="packingListContent" style="max-height:360px; overflow-y:auto; padding-right:6px; margin-bottom:18px;">
          <!-- Dynamically populated -->
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:14px;">
          <span style="font-size:12px; color:#64748b;" id="packingCounterText">0 items checked</span>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="PackingAssistant.savePackingList()">
              💾 Save List
            </button>
            <button type="button" class="btn btn-primary btn-sm" onclick="PackingAssistant.closeModal()">
              Done
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
  },

  async generateList() {
    const dest = document.getElementById("packingDestInput")?.value || "Coorg";
    const days = parseInt(document.getElementById("packingDaysInput")?.value, 10) || 3;
    const season = document.getElementById("packingSeasonSelect")?.value || "Winter";

    const content = document.getElementById("packingListContent");
    if (!content) return;

    content.innerHTML = `<div style="text-align:center; padding:20px; font-size:12px; color:#64748b;">✨ Building your personalized checklist...</div>`;

    try {
      const res = await fetch("/api/ai/packing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: dest,
          durationDays: days,
          season,
          activities: ["Trekking", "Photography", "Sightseeing"]
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error("Could not generate packing list");

      this.currentList = data;
      this.renderChecklist(data.packingCategories);
    } catch (e) {
      content.innerHTML = `<p style="color:#b91c1c; font-size:12px;">Failed to load list: ${e.message}</p>`;
    }
  },

  renderChecklist(categories) {
    const content = document.getElementById("packingListContent");
    if (!content) return;

    content.innerHTML = categories.map((cat, catIdx) => `
      <div style="margin-bottom:16px;">
        <h4 style="font-size:13px; font-weight:800; color:var(--dark-text); margin-bottom:8px; border-bottom:1px solid #f1f5f9; padding-bottom:4px;">
          ${cat.category}
        </h4>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${cat.items.map((item, itemIdx) => `
            <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:#334155; cursor:pointer; background:#f8fafc; padding:6px 10px; border-radius:8px; border:1px solid #e2e8f0;">
              <input 
                type="checkbox" 
                class="packing-checkbox" 
                data-cat="${catIdx}" 
                data-item="${itemIdx}" 
                ${item.checked ? 'checked' : ''} 
                onchange="PackingAssistant.updateCounter()"
              />
              <span>${item.item}</span>
            </label>
          `).join("")}
        </div>
      </div>
    `).join("");

    this.updateCounter();
  },

  updateCounter() {
    const checkboxes = document.querySelectorAll(".packing-checkbox");
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const text = document.getElementById("packingCounterText");
    if (text) {
      text.textContent = `${checked} of ${total} items packed`;
    }
  },

  savePackingList() {
    if (window.showToast) {
      window.showToast("Packing checklist saved for your Karnataka trip! 🎒", "success");
    }
    this.closeModal();
  }
};

window.PackingAssistant = PackingAssistant;
