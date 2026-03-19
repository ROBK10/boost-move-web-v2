<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useRouter } from "vue-router"
import { apiFetch } from "@/services/api"

const router = useRouter()
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001"

interface InBodyScan {
  id: string
  scanDate: string
  imageUrl: string | null
  weight: number | null
  bodyFatPct: number | null
  muscleMass: number | null
  bmi: number | null
  bodyWater: number | null
  visceralFat: number | null
  basalMetab: number | null
  notes: string | null
}

const scans = ref<InBodyScan[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const latest = computed(() => scans.value[0] ?? null)
const history = computed(() => scans.value.slice(1))

onMounted(async () => {
  try {
    const res = await apiFetch("/user/inbody")
    scans.value = res.scans
  } catch (e: any) {
    error.value = e?.message || "Kunne ikke hente data"
  } finally {
    isLoading.value = false
  }
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" })
}

function imageFullUrl(url: string) {
  if (url.startsWith("http")) return url
  return `${API_BASE}${url}`
}

async function deleteScan(id: string) {
  if (!confirm("Slette denne kroppsanalysen?")) return
  try {
    await apiFetch(`/user/inbody/${id}`, { method: "DELETE" })
    scans.value = scans.value.filter(s => s.id !== id)
  } catch (e: any) {
    alert(e?.message || "Kunne ikke slette")
  }
}
</script>

<template>
  <div class="wrap">
    <header class="top">
      <button class="back-btn" @click="router.push('/min-helse')" aria-label="Tilbake">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <h1 class="title">Kroppsanalyse</h1>
    </header>

    <div v-if="isLoading" class="card"><p class="muted">Laster...</p></div>
    <div v-else-if="error" class="card"><p class="error">{{ error }}</p></div>

    <!-- No scans -->
    <template v-else-if="!latest">
      <div class="card empty-card">
        <p class="muted">Ingen kroppsanalyser ennå</p>
        <button class="btn primary" @click="router.push('/inbody/ny')">Legg til din første</button>
      </div>
    </template>

    <!-- Latest scan -->
    <template v-else>
      <!-- Image -->
      <div v-if="latest.imageUrl" class="card img-card">
        <img :src="imageFullUrl(latest.imageUrl)" alt="InBody skanning" class="scan-img" />
      </div>

      <!-- Date + delete -->
      <div class="card scan-header">
        <div>
          <div class="scan-date">{{ formatDate(latest.scanDate) }}</div>
          <div v-if="latest.notes" class="scan-notes">{{ latest.notes }}</div>
        </div>
        <button class="delete-btn" @click="deleteScan(latest.id)" title="Slett">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
        </button>
      </div>

      <!-- Metrics grid -->
      <section class="card">
        <h2 class="section-title">Verdier</h2>
        <div class="metrics-grid">
          <div v-if="latest.weight != null" class="metric">
            <div class="metric-val">{{ latest.weight }}</div>
            <div class="metric-label">Vekt (kg)</div>
          </div>
          <div v-if="latest.bodyFatPct != null" class="metric">
            <div class="metric-val">{{ latest.bodyFatPct }}%</div>
            <div class="metric-label">Fettprosent</div>
          </div>
          <div v-if="latest.muscleMass != null" class="metric">
            <div class="metric-val">{{ latest.muscleMass }}</div>
            <div class="metric-label">Muskelmasse (kg)</div>
          </div>
          <div v-if="latest.bmi != null" class="metric">
            <div class="metric-val">{{ latest.bmi }}</div>
            <div class="metric-label">BMI</div>
          </div>
          <div v-if="latest.bodyWater != null" class="metric">
            <div class="metric-val">{{ latest.bodyWater }}%</div>
            <div class="metric-label">Kroppsvann</div>
          </div>
          <div v-if="latest.visceralFat != null" class="metric">
            <div class="metric-val">{{ latest.visceralFat }}</div>
            <div class="metric-label">Visceralt fett</div>
          </div>
          <div v-if="latest.basalMetab != null" class="metric">
            <div class="metric-val">{{ latest.basalMetab }}</div>
            <div class="metric-label">Basalmetabolisme (kcal)</div>
          </div>
        </div>
      </section>

      <!-- History -->
      <section v-if="history.length" class="card">
        <h2 class="section-title">Historikk</h2>
        <div v-for="scan in history" :key="scan.id" class="history-row">
          <div class="history-date">{{ formatDate(scan.scanDate) }}</div>
          <div class="history-vals">
            <span v-if="scan.weight != null">{{ scan.weight }} kg</span>
            <span v-if="scan.bodyFatPct != null">{{ scan.bodyFatPct }}%</span>
            <span v-if="scan.muscleMass != null">{{ scan.muscleMass }} kg mm</span>
            <span v-if="scan.bmi != null">BMI {{ scan.bmi }}</span>
          </div>
          <button class="delete-sm" @click="deleteScan(scan.id)" title="Slett">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
          </button>
        </div>
      </section>

      <button class="btn primary" @click="router.push('/inbody/ny')">Legg til ny</button>
    </template>
  </div>
</template>

<style scoped>
.wrap { max-width: 520px; margin: 0 auto; padding: 18px 16px 24px; display: flex; flex-direction: column; gap: 14px; }
.top { display: flex; align-items: center; gap: 12px; }
.back-btn { background: none; border: none; color: #D1E7E5; cursor: pointer; padding: 4px; }
.title { margin: 0; font-size: 24px; font-weight: 900; color: #FFFFFF; }
.card { background: #023238; border-radius: 18px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.muted { margin: 0; color: rgba(209,231,229,0.35); font-weight: 700; font-size: 14px; }
.error { margin: 0; color: #dc2626; font-weight: 800; font-size: 13px; }
.section-title { margin: 0 0 12px; font-size: 16px; font-weight: 900; color: #FFFFFF; }

.empty-card { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 28px 16px; }

.img-card { padding: 0; overflow: hidden; }
.scan-img { width: 100%; max-height: 400px; object-fit: contain; display: block; }

.scan-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.scan-date { font-size: 15px; font-weight: 900; color: #FFFFFF; }
.scan-notes { font-size: 13px; font-weight: 600; color: rgba(209,231,229,0.6); margin-top: 4px; }
.delete-btn { background: none; border: none; color: rgba(239,68,68,0.7); cursor: pointer; padding: 4px; }
.delete-btn:hover { color: #ef4444; }

.metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.metric { background: #034044; border-radius: 14px; padding: 14px 12px; border: 1px solid rgba(209,231,229,0.08); }
.metric-val { font-size: 22px; font-weight: 900; color: #FFFFFF; }
.metric-label { font-size: 11px; font-weight: 900; color: rgba(209,231,229,0.35); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }

.history-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 0; border-bottom: 1px solid rgba(209,231,229,0.08);
}
.history-row:last-child { border-bottom: none; }
.history-date { font-size: 13px; font-weight: 900; color: rgba(209,231,229,0.6); min-width: 80px; }
.history-vals { flex: 1; display: flex; flex-wrap: wrap; gap: 6px; }
.history-vals span { font-size: 12px; font-weight: 800; color: #D1E7E5; background: rgba(209,231,229,0.06); padding: 3px 8px; border-radius: 8px; }
.delete-sm { background: none; border: none; color: rgba(239,68,68,0.5); cursor: pointer; padding: 4px; }
.delete-sm:hover { color: #ef4444; }

.btn { height: 48px; border: none; border-radius: 14px; font-size: 15px; font-weight: 900; cursor: pointer; width: 100%; }
.btn.primary { background: #BEF201; color: #023238; }
</style>
