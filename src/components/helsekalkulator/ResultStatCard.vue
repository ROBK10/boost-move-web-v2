<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue"

const props = defineProps<{
  label: string
  value: number
  suffix?: string
  highlight?: boolean
}>()

const displayed = ref(0)
let animFrame = 0

function animate(from: number, to: number) {
  cancelAnimationFrame(animFrame)
  const start = performance.now()
  const duration = 800

  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - t, 3) // ease-out cubic
    displayed.value = Math.round(from + (to - from) * ease)
    if (t < 1) animFrame = requestAnimationFrame(tick)
  }

  animFrame = requestAnimationFrame(tick)
}

watch(
  () => props.value,
  (to, from) => animate(from ?? 0, to),
  { immediate: true }
)

onUnmounted(() => cancelAnimationFrame(animFrame))

const nok = new Intl.NumberFormat("nb-NO", { style: "decimal", maximumFractionDigits: 0 })
</script>

<template>
  <div class="stat" :class="{ hero: props.highlight }">
    <div class="label">{{ props.label }}</div>
    <div class="num">
      {{ nok.format(displayed) }}
      <span v-if="props.suffix" class="unit">{{ props.suffix }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat {
  text-align: center;
  padding: 20px 16px;
}

.label {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: rgba(209,231,229,0.35);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.num {
  font-size: 32px;
  font-weight: 900;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}

.hero .num {
  font-size: 42px;
  color: rgba(190, 242, 1, 0.95);
}

.unit {
  font-size: 18px;
  font-weight: 800;
  color: rgba(209,231,229,0.35);
  margin-left: 4px;
}

.hero .unit {
  color: rgba(190, 242, 1, 0.5);
}
</style>
