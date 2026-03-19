<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useBoostMomentStore } from "@/stores/BoostMomentStore"
import { useBoostStore } from "@/stores/boostStore"
import { useAuthStore } from "@/stores/authStore"
import { pickTip, pickMoodTip, type HealthTip, type Mood } from "@/data/healthTips"
import { microActions } from "@/data/microActions"

const router = useRouter()
const boostMomentStore = useBoostMomentStore()
const boostStore = useBoostStore()
const auth = useAuthStore()

const currentTip = ref<HealthTip | null>(null)

function pickAction(): HealthTip {
  // 50% sjanse for microAction, 50% for healthTip
  if (Math.random() < 0.5 && microActions.length > 0) {
    const text = microActions[Math.floor(Math.random() * microActions.length)]
    return { text, pillar: 'bevegelse', type: 'strekk', time: 'alltid' }
  }
  return pickTip({
    persona: {
      healthChallenge: auth.user?.healthChallenge,
      biggestStruggle: auth.user?.biggestStruggle,
    },
  })
}

onMounted(async () => {
  boostMomentStore.hydrate()
  currentTip.value = pickAction()
  try {
    await boostStore.fetchMonthBoosts(boostStore.monthKey)
  } catch { /* non-critical */ }
})

type Step = "mood" | "proud" | "action" | "done"

const step = ref<Step>("mood")
const moodTipText = ref("")
const proudChoice = ref("")

const monthTotal = computed(() => boostStore.monthTotal)

const PROUD_OPTIONS = [
  { key: "gatur", label: "Tok en gåtur" },
  { key: "sunt", label: "Valgte sunt" },
  { key: "sovn", label: "Fikk nok søvn" },
  { key: "pause", label: "Tok en pause" },
  { key: "strekk", label: "Strekte meg" },
  { key: "ingenting", label: "Ingenting spesielt — og det er ok" },
]

function goBack() { router.push("/movin") }

function setMood(mood: Mood) {
  moodTipText.value = pickMoodTip(mood)
  step.value = "proud"
}

function setProud(key: string) {
  proudChoice.value = key
  step.value = "action"
}

function handleComplete() {
  step.value = "done"
  boostMomentStore.completeBoostToday()
  const type = currentTip.value?.type ?? "pust"
  boostStore.completeBoost(type, 60).catch(() => {})
}

function refreshAction() {
  const prev = currentTip.value?.text
  let next = pickAction()
  // Unngå samme som forrige
  let attempts = 0
  while (next.text === prev && attempts < 5) {
    next = pickAction()
    attempts++
  }
  currentTip.value = next
}
</script>

<template>
  <div class="page">
    <div class="container">
      <!-- Header -->
      <header class="head">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>

        <div>
          <h1 class="title">Boost Moment</h1>
          <p class="subtitle">Reflekter og boost dagen</p>
        </div>
      </header>

      <!-- Boost count card -->
      <section class="streakCard">
        <div>
          <div class="kicker">Boosts denne måneden</div>
          <div class="streakRow">
            <div class="streakNum">{{ monthTotal }}</div>
            <div class="zap" aria-hidden="true"></div>
          </div>
        </div>
        <div class="trophy" aria-hidden="true"></div>
      </section>

      <!-- STEG 1: Humør -->
      <section v-if="step === 'mood'" class="panel">
        <div class="panelInner centered">
          <h2 class="panelQ">Hvordan har du det i dag?</h2>
          <div class="mood-grid">
            <button class="mood-btn" @click="setMood('tung')">
              <span class="mood-emoji">😔</span>
              <span class="mood-label">Tung dag</span>
            </button>
            <button class="mood-btn" @click="setMood('ok')">
              <span class="mood-emoji">😐</span>
              <span class="mood-label">Ok</span>
            </button>
            <button class="mood-btn" @click="setMood('bra')">
              <span class="mood-emoji">😊</span>
              <span class="mood-label">Bra dag</span>
            </button>
          </div>
        </div>
      </section>

      <!-- STEG 2: Stolt av -->
      <section v-else-if="step === 'proud'" class="panel">
        <div class="panelInner">
          <p class="mood-response">{{ moodTipText }}</p>
          <div class="mood-divider"></div>
          <h2 class="panelQ">Noe du er stolt av i dag?</h2>
          <div class="proud-grid">
            <button
              v-for="p in PROUD_OPTIONS"
              :key="p.key"
              class="proud-btn"
              @click="setProud(p.key)"
            >
              {{ p.label }}
            </button>
          </div>
          <button class="back-link" type="button" @click="step = 'mood'">Tilbake</button>
        </div>
      </section>

      <!-- STEG 3: Mikro-handling -->
      <section v-else-if="step === 'action'" class="panel dark">
        <div class="panelInner">
          <div class="panelHead row">
            <div class="left">
              <div class="panelIcon light">
                <span class="boltMark" aria-hidden="true"></span>
              </div>
              <h2 class="panelTitle lightText">Mikro-handling</h2>
            </div>

            <button class="ghost" type="button" @click="refreshAction" aria-label="Ny handling">
              <span class="refresh" aria-hidden="true"></span>
            </button>
          </div>

          <div class="task">
            <div class="taskKicker">Din oppgave</div>
            <div class="taskText">{{ currentTip?.text }}</div>
          </div>

          <div class="actionButtons">
            <button class="primary lightBtn" type="button" @click="handleComplete">
              Gjort
            </button>
            <button class="secondary darkBtn" type="button" @click="refreshAction">
              Passer ikke – gi meg en annen
            </button>
          </div>
        </div>
      </section>

      <!-- STEG 4: Ferdig -->
      <section v-else class="panel">
        <div class="panelInner done">
          <div class="check" aria-hidden="true">✓</div>
          <h2 class="doneTitle">Bra jobbet!</h2>
          <p class="doneText">Du har reflektert og fullført en Boost. Hver liten handling teller.</p>

          <div class="pill">
            <span class="pillDot" aria-hidden="true"></span>
            <span>{{ monthTotal }} Boosts denne måneden</span>
          </div>

          <button class="primary lightBtn next-btn" type="button" @click="router.push('/movin/kom-i-gang')">
            Fortsett til Kom i gang
          </button>
          <button class="secondary" type="button" @click="goBack">
            Til Movin
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }
.container { max-width: 520px; margin: 0 auto; padding: 18px 16px 110px; }

/* Header */
.head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.back { width: 42px; height: 42px; border: none; background: #034044; border-radius: 999px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); cursor: pointer; display: grid; place-items: center; }
.chev { width: 12px; height: 12px; border-left: 2px solid rgba(209,231,229,0.5); border-bottom: 2px solid rgba(209,231,229,0.5); transform: rotate(45deg); }
.title { margin: 0; font-size: 48px; line-height: 1; font-weight: 900; letter-spacing: -0.04em; color: #FFFFFF; }
.subtitle { margin: 10px 0 0; font-size: 18px; font-weight: 700; color: rgba(209,231,229,0.35); }

/* Streak card */
.streakCard { background: #023238; border-radius: 28px; padding: 20px; box-shadow: 0 12px 36px rgba(0,0,0,0.25); display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.kicker { font-size: 13px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(209,231,229,0.35); }
.streakRow { margin-top: 10px; display: flex; align-items: center; gap: 14px; }
.streakNum { font-size: 56px; font-weight: 900; letter-spacing: -0.04em; color: #FFFFFF; line-height: 1; }
.zap { width: 26px; height: 38px; background: #BEF201; clip-path: polygon(45% 0%, 70% 0%, 52% 38%, 78% 38%, 28% 100%, 42% 56%, 22% 56%); border-radius: 6px; }
.trophy { width: 64px; height: 64px; border-radius: 999px; background: rgba(190,242,1,0.10); box-shadow: 0 14px 40px rgba(0,0,0,0.3); border: 1px solid rgba(190,242,1,0.15); position: relative; }
.trophy::before { content: ""; width: 26px; height: 22px; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -55%); border: 3px solid #BEF201; border-bottom: none; border-radius: 10px 10px 6px 6px; }
.trophy::after { content: ""; width: 18px; height: 8px; position: absolute; left: 50%; top: 57%; transform: translateX(-50%); border: 3px solid #BEF201; border-top: none; border-radius: 0 0 10px 10px; }

/* Panel */
.panel { background: #023238; border-radius: 32px; padding: 22px; box-shadow: 0 14px 40px rgba(0,0,0,0.25); border: 1px solid rgba(209,231,229,0.08); }
.panel.dark { background: #023238; border-color: rgba(255,255,255,0.10); box-shadow: 0 18px 60px rgba(0,0,0,0.35); }
.panelInner { min-height: 400px; display: flex; flex-direction: column; }
.panelInner.centered { align-items: center; justify-content: center; text-align: center; }

/* Mood step */
.panelQ { margin: 0 0 24px; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF; }
.mood-grid { display: flex; gap: 12px; }
.mood-btn {
  flex: 1; padding: 20px 10px; border-radius: 20px;
  border: 2px solid rgba(209,231,229,0.1); background: #034044;
  cursor: pointer; display: flex; flex-direction: column;
  align-items: center; gap: 8px; transition: all 0.15s;
}
.mood-btn:active { transform: scale(0.96); }
.mood-btn:hover { border-color: rgba(190,242,1,0.4); }
.mood-emoji { font-size: 36px; }
.mood-label { font-size: 14px; font-weight: 800; color: #D1E7E5; }

/* Proud step */
.mood-response { margin: 0; font-size: 15px; font-weight: 700; color: rgba(209,231,229,0.6); line-height: 1.5; padding: 8px 0; }
.mood-divider { width: 40px; height: 2px; background: rgba(209,231,229,0.08); margin: 12px 0 16px; }
.proud-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
.proud-btn {
  height: 48px; border-radius: 14px;
  border: 1px solid rgba(209,231,229,0.1); background: #034044;
  font-size: 15px; font-weight: 800; color: #D1E7E5;
  cursor: pointer; text-align: left; padding: 0 14px;
  transition: all 0.1s;
}
.proud-btn:active { transform: translateY(1px); }
.proud-btn:hover { border-color: rgba(209,231,229,0.12); }
.back-link { margin-top: 12px; border: none; background: transparent; color: rgba(209,231,229,0.6); font-weight: 800; cursor: pointer; }

/* Action step (dark) */
.panelHead { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.panelHead.row { justify-content: space-between; }
.left { display: flex; align-items: center; gap: 12px; }
.panelIcon { width: 84px; height: 84px; border-radius: 26px; background: #023238; display: grid; place-items: center; }
.panelIcon.light { background: rgba(255,255,255,0.12); }
.boltMark { width: 34px; height: 46px; background: #023238; clip-path: polygon(45% 0%, 70% 0%, 52% 38%, 78% 38%, 28% 100%, 42% 56%, 22% 56%); border-radius: 8px; }
.panelTitle { margin: 0; font-size: 34px; font-weight: 900; color: #FFFFFF; }
.lightText { color: white; }

.task { margin-top: 28px; text-align: center; padding: 18px 10px; flex: 1; }
.taskKicker { font-size: 11px; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; color: #BEF201; }
.taskText { margin-top: 14px; font-size: 28px; font-weight: 900; letter-spacing: -0.02em; line-height: 1.15; color: white; }

.ghost { width: 44px; height: 44px; border-radius: 999px; border: none; cursor: pointer; background: rgba(255,255,255,0.08); }
.ghost:hover { background: rgba(255,255,255,0.12); }
.refresh { width: 16px; height: 16px; display: inline-block; border: 2px solid rgba(255,255,255,0.55); border-radius: 4px; transform: rotate(45deg); }

/* Buttons */
.primary { margin-top: 22px; width: 100%; height: 70px; border: none; border-radius: 24px; background: #034044; color: white; font-weight: 900; font-size: 18px; cursor: pointer; }
.primary.lightBtn { background: #BEF201; color: #023238; }
.actionButtons { margin-top: 22px; display: flex; flex-direction: column; gap: 10px; }
.actionButtons .primary { margin-top: 0; }
.secondary.darkBtn { width: 100%; height: 52px; border: 1px solid rgba(255,255,255,0.15); border-radius: 18px; background: transparent; color: rgba(255,255,255,0.6); font-weight: 800; font-size: 15px; cursor: pointer; }
.next-btn { margin-top: 16px; height: 56px; border-radius: 18px; }
.secondary { margin-top: 10px; width: 100%; height: 56px; border: none; border-radius: 18px; background: rgba(209,231,229,0.06); color: #D1E7E5; font-weight: 900; cursor: pointer; }

/* Done */
.done { align-items: center; justify-content: center; text-align: center; gap: 10px; }
.check { width: 86px; height: 86px; border-radius: 999px; background: rgba(190,242,1,0.12); color: #FFFFFF; display: grid; place-items: center; font-size: 40px; font-weight: 900; margin-bottom: 10px; }
.doneTitle { margin: 0; font-size: 24px; font-weight: 900; color: #FFFFFF; }
.doneText { margin: 0; max-width: 260px; font-size: 14px; font-weight: 700; color: rgba(209,231,229,0.6); }
.pill { margin-top: 14px; display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 999px; background: rgba(190,242,1,0.12); color: #FFFFFF; font-weight: 900; font-size: 13px; }
.pillDot { width: 10px; height: 10px; border-radius: 999px; background: #BEF201; }
</style>
