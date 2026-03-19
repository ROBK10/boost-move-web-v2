<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "@/stores/authStore"

const auth = useAuthStore()
const emit = defineEmits<{ (e: "done"): void }>()

type Step = 1 | 2 | 3

const step = ref<Step>(1)
const selectedLevel = ref<string | null>(null)

// Nivå → automatisk mål
const LEVELS = [
  { key: "starter", label: "Helt ny", desc: "Har ikke trent på lenge", goal: 10 },
  { key: "litt", label: "Litt aktiv", desc: "Beveger meg av og til", goal: 75 },
  { key: "aktiv", label: "Aktiv", desc: "Trener regelmessig", goal: 150 },
]

function selectLevel(key: string) {
  selectedLevel.value = key
  step.value = 2
}

const autoGoal = ref(75)

// Steg 2 bekrefter mål
function confirmGoal() {
  const level = LEVELS.find(l => l.key === selectedLevel.value)
  autoGoal.value = level?.goal ?? 75
  step.value = 3
}

async function finish() {
  try {
    await auth.updateProfile({
      onboardingDone: true,
      weeklyGoal: autoGoal.value,
    })
    emit("done")
  } catch {
    emit("done")
  }
}
</script>

<template>
  <div class="overlay">
    <div class="card">
      <!-- Steg 1: Velkommen + nivå -->
      <div v-if="step === 1" class="step-content">
        <div class="icon-wrap">
          <div class="icon-circle">
            <div class="bolt" aria-hidden="true" />
          </div>
        </div>
        <h1 class="heading">Velkommen til Boost Move</h1>
        <p class="body">Vi hjelper deg med å bevege deg mer — i ditt tempo.</p>

        <div class="level-grid">
          <button
            v-for="l in LEVELS"
            :key="l.key"
            class="level-btn"
            @click="selectLevel(l.key)"
          >
            <div class="level-label">{{ l.label }}</div>
            <div class="level-desc">{{ l.desc }}</div>
          </button>
        </div>
      </div>

      <!-- Steg 2: Bekreft mål (automatisk satt) -->
      <div v-else-if="step === 2" class="step-content">
        <div class="goal-check">
          <div class="goal-big">{{ LEVELS.find(l => l.key === selectedLevel)?.goal }} min</div>
          <div class="goal-sub">per uke — ditt startmål</div>
        </div>
        <p class="body">Du kan endre dette når som helst. Alt teller.</p>
        <button class="primary" @click="confirmGoal">Ser bra ut</button>
        <button class="back" @click="step = 1">Endre nivå</button>
      </div>

      <!-- Steg 3: Klar -->
      <div v-else class="step-content">
        <div class="icon-wrap">
          <div class="check-circle">✓</div>
        </div>
        <h2 class="heading">Du er klar!</h2>
        <p class="body">Start med å logge bevegelsen din i <strong>Min Helse</strong>.</p>
        <button class="primary" @click="finish">Start</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}

.card {
  background: #023238; border-radius: 28px; padding: 32px 24px 28px;
  width: 100%; max-width: 400px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}

.step-content { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; }
.icon-wrap { margin-bottom: 8px; }
.icon-circle { width: 64px; height: 64px; border-radius: 20px; background: #034044; display: grid; place-items: center; }
.bolt { width: 22px; height: 30px; background: #BEF201; clip-path: polygon(45% 0%, 70% 0%, 52% 38%, 78% 38%, 28% 100%, 42% 56%, 22% 56%); }
.check-circle { width: 64px; height: 64px; border-radius: 999px; background: rgba(190, 242, 1, 0.12); color: #BEF201; display: grid; place-items: center; font-size: 32px; font-weight: 900; }
.heading { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF; }
.body { margin: 0; font-size: 15px; font-weight: 600; color: rgba(209, 231, 229, 0.6); line-height: 1.5; max-width: 300px; }

/* Nivå-knapper */
.level-grid { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
.level-btn {
  width: 100%; padding: 18px 16px; border-radius: 16px;
  border: 2px solid rgba(209, 231, 229, 0.1); background: #034044;
  text-align: left; cursor: pointer; transition: all 0.15s;
}
.level-btn:active { transform: scale(0.98); }
.level-btn:hover { border-color: rgba(190, 242, 1, 0.3); }
.level-label { font-size: 18px; font-weight: 900; color: #FFFFFF; }
.level-desc { font-size: 13px; font-weight: 600; color: rgba(209, 231, 229, 0.5); margin-top: 2px; }

/* Mål-bekreftelse */
.goal-check { margin: 8px 0; }
.goal-big { font-size: 48px; font-weight: 900; color: #BEF201; line-height: 1; }
.goal-sub { font-size: 16px; font-weight: 700; color: rgba(209, 231, 229, 0.6); margin-top: 4px; }

.primary {
  width: 100%; height: 52px; border: none; border-radius: 16px;
  background: #BEF201; color: #023238; font-size: 16px; font-weight: 900;
  cursor: pointer; margin-top: 8px;
}
.primary:disabled { opacity: 0.4; cursor: not-allowed; }
.back { border: none; background: transparent; color: rgba(209, 231, 229, 0.5); font-weight: 800; cursor: pointer; margin-top: 4px; }
</style>
