<script setup lang="ts">
import { computed } from "vue"

type DayLine = {
  date: string
  tracked: boolean
  stage: number // 0..7
}

const props = defineProps<{
  score: number
  days: DayLine[] // typisk store.monthSpirometerDays
}>()

const size = 280
const cx = size / 2
const cy = size / 2
const r = 92

// line length logic:
// stage 1 = base, stage 2..7 = +14% per stage
// stage 0 (ikke tracked / streak brutt) = litt kortere “dead”
const baseLen = 18
const deadLen = 10
const growth = 0.14

const lines = computed(() => {
  const n = props.days.length || 1
  return props.days.map((d, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const len =
      d.stage <= 0
        ? deadLen
        : Math.round(baseLen * (1 + growth * (d.stage - 1)))

    const x1 = cx + Math.cos(angle) * (r - 2)
    const y1 = cy + Math.sin(angle) * (r - 2)
    const x2 = cx + Math.cos(angle) * (r + len)
    const y2 = cy + Math.sin(angle) * (r + len)

    return { ...d, x1, y1, x2, y2 }
  })
})

// score color (kun en liten “hint” – du kan endre senere)
const scoreAccent = computed(() => {
  if (props.score >= 75) return "ok"
  if (props.score >= 50) return "mid"
  return "low"
})
</script>

<template>
  <div class="wrap">
    <div class="dial">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
        <!-- subtle ring -->
        <circle
          :cx="cx"
          :cy="cy"
          :r="r"
          fill="none"
          stroke="rgba(17,24,39,0.06)"
          stroke-width="2"
        />

        <!-- day lines -->
        <line
          v-for="d in lines"
          :key="d.date"
          :x1="d.x1"
          :y1="d.y1"
          :x2="d.x2"
          :y2="d.y2"
          :stroke="d.tracked ? 'rgba(16,185,129,0.95)' : 'rgba(17,24,39,0.18)'"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>

      <div class="center">
        <div class="score">{{ score }}</div>
        <div class="label">HELSE SCORE</div>
      </div>

      <div class="glow" :class="scoreAccent" />
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: grid;
  place-items: center;
  padding: 10px 0 0;
}

.dial {
  width: 320px;
  height: 320px;
  position: relative;
  display: grid;
  place-items: center;
}

.center {
  position: absolute;
  display: grid;
  place-items: center;
  transform: translateY(2px);
}

.score {
  font-size: 64px;
  font-weight: 950;
  letter-spacing: -0.05em;
  color: #0b0f17;
  line-height: 1;
}

.label {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.18em;
  color: rgba(17, 24, 39, 0.35);
}

/* tiny soft glow */
.glow {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  filter: blur(24px);
  opacity: 0.25;
  pointer-events: none;
}

.glow.ok {
  background: radial-gradient(circle at 50% 40%, rgba(16,185,129,0.35), transparent 55%);
}
.glow.mid {
  background: radial-gradient(circle at 50% 40%, rgba(245,158,11,0.35), transparent 55%);
}
.glow.low {
  background: radial-gradient(circle at 50% 40%, rgba(239,68,68,0.35), transparent 55%);
}
</style>