<script setup lang="ts">
import { computed } from "vue"
import { useMinHelseStore } from "@/stores/minHelseStore"

const store = useMinHelseStore()

const days = computed(() => {
  // siste 7 entries sortert eldste -> nyeste
  const list = store.entriesList.slice(0, 7).reverse()

  const labels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"]
  // hvis du vil mappe faktisk dato->ukedag senere, gjør det i v2
  return labels.map((label, i) => {
    const entry = list[i]
    const score = entry?.totalScore ?? 0
    return { label, score }
  })
})
</script>

<template>
  <div class="card">
    <div class="title">HISTORIKK (SISTE 7 DAGER)</div>

    <div class="chart">
      <div v-for="d in days" :key="d.label" class="col">
        <div class="barWrap">
          <div class="bar" :style="{ height: Math.max(8, d.score) + 'px' }"></div>
        </div>
        <div class="lbl">{{ d.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 28px;
  padding: 18px;
  box-shadow: 0 12px 36px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
}

.title {
  font-weight: 900;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: rgba(17, 24, 39, 0.45);
  margin-bottom: 14px;
}

.chart {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  align-items: end;
  min-height: 160px;
  padding: 10px 6px 0;
  border-radius: 18px;
  background: rgba(17, 24, 39, 0.02);
}

.col {
  display: grid;
  gap: 10px;
  justify-items: center;
}

.barWrap {
  width: 18px;
  height: 120px;
  display: flex;
  align-items: end;
}

.bar {
  width: 100%;
  border-radius: 999px;
  background: #0b0f17;
}

.lbl {
  font-weight: 800;
  font-size: 13px;
  color: rgba(17, 24, 39, 0.35);
}
</style>