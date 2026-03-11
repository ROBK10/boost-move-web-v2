<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"

import { useMinHelseStore } from "@/stores/minHelseStore"
import { useAuthStore } from "@/stores/authStore"
import { useBoostStore } from "@/stores/boostStore"
import { useTeamStore } from "@/stores/teamStore"

import NotificationBell from "@/components/ui/NotificationBell.vue"
import HealthScoreCard from "@/components/Hjem/HealthScoreCard.vue"
import TeamStatusCard from "@/components/Hjem/TeamStatusCard.vue"
import BoostMomentCard from "@/components/Hjem/BoostMomentCard.vue"
import KomIGangMentaltCard from "@/components/Hjem/KomIGangMentaltCard.vue"
import DagensInnsiktCard from "@/components/Hjem/DagensInnsiktCard.vue"
import TilbakemeldingCard from "@/components/Hjem/TilbakemeldingCard.vue"

const router = useRouter()
const minHelse = useMinHelseStore()
const auth = useAuthStore()
const boost = useBoostStore()
const teamStore = useTeamStore()

const PATHS = {
  minHelse: "/min-helse",
  boostMoment: "/movin/boost-moment",
  komIGangMentalt: "/movin/kom-i-gang",
  knowZone: "/movin/knowzone",
  teamStatus: "/min-helse",
}

function go(path: string) {
  router.push(path)
}

const score = computed<number | null>(() => {
  if (minHelse.monthCheckins.length > 0) {
    const last = [...minHelse.monthCheckins].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
    return last.capacityScore
  }
  return minHelse.latestScore > 0 ? minHelse.latestScore : null
})
const userName = computed(() => auth.user?.name || "der")
const month = computed(() => minHelse.monthKey)

const boostMonthLabel = computed(() => {
  const [yyyy, mm] = boost.monthKey.split("-")
  const d = new Date(Number(yyyy), Number(mm) - 1, 1)
  return d.toLocaleString("nb-NO", { month: "long", year: "numeric" }).toUpperCase()
})
const boostTotal = computed(() => boost.monthTotal)

const trackedMap = computed(() => {
  const map: Record<string, boolean> = {}

  for (const c of minHelse.monthCheckins) {
    const d = new Date(c.date).toISOString().slice(0, 10)
    map[d] = true
  }

  return map
})

onMounted(async () => {
  await Promise.allSettled([
    minHelse.fetchMonthCheckins(minHelse.monthKey),
    boost.fetchMonthBoosts(boost.monthKey),
    teamStore.fetchTeamStatus(),
  ])
})

function onFeedbackSubmit(_payload: { month: string; selected: string[]; orgId?: string }) {
  // V1: feedback collected client-side; backend submission in V2
}

// Dagens Boost — roterer daglig blant de 3 raske øktene
const dagensBoostPrograms = [
  { id: "5min-rygg",     label: "5 minutter rygg",     emoji: "🔙" },
  { id: "5min-skuldre",  label: "5 minutter skuldre",   emoji: "💪" },
  { id: "5min-energi",   label: "5 minutter energi",    emoji: "⚡" },
]
const dagensBoost = computed(() => {
  const dayIndex = new Date().getDay() // 0–6
  return dagensBoostPrograms[dayIndex % dagensBoostPrograms.length]
})
</script>

<template>
  <div class="hjem">
    <header class="top">
      <div>
        <h1 class="hello">Hei, {{ userName }}</h1>
        <p class="sub">Klar for en ny dag?</p>
      </div>

      <NotificationBell />
    </header>

    <HealthScoreCard
      :score="score"
      :month="month"
      :trackedMap="trackedMap"
      @open="go(PATHS.minHelse)"
    />

    <TeamStatusCard
      :available="teamStore.available"
      :score="teamStore.avgScore"
      :trend="teamStore.trend"
      @open="go(PATHS.teamStatus)"
    />

    <section class="grid-two" aria-label="Snarveier">
      <BoostMomentCard :monthLabel="boostMonthLabel" :total="boostTotal" @open="go(PATHS.boostMoment)" />
      <KomIGangMentaltCard @open="go(PATHS.komIGangMentalt)" />
    </section>

    <!-- Dagens Boost -->
    <div class="boost-card" role="region" aria-label="Dagens Boost">
      <div class="boost-left">
        <span class="boost-eyebrow">Dagens Boost</span>
        <span class="boost-title">{{ dagensBoost.label }}</span>
      </div>
      <button
        class="boost-btn"
        type="button"
        @click="go(`/movin/programmer/${dagensBoost.id}`)"
        aria-label="`Start ${dagensBoost.label}`"
      >
        Start
      </button>
    </div>

    <DagensInnsiktCard @open="go(PATHS.knowZone)" />

    <TilbakemeldingCard :orgId="auth.user?.companyId" @submit="onFeedbackSubmit" />
  </div>
</template>

<style scoped>
.hjem {
  max-width: 520px;
  margin: 0 auto;
  padding: 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.top {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f9fafb;
  /* Extend background under notch on iPhone */
  margin: 0 -16px;
  padding: 20px 16px 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.hello {
  margin: 0;
  font-size: 34px;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.sub {
  margin: 6px 0 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.55);
}


.grid-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Dagens Boost card */
.boost-card {
  background: #0b0f17;
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 8px 24px rgba(11, 15, 23, 0.18);
}

.boost-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.boost-eyebrow {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}

.boost-title {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: white;
}

.boost-btn {
  height: 44px;
  padding: 0 22px;
  border: none;
  border-radius: 999px;
  background: rgba(185, 255, 0, 0.95);
  color: #0b0f17;
  font-size: 14px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 150ms ease;
}

.boost-btn:active {
  opacity: 0.80;
}
</style>
