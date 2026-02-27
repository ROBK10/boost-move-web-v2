<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useBoostMomentStore } from "@/stores/boostMomentStore"
import { microActions } from "@/data/microActions"

const router = useRouter()
const boostMomentStore = useBoostMomentStore()

onMounted(() => {
  boostMomentStore.hydrate()
})

type Step = "energy" | "action" | "done"

const step = ref<Step>("energy")
const energy = ref<number>(5)
const action = ref<string>(microActions[0] ?? "Ta 3 dype pust")

const streak = computed(() => boostMomentStore.boostStreak)
const levels = Array.from({ length: 10 }, (_, i) => i + 1)

function goBack() {
  router.push("/movin")
}

function setEnergy(v: number) {
  energy.value = v
}

function next() {
  step.value = "action"
}

function handleComplete() {
  step.value = "done"
  boostMomentStore.completeBoostToday()
}

function refreshAction() {
  const idx = Math.floor(Math.random() * microActions.length)
  action.value = microActions[idx] ?? action.value
}

// ✅ Trappe-høyde 10%..100%
function barHeight(level: number) {
  return `${level * 10}%`
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
          <p class="subtitle">Lad opp dagen din</p>
        </div>
      </header>

      <!-- Streak card -->
      <section class="streakCard" aria-label="Streak">
        <div>
          <div class="kicker">Daglige boost</div>
          <div class="streakRow">
            <div class="streakNum">{{ streak }}</div>
            <div class="zap" aria-hidden="true"></div>
          </div>
        </div>

        <div class="trophy" aria-hidden="true"></div>
      </section>

      <!-- Step container -->
      <section class="panel" :class="{ dark: step === 'action' }">
        <!-- STEP 1 -->
        <div v-if="step === 'energy'" class="panelInner">
          <div class="panelHead">
            <div class="panelIcon" aria-hidden="true">
              <span class="boltMark" aria-hidden="true"></span>
            </div>
            <h2 class="panelTitle">Energisjekk</h2>
          </div>

          <p class="question">Hvordan er energien din akkurat nå?</p>

          <!-- ✅ Bars like Figma -->
          <div class="barsWrap">
            <div class="bars" role="group" aria-label="Energi 1 til 10">
              <button
                v-for="level in levels"
                :key="level"
                class="bar"
                :class="{ on: level <= energy }"
                type="button"
                @click="setEnergy(level)"
                :style="{ height: barHeight(level) }"
                :aria-label="`Energi ${level} av 10`"
              >
                <span v-if="level === energy" class="tip">{{ energy }}/10</span>
              </button>
            </div>

            <div class="scale">
              <span>Lav</span>
              <span>Høy</span>
            </div>
          </div>

          <button class="primary" type="button" @click="next">
            Dagens mikro-handling
            <span class="arrow" aria-hidden="true"></span>
          </button>
        </div>

        <!-- STEP 2 -->
        <div v-else-if="step === 'action'" class="panelInner">
          <div class="panelHead row">
            <div class="left">
              <div class="panelIcon light" aria-hidden="true"></div>
              <h2 class="panelTitle lightText">Mikro-handling</h2>
            </div>

            <button class="ghost" type="button" @click="refreshAction" aria-label="Ny handling">
              <span class="refresh" aria-hidden="true"></span>
            </button>
          </div>

          <div class="task">
            <div class="taskKicker">Din oppgave</div>
            <div class="taskText">{{ action }}</div>
          </div>

          <button class="primary lightBtn" type="button" @click="handleComplete">
            Ferdig
          </button>
        </div>

        <!-- STEP 3 -->
        <div v-else class="panelInner done">
          <div class="check" aria-hidden="true">✓</div>
          <h2 class="doneTitle">Bra jobbet!</h2>
          <p class="doneText">Du har fullført dagens boost og investert i helsa di.</p>

          <div class="pill">
            <span class="pillDot" aria-hidden="true"></span>
            <span>{{ streak }} dager streak</span>
          </div>

          <button class="secondary" type="button" @click="goBack">
            Til Movin
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
}

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 110px;
}

/* Header */
.head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.back {
  width: 42px;
  height: 42px;
  border: none;
  background: white;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer;
  display: grid;
  place-items: center;
}

.chev {
  width: 12px;
  height: 12px;
  border-left: 2px solid rgba(17, 24, 39, 0.55);
  border-bottom: 2px solid rgba(17, 24, 39, 0.55);
  transform: rotate(45deg);
}

.title {
  margin: 0;
  font-size: 48px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #111827;
}

.subtitle {
  margin: 10px 0 0;
  font-size: 18px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

/* Streak card */
.streakCard {
  background: white;
  border-radius: 28px;
  padding: 20px;
  box-shadow: 0 12px 36px rgba(20, 20, 20, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.kicker {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.35);
}

.streakRow {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.streakNum {
  font-size: 56px;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #111827;
  line-height: 1;
}

/* Green lightning mark (no emoji) */
.zap {
  width: 26px;
  height: 38px;
  background: rgba(16, 185, 129, 0.95);
  clip-path: polygon(45% 0%, 70% 0%, 52% 38%, 78% 38%, 28% 100%, 42% 56%, 22% 56%);
  border-radius: 6px;
}

/* Trophy bubble (no emoji) */
.trophy {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.10);
  box-shadow: 0 14px 40px rgba(20, 20, 20, 0.10);
  border: 1px solid rgba(16, 185, 129, 0.15);
  position: relative;
}

.trophy::before {
  content: "";
  width: 26px;
  height: 22px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -55%);
  border: 3px solid rgba(16, 185, 129, 0.95);
  border-bottom: none;
  border-radius: 10px 10px 6px 6px;
}

.trophy::after {
  content: "";
  width: 18px;
  height: 8px;
  position: absolute;
  left: 50%;
  top: 57%;
  transform: translateX(-50%);
  border: 3px solid rgba(16, 185, 129, 0.95);
  border-top: none;
  border-radius: 0 0 10px 10px;
}

/* Panel */
.panel {
  background: white;
  border-radius: 32px;
  padding: 22px;
  box-shadow: 0 14px 40px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
}

.panel.dark {
  background: #0b0f17;
  border-color: rgba(255, 255, 255, 0.10);
  box-shadow: 0 18px 60px rgba(17, 24, 39, 0.22);
}

.panelInner {
  min-height: 520px;
  display: flex;
  flex-direction: column;
}

.panelHead {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.panelHead.row {
  justify-content: space-between;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panelIcon {
  width: 84px;
  height: 84px;
  border-radius: 26px;
  background: #0b0f17;
  display: grid;
  place-items: center;
}

.panelIcon.light {
  background: rgba(255, 255, 255, 0.12);
}

.boltMark {
  width: 34px;
  height: 46px;
  background: white;
  clip-path: polygon(45% 0%, 70% 0%, 52% 38%, 78% 38%, 28% 100%, 42% 56%, 22% 56%);
  border-radius: 8px;
}

.panelTitle {
  margin: 0;
  font-size: 34px;
  font-weight: 900;
  color: #111827;
}

.lightText {
  color: white;
}

.question {
  margin: 8px 0 18px;
  font-size: 34px;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: rgba(17, 24, 39, 0.65);
  max-width: 420px;
}

/* Bars */
.barsWrap {
  margin-top: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bars {
  height: 300px;
  display: flex;
  align-items: flex-end;
  gap: 14px;
  padding: 0 8px;
}

.bar {
  flex: 1;
  border: none;
  border-radius: 16px 16px 10px 10px;
  background: rgba(17, 24, 39, 0.06);
  cursor: pointer;
  position: relative;
  transition: transform 120ms ease, background 120ms ease;
}

.bar:hover {
  transform: translateY(-2px);
  background: rgba(17, 24, 39, 0.10);
}

.bar.on {
  background: #0b0f17;
}

.tip {
  position: absolute;
  top: -42px;
  left: 50%;
  transform: translateX(-50%);
  background: #0b0f17;
  color: white;
  font-size: 18px;
  font-weight: 900;
  padding: 10px 14px;
  border-radius: 18px;
  white-space: nowrap;
}

.scale {
  margin-top: 22px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.35);
  padding: 0 12px;
}

/* Buttons */
.primary {
  margin-top: 22px;
  width: 100%;
  height: 70px;
  border: none;
  border-radius: 24px;
  background: #0b0f17;
  color: white;
  font-weight: 900;
  font-size: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.primary:hover {
  opacity: 0.92;
}

.arrow {
  width: 12px;
  height: 12px;
  border-right: 2px solid rgba(255, 255, 255, 0.85);
  border-top: 2px solid rgba(255, 255, 255, 0.85);
  transform: rotate(45deg);
}

.primary.lightBtn {
  background: white;
  color: #111827;
}

.secondary {
  margin-top: 16px;
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 18px;
  background: rgba(17, 24, 39, 0.06);
  color: rgba(17, 24, 39, 0.85);
  font-weight: 900;
  cursor: pointer;
}

/* Action step */
.task {
  margin-top: 28px;
  text-align: center;
  padding: 18px 10px;
}

.taskKicker {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(16, 185, 129, 0.85);
}

.taskText {
  margin-top: 14px;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: white;
}

/* Refresh button */
.ghost {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
}

.ghost:hover {
  background: rgba(255, 255, 255, 0.12);
}

.refresh {
  width: 16px;
  height: 16px;
  display: inline-block;
  border: 2px solid rgba(255, 255, 255, 0.55);
  border-radius: 4px;
  transform: rotate(45deg);
}

/* Done */
.done {
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
}

.check {
  width: 86px;
  height: 86px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.10);
  color: rgba(16, 185, 129, 0.95);
  display: grid;
  place-items: center;
  font-size: 40px;
  font-weight: 900;
  margin-bottom: 10px;
}

.doneTitle {
  margin: 0;
  font-size: 24px;
  font-weight: 900;
  color: #111827;
}

.doneText {
  margin: 0;
  max-width: 260px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.55);
}

.pill {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.10);
  color: rgba(16, 185, 129, 0.95);
  font-weight: 900;
  font-size: 13px;
}

.pillDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.95);
}
</style>