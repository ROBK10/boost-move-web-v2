<script setup>
defineProps({
  items: Array
})

const emit = defineEmits(['remove'])
</script>

<template>
  <div>
    <h2>Historikk</h2>

    <p v-if="!items || items.length === 0">Ingen logg enda.</p>

    <ul v-else class="list">
      <li v-for="item in items" :key="item.id" class="row">
        <div><strong>{{ item.date }}</strong></div>

        <div v-if="item.sleep">Søvn: {{ item.sleep }} t</div>
        <div v-if="item.food">Kost: {{ item.food }}</div>
        <div v-if="item.workout">Trening: {{ item.workout }}</div>
        <div v-if="item.weight">Vekt: {{ item.weight }} kg</div>
        <div v-if="item.movement">Bevegelse: {{ item.movement }}</div>

        <button class="delete" @click="emit('remove', item.id)">Slett</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.row {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  background: white;
}

.delete {
  margin-top: 10px;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  font-weight: 600;
}
</style>