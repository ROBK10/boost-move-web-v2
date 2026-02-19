<script setup>
import { watch } from 'vue'
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()

watch(score, (newScore) => {
  appStore.setHealthScore(newScore)
})

import { computed } from 'vue'
import BaseCard from '../ui/BaseCard.vue'
import { ref } from 'vue'

const showTip = ref(false)
const props = defineProps({
  sleep: [String, Number],     // timer
  food: [String, Number],      // 1-5 eller tekst
  workout: [String, Number],   // minutter
  weight: [String, Number],    // kg (V1: mest for “logg-bonus”)
  movement: [String, Number],  // skritt (eller minutter)
})

function toNumber(v) {
  const n = Number(String(v ?? '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function foodToScore(foodValue) {
  // V1: aksepter 1-5 eller tekst som "bra/ok/dårlig"
  const n = toNumber(foodValue)
  if (n !== null) {
    const clamped = Math.min(5, Math.max(1, n))
    return (clamped / 5) * 15 // maks 15 poeng
  }

  const t = String(foodValue ?? '').toLowerCase().trim()
  if (!t) return 0
  if (t.includes('bra') || t.includes('sunn') || t.includes('god')) return 13
  if (t.includes('ok') || t.includes('grei')) return 9
  if (t.includes('dårlig') || t.includes('junk') || t.includes('pizza')) return 4
  return 7 // “ukjent tekst” => midt på
}

const sleepPoints = computed(() => {
  const h = toNumber(props.sleep)
  if (h === null) return 0
  if (h >= 7 && h <= 9) return 25
  if ((h >= 6 && h < 7) || (h > 9 && h <= 10)) return 18
  if ((h >= 5 && h < 6) || (h > 10 && h <= 11)) return 10
  return 0
})

const movementPoints = computed(() => {
  const v = toNumber(props.movement)
  if (v === null) return 0

  // V1-triks: hvis tallet er "lite", tolker vi det som minutter (f.eks 45)
  // hvis det er "stort", tolker vi det som skritt (f.eks 8000)
  const isMinutes = v <= 300

  if (isMinutes) {
    if (v >= 45) return 25
    if (v >= 30) return 18
    if (v >= 15) return 10
    return 0
  } else {
    if (v >= 8000) return 25
    if (v >= 6000) return 18
    if (v >= 4000) return 10
    return 0
  }
})

const workoutPoints = computed(() => {
  const m = toNumber(props.workout)
  if (m === null) return 0
  if (m >= 30) return 20
  if (m >= 20) return 15
  if (m >= 10) return 8
  return 0
})

const foodPoints = computed(() => foodToScore(props.food))

const weightPoints = computed(() => {
  // V1: vekt påvirker ikke helse-score uten høyde/trend,
  // men gir litt bonus for at du faktisk logger.
  const w = toNumber(props.weight)
  return w === null ? 0 : 5
})

const rawTotal = computed(() =>
  sleepPoints.value +
  movementPoints.value +
  workoutPoints.value +
  foodPoints.value +
  weightPoints.value
)

// maks i denne modellen: 25 + 25 + 20 + 15 + 5 = 90, vi skalerer til 0-100
const score = computed(() => Math.round((rawTotal.value / 90) * 100))

const level = computed(() => {
  if (score.value >= 75) return 'Grønn'
  if (score.value >= 50) return 'Gul'
  return 'Rød'
})

const tips = {
  søvn: [
    'Prøv 30–60 min tidligere nedtrapping og sikt mot 7–9t.',
    'Legg bort skjerm 30 min før du legger deg.',
    'Ta en rolig kveldsgåtur 10 min etter middag.',
    'Kutt koffein etter kl 14 i dag.',
  ],
  bevegelse: [
    'Ta 2 minutter bevegelse nå (reist deg, rull skuldre, gå litt).',
    'Gå en veldig kort runde: 5 minutter er nok.',
    'Ta en mini-pause: 60 sek bevegelse hver time.',
    'Strekk deg i 2 minutter – bare start.',
  ],
  trening: [
    'Ta 3 minutter med lett bevegelse nå.',
    'Gå rundt huset eller blokka én gang.',
    'Gjør 5 knebøy og 5 pushups – ferdig.',
    'Sett på en sang og beveg deg til den.',
    'Start med 2 minutter – det teller.',
  ],
  kost: [
    'Start neste måltid med et glass vann.',
    'Legg til én frukt/grønnsak i dag.',
    'Velg én ting: litt mer protein eller litt mindre snacks.',
    'Spis litt saktere i dag (3 rolige pust før første bit).',
  ],
}

function pickTip(category) {
  const list = tips[category] || []
  if (list.length === 0) return ''
  const idx = Math.floor(Math.random() * list.length)
  return list[idx]
}

const nextTip = computed(() => {
  const candidates = [
    { key: 'søvn', pts: sleepPoints.value },
    { key: 'bevegelse', pts: movementPoints.value },
    { key: 'trening', pts: workoutPoints.value },
    { key: 'kost', pts: foodPoints.value },
  ]

  candidates.sort((a, b) => a.pts - b.pts)
  return pickTip(candidates[0].key)
})
</script>

<template>
  <BaseCard>
    <h3 style="margin: 0 0 10px 0;">Dagens score (V1)</h3>

    <div style="display:flex; gap:12px; align-items:baseline;">
      <div style="font-size: 34px; font-weight: 900;">{{ score }}</div>
      <div style="font-weight: 800;">{{ level }}</div>
    </div>

    <div style="margin-top: 10px; opacity: .85;">
      Søvn: {{ sleepPoints }} / 25 ·
      Bevegelse: {{ movementPoints }} / 25 ·
      Trening: {{ workoutPoints }} / 20 ·
      Kost: {{ Math.round(foodPoints) }} / 15 ·
      Vekt-logg: {{ weightPoints }} / 5
    </div>

    <div style="margin-top: 14px;">
  <button
    v-if="!showTip"
    @click="showTip = true"
    class="suggest-btn"
  >
    Ønsker du et enkelt forslag for å øke helsa ytterligere?
  </button>

  <div v-else>
    <div style="font-weight: 700;">Forslag:</div>
    <div style="margin-top: 6px;">
      {{ nextTip }}
    </div>

    <button
      @click="showTip = false"
      class="suggest-btn small"
      style="margin-top: 10px;"
    >
      Skjul forslag
    </button>
  </div>
</div>

    <div style="margin-top: 12px; font-size: 12px; opacity: .7;">
      *V1-estimat for motivasjon – ikke medisinsk råd.
    </div>
  </BaseCard>
</template>

<style scoped>
.suggest-btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  font-weight: 600;
  cursor: pointer;
}

.suggest-btn.small {
  font-size: 13px;
  opacity: 0.8;
}
</style>