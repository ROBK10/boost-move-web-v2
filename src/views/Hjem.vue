<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"

import { useMinHelseStore } from "@/stores/minHelseStore"
import { useAuthStore } from "@/stores/authStore"
import { useBoostStore } from "@/stores/boostStore"
import { apiFetch } from "@/services/api"
import { estimateDailyMinutes, weeklyMinutesFromCheckins } from "@/utils/personalHealthSavings"

import NotificationBell from "@/components/ui/NotificationBell.vue"
import HealthScoreCard from "@/components/Hjem/HealthScoreCard.vue"
import BoostMomentCard from "@/components/Hjem/BoostMomentCard.vue"
import KomIGangMentaltCard from "@/components/Hjem/KomIGangMentaltCard.vue"
import DagensInnsiktCard from "@/components/Hjem/DagensInnsiktCard.vue"
import TilbakemeldingCard from "@/components/Hjem/TilbakemeldingCard.vue"
import SmartOnboarding from "@/components/ui/SmartOnboarding.vue"

const router = useRouter()
const minHelse = useMinHelseStore()
const auth = useAuthStore()
const boost = useBoostStore()

const PATHS = {
  minHelse: "/min-helse",
  boostMoment: "/movin/boost-moment",
  minReise: "/movin",
  knowZone: "/movin/knowzone",
  helsekalkulator: "/helsekalkulator",
}

function go(path: string) { router.push(path) }

const userName = computed(() => auth.user?.name?.split(" ")[0] || "der")
const month = computed(() => minHelse.monthKey)

// Tidsbasert greeting
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return `God morgen, ${userName.value}`
  if (h < 17) return `Hei, ${userName.value}`
  return `God kveld, ${userName.value}`
})

// Har sjekket inn i dag?
const todayKey = computed(() => new Date().toISOString().slice(0, 10))
const hasCheckedInToday = computed(() =>
  minHelse.monthCheckins.some(c => new Date(c.date).toISOString().slice(0, 10) === todayKey.value)
)

const boostMonthLabel = computed(() => {
  const [yyyy, mm] = boost.monthKey.split("-")
  const d = new Date(Number(yyyy), Number(mm) - 1, 1)
  return d.toLocaleString("nb-NO", { month: "long", year: "numeric" }).toUpperCase()
})
const boostTotal = computed(() => boost.monthTotal)

const minutesMap = computed(() => {
  const map: Record<string, number> = {}
  for (const c of minHelse.monthCheckins) {
    map[new Date(c.date).toISOString().slice(0, 10)] = estimateDailyMinutes(c as any)
  }
  return map
})

const recentCheckins = computed(() => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return minHelse.monthCheckins.filter(c => new Date(c.date) >= weekAgo)
})

const weeklyMinutes = computed(() =>
  weeklyMinutesFromCheckins(recentCheckins.value as any[], boost.monthTotal)
)

const weeklyGoal = computed(() => auth.user?.weeklyGoal ?? 150)

// Smart onboarding trigger: 2+ innsjekker ELLER 1+ boost, OG ikke allerede kartlagt
const showSmartOnboarding = ref(false)
const smartOnboardingDismissed = ref(localStorage.getItem("bm-smart-onboarding-dismissed") === "true")

const shouldTriggerSmartOnboarding = computed(() => {
  if (smartOnboardingDismissed.value) return false
  if (auth.user?.healthChallenge || auth.user?.biggestStruggle) return false // allerede kartlagt
  const checkinCount = minHelse.monthCheckins.length
  const boostCount = boost.monthTotal
  return checkinCount >= 2 || boostCount >= 1
})

function onSmartOnboardingDone() {
  showSmartOnboarding.value = false
  smartOnboardingDismissed.value = true
  localStorage.setItem("bm-smart-onboarding-dismissed", "true")
}

function onSmartOnboardingLater() {
  showSmartOnboarding.value = false
  // Ikke sett dismissed — vis igjen neste gang
}

onMounted(async () => {
  await Promise.allSettled([
    minHelse.fetchMonthCheckins(minHelse.monthKey),
    boost.fetchMonthBoosts(boost.monthKey),
  ])
  // Trigger smart onboarding etter data er lastet
  if (shouldTriggerSmartOnboarding.value) {
    showSmartOnboarding.value = true
  }
})

async function onFeedbackSubmit(payload: { month: string; selected: string[]; orgId?: string; annetText?: string }) {
  try {
    await apiFetch("/wishes", {
      method: "POST",
      body: JSON.stringify({
        month: payload.month,
        selected: payload.selected,
        annetText: payload.annetText,
      }),
    })
  } catch { /* non-critical */ }
}
</script>

<template>
  <div class="hjem">
    <!-- Smart onboarding (dag 2-3) -->
    <SmartOnboarding
      v-if="showSmartOnboarding"
      @done="onSmartOnboardingDone"
      @later="onSmartOnboardingLater"
    />

    <header class="top">
      <div>
        <h1 class="hello">{{ greeting }}</h1>
        <p class="sub" v-if="hasCheckedInToday">Bra jobbet i dag!</p>
        <p class="sub" v-else>Klar for en ny dag?</p>
      </div>
      <NotificationBell />
    </header>

    <!-- IKKE sjekket inn: stor CTA -->
    <template v-if="!hasCheckedInToday">
      <button class="checkin-cta" @click="go(PATHS.minHelse)">
        <div class="cta-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m-8-8h16" stroke="#023238" stroke-width="2.5" stroke-linecap="round"/></svg>
        </div>
        <div>
          <div class="cta-title">Sjekk inn nå</div>
          <div class="cta-sub">{{ weeklyMinutes }} av {{ weeklyGoal }} min denne uken</div>
        </div>
      </button>

      <TilbakemeldingCard :orgId="auth.user?.companyId" @submit="onFeedbackSubmit" />

      <section class="grid-two">
        <BoostMomentCard :monthLabel="boostMonthLabel" :total="boostTotal" @open="go(PATHS.boostMoment)" />
        <KomIGangMentaltCard @open="go(PATHS.minReise)" />
      </section>
    </template>

    <!-- HAR sjekket inn: coach-visning -->
    <template v-else>
      <HealthScoreCard
        :weeklyMinutes="weeklyMinutes"
        :weeklyTarget="weeklyGoal"
        :month="month"
        :minutesMap="minutesMap"
        @open="go(PATHS.minHelse)"
      />

      <section class="grid-two">
        <BoostMomentCard :monthLabel="boostMonthLabel" :total="boostTotal" @open="go(PATHS.boostMoment)" />
        <KomIGangMentaltCard @open="go(PATHS.minReise)" />
      </section>

      <TilbakemeldingCard :orgId="auth.user?.companyId" @submit="onFeedbackSubmit" />

      <DagensInnsiktCard @open="go(PATHS.knowZone)" />
    </template>
  </div>
</template>

<style scoped>
.hjem {
  max-width: 520px; margin: 0 auto; padding: 0 16px 0;
  display: flex; flex-direction: column; gap: 14px;
}

.top {
  position: sticky; top: 0; z-index: 10; background: #021C20;
  margin: 0 -16px; padding: 20px 16px 12px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
}

.hello {
  margin: 0; font-size: 34px; line-height: 1.05;
  font-weight: 900; letter-spacing: -0.03em; color: #FFFFFF;
}

.sub {
  margin: 6px 0 0; font-size: 16px; font-weight: 600;
  color: rgba(209,231,229,0.6);
}

/* CTA-knapp for innsjekk */
.checkin-cta {
  display: flex; align-items: center; gap: 16px;
  width: 100%; padding: 20px; border: none; border-radius: 20px;
  background: #BEF201; color: #023238; cursor: pointer;
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  transition: transform 0.1s;
}
.checkin-cta:active { transform: scale(0.98); }
.cta-icon {
  width: 48px; height: 48px; border-radius: 14px;
  background: rgba(2,50,56,0.15);
  display: grid; place-items: center; flex-shrink: 0;
}
.cta-title { font-size: 18px; font-weight: 900; text-align: left; }
.cta-sub { font-size: 13px; font-weight: 600; opacity: 0.6; text-align: left; margin-top: 2px; }

.grid-two {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
}
</style>
