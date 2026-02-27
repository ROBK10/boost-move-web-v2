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

// Placeholder-data (kan kobles på senere)
const monthLabel = "MAI 2024"
const total = 12
</script>

<template>
  <section
    class="card"
    role="button"
    tabindex="0"
    @click="open"
    @keydown="onKeydown"
    aria-label="Åpne BoostMoment"
  >
    <div class="top">
      <div class="title">
        <span class="bolt" aria-hidden="true"></span>
        <span>Boost</span>
      </div>
    </div>

    <div class="stat">
      <div class="month">{{ monthLabel }}</div>
      <div class="row">
        <div class="num">{{ total }}</div>
        <div class="txt">totalt</div>
      </div>
    </div>

    <div class="cta">
      <span>Start nå</span>
      <span class="arrow" aria-hidden="true"></span>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: #0b0f17;
  color: white;
  border-radius: 26px;
  padding: 18px;
  box-shadow: 0 16px 40px rgba(17, 24, 39, 0.18);
  min-height: 175px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 50px rgba(17, 24, 39, 0.22);
}

.card:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.25);
  outline-offset: 4px;
}

.title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  font-size: 18px;
}

.bolt {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.stat {
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 14px;
}

.month {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.55);
}

.row {
  margin-top: 6px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.num {
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.txt {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.70);
}

.cta {
  margin-top: 12px;
  border-radius: 999px;
  padding: 14px 16px;
  background: white;
  color: #111827;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.arrow {
  width: 14px;
  height: 14px;
  border-right: 2px solid rgba(17, 24, 39, 0.8);
  border-top: 2px solid rgba(17, 24, 39, 0.8);
  transform: rotate(45deg);
}
</style>