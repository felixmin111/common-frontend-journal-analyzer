<template>
  <section class="page">
    <!-- Top bar -->
    <header class="top">
      <div class="welcome">
        <div class="badge">✨ Your Space</div>
        <h1 class="title">Hi Min, write your journal ✍️</h1>
        <p class="sub">
          Just write naturally. The system will detect emotions & life areas with AI.
        </p>
      </div>

      <div class="dateArea">
        <div class="quickBtns">
          <button class="chip" @click="setToday">Today</button>
          <button class="chip" @click="setYesterday">Yesterday</button>
        </div>

        <label class="dateBox">
          <span class="label">Date</span>
          <input class="dateInput" type="date" v-model="form.date" />
        </label>
      </div>
    </header>

    <!-- Main -->
    <div class="layout">
      <!-- Editor -->
      <div class="card editorCard">
        <div class="editorHead">
          <div>
            <div class="editorTitle">Journaling Box</div>
            <div class="editorHint">
              Tip: write what happened + what you felt + why you think you felt that way.
            </div>
          </div>

          <div class="meta">
            <span class="pill">{{ wordCount }} words</span>
            <span class="pill" v-if="draftState">{{ draftState }}</span>
          </div>
        </div>

        <textarea
          class="textarea"
          v-model="form.text"
          placeholder="Start typing… (example: Today I felt..., because...)"
          rows="14"
          @input="markDraftDirty"
        />

        <div class="bottomRow">
          <div class="privacy">
            🔒 Your text stays private in your app. (You can connect API later.)
          </div>

          <div class="actions">
            <button class="btn ghost" @click="clear" :disabled="loading">
              Clear
            </button>
            <button class="btn primary" @click="saveAndAnalyze" :disabled="loading || !canSave">
              {{ loading ? "Analyzing..." : "Save & Analyze" }}
            </button>
          </div>
        </div>

        <p class="status" v-if="status">{{ status }}</p>
      </div>

      <!-- AI Insight (right side) -->
      <aside class="side">
        <div class="card insightCard">
          <div class="insightTitle">
            <span class="spark">🤖</span>
            AI Insight
          </div>
          <p class="insightSub">
            After you click <b>Save & Analyze</b>, we’ll show detected emotion and life-area summary.
          </p>

          <div class="insightGrid">
            <div class="insightItem">
              <div class="k">Dominant Emotion</div>
              <div class="v">{{ insight.emotion ?? "—" }}</div>
            </div>
            <div class="insightItem">
              <div class="k">Intensity</div>
              <div class="v">{{ insight.intensity ?? "—" }}</div>
            </div>
            <div class="insightItem full">
              <div class="k">Life Areas</div>
              <div class="v">
                {{ insight.areas?.length ? insight.areas.join(", ") : "—" }}
              </div>
            </div>
            <div class="insightItem full">
              <div class="k">Short Summary</div>
              <div class="v">
                {{ insight.summary ?? "—" }}
              </div>
            </div>
          </div>

          <div class="softDivider"></div>

          <div class="miniActions">
            <button class="miniBtn" @click="fillExample" :disabled="loading">
              Insert Example
            </button>
            <button class="miniBtn" @click="copyText" :disabled="!form.text.trim() || loading">
              Copy Text
            </button>
          </div>
        </div>

        <div class="card helperCard">
          <div class="helperTitle">Gentle Prompts</div>
          <ul class="prompts">
            <li>What was the best moment today?</li>
            <li>What made you stressed or happy?</li>
            <li>What do you want to improve tomorrow?</li>
          </ul>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue"

interface JournalForm {
  date: string
  text: string
}

interface AiInsight {
  emotion: string | null
  intensity: string | null
  areas: string[] | null
  summary: string | null
}

const todayISO = () => new Date().toISOString().slice(0, 10)
const yesterdayISO = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

const form = reactive<JournalForm>({
  date: todayISO(),
  text: "",
})

const insight = reactive<AiInsight>({
  emotion: null,
  intensity: null,
  areas: null,
  summary: null,
})

const loading = ref(false)
const status = ref("")
const draftState = ref<"" | "Draft saved">("")

const canSave = computed(() => form.text.trim().length >= 10)

const wordCount = computed(() => {
  const t = form.text.trim()
  if (!t) return 0
  return t.split(/\s+/).filter(Boolean).length
})

function setToday() {
  form.date = todayISO()
}

function setYesterday() {
  form.date = yesterdayISO()
}

function clear() {
  form.text = ""
  status.value = ""
  draftState.value = ""
  insight.emotion = null
  insight.intensity = null
  insight.areas = null
  insight.summary = null
  localStorage.removeItem(draftKey())
}

function draftKey() {
  // per-date draft
  return `journal_draft_${form.date}`
}

function markDraftDirty() {
  draftState.value = ""
}

function saveDraft() {
  localStorage.setItem(draftKey(), form.text)
  draftState.value = "Draft saved"
}

function loadDraft() {
  const d = localStorage.getItem(draftKey())
  if (d && !form.text) {
    form.text = d
    draftState.value = "Draft loaded"
  }
}

function fillExample() {
  form.text =
    "Today I felt a mix of emotions. I was proud because I finished my tasks, but I also felt a bit tired. " +
    "I think I need better rest tonight and a clearer plan for tomorrow."
  markDraftDirty()
}

async function copyText() {
  await navigator.clipboard.writeText(form.text)
  status.value = "✅ Copied to clipboard"
  setTimeout(() => (status.value = ""), 1400)
}

// Auto-save draft (every ~800ms after typing)
let draftTimer: number | null = null
watch(
  () => form.text,
  () => {
    if (draftTimer) window.clearTimeout(draftTimer)
    draftTimer = window.setTimeout(() => saveDraft(), 800)
  }
)

// If date changes, load draft for that date
watch(
  () => form.date,
  () => {
    draftState.value = ""
    status.value = ""
    insight.emotion = null
    insight.intensity = null
    insight.areas = null
    insight.summary = null
    // load draft for selected date
    form.text = ""
    loadDraft()
  }
)

onMounted(() => {
  loadDraft()
})

async function saveAndAnalyze() {
  loading.value = true
  status.value = ""

  try {
    // TODO: Replace with real backend calls:
    // 1) Save entry
    // 2) Call AI analyze endpoint -> return emotion/areas/summary
    const payload = { date: form.date, text: form.text }
    console.log("Save payload:", payload)

    // Fake AI response (demo only)
    await new Promise((r) => setTimeout(r, 700))

    insight.emotion = "Calm / Reflective"
    insight.intensity = "Medium"
    insight.areas = ["Personal Growth", "Routine"]
    insight.summary = "You reflected on your day, felt proud but tired, and plan to rest and improve tomorrow."

    saveDraft() // keep latest
    status.value = "✅ Saved & analyzed"
  } catch (e) {
    status.value = "❌ Failed. Please try again."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Page background (soft + attractive) */
.page {
  padding: 12px 0;
}

/* Top */
.top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.welcome {
  max-width: 680px;
}
.badge {
  display: inline-block;
  font-weight: 900;
  font-size: 12px;
  color: #3730a3;
  background: #eef2ff;
  border: 1px solid #e0e7ff;
  padding: 6px 10px;
  border-radius: 999px;
}
.title {
  margin: 10px 0 4px;
  font-size: 30px;
  font-weight: 950;
  color: #111827;
  letter-spacing: 0.2px;
}
.sub {
  margin: 0;
  color: #6b7280;
  font-weight: 700;
  font-size: 13px;
}

/* Date controls */
.dateArea {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.quickBtns {
  display: flex;
  gap: 8px;
}
.chip {
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
}
.chip:hover {
  background: #f3f4f6;
}

.dateBox {
  display: grid;
  gap: 6px;
}
.label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 900;
}
.dateInput {
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 800;
  color: #111827;
}

/* Layout */
.layout {
  display: grid;
  grid-template-columns: 1.55fr 0.85fr;
  gap: 14px;
  align-items: start;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

/* Cards */
.card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #eef2f7;
  border-radius: 18px;
  box-shadow: 0 16px 34px rgba(17, 24, 39, 0.06);
}

/* Editor */
.editorCard {
  padding: 16px;
}

.editorHead {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.editorTitle {
  font-weight: 950;
  color: #111827;
  font-size: 15px;
}
.editorHint {
  margin-top: 4px;
  color: #6b7280;
  font-weight: 700;
  font-size: 12px;
}

.meta {
  display: flex;
  gap: 8px;
  align-items: center;
}
.pill {
  font-size: 12px;
  font-weight: 900;
  color: #4b5563;
  background: #f9fafb;
  border: 1px solid #eef2f7;
  padding: 7px 10px;
  border-radius: 999px;
}

/* Textarea */
.textarea {
  width: 100%;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: linear-gradient(180deg, #ffffff, #fbfbff);
  padding: 14px;
  outline: none;
  font-size: 14px;
  font-weight: 650;
  color: #111827;
  line-height: 1.6;
  resize: vertical;
  min-height: 360px;
}

.textarea:focus {
  border-color: #c7d2fe;
  box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.12);
}

/* Bottom row */
.bottomRow {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.privacy {
  color: #6b7280;
  font-weight: 750;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 10px 14px;
  border-radius: 14px;
  font-weight: 950;
  cursor: pointer;
  font-size: 13px;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn.ghost:hover {
  background: #f3f4f6;
}
.btn.primary {
  border-color: #e0e7ff;
  background: linear-gradient(180deg, #eef2ff, #ffffff);
  color: #3730a3;
  box-shadow: 0 14px 28px rgba(99, 102, 241, 0.14);
}
.btn.primary:hover {
  box-shadow: 0 18px 34px rgba(99, 102, 241, 0.18);
}

.status {
  margin: 10px 0 0;
  color: #6b7280;
  font-weight: 900;
  font-size: 12px;
}

/* Side cards */
.side {
  display: grid;
  gap: 14px;
}

.insightCard {
  padding: 14px;
}

.insightTitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 950;
  color: #111827;
  margin-bottom: 6px;
}
.spark {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f5f3ff;
  border: 1px solid #e9d5ff;
}
.insightSub {
  margin: 0 0 12px;
  color: #6b7280;
  font-weight: 700;
  font-size: 12px;
}

.insightGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.insightItem {
  border: 1px solid #eef2f7;
  background: #fff;
  border-radius: 16px;
  padding: 10px 12px;
}
.insightItem.full {
  grid-column: 1 / -1;
}
.k {
  font-size: 11px;
  color: #6b7280;
  font-weight: 900;
}
.v {
  margin-top: 6px;
  color: #111827;
  font-weight: 950;
  font-size: 13px;
  line-height: 1.3;
}

.softDivider {
  height: 1px;
  background: #eef2f7;
  margin: 12px 0;
}

.miniActions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.miniBtn {
  border: 1px solid #eef2f7;
  background: #fff;
  padding: 9px 12px;
  border-radius: 14px;
  font-weight: 950;
  font-size: 12px;
  cursor: pointer;
}
.miniBtn:hover {
  background: #f9fafb;
}

.helperCard {
  padding: 14px;
}
.helperTitle {
  font-weight: 950;
  color: #111827;
  margin-bottom: 10px;
}
.prompts {
  margin: 0;
  padding-left: 16px;
  color: #6b7280;
  font-weight: 750;
  font-size: 12px;
  display: grid;
  gap: 8px;
}

/* Make textarea (and everything) respect container width */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Ensure the card clips anything that goes outside */
.editorCard {
  overflow: hidden;
}

/* Ensure textarea never becomes wider than container */
.textarea {
  display: block;
  width: 100%;
  max-width: 100%;
}
</style>
