<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { apiFetch } from "@/services/api"

const emit = defineEmits<{
  openDetail: []
  openUpload: []
}>()

interface InBodyScan {
  id: string
  scanDate: string
  weight: number | null
  bodyFatPct: number | null
  muscleMass: number | null
  bmi: number | null
}

const latest = ref<InBodyScan | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await apiFetch("/user/inbody")
    if (res.scans?.length) latest.value = res.scans[0]
  } catch {
    // silently fail
  } finally {
    isLoading.value = false
  }
})

const hasData = computed(() => !!latest.value)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" })
}
</script>

<template>
  <div class="inbody-card" v-if="!isLoading">
    <div class="card-head">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span class="card-title">Kroppsanalyse</span>
    </div>

    <template v-if="hasData">
      <div class="scan-date">{{ formatDate(latest!.scanDate) }}</div>
      <div class="vals-grid">
        <div v-if="latest!.weight != null" class="val-item">
          <div class="val-num">{{ latest!.weight }}</div>
          <div class="val-unit">kg</div>
        </div>
        <div v-if="latest!.bodyFatPct != null" class="val-item">
          <div class="val-num">{{ latest!.bodyFatPct }}%</div>
          <div class="val-unit">fett</div>
        </div>
        <div v-if="latest!.muscleMass != null" class="val-item">
          <div class="val-num">{{ latest!.muscleMass }}</div>
          <div class="val-unit">muskel kg</div>
        </div>
        <div v-if="latest!.bmi != null" class="val-item">
          <div class="val-num">{{ latest!.bmi }}</div>
          <div class="val-unit">BMI</div>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-card secondary" @click="emit('openDetail')">Se detaljer</button>
        <button class="btn-card primary" @click="emit('openUpload')">Legg til ny</button>
      </div>
    </template>

    <template v-else>
      <p class="empty-text">Ingen kroppsanalyse ennå</p>
      <button class="btn-card primary full" @click="emit('openUpload')">Legg til</button>
    </template>
  </div>
</template>

<style scoped>
.inbody-card {
  background: #023238; border-radius: 18px; padding: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  border: 1px solid rgba(209,231,229,0.08);
}
.card-head { display: flex; align-items: center; gap: 8px; color: #BEF201; margin-bottom: 10px; }
.card-title { font-size: 14px; font-weight: 900; color: #FFFFFF; }
.scan-date { font-size: 12px; font-weight: 700; color: rgba(209,231,229,0.6); margin-bottom: 10px; }

.vals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
.val-item { text-align: center; background: #034044; border-radius: 12px; padding: 10px 4px; border: 1px solid rgba(209,231,229,0.08); }
.val-num { font-size: 16px; font-weight: 900; color: #FFFFFF; }
.val-unit { font-size: 10px; font-weight: 800; color: rgba(209,231,229,0.35); text-transform: uppercase; margin-top: 2px; }

.btn-row { display: flex; gap: 8px; }
.btn-card {
  flex: 1; height: 38px; border: none; border-radius: 12px;
  font-size: 13px; font-weight: 900; cursor: pointer;
}
.btn-card.primary { background: #BEF201; color: #023238; }
.btn-card.secondary { background: rgba(209,231,229,0.06); color: #D1E7E5; }
.btn-card.full { width: 100%; }

.empty-text { margin: 0 0 12px; font-size: 14px; font-weight: 700; color: rgba(209,231,229,0.35); }
</style>
