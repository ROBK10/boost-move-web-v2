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

const minutes = 2
</script>

<template>
  <section
    class="card"
    role="button"
    tabindex="0"
    @click="open"
    @keydown="onKeydown"
    aria-label="Åpne Kom i gang mentalt"
  >
    <div class="play" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    </div>

    <div class="content">
      <div class="title">Mental start</div>
      <div class="sub">{{ minutes }} min pause</div>
    </div>

    <div class="go" aria-hidden="true">
      <span class="go-arrow"></span>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 26px;
  padding: 18px;
  box-shadow: 0 12px 36px rgba(20, 20, 20, 0.06);
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
  box-shadow: 0 16px 46px rgba(20, 20, 20, 0.08);
}

.card:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.25);
  outline-offset: 4px;
}

.play {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.06);
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(17, 24, 39, 0.7);
  padding-left: 2px; /* optical center for play triangle */
}

.title {
  font-size: 20px;
  font-weight: 900;
  color: #111827;
}

.sub {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

.go {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.06);
  display: grid;
  place-items: center;
  align-self: flex-start;
}

.go-arrow {
  width: 14px;
  height: 14px;
  border-right: 2px solid rgba(17, 24, 39, 0.65);
  border-top: 2px solid rgba(17, 24, 39, 0.65);
  transform: rotate(45deg);
}
</style>