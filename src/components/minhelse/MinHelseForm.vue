<script setup>
import { computed } from 'vue'
import { useMinHelseStore } from '@/stores/minHelseStore'

const store = useMinHelseStore()

// V-model helpers
const sleep = computed({
  get: () => store.draft.sleepHours,
  set: (v) => (store.draft.sleepHours = v === '' || v === null ? null : Number(v)),
})

const food = computed({
  get: () => store.draft.foodQuality,
  set: (v) => (store.draft.foodQuality = v === '' || v === null ? null : Number(v)),
})

const workout = computed({
  get: () => store.draft.trainingMinutes,
  set: (v) => (store.draft.trainingMinutes = v === '' || v === null ? null : Number(v)),
})

const weight = computed({
  get: () => store.draft.weightKg,
  set: (v) => (store.draft.weightKg = v === '' || v === null ? null : Number(v)),
})

const movement = computed({
  get: () => store.draft.movementRaw,
  set: (v) => (store.draft.movementRaw = v === '' || v === null ? null : Number(v)),
})

const movementHint = computed(() => {
  const n = Number(store.draft.movementRaw || 0)
  if (!n) return ''
  return n < 300 ? 'Tolkes som minutter' : 'Tolkes som skritt'
})
</script>

<template>
  <div style="display:grid; gap:12px;">
    <div>
      <label>Søvn (timer)</label>
      <input v-model.number="sleep" type="number" step="0.5" min="0" />
    </div>

    <div>
      <label>Kosthold (1-10)</label>
      <input v-model.number="food" type="number" min="1" max="10" />
    </div>

    <div>
      <label>Trening (minutter)</label>
      <input v-model.number="workout" type="number" min="0" step="5" />
    </div>

    <div>
      <label>Vekt (kg)</label>
      <input v-model.number="weight" type="number" min="0" step="0.1" />
    </div>

    <div>
      <label>Bevegelse (min eller skritt)</label>
      <input v-model.number="movement" type="number" min="0" />
      <small style="opacity:.7;">{{ movementHint }}</small>
    </div>
  </div>
</template>