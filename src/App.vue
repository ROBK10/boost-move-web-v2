<template>
  <div class="app">
    <main class="page">
      <router-view />
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import BottomNav from '@/components/ui/BottomNav.vue'
import { useMinHelseStore } from '@/stores/minHelseStore'
import { useBoostMomentStore } from '@/stores/boostMomentStore'

const minHelseStore = useMinHelseStore()
const boostMomentStore = useBoostMomentStore()

onMounted(() => {
  // Hydrér domene-stores ved oppstart
  minHelseStore.hydrateFromLocalStorage()
  boostMomentStore.hydrate()
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
  max-width: 900px;
  margin: 0 auto;
}
</style>