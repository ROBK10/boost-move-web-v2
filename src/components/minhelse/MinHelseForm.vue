<script setup>
import { ref } from 'vue'
import TrackCard from './TrackCard.vue'
import MinHelseKalkulator from './MinHelseKalkulator.vue'

const date = ref(new Date().toISOString().slice(0, 10))

const sleep = ref('')
const food = ref('')
const workout = ref('')
const weight = ref('')
const movement = ref('')

const error = ref('')

const emit = defineEmits(['save'])

function onSave() {
  error.value = ''

  if (!date.value) {
    error.value = 'Velg dato'
    return
  }

  // valider at minst én boks er fylt ut
  if (!sleep.value && !food.value && !workout.value && !weight.value && !movement.value) {
    error.value = 'Fyll inn minst én boks'
    return
  }

  emit('save', {
    id: crypto.randomUUID(),
    date: date.value,
    sleep: sleep.value,
    food: food.value,
    workout: workout.value,
    weight: weight.value,
    movement: movement.value,
  })

  sleep.value = ''
  food.value = ''
  workout.value = ''
  weight.value = ''
  movement.value = ''
}
</script>

<template>
  <div>
    <h2>Logg i dag</h2>

    <div class="field">
      <label>Dato</label>
      <input v-model="date" type="date" />
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div class="grid">
      <TrackCard title="Daglig søvn" unit="timer" placeholder="f.eks 7.5" v-model="sleep" />
      <TrackCard title="Daglig kost" unit="" placeholder="kort tekst" v-model="food" />
      <TrackCard title="Hvor mye trener du?" unit="min" placeholder="f.eks 30" v-model="workout" />
      <TrackCard title="Vekt" unit="kg" placeholder="f.eks 83.2" v-model="weight" />
      <TrackCard title="Daglig bevegelse" unit="skritt/min" placeholder="f.eks 8000" v-model="movement" />
    <MinHelseKalkulator
  :sleep="sleep"
  :food="food"
  :workout="workout"
  :weight="weight"
  :movement="movement"
/>
    
    </div>

    <button class="btn" @click="onSave">Lagre</button>
  </div>
</template>

.field { display: grid; gap: 6px; margin: 12px 0; }
input { padding: 10px; border: 1px solid #e5e7eb; border-radius: 10px; }
.btn { margin-top: 14px; padding: 10px 14px; border: 0; border-radius: 10px; font-weight: 700; }

.grid {
  display: grid;
  gap: 12px;
  margin: 12px 0;
}

.error {
  color: #b91c1c;
  font-weight: 600;
  margin-top: 8px;
}