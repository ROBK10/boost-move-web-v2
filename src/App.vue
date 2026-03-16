<script setup>
import BottomNav from "@/components/ui/BottomNav.vue"
import OnboardingModal from "@/components/ui/OnboardingModal.vue"
import InstallBanner from "@/components/ui/InstallBanner.vue"
</script>

<template>
  <div class="app-shell">
    <main class="page">
      <router-view />
    </main>

    <BottomNav />
    <InstallBanner />
    <OnboardingModal />
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  padding-top: env(safe-area-inset-top);
}

/* Plass til bunnmenyen + safe area bunn */
.page {
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
}
</style>