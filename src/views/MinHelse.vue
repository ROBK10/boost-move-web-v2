<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { getTodayCheckIn, saveCheckIn, type DailyCheckIn, type DailyCheckInInput } from "@/services/minhelseApi"
import HealthScoreCard from "@/components/Hjem/HealthScoreCard.vue"

type Step = 1 | 2 | 3 | 4
type CapacityBand = "low" | "mid" | "high"

const router = useRouter()

const isLoading = ref(false)
const error = ref<string | null>(null)

const todayCheckin = ref<DailyCheckIn | null>(null)

const step = ref<Step>(1)
const form = ref<DailyCheckInInput>({
  context: "kontor",
  body: "ok",
  energy: "stabil",
  movement: "litt",
})

const hasCheckedInToday = computed(() => !!todayCheckin.value)
const showSuggestion = ref(true)

const month = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
})

// V1: vi har ikke månedskalender fra DB ennå, så vi sender tomt kart
const trackedMap = computed<Record<string, boolean>>(() => ({}))

const capacityBand = computed<CapacityBand>(() => {
  const score = todayCheckin.value?.capacityScore
  if (typeof score !== "number") return "mid"
  if (score < 55) return "low"
  if (score < 75) return "mid"
  return "high"
})

const capacityLabel = computed(() => {
  if (capacityBand.value === "low") return "Lav kapasitet"
  if (capacityBand.value === "high") return "Høy kapasitet"
  return "Stabil kapasitet"
})

const capacityPercent = computed(() => {
  const score = todayCheckin.value?.capacityScore
  if (typeof score !== "number") return 0
  return Math.max(0, Math.min(100, score))
})

const suggestion = computed(() => {
  const ctx = (todayCheckin.value?.context || form.value.context) as DailyCheckInInput["context"]
  const band = capacityBand.value

  const base = {
    low: [
      {
        title: "En liten reset (helt lav terskel)",
        text: "Hvis du vil: hent litt vann + ta 3 rolige pust. Senk skuldrene og slipp kjeven.",
      },
      {
        title: "Rask “kropp på”",
        text: "Hvis du vil: rull skuldrene rolig i 20 sek. Pust ut litt lengre enn du puster inn.",
      },
    ],
    mid: [
      {
        title: "Lite løft – uten prestasjon",
        text: "Hvis du vil: hent litt vann og stå opp i 30 sek. Rull skuldre/nakke rolig.",
      },
      {
        title: "Stabilt nivå – hold det enkelt",
        text: "Hvis du vil: 30 sek “shake out” (rist løs armer/ben) + en rolig utpust.",
      },
    ],
    high: [
      {
        title: "Du er i flyt – hold det gående",
        text: "Hvis du vil: vann + 30 sek lett mobilitet (skuldre/hofte). Små grep, stor effekt.",
      },
      {
        title: "Bra kapasitet i dag",
        text: "Hvis du vil: 60 sek fokus-reset: pust rolig og bestem ett lite neste steg for dagen.",
      },
    ],
  } as const

  const ctxHint =
    ctx === "kontor"
      ? "Passer fint mellom møter."
      : ctx === "felt"
      ? "Passer uansett hvor du står."
      : ctx === "pa_farten"
      ? "Kan gjøres hvor som helst."
      : ctx === "trening"
      ? "Fin som oppvarming/etter trening."
      : "Rolig og enkelt hjemme også."

  const pick = base[band][0]

  return {
    title: pick.title,
    text: pick.text,
    hint: ctxHint,
    ctaLabel:
      band === "low"
        ? "Ta en rolig Boost"
        : band === "high"
          ? "Boost og hold flyten"
          : "Gi dagen et lite løft",
    ctaPath: "/movin/boost-moment",
  }
})

onMounted(async () => {
  await loadToday()
})

async function loadToday() {
  isLoading.value = true
  error.value = null
  try {
    const res = await getTodayCheckIn()
    todayCheckin.value = res.checkin
    showSuggestion.value = true
  } catch (e: any) {
    error.value = e?.message || "Kunne ikke hente dagens innsjekk"
  } finally {
    isLoading.value = false
  }
}

function startCheckIn() {
  error.value = null
  step.value = 1
  showSuggestion.value = true
}

function setContext(v: DailyCheckInInput["context"]) {
  form.value.context = v
  step.value = 2
}

function setBody(v: DailyCheckInInput["body"]) {
  form.value.body = v
  step.value = 3
}

function setEnergy(v: DailyCheckInInput["energy"]) {
  form.value.energy = v
  step.value = 4
}

async function setMovementAndSubmit(v: DailyCheckInInput["movement"]) {
  form.value.movement = v
  await submit()
}

async function submit() {
  isLoading.value = true
  error.value = null
  try {
    const res = await saveCheckIn(form.value)
    todayCheckin.value = res.checkin
    showSuggestion.value = true
  } catch (e: any) {
    error.value = e?.message || "Kunne ikke lagre innsjekk"
  } finally {
    isLoading.value = false
  }
}

function editToday() {
  if (todayCheckin.value) {
    form.value = {
      context: todayCheckin.value.context,
      body: todayCheckin.value.body,
      energy: todayCheckin.value.energy,
      movement: todayCheckin.value.movement,
    }
  }
  startCheckIn()
}

function goBoost() {
  router.push(suggestion.value.ctaPath)
}
</script>

<template>
  <div class="wrap">
    <header class="top">
      <div>
        <h1 class="title">Min helse</h1>
        <p class="sub">En liten innsjekk – lav terskel.</p>
      </div>
    </header>

    <div v-if="isLoading" class="card">
      <p class="muted">Laster…</p>
    </div>

    <div v-else-if="error" class="card">
      <p class="error">{{ error }}</p>
      <button class="btn secondary" type="button" @click="loadToday">Prøv igjen</button>
    </div>

    <!-- ✅ Resultatvisning hvis innsjekk finnes -->
    <template v-else-if="hasCheckedInToday">
      <HealthScoreCard
        :score="capacityPercent"
        :month="month"
        :trackedMap="trackedMap"
        @open="editToday"
      />

      <!-- ✅ Soft forslag -->
      <section v-if="showSuggestion" class="card">
        <div>
          <div class="suggestTitle">{{ suggestion.title }}</div>
          <div class="suggestText">{{ suggestion.text }}</div>
          <div class="suggestHint">{{ suggestion.hint }}</div>
        </div>

        <div class="suggestActions">
          <button class="btn" type="button" @click="goBoost">
            {{ suggestion.ctaLabel }}
          </button>
          <button class="link" type="button" @click="showSuggestion = false">
            Ikke nå
          </button>
        </div>
      </section>

      <section class="card">
        <div class="row">
          <div class="label">Kapasitet</div>
          <div class="value">{{ capacityLabel }}</div>
        </div>
        <div class="row">
          <div class="label">Hvor er du nå?</div>
          <div class="value">{{ todayCheckin.context }}</div>
        </div>
        <div class="row">
          <div class="label">Kropp</div>
          <div class="value">{{ todayCheckin.body }}</div>
        </div>
        <div class="row">
          <div class="label">Energi</div>
          <div class="value">{{ todayCheckin.energy }}</div>
        </div>
        <div class="row">
          <div class="label">Bevegelse</div>
          <div class="value">{{ todayCheckin.movement }}</div>
        </div>
      </section>

      <button class="btn secondary" type="button" @click="editToday">
        Endre innsjekk
      </button>
    </template>

    <!-- ✅ Wizard hvis ingen innsjekk i dag -->
    <template v-else>
      <section class="card">
        <div class="wizardTop">
          <div class="pill">Daglig innsjekk</div>
          <div class="step">Steg {{ step }} / 4</div>
        </div>

        <div v-if="step === 1">
          <h2 class="q">Hvor er du nå?</h2>
          <div class="grid">
            <button class="opt" @click="setContext('kontor')">På kontoret</button>
            <button class="opt" @click="setContext('felt')">Ute i felt</button>
            <button class="opt" @click="setContext('hjemme')">Hjemme</button>
            <button class="opt" @click="setContext('trening')">På trening</button>
            <button class="opt" @click="setContext('pa_farten')">På farten</button>
          </div>
        </div>

        <div v-else-if="step === 2">
          <h2 class="q">Hvordan kjennes kroppen i dag?</h2>
          <div class="grid">
            <button class="opt" @click="setBody('lett')">Lett</button>
            <button class="opt" @click="setBody('ok')">Ok</button>
            <button class="opt" @click="setBody('tung')">Tung</button>
          </div>
          <button class="back" type="button" @click="step = 1">Tilbake</button>
        </div>

        <div v-else-if="step === 3">
          <h2 class="q">Hvordan er energien din nå?</h2>
          <div class="grid">
            <button class="opt" @click="setEnergy('på')">På</button>
            <button class="opt" @click="setEnergy('stabil')">Stabil</button>
            <button class="opt" @click="setEnergy('tom')">Tom</button>
          </div>
          <button class="back" type="button" @click="step = 2">Tilbake</button>
        </div>

        <div v-else>
          <h2 class="q">Har du fått beveget deg litt i dag?</h2>
          <div class="grid">
            <button class="opt" :disabled="isLoading" @click="setMovementAndSubmit('ja')">Ja</button>
            <button class="opt" :disabled="isLoading" @click="setMovementAndSubmit('litt')">Litt</button>
            <button class="opt" :disabled="isLoading" @click="setMovementAndSubmit('nei')">Ikke ennå</button>
          </div>
          <button class="back" type="button" @click="step = 3">Tilbake</button>
        </div>

        <p v-if="error" class="error" style="margin-top: 12px">{{ error }}</p>
      </section>

      <button class="btn secondary" type="button" @click="loadToday">
        Oppdater
      </button>
    </template>
  </div>
</template>

<style scoped>
.wrap {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #111827;
}

.sub {
  margin: 6px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.55);
}

.card {
  background: white;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
}

.wizardTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.pill {
  font-size: 12px;
  font-weight: 900;
  background: rgba(17, 24, 39, 0.06);
  padding: 6px 10px;
  border-radius: 999px;
  color: rgba(17, 24, 39, 0.8);
}

.step {
  font-size: 12px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.55);
}

.q {
  margin: 6px 0 12px;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #111827;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.opt {
  height: 48px;
  border-radius: 14px;
  border: 1px solid rgba(17, 24, 39, 0.10);
  background: #fff;
  font-size: 15px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.9);
  cursor: pointer;
  text-align: left;
  padding: 0 14px;
}

.opt:active {
  transform: translateY(1px);
}

.back {
  margin-top: 12px;
  border: none;
  background: transparent;
  color: rgba(17, 24, 39, 0.65);
  font-weight: 900;
  cursor: pointer;
}

.error {
  margin: 0;
  color: #dc2626;
  font-weight: 800;
  font-size: 13px;
}

.btn {
  height: 46px;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  background: #111827;
  color: white;
}

.btn.secondary {
  background: rgba(17, 24, 39, 0.06);
  color: #111827;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.link {
  border: none;
  background: transparent;
  font-weight: 900;
  cursor: pointer;
  color: rgba(17, 24, 39, 0.6);
}

/* Suggestion */
.suggestTitle {
  font-size: 16px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.95);
}

.suggestText {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.7);
  line-height: 1.35;
}

.suggestHint {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.5);
}

.suggestActions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);
}

.row:last-child {
  border-bottom: none;
}

.label {
  font-size: 13px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.55);
}

.value {
  font-size: 13px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.9);
  text-align: right;
}
</style>