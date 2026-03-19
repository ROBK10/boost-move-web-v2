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
</script>

<template>
  <section
    class="pill"
    role="button"
    tabindex="0"
    @click="open"
    @keydown="onKeydown"
    aria-label="Åpne helsekalkulator"
  >
    <div class="icon" aria-hidden="true">
      <div class="bar b1" />
      <div class="bar b2" />
      <div class="bar b3" />
    </div>

    <div class="text">
      <div class="label">HELSEKALKULATOR</div>
      <div class="desc">Se helsegevinsten av fysisk aktivitet for din bedrift</div>
    </div>

    <div class="chev" aria-hidden="true"></div>
  </section>
</template>

<style scoped>
.pill {
  background: rgba(190, 242, 1, 0.05);
  border-radius: 22px;
  padding: 14px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: inset 0 0 0 1px rgba(190, 242, 1, 0.08);
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease;
}

.pill:hover {
  transform: translateY(-1px);
}

.pill:focus-visible {
  outline: 3px solid rgba(190, 242, 1, 0.25);
  outline-offset: 4px;
}

.icon {
  width: 32px;
  height: 28px;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.bar {
  width: 6px;
  border-radius: 3px;
  background: rgba(190, 242, 1, 0.7);
}
.b1 { height: 10px; }
.b2 { height: 18px; }
.b3 { height: 26px; }

.text {
  flex: 1;
}

.label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: rgba(190, 242, 1, 0.65);
}

.desc {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 800;
  color: #D1E7E5;
  line-height: 1.4;
}

.chev {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(190, 242, 1, 0.35);
  border-top: 2px solid rgba(190, 242, 1, 0.35);
  transform: rotate(45deg);
  flex-shrink: 0;
}
</style>
