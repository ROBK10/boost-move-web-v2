<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/services/api'
import { generateSession, type TrainerProfile } from '@/utils/programGenerator'
import TrainerOnboarding from './TrainerOnboarding.vue'

const router = useRouter()

const profile = ref<TrainerProfile | null>(null)
const logs = ref<any[]>([])
const loading = ref(true)
const showOnboarding = ref(false)

onMounted(async () => {
  try {
    const [profileRes, logsRes] = await Promise.all([
      apiFetch('/trainer/profile'),
      apiFetch('/trainer/logs'),
    ])
    if (profileRes.profile) {
      profile.value = {
        workType: profileRes.profile.workType,
        cardioLevel: profileRes.profile.cardioLevel,
        strengthLevel: profileRes.profile.strengthLevel,
        equipment: profileRes.profile.equipment,
        sessionDuration: profileRes.profile.sessionDuration,
        programWeek: profileRes.profile.programWeek,
        painAreas: [], // Henter vi ikke fra profilen - liten forenkling
      }
    } else {
      showOnboarding.value = true
    }
    logs.value = logsRes.logs || []
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
})

const currentWeek = computed(() => profile.value?.programWeek ?? 1)
const progressPercent = computed(() => Math.round((currentWeek.value / 16) * 100))

const session = computed(() => {
  if (!profile.value) return null
  return generateSession(profile.value)
})

const thisWeekLogs = computed(() =>
  logs.value.filter((l: any) => l.week === currentWeek.value)
)

function startWorkout() {
  router.push('/movin/trening/okt')
}

async function onOnboardingDone() {
  showOnboarding.value = false
  // Hent profil på nytt
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
    }
  } catch {
    // ignore
  }
}

const phaseLabel = computed(() => {
  const w = currentWeek.value
  if (w <= 4) return 'Grunnbygging'
  if (w <= 8) return 'Økt volum'
  if (w <= 12) return 'Høyt volum'
  return 'Vedlikehold'
})
</script>

<template>
  <div class="page">
    <!-- Onboarding overlay -->
    <TrainerOnboarding
      v-if="showOnboarding"
      @done="onOnboardingDone"
    />

    <!-- Loading -->
    <div v-if="loading" class="loading">Laster...</div>

    <template v-else-if="profile">
      <!-- Header -->
      <header class="head">
        <button class="back-link" @click="router.push('/movin')">
          <span class="back-arrow"></span> Movin
        </button>
        <h1 class="title">Smart bevegelse</h1>
        <p class="phase-label">{{ phaseLabel }}</p>
      </header>

      <!-- Progress bar -->
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">Uke {{ currentWeek }} av 16</span>
          <span class="progress-pct">{{ progressPercent }}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- Next session card -->
      <div v-if="session" class="session-card">
        <div class="session-header">
          <div class="session-title">Neste økt</div>
          <div class="session-meta">
            {{ session.totalExercises }} øvelser &middot; {{ session.durationMinutes }} min
          </div>
        </div>
        <div class="session-sections">
          <div v-for="s in session.sections" :key="s.type" class="section-pill">
            {{ s.label }} ({{ s.exercises.length }})
          </div>
        </div>
        <button class="start-btn" @click="startWorkout">Start økt</button>
      </div>

      <!-- This week's logs -->
      <section class="logs-section">
        <h2 class="section-label">Denne uken</h2>
        <div v-if="thisWeekLogs.length === 0" class="no-logs">
          Ingen fullførte økter ennå denne uken.
        </div>
        <div v-else class="log-list">
          <div v-for="log in thisWeekLogs" :key="log.id" class="log-row">
            <div class="log-check">&#10003;</div>
            <div class="log-info">
              <div class="log-date">
                {{ new Date(log.completedAt).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'short' }) }}
              </div>
              <div class="log-meta">
                <span v-if="log.durationMin">{{ log.durationMin }} min</span>
                <span v-if="log.feltScore" class="log-score">
                  {{ ['', '&#x1F62B;', '&#x1F615;', '&#x1F642;', '&#x1F60A;', '&#x1F929;'][log.feltScore] }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Endre program -->
      <button class="change-btn" @click="showOnboarding = true">
        Endre programmet
      </button>
    </template>
  </div>
</template>

<style scoped>
.page { width: 100%; max-width: 520px; margin: 0 auto; padding: 18px 16px 110px; }

.loading {
  text-align: center; padding: 60px 0;
  font-size: 15px; font-weight: 700; color: rgba(209,231,229,0.5);
}

/* Header */
.head { margin-bottom: 20px; }
.back-link {
  border: none; background: none; color: rgba(209,231,229,0.5);
  font-size: 13px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 6px; margin-bottom: 8px;
  padding: 0;
}
.back-arrow {
  width: 7px; height: 7px;
  border-left: 2px solid rgba(209,231,229,0.5);
  border-bottom: 2px solid rgba(209,231,229,0.5);
  transform: rotate(45deg);
}
.title {
  margin: 0; font-size: 30px; font-weight: 900;
  letter-spacing: -0.03em; color: #FFFFFF;
}
.phase-label {
  margin: 4px 0 0; font-size: 14px; font-weight: 700;
  color: #BEF201;
}

/* Progress */
.progress-section { margin-bottom: 20px; }
.progress-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 8px;
}
.progress-label {
  font-size: 14px; font-weight: 800; color: rgba(209,231,229,0.6);
}
.progress-pct {
  font-size: 14px; font-weight: 900; color: #BEF201;
}
.progress-track {
  height: 8px; border-radius: 999px;
  background: rgba(209,231,229,0.08);
  overflow: hidden;
}
.progress-fill {
  height: 100%; border-radius: 999px;
  background: #BEF201;
  transition: width 0.4s ease;
}

/* Session card */
.session-card {
  background: #023238; border-radius: 20px; padding: 20px;
  border: 2px solid rgba(190,242,1,0.2);
  margin-bottom: 24px;
}
.session-header { margin-bottom: 14px; }
.session-title {
  font-size: 18px; font-weight: 900; color: #FFFFFF;
}
.session-meta {
  font-size: 13px; font-weight: 700; color: rgba(209,231,229,0.5);
  margin-top: 4px;
}
.session-sections {
  display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;
}
.section-pill {
  padding: 4px 10px; border-radius: 999px;
  background: rgba(209,231,229,0.06);
  font-size: 12px; font-weight: 800; color: rgba(209,231,229,0.6);
}
.start-btn {
  width: 100%; height: 48px; border: none; border-radius: 14px;
  background: #BEF201; color: #023238; font-size: 16px; font-weight: 900;
  cursor: pointer;
}
.start-btn:active { opacity: 0.85; }

/* Logs */
.section-label {
  margin: 0 0 12px; font-size: 13px; font-weight: 900;
  color: rgba(209,231,229,0.35); letter-spacing: 0.05em; text-transform: uppercase;
}
.no-logs {
  padding: 20px; background: #023238; border-radius: 16px;
  font-size: 14px; font-weight: 600; color: rgba(209,231,229,0.4);
  text-align: center;
}
.log-list { display: flex; flex-direction: column; gap: 8px; }
.log-row {
  display: flex; align-items: center; gap: 12px;
  background: #023238; border-radius: 14px; padding: 14px 16px;
}
.log-check {
  width: 28px; height: 28px; border-radius: 999px;
  background: rgba(16,185,129,0.12); color: rgba(16,185,129,0.95);
  display: grid; place-items: center;
  font-size: 14px; font-weight: 900; flex-shrink: 0;
}
.log-info { flex: 1; }
.log-date {
  font-size: 14px; font-weight: 800; color: #D1E7E5;
  text-transform: capitalize;
}
.log-meta {
  font-size: 12px; font-weight: 700; color: rgba(209,231,229,0.5);
  margin-top: 2px; display: flex; gap: 8px;
}
.log-score { font-size: 16px; }

.change-btn {
  width: 100%; height: 48px; border: 1.5px solid rgba(209,231,229,0.12);
  border-radius: 14px; background: transparent;
  color: rgba(209,231,229,0.5); font-size: 14px; font-weight: 800;
  cursor: pointer; margin-top: 16px;
}
.change-btn:active { background: rgba(209,231,229,0.04); }
</style>
