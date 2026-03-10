<script setup>
import BottomNav from "@/components/ui/BottomNav.vue"
import OnboardingModal from "@/components/ui/OnboardingModal.vue"
</script>

<template>
  <div class="app-shell">
    <main class="page">
      <router-view />
    </main>

    <BottomNav />
    <OnboardingModal />
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