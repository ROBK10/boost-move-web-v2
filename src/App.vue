<script setup>
import { ref, computed, watch } from "vue"
import BottomNav from "@/components/ui/BottomNav.vue"
import OnboardingModal from "@/components/ui/OnboardingModal.vue"
import InstallBanner from "@/components/ui/InstallBanner.vue"
import OnboardingFlow from "@/components/ui/OnboardingFlow.vue"
import { useAuthStore } from "@/stores/authStore"
import { initBreakReminder } from "@/services/breakReminder"

initBreakReminder()

const auth = useAuthStore()
const showOnboarding = ref(false)

watch(() => auth.user, (user) => {
  if (user && user.onboardingDone === false) {
    showOnboarding.value = true
  }
}, { immediate: true })

function onboardingDone() {
  showOnboarding.value = false
}
</script>

<template>
  <div class="app-shell">
    <main class="page">
      <router-view />
    </main>

    <BottomNav />
    <InstallBanner />
    <OnboardingModal />
    <OnboardingFlow v-if="showOnboarding" @done="onboardingDone" />
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  padding-top: env(safe-area-inset-top);
  background: #021C20;
  color: #D1E7E5;
}

/* Plass til bunnmenyen + safe area bunn */
.page {
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
}
</style>