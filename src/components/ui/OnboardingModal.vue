<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useAuthStore } from "@/stores/authStore"

const auth = useAuthStore()

const visible = ref(false)

// Per-user key so different users on the same device each see the modal once
function storageKey(): string {
  return `onboarding_seen_${auth.user?.id ?? "guest"}`
}

onMounted(() => {
  if (!localStorage.getItem(storageKey())) {
    visible.value = true
  }
})

function dismiss() {
  localStorage.setItem(storageKey(), "1")
  visible.value = false
}

// Detect platform so we can surface the relevant steps first
const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""
const isIOS = /iPad|iPhone|iPod/.test(ua)
const isAndroid = /Android/.test(ua)
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="fullscreen" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div class="scroll-wrap">
        <div class="content">

          <!-- App icon -->
          <div class="app-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
          </div>

          <!-- Welcome -->
          <h1 id="onboarding-title" class="welcome-title">
            Velkommen til Boost Move
          </h1>
          <p class="welcome-text">
            Din daglige partner for bevegelse og kapasitet. Legg appen til på hjemskjermen for raskest mulig tilgang.
          </p>

          <!-- Instructions — relevant platform shown first -->
          <div class="steps-wrap">

            <!-- iOS (shown first on iPhone/iPad) -->
            <div class="platform-block" :class="{ highlighted: isIOS }">
              <div class="platform-header">
                <div class="platform-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <span class="platform-name">iPhone / iPad</span>
                <span v-if="isIOS" class="platform-badge">Din enhet</span>
              </div>
              <ol class="steps">
                <li class="step">
                  <span class="step-num">1</span>
                  <span class="step-text">Trykk på <strong>Del-knappen</strong> <span class="inline-icon" aria-hidden="true">↑□</span> nederst i Safari</span>
                </li>
                <li class="step">
                  <span class="step-num">2</span>
                  <span class="step-text">Velg <strong>«Legg til på hjemskjermen»</strong></span>
                </li>
                <li class="step">
                  <span class="step-num">3</span>
                  <span class="step-text">Trykk <strong>Legg til</strong> øverst til høyre</span>
                </li>
              </ol>
            </div>

            <!-- Android (shown first on Android) -->
            <div class="platform-block" :class="{ highlighted: isAndroid }">
              <div class="platform-header">
                <div class="platform-icon android-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.341l-.862-1.484A5.875 5.875 0 0 0 18 11.004a5.875 5.875 0 0 0-2.85-5.038l.862-1.483a.5.5 0 1 0-.866-.5l-.878 1.514A5.94 5.94 0 0 0 12 5a5.94 5.94 0 0 0-2.268.497L8.854 3.983a.5.5 0 1 0-.866.5l.862 1.483A5.875 5.875 0 0 0 6 11.004c0 1.95.95 3.674 2.41 4.737l-.862 1.484a.5.5 0 1 0 .866.5l.878-1.514A5.94 5.94 0 0 0 12 16.5c.818 0 1.598-.173 2.302-.489l.878 1.514a.5.5 0 1 0 .866-.5zM10 12.004a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                  </svg>
                </div>
                <span class="platform-name">Android</span>
                <span v-if="isAndroid" class="platform-badge">Din enhet</span>
              </div>
              <ol class="steps">
                <li class="step">
                  <span class="step-num">1</span>
                  <span class="step-text">Trykk på <strong>menyikonet</strong> <span class="inline-icon" aria-hidden="true">⋮</span> øverst i Chrome</span>
                </li>
                <li class="step">
                  <span class="step-num">2</span>
                  <span class="step-text">Velg <strong>«Legg til på startskjermen»</strong></span>
                </li>
                <li class="step">
                  <span class="step-num">3</span>
                  <span class="step-text">Trykk <strong>Legg til</strong> i dialogen</span>
                </li>
              </ol>
            </div>

          </div>

          <!-- CTA -->
          <button class="cta-btn" type="button" @click="dismiss">
            Kom i gang
          </button>

          <button class="skip-btn" type="button" @click="dismiss">
            Hopp over
          </button>

        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* FULLSCREEN LAYER */
.fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  z-index: 200;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
}

/* SCROLL WRAPPER — allows content taller than viewport to scroll */
.scroll-wrap {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* CONTENT CARD — centered, max-width, padded */
.content {
  width: 100%;
  max-width: 480px;
  padding: 56px 24px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* APP ICON */
.app-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.2);
  flex-shrink: 0;
}

/* WELCOME */
.welcome-title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #111827;
  text-align: center;
  line-height: 1.2;
}

.welcome-text {
  margin: 0 0 28px;
  font-size: 15px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.55);
  text-align: center;
  line-height: 1.6;
  max-width: 320px;
}

/* PLATFORM BLOCKS */
.steps-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.platform-block {
  background: white;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.04);
}

.platform-block.highlighted {
  background: white;
  border-color: rgba(17, 24, 39, 0.14);
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.08);
  order: -1;
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.platform-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.platform-icon.android-icon {
  background: #3ddc84;
}

.platform-name {
  font-size: 13px;
  font-weight: 900;
  color: #111827;
  flex: 1;
}

.platform-badge {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: white;
  background: #111827;
  border-radius: 999px;
  padding: 3px 8px;
}

/* STEPS */
.steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.step-num {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.1);
  font-size: 11px;
  font-weight: 900;
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.platform-block.highlighted .step-num {
  background: #111827;
  color: white;
}

.step-text {
  font-size: 13px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.75);
  line-height: 1.5;
}

.step-text strong {
  color: #111827;
  font-weight: 800;
}

.inline-icon {
  display: inline-block;
  font-size: 12px;
  background: rgba(17, 24, 39, 0.08);
  border-radius: 4px;
  padding: 0 4px;
  letter-spacing: 0;
  font-weight: 700;
  color: #111827;
}

/* CTA */
.cta-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 16px;
  background: #111827;
  color: white;
  font-size: 16px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: opacity 150ms ease, transform 120ms ease;
  flex-shrink: 0;
}

.cta-btn:active {
  opacity: 0.88;
  transform: scale(0.98);
}

.skip-btn {
  margin-top: 14px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.4);
  cursor: pointer;
  font-family: inherit;
  padding: 4px 8px;
  flex-shrink: 0;
}

.skip-btn:hover {
  color: rgba(17, 24, 39, 0.65);
}

/* TRANSITION */
.fade-enter-active {
  transition: opacity 220ms ease;
}

.fade-leave-active {
  transition: opacity 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
