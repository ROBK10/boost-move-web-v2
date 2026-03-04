<script setup lang="ts">
import { computed, onMounted, watch } from "vue"
import { useMinHelseStore } from "@/stores/minHelseStore"
import { useAppStore } from "@/stores/appStore"

import SpirometerCircle from "@/components/minhelse/SpirometerCircle.vue"
import MinHelseInputRow from "@/components/minhelse/MinHelseInputRow.vue"
import MinHelseListe from "@/components/minhelse/MinHelseListe.vue"

const store = useMinHelseStore()
const appStore = useAppStore()

onMounted(() => {
  store.hydrateFromLocalStorage()
})

// Live score -> appStore
watch(
  () => store.todayScore.totalScore,
  (v) => appStore.setHealthScore(v),
  { immediate: true }
)

const score = computed(() => store.todayScore.totalScore)

// “5/5 fullført”
const completedCount = computed(() => {
  const d = store.draft
  const fields = [d.sleepHours, d.foodQuality, d.trainingMinutes, d.weightKg, d.movementRaw]
  return fields.filter((x) => x != null && Number.isFinite(Number(x))).length
})

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function setNullable(key: keyof typeof store.draft, value: number | null) {
  ;(store.draft[key] as number | null) = value
}

function bump(key: keyof typeof store.draft, delta: number, step = 1, min = 0, max = 9999) {
  const cur = Number(store.draft[key] ?? 0)
  const next = clamp(cur + delta * step, min, max)
  setNullable(key, next)
}

function saveToday() {
  store.saveToday()
}
</script>

<template>
  <div class="page">
    <header class="head">
      <h1 class="h1">Min Helse</h1>
      <p class="sub">Din daglige status</p>
    </header>

    <SpirometerCircle :score="score" :streakLevel="completedCount / 5" />

    <div class="sectionRow">
      <div class="sectionTitle">DAGENS REGISTRERING</div>
      <div class="pill">{{ completedCount }}/5 fullført</div>
    </div>

    <div class="stack">
      <MinHelseInputRow
        title="Søvn"
        subtitle="TIMER"
        rightMode="stepper"
        :valueText="String(store.draft.sleepHours ?? 0)"
        iconBg="rgba(99, 102, 241, 0.10)"
        :onMinus="() => bump('sleepHours', -1, 0.5, 0, 24)"
        :onPlus="() => bump('sleepHours', +1, 0.5, 0, 24)"
      />

      <MinHelseInputRow
        title="Kosthold"
        subtitle="KVALITET (1-10)"
        rightMode="stepper"
        :valueText="String(store.draft.foodQuality ?? 0)"
        iconBg="rgba(16, 185, 129, 0.10)"
        :onMinus="() => bump('foodQuality', -1, 1, 0, 10)"
        :onPlus="() => bump('foodQuality', +1, 1, 0, 10)"
      />

      <MinHelseInputRow
        title="Trening"
        subtitle="MINUTTER"
        rightMode="stepper"
        :valueText="String(store.draft.trainingMinutes ?? 0)"
        iconBg="rgba(245, 158, 11, 0.12)"
        :onMinus="() => bump('trainingMinutes', -1, 5, 0, 240)"
        :onPlus="() => bump('trainingMinutes', +1, 5, 0, 240)"
      />

      <MinHelseInputRow
        title="Vekt"
        subtitle="KG"
        rightMode="stepper"
        :valueText="String(store.draft.weightKg ?? 0)"
        iconBg="rgba(17, 24, 39, 0.06)"
        :onMinus="() => bump('weightKg', -1, 0.1, 0, 400)"
        :onPlus="() => bump('weightKg', +1, 0.1, 0, 400)"
      />

      <MinHelseInputRow
        title="Bevegelse"
        subtitle="MIN ELLER SKRITT"
        rightMode="stepper"
        :valueText="String(store.draft.movementRaw ?? 0)"
        iconBg="rgba(236, 72, 153, 0.10)"
        :onMinus="() => bump('movementRaw', -1, 100, 0, 50000)"
        :onPlus="() => bump('movementRaw', +1, 100, 0, 50000)"
      />
    </div>

    <button class="saveBtn" type="button" @click="saveToday">
      Lagre dagens tall
    </button>

    <MinHelseListe />
  </div>
</template>

<style scoped>
.page {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 120px;
}

.head {
  margin-bottom: 12px;
}

.h1 {
  margin: 0;
  font-size: 44px;
  line-height: 1.02;
  font-weight: 950;
  letter-spacing: -0.03em;
  color: #0b0f17;
}

.sub {
  margin: 10px 0 0;
  font-size: 16px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.45);
}

.sectionRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 18px 2px 12px;
}

.sectionTitle {
  font-weight: 950;
  letter-spacing: 0.12em;
  font-size: 13px;
  color: rgba(17, 24, 39, 0.40);
}

.pill {
  font-weight: 950;
  font-size: 14px;
  color: rgba(16, 185, 129, 0.95);
  background: rgba(16, 185, 129, 0.10);
  border: 1px solid rgba(16, 185, 129, 0.18);
  padding: 8px 14px;
  border-radius: 999px;
}

.stack {
  display: grid;
  gap: 14px;
}

.saveBtn {
  width: 100%;
  height: 64px;
  margin-top: 18px;
  border: none;
  border-radius: 24px;
  background: #0b0f17;
  color: #fff;
  font-weight: 950;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 18px 50px rgba(11, 15, 23, 0.18);
}
</style>