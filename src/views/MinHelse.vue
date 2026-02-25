<script setup>
import { onMounted, watch } from 'vue'
import { useMinHelseStore } from '@/stores/minHelseStore'
import { useAppStore } from '@/stores/appStore'

import MinHelseForm from '@/components/minhelse/MinHelseForm.vue'
import MinHelseKalkulator from '@/components/minhelse/MinHelseKalkulator.vue'
import MinHelseListe from '@/components/minhelse/MinHelseListe.vue'

// (midlertidig) Spirometer-komponent lager vi i neste steg – foreløpig kan du bare vise data
const store = useMinHelseStore()
const appStore = useAppStore()

onMounted(() => {
  store.hydrateFromLocalStorage()
})

// Live score -> appStore (så hjem-skjerm kan vise score med en gang)
watch(
  () => store.todayScore.totalScore,
  (v) => appStore.setHealthScore(v),
  { immediate: true }
)

function onSaveToday() {
  store.saveToday()
  // after save: spirometer (monthStatus) og historikk oppdateres automatisk
}
</script>

<template>
  <div style="display:grid; gap:16px;">
    <h1 style="margin:0;">Min helse</h1>

    <!-- SPIROMETER: foreløpig bare debug (vi lager visuell i neste steg) -->
    <div style="padding:12px; border:1px solid #e5e7eb; border-radius:16px;">
      <div style="font-weight:800; margin-bottom:6px;">Spirometer (måned)</div>
      <div style="display:flex; gap:4px; flex-wrap:wrap;">
        <span
          v-for="d in store.monthStatus"
          :key="d.date"
          :title="d.date"
          :style="{
            display:'inline-block',
            width:'6px',
            height:'16px',
            borderRadius:'4px',
            background: d.tracked ? '#22c55e' : '#ef4444'
          }"
        />
      </div>
    </div>

    <!-- 5 bokser (draft) -->
    <MinHelseForm />

    <!-- Lagre -->
    <button
      @click="onSaveToday"
      style="padding:10px 14px; border-radius:12px; border:1px solid #e5e7eb; background:#fff; font-weight:700;"
    >
      Lagre dagens tall
    </button>

    <!-- Score (bruker draft direkte via props) -->
    <MinHelseKalkulator
      :sleep="store.draft.sleepHours ?? 0"
      :food="store.draft.foodQuality ?? 0"
      :workout="store.draft.trainingMinutes ?? 0"
      :weight="store.draft.weightKg ?? 0"
      :movement="store.draft.movementRaw ?? 0"
    />

    <!-- Historikk -->
    <MinHelseListe />
  </div>
</template>