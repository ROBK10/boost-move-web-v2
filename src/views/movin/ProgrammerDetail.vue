<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { findProgramById } from "@/data/programmerContent"

const route = useRoute()
const router = useRouter()

const id = computed(() => String(route.params.id || ""))
const item = computed(() => findProgramById(id.value))

const index = ref(0)

watch(
  () => id.value,
  () => {
    index.value = 0
    loadAnswers()
  }
)

const total = computed(() => item.value?.sections.length ?? 0)
const isEmpty = computed(() => total.value === 0)
const isFirst = computed(() => index.value <= 0)
const isLast = computed(() => total.value > 0 && index.value >= total.value - 1)

const section = computed(() => {
  if (!item.value) return null
  if (item.value.sections.length === 0) return null
  return item.value.sections[index.value] ?? null
})

// ── Reflection answers ──────────────────────────────────────────
const r1 = ref("")
const r2 = ref("")
const r3 = ref("")

const storageKey = computed(() => `reflect-${id.value}-${index.value}`)

function loadAnswers() {
  try {
    const saved = localStorage.getItem(storageKey.value)
    if (saved) {
      const parsed = JSON.parse(saved)
      r1.value = parsed.r1 ?? ""
      r2.value = parsed.r2 ?? ""
      r3.value = parsed.r3 ?? ""
      return
    }
  } catch {}
  r1.value = ""
  r2.value = ""
  r3.value = ""
}

watch(index, () => loadAnswers(), { immediate: true })

function saveAnswers() {
  try {
    localStorage.setItem(storageKey.value, JSON.stringify({ r1: r1.value, r2: r2.value, r3: r3.value }))
  } catch {}
}

// ── Suggestions ─────────────────────────────────────────────────
const suggestions = ["Treningsvaner", "Søvn", "Stress", "Kosthold", "Fokus"]

function applySuggestion(s: string) {
  r1.value = s
}

// ── Completion ──────────────────────────────────────────────────
const completed = ref(false)

function goBack() {
  router.push("/movin/programmer")
}

function prev() {
  if (isFirst.value) return
  saveAnswers()
  index.value -= 1
}

function next() {
  if (isLast.value) return
  saveAnswers()
  index.value += 1
}

function complete() {
  saveAnswers()
  completed.value = true
  setTimeout(() => {
    router.push("/movin/programmer")
  }, 1600)
}
</script>

<template>
  <div class="page" v-if="item">
    <div class="container">
      <header class="top">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>

        <div class="progress" v-if="!isEmpty">
          <span class="progressText">Dag {{ index + 1 }} av {{ total }}</span>
        </div>
      </header>

      <h1 class="title">{{ item.title }}</h1>
      <p v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</p>

      <main class="content">
        <div v-if="isEmpty" class="empty">
          Innhold kommer snart.
        </div>

        <template v-else-if="section">
          <!-- Program content -->
          <section class="section">
            <h2 class="h2">{{ section.h }}</h2>
            <p class="p">{{ section.p }}</p>
          </section>

          <!-- Reflection inputs -->
          <section class="reflectSection">
            <p class="reflectTitle">Skriv her:</p>

            <div class="reflectField">
              <label class="reflectLabel">Hva vil du endre?</label>
              <div class="suggestRow" aria-label="Forslag">
                <span class="suggestHint">Forslag:</span>
                <button
                  v-for="s in suggestions"
                  :key="s"
                  class="chip"
                  type="button"
                  @click="applySuggestion(s)"
                  :class="{ 'chip--active': r1 === s }"
                >{{ s }}</button>
              </div>
              <textarea
                v-model="r1"
                class="textarea"
                rows="3"
                placeholder="Skriv dine tanker her…"
              />
            </div>

            <div class="reflectField">
              <label class="reflectLabel">Hvorfor vil du gjøre det?</label>
              <textarea
                v-model="r2"
                class="textarea"
                rows="3"
                placeholder="Skriv dine tanker her…"
              />
            </div>

            <div class="reflectField">
              <label class="reflectLabel">Jeg velger å:</label>
              <textarea
                v-model="r3"
                class="textarea"
                rows="3"
                placeholder="Skriv dine tanker her…"
              />
            </div>
          </section>
        </template>
      </main>

      <!-- Partner credit -->
      <footer class="credit">
        Program utviklet i samarbeid med Skap Flyt
      </footer>

      <div class="bottom" v-if="!isEmpty">
        <button class="navBtn" type="button" @click="prev" :disabled="isFirst">
          Forrige
        </button>

        <button v-if="!isLast" class="primary" type="button" @click="next">
          Neste
          <span class="arrow" aria-hidden="true"></span>
        </button>

        <button v-else-if="!completed" class="complete" type="button" @click="complete">
          COMPLETE
        </button>

        <div v-else class="confirmMsg" aria-live="polite">
          Dag {{ index + 1 }} fullført
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container">
    <p>Fant ikke innholdet.</p>
    <button class="complete" type="button" @click="goBack">Tilbake</button>
  </div>
</template>

<style scoped>
.page { width: 100%; }
.container { max-width: 520px; margin: 0 auto; padding: 18px 16px 140px; }

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.progress {
  background: rgba(17, 24, 39, 0.06);
  padding: 8px 14px;
  border-radius: 999px;
}

.progressText {
  font-size: 13px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.55);
  letter-spacing: -0.01em;
}

.title {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.subtitle {
  margin: 10px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

.content {
  margin-top: 18px;
  background: white;
  border-radius: 28px;
  padding: 20px 18px;
  box-shadow: 0 12px 36px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section { display: flex; flex-direction: column; gap: 12px; }

.h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.92);
  letter-spacing: -0.02em;
}

.p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 650;
  color: rgba(17, 24, 39, 0.70);
}

.empty {
  font-size: 14px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.45);
}

/* Reflection section */
.reflectSection {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 4px;
  border-top: 1px solid rgba(17, 24, 39, 0.07);
}

.reflectTitle {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.45);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.reflectField {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reflectLabel {
  font-size: 14px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.80);
}

.textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid rgba(17, 24, 39, 0.10);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.88);
  background: rgba(17, 24, 39, 0.025);
  resize: none;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 140ms ease, box-shadow 140ms ease;
  -webkit-appearance: none;
}

.textarea::placeholder {
  color: rgba(17, 24, 39, 0.28);
  font-weight: 500;
}

.textarea:focus {
  outline: none;
  border-color: rgba(17, 24, 39, 0.28);
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
}

/* Suggestion chips */
.suggestRow {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.suggestHint {
  font-size: 12px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.38);
  flex-shrink: 0;
}

.chip {
  border: 1.5px solid rgba(17, 24, 39, 0.12);
  background: rgba(17, 24, 39, 0.03);
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.65);
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
  white-space: nowrap;
}

.chip:active,
.chip--active {
  background: rgba(17, 24, 39, 0.08);
  border-color: rgba(17, 24, 39, 0.28);
  color: rgba(17, 24, 39, 0.90);
}

/* Partner credit */
.credit {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.28);
  letter-spacing: 0.01em;
  padding: 0 16px;
}

/* Bottom bar */
.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 86px;
  padding: 0 16px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.navBtn {
  flex: 1;
  height: 58px;
  border: none;
  border-radius: 18px;
  background: rgba(17, 24, 39, 0.06);
  color: rgba(17, 24, 39, 0.85);
  font-weight: 900;
  cursor: pointer;
}

.navBtn:disabled { opacity: 0.45; cursor: default; }

.primary {
  flex: 1;
  height: 58px;
  border: none;
  border-radius: 18px;
  background: #0b0f17;
  color: white;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.complete {
  flex: 1;
  height: 58px;
  border: none;
  border-radius: 18px;
  background: rgba(185, 255, 0, 0.95);
  color: #111827;
  font-weight: 900;
  font-size: 15px;
  letter-spacing: 0.04em;
  cursor: pointer;
}

.confirmMsg {
  flex: 1;
  height: 58px;
  border-radius: 18px;
  background: rgba(185, 255, 0, 0.15);
  color: rgba(17, 24, 39, 0.80);
  font-weight: 900;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(185, 255, 0, 0.40);
}

.arrow {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(255, 255, 255, 0.85);
  border-top: 2px solid rgba(255, 255, 255, 0.85);
  transform: rotate(45deg);
}
</style>
