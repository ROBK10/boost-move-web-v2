<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/services/api'
import { generateSession, type TrainerProfile, type SessionExercise, type SessionSection } from '@/utils/programGenerator'

const router = useRouter()

const profile = ref<TrainerProfile | null>(null)
const loading = ref(true)
const sections = ref<SessionSection[]>([])
const week = ref(1)

// Flattened exercise list for navigation
const allExercises = computed(() => {
  const list: { exercise: SessionExercise; sectionLabel: string; sectionType: string }[] = []
  for (const s of sections.value) {
    for (const ex of s.exercises) {
      list.push({ exercise: ex, sectionLabel: s.label, sectionType: s.type })
    }
  }
  return list
})

const currentIndex = ref(0)
const totalExercises = computed(() => allExercises.value.length)
const progressPercent = computed(() =>
  totalExercises.value > 0 ? Math.round(((currentIndex.value + 1) / totalExercises.value) * 100) : 0
)

const current = computed(() => allExercises.value[currentIndex.value] ?? null)

// Set tracking for rep-based exercises
const currentSet = ref(1)
const totalSets = computed(() => current.value?.exercise.sets ?? 1)

// Timer for timed exercises
const timerRunning = ref(false)
const timerSeconds = ref(0)
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)

const startTime = ref<number>(0)

onMounted(async () => {
  try {
    const res = await apiFetch('/trainer/profile')
    if (res.profile) {
      profile.value = {
        workType: res.profile.workType,
        cardioLevel: res.profile.cardioLevel,
        strengthLevel: res.profile.strengthLevel,
        equipment: res.profile.equipment,
        sessionDuration: res.profile.sessionDuration,
        programWeek: res.profile.programWeek,
        painAreas: [],
      }
      const session = generateSession(profile.value)
      sections.value = session.sections
      week.value = session.week
    } else {
      router.replace('/movin/trening/kartlegging')
      return
    }
  } catch {
    router.replace('/movin/trening')
    return
  } finally {
    loading.value = false
  }

  startTime.value = Date.now()
  initExercise()
})

onUnmounted(() => {
  stopTimer()
})

function initExercise() {
  currentSet.value = 1
  stopTimer()
  const ex = current.value?.exercise
  if (ex?.duration) {
    timerSeconds.value = ex.duration
  } else {
    timerSeconds.value = 0
  }
}

function startTimer() {
  if (timerRunning.value) return
  timerRunning.value = true
  timerInterval.value = setInterval(() => {
    if (timerSeconds.value > 0) {
      timerSeconds.value--
    } else {
      stopTimer()
    }
  }, 1000)
}

function stopTimer() {
  timerRunning.value = false
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

function resetTimer() {
  stopTimer()
  const ex = current.value?.exercise
  if (ex?.duration) {
    timerSeconds.value = ex.duration
  }
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function completeSet() {
  if (currentSet.value < totalSets.value) {
    currentSet.value++
    // Reset timer if timed
    if (current.value?.exercise.duration) {
      resetTimer()
    }
  } else {
    nextExercise()
  }
}

function nextExercise() {
  stopTimer()
  if (currentIndex.value < totalExercises.value - 1) {
    currentIndex.value++
    initExercise()
  } else {
    finishWorkout()
  }
}

function prevExercise() {
  if (currentIndex.value > 0) {
    stopTimer()
    currentIndex.value--
    initExercise()
  }
}

async function finishWorkout() {
  const durationMin = Math.round((Date.now() - startTime.value) / 60000)
  // Lagre midlertidig data i sessionStorage for WorkoutComplete
  sessionStorage.setItem('workout_week', String(week.value))
  sessionStorage.setItem('workout_duration', String(durationMin))
  sessionStorage.setItem('workout_sections', JSON.stringify(sections.value.map(s => s.label)))
  router.push('/movin/trening/fullfort')
}

function exitWorkout() {
  router.push('/movin/trening')
}
</script>

<template>
  <div class="page">
    <!-- Loading -->
    <div v-if="loading" class="loading">Genererer økten...</div>

    <template v-else-if="current">
      <!-- Top bar -->
      <div class="top-bar">
        <button class="exit-btn" @click="exitWorkout">Avslutt</button>
        <div class="top-progress">
          <span class="top-count">{{ currentIndex + 1 }}/{{ totalExercises }}</span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <!-- Section header -->
      <div class="section-header">{{ current.sectionLabel }}</div>

      <!-- Exercise card -->
      <div class="exercise-card">
        <h1 class="exercise-name">{{ current.exercise.name }}</h1>

        <!-- Reps or Timer info -->
        <div class="exercise-info">
          <template v-if="current.exercise.duration">
            <div class="timer-display" :class="{ running: timerRunning, done: timerSeconds === 0 }">
              {{ formatTime(timerSeconds) }}
            </div>
            <div class="timer-controls">
              <button v-if="!timerRunning && timerSeconds > 0" class="timer-btn" @click="startTimer">Start</button>
              <button v-else-if="timerRunning" class="timer-btn pause" @click="stopTimer">Pause</button>
              <button v-if="timerSeconds === 0" class="timer-btn" @click="resetTimer">Igjen</button>
            </div>
            <div v-if="totalSets > 1" class="set-counter">
              Sett {{ currentSet }} av {{ totalSets }}
            </div>
          </template>
          <template v-else>
            <div class="reps-display">
              {{ current.exercise.reps }} reps
            </div>
            <div class="set-counter">
              Sett {{ currentSet }} av {{ totalSets }}
            </div>
          </template>
        </div>

        <!-- Instructions -->
        <div class="instructions">
          <div v-for="(inst, i) in current.exercise.instructions" :key="i" class="instruction-row">
            <span class="inst-num">{{ i + 1 }}</span>
            <span class="inst-text">{{ inst }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="nav-bar">
        <button class="nav-btn prev" :disabled="currentIndex === 0" @click="prevExercise">
          <span class="nav-arrow left"></span>
        </button>

        <button class="nav-btn-main" @click="completeSet">
          <template v-if="currentSet < totalSets">Neste sett</template>
          <template v-else-if="currentIndex < totalExercises - 1">Neste øvelse</template>
          <template v-else>Fullfør</template>
        </button>

        <button
          class="nav-btn next"
          :disabled="currentIndex >= totalExercises - 1"
          @click="nextExercise"
        >
          <span class="nav-arrow right"></span>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page {
  width: 100%; max-width: 520px; margin: 0 auto;
  padding: 18px 16px 110px;
  min-height: 100vh; min-height: 100dvh;
}

.loading {
  text-align: center; padding: 80px 0;
  font-size: 15px; font-weight: 700; color: rgba(209,231,229,0.5);
}

/* Top bar */
.top-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.exit-btn {
  border: none; background: none;
  font-size: 14px; font-weight: 800; color: rgba(209,231,229,0.5);
  cursor: pointer; padding: 0;
}
.top-progress {
  font-size: 14px; font-weight: 900; color: rgba(209,231,229,0.6);
}
.top-count { color: #D1E7E5; }

/* Progress */
.progress-track {
  height: 4px; border-radius: 999px;
  background: rgba(209,231,229,0.08);
  overflow: hidden; margin-bottom: 20px;
}
.progress-fill {
  height: 100%; border-radius: 999px;
  background: #BEF201;
  transition: width 0.3s ease;
}

/* Section header */
.section-header {
  font-size: 12px; font-weight: 900; color: rgba(209,231,229,0.35);
  letter-spacing: 0.06em; text-transform: uppercase;
  margin-bottom: 8px;
}

/* Exercise card */
.exercise-card {
  background: #023238; border-radius: 24px; padding: 24px 20px;
  border: 1px solid rgba(209,231,229,0.08);
  margin-bottom: 20px;
}
.exercise-name {
  margin: 0 0 16px; font-size: 24px; font-weight: 900;
  color: #FFFFFF; letter-spacing: -0.02em;
}

/* Timer */
.exercise-info {
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; margin-bottom: 20px;
}
.timer-display {
  font-size: 56px; font-weight: 900; color: #D1E7E5;
  font-variant-numeric: tabular-nums; line-height: 1;
}
.timer-display.running { color: #BEF201; }
.timer-display.done { color: rgba(16,185,129,0.95); }

.timer-controls { display: flex; gap: 10px; }
.timer-btn {
  padding: 8px 24px; border-radius: 12px; border: none;
  background: rgba(190,242,1,0.12); color: #BEF201;
  font-size: 14px; font-weight: 900; cursor: pointer;
}
.timer-btn.pause {
  background: rgba(209,231,229,0.08); color: rgba(209,231,229,0.6);
}

/* Reps */
.reps-display {
  font-size: 40px; font-weight: 900; color: #BEF201; line-height: 1;
}
.set-counter {
  font-size: 14px; font-weight: 800; color: rgba(209,231,229,0.5);
}

/* Instructions */
.instructions {
  display: flex; flex-direction: column; gap: 10px;
}
.instruction-row {
  display: flex; align-items: flex-start; gap: 10px;
}
.inst-num {
  width: 22px; height: 22px; border-radius: 999px;
  background: rgba(209,231,229,0.06);
  display: grid; place-items: center; flex-shrink: 0;
  font-size: 11px; font-weight: 900; color: rgba(209,231,229,0.4);
}
.inst-text {
  font-size: 14px; font-weight: 600; color: rgba(209,231,229,0.7);
  line-height: 1.45;
}

/* Navigation */
.nav-bar {
  display: flex; align-items: center; gap: 10px;
}
.nav-btn {
  width: 48px; height: 48px; border-radius: 14px; border: none;
  background: rgba(209,231,229,0.06);
  display: grid; place-items: center; cursor: pointer; flex-shrink: 0;
}
.nav-btn:disabled { opacity: 0.3; cursor: default; }
.nav-arrow {
  width: 10px; height: 10px;
  border-top: 2px solid rgba(209,231,229,0.5);
}
.nav-arrow.left {
  border-left: 2px solid rgba(209,231,229,0.5);
  transform: rotate(-45deg);
}
.nav-arrow.right {
  border-right: 2px solid rgba(209,231,229,0.5);
  transform: rotate(45deg);
}
.nav-btn-main {
  flex: 1; height: 48px; border: none; border-radius: 14px;
  background: #BEF201; color: #023238;
  font-size: 16px; font-weight: 900; cursor: pointer;
}
.nav-btn-main:active { opacity: 0.85; }
</style>
