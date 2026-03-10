<script setup lang="ts">
const emit = defineEmits<{
  (e: "open"): void
}>()

const props = withDefaults(
  defineProps<{
    available?: boolean
    score?: number | null
    trend?: "up" | "down" | "stable"
    title?: string
  }>(),
  {
    available: false,
    score: null,
    trend: "stable",
    title: "Lagets kapasitet",
  }
)

function open() {
  emit("open")
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    open()
  }
}

function arrow(v: "up" | "down" | "stable") {
  if (v === "up") return "↑"
  if (v === "down") return "↓"
  return "→"
}

function trendText(v: "up" | "down" | "stable") {
  if (v === "up") return "bedre"
  if (v === "down") return "lavere"
  return "stabil"
}

function moodText(score: number) {
  if (score >= 75) return "Laget virker i flyt i dag."
  if (score >= 60) return "En jevn og stabil dag for laget."
  if (score >= 45) return "Laget virker litt slitent i dag."
  return "En tung dag for laget."
}
</script>

<template>
  <section
    class="card"
    :class="{ 'card--unavailable': !available }"
    role="button"
    tabindex="0"
    @click="open"
    @keydown="onKeydown"
    aria-label="Åpne Lagets kapasitet"
  >
    <div class="head">
      <div class="eyebrow">{{ title }}</div>
      <div class="chev" aria-hidden="true"></div>
    </div>

    <div v-if="available" class="main">
      <div class="score">{{ score }}</div>

      <div class="meta">
        <div class="trendLine">
          <span class="trendIcon">{{ arrow(trend) }}</span>
          <span class="trendText">{{ trendText(trend) }}</span>
        </div>

        <div class="mood">
          {{ moodText(score) }}
        </div>
      </div>
    </div>

    <div v-else class="unavailable">
      <div class="unavailableScore">—</div>
      <div class="unavailableText">Lagstatus vises når flere har registrert innsjekk i dag.</div>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 28px;
  padding: 20px 18px 18px;
  box-shadow: 0 12px 36px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.06);
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 42px rgba(20, 20, 20, 0.08);
}

.card:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.22);
  outline-offset: 4px;
}

.card--unavailable {
  background: rgba(17, 24, 39, 0.03);
  cursor: default;
  border-color: rgba(17, 24, 39, 0.04);
  box-shadow: none;
}

.card--unavailable:hover {
  transform: none;
  box-shadow: none;
}

.card--unavailable .eyebrow {
  color: rgba(17, 24, 39, 0.28);
}

.card--unavailable .chev {
  border-color: rgba(17, 24, 39, 0.12);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.42);
}

.chev {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(17, 24, 39, 0.24);
  border-top: 2px solid rgba(17, 24, 39, 0.24);
  transform: rotate(45deg);
  flex-shrink: 0;
}

.main {
  margin-top: 14px;
  display: flex;
  align-items: flex-end;
  gap: 14px;
}

.score {
  font-size: 54px;
  line-height: 0.95;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #111827;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 4px;
}

.trendLine {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.trendIcon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.06);
  font-size: 13px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.8);
}

.trendText {
  font-size: 14px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.82);
}

.mood {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: rgba(17, 24, 39, 0.56);
  max-width: 240px;
}

.unavailable {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.unavailableScore {
  font-size: 54px;
  line-height: 0.95;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: rgba(17, 24, 39, 0.18);
}

.unavailableText {
  font-size: 13px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.42);
  line-height: 1.35;
  max-width: 280px;
}

@media (max-width: 420px) {
  .main {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .meta {
    padding-bottom: 0;
  }

  .mood {
    max-width: none;
  }
}
</style>