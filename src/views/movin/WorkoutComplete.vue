<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/services/api'

const router = useRouter()

const week = ref(1)
const durationMin = ref(0)
const feltScore = ref<number | null>(null)
const saving = ref(false)
const saved = ref(false)

const FEELINGS = [
  { score: 1, emoji: '\uD83D\uDE2B', label: 'Tung' },
  { score: 2, emoji: '\uD83D\uDE15', label: 'Vanskelig' },
  { score: 3, emoji: '\uD83D\uDE42', label: 'Grei' },
  { score: 4, emoji: '\uD83D\uDE0A', label: 'Bra' },
  { score: 5, emoji: '\uD83E\uDD29', label: 'Fantastisk' },
]

onMounted(() => {
  week.value = Number(sessionStorage.getItem('workout_week') || 1)
  durationMin.value = Number(sessionStorage.getItem('workout_duration') || 0)
})

async function saveLog() {
  if (saving.value || saved.value) return
  saving.value = true
  try {
    await apiFetch('/trainer/log', {
      method: 'POST',
      body: JSON.stringify({
        week: week.value,
        sessionData: {
          sections: JSON.parse(sessionStorage.getItem('workout_sections') || '[]'),
        },
        durationMin: durationMin.value,
        feltScore: feltScore.value,
      }),
    })
    saved.value = true
    // Clean up
    sessionStorage.removeItem('workout_week')
    sessionStorage.removeItem('workout_duration')
    sessionStorage.removeItem('workout_sections')
  } catch {
    // Ignore — naviger uansett
    saved.value = true
  } finally {
    saving.value = false
  }
}

function goBack() {
  if (!saved.value) {
    saveLog().then(() => router.push('/movin/trening'))
  } else {
    router.push('/movin/trening')
  }
}
</script>

<template>
  <div class="page">
    <div class="content">
      <!-- Checkmark -->
      <div class="check-wrap">
        <div class="check-circle">
          <div class="check-mark">&#10003;</div>
        </div>
      </div>

      <h1 class="heading">Bra jobbet!</h1>
      <p class="sub" v-if="durationMin > 0">
        Du trente i {{ durationMin }} {{ durationMin === 1 ? 'minutt' : 'minutter' }}
      </p>

      <!-- Feeling -->
      <div class="feeling-section">
        <p class="feeling-label">Hvordan kjentes det?</p>
        <div class="feeling-grid">
          <button
            v-for="f in FEELINGS"
            :key="f.score"
            class="feeling-btn"
            :class="{ selected: feltScore === f.score }"
            @click="feltScore = f.score"
          >
            <span class="feeling-emoji">{{ f.emoji }}</span>
            <span class="feeling-text">{{ f.label }}</span>
          </button>
        </div>
      </div>

      <!-- Save + Back -->
      <button class="primary" :disabled="saving || (feltScore === null)" @click="saveLog">
        <template v-if="saved">Lagret!</template>
        <template v-else-if="saving">Lagrer...</template>
        <template v-else>Lagre</template>
      </button>

      <button class="back-btn" @click="goBack">
        Tilbake til programmet
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%; max-width: 520px; margin: 0 auto;
  padding: 40px 16px 110px;
  min-height: 100vh; min-height: 100dvh;
  display: flex; align-items: center;
}

.content {
  width: 100%; display: flex; flex-direction: column;
  align-items: center; text-align: center; gap: 16px;
}

/* Checkmark animation */
.check-wrap { margin-bottom: 8px; }
.check-circle {
  width: 80px; height: 80px; border-radius: 999px;
  background: rgba(190,242,1,0.12);
  display: grid; place-items: center;
  animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.check-mark {
  font-size: 40px; font-weight: 900; color: #BEF201;
}

@keyframes pop {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.heading {
  margin: 0; font-size: 28px; font-weight: 900;
  letter-spacing: -0.02em; color: #FFFFFF;
}
.sub {
  margin: 0; font-size: 15px; font-weight: 600;
  color: rgba(209,231,229,0.6);
}

/* Feeling */
.feeling-section {
  width: 100%; margin-top: 8px;
}
.feeling-label {
  margin: 0 0 12px; font-size: 14px; font-weight: 800;
  color: rgba(209,231,229,0.6);
}
.feeling-grid {
  display: flex; gap: 8px; justify-content: center;
}
.feeling-btn {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 12px 10px; border-radius: 14px;
  border: 2px solid rgba(209,231,229,0.08);
  background: #023238; cursor: pointer;
  transition: all 0.15s; min-width: 56px;
}
.feeling-btn:active { transform: scale(0.95); }
.feeling-btn.selected {
  border-color: #BEF201;
  background: rgba(190,242,1,0.1);
}
.feeling-emoji { font-size: 28px; line-height: 1; }
.feeling-text {
  font-size: 11px; font-weight: 800;
  color: rgba(209,231,229,0.5);
}
.feeling-btn.selected .feeling-text { color: #BEF201; }

/* Buttons */
.primary {
  width: 100%; height: 52px; border: none; border-radius: 16px;
  background: #BEF201; color: #023238; font-size: 16px; font-weight: 900;
  cursor: pointer; margin-top: 8px;
}
.primary:disabled { opacity: 0.4; cursor: not-allowed; }

.back-btn {
  border: none; background: none;
  font-size: 14px; font-weight: 800;
  color: rgba(209,231,229,0.5); cursor: pointer;
}
</style>
