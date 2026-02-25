<template>
  <div class="app">
    <div class="page">
      <router-view />
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

import BottomNav from './components/ui/BottomNav.vue'

import { useAppStore } from './stores/appStore'
import { useMinHelseStore } from './stores/minHelseStore'

const appStore = useAppStore()
const minHelseStore = useMinHelseStore()

onMounted(() => {
  // eksisterende app-state
  appStore.loadFromStorage()

  // min helse historikk (localStorage -> pinia)
  minHelseStore.hydrateFromLocalStorage()
})
</script>


<style scoped>
.app {
  min-height: 100vh;
  background: #f9fafb;
}

.page {
  padding: 16px;
  padding-bottom: 80px; /* plass til bottom nav */
  max-width: 900px;     /* desktop-optimalisert */
  margin: 0 auto;
}
</style>