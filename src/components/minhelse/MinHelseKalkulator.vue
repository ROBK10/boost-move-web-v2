<script setup lang="ts">
import { computed, watch } from "vue"
import { useMinHelseStore } from "@/stores/minHelseStore"
import MinHelseInputRow from "@/components/minhelse/MinHelseInputRow.vue"

const store = useMinHelseStore()

// ✅ Auto: hver endring i draft => oppdater latestScore + lagre i localStorage
watch(
  () => store.draft,
  () => {
    store.recalcScore()
  },
  { deep: true }
)

function fmt1(v: number | null) {
  if (v == null) return "–"
  return Number.isFinite(v) ? String(v) : "–"
}

function fmtSleep(v: number | null) {
  if (v == null) return "–"
  return (Math.round(v * 2) / 2).toFixed(1)
}

const sleep = computed<number | null>({
  get: () => store.draft.sleepHours,
  set: (v) => (store.draft.sleepHours = v == null ? null : v),
})

const food = computed<number | null>({
  get: () => store.draft.foodQuality,
  set: (v) => (store.draft.foodQuality = v == null ? null : Math.max(1, Math.min(10, v))),
})

const training = computed<number | null>({
  get: () => store.draft.trainingMinutes,
  set: (v) => (store.draft.trainingMinutes = v == null ? null : Math.max(0, v)),
})

const weight = computed<number | null>({
  get: () => store.draft.weightKg,
  set: (v) => (store.draft.weightKg = v == null ? null : Math.max(0, v)),
})

const movement = computed<number | null>({
  get: () => store.draft.movementRaw,
  set: (v) => (store.draft.movementRaw = v == null ? null : Math.max(0, v)),
})

// “5/5 fullført”
const filledCount = computed(() => {
  const vals = [sleep.value, food.value, training.value, weight.value, movement.value]
  return vals.filter((v) => v != null && Number(v) > 0).length
})

defineExpose({ filledCount })
</script>

<template>
  <div class="wrap">
    <div class="head">
      <div class="h">DAGENS REGISTRERING</div>
      <div class="badge">{{ filledCount }}/5 fullført</div>
    </div>

    <div class="grid">
      <!-- Søvn -->
      <MinHelseInputRow
        title="Søvn"
        subtitle="TIMER"
        rightMode="stepper"
        :valueText="fmtSleep(sleep)"
        iconBg="rgba(99,102,241,0.10)"
        @minus="sleep = sleep == null ? 0 : Math.max(0, sleep - 0.5)"
        @plus="sleep = sleep == null ? 0.5 : sleep + 0.5"
      >
        <template #icon>
          <div class="moon" aria-hidden="true" />
        </template>
      </MinHelseInputRow>

      <!-- Kosthold -->
      <MinHelseInputRow
        title="Kosthold"
        subtitle="KVALITET (1–10)"
        rightMode="value"
        :valueText="food == null ? '–' : String(food)"
        iconBg="rgba(16,185,129,0.10)"
        @click="food = food == null ? 5 : ((food % 10) + 1)"
      >
        <template #icon>
          <div class="fork" aria-hidden="true" />
        </template>
      </MinHelseInputRow>

      <!-- Trening -->
      <MinHelseInputRow
        title="Trening"
        subtitle="MINUTTER"
        rightMode="value"
        :valueText="fmt1(training)"
        iconBg="rgba(245,158,11,0.10)"
        @click="training = training == null ? 30 : training + 10"
      >
        <template #icon>
          <div class="bolt" aria-hidden="true" />
        </template>
      </MinHelseInputRow>

      <!-- Vekt -->
      <MinHelseInputRow
        title="Vekt"
        subtitle="KG"
        rightMode="value"
        :valueText="weight == null ? '–' : weight.toFixed(1)"
        iconBg="rgba(17,24,39,0.06)"
        @click="weight = weight == null ? 80 : Math.round((weight + 0.1) * 10) / 10"
      >
        <template #icon>
          <div class="scale" aria-hidden="true" />
        </template>
      </MinHelseInputRow>

      <!-- Bevegelse -->
      <MinHelseInputRow
        title="Bevegelse"
        subtitle="MIN / SKRITT"
        rightMode="value"
        :valueText="fmt1(movement)"
        iconBg="rgba(59,130,246,0.10)"
        @click="movement = movement == null ? 4000 : movement + 500"
      >
        <template #icon>
          <div class="shoe" aria-hidden="true" />
        </template>
      </MinHelseInputRow>
    </div>

    <div class="hint">
      (V2) Klikk på et kort for å øke verdien raskt. Vi kan bytte til ekte input/stepper per kort etterpå.
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: grid;
  gap: 14px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.h {
  font-size: 14px;
  font-weight: 950;
  letter-spacing: 0.12em;
  color: rgba(17, 24, 39, 0.35);
}

.badge {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.10);
  color: rgba(16, 185, 129, 0.95);
  font-weight: 950;
}

.grid {
  display: grid;
  gap: 14px;
}

.hint {
  font-size: 12px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.38);
  margin-top: 2px;
}

.moon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  box-shadow: inset 10px 0 0 0 rgba(99,102,241,0.95);
  position: relative;
}
.moon::after {
  content: "";
  position: absolute;
  right: -2px;
  top: 6px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: white;
}

.fork {
  width: 26px;
  height: 26px;
  position: relative;
}
.fork::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 22px;
  background: rgba(16,185,129,0.95);
  border-radius: 99px;
}
.fork::after {
  content: "";
  position: absolute;
  left: 14px;
  top: 2px;
  width: 4px;
  height: 22px;
  background: rgba(16,185,129,0.95);
  border-radius: 99px;
}

.bolt {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 6px solid transparent;
  border-top: 22px solid rgba(245,158,11,0.95);
  transform: skewX(-12deg);
}

.scale {
  width: 28px;
  height: 22px;
  border-radius: 8px;
  background: rgba(17,24,39,0.28);
  position: relative;
}
.scale::after {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  top: 6px;
  height: 2px;
  background: rgba(255,255,255,0.7);
}

.shoe {
  width: 28px;
  height: 18px;
  border-radius: 10px;
  background: rgba(59,130,246,0.95);
  position: relative;
}
.shoe::after {
  content: "";
  position: absolute;
  left: 4px;
  bottom: -4px;
  width: 20px;
  height: 6px;
  border-radius: 999px;
  background: rgba(59,130,246,0.35);
}
</style>