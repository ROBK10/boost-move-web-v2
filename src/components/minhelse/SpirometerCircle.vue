<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  score: number
  streakLevel?: number // 0..1
}>()

const ticks = 36

const level = computed<number>(() => {
  const raw = props.streakLevel ?? 0
  if (!Number.isFinite(raw)) return 0
  return Math.max(0, Math.min(1, raw))
})

const activeTicks = computed<number>(() => Math.round(ticks * level.value))
</script>

<template>
  <div class="wrap">
    <div class="ring">
      <svg viewBox="0 0 220 220" class="svg" aria-hidden="true">
        <g transform="translate(110,110)">
          <g
            v-for="i in ticks"
            :key="i"
            :transform="`rotate(${(360 / ticks) * i}) translate(0,-86)`"
          >
            <rect
              x="-2"
              y="-10"
              width="4"
              height="20"
              rx="2"
              :class="i <= activeTicks ? 'tickOn' : 'tickOff'"
            />
          </g>
        </g>
      </svg>

      <div class="center">
        <div class="score">{{ props.score }}</div>
        <div class="label">HELSE SCORE</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: grid;
  place-items: center;
  padding: 10px 0 6px;
}

.ring {
  position: relative;
  width: 320px;
  height: 320px;
  display: grid;
  place-items: center;
}

.svg {
  width: 320px;
  height: 320px;
  display: block;
}

.tickOff {
  fill: rgba(17, 24, 39, 0.18);
}

.tickOn {
  fill: rgba(16, 185, 129, 0.95);
}

.center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
}

.score {
  font-size: 72px;
  font-weight: 950;
  letter-spacing: -0.03em;
  color: #0b0f17;
  line-height: 1;
  margin-top: 30px;
}

.label {
  margin-top: -128px;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.14em;
  color: rgba(17, 24, 39, 0.35);
}
</style>