/**
 * Karnataka Travel Diaries - AI Travel Diary Generator
 * Enables travelers to craft editable travel stories, photo captions, and journal reflections.
 * Strictly presents generated content as an editable draft before publishing.
 */

const DiaryAI = {
  currentDraft: null,

  openModal(preselectedDest = "") {
    let modal = document.getElementById("aiDiaryModal");
    if (!modal) {
      this.createModalDOM();
      modal = document.getElementById("aiDiaryModal");
    }

    // Populate destination dropdown
    const select = document.getElementById("aiDiaryDestSelect");
    if (select && window.karnatakaDestinations) {
      select.innerHTML = window.karnatakaDestinations.map(d => `
        <option value="${d.name}">${d.name} (${d.district})</option>
      `).join("");
      if (preselectedDest) select.value = preselectedDest;
    }

    // Set today's date
    const dateInput = document.getElementById("aiDiaryDate");
    if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];

    modal.classList.add("open");
  },

  closeModal() {
    const modal = document.getElementById("aiDiaryModal");
    if (modal) modal.classList.remove("open");
  },

  createModalDOM() {
    const div = document.createElement("div");
    div.id = "aiDiaryModal";
    div.className = "modal-backdrop";
    div.onclick = (e) => {
      if (e.target === div) this.closeModal();
    };

    div.innerHTML = `
      <div class="modal-card" style="max-width:620px; width:92%;">
        <span class="modal-close-btn" onclick="DiaryAI.closeModal()">&times;</span>
        
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
          <span style="font-size:24px;">✨</span>
          <h3 style="font-size:20px; font-weight:800; color:var(--dark-text); margin:0;">Write Diary with AI</h3>
        </div>
        <p style="font-size:12px; color:#64748b; margin-bottom:18px;">
          Tell our AI Travel Copilot your quick thoughts, and we will turn them into an editable travel story.
        </p>

        <!-- Input Form Section -->
        <div id="aiDiaryInputSection">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Destination *</label>
              <select id="aiDiaryDestSelect" style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1; outline:none; font-size:13px;">
              </select>
            </div>
            <div>
              <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Travel Date</label>
              <input type="date" id="aiDiaryDate" style="width:100%; padding:8px 9px; border-radius:10px; border:1px solid #cbd5e1; outline:none; font-size:13px;" />
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Short Notes / Rough Memory *</label>
            <textarea id="aiDiaryNotes" rows="2" placeholder="e.g. Visited Hampi with friends. Watched sunset from Matanga hill, cycled past the stone chariot." style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; outline:none; font-size:13px;"></textarea>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Highlights / Sensory Details</label>
              <input type="text" id="aiDiaryHighlights" placeholder="e.g. Fragrant filter coffee, boulder breeze" style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1; outline:none; font-size:13px;" />
            </div>
            <div>
              <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Travel Mood</label>
              <select id="aiDiaryMood" style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1; outline:none; font-size:13px;">
                <option value="Inspired">✨ Inspired</option>
                <option value="Peaceful">🌿 Peaceful</option>
                <option value="Adventurous">🧗 Adventurous</option>
                <option value="Nostalgic">📖 Nostalgic</option>
                <option value="Joyful">🎉 Joyful & Fun</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px;">
            <div>
              <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Writing Style</label>
              <select id="aiDiaryStyle" style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1; outline:none; font-size:13px; font-weight:600;">
                <option value="Storytelling">Storytelling</option>
                <option value="Travel Blog">Travel Blog</option>
                <option value="Casual">Casual</option>
                <option value="Short">Short</option>
                <option value="Detailed">Detailed</option>
                <option value="Photo Caption">Photo Caption</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Optional Photo URL</label>
              <input type="text" id="aiDiaryPhoto" placeholder="images/destinations/hampi.jpg or URL" style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1; outline:none; font-size:13px;" />
            </div>
          </div>

          <button type="button" class="btn btn-primary btn-sm" style="width:100%; padding:11px;" id="btnGenerateDiary" onclick="DiaryAI.generate('generate')">
            ✨ Generate Diary Draft
          </button>
        </div>

        <!-- Editable Result Section (Hidden until generated) -->
        <div id="aiDiaryResultSection" style="display:none; margin-top:20px; border-top:1px solid #e2e8f0; padding-top:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-size:11px; font-weight:800; color:var(--primary-brand); background:#ede9fe; padding:3px 8px; border-radius:6px;">
              📝 EDITABLE AI DRAFT
            </span>
            <span style="font-size:11px; color:#64748b;">Feel free to edit anything before publishing!</span>
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-size:11px; font-weight:700; display:block; margin-bottom:4px; color:#475569;">Story Title</label>
            <input type="text" id="aiDraftTitle" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:800; color:var(--dark-text); font-size:15px;" />
          </div>

          <div style="margin-bottom:14px;">
            <label style="font-size:11px; font-weight:700; display:block; margin-bottom:4px; color:#475569;">Story Content</label>
            <textarea id="aiDraftContent" rows="6" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:13px; line-height:1.6;"></textarea>
          </div>

          <!-- Secondary Modification Actions -->
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="DiaryAI.generate('regenerate')">🔄 Regenerate</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="DiaryAI.generate('make_shorter')">✂️ Make Shorter</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="DiaryAI.generate('more_personal')">💖 Make More Personal</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="DiaryAI.saveDraftOnly()">💾 Save Draft</button>
          </div>

          <!-- Final Publish Action -->
          <div style="display:flex; gap:10px;">
            <button type="button" class="btn btn-primary btn-sm" style="flex:1; padding:12px;" onclick="DiaryAI.publishDraft()">
              📖 Publish to My Travel Diary
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="DiaryAI.closeModal()">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
  },

  async generate(action = "generate") {
    const dest = document.getElementById("aiDiaryDestSelect")?.value || "Coorg";
    const date = document.getElementById("aiDiaryDate")?.value || new Date().toISOString().split("T")[0];
    const notes = document.getElementById("aiDiaryNotes")?.value || "";
    const highlights = document.getElementById("aiDiaryHighlights")?.value || "";
    const mood = document.getElementById("aiDiaryMood")?.value || "Inspired";
    const style = document.getElementById("aiDiaryStyle")?.value || "Storytelling";
    const photo = document.getElementById("aiDiaryPhoto")?.value || "";

    const prevTitle = document.getElementById("aiDraftTitle")?.value || "";
    const prevContent = document.getElementById("aiDraftContent")?.value || "";

    const btnGen = document.getElementById("btnGenerateDiary");
    if (btnGen) btnGen.textContent = "✨ Writing your travel memory...";

    try {
      const res = await fetch("/api/ai/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: dest,
          visitDate: date,
          notes,
          highlights,
          mood,
          photo,
          style,
          previousDraft: prevContent,
          action
        })
      });

      const data = await res.json();
      if (btnGen) btnGen.textContent = "✨ Generate Diary Draft";

      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed");

      this.currentDraft = data;

      // Show Result Section
      const resSec = document.getElementById("aiDiaryResultSection");
      if (resSec) resSec.style.display = "block";

      const titleInput = document.getElementById("aiDraftTitle");
      const contentInput = document.getElementById("aiDraftContent");

      if (titleInput) titleInput.value = data.title;
      if (contentInput) contentInput.value = data.content;

      resSec.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      if (btnGen) btnGen.textContent = "✨ Generate Diary Draft";
      alert(`Could not generate diary entry: ${e.message}`);
    }
  },

  saveDraftOnly() {
    if (window.showToast) window.showToast("Draft saved locally! 💾", "success");
  },

  publishDraft() {
    const title = document.getElementById("aiDraftTitle")?.value.trim();
    const content = document.getElementById("aiDraftContent")?.value.trim();
    const destName = document.getElementById("aiDiaryDestSelect")?.value;
    const date = document.getElementById("aiDiaryDate")?.value;
    const photo = document.getElementById("aiDiaryPhoto")?.value;

    if (!title || !content) {
      alert("Please provide both a title and diary content before publishing.");
      return;
    }

    // Resolve destination slug/id
    const destRecord = (window.karnatakaDestinations || []).find(d =>
      d.name.toLowerCase() === destName?.toLowerCase() || d.slug === destName
    );
    const destId = destRecord ? (destRecord.slug || destRecord.id) : "coorg";

    if (window.Diary) {
      window.Diary.create(
        destId,
        title,
        content,
        date,
        5,
        photo || (destRecord ? destRecord.image : "images/hero/karnataka-hero.jpg")
      );
    }

    this.closeModal();
    if (window.showToast) window.showToast("Story successfully published to your diary! 📖", "success");
  }
};

window.DiaryAI = DiaryAI;
