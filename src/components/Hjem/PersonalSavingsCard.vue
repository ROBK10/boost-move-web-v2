<script setup lang="ts">
import { computed } from "vue"
import { useMinHelseStore } from "@/stores/minHelseStore"
import { useBoostStore } from "@/stores/boostStore"
import { useAuthStore } from "@/stores/authStore"
import { personalSavings } from "@/utils/personalHealthSavings"

const minHelse = useMinHelseStore()
const boost = useBoostStore()
const auth = useAuthStore()

const nok = new Intl.NumberFormat("nb-NO", { style: "decimal", maximumFractionDigits: 0 })

const savings = computed(() => {
  if (minHelse.monthCheckins.length < 3) return null
  return personalSavings(minHelse.monthCheckins as any[], boost.monthTotal, auth.user?.weeklyGoal ?? 150)
})

defineEmits<{
  (e: "open"): void
}>()
</script>

<template>
  <section
    v-if="savings"
    class="card"
    role="button"
    tabindex="0"
    @click="$emit('open')"
    @keydown.enter="$emit('open')"
    aria-label="Se helsekalkulator"
  >
    <div class="top-row">
      <div class="label">DIN HELSEGEVINST</div>
      <div class="badge" :class="savings.activityLevel">{{ savings.activityLabel }}</div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-num">{{ savings.weeklyMinutes }}</div>
        <div class="stat-unit">min/uke</div>
      </div>
      <div class="divider" />
      <div class="stat">
        <div class="stat-num highlight">{{ nok.format(savings.monthlySavings) }}</div>
        <div class="stat-unit">kr denne mnd</div>
      </div>
    </div>

    <div class="hint">Estimert helsegevinst basert på dine innsjekker</div>
  </section>
</template>

<style scoped>
.card {
  background: #023238;
  border-radius: 28px;
  padding: 20px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.3);
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}

.label {
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.1em;
  color: rgba(209,231,229,0.35);
}

.badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  white-space: nowrap;
}
.badge.inactive { background: rgba(239,68,68,0.1); color: rgba(239,68,68,0.85); }
.badge.partial { background: rgba(245,158,11,0.1); color: rgba(245,158,11,0.85); }
.badge.active { background: rgba(16,185,129,0.1); color: rgba(16,185,129,0.95); }
.badge.extra { background: rgba(190,242,1,0.1); color: rgba(190,242,1,0.95); }

.stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat {
  flex: 1;
}

.stat-num {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  line-height: 1.1;
}

.stat-num.highlight {
  color: rgba(190, 242, 1, 0.95);
}

.stat-unit {
  font-size: 12px;
  font-weight: 800;
  color: rgba(209,231,229,0.35);
  margin-top: 2px;
}

.divider {
  width: 1px;
  height: 36px;
  background: rgba(209,231,229,0.08);
  flex-shrink: 0;
}

.hint {
  margin-top: 12px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
}
</style>
