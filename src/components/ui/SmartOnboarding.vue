<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "@/stores/authStore"

const auth = useAuthStore()
const emit = defineEmits<{ (e: "done"): void; (e: "later"): void }>()

type Step = "ask" | "choose"

const step = ref<Step>("ask")
const selected = ref<string[]>([])

const IMPROVEMENTS = [
  { key: "mindre_smerter", label: "Mindre smerter", desc: "Rygg, nakke, hodepine" },
  { key: "mer_energi", label: "Mer energi", desc: "Orke mer i hverdagen" },
  { key: "bedre_sovn", label: "Bedre søvn", desc: "Sove dypere, våkne uthvilt" },
  { key: "mindre_stress", label: "Mindre stress", desc: "Finne ro i hverdagen" },
  { key: "komme_i_gang", label: "Komme i gang", desc: "Bygge en bevegelsevane" },
]

function toggle(key: string) {
  const idx = selected.value.indexOf(key)
  if (idx >= 0) {
    selected.value.splice(idx, 1)
  } else if (selected.value.length < 2) {
    selected.value.push(key)
  }
}

async function finish() {
  // Mapp valg til healthChallenge og biggestStruggle
  const challenge = selected.value.includes("mindre_smerter") ? "rygg" : "ingen"
  const struggle = selected.value.find(s => s !== "mindre_smerter") ?? selected.value[0] ?? "ingen"

  // Mapp til DB-verdier
  const struggleMap: Record<string, string> = {
    mer_energi: "motivasjon",
    bedre_sovn: "sovn",
    mindre_stress: "stress",
    komme_i_gang: "motivasjon",
    mindre_smerter: "smerter",
  }

  try {
    await auth.updateProfile({
      healthChallenge: challenge,
      biggestStruggle: struggleMap[struggle] ?? "ingen",
      motivation: selected.value[0] ?? "mer_energi",
    })
  } catch { /* non-critical */ }

  emit("done")
}
</script>

<template>
  <div class="overlay">
    <div class="card">
      <!-- Steg 1: Spør om de vil tilpasse -->
      <div v-if="step === 'ask'" class="step-content">
        <div class="spark">✨</div>
        <h2 class="heading">Vil du at vi tilpasser litt mer til deg?</h2>
        <p class="body">Ett spørsmål — så blir tipsene dine mer relevante.</p>
        <button class="primary" @click="step = 'choose'">Ja, gjerne</button>
        <button class="ghost" @click="$emit('later')">Senere</button>
      </div>

      <!-- Steg 2: Velg forbedring -->
      <div v-else class="step-content">
        <h2 class="heading">Hva vil du forbedre mest akkurat nå?</h2>
        <p class="body">Velg 1–2</p>

        <div class="improve-grid">
          <button
            v-for="item in IMPROVEMENTS"
            :key="item.key"
            class="improve-btn"
            :class="{ active: selected.includes(item.key) }"
            @click="toggle(item.key)"
          >
            <div class="improve-label">{{ item.label }}</div>
            <div class="improve-desc">{{ item.desc }}</div>
          </button>
        </div>

        <button class="primary" :disabled="selected.length === 0" @click="finish">Ferdig</button>
        <button class="ghost" @click="step = 'ask'">Tilbake</button>
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
.spark { font-size: 40px; margin-bottom: 4px; }
.heading { margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF; }
.body { margin: 0; font-size: 15px; font-weight: 600; color: rgba(209, 231, 229, 0.6); line-height: 1.5; }

.improve-grid { width: 100%; display: flex; flex-direction: column; gap: 8px; margin: 8px 0; }
.improve-btn {
  width: 100%; padding: 14px 16px; border-radius: 16px;
  border: 2px solid rgba(209, 231, 229, 0.1); background: #034044;
  text-align: left; cursor: pointer; transition: all 0.15s;
}
.improve-btn:active { transform: scale(0.98); }
.improve-btn.active {
  background: rgba(190, 242, 1, 0.1);
  border-color: #BEF201;
}
.improve-label { font-size: 16px; font-weight: 900; color: #FFFFFF; }
.improve-btn.active .improve-label { color: #BEF201; }
.improve-desc { font-size: 13px; font-weight: 600; color: rgba(209, 231, 229, 0.5); margin-top: 2px; }

.primary {
  width: 100%; height: 52px; border: none; border-radius: 16px;
  background: #BEF201; color: #023238; font-size: 16px; font-weight: 900;
  cursor: pointer; margin-top: 8px;
}
.primary:disabled { opacity: 0.4; cursor: not-allowed; }
.ghost { border: none; background: transparent; color: rgba(209, 231, 229, 0.5); font-weight: 800; cursor: pointer; margin-top: 4px; font-size: 15px; }
</style>
