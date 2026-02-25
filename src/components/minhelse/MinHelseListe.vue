<script setup>
import { computed } from 'vue'
import { useMinHelseStore } from '@/stores/minHelseStore'

const store = useMinHelseStore()

const items = computed(() => {
  return store.entriesList.map((e) => {
    let movementText = '-'
    if (e.movement?.interpretedAs === 'minutes') movementText = `${e.movement.minutes} min`
    if (e.movement?.interpretedAs === 'steps') movementText = `${e.movement.steps} skritt`

    return {
      date: e.date,
      sleep: e.sleepHours ?? '-',
      workout: e.trainingMinutes ?? '-',
      movement: movementText,
      score: e.totalScore,
      color: e.color,
    }
  })
})
</script>

<template>
  <div>
    <h2 style="margin: 0 0 10px 0;">Historikk</h2>

    <p v-if="items.length === 0" style="opacity:.7;">
      Ingen logg enda.
    </p>

    <ul v-else class="list">
      <li v-for="item in items" :key="item.date" class="row">
        <div class="date">{{ item.date }}</div>

        <div class="meta">
          <div>Søvn: <strong>{{ item.sleep }}</strong> t</div>
          <div>Trening: <strong>{{ item.workout }}</strong> min</div>
          <div>Bevegelse: <strong>{{ item.movement }}</strong></div>
          <div>Score: <strong>{{ item.score }}</strong> ({{ item.color }})</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.row { border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: white; }
.date { font-weight: 800; margin-bottom: 6px; }
.meta { display: grid; gap: 4px; opacity: .9; }
</style>