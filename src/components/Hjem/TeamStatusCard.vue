<script setup lang="ts">
const emit = defineEmits<{
  (e: "open"): void
}>()

function open() {
  emit("open")
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    open()
  }
}

// Placeholder-data (kobles til backend senere)
const title = "Lagets kapasitet"
const todayLabel = "I DAG"
const capacity = 72
const trend: "up" | "down" | "stable" = "stable"

// drivere (placeholder)
const sleepTrend: "up" | "down" | "stable" = "down"
const movementTrend: "up" | "down" | "stable" = "stable"
const energyTrend: "up" | "down" | "stable" = "up"

function arrow(v: "up" | "down" | "stable") {
  if (v === "up") return "↑"
  if (v === "down") return "↓"
  return "→"
}

function trendText(v: "up" | "down" | "stable") {
  if (v === "up") return "bedre"
  if (v === "down") return "lavere"
  return "stabil"
}

function moodText(score: number) {
  if (score >= 75) return "Laget virker i flyt i dag."
  if (score >= 60) return "En jevn og stabil dag for laget."
  if (score >= 45) return "Laget virker litt slitent – små pauser hjelper."
  return "Tung dag – hold det enkelt og rolig."
}
</script>

<template>
  <section
    class="card"
    role="button"
    tabindex="0"
    @click="open"
    @keydown="onKeydown"
    aria-label="Åpne Team Status"
  >
    <div class="top">
      <div class="title">
        <span class="group" aria-hidden="true"></span>
        <span>{{ title }}</span>
      </div>
    </div>

    <div class="stat">
      <div class="month">{{ todayLabel }}</div>

      <div class="row">
        <div class="num">{{ capacity }}</div>
        <div class="meta">
          <div class="trend">
            <span class="arr">{{ arrow(trend) }}</span>
            <span>{{ trendText(trend) }}</span>
          </div>
          <div class="mini">{{ moodText(capacity) }}</div>
        </div>
      </div>

      <div class="drivers">
        <div class="pill">
          <span class="k">Søvn</span>
          <span class="v">{{ arrow(sleepTrend) }}</span>
        </div>
        <div class="pill">
          <span class="k">Bevegelse</span>
          <span class="v">{{ arrow(movementTrend) }}</span>
        </div>
        <div class="pill">
          <span class="k">Energi</span>
          <span class="v">{{ arrow(energyTrend) }}</span>
        </div>
      </div>
    </div>

    <div class="cta">
      <span>Se status</span>
      <span class="arrow" aria-hidden="true"></span>
    </div>
  </section>
</template>

<style scoped>
/* V2: samme “premium card”-følelse som Boost */
.card {
  background: #ffffff;
  color: #111827;
  border-radius: 26px;
  padding: 18px;
  box-shadow: 0 16px 40px rgba(17, 24, 39, 0.10);
  min-height: 175px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease, box-shadow 120ms ease;
  border: 1px solid rgba(17, 24, 39, 0.08);
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 50px rgba(17, 24, 39, 0.14);
}

.card:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.25);
  outline-offset: 4px;
}

.title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  font-size: 18px;
}

/* ikon-boble */
.group {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.06);
  position: relative;
}
.group::before,
.group::after {
  content: "";
  position: absolute;
  top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.38);
}
.group::before {
  left: 10px;
}
.group::after {
  right: 10px;
}
.group {
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.06);
}

.stat {
  margin-top: 6px;
  background: rgba(17, 24, 39, 0.03);
  border-radius: 16px;
  padding: 14px;
}

.month {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: rgba(17, 24, 39, 0.45);
}

.row {
  margin-top: 6px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.num {
  font-size: 40px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  min-width: 58px;
}

.meta {
  display: grid;
  gap: 6px;
  padding-top: 2px;
}

.trend {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  font-size: 14px;
  color: rgba(17, 24, 39, 0.85);
}

.arr {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.mini {
  font-size: 13px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.55);
  line-height: 1.25;
}

.drivers {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pill {
  border-radius: 999px;
  padding: 10px 12px;
  background: rgba(17, 24, 39, 0.06);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  font-size: 12px;
  color: rgba(17, 24, 39, 0.85);
}

.k {
  letter-spacing: 0.06em;
  color: rgba(17, 24, 39, 0.55);
}

.v {
  font-size: 14px;
}

.cta {
  margin-top: 12px;
  border-radius: 999px;
  padding: 14px 16px;
  background: #0b0f17;
  color: #ffffff;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.arrow {
  width: 14px;
  height: 14px;
  border-right: 2px solid rgba(255, 255, 255, 0.85);
  border-top: 2px solid rgba(255, 255, 255, 0.85);
  transform: rotate(45deg);
}
</style>