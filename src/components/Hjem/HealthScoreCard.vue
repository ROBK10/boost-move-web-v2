<script setup lang="ts">
import { computed } from "vue"
import { estimateDailyMinutes, minuteColor, ringZoneColor } from "@/utils/personalHealthSavings"

type MinutesMap = Record<string, number> // "YYYY-MM-DD" → aktive minutter

const props = withDefaults(
  defineProps<{
    weeklyMinutes?: number
    weeklyTarget?: number
    month?: string // "YYYY-MM"
    minutesMap?: MinutesMap
  }>(),
  {
    weeklyMinutes: 0,
    weeklyTarget: 150,
    month: undefined,
    minutesMap: () => ({}),
  }
)

const emit = defineEmits<{ (e: "open"): void }>()

function open() { emit("open") }
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open() }
}

// ---------- Date helpers ----------
function pad2(n: number) { return String(n).padStart(2, "0") }
function toYYYYMM(d: Date) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}` }
function daysInMonth(yyyy: number, mm1: number) { return new Date(yyyy, mm1, 0).getDate() }

const monthStr = computed(() => props.month ?? toYYYYMM(new Date()))
const yyyy = computed(() => Number(monthStr.value.split("-")[0]))
const mm1 = computed(() => Number(monthStr.value.split("-")[1]))
const dim = computed(() => daysInMonth(yyyy.value, mm1.value))

function dateKey(day: number) {
  return `${yyyy.value}-${pad2(mm1.value)}-${pad2(day)}`
}

// ---------- Weekly progress ----------
const pct = computed(() => props.weeklyTarget > 0 ? props.weeklyMinutes / props.weeklyTarget : 0)
const zoneColor = computed(() => ringZoneColor(pct.value))

// ---------- Geometry ----------
const size = 300
const cx = size / 2
const cy = size / 2
const innerR = 120
const baseLen = 14
const growthPct = 0.14
const stroke = 3

type Tick = {
  day: number
  x1: number; y1: number; x2: number; y2: number
  color: string
}

const ticks = computed<Tick[]>(() => {
  const total = dim.value
  const out: Tick[] = []
  let prevStage = 1

  for (let day = 1; day <= total; day++) {
    const key = dateKey(day)
    const minutes = props.minutesMap?.[key] ?? -1 // -1 = ingen data
    const hasData = minutes >= 0

    // Stage: drives av aktivitetsminutter
    let stage = prevStage
    if (!hasData) {
      // ingen innsjekk — stage holder seg
    } else if (minutes > 30) {
      stage = Math.min((prevStage % 7) + 1, 7)
    } else if (minutes > 0) {
      // lav aktivitet — stage holder seg
    } else {
      stage = Math.max(1, prevStage - 1)
    }
    prevStage = stage

    const mult = 1 + growthPct * (stage - 1)
    const len = baseLen * mult
    const angle = (360 / total) * (day - 1) - 90
    const rad = (angle * Math.PI) / 180
    const r1 = innerR
    const r2 = innerR + len

    out.push({
      day,
      x1: cx + Math.cos(rad) * r1,
      y1: cy + Math.sin(rad) * r1,
      x2: cx + Math.cos(rad) * r2,
      y2: cy + Math.sin(rad) * r2,
      color: hasData ? minuteColor(minutes) : "rgba(209, 231, 229, 0.12)",
    })
  }

  return out
})

// ---------- Progress arc (bakgrunnsring som fylles) ----------
const arcR = 108
const circumference = 2 * Math.PI * arcR
const arcDash = computed(() => {
  const fill = Math.min(pct.value, 1.0)
  return `${fill * circumference} ${circumference}`
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
        <!-- Bakgrunnsring -->
        <circle
          :cx="cx" :cy="cy" :r="arcR"
          fill="none"
          stroke="rgba(209, 231, 229, 0.06)"
          :stroke-width="6"
        />
        <!-- Fremdriftsring -->
        <circle
          :cx="cx" :cy="cy" :r="arcR"
          fill="none"
          :stroke="zoneColor"
          :stroke-width="6"
          :stroke-dasharray="arcDash"
          stroke-linecap="round"
          transform="rotate(-90 150 150)"
          style="transition: stroke-dasharray 0.6s ease, stroke 0.3s ease"
        />
        <!-- Dag-sticks -->
        <line
          v-for="t in ticks"
          :key="t.day"
          :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
          :stroke="t.color"
          :stroke-width="stroke"
          stroke-linecap="round"
        />
      </svg>

      <div class="center">
        <div class="minutes">{{ props.weeklyMinutes }}</div>
        <div class="unit">min</div>
        <div class="target">av {{ props.weeklyTarget }} min</div>
      </div>
    </div>

    <div class="info">Ditt mål: {{ props.weeklyTarget }} min/uke<span v-if="props.weeklyTarget < 150"> · Anbefalt: 150 min</span></div>
    <div class="tap-hint">Trykk for detaljer</div>
  </section>
</template>

<style scoped>
.card {
  background: #023238;
  border-radius: 30px;
  padding: 22px 18px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.25);
  display: grid;
  place-items: center;
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 46px rgba(0,0,0,0.3);
}
.card:focus-visible {
  outline: 3px solid rgba(190, 242, 1, 0.35);
  outline-offset: 4px;
}

.info {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
  text-align: center;
  line-height: 1.4;
}

.tap-hint {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(209,231,229,0.35);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.minutes {
  font-size: 64px;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #FFFFFF;
}

.unit {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: rgba(209,231,229,0.35);
  margin-top: 2px;
}

.target {
  font-size: 13px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
  margin-top: 4px;
}
</style>
