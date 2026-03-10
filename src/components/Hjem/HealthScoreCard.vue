<script setup lang="ts">
import { computed } from "vue"

type TrackedMap = Record<string, boolean>

const props = withDefaults(
  defineProps<{
    score?: number | null
    month?: string // "YYYY-MM"
    trackedMap?: TrackedMap
  }>(),
  {
    score: null,
    month: undefined,
    trackedMap: () => ({}),
  }
)

const emit = defineEmits<{ (e: "open"): void }>()

function open() {
  emit("open")
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    open()
  }
}

// ---------- Date helpers ----------
function pad2(n: number) {
  return String(n).padStart(2, "0")
}
function toYYYYMM(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`
}
function daysInMonth(yyyy: number, mm1: number) {
  return new Date(yyyy, mm1, 0).getDate()
}

const monthStr = computed(() => props.month ?? toYYYYMM(new Date()))
const yyyy = computed(() => Number(monthStr.value.split("-")[0]))
const mm1 = computed(() => Number(monthStr.value.split("-")[1])) // 1..12
const dim = computed(() => daysInMonth(yyyy.value, mm1.value))

function dateKey(day: number) {
  return `${yyyy.value}-${pad2(mm1.value)}-${pad2(day)}`
}

// ---------- Score ----------
const scoreClamped = computed(() => {
  const n = Number(props.score)
  if (!Number.isFinite(n)) return 0
  return Math.min(100, Math.max(0, n))
})
const scoreText = computed(() =>
  props.score == null ? "—" : Math.round(scoreClamped.value)
)

// ---------- Geometry (balanced for size=300) ----------
const size = 300
const cx = size / 2
const cy = size / 2

// Ring placement
const innerR = 120 // hvor tickene starter (gir god luft i midten)
const baseLen = 14 // stage 1 tick-lengde
const growthPct = 0.14 // 14% per stage
const stroke = 3

type Tick = {
  day: number
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
}

const ticks = computed<Tick[]>(() => {
  const total = dim.value
  const out: Tick[] = []

  let prevStage = 1

  for (let day = 1; day <= total; day++) {
    const key = dateKey(day)
    const trackedVal = props.trackedMap?.[key]
    const tracked = typeof trackedVal === "boolean" ? trackedVal : null

    // A) streak-basert stage 1..7..1
    let stage = prevStage
    if (tracked === true) stage = (prevStage % 7) + 1
    else if (tracked === false) stage = Math.max(1, prevStage - 1)
    prevStage = stage

    const mult = 1 + growthPct * (stage - 1)
    const len = baseLen * mult

    // Start på toppen (-90°)
    const angle = (360 / total) * (day - 1) - 90
    const rad = (angle * Math.PI) / 180

    const r1 = innerR
    const r2 = innerR + len

    const x1 = cx + Math.cos(rad) * r1
    const y1 = cy + Math.sin(rad) * r1
    const x2 = cx + Math.cos(rad) * r2
    const y2 = cy + Math.sin(rad) * r2

    const color =
      tracked === true
        ? "rgba(16, 185, 129, 0.95)"
        : tracked === false
          ? "rgba(239, 68, 68, 0.85)"
          : "rgba(17, 24, 39, 0.12)"

    out.push({ day, x1, y1, x2, y2, color })
  }

  return out
})
</script>

<template>
  <section
    class="card"
    role="button"
    tabindex="0"
    @click="open"
    @keydown="onKeydown"
    aria-label="Åpne Min Helse"
  >
    <div class="ring">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" aria-hidden="true">
        <line
          v-for="t in ticks"
          :key="t.day"
          :x1="t.x1"
          :y1="t.y1"
          :x2="t.x2"
          :y2="t.y2"
          :stroke="t.color"
          :stroke-width="stroke"
          stroke-linecap="round"
        />
      </svg>

      <div class="center">
        <div class="score">{{ scoreText }}</div>
        <div class="label">HELSE SCORE</div>
      </div>
    </div>

    <div class="tap-hint">Trykk for detaljer</div>
  </section>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 30px;
  padding: 22px 18px; /* litt mindre topp/bunn padding når ringen er større */
  box-shadow: 0 12px 36px rgba(20, 20, 20, 0.06);
  display: grid;
  place-items: center;
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 46px rgba(20, 20, 20, 0.08);
}

.card:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.25);
  outline-offset: 4px;
}

.tap-hint {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.38);
  text-align: center;
  padding-bottom: 4px;
}

.ring {
  position: relative;
  width: 300px;
  height: 300px;
  display: grid;
  place-items: center;
}

.center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;

  /* Optisk senter: litt opp */
  transform: translateY(22px);
}

.score {
  font-size: 72px;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #111827;
}

.label {
  margin-top: -130px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.22em;
  color: rgba(17, 24, 39, 0.42);
}
</style>