<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"

import { useMinHelseStore } from "@/stores/minHelseStore"
import { useAuthStore } from "@/stores/authStore"
import { useBoostStore } from "@/stores/boostStore"
import { useTeamStore } from "@/stores/teamStore"

import { testHealth } from "@/services/testApi"

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

const score = computed(() => minHelse.latestScore)
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

  try {
    await boost.fetchMonthBoosts(boost.monthKey)
  } catch (err) {
    console.error("BOOST MONTH ERROR:", err)
  }

  try {
    await teamStore.fetchTeamStatus()
  } catch (err) {
    console.error("TEAM STATUS ERROR:", err)
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

    <DagensInnsiktCard @open="go(PATHS.knowZone)" />

    <TilbakemeldingCard orgId="demo-company" @submit="onFeedbackSubmit" />
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
</style>
