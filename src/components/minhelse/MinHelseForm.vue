<script setup>
import { ref } from 'vue'

const sleepHours = ref('')
const workoutText = ref('')

const emit = defineEmits(['save'])

function onSave() {
  emit('save', {
    date: new Date().toISOString().slice(0, 10),
    sleepHours: sleepHours.value,
    workoutText: workoutText.value,
  })

  sleepHours.value = ''
  workoutText.value = ''
}
</script>

<template>
  <div>
    <h2>Logg i dag</h2>

    <div class="field">
      <label>Søvn (timer)</label>
      <input v-model="sleepHours" type="number" placeholder="f.eks 7.5" />
    </div>

    <div class="field">
      <label>Trening</label>
      <input v-model="workoutText" type="text" placeholder="f.eks 30 min gåtur" />
    </div>

    <button class="btn" @click="onSave">Lagre</button>
  </div>
</template>

<style scoped>
.field { display: grid; gap: 6px; margin: 12px 0; }
input { padding: 10px; border: 1px solid #e5e7eb; border-radius: 10px; }
.btn { padding: 10px 14px; border: 0; border-radius: 10px; font-weight: 700; }
</style>