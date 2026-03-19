<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/services/api'
import type { Equipment } from '@/data/exerciseBank'

const router = useRouter()
const emit = defineEmits<{ (e: 'done'): void }>()
const instance = getCurrentInstance()
const hasParentListener = !!instance?.vnode.props?.onDone

const step = ref(1)
const saving = ref(false)

// Svar
const workType = ref<'sedentary' | 'standing' | 'heavy' | null>(null)
const cardioLevel = ref<'low' | 'medium' | 'high' | null>(null)
const strengthLevel = ref<'low' | 'medium' | 'high' | null>(null)
const selectedEquipment = ref<Equipment[]>(['bodyweight'])
const sessionDuration = ref<10 | 25 | 50>(25)

function selectWorkType(val: 'sedentary' | 'standing' | 'heavy') {
  workType.value = val
  step.value = 2
}

function selectCardio(val: 'low' | 'medium' | 'high') {
  cardioLevel.value = val
  step.value = 3
}

function selectStrength(val: 'low' | 'medium' | 'high') {
  strengthLevel.value = val
  step.value = 4
}

function toggleEquipment(eq: Equipment) {
  if (eq === 'bodyweight') return // alltid med
  const idx = selectedEquipment.value.indexOf(eq)
  if (idx >= 0) {
    selectedEquipment.value.splice(idx, 1)
  } else {
    selectedEquipment.value.push(eq)
  }
}

function confirmEquipment() {
  step.value = 5
}

function selectDuration(val: 10 | 25 | 50) {
  sessionDuration.value = val
}

async function finish() {
  if (saving.value) return
  saving.value = true
  try {
    await apiFetch('/trainer/profile', {
      method: 'POST',
      body: JSON.stringify({
        workType: workType.value,
        cardioLevel: cardioLevel.value,
        strengthLevel: strengthLevel.value,
        equipment: selectedEquipment.value,
        sessionDuration: sessionDuration.value,
      }),
    })
    if (hasParentListener) {
      emit('done')
    } else {
      router.replace('/movin/trening')
    }
  } catch {
    if (hasParentListener) {
      emit('done')
    } else {
      router.replace('/movin/trening')
    }
  } finally {
    saving.value = false
  }
}

function goBack() {
  if (step.value > 1) step.value--
}
</script>

<template>
  <div class="overlay">
    <div class="card">
      <!-- Progress dots -->
      <div class="dots">
        <span v-for="i in 5" :key="i" class="dot" :class="{ active: i === step, done: i < step }"></span>
      </div>

      <button v-if="step > 1" class="back-btn" type="button" @click="goBack">
        <span class="back-arrow"></span> Tilbake
      </button>

      <!-- Steg 1: Arbeidstype -->
      <div v-if="step === 1" class="step-content">
        <h2 class="heading">Hva beskriver arbeidsdagen din best?</h2>
        <p class="body">Vi tilpasser programmet etter din arbeidssituasjon.</p>
        <div class="option-grid">
          <button class="option-btn" @click="selectWorkType('sedentary')">
            <div class="option-label">Stillesittende</div>
            <div class="option-desc">Kontor, dataarbeid, bil/transport</div>
          </button>
          <button class="option-btn" @click="selectWorkType('standing')">
            <div class="option-label">Stående/gående</div>
            <div class="option-desc">Butikk, pleie, renhold, produksjon</div>
          </button>
          <button class="option-btn" @click="selectWorkType('heavy')">
            <div class="option-label">Tungt fysisk arbeid</div>
            <div class="option-desc">Bygg, lager, løfting, helse</div>
          </button>
        </div>
      </div>

      <!-- Steg 2: Kondisjon -->
      <div v-else-if="step === 2" class="step-content">
        <h2 class="heading">Hvordan er kondisjonen din?</h2>
        <p class="body">Vær ærlig — det er kun for å tilpasse programmet.</p>
        <div class="option-grid">
          <button class="option-btn" @click="selectCardio('low')">
            <div class="option-label">Lav</div>
            <div class="option-desc">Blir fort andpusten</div>
          </button>
          <button class="option-btn" @click="selectCardio('medium')">
            <div class="option-label">Middels</div>
            <div class="option-desc">Klarer 20 min rolig løping</div>
          </button>
          <button class="option-btn" @click="selectCardio('high')">
            <div class="option-label">God</div>
            <div class="option-desc">Trener regelmessig</div>
          </button>
        </div>
      </div>

      <!-- Steg 3: Styrke -->
      <div v-else-if="step === 3" class="step-content">
        <h2 class="heading">Hvordan er styrken din?</h2>
        <div class="option-grid">
          <button class="option-btn" @click="selectStrength('low')">
            <div class="option-label">Lav</div>
            <div class="option-desc">Trener lite styrke</div>
          </button>
          <button class="option-btn" @click="selectStrength('medium')">
            <div class="option-label">Middels</div>
            <div class="option-desc">Noe styrketrening</div>
          </button>
          <button class="option-btn" @click="selectStrength('high')">
            <div class="option-label">God</div>
            <div class="option-desc">Styrketrener regelmessig</div>
          </button>
        </div>
      </div>

      <!-- Steg 4: Utstyr -->
      <div v-else-if="step === 4" class="step-content">
        <h2 class="heading">Tilgjengelig utstyr?</h2>
        <p class="body">Velg alt du har tilgang til. Kroppsvekt er alltid med.</p>
        <div class="option-grid">
          <button
            class="option-btn"
            :class="{ selected: true }"
            disabled
          >
            <div class="option-label">Kroppsvekt</div>
            <div class="option-desc">Alltid tilgjengelig</div>
          </button>
          <button
            class="option-btn"
            :class="{ selected: selectedEquipment.includes('band') }"
            @click="toggleEquipment('band')"
          >
            <div class="option-label">Strikk / elastikk</div>
            <div class="option-desc">Treningsstrikk</div>
          </button>
          <button
            class="option-btn"
            :class="{ selected: selectedEquipment.includes('dumbbells') }"
            @click="toggleEquipment('dumbbells')"
          >
            <div class="option-label">Manualer / vekter</div>
            <div class="option-desc">Håndvekter</div>
          </button>
          <button
            class="option-btn"
            :class="{ selected: selectedEquipment.includes('gym') }"
            @click="toggleEquipment('gym')"
          >
            <div class="option-label">Treningssenter</div>
            <div class="option-desc">Apparater og vekter</div>
          </button>
        </div>
        <button class="primary" @click="confirmEquipment">Neste</button>
      </div>

      <!-- Steg 5: Varighet -->
      <div v-else-if="step === 5" class="step-content">
        <h2 class="heading">Tid per økt?</h2>
        <p class="body">Du kan alltid endre dette senere.</p>
        <div class="duration-grid">
          <button
            v-for="d in [10, 25, 50] as const"
            :key="d"
            class="duration-btn"
            :class="{ selected: sessionDuration === d }"
            @click="selectDuration(d)"
          >
            <div class="duration-num">{{ d }}</div>
            <div class="duration-unit">min</div>
          </button>
        </div>
        <button class="primary" :disabled="saving" @click="finish">
          {{ saving ? 'Lagrer...' : 'Start programmet' }}
        </button>
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

.dots {
  display: flex; gap: 6px; justify-content: center; margin-bottom: 20px;
}
.dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: rgba(209,231,229,0.15);
  transition: all 0.2s;
}
.dot.active { background: #BEF201; width: 24px; }
.dot.done { background: rgba(190,242,1,0.4); }

.back-btn {
  border: none; background: none; color: rgba(209,231,229,0.5);
  font-size: 13px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 6px; margin-bottom: 12px;
}
.back-arrow {
  width: 7px; height: 7px;
  border-left: 2px solid rgba(209,231,229,0.5);
  border-bottom: 2px solid rgba(209,231,229,0.5);
  transform: rotate(45deg);
}

.step-content {
  display: flex; flex-direction: column; gap: 12px;
}

.heading {
  margin: 0; font-size: 22px; font-weight: 900;
  letter-spacing: -0.02em; color: #FFFFFF;
}
.body {
  margin: 0; font-size: 14px; font-weight: 600;
  color: rgba(209,231,229,0.6); line-height: 1.5;
}

.option-grid {
  display: flex; flex-direction: column; gap: 10px; margin-top: 4px;
}
.option-btn {
  width: 100%; padding: 16px; border-radius: 16px;
  border: 2px solid rgba(209,231,229,0.1); background: #034044;
  text-align: left; cursor: pointer; transition: all 0.15s;
}
.option-btn:active { transform: scale(0.98); }
.option-btn:hover { border-color: rgba(190,242,1,0.3); }
.option-btn.selected {
  border-color: #BEF201;
  background: rgba(190,242,1,0.1);
}
.option-btn:disabled {
  opacity: 0.7; cursor: default;
}
.option-btn:disabled.selected {
  opacity: 1;
}
.option-label { font-size: 16px; font-weight: 900; color: #FFFFFF; }
.option-desc { font-size: 13px; font-weight: 600; color: rgba(209,231,229,0.5); margin-top: 2px; }

.duration-grid {
  display: flex; gap: 12px; margin-top: 4px;
}
.duration-btn {
  flex: 1; padding: 20px 12px; border-radius: 16px;
  border: 2px solid rgba(209,231,229,0.1); background: #034044;
  text-align: center; cursor: pointer; transition: all 0.15s;
}
.duration-btn:active { transform: scale(0.97); }
.duration-btn.selected {
  border-color: #BEF201;
  background: rgba(190,242,1,0.1);
}
.duration-num {
  font-size: 32px; font-weight: 900; color: #FFFFFF; line-height: 1;
}
.duration-btn.selected .duration-num { color: #BEF201; }
.duration-unit {
  font-size: 13px; font-weight: 700; color: rgba(209,231,229,0.5); margin-top: 4px;
}

.primary {
  width: 100%; height: 52px; border: none; border-radius: 16px;
  background: #BEF201; color: #023238; font-size: 16px; font-weight: 900;
  cursor: pointer; margin-top: 8px;
}
.primary:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
