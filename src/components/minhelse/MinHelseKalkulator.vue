<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import BaseCard from "@/components/ui/BaseCard.vue";
import { useMinHelseStore } from '@/stores/minHelseStore'

const minHelseStore = useMinHelseStore()
const showTip = ref(false)

const props = defineProps<{
  sleep?: string | number
  food?: string | number
  workout?: string | number
  weight?: string | number
  movement?: string | number
}>()

function toNumber(v: unknown): number | null {
  const n = Number(String(v ?? '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

// Hold store.draft oppdatert fra props
watchEffect(() => {
  minHelseStore.draft.sleepHours = toNumber(props.sleep)
  minHelseStore.draft.foodQuality = toNumber(props.food) // hvis du sender 1-10 her
  minHelseStore.draft.trainingMinutes = toNumber(props.workout)
  minHelseStore.draft.weightKg = toNumber(props.weight)
  minHelseStore.draft.movementRaw = toNumber(props.movement)
})

// Score kommer fra store (samme logikk som ved lagring)
const score = computed(() => minHelseStore.todayScore.totalScore)
const level = computed(() => minHelseStore.todayScore.color)
const breakdown = computed(() => minHelseStore.todayScore.breakdown)

const tips: Record<string, string[]> = {
  søvn: [
    'Prøv 30–60 min tidligere nedtrapping og sikt mot 7–9t.',
    'Legg bort skjerm 30 min før du legger deg.',
    'Kutt koffein etter kl 14 i dag.',
  ],
  bevegelse: [
    'Ta 2 minutter bevegelse nå (reis deg, rull skuldre, gå litt).',
    'Gå en veldig kort runde: 5 minutter er nok.',
  ],
  trening: [
    'Start med 2 minutter – det teller.',
    'Gjør 5 knebøy og 5 pushups – ferdig.',
  ],
  kost: [
    'Legg til én frukt/grønnsak i dag.',
    'Velg én ting: litt mer protein eller litt mindre snacks.',
  ],
}

function pickTip(category: string) {
  const list = tips[category] || []
  if (list.length === 0) return ''
  return list[Math.floor(Math.random() * list.length)]
}

const nextTip = computed(() => {
  const candidates = [
    { key: 'søvn', pts: breakdown.value.sleep },
    { key: 'bevegelse', pts: breakdown.value.movement },
    { key: 'trening', pts: breakdown.value.training },
    { key: 'kost', pts: breakdown.value.food },
  ]
  candidates.sort((a, b) => a.pts - b.pts)
  return pickTip(candidates[0].key)
})

function saveEntry() {
  minHelseStore.saveToday()
}

defineExpose({ saveEntry })
</script>

<template>
  <BaseCard>
    <h3 style="margin: 0 0 10px 0;">Dagens score (V1)</h3>

    <div style="display:flex; gap:12px; align-items:baseline;">
      <div style="font-size: 34px; font-weight: 900;">{{ score }}</div>
      <div style="font-weight: 800;">{{ level }}</div>
    </div>

    <div style="margin-top: 10px; opacity: .85;">
  Søvn: {{ breakdown.sleep }} / 25 ·
  Bevegelse: {{ breakdown.movement }} / 25 ·
  Trening: {{ breakdown.training }} / 20 ·
  Kost: {{ breakdown.food }} / 15 ·
  Vekt-logg: {{ breakdown.weight }} / 5
</div>

    <div style="margin-top: 14px;">
      <button v-if="!showTip" @click="showTip = true" class="suggest-btn">
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