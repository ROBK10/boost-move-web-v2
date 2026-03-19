<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { getTodayCheckIn, saveCheckIn, type DailyCheckIn } from "@/services/minhelseApi"
import { useMinHelseStore } from "@/stores/minHelseStore"
import { useBoostStore } from "@/stores/boostStore"
import { useAuthStore } from "@/stores/authStore"
import HealthScoreCard from "@/components/Hjem/HealthScoreCard.vue"
import { getStreakMessage } from "@/data/healthTips"
import { pickFact } from "@/data/healthFacts"
import { estimateDailyMinutes, weeklyMinutesFromCheckins, personalSavings } from "@/utils/personalHealthSavings"
import { generateWeeklyInsights } from "@/utils/weeklyInsights"

const minHelseStore = useMinHelseStore()
const boostStore = useBoostStore()
const auth = useAuthStore()

const isLoading = ref(false)
const error = ref<string | null>(null)
const todayCheckin = ref<DailyCheckIn | null>(null)
const isEditing = ref(false)

// Minutt-input
const selectedMinutes = ref<number | null>(null)
const customMinutes = ref("")
const showSuccess = ref(false)
const factText = ref("")

const QUICK_OPTIONS = [0, 10, 20, 30, 45, 60, 90]

const goal = computed(() => auth.user?.weeklyGoal ?? 150)
const hasCheckedInToday = computed(() => !!todayCheckin.value && !isEditing.value)

const month = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
})

// Minutt-map for ringen — samme beregning som Hjem
const minutesMap = computed(() => {
  const map: Record<string, number> = {}
  for (const c of minHelseStore.monthCheckins) {
    const d = new Date(c.date).toISOString().slice(0, 10)
    map[d] = estimateDailyMinutes(c as any)
  }
  return map
})

const recentCheckins = computed(() => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return minHelseStore.monthCheckins.filter(c => new Date(c.date) >= weekAgo)
})

const weeklyMinutes = computed(() =>
  weeklyMinutesFromCheckins(recentCheckins.value as any[], boostStore.monthTotal)
)

const savings = computed(() =>
  personalSavings(minHelseStore.monthCheckins as any[], boostStore.monthTotal, goal.value)
)

const insights = computed(() =>
  generateWeeklyInsights(recentCheckins.value as any[])
)

const nok = new Intl.NumberFormat("nb-NO", { style: "decimal", maximumFractionDigits: 0 })
const streakMessage = computed(() => getStreakMessage(minHelseStore.streak))

// Computed: minutt-verdi (fra knapp eller input)
const minuteValue = computed(() => {
  if (selectedMinutes.value !== null) return selectedMinutes.value
  const parsed = parseInt(customMinutes.value)
  return !isNaN(parsed) && parsed >= 0 ? parsed : null
})

// ── Actions ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadToday()
})

async function loadToday() {
  isLoading.value = true
  error.value = null
  try {
    await minHelseStore.fetchMonthCheckins(minHelseStore.monthKey).catch(() => {})
    await boostStore.fetchMonthBoosts(boostStore.monthKey).catch(() => {})
    const res = await getTodayCheckIn()
    todayCheckin.value = res.checkin
    isEditing.value = false
    if (res.checkin) minHelseStore.latestScore = res.checkin.capacityScore
  } catch (e: any) {
    error.value = e?.message || "Kunne ikke hente dagens innsjekk"
  } finally {
    isLoading.value = false
  }
}

function selectQuick(mins: number) {
  selectedMinutes.value = mins
  customMinutes.value = ""
}

function onCustomInput() {
  selectedMinutes.value = null
}

async function submit() {
  if (minuteValue.value === null) return
  isLoading.value = true
  error.value = null
  try {
    // Lagre minutter i movement-feltet, resten med nøytrale defaults
    const mins = Math.min(minuteValue.value, 300)
    const res = await saveCheckIn({
      movement: String(mins),
      body: "noen",
      energy: "7_8",
      context: "3_4",
      mental: "middels",
    })
    todayCheckin.value = res.checkin
    isEditing.value = false
    minHelseStore.latestScore = res.checkin.capacityScore
    minHelseStore.fetchMonthCheckins(minHelseStore.monthKey).catch(() => {})

    // Generer fakta basert på minutter
    const movementLevel = mins === 0 ? "ingen" : mins <= 15 ? "lett" : mins <= 40 ? "moderat" : "aktiv"
    factText.value = pickFact({
      movement: movementLevel,
      body: "noen",
      energy: "7_8",
      context: "3_4",
      mental: "middels",
    })
    showSuccess.value = true
  } catch (e: any) {
    error.value = e?.message || "Kunne ikke lagre innsjekk"
  } finally {
    isLoading.value = false
  }
}

function editToday() {
  if (todayCheckin.value) {
    const mins = parseInt(todayCheckin.value.movement) || 0
    if (QUICK_OPTIONS.includes(mins)) {
      selectedMinutes.value = mins
      customMinutes.value = ""
    } else {
      selectedMinutes.value = null
      customMinutes.value = String(mins)
    }
  }
  isEditing.value = true
  showSuccess.value = false
}

function closeSuccess() { showSuccess.value = false }
</script>

<template>
  <div class="wrap">
    <header class="top">
      <div>
        <h1 class="title">Min helse</h1>
        <p class="sub">Logg bevegelsen din</p>
      </div>
    </header>

    <!-- Suksess-modal -->
    <Transition name="modal">
      <div v-if="showSuccess" class="modal-overlay" role="dialog" aria-modal="true">
        <div class="modal-card">
          <div class="streak-badge">Dag {{ minHelseStore.streak }}</div>
          <p class="streak-msg">{{ streakMessage }}</p>

          <div class="modal-divider"></div>

          <div class="logged-mins">{{ minuteValue }} min logget</div>

          <div v-if="factText" class="fact-box">
            <p class="fact-text">{{ factText }}</p>
          </div>

          <div class="modal-actions">
            <button class="btn modal-ja" type="button" @click="closeSuccess">Lukk</button>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="isLoading && !todayCheckin" class="card"><p class="muted">Laster…</p></div>
    <div v-else-if="error && !todayCheckin" class="card">
      <p class="error">{{ error }}</p>
      <button class="btn secondary" type="button" @click="loadToday">Prøv igjen</button>
    </div>

    <!-- ✅ Resultatvisning -->
    <template v-else-if="hasCheckedInToday">
      <HealthScoreCard
        :weeklyMinutes="weeklyMinutes"
        :weeklyTarget="goal"
        :month="month"
        :minutesMap="minutesMap"
        @open="editToday"
      />

      <section class="kpi-row">
        <div class="kpi">
          <span class="kpi-badge" :class="savings.todayLevel">{{ savings.todayLabel }}</span>
          <div class="kpi-label">I dag</div>
        </div>
        <div class="kpi">
          <div class="kpi-value kpi-kr">{{ nok.format(savings.totalSavings) }} kr</div>
          <div class="kpi-label">Total helsegevinst</div>
        </div>
        <div class="kpi">
          <div class="kpi-value">{{ minHelseStore.streak }}</div>
          <div class="kpi-label">Streak</div>
        </div>
      </section>

      <section v-if="insights.weakest" class="card insight-card">
        <div class="insight-head">UKENS INNSIKT</div>
        <p class="insight-text">{{ insights.weakest.message }}</p>
      </section>

      <section class="card">
        <div class="row">
          <div class="label">I dag</div>
          <div class="value">{{ parseInt(todayCheckin.movement) || 0 }} min</div>
        </div>
        <div class="row">
          <div class="label">Denne uken</div>
          <div class="value">{{ weeklyMinutes }} / {{ goal }} min</div>
        </div>
      </section>

      <button class="btn secondary" type="button" @click="editToday">Endre innsjekk</button>
    </template>

    <!-- ✅ Minutt-logging -->
    <template v-else>
      <section class="card">
        <div class="wizardTop">
          <div class="pill">Daglig innsjekk</div>
          <div class="week-progress">{{ weeklyMinutes }} / {{ goal }} min</div>
        </div>

        <h2 class="q">Hvor mye bevegde du deg i dag?</h2>

        <div class="quick-grid">
          <button
            v-for="mins in QUICK_OPTIONS"
            :key="mins"
            class="quick-btn"
            :class="{ active: selectedMinutes === mins }"
            @click="selectQuick(mins)"
          >
            {{ mins === 0 ? '0' : mins }} min
          </button>
        </div>

        <div class="custom-row">
          <span class="custom-label">Eller skriv inn:</span>
          <input
            v-model="customMinutes"
            type="number"
            min="0"
            max="300"
            placeholder="min"
            class="custom-input"
            @input="onCustomInput"
          />
        </div>

        <button
          class="btn submit-btn"
          type="button"
          :disabled="minuteValue === null || isLoading"
          @click="submit"
        >
          {{ isLoading ? 'Lagrer…' : 'Lagre' }}
        </button>

        <p v-if="error" class="error" style="margin-top: 12px">{{ error }}</p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.wrap { max-width: 520px; margin: 0 auto; padding: 18px 16px 24px; display: flex; flex-direction: column; gap: 14px; }
.top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.title { margin: 0; font-size: 28px; line-height: 1.1; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF; }
.sub { margin: 6px 0 0; font-size: 14px; font-weight: 600; color: rgba(209,231,229,0.6); }
.card { background: #023238; border-radius: 18px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.wizardTop { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.pill { font-size: 12px; font-weight: 900; background: rgba(209,231,229,0.06); padding: 6px 10px; border-radius: 999px; color: #D1E7E5; }
.week-progress { font-size: 13px; font-weight: 800; color: #BEF201; }
.q { margin: 6px 0 16px; font-size: 20px; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF; }

/* Quick-select grid */
.quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.quick-btn {
  height: 48px; border-radius: 14px;
  border: 2px solid rgba(209,231,229,0.1); background: #034044;
  font-size: 15px; font-weight: 900; color: #D1E7E5;
  cursor: pointer; transition: all 0.15s;
}
.quick-btn:active { transform: translateY(1px); }
.quick-btn.active {
  background: rgba(190,242,1,0.12);
  border-color: #BEF201;
  color: #FFFFFF;
}

/* Custom input */
.custom-row {
  display: flex; align-items: center; gap: 12px;
  margin-top: 16px; padding: 0 2px;
}
.custom-label { font-size: 14px; font-weight: 700; color: rgba(209,231,229,0.6); white-space: nowrap; }
.custom-input {
  flex: 1; height: 44px; border-radius: 12px;
  border: 2px solid rgba(209,231,229,0.1); background: #034044;
  padding: 0 14px; font-size: 16px; font-weight: 800; color: #D1E7E5;
  outline: none; max-width: 100px;
}
.custom-input::placeholder { color: rgba(209,231,229,0.3); }
.custom-input:focus { border-color: rgba(190,242,1,0.5); }

/* Submit */
.submit-btn { margin-top: 16px; width: 100%; }

.error { margin: 0; color: #dc2626; font-weight: 800; font-size: 13px; }
.btn { height: 46px; border: none; border-radius: 14px; font-size: 15px; font-weight: 900; cursor: pointer; background: #BEF201; color: #023238; }
.btn.secondary { background: rgba(209,231,229,0.06); color: #D1E7E5; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* KPI ROW */
.kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.kpi { background: #023238; border-radius: 20px; padding: 14px 8px 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.25); border: 1px solid rgba(209,231,229,0.08); display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
.kpi-value { font-size: 20px; font-weight: 900; color: #FFFFFF; }
.kpi-kr { font-size: 16px; color: #BEF201; }
.kpi-label { font-size: 10px; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(209,231,229,0.35); }
.kpi-badge { font-size: 11px; font-weight: 900; padding: 5px 10px; border-radius: 999px; }
.kpi-badge.inactive { background: rgba(239,68,68,0.1); color: rgba(239,68,68,0.85); }
.kpi-badge.partial { background: rgba(245,158,11,0.1); color: rgba(245,158,11,0.85); }
.kpi-badge.active { background: rgba(16,185,129,0.1); color: rgba(16,185,129,0.95); }
.kpi-badge.extra { background: rgba(190,242,1,0.12); color: #FFFFFF; }

/* INSIGHT CARD */
.insight-card { border-left: 4px solid #BEF201; }
.insight-head { font-size: 11px; font-weight: 900; letter-spacing: 0.1em; color: rgba(209,231,229,0.6); margin-bottom: 8px; }
.insight-text { margin: 0; font-size: 15px; font-weight: 800; color: #FFFFFF; line-height: 1.45; }

/* RESULT ROWS */
.row { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(209,231,229,0.08); }
.row:last-child { border-bottom: none; }
.label { font-size: 13px; font-weight: 900; color: rgba(209,231,229,0.6); }
.value { font-size: 13px; font-weight: 900; color: rgba(209,231,229,0.95); text-align: right; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; z-index: 150; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; padding: 24px; }
.modal-card { background: #023238; border-radius: 24px; padding: 28px 24px 24px; width: 100%; max-width: 360px; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.4); }
.streak-badge { font-size: 14px; font-weight: 900; color: #FFFFFF; background: rgba(190,242,1,0.15); padding: 6px 14px; border-radius: 999px; }
.streak-msg { margin: 8px 0 0; font-size: 15px; font-weight: 800; color: #D1E7E5; }
.modal-divider { width: 40px; height: 2px; background: rgba(209,231,229,0.08); margin: 14px 0; }
.logged-mins { font-size: 28px; font-weight: 900; color: #FFFFFF; margin-bottom: 12px; }
.fact-box { background: rgba(190,242,1,0.08); border-radius: 12px; padding: 10px 14px; margin-bottom: 16px; width: 100%; }
.fact-text { margin: 0; font-size: 13px; font-weight: 700; color: #D1E7E5; line-height: 1.4; }
.modal-actions { display: flex; gap: 10px; width: 100%; }
.modal-ja { flex: 1; }

.modal-enter-active { transition: opacity 180ms ease, transform 220ms cubic-bezier(0.22,1,0.36,1); }
.modal-leave-active { transition: opacity 140ms ease, transform 140ms ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>
