<template>
  <section class="page">
    <!-- Header -->
    <header class="top">
      <div>
        <h1 class="title">Monthly Analysis</h1>
        <p class="sub">See how emotions impact different life areas across the month.</p>
      </div>

      <div class="picker">
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
      <!-- Impact by life area -->
      <div class="card impactCard">
        <div class="cardHead">
          <div class="cardTitle">Emotional Impact by Life Area</div>
          <div class="hint">{{ monthNames[month - 1] }} {{ year }}</div>
        </div>

        <div class="impactList">
          <button
            v-for="row in impact"
            :key="row.area"
            class="impactRow"
            :class="{ active: row.area === selectedArea }"
            @click="selectArea(row.area)"
            type="button"
          >
            <div class="areaName">{{ row.area }}</div>

            <div class="barTrack" aria-hidden="true">
              <div class="barFill" :style="{ width: `${row.negativePct}%` }"></div>
              <div class="barDots"></div>
            </div>

            <div class="pct">
              <span class="pctNum">{{ row.negativePct }}%</span>
              <span class="pctType">Negative</span>
            </div>
          </button>
        </div>

        <div class="note">
          Tip: Click an area to see details, triggers, and trends below.
        </div>
      </div>

      <!-- Donut chart -->
      <div class="card donutCard">
        <div class="cardHead">
          <div class="cardTitle">Emotion Share</div>
          <div class="hint">Overall month</div>
        </div>

        <div class="donutWrap">
          <div class="donut" :style="{ background: donutGradient }">
            <div class="donutHole">
              <div class="donutTitle">This Month (AI)</div>
              <div class="donutMain">{{ topDonutLabel }}</div>
              <div class="donutSub">{{ topDonutValue }}%</div>
            </div>
          </div>

          <div class="legend">
            <div v-for="l in donut" :key="l.label" class="legendRow">
              <span class="swatch" :style="{ background: l.color }"></span>
              <span class="legLabel">{{ l.label }}</span>
              <span class="legVal">{{ l.value }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Life area detail -->
      <div class="card detailCard">
        <div class="cardHead">
          <div class="cardTitle">Life Area Detail</div>
          <div class="pill">{{ selectedArea }}</div>
        </div>

        <div class="section">
          <div class="secTitle">Emotion Breakdown</div>

          <div class="miniBars">
            <div v-for="b in detail.breakdown" :key="b.label" class="miniRow">
              <div class="miniLabel">{{ b.label }}</div>
              <div class="miniTrack">
                <div class="miniFill" :style="{ width: `${b.value}%` }"></div>
              </div>
              <div class="miniVal">{{ b.value }}%</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="secTitle">Trend (Negative Emotion)</div>
          <div class="trend">
            <div v-for="t in detail.trend" :key="t.date" class="trendItem">
              <div class="tDate">{{ t.date }}</div>
              <div class="tLine">
                <div class="tDot" :style="{ left: `${t.level}%` }"></div>
              </div>
              <div class="tVal">{{ t.level }}%</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="secTitle">Common Triggers</div>
          <div class="chips">
            <span v-for="c in detail.triggers" :key="c" class="chip">{{ c }}</span>
          </div>
        </div>

        <div class="section twoCol">
          <div class="smallCard">
            <div class="smallK">Most Stressful Day</div>
            <div class="smallV">{{ detail.mostStressfulDay }}</div>
          </div>
          <div class="smallCard">
            <div class="smallK">Most Positive Day</div>
            <div class="smallV">{{ detail.mostPositiveDay }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)

const yearOptions = computed(() => {
  const base = now.getFullYear()
  return Array.from({ length: 7 }, (_, i) => base - 3 + i)
})

/** Top list (wireframe: Work/Study etc.) */
type ImpactRow = { area: string; negativePct: number }

const impact = reactive<ImpactRow[]>([
  { area: "Work / Study", negativePct: 62 },
  { area: "Relationships", negativePct: 28 },
  { area: "Personal Growth", negativePct: 45 },
  { area: "Health", negativePct: 15 },
])

const selectedArea = ref<string>(impact[0].area)

/** Donut chart data (overall month) */
type DonutSlice = { label: string; value: number; color: string }

const donut = reactive<DonutSlice[]>([
  { label: "Stress", value: 30, color: "#c7d2fe" },
  { label: "Anxiety", value: 50, color: "#e9d5ff" },
  { label: "Confidence", value: 10, color: "#bbf7d0" },
  { label: "Neutral", value: 10, color: "#e5e7eb" },
])

const topDonut = computed(() => donut.slice().sort((a, b) => b.value - a.value)[0])
const topDonutLabel = computed(() => topDonut.value?.label ?? "-")
const topDonutValue = computed(() => topDonut.value?.value ?? 0)

/** Build conic gradient for donut */
const donutGradient = computed(() => {
  let acc = 0
  const parts: string[] = []
  for (const s of donut) {
    const start = acc
    const end = acc + s.value
    parts.push(`${s.color} ${start}% ${end}%`)
    acc = end
  }
  // fallback if values not sum 100
  parts.push(`#f3f4f6 ${acc}% 100%`)
  return `conic-gradient(${parts.join(", ")})`
})

/** Detail panel for selected area */
type Breakdown = { label: string; value: number }
type TrendPoint = { date: string; level: number }

interface AreaDetail {
  breakdown: Breakdown[]
  trend: TrendPoint[]
  triggers: string[]
  mostStressfulDay: string
  mostPositiveDay: string
}

const detail = reactive<AreaDetail>({
  breakdown: [
    { label: "Stress", value: 40 },
    { label: "Anxiety", value: 22 },
    { label: "Confidence", value: 18 },
  ],
  trend: [
    { date: "Feb 1", level: 35 },
    { date: "Feb 2", level: 58 },
    { date: "Feb 3", level: 72 },
  ],
  triggers: ["deadline", "project", "not enough", "time"],
  mostStressfulDay: "Feb 3",
  mostPositiveDay: "Feb 2",
})

function selectArea(area: string) {
  selectedArea.value = area
  loadDetail(area)
}

/** Mock loader (replace with API later) */
function loadDetail(area: string) {
  if (area === "Work / Study") {
    Object.assign(detail, {
      breakdown: [
        { label: "Stress", value: 40 },
        { label: "Anxiety", value: 22 },
        { label: "Confidence", value: 18 },
      ],
      trend: [
        { date: "Feb 1", level: 35 },
        { date: "Feb 2", level: 58 },
        { date: "Feb 3", level: 72 },
      ],
      triggers: ["deadline", "project", "not enough", "time"],
      mostStressfulDay: "Feb 3",
      mostPositiveDay: "Feb 2",
    })
  } else if (area === "Relationships") {
    Object.assign(detail, {
      breakdown: [
        { label: "Sadness", value: 34 },
        { label: "Anxiety", value: 18 },
        { label: "Calm", value: 22 },
      ],
      trend: [
        { date: "Feb 6", level: 20 },
        { date: "Feb 12", level: 42 },
        { date: "Feb 18", level: 30 },
      ],
      triggers: ["misunderstanding", "waiting", "silence"],
      mostStressfulDay: "Feb 12",
      mostPositiveDay: "Feb 18",
    })
  } else if (area === "Personal Growth") {
    Object.assign(detail, {
      breakdown: [
        { label: "Confidence", value: 42 },
        { label: "Neutral", value: 24 },
        { label: "Stress", value: 18 },
      ],
      trend: [
        { date: "Feb 4", level: 38 },
        { date: "Feb 10", level: 28 },
        { date: "Feb 22", level: 20 },
      ],
      triggers: ["learning", "habit", "progress"],
      mostStressfulDay: "Feb 4",
      mostPositiveDay: "Feb 22",
    })
  } else {
    Object.assign(detail, {
      breakdown: [
        { label: "Tired", value: 45 },
        { label: "Neutral", value: 30 },
        { label: "Calm", value: 15 },
      ],
      trend: [
        { date: "Feb 2", level: 25 },
        { date: "Feb 9", level: 36 },
        { date: "Feb 16", level: 18 },
      ],
      triggers: ["sleep", "food", "exercise"],
      mostStressfulDay: "Feb 9",
      mostPositiveDay: "Feb 16",
    })
  }
}

watch([year, month], () => {
  // Later: refetch monthly aggregates for selected month
  // For now, keep demo static
})
</script>

<style scoped>
/* basic */
.page { padding: 10px 0; }
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

/* picker */
.picker { display: flex; gap: 10px; align-items: end; flex-wrap: wrap; }
.field { display: grid; gap: 6px; }
.label { font-size: 12px; color: #6b7280; font-weight: 900; }
.select {
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 800;
  color: #111827;
}

/* grid layout like wireframe */
.grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-areas:
    "impact donut"
    "detail donut";
  gap: 14px;
  align-items: start;
}
.impactCard { grid-area: impact; }
.donutCard { grid-area: donut; }
.detailCard { grid-area: detail; }

@media (max-width: 1000px) {
  .grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "impact"
      "donut"
      "detail";
  }
}

/* cards */
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
.cardTitle { font-weight: 950; color: #111827; }
.hint { color: #6b7280; font-weight: 800; font-size: 12px; }
.pill {
  font-size: 12px;
  font-weight: 900;
  color: #3730a3;
  background: #eef2ff;
  border: 1px solid #e0e7ff;
  padding: 6px 10px;
  border-radius: 999px;
}

/* Impact list */
.impactList { display: grid; gap: 10px; }
.impactRow {
  display: grid;
  grid-template-columns: 150px 1fr 120px;
  gap: 12px;
  align-items: center;
  width: 100%;
  text-align: left;
  border: 1px solid #eef2f7;
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
}
.impactRow:hover { background: #f9fafb; }
.impactRow.active {
  border-color: #c7d2fe;
  box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.12);
}
.areaName { font-weight: 950; color: #111827; font-size: 13px; }

.barTrack {
  position: relative;
  height: 14px;
  border-radius: 999px;
  background: #f3f4f6;
  border: 1px solid #eef2f7;
  overflow: hidden;
}
.barFill {
  position: absolute;
  inset: 0 auto 0 0;
  background: linear-gradient(90deg, #eef2ff, #e9d5ff);
  border-right: 1px solid rgba(99, 102, 241, 0.25);
}
.barDots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(17, 24, 39, 0.08) 1px, transparent 1px);
  background-size: 10px 10px;
  opacity: 0.5;
}

.pct { display: flex; gap: 8px; justify-content: flex-end; align-items: baseline; }
.pctNum { font-weight: 950; color: #111827; }
.pctType { font-weight: 900; color: #b45309; font-size: 12px; }

.note { margin-top: 10px; color: #6b7280; font-weight: 750; font-size: 12px; }

/* Donut */
.donutWrap {
  display: grid;
  gap: 14px;
  justify-items: center;
  padding-top: 6px;
}
.donut {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 1px solid #eef2f7;
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.06);
  display: grid;
  place-items: center;
}
.donutHole {
  width: 145px;
  height: 145px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #eef2f7;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 10px;
}
.donutTitle { font-size: 11px; color: #6b7280; font-weight: 900; }
.donutMain { font-size: 14px; color: #111827; font-weight: 950; margin-top: 6px; }
.donutSub { font-size: 12px; color: #3730a3; font-weight: 950; margin-top: 2px; }

.legend { width: 100%; display: grid; gap: 8px; }
.legendRow {
  display: grid;
  grid-template-columns: 14px 1fr auto;
  gap: 10px;
  align-items: center;
  border: 1px solid #eef2f7;
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
}
.swatch { width: 12px; height: 12px; border-radius: 4px; border: 1px solid #e5e7eb; }
.legLabel { font-weight: 900; color: #111827; font-size: 12px; }
.legVal { font-weight: 950; color: #6b7280; font-size: 12px; }

/* Details */
.section { padding: 10px 0; border-bottom: 1px dashed #eef2f7; }
.section:last-child { border-bottom: none; }
.secTitle { font-weight: 950; color: #111827; font-size: 13px; margin-bottom: 10px; }

.miniBars { display: grid; gap: 10px; }
.miniRow { display: grid; grid-template-columns: 120px 1fr 50px; gap: 10px; align-items: center; }
.miniLabel { font-weight: 900; color: #6b7280; font-size: 12px; }
.miniTrack {
  height: 12px;
  border-radius: 999px;
  background: #f3f4f6;
  border: 1px solid #eef2f7;
  overflow: hidden;
}
.miniFill {
  height: 100%;
  background: linear-gradient(90deg, #c7d2fe, #e9d5ff);
}
.miniVal { font-weight: 950; color: #111827; font-size: 12px; text-align: right; }

.trend { display: grid; gap: 10px; }
.trendItem { display: grid; grid-template-columns: 60px 1fr 50px; gap: 10px; align-items: center; }
.tDate { font-weight: 900; color: #6b7280; font-size: 12px; }
.tLine {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: #f3f4f6;
  border: 1px solid #eef2f7;
}
.tDot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.12);
}
.tVal { font-weight: 950; color: #111827; font-size: 12px; text-align: right; }

.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid #eef2f7;
  background: #fff;
  font-weight: 950;
  font-size: 12px;
  color: #374151;
}

.twoCol {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (max-width: 520px) {
  .twoCol { grid-template-columns: 1fr; }
}
.smallCard {
  border: 1px solid #eef2f7;
  background: #fff;
  border-radius: 16px;
  padding: 12px;
}
.smallK { color: #6b7280; font-weight: 900; font-size: 12px; }
.smallV { margin-top: 6px; color: #111827; font-weight: 950; font-size: 13px; }
</style>
