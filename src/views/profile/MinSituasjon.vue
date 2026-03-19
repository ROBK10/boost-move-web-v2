<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

const router = useRouter()
const auth = useAuthStore()
const saving = ref(false)
const saved = ref(false)

const healthChallenge = ref("ingen")
const biggestStruggle = ref("ingen")
const motivation = ref("mer_energi")

const CHALLENGES = [
  { key: "rygg", label: "Rygg" },
  { key: "nakke", label: "Nakke/skuldre" },
  { key: "hodepine", label: "Hodepine" },
  { key: "ingen", label: "Ingen plager" },
]

const STRUGGLES = [
  { key: "stress", label: "Stress", desc: "For mye å gjøre, lite ro" },
  { key: "sovn", label: "Søvn", desc: "Sover for lite eller dårlig" },
  { key: "motivasjon", label: "Motivasjon", desc: "Vanskelig å komme i gang" },
  { key: "smerter", label: "Smerter", desc: "Fysiske plager i hverdagen" },
  { key: "ingen", label: "Ingen spesiell", desc: "Har det bra" },
]

const MOTIVATIONS = [
  { key: "mer_energi", label: "Mer energi", desc: "Orke mer i hverdagen" },
  { key: "mindre_smerter", label: "Mindre smerter", desc: "Bli kvitt plager" },
  { key: "bedre_humor", label: "Bedre humør", desc: "Føle meg gladere" },
  { key: "se_barn_vokse_opp", label: "Leve lenger", desc: "Være der for de jeg er glad i" },
]

onMounted(() => {
  healthChallenge.value = auth.user?.healthChallenge ?? "ingen"
  biggestStruggle.value = auth.user?.biggestStruggle ?? "ingen"
  motivation.value = auth.user?.motivation ?? "mer_energi"
})

async function save() {
  saving.value = true
  try {
    await auth.updateProfile({
      healthChallenge: healthChallenge.value,
      biggestStruggle: biggestStruggle.value,
      motivation: motivation.value,
    })
    saved.value = true
    setTimeout(() => { router.push("/profil") }, 800)
  } catch { /* ignore */ }
  saving.value = false
}

function goBack() { router.push("/profil") }
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="head">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>
        <h1 class="title">Min situasjon</h1>
      </header>

      <p class="intro">Hjelp oss å gi deg bedre tips. Du kan endre dette når som helst.</p>

      <!-- Fysiske plager -->
      <section class="section">
        <div class="section-label">Har du fysiske plager?</div>
        <div class="option-grid">
          <button
            v-for="c in CHALLENGES"
            :key="c.key"
            class="opt"
            :class="{ active: healthChallenge === c.key }"
            @click="healthChallenge = c.key"
          >{{ c.label }}</button>
        </div>
      </section>

      <!-- Største utfordring -->
      <section class="section">
        <div class="section-label">Din største utfordring?</div>
        <div class="option-list">
          <button
            v-for="s in STRUGGLES"
            :key="s.key"
            class="opt-row"
            :class="{ active: biggestStruggle === s.key }"
            @click="biggestStruggle = s.key"
          >
            <div class="opt-title">{{ s.label }}</div>
            <div class="opt-desc">{{ s.desc }}</div>
          </button>
        </div>
      </section>

      <!-- Motivasjon -->
      <section class="section">
        <div class="section-label">Hva motiverer deg?</div>
        <div class="option-list">
          <button
            v-for="m in MOTIVATIONS"
            :key="m.key"
            class="opt-row"
            :class="{ active: motivation === m.key }"
            @click="motivation = m.key"
          >
            <div class="opt-title">{{ m.label }}</div>
            <div class="opt-desc">{{ m.desc }}</div>
          </button>
        </div>
      </section>

      <button class="save-btn" :disabled="saving" @click="save">
        {{ saved ? '✓ Lagret' : saving ? 'Lagrer…' : 'Lagre endringer' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }
.container { max-width: 520px; margin: 0 auto; padding: 18px 16px 110px; }

.head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.back { width: 42px; height: 42px; border: none; background: #023238; border-radius: 999px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); cursor: pointer; display: grid; place-items: center; }
.chev { width: 12px; height: 12px; border-left: 2px solid rgba(209,231,229,0.5); border-bottom: 2px solid rgba(209,231,229,0.5); transform: rotate(45deg); }
.title { margin: 0; font-size: 28px; font-weight: 900; color: #FFFFFF; }

.intro { margin: 0 0 24px; font-size: 15px; font-weight: 600; color: rgba(209,231,229,0.5); line-height: 1.5; }

.section { margin-bottom: 24px; }
.section-label { font-size: 16px; font-weight: 900; color: #D1E7E5; margin-bottom: 10px; }

.option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.opt {
  padding: 14px; border-radius: 14px;
  border: 2px solid rgba(209,231,229,0.1); background: #034044;
  font-size: 15px; font-weight: 800; color: #D1E7E5;
  cursor: pointer; transition: all 0.15s; text-align: center;
}
.opt.active { background: rgba(190,242,1,0.1); border-color: #BEF201; color: #BEF201; }

.option-list { display: flex; flex-direction: column; gap: 8px; }
.opt-row {
  width: 100%; padding: 14px 16px; border-radius: 14px;
  border: 2px solid rgba(209,231,229,0.1); background: #034044;
  text-align: left; cursor: pointer; transition: all 0.15s;
}
.opt-row.active { background: rgba(190,242,1,0.1); border-color: #BEF201; }
.opt-title { font-size: 16px; font-weight: 900; color: #D1E7E5; }
.opt-row.active .opt-title { color: #BEF201; }
.opt-desc { font-size: 13px; font-weight: 600; color: rgba(209,231,229,0.4); margin-top: 2px; }

.save-btn {
  width: 100%; height: 52px; border: none; border-radius: 16px;
  background: #BEF201; color: #023238; font-size: 16px; font-weight: 900;
  cursor: pointer; margin-top: 8px;
}
.save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
