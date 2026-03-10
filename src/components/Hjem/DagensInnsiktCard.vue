<script setup lang="ts">
const emit = defineEmits<{
  (e: "open"): void
}>()

function open() {
  emit("open")
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    open()
  }
}

const insights = [
  "Små bevegelsespauser gjennom dagen gir bedre fokus og lavere stressnivå.",
  "3 dype pust senker pulsen og hjelper kroppen å skifte til ro-modus.",
  "Regelmessig bevegelse er den enkeltfaktoren som påvirker energinivået mest.",
  "Det å stå opp i 2 minutter per time reduserer belastningen på ryggen markant.",
  "Mental kapasitet henger direkte sammen med søvn, bevegelse og pauser.",
]

const insight = insights[Math.floor(Math.random() * insights.length)]
</script>

<template>
  <section
    class="pill"
    role="button"
    tabindex="0"
    @click="open"
    @keydown="onKeydown"
    aria-label="Åpne KnowZone"
  >
    <div class="dot" aria-hidden="true"></div>

    <div class="text">
      <div class="label">DAGENS INNSIKT</div>
      <div class="quote">{{ insight }}</div>
    </div>

    <div class="chev" aria-hidden="true"></div>
  </section>
</template>

<style scoped>
.pill {
  background: rgba(17, 24, 39, 0.03);
  border-radius: 22px;
  padding: 14px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.04);
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease;
}

.pill:hover {
  transform: translateY(-1px);
}

.pill:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.25);
  outline-offset: 4px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.28);
}

.text {
  flex: 1;
}

.label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: rgba(17, 24, 39, 0.45);
}

.quote {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.78);
  line-height: 1.4;
}

.chev {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(17, 24, 39, 0.25);
  border-top: 2px solid rgba(17, 24, 39, 0.25);
  transform: rotate(45deg);
}
</style>
