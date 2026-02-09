<template>
  <section class="page">
    <header class="top">
      <div>
        <h1 class="title">Daily Emotional Analysis</h1>
        <p class="sub">Pick a day to see the AI-detected emotion & insight.</p>
      </div>

      <div class="monthPicker">
        <label class="field">
          <span class="label">Year</span>
          <select v-model.number="year" class="select">
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </label>

        <label class="field">
          <span class="label">Month</span>
          <select v-model.number="month" class="select">
            <option v-for="m in 12" :key="m" :value="m">
              {{ monthNames[m - 1] }}
            </option>
          </select>
        </label>
      </div>
    </header>

    <div class="grid">
      <!-- Calendar -->
      <div class="card calendarCard">
        <div class="cardHead">
          <div class="cardTitle">Year / Month Picker</div>
          <div class="hint">{{ monthNames[month - 1] }} {{ year }}</div>
        </div>

        <div class="dow">
          <div v-for="d in dow" :key="d" class="dowCell">{{ d }}</div>
        </div>

        <div class="calGrid">
          <button
            v-for="cell in calendarCells"
            :key="cell.key"
            class="dayCell"
            :class="dayCellClass(cell)"
            :disabled="!cell.day"
            @click="cell.day && selectDay(cell.day)"
            type="button"
          >
            <span v-if="cell.day">{{ cell.day }}</span>
          </button>
        </div>

        <div class="legend">
          <span class="dot good" /> Positive
          <span class="dot bad" /> Negative
          <span class="dot neutral" /> Neutral
        </div>
      </div>

      <!-- Insight box -->
      <div class="card insightCard">
        <div class="cardHead">
          <div class="cardTitle">Date {{ selectedDate }}</div>
          <div class="pill">AI Result</div>
        </div>

        <div class="kv">
          <div class="k">Top Emotion</div>
          <div class="v">{{ analysis.topEmotion }} ({{ analysis.score.toFixed(2) }})</div>
        </div>

        <div class="kv">
          <div class="k">Life Area</div>
          <div class="v">{{ analysis.lifeAreas.join(", ") }}</div>
        </div>

        <div class="block">
          <div class="k">Summary</div>
          <div class="text">{{ analysis.summary }}</div>
        </div>

        <div class="block">
          <div class="k">Pattern to response</div>
          <div class="text">{{ analysis.pattern }}</div>
        </div>

        <div class="block">
          <div class="k">Better Pattern</div>
          <div class="text">{{ analysis.betterPattern }}</div>
        </div>
      </div>

      <!-- Chart -->
      <div class="card chartCard">
        <div class="cardHead">
          <div class="cardTitle">Emotion Distribution</div>
          <div class="hint">Scores (0–1)</div>
        </div>

<div class="chart">
  <div v-for="b in bars" :key="b.label" class="barWrap">
    <div class="barArea">
      <div class="bar" :style="{ height: `${Math.round(b.value * 180)}px` }"></div>
    </div>

    <div class="barValue">{{ b.value.toFixed(2) }}</div>
    <div class="barLabel">{{ b.label }}</div>
  </div>
</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"

type DayTone = "good" | "bad" | "neutral"

interface CalendarCell {
  key: string
  day: number | null
  tone?: DayTone
}

interface DailyAnalysis {
  topEmotion: string
  score: number
  lifeAreas: string[]
  summary: string
  pattern: string
  betterPattern: string
  bars: { label: string; value: number }[]
}

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

const dow = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

// initial: current month
const now = new Date()
const year = ref<number>(now.getFullYear())
const month = ref<number>(now.getMonth() + 1) // 1-12
const selectedDay = ref<number>(now.getDate())

const yearOptions = computed(() => {
  const base = now.getFullYear()
  return Array.from({ length: 7 }, (_, i) => base - 3 + i)
})

const selectedDate = computed(() => {
  const mm = String(month.value).padStart(2, "0")
  const dd = String(selectedDay.value).padStart(2, "0")
  return `${year.value}-${mm}-${dd}`
})

/**
 * Mock "calendar colors" (like your green/red boxes)
 * Later you can load from backend: daily tone based on top emotion.
 */
function toneForDay(day: number): DayTone {
  // simple deterministic rule (demo)
  if (day % 6 === 0) return "bad"
  if (day % 5 === 0) return "neutral"
  return "good"
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate()
}

/**
 * We want MON as first column (like your wireframe).
 * JS getDay: Sun=0..Sat=6
 * Convert to MON=0..SUN=6 offset.
 */
function mondayIndexOfFirstDay(y: number, m: number) {
  const js = new Date(y, m - 1, 1).getDay() // 0..6 (Sun..Sat)
  return (js + 6) % 7 // shift so Mon=0
}

const calendarCells = computed<CalendarCell[]>(() => {
  const totalDays = daysInMonth(year.value, month.value)
  const firstIdx = mondayIndexOfFirstDay(year.value, month.value)

  const cells: CalendarCell[] = []
  // leading blanks
  for (let i = 0; i < firstIdx; i++) {
    cells.push({ key: `b-${i}`, day: null })
  }
  // days
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ key: `d-${d}`, day: d, tone: toneForDay(d) })
  }
  // trailing blanks to fill last row nicely (optional)
  const remainder = cells.length % 7
  if (remainder !== 0) {
    const add = 7 - remainder
    for (let i = 0; i < add; i++) {
      cells.push({ key: `t-${i}`, day: null })
    }
  }
  return cells
})

function selectDay(day: number) {
  selectedDay.value = day
  loadAnalysis()
}

function dayCellClass(cell: CalendarCell) {
  return {
    empty: !cell.day,
    selected: cell.day === selectedDay.value,
    good: cell.tone === "good",
    bad: cell.tone === "bad",
    neutral: cell.tone === "neutral",
  }
}

/**
 * Mock analysis data
 * Replace with API call later using selectedDate.value
 */
const analysis = reactive<DailyAnalysis>({
  topEmotion: "Sadness",
  score: 0.62,
  lifeAreas: ["Work", "Personal"],
  summary: "Feeling heavy, low productivity, but showed up.",
  pattern: "When stressed, you tend to isolate and overthink, then push through slowly.",
  betterPattern: "Try a small task first + short break + ask for support if needed.",
  bars: [
    { label: "Happy", value: 0.35 },
    { label: "Sad", value: 0.62 },
    { label: "Confidence", value: 0.55 },
    { label: "Neutral", value: 0.18 },
  ],
})

const bars = computed(() => analysis.bars)

function loadAnalysis() {
  // Demo variations by day
  const d = selectedDay.value
  if (d % 6 === 0) {
    analysis.topEmotion = "Anger"
    analysis.score = 0.66
    analysis.lifeAreas = ["Work/Study", "Routine"]
    analysis.summary = "Irritated and tense, but kept moving forward."
    analysis.pattern = "Frustration rises when plans break; response becomes fast + reactive."
    analysis.betterPattern = "Pause 10 seconds, label the feeling, then choose 1 calm action."
    analysis.bars = [
      { label: "Happy", value: 0.10 },
      { label: "Sad", value: 0.22 },
      { label: "Confidence", value: 0.30 },
      { label: "Neutral", value: 0.25 },
    ]
  } else if (d % 5 === 0) {
    analysis.topEmotion = "Neutral"
    analysis.score = 0.58
    analysis.lifeAreas = ["Health", "Sleep/Energy"]
    analysis.summary = "A quiet day. Not bad, not great—just steady."
    analysis.pattern = "Low energy leads to low engagement."
    analysis.betterPattern = "Light exercise + early sleep can lift your baseline."
    analysis.bars = [
      { label: "Happy", value: 0.28 },
      { label: "Sad", value: 0.20 },
      { label: "Confidence", value: 0.36 },
      { label: "Neutral", value: 0.58 },
    ]
  } else {
    analysis.topEmotion = "Confidence"
    analysis.score = 0.64
    analysis.lifeAreas = ["Personal Growth", "Work/Study"]
    analysis.summary = "You felt capable and more focused today."
    analysis.pattern = "When you have clarity, you act with momentum."
    analysis.betterPattern = "Keep using small plans + checklists to maintain confidence."
    analysis.bars = [
      { label: "Happy", value: 0.42 },
      { label: "Sad", value: 0.16 },
      { label: "Confidence", value: 0.64 },
      { label: "Neutral", value: 0.22 },
    ]
  }
}

// When month/year changes, keep selected day in range
watch([year, month], () => {
  const max = daysInMonth(year.value, month.value)
  if (selectedDay.value > max) selectedDay.value = max
  loadAnalysis()
})

// initial
loadAnalysis()
</script>

<style scoped>
.page {
  padding: 10px 0;
}

/* Top header */
.top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 950;
  color: #111827;
}

.sub {
  margin: 6px 0 0;
  color: #6b7280;
  font-weight: 700;
  font-size: 13px;
}

/* Month picker */
.monthPicker {
  display: flex;
  gap: 10px;
  align-items: end;
  flex-wrap: wrap;
}
.field {
  display: grid;
  gap: 6px;
}
.label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 900;
}
.select {
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 800;
  color: #111827;
}

/* Layout grid like wireframe */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "cal cal"
    "ins chart";
  gap: 14px;
  align-items: start;
}

.calendarCard { grid-area: cal; }
.insightCard { grid-area: ins; }
.chartCard { grid-area: chart; }

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "cal"
      "ins"
      "chart";
  }
}

/* Cards */
.card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #eef2f7;
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 16px 34px rgba(17, 24, 39, 0.06);
}

.cardHead {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}
.cardTitle {
  font-weight: 950;
  color: #111827;
}
.hint {
  color: #6b7280;
  font-weight: 800;
  font-size: 12px;
}
.pill {
  font-size: 12px;
  font-weight: 900;
  color: #3730a3;
  background: #eef2ff;
  border: 1px solid #e0e7ff;
  padding: 6px 10px;
  border-radius: 999px;
}

/* Calendar */
.dow {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 6px;
}
.dowCell {
  text-align: center;
  font-weight: 950;
  font-size: 12px;
  color: #6b7280;
  padding: 6px 0;
}

.calGrid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 10px;
}

/* IMPORTANT: prevent overflow in grid children */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.dayCell {
  height: 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 950;
  cursor: pointer;
}
.dayCell:hover {
  background: #f3f4f6;
}

.dayCell.empty {
  border: none;
  background: transparent;
  cursor: default;
}

.dayCell.good {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.dayCell.bad {
  background: #fff1f2;
  border-color: #fecdd3;
}
.dayCell.neutral {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.dayCell.selected {
  outline: 3px solid rgba(99, 102, 241, 0.18);
  border-color: #c7d2fe;
}

/* Legend */
.legend {
  margin-top: 12px;
  display: flex;
  gap: 14px;
  align-items: center;
  color: #6b7280;
  font-weight: 800;
  font-size: 12px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
  margin-right: 6px;
}
.dot.good { background: #22c55e; box-shadow: 0 0 0 6px rgba(34,197,94,0.12); }
.dot.bad { background: #fb7185; box-shadow: 0 0 0 6px rgba(251,113,133,0.12); }
.dot.neutral { background: #94a3b8; box-shadow: 0 0 0 6px rgba(148,163,184,0.12); }

/* Insight */
.k {
  color: #6b7280;
  font-weight: 950;
  font-size: 12px;
}
.v {
  color: #111827;
  font-weight: 950;
  font-size: 13px;
}
.kv {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px dashed #eef2f7;
}
.block {
  padding: 10px 0;
  border-bottom: 1px dashed #eef2f7;
}
.block:last-child {
  border-bottom: none;
}
.text {
  margin-top: 6px;
  color: #111827;
  font-weight: 750;
  font-size: 13px;
  line-height: 1.5;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 18px;
  padding: 14px 10px 10px;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff, #fbfbff);
}

.barWrap {
  flex: 1;
  display: grid;
  justify-items: center;
  gap: 6px;
  min-width: 0;
}

.barArea {
  height: 180px;           /* fixed height context */
  width: 100%;
  display: flex;
  align-items: flex-end;    /* bar grows upward */
  justify-content: center;
}

.bar {
  width: 46px;
  border-radius: 12px;
  border: 1px solid #e0e7ff;
  background: linear-gradient(180deg, #eef2ff, #ffffff);
  box-shadow: 0 14px 28px rgba(99, 102, 241, 0.12);
  min-height: 8px;          /* always visible even small values */
}

.barValue {
  font-size: 12px;
  font-weight: 900;
  color: #111827;
}

.barLabel {
  font-size: 12px;
  font-weight: 900;
  color: #6b7280;
}

</style>
