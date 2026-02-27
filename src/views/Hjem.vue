<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"

import { useMinHelseStore } from "@/stores/minHelseStore"

import HealthScoreCard from "@/components/Hjem/HealthScoreCard.vue"
import BoostMomentCard from "@/components/Hjem/BoostMomentCard.vue"
import KomIGangMentaltCard from "@/components/Hjem/KomIGangMentaltCard.vue"
import DagensInnsiktCard from "@/components/Hjem/DagensInnsiktCard.vue"

const router = useRouter()
const minHelse = useMinHelseStore()

onMounted(() => {
  // Viktig: ellers er entriesByDate tom når Hjem laster første gang
  minHelse.hydrateFromLocalStorage()
})

const PATHS = {
  minHelse: "/min-helse",
  boostMoment: "/movin/boost-moment",
  komIGangMentalt: "/movin/kom-i-gang",
  knowZone: "/movin/knowzone",
}

function go(path: string) {
  router.push(path)
}

// "YYYY-MM" for inneværende måned (samme som monthStatus-getteren bruker)
const month = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
})

/**
 * trackedMap: "YYYY-MM-DD" -> true/false
 * Vi bruker monthStatus-getteren din (tracked = !!entriesByDate[date])
 */
const trackedMap = computed<Record<string, boolean>>(() => {
  const out: Record<string, boolean> = {}
  for (const d of minHelse.monthStatus) {
    out[d.date] = d.tracked
  }
  return out
})

/**
 * Score i midten:
 * - V1: bruk latestScore (siste lagrede dag)
 * - Alternativ: minHelse.todayEntry?.totalScore ?? minHelse.latestScore
 */
const score = computed(() => minHelse.latestScore)
</script>

<template>
  <div class="hjem">
    <header class="top">
      <div>
        <h1 class="hello">Hei, Ola Nordmann</h1>
        <p class="sub">Klar for en ny dag?</p>
      </div>

      <button class="bell" type="button" aria-label="Varsler">
        <span class="bell-icon" aria-hidden="true"></span>
        <span class="badge" aria-hidden="true"></span>
      </button>
    </header>

    <!-- Spirometer: måned + trackedMap kommer fra MinHelse store -->
    <HealthScoreCard
      :score="score"
      :month="month"
      :trackedMap="trackedMap"
      @open="go(PATHS.minHelse)"
    />

    <section class="grid-two" aria-label="Snarveier">
      <BoostMomentCard @open="go(PATHS.boostMoment)" />
      <KomIGangMentaltCard @open="go(PATHS.komIGangMentalt)" />
    </section>

    <DagensInnsiktCard @open="go(PATHS.knowZone)" />
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