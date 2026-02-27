<script setup lang="ts">
import { RouterLink } from "vue-router"

const props = defineProps<{
  title: string
  subtitle?: string
  to: string
  variant?: "dark" | "light"
  icon?: "bolt" | "brain" | "book" | "gift" | "stack" | "calendar"
}>()

const isDark = props.variant === "dark"

function iconChar() {
  // Vi bruker “enkle” symbols (ingen emoji i UI),
  // dette er bare placeholders til du evt. bytter til SVG senere.
  switch (props.icon) {
    case "bolt":
      return "⚡"
    case "brain":
      return "🧠"
    case "book":
      return "📘"
    case "gift":
      return "🎁"
    case "stack":
      return "🗂️"
    case "calendar":
      return "📅"
    default:
      return "•"
  }
}
</script>

<template>
  <RouterLink class="tile" :class="{ dark: isDark }" :to="to">
    <div class="iconBox" :class="{ dark: isDark }">
      <span class="icon" aria-hidden="true">{{ iconChar() }}</span>
    </div>

    <div class="content">
      <div class="title">{{ title }}</div>
      <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
    </div>

    <div class="arrow" :class="{ dark: isDark }" aria-hidden="true">
      <span class="chev"></span>
    </div>
  </RouterLink>
</template>

<style scoped>
.tile {
  position: relative;
  display: block;
  text-decoration: none;
  border-radius: 30px;
  padding: 20px;
  min-height: 190px;
  background: white;
  box-shadow: 0 14px 40px rgba(20, 20, 20, 0.06);
  color: #111827;
  overflow: hidden;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.tile:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 52px rgba(20, 20, 20, 0.08);
}

.tile:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.25);
  outline-offset: 4px;
}

/* Dark (Boost Moment) */
.tile.dark {
  background: #0b0f17;
  color: white;
  box-shadow: 0 18px 60px rgba(17, 24, 39, 0.22);
}

/* Icon box */
.iconBox {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(17, 24, 39, 0.05);
  box-shadow: 0 10px 26px rgba(20, 20, 20, 0.08);
}

.iconBox.dark {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: none;
}

.icon {
  font-size: 22px;
  line-height: 1;
}

/* Content */
.content {
  margin-top: 18px;
  max-width: 90%;
}

.title {
  font-size: 26px;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

.tile.dark .subtitle {
  color: rgba(255, 255, 255, 0.55);
}

/* Arrow bubble */
.arrow {
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.06);
  display: grid;
  place-items: center;
}

.arrow.dark {
  background: rgba(255, 255, 255, 0.14);
}

.chev {
  width: 14px;
  height: 14px;
  border-right: 2px solid rgba(17, 24, 39, 0.55);
  border-top: 2px solid rgba(17, 24, 39, 0.55);
  transform: rotate(45deg);
}

.arrow.dark .chev {
  border-right-color: rgba(255, 255, 255, 0.70);
  border-top-color: rgba(255, 255, 255, 0.70);
}
</style>