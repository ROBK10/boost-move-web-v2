<script setup>
import BottomNav from "@/components/ui/BottomNav.vue"
</script>

<template>
  <div class="app-shell">
    <main class="page">
      <router-view />
    </main>

    <BottomNav />
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
}

/* Plass til bunnmenyen */
.page {
  padding-bottom: 96px;
}
</style>