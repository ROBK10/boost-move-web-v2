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

const props = defineProps<{
  monthLabel: string
  total: number
}>()
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
        <div class="bolt" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <span>Boosts</span>
      </div>
    </div>

    <div class="stat">
      <div class="month">{{ monthLabel }}</div>
      <div class="row">
        <div class="num">{{ total }}</div>
        <div class="txt">innsjekk denne måneden</div>
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
  background: #023238;
  color: white;
  border-radius: 26px;
  padding: 18px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.3);
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
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
}

.card:focus-visible {
  outline: 3px solid rgba(190, 242, 1, 0.25);
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
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
  background: #023238;
  color: #FFFFFF;
  font-weight: 900;
  font-size: 15px;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.arrow {
  width: 14px;
  height: 14px;
  border-right: 2px solid rgba(209,231,229,0.6);
  border-top: 2px solid rgba(209,231,229,0.6);
  transform: rotate(45deg);
}
</style>
