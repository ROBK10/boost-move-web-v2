<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const visible = ref(false)
let deferredPrompt: any = null

function onBeforeInstallPrompt(e: Event) {
  e.preventDefault()
  deferredPrompt = e
  visible.value = true
}

function onAppInstalled() {
  visible.value = false
  deferredPrompt = null
}

onMounted(() => {
  // Don't show if already running as a standalone PWA
  if (window.matchMedia("(display-mode: standalone)").matches) return
  window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)
  window.addEventListener("appinstalled", onAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)
  window.removeEventListener("appinstalled", onAppInstalled)
})

async function install() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  deferredPrompt = null
  if (outcome === "accepted") visible.value = false
}

function dismiss() {
  visible.value = false
}
</script>

<template>
  <Transition name="slide-up">
    <div v-if="visible" class="install-banner" role="banner">
      <div class="banner-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>

      <p class="banner-text">
        Installer Boost Move på hjemskjermen for rask tilgang og varsler.
      </p>

      <div class="banner-actions">
        <button class="install-btn" type="button" @click="install">
          Installer app
        </button>
        <button class="dismiss-btn" type="button" @click="dismiss" aria-label="Lukk">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.install-banner {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 76px);
  left: 12px;
  right: 12px;
  max-width: 496px;
  margin: 0 auto;
  background: #0f172a;
  color: white;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 16px 40px rgba(17, 24, 39, 0.28);
  z-index: 100;
}

.banner-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.4;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.install-btn {
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: 999px;
  background: white;
  color: #0f172a;
  font-size: 13px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 150ms ease;
}

.install-btn:active {
  opacity: 0.85;
}

.dismiss-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

/* TRANSITION */
.slide-up-enter-active {
  transition: opacity 220ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.slide-up-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
