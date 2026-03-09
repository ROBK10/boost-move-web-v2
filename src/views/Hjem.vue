<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"

import { useMinHelseStore } from "@/stores/minHelseStore"
import { useAuthStore } from "@/stores/authStore"

import { testHealth } from "@/services/testApi"

import HealthScoreCard from "@/components/Hjem/HealthScoreCard.vue"
import TeamStatusCard from "@/components/Hjem/TeamStatusCard.vue"
import BoostMomentCard from "@/components/Hjem/BoostMomentCard.vue"
import KomIGangMentaltCard from "@/components/Hjem/KomIGangMentaltCard.vue"
import DagensInnsiktCard from "@/components/Hjem/DagensInnsiktCard.vue"
import TilbakemeldingCard from "@/components/Hjem/TilbakemeldingCard.vue"

const router = useRouter()
const minHelse = useMinHelseStore()
const auth = useAuthStore()

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

const score = computed(() => minHelse.latestScore)
const userName = computed(() => auth.user?.name || "der")
const month = computed(() => minHelse.monthKey)

const boostMonthLabel = computed(() => {
  const [yyyy, mm] = minHelse.monthKey.split("-")
  const d = new Date(Number(yyyy), Number(mm) - 1, 1)
  return d.toLocaleString("nb-NO", { month: "long", year: "numeric" }).toUpperCase()
})
const boostTotal = computed(() => minHelse.monthCheckins.length)

// Mock team data (V1 visuell prototype)
const teamScore = 72
const teamTrend = "stable" as const
const teamSleepTrend = "down" as const
const teamMovementTrend = "stable" as const
const teamEnergyTrend = "up" as const

const trackedMap = computed(() => {
  const map: Record<string, boolean> = {}

  for (const c of minHelse.monthCheckins) {
    const d = new Date(c.date).toISOString().slice(0, 10)
    map[d] = true
  }

  return map
})

onMounted(async () => {
  try {
    const res = await testHealth()
    console.log("HEALTH:", res)
  } catch (err) {
    console.error("HEALTH ERROR:", err)
  }

  try {
    await minHelse.fetchMonthCheckins(minHelse.monthKey)
  } catch (err) {
    console.error("MONTH CHECKINS ERROR:", err)
  }
})

function onFeedbackSubmit(payload: { month: string; selected: string[]; orgId?: string }) {
  console.log("feedback submit", payload)
}
</script>

<template>
  <div class="hjem">
    <header class="top">
      <div>
        <h1 class="hello">Hei, {{ userName }}</h1>
        <p class="sub">Klar for en ny dag?</p>
      </div>

      <button class="bell" type="button" aria-label="Varsler">
        <span class="bell-icon" aria-hidden="true"></span>
        <span class="badge" aria-hidden="true"></span>
      </button>
    </header>

    <HealthScoreCard
      :score="score"
      :month="month"
      :trackedMap="trackedMap"
      @open="go(PATHS.minHelse)"
    />

    <TeamStatusCard
      :score="teamScore"
      :trend="teamTrend"
      :sleepTrend="teamSleepTrend"
      :movementTrend="teamMovementTrend"
      :energyTrend="teamEnergyTrend"
      @open="go(PATHS.teamStatus)"
    />

    <section class="grid-two" aria-label="Snarveier">
      <BoostMomentCard :monthLabel="boostMonthLabel" :total="boostTotal" @open="go(PATHS.boostMoment)" />
      <KomIGangMentaltCard @open="go(PATHS.komIGangMentalt)" />
    </section>

    <DagensInnsiktCard @open="go(PATHS.knowZone)" />

    <TilbakemeldingCard orgId="demo-company" @submit="onFeedbackSubmit" />
  </div>
</template>

<style scoped>
.hjem {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.top {
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

.bell {
  position: relative;
  width: 44px;
  height: 44px;
  border: none;
  background: white;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer;
}

.bell-icon {
  display: block;
  width: 18px;
  height: 18px;
  margin: 0 auto;
  background: rgba(17, 24, 39, 0.85);
  border-radius: 6px;
  transform: rotate(10deg);
  opacity: 0.9;
}

.badge {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 7px;
  height: 7px;
  background: #ef4444;
  border-radius: 999px;
}

.grid-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
</style>