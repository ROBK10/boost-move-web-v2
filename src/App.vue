<template>
  <div class="app">
    <div class="page">
      <router-view />
    </div>

    <BottomNav v-if="showNav" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/ui/BottomNav.vue'

const route = useRoute()
const showNav = computed(() => route.path !== '/login')
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