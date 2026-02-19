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
import { useAppStore } from './stores/appStore'
import BottomNav from './components/ui/BottomNav.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.loadFromStorage()
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