<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const R = {
  hjem: "/hjem",
  movin: "/movin",
  minHelse: "/min-helse",
  chat: "/chat",
  profil: "/profil",
}

const current = computed(() => route.path)

function isActive(path: string) {
  return current.value === path || current.value.startsWith(path + "/")
}

function go(path: string) {
  if (path && path !== current.value) router.push(path)
}
</script>

<template>
  <nav class="bottom-nav" aria-label="Bunnmeny">
    <div class="inner">

      <!-- Hjem -->
      <button
        class="item"
        :class="{ active: isActive(R.hjem) }"
        type="button"
        @click="go(R.hjem)"
        aria-label="Hjem"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
        <span class="label">Hjem</span>
      </button>

      <!-- Movin -->
      <button
        class="item"
        :class="{ active: isActive(R.movin) }"
        type="button"
        @click="go(R.movin)"
        aria-label="Movin"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
        <span class="label">Movin</span>
      </button>

      <!-- Min Helse — elevated center -->
      <button
        class="center"
        :class="{ active: isActive(R.minHelse) }"
        type="button"
        @click="go(R.minHelse)"
        aria-label="Min Helse"
      >
        <div class="center-pill">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="2 12 6 12 8 5 11 19 13 9 15 12 22 12"/>
          </svg>
        </div>
        <span class="label center-label">Min Helse</span>
      </button>

      <!-- Chat -->
      <button
        class="item"
        :class="{ active: isActive(R.chat) }"
        type="button"
        @click="go(R.chat)"
        aria-label="Chat"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="label">Chat</span>
      </button>

      <!-- Profil -->
      <button
        class="item"
        :class="{ active: isActive(R.profil) }"
        type="button"
        @click="go(R.profil)"
        aria-label="Profil"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <span class="label">Profil</span>
      </button>

    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid rgba(17, 24, 39, 0.07);
  /* Safe area on iPhone (notch devices) */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.inner {
  max-width: 520px;
  margin: 0 auto;
  height: 60px;
  display: grid;
  grid-template-columns: 1fr 1fr auto 1fr 1fr;
  align-items: end;
  padding: 0 8px;
}

/* ── Regular items ── */
.item {
  appearance: none;
  border: none;
  background: transparent;
  height: 60px;
  padding: 0 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  color: rgba(17, 24, 39, 0.32);
  transition: color 160ms ease;
  /* Ensure minimum 44px tap area */
  min-width: 44px;
}

.item.active {
  color: #111827;
}

.label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1;
}

/* ── Center (Min Helse) ── */
.center {
  appearance: none;
  border: none;
  background: transparent;
  padding: 0 6px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  cursor: pointer;
  user-select: none;
  color: rgba(17, 24, 39, 0.55);
  transition: color 160ms ease;
  min-width: 44px;
}

.center.active {
  color: #111827;
}

.center-pill {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 4px 20px rgba(17, 24, 39, 0.12), 0 1px 4px rgba(17, 24, 39, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-10px);
  transition: box-shadow 160ms ease, transform 160ms ease;
  color: #111827;
  border: 1px solid rgba(17, 24, 39, 0.07);
}

.center.active .center-pill {
  box-shadow: 0 6px 24px rgba(17, 24, 39, 0.16), 0 1px 4px rgba(17, 24, 39, 0.06);
}

.center-label {
  /* label sits below the pill's translateY offset */
  margin-top: -6px;
}
</style>
