<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

// ✅ Antatte ruter (justeres kun her hvis de hos deg heter noe annet)
const R = {
  hjem: "/",
  movin: "/movin",
  minHelse: "/min-helse",
  chat: "/chat",
  profil: "/profil",
}

const current = computed(() => route.path)

function isActive(path: string) {
  if (path === "/") return current.value === "/"
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
        <span class="icon home" aria-hidden="true"></span>
        <span class="text">Hjem</span>
      </button>

      <!-- Movin -->
      <button
        class="item"
        :class="{ active: isActive(R.movin) }"
        type="button"
        @click="go(R.movin)"
        aria-label="Movin"
      >
        <span class="icon movin" aria-hidden="true"></span>
        <span class="text">Movin</span>
      </button>

      <!-- Min Helse (senter) -->
      <button
        class="center"
        :class="{ active: isActive(R.minHelse) }"
        type="button"
        @click="go(R.minHelse)"
        aria-label="Min Helse"
      >
        <span class="center-icon" aria-hidden="true"></span>
        <span class="center-text">Min Helse</span>
      </button>

      <!-- Chat -->
      <button
        class="item"
        :class="{ active: isActive(R.chat) }"
        type="button"
        @click="go(R.chat)"
        aria-label="Chat"
      >
        <span class="icon chat" aria-hidden="true"></span>
        <span class="text">Chat</span>
      </button>

      <!-- Profil -->
      <button
        class="item"
        :class="{ active: isActive(R.profil) }"
        type="button"
        @click="go(R.profil)"
        aria-label="Profil"
      >
        <span class="icon profil" aria-hidden="true"></span>
        <span class="text">Profil</span>
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

  padding: 10px 14px 14px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.inner {
  max-width: 520px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 1fr 1fr auto 1fr 1fr;
  align-items: end;
  gap: 10px;
}

/* Standard items */
.item {
  appearance: none;
  border: none;
  background: transparent;
  padding: 10px 6px;

  display: grid;
  place-items: center;
  gap: 7px;

  cursor: pointer;
  user-select: none;

  color: rgba(17, 24, 39, 0.45);
  font-weight: 800;
  font-size: 11px;
}

/* Enkle, “proffe” ikoner uten emoji (CSS-shapes) */
.icon {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: rgba(17, 24, 39, 0.10);
}

/* små variasjoner så de ikke ser identiske ut */
.icon.home { border-radius: 6px; }
.icon.movin { border-radius: 999px; }
.icon.chat { border-radius: 6px 6px 999px 6px; }
.icon.profil { border-radius: 999px; }

.item.active {
  color: rgba(17, 24, 39, 0.92);
}

.item.active .icon {
  background: rgba(17, 24, 39, 0.92);
}

/* Senterknapp */
.center {
  appearance: none;
  border: none;
  cursor: pointer;
  user-select: none;

  padding: 12px 16px 11px;
  border-radius: 18px;

  background: #111827;
  box-shadow: 0 14px 30px rgba(17, 24, 39, 0.22);

  transform: translateY(-10px);

  display: grid;
  place-items: center;
  gap: 6px;
}

.center-icon {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
}

.center-text {
  font-size: 11px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.01em;
}

.center.active {
  box-shadow: 0 16px 34px rgba(17, 24, 39, 0.32);
}
</style>