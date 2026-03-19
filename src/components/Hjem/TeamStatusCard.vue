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
    title: "Lagets helsescore",
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
  if (score >= 80) return "Laget scorer sterkt på alle pilarer i dag."
  if (score >= 60) return "Laget har en god dag – de fleste pilarene er dekket."
  if (score >= 40) return "Noen pilarer kan bli bedre – oppmuntre til små grep."
  return "Laget trenger litt ekstra i dag – fokus på det viktigste."
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
    aria-label="Åpne Lagets helsescore"
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
      <div class="unavailableText">Lagets helsescore vises når flere har registrert innsjekk i dag.</div>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: #023238;
  border-radius: 28px;
  padding: 20px 18px 18px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 42px rgba(0,0,0,0.3);
}

.card:focus-visible {
  outline: 3px solid rgba(190, 242, 1, 0.22);
  outline-offset: 4px;
}

.card--unavailable {
  background: rgba(209,231,229,0.04);
  cursor: default;
  border-color: rgba(209,231,229,0.06);
  box-shadow: none;
}

.card--unavailable:hover {
  transform: none;
  box-shadow: none;
}

.card--unavailable .eyebrow {
  color: rgba(209,231,229,0.25);
}

.card--unavailable .chev {
  border-color: rgba(209,231,229,0.12);
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
  color: rgba(209,231,229,0.35);
}

.chev {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(209,231,229,0.2);
  border-top: 2px solid rgba(209,231,229,0.2);
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
  color: #FFFFFF;
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
  background: rgba(209,231,229,0.06);
  font-size: 13px;
  font-weight: 900;
  color: #D1E7E5;
}

.trendText {
  font-size: 14px;
  font-weight: 900;
  color: rgba(209,231,229,0.95);
}

.mood {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: rgba(209,231,229,0.6);
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
  color: rgba(209,231,229,0.15);
}

.unavailableText {
  font-size: 13px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
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