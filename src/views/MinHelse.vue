<script setup>
import { ref } from 'vue'
import MinHelseForm from '../components/minhelse/MinHelseForm.vue'
import MinHelseListe from '../components/minhelse/MinHelseListe.vue'

const items = ref([])

function handleSave(entry) {
  items.value.unshift(entry)
}
</script>

<template>
  <div>
    <h1>Min Helse</h1>

    <MinHelseForm @save="handleSave" />

    <div style="height: 16px;"></div>

    <MinHelseListe :items="items" />
  </div>
</template>