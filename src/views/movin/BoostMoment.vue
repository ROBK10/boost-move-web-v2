<template>
  <div class="p-6 pt-10 min-h-full flex flex-col bg-zinc-50 pb-32 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-100/20 blur-[100px] rounded-full pointer-events-none" />
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-zinc-200/20 blur-[100px] rounded-full pointer-events-none" />

    <header class="mb-8 relative z-10">
      <h1 class="text-3xl font-bold tracking-tight text-zinc-900">Boost Moment</h1>
      <p class="text-zinc-500 text-sm font-medium mt-1">Lad opp dagen din</p>
    </header>

    <div class="flex-1 flex flex-col gap-6 relative z-10">
      <div class="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 flex items-center justify-between">
        <div>
          <div class="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Daglige Boost</div>
          <div class="text-4xl font-bold text-zinc-900 flex items-center gap-2 tracking-tighter">
            {{ streak }} <span class="text-emerald-500 text-2xl">⚡</span>
          </div>
        </div>
        <div class="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
          <span class="text-emerald-600 text-xl">🏆</span>
        </div>
      </div>

      <div class="flex-1">
        <transition-group name="fade" tag="div">
          <div v-if="step === 'energy'" key="energy" class="bg-white rounded-[32px] p-8 shadow-lg shadow-zinc-200/50 border border-zinc-100 flex flex-col justify-between min-h-[400px]">
            <div class="space-y-8">
              <div class="flex items-center gap-3 mb-4">
                <span class="p-3 bg-zinc-900 text-white rounded-2xl">⚡</span>
                <h2 class="text-xl font-bold text-zinc-900">Energisjekk</h2>
              </div>

              <div>
                <p class="text-lg font-medium text-zinc-600 mb-6 leading-relaxed">Hvordan er energien din akkurat nå?</p>

                <div class="relative h-64 flex items-end justify-center gap-2 px-2 w-full">
                  <button v-for="level in levels" :key="level" @click="setEnergy(level)"
                    :class="['w-full rounded-t-xl transition-all duration-300 relative group', level <= energy ? 'bg-zinc-900' : 'bg-zinc-100 hover:bg-zinc-200']"
                    :style="{ height: (level * 10) + '%' }"
                  >
                    <div v-if="level === energy" class="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-bold py-1 px-2 rounded-lg whitespace-nowrap">{{ level }} / 10</div>
                  </button>
                </div>

                <div class="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest mt-4">
                  <span>Lav</span>
                  <span>Høy</span>
                </div>
              </div>
            </div>

            <button @click="step = 'action'" class="w-full bg-zinc-900 text-white h-16 rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-xl shadow-zinc-200 mt-8">
              Dagens mikro-handling
              <span class="ml-2">→</span>
            </button>
          </div>

          <div v-else-if="step === 'action'" key="action" class="bg-zinc-900 rounded-[32px] p-8 shadow-xl shadow-zinc-900/20 border border-zinc-800 flex flex-col justify-between min-h-[400px] text-white relative overflow-hidden">
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                  <span class="p-3 bg-white/10 text-white rounded-2xl backdrop-blur-md">▶️</span>
                  <h2 class="text-xl font-bold">Mikro-handling</h2>
                </div>
                <button @click="refreshAction" class="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">🔁</button>
              </div>

              <div class="py-10 text-center">
                <p class="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Din oppgave</p>
                <h3 class="text-3xl font-bold leading-tight md:text-4xl">{{ action }}</h3>
              </div>
            </div>

            <button @click="handleComplete" class="w-full bg-white text-zinc-900 h-16 rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors shadow-lg relative z-10">Ferdig</button>
          </div>

          <div v-else key="done" class="bg-emerald-50 rounded-[32px] p-8 shadow-lg shadow-emerald-100 border border-emerald-100 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div class="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 text-4xl">✓</div>
            <h2 class="text-2xl font-bold text-zinc-900 mb-2">Bra jobbet!</h2>
            <p class="text-zinc-600 font-medium max-w-[200px] mx-auto">Du har fullført dagens boost og investert i din helse.</p>

            <div class="mt-8 flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-100/50 px-4 py-2 rounded-full">
              <span class="text-emerald-700">⚡</span>
              {{ streak }} Dager streak
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/appStore' // <-- viktig: riktig path fra views/movin

const appStore = useAppStore()

const MICRO_ACTIONS = [
  'Ta 3 dype pust',
  'Strekk armene over hodet',
  'Drikk et glass vann',
  'Se bort fra skjermen i 20 sekunder',
  'Reis deg og rist løs',
  'Send en hyggelig melding',
  'Rull skuldrene 5 ganger',
  'Gjør 5 knebøy'
]

const step = ref('energy')
const energy = ref(5)
const action = ref(MICRO_ACTIONS[0])

// ✅ streak kommer fra store (og er alltid oppdatert)
const streak = computed(() => appStore.boostStreak)

const levels = Array.from({ length: 10 }, (_, i) => i + 1)

function setEnergy(v) {
  energy.value = v
}

function handleComplete() {
  step.value = 'done'
  // ✅ dette oppdaterer streak på riktig måte (unike dager + localStorage)
  appStore.completeBoostToday()
}

function refreshAction() {
  const idx = Math.floor(Math.random() * MICRO_ACTIONS.length)
  action.value = MICRO_ACTIONS[idx]
}
</script>


<style scoped>
.fade-enter-active, .fade-leave-active { transition: all .25s ease; }
.fade-enter-from { opacity: 0; transform: translateY(8px) scale(.99); }
.fade-enter-to { opacity: 1; transform: translateY(0) scale(1); }
.fade-leave-from { opacity: 1; transform: translateY(0) scale(1); }
.fade-leave-to { opacity: 0; transform: translateY(-8px) scale(.99); }
</style>
