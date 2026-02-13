<script setup>
defineProps({
  items: Array
})
</script>

<template>
  <div>
    <h2>Historikk</h2>

    <p v-if="!items || items.length === 0">Ingen logg enda.</p>

    <ul v-else class="list">
      <li v-for="item in items" :key="item.date" class="row">
        <div><strong>{{ item.date }}</strong></div>
        <div>Søvn: {{ item.sleepHours }} t</div>
        <div>Trening: {{ item.workoutText }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.row { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: white; }
</style>