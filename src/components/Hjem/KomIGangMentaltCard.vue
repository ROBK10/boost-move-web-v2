<script setup lang="ts">
const emit = defineEmits<{
  (e: "open"): void
}>()

function open() { emit("open") }
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open() }
}
</script>

<template>
  <section
    class="card"
    role="button"
    tabindex="0"
    @click="open"
    @keydown="onKeydown"
    aria-label="Åpne Min reise"
  >
    <div class="icon" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>

    <div class="content">
      <div class="title">Min reise</div>
      <div class="sub">Din personlige plan</div>
    </div>

    <div class="go" aria-hidden="true">
      <span class="go-arrow"></span>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: #023238;
  border-radius: 26px;
  padding: 18px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.25);
  min-height: 175px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.card:hover { transform: translateY(-1px); box-shadow: 0 16px 46px rgba(0,0,0,0.3); }
.card:focus-visible { outline: 3px solid rgba(190, 242, 1, 0.25); outline-offset: 4px; }

.icon {
  width: 46px; height: 46px; border-radius: 999px;
  background: rgba(190,242,1,0.1);
  display: flex; align-items: center; justify-content: center;
  color: #BEF201;
}

.title { font-size: 20px; font-weight: 900; color: #FFFFFF; }
.sub { margin-top: 6px; font-size: 14px; font-weight: 700; color: rgba(209,231,229,0.35); }

.go {
  width: 44px; height: 44px; border-radius: 999px;
  background: rgba(209,231,229,0.06);
  display: grid; place-items: center; align-self: flex-start;
}
.go-arrow {
  width: 14px; height: 14px;
  border-right: 2px solid rgba(209,231,229,0.5);
  border-top: 2px solid rgba(209,231,229,0.5);
  transform: rotate(45deg);
}
</style>
